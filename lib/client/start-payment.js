"use client";

/**
 * Kick off an Airpay payment.
 *
 * Airpay has no checkout URL to navigate to: the gateway only accepts the
 * encrypted order as a form POST, so we build a hidden form from the fields the
 * server signed for us and submit it. Values are set as DOM properties, never
 * interpolated into HTML.
 *
 * Pass the pledge form's fields to start a new donation, or `{ reference }` to
 * retry an existing unpaid one.
 */
export async function startPayment(payload) {
  const res = await fetch("/api/airpay/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Could not start payment. Please try again.");
  }

  const { paymentUrl, fields } = await res.json();
  if (!paymentUrl || !fields) {
    throw new Error("Could not start payment. Please try again.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;
  form.style.display = "none";

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
