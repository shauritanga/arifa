import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { auth } from "../../../../lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB per file
const MAX_FILES = 12;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

const FOLDERS = new Set([
  "events",
  "team",
  "research",
  "training",
  "general",
]);

function safeFolder(raw) {
  const f = String(raw || "general")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  return FOLDERS.has(f) ? f : "general";
}

/**
 * POST multipart/form-data
 * - files: one or more under field name "files" (or single "file")
 * - folder: optional subfolder under public/uploads/
 *
 * Returns { ok: true, urls: string[] }
 */
export async function POST(request) {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const folder = safeFolder(formData.get("folder"));
  const incoming = [
    ...formData.getAll("files"),
    ...formData.getAll("file"),
  ].filter((f) => f && typeof f === "object" && typeof f.arrayBuffer === "function");

  if (incoming.length === 0) {
    return Response.json({ error: "No files received." }, { status: 400 });
  }
  if (incoming.length > MAX_FILES) {
    return Response.json(
      { error: `Maximum ${MAX_FILES} files per upload.` },
      { status: 400 },
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });

  const urls = [];

  for (const file of incoming) {
    const type = String(file.type || "").toLowerCase();
    const ext = ALLOWED.get(type);
    if (!ext) {
      return Response.json(
        {
          error: `Unsupported type “${type || "unknown"}”. Use JPEG, PNG, WebP, GIF, or AVIF.`,
        },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: `“${file.name}” is too large. Max 5MB per image.` },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stamp = Date.now().toString(36);
    const rand = randomBytes(4).toString("hex");
    const base = String(file.name || "image")
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    const filename = `${base || "image"}-${stamp}-${rand}.${ext}`;
    const fullPath = path.join(dir, filename);
    await writeFile(fullPath, buffer);
    urls.push(`/uploads/${folder}/${filename}`);
  }

  return Response.json({ ok: true, urls });
}
