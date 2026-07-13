import crypto from "crypto";
import { airpayConfig } from "./config";

/**
 * Airpay request/response cryptography.
 *
 * Every payload is AES-256-CBC encrypted with a key derived from the merchant
 * username + password, and accompanied by a SHA-256 checksum over the payload
 * values. Three distinct secrets are in play, and they are easy to mix up:
 *
 *   transport key (`encdata`/`response`) = md5(username ~:~ password)
 *   privatekey (sent with the checkout)  = sha256(apiKey @ username :|: password)
 *   checksum                             = sha256(<values sorted by key> + YYYY-MM-DD)
 *
 * The date suffix on the checksum means a payload is only valid for the current
 * (UTC) day — matching Airpay's own reference kit, which uses toISOString().
 */

/** AES key for `encdata` (outbound) and `response` (inbound). 32 hex chars. */
export function transportKey() {
  return crypto
    .createHash("md5")
    .update(`${airpayConfig.username}~:~${airpayConfig.password}`, "utf8")
    .digest("hex");
}

/**
 * The `privatekey` field Airpay expects alongside the checkout form. Note the
 * salt here is the API key, NOT the client secret — swapping the two is silently
 * accepted by us and rejected by the gateway.
 */
export function privateKey() {
  return sha256(
    `${airpayConfig.apiKey}@${airpayConfig.username}:|:${airpayConfig.password}`,
  );
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

/** Today's date in the YYYY-MM-DD form Airpay folds into every checksum. */
export function checksumDate() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Checksum for the v1 (token + encdata) APIs: concatenate the payload values in
 * key-SORTED order, append today's date, then SHA-256.
 */
export function buildChecksum(data) {
  const joined = Object.keys(data)
    .sort()
    .map((key) => String(data[key]))
    .join("");
  return sha256(`${joined}${checksumDate()}`);
}

/**
 * Checksum for the legacy verify endpoint, which does NOT follow the v1 rule
 * above: the values go in a FIXED order (not sorted), and the digest is salted
 * with sha256(username~:~password). Verified empirically against the live
 * gateway — the sorted variant is rejected as "Wrong checksum".
 */
export function buildVerifyChecksum(orderedValues) {
  const salt = sha256(`${airpayConfig.username}~:~${airpayConfig.password}`);
  return sha256(`${salt}@${orderedValues.join("")}${checksumDate()}`);
}

/**
 * AES-256-CBC encrypt a payload. The 16-char hex IV is prefixed to the base64
 * ciphertext, which is how Airpay expects to receive it (and how it returns its
 * own responses).
 */
export function encryptPayload(data, key = transportKey()) {
  const iv = crypto.randomBytes(8).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(iv, "utf8"),
  );
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), "utf8"),
    cipher.final(),
  ]);
  return `${iv}${encrypted.toString("base64")}`;
}

/**
 * Decrypt an Airpay `response` blob.
 *
 * Primary convention (and the one `encryptPayload` mirrors): the first 16 chars
 * are the IV, the rest is base64 ciphertext. Airpay's own Node kit instead
 * derives the IV from sha256(blob), so we retry that way if the first attempt
 * fails — whichever convention the gateway actually used, one of the two works,
 * and a genuinely corrupt/forged blob fails both.
 */
export function decryptPayload(blob, key = transportKey()) {
  const raw = String(blob);
  const body = Buffer.from(raw.slice(16), "base64");
  const ivCandidates = [
    Buffer.from(raw.slice(0, 16), "utf8"),
    crypto.createHash("sha256").update(raw).digest().subarray(0, 16),
  ];

  let lastErr;
  for (const iv of ivCandidates) {
    try {
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(key, "utf8"),
        iv,
      );
      const decrypted = Buffer.concat([decipher.update(body), decipher.final()]);
      return JSON.parse(decrypted.toString("utf8"));
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Could not decrypt Airpay payload");
}

/** CRC-32 (IEEE 802.3 polynomial), the basis of Airpay's ap_SecureHash. */
export function crc32(value) {
  let crc = 0xffffffff;
  for (let i = 0; i < value.length; i++) {
    crc ^= value.charCodeAt(i) & 0xff;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Verify the `ap_SecureHash` Airpay returns with a transaction result.
 *
 * The hash is CRC32 over the result fields joined with ":" and salted with our
 * merchant id and username. CRC32 is not a MAC, so this alone would be weak —
 * but the payload carrying it is AES-encrypted with a key only we and Airpay
 * hold, so an attacker cannot produce a decryptable blob in the first place.
 * This check defends against a tampered-but-decryptable result.
 */
export function verifySecureHash(result) {
  if (!result.secureHash) return false;

  const base = [
    result.transactionId,
    result.apTransactionId,
    result.amount,
    result.status,
    result.message,
    airpayConfig.merchantId,
    airpayConfig.username,
  ];
  // UPI results append the customer VPA to the hashed data.
  if (result.chmod === "upi" && result.customerVpa) {
    base.push(result.customerVpa);
  }

  const expected = crc32(base.join(":"));
  return String(expected) === String(result.secureHash).trim();
}
