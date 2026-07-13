"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Overview", icon: "fa-chart-line" },
  { href: "/admin/donations", label: "Donations", icon: "fa-hand-holding-heart" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-lines" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/users", label: "Admin Users", icon: "fa-users-gear" },
  { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

export default function AdminShell({ user, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-primary/5">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="rounded-lg p-2 text-black/60 hover:bg-black/5 md:hidden"
          >
            <i className="fas fa-bars" />
          </button>
          <Link href="/admin" className="font-extrabold tracking-tight text-black">
            ARIFA <span className="font-medium text-black/40">Admin</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-black/60 sm:inline">{user.email}</span>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-bold text-black/70 transition-colors hover:bg-black/5"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-6 py-8">
        <nav
          className={`${open ? "block" : "hidden"} w-full shrink-0 md:block md:w-56`}
        >
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-white"
                      : "text-black/60 hover:bg-white"
                  }`}
                >
                  <i className={`fas ${item.icon} w-4`} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className={`${open ? "hidden" : "block"} min-w-0 flex-1 md:block`}>
          {children}
        </main>
      </div>
    </div>
  );
}
