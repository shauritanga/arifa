"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveContentItem } from "../../../../content-actions";

const INPUT =
  "w-full rounded-xl border border-black/10 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function ContentForm({ collection, spec, item }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isNew = item.id === "new";

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

  return (
    <form action={onSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700"
        >
          {error}
        </div>
      )}

      <Field label={spec.titleLabel ?? "Title"} required>
        <input
          name="title"
          defaultValue={item.title ?? ""}
          required
          className={INPUT}
        />
      </Field>

      {spec.hasSlug && (
        <Field
          label="URL slug"
          hint="Appears in the page address. Changing it breaks existing links."
        >
          <input
            name="slug"
            defaultValue={item.slug ?? ""}
            className={`${INPUT} font-mono text-sm`}
          />
        </Field>
      )}

      {spec.hasImage && (
        <Field label="Image" hint="A path such as /images/team/jane.png, or a full URL.">
          <input name="image" defaultValue={item.image ?? ""} className={INPUT} />
        </Field>
      )}

      {spec.group && (
        <Field label={spec.group.label}>
          {spec.group.options ? (
            <select
              name="group"
              defaultValue={item.group ?? spec.group.options[0]}
              className={INPUT}
            >
              {spec.group.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input name="group" defaultValue={item.group ?? ""} className={INPUT} />
          )}
        </Field>
      )}

      {spec.fields.map((field) => (
        <Field key={field.key} label={field.label} required={field.required} hint={hintFor(field)}>
          {renderField(field, item.data?.[field.key])}
        </Field>
      ))}

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={isNew ? true : item.published}
          className="h-5 w-5 rounded border-black/20 accent-[var(--color-primary,#000)]"
        />
        <span className="text-sm font-bold text-black">
          Visible on the public site
        </span>
      </label>

      <div className="flex gap-3 border-t border-black/10 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-70"
        >
          {pending ? "Saving…" : isNew ? "Create" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/content/${collection}`)}
          className="rounded-xl border border-black/10 px-6 py-3 font-bold text-black/70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function hintFor(field) {
  if (field.kind === "html") return "Raw HTML — it is rendered as-is on the page.";
  if (field.kind === "json") return "JSON. Leave empty for none.";
  return null;
}

function renderField(field, value) {
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

  if (field.kind === "html" || field.kind === "textarea") {
    return (
      <textarea
        name={field.key}
        rows={field.kind === "html" ? 16 : 5}
        required={field.required}
        defaultValue={value ?? ""}
        className={`${INPUT} resize-y ${field.kind === "html" ? "font-mono text-xs" : ""}`}
      />
    );
  }

  return (
    <input
      name={field.key}
      type={field.kind === "url" ? "text" : "text"}
      required={field.required}
      defaultValue={value ?? ""}
      className={INPUT}
    />
  );
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-black">
        {label}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      {children}
      {hint && <span className="mt-2 block text-xs text-black/50">{hint}</span>}
    </label>
  );
}
