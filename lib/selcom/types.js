/** Normalize Selcom's textual payment_status into our PaymentStatus enum. */
export function mapSelcomStatus(value) {
  switch (String(value ?? "").toUpperCase()) {
    case "COMPLETED":
    case "PAID":
    case "SUCCESS":
      return "PAID";
    case "PROCESSING":
    case "INPROGRESS":
    case "IN_PROGRESS":
      return "PROCESSING";
    case "CANCELLED":
    case "CANCELED":
      return "CANCELLED";
    case "FAILED":
    case "REJECTED":
    case "USERCANCELLED":
      return "FAILED";
    default:
      return "PENDING";
  }
}

/**
 * Map our PaymentMethod enum to Selcom's `payment_methods` value for the
 * hosted checkout. CARD scopes the page to card entry; MOBILE_MONEY scopes it
 * to mobile money; UNSET offers everything (card + mobile money).
 */
export const SELCOM_METHOD_BY_TYPE = {
  CARD: "CARD",
  MOBILE_MONEY: "MOBILEMONEYPULL",
  UNSET: "ALL",
};
