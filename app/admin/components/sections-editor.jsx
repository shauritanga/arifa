"use client";

import { useCallback, useId, useMemo, useState } from "react";
import RichTextEditor from "./rich-text-editor";
import { isModulesSection, orderCertificationSections } from "@/lib/html";

/**
 * Website order for certification detail pages.
 * Core modules are always last (full-width curriculum block on the public site).
 */
const CERTIFICATION_SECTION_PRESETS = [
  "Certification Overview",
  "Certificate Description",
  "Target Audience",
  "Benefits of Attending",
  "Certification Objectives",
  "Certification Assessment",
  "Certificate Modules",
];

function withIds(list, uid) {
  return list.map((s, i) => ({
    id: s.id || `${uid}-${i}-${Date.now()}`,
    heading: s?.heading || "",
    content: s?.content || "",
  }));
}

/**
 * Easy editor for certification (and similar) detail sections:
 * [{ heading: string, content: html string }, ...]
 *
 * Order matches the public page: core modules always last.
 */
export default function SectionsEditor({
  name = "sections",
  value = [],
  folder = "training",
}) {
  const uid = useId();

  const initial = useMemo(() => {
    const raw = Array.isArray(value)
      ? value.map((s) => ({
          heading: s?.heading || "",
          content: s?.content || "",
        }))
      : [];
    return withIds(orderCertificationSections(raw), uid);
  }, [value, uid]);

  const [sections, setSections] = useState(
    initial.length
      ? initial
      : withIds(
          CERTIFICATION_SECTION_PRESETS.map((heading) => ({
            heading,
            content: "",
          })),
          uid,
        ),
  );

  const update = useCallback((id, patch) => {
    setSections((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...patch } : s));
      // Keep core modules last whenever a heading becomes a modules section.
      if (patch.heading != null) {
        return withIds(orderCertificationSections(next), uid);
      }
      return next;
    });
  }, [uid]);

  const addSection = () => {
    setSections((prev) => {
      // Insert before modules so new general sections don't push past curriculum.
      const modules = prev.filter((s) => isModulesSection(s));
      const rest = prev.filter((s) => !isModulesSection(s));
      return [
        ...rest,
        {
          id: `${uid}-${Date.now()}`,
          heading: "",
          content: "",
        },
        ...modules,
      ];
    });
  };

  const addModulesSection = () => {
    setSections((prev) => {
      if (prev.some((s) => isModulesSection(s))) {
        // Already have modules — move it last and focus order only.
        return withIds(orderCertificationSections(prev), uid);
      }
      return [
        ...prev,
        {
          id: `${uid}-modules-${Date.now()}`,
          heading: "Certificate Modules",
          content: "",
        },
      ];
    });
  };

  const applyWebsitePresets = () => {
    setSections((prev) => {
      const byHeading = new Map(
        prev.map((s) => [String(s.heading || "").trim().toLowerCase(), s]),
      );
      const built = CERTIFICATION_SECTION_PRESETS.map((heading) => {
        const existing = byHeading.get(heading.toLowerCase());
        return {
          id: existing?.id || `${uid}-preset-${heading}`,
          heading,
          content: existing?.content || "",
        };
      });
      // Keep any custom sections (not in presets), still before modules.
      const presetKeys = new Set(
        CERTIFICATION_SECTION_PRESETS.map((h) => h.toLowerCase()),
      );
      const extras = prev.filter(
        (s) =>
          s.heading &&
          !presetKeys.has(s.heading.trim().toLowerCase()) &&
          !isModulesSection(s),
      );
      const modules = built.filter((s) => isModulesSection(s));
      const rest = built.filter((s) => !isModulesSection(s));
      return [...rest, ...extras, ...modules];
    });
  };

  const removeSection = (id) => {
    setSections((prev) => {
      if (prev.length <= 1) {
        return [{ id: `${uid}-empty`, heading: "", content: "" }];
      }
      return prev.filter((s) => s.id !== id);
    });
  };

  const move = (index, dir) => {
    setSections((prev) => {
      const next = [...prev];
      const j = index + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[index], next[j]] = [next[j], next[index]];
      // Enforce modules last after any reorder.
      return withIds(orderCertificationSections(next), uid);
    });
  };

  const payload = orderCertificationSections(
    sections
      .map((s) => ({
        heading: String(s.heading || "").trim(),
        content: s.content || "",
      }))
      .filter(
        (s) =>
          s.heading ||
          (s.content &&
            s.content !== "<p></p>" &&
            s.content !== "<p><br></p>"),
      ),
  );

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(payload)} />

      <div className="rounded-lg border border-primary/15 bg-primary/[0.04] px-3 py-2.5">
        <p className="text-[0.7rem] leading-relaxed text-black/65">
          <span className="font-bold text-black/80">Public page order:</span>{" "}
          Overview → Description → Audience → Benefits → Objectives → Assessment
          → <strong>Certificate Modules (always last)</strong>. Core modules
          render as the full-width curriculum block at the bottom of the site.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={applyWebsitePresets}
            className="rounded-md border border-black/10 bg-white px-2.5 py-1 text-[0.65rem] font-bold text-black/70 hover:border-primary/30 hover:text-primary"
          >
            Use website section order
          </button>
          <button
            type="button"
            onClick={addModulesSection}
            className="rounded-md border border-black/10 bg-white px-2.5 py-1 text-[0.65rem] font-bold text-black/70 hover:border-primary/30 hover:text-primary"
          >
            Ensure modules is last
          </button>
        </div>
      </div>

      {sections.map((section, index) => {
        const isModules = isModulesSection(section);
        return (
          <div
            key={section.id}
            className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
              isModules
                ? "border-primary/30 ring-1 ring-primary/10"
                : "border-black/10"
            }`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 ${
                isModules
                  ? "border-primary/15 bg-primary/[0.06]"
                  : "border-black/5 bg-black/[0.02]"
              }`}
            >
              <span className="text-[0.7rem] font-bold uppercase tracking-wide text-black/45">
                Section {index + 1}
                {isModules ? (
                  <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[0.6rem] font-bold normal-case tracking-normal text-primary">
                    Last on website · Curriculum
                  </span>
                ) : null}
                {section.heading ? (
                  <span className="ml-2 font-semibold normal-case tracking-normal text-black/60">
                    — {section.heading}
                  </span>
                ) : null}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0 || isModules}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-black/50 hover:bg-black/5 disabled:opacity-30"
                  title={
                    isModules
                      ? "Modules stay last (public page order)"
                      : "Move up"
                  }
                >
                  <i className="fas fa-arrow-up" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={
                    index === sections.length - 1 ||
                    isModulesSection(sections[index + 1])
                  }
                  className="rounded-md px-2 py-1 text-xs font-semibold text-black/50 hover:bg-black/5 disabled:opacity-30"
                  title="Move down"
                >
                  <i className="fas fa-arrow-down" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSection(section.id)}
                  className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  title="Remove section"
                >
                  <i className="fas fa-trash-can" />
                </button>
              </div>
            </div>

            <div className="space-y-3 p-3 sm:p-4">
              <label className="block">
                <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/80">
                  Section title
                </span>
                <input
                  type="text"
                  value={section.heading}
                  onChange={(e) =>
                    update(section.id, { heading: e.target.value })
                  }
                  placeholder="e.g. Certification Overview, Certificate Modules…"
                  className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {isModules ? (
                  <span className="mt-1 block text-[0.65rem] text-black/45">
                    Shown last on the public certification page as the core
                    curriculum block.
                  </span>
                ) : null}
              </label>

              <div>
                <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-black/80">
                  Section content
                </span>
                <RichTextEditor
                  key={section.id}
                  submitField={false}
                  value={section.content}
                  folder={folder}
                  onChange={(html) => update(section.id, { content: html })}
                  placeholder={
                    isModules
                      ? "One block per module, e.g. Module 1: Title then a bullet list of topics…"
                      : "Write this section. Use headings, bullets, bold text, and images from the toolbar."
                  }
                />
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addSection}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-black/[0.02] px-4 py-3 text-xs font-bold text-black/70 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
      >
        <i className="fas fa-plus" />
        Add another section
      </button>
    </div>
  );
}
