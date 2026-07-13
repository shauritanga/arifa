/** Normalize Airpay's TRANSACTIONSTATUS into our PaymentStatus enum. */
export function mapAirpayStatus(value) {
  const v = String(value ?? "")
    .trim()
    .toLowerCase();
  switch (v) {
    case "200":
    case "success":
    case "authorize":
    case "capture":
      return "PAID";
    case "processing":
    case "inprogress":
    case "in_progress":
      return "PROCESSING";
    case "cancel":
    case "cancelled":
    case "canceled":
    case "usercancelled":
      return "CANCELLED";
    case "400":
    case "401":
    case "402":
    case "failed":
    case "failure":
    case "rejected":
    case "declined":
      return "FAILED";
    default:
      return "PENDING";
  }
}

/** Airpay's `chmod`: which payment methods its checkout page should offer. */
export const CHMOD_BY_METHOD = {
  CARD: "pg",
  MOBILE_MONEY: "mmoney",
  UNSET: "", // let Airpay show every method enabled on the merchant account
};
