"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ItemRow from "./item-row";

export default function CollectionClient({
  collection,
  spec,
  items: initialItems,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | live | draft

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((item) => {
      if (status === "live" && !item.published) return false;
      if (status === "draft" && item.published) return false;
      if (!q) return true;
      const hay = [
        item.title,
        item.group,
        item.slug,
        item.data?.role,
        item.data?.location,
        item.data?.kind,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [initialItems, query, status]);

  const live = initialItems.filter((i) => i.published).length;
  const draft = initialItems.length - live;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <nav className="mb-2 flex items-center gap-1.5 text-xs font-medium text-black/45">
            <Link href="/admin/content" className="hover:text-primary">
              Content
            </Link>
            <i className="fas fa-chevron-right text-[0.55rem] opacity-50" />
            <span className="text-black/70">{spec.label}</span>
          </nav>
          <h1 className="text-xl font-bold text-black font-[var(--font-heading)] sm:text-2xl">
            {spec.label}
          </h1>
          <p className="mt-1 text-xs text-black/50">
            {initialItems.length} total
            <span className="mx-1.5 text-black/20">·</span>
            <span className="text-emerald-700">{live} published</span>
            <span className="mx-1.5 text-black/20">·</span>
            <span className="text-amber-700">{draft} draft</span>
            <span className="mx-1.5 text-black/20">·</span>
            reorder with arrows for site order
          </p>
        </div>
        <Link
          href={`/admin/content/${collection}/new`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm shadow-primary/20 hover:bg-primary-light sm:text-sm"
        >
          <i className="fas fa-plus text-xs" />
          New {spec.singular.toLowerCase()}
        </Link>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3.5">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <i className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-black/35" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, category, slug…"
            className="w-full rounded-xl border border-black/10 bg-black/[0.02] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-black/[0.03] p-1">
          {[
            { id: "all", label: "All" },
            { id: "live", label: "Published" },
            { id: "draft", label: "Drafts" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatus(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                status === tab.id
                  ? "bg-white text-black shadow-sm"
                  : "text-black/50 hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {initialItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <i className="fas fa-folder-open" />
          </div>
          <p className="font-bold text-black">No entries yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-black/50">
            Create your first {spec.singular.toLowerCase()} to show it on the
            public site.
          </p>
          <Link
            href={`/admin/content/${collection}/new`}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
          >
            <i className="fas fa-plus text-xs" />
            Add {spec.singular.toLowerCase()}
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white px-6 py-12 text-center text-sm text-black/50">
          No items match your filters.
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("all");
            }}
            className="ml-2 font-semibold text-primary hover:underline"
          >
            Clear
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-black/[0.02] text-[0.7rem] font-bold uppercase tracking-wide text-black/45">
                  <th className="w-12 px-3 py-3 font-bold"> </th>
                  <th className="px-3 py-3 font-bold">Entry</th>
                  <th className="hidden px-3 py-3 font-bold sm:table-cell">
                    Status
                  </th>
                  <th className="hidden px-3 py-3 font-bold md:table-cell">
                    Updated
                  </th>
                  <th className="px-3 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  // Preserve original order indexes for move up/down relative to full list
                  const fullIndex = initialItems.findIndex(
                    (x) => x.id === item.id,
                  );
                  return (
                    <ItemRow
                      key={item.id}
                      collection={collection}
                      item={item}
                      isFirst={fullIndex === 0}
                      isLast={fullIndex === initialItems.length - 1}
                      hasImage={!!spec.hasImage}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-black/5 px-4 py-2.5 text-xs text-black/40">
            Showing {filtered.length} of {initialItems.length}
          </div>
        </div>
      )}
    </div>
  );
}
