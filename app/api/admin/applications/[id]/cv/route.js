import { prisma } from "../../../../../../lib/prisma";
import { auth } from "../../../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stream an applicant's CV. Admin session required — CVs are personal data. */
export async function GET(request, { params }) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
    select: { cvData: true, cvName: true, cvType: true },
  });

  if (!application?.cvData) {
    return Response.json({ error: "No CV on this application" }, { status: 404 });
  }

  return new Response(application.cvData, {
    headers: {
      "content-type": application.cvType || "application/octet-stream",
      // `attachment` so a CV is downloaded rather than rendered in the browser.
      "content-disposition": `attachment; filename="${sanitize(application.cvName)}"`,
      "content-length": String(application.cvData.length),
    },
  });
}

/** Strip anything that could break out of the filename in the header. */
function sanitize(name) {
  return String(name || "cv").replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 100);
}
