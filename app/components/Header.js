"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Simplified top-level nav: 5 groups + Contact + Support CTA.
 * Secondary pages fold into Engage (sponsorship + careers).
 */
const navItems = [
  {
    label: "About",
    children: [
      { label: "About ARIFA", href: "/about" },
      { label: "Our Team", href: "/team" },
    ],
  },
  {
    label: "Research",
    children: [
      { label: "Research Projects", href: "/research/research-projects" },
      { label: "Publications", href: "/publications" },
      {
        label: "ARIFA Journal (IJAIT)",
        href: "https://ijait.arifa.org",
        external: true,
      },
    ],
  },
  {
    label: "Training",
    children: [
      { label: "Certifications", href: "/training/certifications" },
      { label: "Short Courses", href: "/training/short-courses" },
      { label: "Master Class", href: "/training/masterclass" },
      { label: "Annual Calendar", href: "/calendar" },
    ],
  },
  {
    label: "Events",
    children: [
      {
        label: "AI Conference",
        href: "https://aiconference.arifa.org",
        external: true,
      },
      { label: "AI Dinner", href: "/events/ai-dinner" },
      { label: "AI Marathon", href: "/events/ai-marathon" },
      { label: "Engagements", href: "/events/engagements" },
    ],
  },
  {
    label: "Engage",
    children: [
      {
        label: "Industry Sponsorship",
        href: "/industry/levels-of-engagement-and-support",
      },
      { label: "Careers", href: "/opportunities/careers" },
      { label: "Support Us", href: "/support-us" },
    ],
  },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [desktopOpen, setDesktopOpen] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleSub = (label) => {
    setOpenSub(openSub === label ? null : label);
  };

  const closeMobileNav = () => {
    setMobileOpen(false);
    setOpenSub(null);
  };

  const linkTone = scrolled
    ? "text-ink hover:text-primary"
    : "text-white/90 hover:text-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-line shadow-[0_1px_0_rgba(15,20,25,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between h-[4.5rem] px-6">
          <Link href="/" aria-label="ARIFA Home" className="relative z-10">
            <Image
              src="https://arifa.org/assets/img/black-logo3.png"
              alt="ARIFA Logo"
              width={200}
              height={62}
              className={`h-12 w-auto transition-all duration-300 ${
                scrolled ? "" : "brightness-0 invert"
              }`}
              priority
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-0.5"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isDesktopOpen = desktopOpen === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setDesktopOpen(item.label)
                  }
                  onMouseLeave={() => setDesktopOpen(null)}
                  onFocus={() => item.children && setDesktopOpen(item.label)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setDesktopOpen(null);
                    }
                  }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 px-3 py-2 text-[0.8125rem] font-semibold tracking-wide ${linkTone}`}
                      onClick={() => setDesktopOpen(null)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-2 text-[0.8125rem] font-semibold tracking-wide cursor-default ${linkTone}`}
                      aria-haspopup="true"
                      aria-expanded={isDesktopOpen}
                      onClick={() =>
                        setDesktopOpen(isDesktopOpen ? null : item.label)
                      }
                    >
                      {item.label}
                      <i
                        className={`fas fa-chevron-down text-[0.55em] opacity-60 transition-transform ${
                          isDesktopOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  {item.children && (
                    <ul
                      className={`absolute top-full left-0 z-10 min-w-[14.5rem] rounded-lg border border-line bg-white py-2 shadow-[0_16px_40px_rgba(15,20,25,0.1)] transition-all duration-200 ${
                        isDesktopOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible translate-y-1 opacity-0"
                      }`}
                    >
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.external ? (
                            <a
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-primary"
                              onClick={() => setDesktopOpen(null)}
                            >
                              {child.label}
                              <i className="fas fa-arrow-up-right-from-square text-[0.65em] opacity-40" />
                            </a>
                          ) : (
                            <Link
                              href={child.href}
                              className="block px-4 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-alt hover:text-primary"
                              onClick={() => setDesktopOpen(null)}
                            >
                              {child.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/support-us"
              className={`hidden lg:inline-flex items-center justify-center px-4 py-2 text-[0.8125rem] font-semibold rounded-md transition-all ${
                scrolled
                  ? "text-white bg-primary hover:bg-primary-light"
                  : "text-night bg-white hover:bg-white/90"
              }`}
            >
              Support Us
            </Link>
            <button
              type="button"
              className="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10 items-center z-[110]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <span
                className={`block w-5 h-[1.5px] rounded-full transition-all origin-center ${
                  scrolled || mobileOpen ? "bg-ink" : "bg-white"
                } ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
              />
              <span
                className={`block w-5 h-[1.5px] rounded-full transition-all ${
                  scrolled || mobileOpen ? "bg-ink" : "bg-white"
                } ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-[1.5px] rounded-full transition-all origin-center ${
                  scrolled || mobileOpen ? "bg-ink" : "bg-white"
                } ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-night/50 backdrop-blur-[2px] z-[104]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={`fixed top-0 right-0 w-full max-w-[22rem] h-screen bg-white z-[105] transition-transform duration-300 overflow-y-auto pt-20 px-5 pb-8 border-l border-line ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3.5 font-semibold text-ink border-b border-line"
                  onClick={closeMobileNav}
                >
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full py-3.5 font-semibold text-ink border-b border-line"
                    onClick={() => toggleSub(item.label)}
                    aria-expanded={openSub === item.label}
                  >
                    {item.label}
                    <i
                      className={`fas fa-chevron-down text-[0.65em] text-muted transition-transform ${
                        openSub === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSub === item.label && item.children && (
                    <ul className="pb-2 pt-1 border-b border-line">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {child.external ? (
                            <a
                              href={child.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block py-2.5 pl-3 text-sm text-muted hover:text-primary"
                              onClick={closeMobileNav}
                            >
                              {child.label}
                            </a>
                          ) : (
                            <Link
                              href={child.href}
                              className="block py-2.5 pl-3 text-sm text-muted hover:text-primary"
                              onClick={closeMobileNav}
                            >
                              {child.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
          <li className="mt-6">
            <Link
              href="/support-us"
              className="block w-full text-center py-3 bg-primary text-white rounded-md font-semibold text-sm"
              onClick={closeMobileNav}
            >
              Support Us
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
