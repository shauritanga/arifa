"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

/** Black logo for light UI; white logo for dark UI. */
const LOGO_LIGHT = "/images/arifa-logo-dark.png";
const LOGO_DARK = "/images/arifa-logo-light.png";

function AdminLogo({ dark, compact = false, className = "" }) {
  return (
    <Image
      src={dark ? LOGO_DARK : LOGO_LIGHT}
      alt="ARIFA"
      width={compact ? 36 : 120}
      height={compact ? 20 : 36}
      className={`object-contain object-left ${
        compact ? "h-8 w-auto max-w-[2.25rem]" : "h-8 w-auto max-w-[7.5rem]"
      } ${className}`}
      priority
    />
  );
}

const NAV = [
  { href: "/admin", label: "Overview", icon: "fa-chart-line" },
  { href: "/admin/content", label: "Content", icon: "fa-pen-to-square" },
  { href: "/admin/donations", label: "Donations", icon: "fa-hand-holding-heart" },
  { href: "/admin/applications", label: "Applications", icon: "fa-file-lines" },
  { href: "/admin/messages", label: "Messages", icon: "fa-envelope" },
  { href: "/admin/users", label: "Admin Users", icon: "fa-users-gear" },
  { href: "/admin/profile", label: "Profile", icon: "fa-user" },
  { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

const THEME_KEY = "arifa-admin-theme";
const SIDEBAR_KEY = "arifa-admin-sidebar-collapsed";

function initialsFromUser(user) {
  const name = user?.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const email = user?.email || "A";
  return email.slice(0, 2).toUpperCase();
}

export default function AdminShell({ user, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem(THEME_KEY);
      if (t === "dark" || t === "light") setTheme(t);
      const s = localStorage.getItem(SIDEBAR_KEY);
      if (s === "1") setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const dark = theme === "dark";
  const initials = initialsFromUser(user);
  const displayName = user?.name || user?.email?.split("@")[0] || "Admin";

  const shell = dark
    ? "bg-zinc-950 text-zinc-100"
    : "bg-slate-100 text-slate-900";
  const headerBg = dark
    ? "border-zinc-800 bg-zinc-900/95"
    : "border-slate-200/80 bg-white/95";
  const sidebarBg = dark
    ? "border-zinc-800 bg-zinc-900"
    : "border-slate-200 bg-white";
  const muted = dark ? "text-zinc-400" : "text-slate-500";
  const hoverItem = dark ? "hover:bg-zinc-800" : "hover:bg-slate-100";
  const activeItem = "bg-primary text-white shadow-sm shadow-primary/25";
  const idleItem = dark
    ? "text-zinc-300 hover:bg-zinc-800 hover:text-white"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
  const borderSoft = dark ? "border-zinc-800" : "border-slate-200";
  const cardSurface = dark ? "bg-zinc-900" : "bg-white";
  const inputLike = dark
    ? "bg-zinc-800 text-zinc-100"
    : "bg-slate-100 text-slate-700";

  const NavList = ({ compact = false }) => (
    <ul className="space-y-1 px-2">
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              title={compact ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                compact ? "justify-center px-2" : ""
              } ${active ? activeItem : idleItem}`}
            >
              <i
                className={`fas ${item.icon} w-4 shrink-0 text-center ${
                  active ? "text-white" : dark ? "text-zinc-500" : "text-slate-400"
                }`}
              />
              {!compact && <span className="truncate">{item.label}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`min-h-screen ${shell}`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r transition-[width] duration-200 lg:flex ${sidebarBg} ${
          collapsed ? "w-[4.5rem]" : "w-64"
        }`}
      >
        <div
          className={`flex h-16 items-center border-b px-3 ${borderSoft} ${
            collapsed ? "justify-center" : "justify-between gap-2 px-4"
          }`}
        >
          <Link
            href="/admin"
            className="flex min-w-0 items-center"
            title="ARIFA Admin"
          >
            <AdminLogo dark={dark} compact={collapsed} />
          </Link>
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className={`rounded-lg p-2 ${muted} ${hoverItem}`}
              aria-label="Collapse sidebar"
              title="Collapse"
            >
              <i className="fas fa-angles-left text-xs" />
            </button>
          )}
        </div>

        {collapsed && (
          <div className={`flex justify-center border-b py-2 ${borderSoft}`}>
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className={`rounded-lg p-2 ${muted} ${hoverItem}`}
              aria-label="Expand sidebar"
              title="Expand"
            >
              <i className="fas fa-angles-right text-xs" />
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4">
          <NavList compact={collapsed} />
        </nav>

        <div className={`border-t p-3 ${borderSoft}`}>
          <Link
            href="/"
            target="_blank"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${muted} ${hoverItem} ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title="View public site"
          >
            <i className="fas fa-external-link-alt" />
            {!collapsed && <span>View site</span>}
          </Link>
        </div>
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r transition-transform duration-200 lg:hidden ${sidebarBg} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`flex h-16 items-center justify-between border-b px-4 ${borderSoft}`}
        >
          <Link
            href="/admin"
            className="flex min-w-0 items-center"
            onClick={() => setMobileOpen(false)}
            title="ARIFA Admin"
          >
            <AdminLogo dark={dark} />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={`rounded-lg p-2 ${muted} ${hoverItem}`}
            aria-label="Close"
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <NavList />
        </nav>
      </aside>

      {/* Main column */}
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[4.5rem]" : "lg:pl-64"
        }`}
      >
        {/* Top header */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b px-4 backdrop-blur-md sm:px-6 ${headerBg}`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={`rounded-lg p-2 lg:hidden ${muted} ${hoverItem}`}
              aria-label="Open navigation"
            >
              <i className="fas fa-bars" />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className={`hidden rounded-lg p-2 lg:inline-flex ${muted} ${hoverItem}`}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i
                className={`fas ${collapsed ? "fa-bars" : "fa-bars-staggered"}`}
              />
            </button>
            <div className="hidden sm:block">
              <p className={`text-xs font-medium ${muted}`}>Dashboard</p>
              <p className="text-sm font-semibold leading-tight">
                {NAV.find((n) => isActive(n.href))?.label || "Admin"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${inputLike} ${hoverItem}`}
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              title={dark ? "Light mode" : "Dark mode"}
            >
              <i className={`fas ${dark ? "fa-sun" : "fa-moon"} text-sm`} />
            </button>

            {/* Avatar menu */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors sm:pr-3 ${hoverItem} ${
                  menuOpen ? (dark ? "bg-zinc-800" : "bg-slate-100") : ""
                }`}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-2 ring-primary/20">
                    {initials}
                  </span>
                )}
                <span className="hidden max-w-[9rem] flex-col items-start sm:flex">
                  <span className="truncate text-sm font-semibold leading-tight">
                    {displayName}
                  </span>
                  <span className={`truncate text-[0.65rem] ${muted}`}>
                    {user?.role || "admin"}
                  </span>
                </span>
                <i
                  className={`fas fa-chevron-down hidden text-[0.6rem] sm:inline ${muted} transition-transform ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className={`absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border py-1 shadow-xl ${borderSoft} ${cardSurface}`}
                >
                  <div className={`border-b px-4 py-3 ${borderSoft}`}>
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    <p className={`truncate text-xs ${muted}`}>{user?.email}</p>
                  </div>
                  <Link
                    href="/admin/profile"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${hoverItem}`}
                  >
                    <i className={`fas fa-user w-4 ${muted}`} />
                    Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium ${hoverItem}`}
                  >
                    <i className={`fas fa-gear w-4 ${muted}`} />
                    Settings
                  </Link>
                  <div className={`my-1 border-t ${borderSoft}`} />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-red-600 ${
                      dark ? "hover:bg-red-950/40" : "hover:bg-red-50"
                    }`}
                  >
                    <i className="fas fa-right-from-bracket w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div
            className={`admin-content mx-auto max-w-[1400px] rounded-2xl border p-4 sm:p-6 lg:p-8 shadow-sm ${borderSoft} ${
              dark ? "admin-content-dark bg-zinc-900/60" : "bg-white"
            }`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
