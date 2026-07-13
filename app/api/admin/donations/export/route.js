import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUSES = ["PAID", "PROCESSING", "PENDING", "FAILED", "CANCELLED", "REFUNDED"];

const COLUMNS = [
  ["reference", (d) => d.reference],
  ["status", (d) => d.status],
  ["type", (d) => d.type],
  ["amount_tzs", (d) => d.amount],
  ["donor_name", (d) => d.donorName],
  ["email", (d) => d.email],
  ["phone", (d) => d.phone],
  ["organisation", (d) => d.organization ?? ""],
  ["package", (d) => d.packageName ?? ""],
  ["message", (d) => d.message ?? ""],
  ["airpay_txn", (d) => d.gatewayTransId ?? ""],
  ["created_at", (d) => d.createdAt.toISOString()],
  ["paid_at", (d) => (d.paidAt ? d.paidAt.toISOString() : "")],
];

/** Export the current donation filter as CSV. Admin session required. */
export async function GET(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = new URL(request.url).searchParams;
  const status = params.get("status");
  const q = (params.get("q") || "").trim();

  const donations = await prisma.donation.findMany({
    where: {
      ...(STATUSES.includes(status) ? { status } : {}),
      ...(q
        ? {
            OR: [
              { reference: { contains: q, mode: "insensitive" } },
              { donorName: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { organization: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    COLUMNS.map(([header]) => header).join(","),
    ...donations.map((d) => COLUMNS.map(([, get]) => csvCell(get(d))).join(",")),
  ];

  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(rows.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="arifa-donations-${stamp}.csv"`,
    },
  });
}

/**
 * Quote a CSV cell. The leading apostrophe on =, +, - and @ stops Excel and
 * Sheets treating donor-supplied text as a formula.
 */
function csvCell(value) {
  const s = String(value ?? "");
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}
