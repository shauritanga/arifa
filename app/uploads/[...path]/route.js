import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_TYPES = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

function notFound() {
  return new Response("Not found", { status: 404 });
}

export async function GET(_request, { params }) {
  const { path: parts = [] } = await params;
  if (
    !Array.isArray(parts) ||
    parts.length < 2 ||
    parts.some((part) => part === ".." || /[\\/]/.test(part))
  ) {
    return notFound();
  }

  const root = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(root, ...parts);
  if (!filePath.startsWith(`${root}${path.sep}`)) return notFound();

  const type = CONTENT_TYPES.get(path.extname(filePath).toLowerCase());
  if (!type) return notFound();

  try {
    const file = await readFile(filePath);
    return new Response(file, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return notFound();
  }
}
