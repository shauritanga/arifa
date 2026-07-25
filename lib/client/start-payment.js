"use client";

/**
 * Kick off a Selcom payment by redirecting the browser to its hosted checkout.
 *
 * Pass the pledge form's fields to start a new donation, or `{ reference }` to
 * retry an existing unpaid one.
 *
 * `endpoint` selects which server route prices and initiates the order — the
 * donation route by default, or the Masterclass / short-course ones, which
 * price the seat themselves. All answer with the same `{ checkoutUrl }`.
 */
export async function startPayment(payload, endpoint = "/api/selcom/initiate") {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Could not start payment. Please try again.");
  }

  const { checkoutUrl } = await res.json();
  if (!checkoutUrl) {
    throw new Error("Could not start payment. Please try again.");
  }

  window.location.href = checkoutUrl;
}
