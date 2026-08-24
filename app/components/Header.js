"use client";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICAFOW, isIcaFowCampaignActive } from "@/lib/icafow";

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
      { label: "Masterclass", href: "/training/masterclass" },
      { label: "Annual Calendar", href: "/calendar" },
    ],
  },
  {
    label: "Events",
    children: [
      {
        label: "AI Conference",
        href: ICAFOW.url,
        external: true,
        badge: "2026",
      },
      { label: "AI Dinner", href: "/events/ai-dinner" },
      {
        label: "AI Marathon",
        href: "https://aimarathon.arifa.org",
        external: true,
      },
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

function NavBadge({ label }) {
  if (!label || !isIcaFowCampaignActive()) return null;
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-primary">
      {label}
    </span>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [desktopOpen, setDesktopOpen] = useState(null);
  const [desktopIndicator, setDesktopIndicator] = useState(null);
  const desktopNavRef = useRef(null);
  const desktopItemRefs = useRef({});
  const desktopCloseTimeoutRef = useRef(null);
  const campaignOn = isIcaFowCampaignActive();
  const activeDesktopItem = navItems.find((item) => item.label === desktopOpen);

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

  useEffect(() => {
    return () => clearDesktopCloseTimeout();
  }, []);

  useLayoutEffect(() => {
    if (!desktopOpen || !desktopNavRef.current) {
      setDesktopIndicator(null);
      return;
    }

    const updateIndicator = () => {
      const navRect = desktopNavRef.current?.getBoundingClientRect();
      const itemRect =
        desktopItemRefs.current[desktopOpen]?.getBoundingClientRect();

      if (!navRect || !itemRect) return;

      setDesktopIndicator({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        center: itemRect.left - navRect.left + itemRect.width / 2,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [desktopOpen, scrolled]);

  const toggleSub = (label) => {
    setOpenSub(openSub === label ? null : label);
  };

  const clearDesktopCloseTimeout = () => {
    if (desktopCloseTimeoutRef.current) {
      clearTimeout(desktopCloseTimeoutRef.current);
      desktopCloseTimeoutRef.current = null;
    }
  };

  const openDesktopItem = (label) => {
    clearDesktopCloseTimeout();
    setDesktopOpen(label);
  };

  const closeDesktopItem = () => {
    clearDesktopCloseTimeout();
    desktopCloseTimeoutRef.current = setTimeout(() => {
      setDesktopOpen(null);
    }, 90);
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
        className="relative z-50 w-full bg-transparent transition-all duration-300"
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
            ref={desktopNavRef}
            className={`arifa-desktop-nav hidden lg:flex items-center gap-0.5 rounded-full p-1.5 ${
              scrolled
                ? "bg-white/90 shadow-[0_10px_30px_rgba(15,20,25,0.08)] ring-1 ring-line backdrop-blur-md"
                : "bg-white/10 shadow-[0_10px_30px_rgba(15,20,25,0.08)] ring-1 ring-white/20 backdrop-blur-md"
            }`}
            aria-label="Main Navigation"
            onMouseEnter={clearDesktopCloseTimeout}
            onMouseLeave={closeDesktopItem}
          >
            <span
              className={`arifa-nav-indicator ${
                desktopIndicator ? "opacity-100" : "opacity-0"
              } ${
                scrolled
                  ? "bg-surface-alt"
                  : "bg-white/15 ring-1 ring-white/20"
              }`}
              style={
                desktopIndicator
                  ? {
                      width: `${desktopIndicator.width}px`,
                      transform: `translate3d(${desktopIndicator.left}px, 0, 0)`,
                    }
                  : undefined
              }
              aria-hidden="true"
            />
            {navItems.map((item) => {
              const isDesktopOpen = desktopOpen === item.label;

              return (
                <div
                  key={item.label}
                  ref={(node) => {
                    if (node) {
                      desktopItemRefs.current[item.label] = node;
                    }
                  }}
                  className="relative z-10"
                  onMouseEnter={() =>
                    openDesktopItem(item.children ? item.label : null)
                  }
                  onFocus={() =>
                    openDesktopItem(item.children ? item.label : null)
                  }
                  onBlur={(event) => {
                    if (!desktopNavRef.current?.contains(event.relatedTarget)) {
                      closeDesktopItem();
                    }
                  }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={`relative flex items-center gap-1 rounded-full px-3 py-2 text-[0.8125rem] font-semibold tracking-wide ${linkTone}`}
                      onClick={() => openDesktopItem(null)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.8125rem] font-semibold tracking-wide cursor-default ${linkTone}`}
                      aria-haspopup="true"
                      aria-expanded={isDesktopOpen}
                      onClick={() =>
                        openDesktopItem(isDesktopOpen ? null : item.label)
                      }
                    >
                      {item.label}
                      <i
                        className={`fas fa-chevron-down text-[0.55em] opacity-60 transition-transform duration-300 ${
                          isDesktopOpen ? "scale-y-[-1]" : "scale-y-100"
                        }`}
                      />
                    </button>
                  )}
                </div>
              );
            })}
            {activeDesktopItem?.children && desktopIndicator && (
              <div
                className="arifa-nav-dropdown pointer-events-auto opacity-100"
                style={{
                  left: `${desktopIndicator.center}px`,
                }}
              >
                <div className="arifa-nav-dropdown-panel scale-100">
                  <ul className="py-2">
                    {activeDesktopItem.children.map((child, index) => (
                      <li
                        key={`${activeDesktopItem.label}-${child.label}`}
                        className="arifa-nav-dropdown-item"
                        style={{ transitionDelay: `${50 * (index + 1)}ms` }}
                      >
                        {child.external ? (
                          <a
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex items-center justify-center rounded-full px-4 py-2.5 text-center text-sm font-semibold text-ink-soft hover:bg-surface-alt hover:text-primary"
                            onClick={() => openDesktopItem(null)}
                          >
                            <span className="inline-flex items-center justify-center">
                              {child.label}
                              <NavBadge label={child.badge} />
                            </span>
                            <i className="fas fa-arrow-up-right-from-square absolute right-4 text-[0.65em] opacity-40" />
                          </a>
                        ) : (
                          <Link
                            href={child.href}
                            className="flex items-center justify-center rounded-full px-4 py-2.5 text-center text-sm font-semibold text-ink-soft hover:bg-surface-alt hover:text-primary"
                            onClick={() => openDesktopItem(null)}
                          >
                            {child.label}
                            <NavBadge label={child.badge} />
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {campaignOn && (
              <a
                href={ICAFOW.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden md:inline-flex items-center justify-center gap-1.5 px-3 py-2 text-[0.75rem] font-semibold rounded-md transition-all ${
                  scrolled
                    ? "text-primary border border-primary/30 bg-primary/5 hover:bg-primary hover:text-white"
                    : "text-white border border-white/35 bg-white/10 hover:bg-white/20"
                }`}
              >
                ICAFoW
                <i className="fas fa-arrow-up-right-from-square text-[0.65em] opacity-70" aria-hidden="true" />
              </a>
            )}
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
                              className="flex items-center py-2.5 pl-3 text-sm text-muted hover:text-primary"
                              onClick={closeMobileNav}
                            >
                              {child.label}
                              <NavBadge label={child.badge} />
                            </a>
                          ) : (
                            <Link
                              href={child.href}
                              className="flex items-center py-2.5 pl-3 text-sm text-muted hover:text-primary"
                              onClick={closeMobileNav}
                            >
                              {child.label}
                              <NavBadge label={child.badge} />
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
          {campaignOn && (
            <li className="mt-6">
              <a
                href={ICAFOW.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 border-2 border-primary text-primary rounded-md font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
                onClick={closeMobileNav}
              >
                Register for ICAFoW 2026
              </a>
            </li>
          )}
          <li className={campaignOn ? "mt-3" : "mt-6"}>
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
