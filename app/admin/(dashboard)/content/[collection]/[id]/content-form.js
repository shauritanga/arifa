"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { saveContentItem } from "../../../../content-actions";
import {
  CoverImageField,
  GalleryImagesField,
} from "../../../../components/image-upload-fields";
import RichTextEditor from "../../../../components/rich-text-editor";
import SectionsEditor from "../../../../components/sections-editor";

const INPUT =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";

const FOLDER_BY_COLLECTION = {
  EVENT: "events",
  TEAM_MEMBER: "team",
  RESEARCH_PROJECT: "research",
  CERTIFICATION: "training",
  COURSE: "training",
  MASTERCLASS: "training",
};

export default function ContentForm({ collection, spec, item }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isNew = item.id === "new";
  const folder = FOLDER_BY_COLLECTION[collection] || "general";
  const groupOptions = spec.group?.options ?? [];
  const knownGroup = groupOptions.includes(item.group)
    ? item.group
    : item.group
      ? "__custom__"
      : groupOptions[0] ?? "";

  const [groupMode, setGroupMode] = useState(
    item.group && !groupOptions.includes(item.group) ? "__custom__" : knownGroup,
  );

  const showCustomGroup = useMemo(() => {
    if (!spec.group) return false;
    if (spec.group.allowCustom && groupMode === "__custom__") return true;
    if (!spec.group.options) return true;
    return false;
  }, [spec.group, groupMode]);

  const onSubmit = (formData) => {
    setError("");
    startTransition(async () => {
      const res = await saveContentItem(collection, item.id, formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(`/admin/content/${collection}`);
      router.refresh();
    });
  };

  const isEvent = collection === "EVENT";

  const bodyFields = spec.fields.filter(
    (f) => !["images", "tags", "sections"].includes(f.key) && f.kind !== "sections",
  );
  const mediaFields = spec.fields.filter((f) => f.key === "images");
  const tagFields = spec.fields.filter((f) => f.key === "tags");
  const sectionFields = spec.fields.filter(
    (f) => f.kind === "sections" || f.key === "sections",
  );

  return (
    <form action={onSubmit}>
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        {/* Main editor column */}
        <div className="space-y-5 lg:col-span-8">
          <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon="fa-heading"
              title="Basics"
              desc="Core identity of this entry."
            />
            <div className="mt-5 space-y-5">
              <Field label={spec.titleLabel ?? "Title"} required>
                <input
                  name="title"
                  defaultValue={item.title ?? ""}
                  required
                  className={INPUT}
                  placeholder={
                    collection === "TEAM_MEMBER"
                      ? "e.g. Dr. Jane Doe"
                      : isEvent
                        ? "e.g. Tanzania AI Forum 2026"
                        : undefined
                  }
                />
              </Field>

              {spec.hasSlug && (
                <Field
                  label="URL slug"
                  hint="Leave empty to auto-generate from the title."
                >
                  <input
                    name="slug"
                    defaultValue={item.slug ?? ""}
                    className={`${INPUT} font-mono text-sm`}
                    placeholder="auto-from-title"
                  />
                </Field>
              )}

              {spec.group && (
                <div className="space-y-3">
                  <Field
                    label={spec.group.label}
                    required={spec.group.required}
                    hint={
                      spec.group.allowCustom
                        ? "Pick a section, or choose Custom for a new category."
                        : isEvent
                          ? "Upcoming vs Past on the public events page."
                          : null
                    }
                  >
                    {spec.group.options ? (
                      <select
                        name="group"
                        value={groupMode}
                        onChange={(e) => setGroupMode(e.target.value)}
                        required={spec.group.required}
                        className={INPUT}
                      >
                        {spec.group.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                        {spec.group.allowCustom && (
                          <option value="__custom__">Custom category…</option>
                        )}
                      </select>
                    ) : (
                      <input
                        name="group"
                        defaultValue={item.group ?? ""}
                        required={spec.group.required}
                        className={INPUT}
                      />
                    )}
                  </Field>
                  {showCustomGroup && (
                    <Field label="Custom category name" required>
                      <input
                        name="groupCustom"
                        defaultValue={
                          item.group && !groupOptions.includes(item.group)
                            ? item.group
                            : ""
                        }
                        required
                        className={INPUT}
                        placeholder="e.g. Advisors"
                      />
                    </Field>
                  )}
                </div>
              )}
            </div>
          </section>

          {(spec.hasImage || mediaFields.length > 0) && (
            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <SectionTitle
                icon="fa-images"
                title="Media"
                desc="Cover and gallery images."
              />
              <div className="mt-5 space-y-6">
                {spec.hasImage && (
                  <CoverImageField
                    name="image"
                    value={item.image ?? ""}
                    folder={folder}
                    label={
                      spec.imageLabel ||
                      (collection === "TEAM_MEMBER"
                        ? "Avatar / photo"
                        : "Cover image")
                    }
                    hint={spec.imageHint || "Upload an image from your device."}
                  />
                )}
                {mediaFields.map((field) => (
                  <GalleryImagesField
                    key={field.key}
                    name={field.key}
                    value={item.data?.[field.key]}
                    folder={folder}
                    label={field.label}
                    hint={field.hint}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon="fa-align-left"
              title="Content"
              desc={
                collection === "JOB"
                  ? "Short blurb on the card; full role details use the visual editor below."
                  : "Details shown on the public site."
              }
            />
            <div className="mt-5 space-y-5">
              {bodyFields.map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  hint={
                    field.kind === "html"
                      ? field.hint ||
                        "Use the toolbar for headings, bold, lists, links, and images — no HTML knowledge needed."
                      : field.hint || hintFor(field)
                  }
                >
                  {renderField(field, item.data?.[field.key], { folder })}
                </Field>
              ))}
              {tagFields.map((field) => (
                <Field
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  hint={field.hint || hintFor(field)}
                >
                  {renderField(field, item.data?.[field.key], { folder })}
                </Field>
              ))}
            </div>
          </section>

          {sectionFields.length > 0 && (
            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <SectionTitle
                icon="fa-layer-group"
                title="Detail sections"
                desc="Same order as the public page — Certificate Modules is always last."
              />
              <div className="mt-5 space-y-5">
                {sectionFields.map((field) => (
                  <SectionsEditor
                    key={field.key}
                    name={field.key}
                    value={item.data?.[field.key]}
                    folder={folder}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky publish sidebar */}
        <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-24">
          <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
            <h3 className="mb-0.5 text-xs font-bold text-black">Publish</h3>
            <p className="mb-3 text-[0.7rem] text-black/45">
              Control visibility on the live website.
            </p>

            <label className="mb-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-black/10 bg-black/[0.02] p-2.5">
              <input
                type="checkbox"
                name="published"
                defaultChecked={isNew ? true : item.published}
                className="mt-0.5 h-3.5 w-3.5 rounded border-black/20 accent-[var(--color-primary,#990000)]"
              />
              <span>
                <span className="block text-xs font-bold text-black">
                  Published
                </span>
                <span className="mt-0.5 block text-[0.7rem] text-black/50">
                  Visible on the public site when checked.
                </span>
              </span>
            </label>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-primary/20 disabled:opacity-70 sm:text-sm"
              >
                {pending
                  ? "Saving…"
                  : isNew
                    ? `Create ${spec.singular.toLowerCase()}`
                    : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/admin/content/${collection}`)}
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/[0.03]"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4 text-[0.7rem] text-black/50 shadow-sm">
            <p className="mb-1.5 text-xs font-bold text-black/70">Tips</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Upload images before saving so paths are stored.</li>
              <li>Drafts stay hidden until Published is checked.</li>
              <li>Order in the list controls public display order.</li>
            </ul>
          </div>
        </aside>
      </div>
    </form>
  );
}

function SectionTitle({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-2.5 border-b border-black/5 pb-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <i className={`fas ${icon} text-xs`} />
      </span>
      <div>
        <h3 className="text-xs font-bold text-black sm:text-sm">{title}</h3>
        {desc && <p className="mt-0.5 text-[0.7rem] text-black/45">{desc}</p>}
      </div>
    </div>
  );
}

function hintFor(field) {
  if (field.kind === "html") {
    return "Use the visual editor for headings, lists, bold text, and links — no code needed.";
  }
  if (field.kind === "json") return "JSON. Leave empty for none.";
  if (field.kind === "lines") return "One value per line.";
  return null;
}

function linesToText(value) {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") return value;
  return "";
}

function renderField(field, value, { folder } = {}) {
  if (field.kind === "json") {
    return (
      <textarea
        name={field.key}
        rows={10}
        defaultValue={value ? JSON.stringify(value, null, 2) : ""}
        className={`${INPUT} resize-y font-mono text-xs`}
      />
    );
  }

  if (field.kind === "lines") {
    return (
      <textarea
        name={field.key}
        rows={field.key === "tags" ? 3 : 5}
        required={field.required}
        defaultValue={linesToText(value)}
        className={`${INPUT} resize-y font-mono text-sm`}
        placeholder={
          field.key === "tags" ? "AI\nPartnership\nTraining" : undefined
        }
      />
    );
  }

  if (field.kind === "select" && field.options?.length) {
    return (
      <select
        name={field.key}
        defaultValue={value || field.options[0]}
        required={field.required}
        className={INPUT}
      >
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  // Full visual editor for HTML body fields (research, bios, career details, etc.)
  if (field.kind === "html") {
    return (
      <RichTextEditor
        name={field.key}
        value={typeof value === "string" ? value : ""}
        folder={folder || "general"}
        placeholder={
          field.placeholder ||
          "Write the full content here. Use headings, lists, bold, links, and images from the toolbar."
        }
      />
    );
  }

  if (field.kind === "textarea") {
    const rows =
      field.key === "shortBio" || field.key === "desc"
        ? 3
        : field.key === "content"
          ? 12
          : 6;
    return (
      <textarea
        name={field.key}
        rows={rows}
        required={field.required}
        defaultValue={value ?? ""}
        className={`${INPUT} resize-y`}
      />
    );
  }

  return (
    <input
      name={field.key}
      type={field.kind === "url" ? "url" : "text"}
      required={field.required}
      defaultValue={value ?? ""}
      className={INPUT}
    />
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/80">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-[0.7rem] text-black/45">{hint}</span>
      )}
    </label>
  );
}
