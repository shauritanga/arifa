"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  deleteContentItem,
  moveContentItem,
  toggleContentPublished,
} from "../../../content-actions";

export default function ItemRow({ collection, item, isFirst, isLast }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const run = (fn) => {
    setError("");
    startTransition(async () => {
      const res = await fn();
      if (res && !res.ok) setError(res.error);
    });
  };

  const remove = () => {
    if (!confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    run(() => deleteContentItem(collection, item.id));
  };

  return (
    <li className="flex items-center gap-4 px-5 py-4">
      <div className="flex flex-col gap-1">
        <button
          type="button"
          disabled={pending || isFirst}
          onClick={() => run(() => moveContentItem(collection, item.id, "up"))}
          aria-label="Move up"
          className="text-black/30 hover:text-primary disabled:opacity-20"
        >
          <i className="fas fa-chevron-up text-xs" />
        </button>
        <button
          type="button"
          disabled={pending || isLast}
          onClick={() => run(() => moveContentItem(collection, item.id, "down"))}
          aria-label="Move down"
          className="text-black/30 hover:text-primary disabled:opacity-20"
        >
          <i className="fas fa-chevron-down text-xs" />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/content/${collection}/${item.id}`}
          className="block truncate font-bold text-black hover:text-primary"
        >
          {item.title}
        </Link>
        <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-black/50">
          {item.group && <span>{item.group}</span>}
          {item.slug && <span className="font-mono">/{item.slug}</span>}
          {error && <span className="font-bold text-red-600">{error}</span>}
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => run(() => toggleContentPublished(collection, item.id))}
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors disabled:opacity-50 ${
          item.published
            ? "bg-green-100 text-green-700"
            : "bg-black/10 text-black/50"
        }`}
      >
        {item.published ? "Live" : "Hidden"}
      </button>

      <button
        type="button"
        disabled={pending}
        onClick={remove}
        aria-label="Delete"
        className="shrink-0 text-black/30 transition-colors hover:text-red-600 disabled:opacity-50"
      >
        <i className="fas fa-trash text-sm" />
      </button>
    </li>
  );
}
