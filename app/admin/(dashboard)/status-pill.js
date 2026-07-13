const TONES = {
  PAID: "bg-green-100 text-green-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-black/10 text-black/50",
  REFUNDED: "bg-blue-100 text-blue-700",
};

export default function StatusPill({ status }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase ${
        TONES[status] ?? "bg-black/10 text-black/50"
      }`}
    >
      {status}
    </span>
  );
}
