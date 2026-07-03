"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
const navItems = [
  {
    label: "About Us",
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
    label: "Industry",
    children: [
      {
        label: "Engagement & Support",
        href: "/industry/levels-of-engagement-and-support",
      },
    ],
  },
  {
    label: "Training",
    children: [
      { label: "Certifications", href: "/training/certifications" },
      { label: "Short Courses", href: "/training/short-courses" },
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
    label: "Opportunities",
    children: [{ label: "Careers", href: "/opportunities/careers" }],
  },
  { label: "Contact Us", href: "/contact-us" },
];
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
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
  return (
    <>
      {" "}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 shadow-[0_1px_12px_rgba(0,0,0,0.06)]" : "bg-transparent"}`}
      >
        {" "}
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-20 px-6">
          {" "}
          {/* Logo */}{" "}
          <Link href="/" aria-label="ARIFA Home">
            {" "}
            <Image
              src="https://arifa.org/assets/img/black-logo3.png"
              alt="ARIFA Logo"
              width={140}
              height={44}
              className={`h-11 w-auto transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
              priority
            />{" "}
          </Link>{" "}
          {/* Desktop Nav */}{" "}
          <nav
            className="hidden xl:flex items-center gap-1"
            aria-label="Main Navigation"
          >
            {" "}
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                {" "}
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold font-[var(--font-heading)] tracking-wide transition-colors ${scrolled ? "text-black hover:text-primary" : "text-white hover:text-secondary"}`}
                  >
                    {" "}
                    {item.label}{" "}
                  </Link>
                ) : (
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold font-[var(--font-heading)] tracking-wide transition-colors cursor-default ${scrolled ? "text-black hover:text-primary" : "text-white hover:text-secondary"}`}
                  >
                    {" "}
                    {item.label}{" "}
                    <i className="fas fa-chevron-down text-[0.6em] transition-transform group-hover:rotate-180" />{" "}
                  </button>
                )}{" "}
                {/* Dropdown */}{" "}
                {item.children && (
                  <ul className="absolute top-full left-0 min-w-[220px] py-2 bg-white rounded-lg shadow-xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-250 z-10">
                    {" "}
                    {item.children.map((child) => (
                      <li key={child.label}>
                        {" "}
                        {child.external ? (
                          <a
                            href={child.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-5 py-2.5 text-sm font-medium text-black hover:bg-white hover:text-primary hover:pl-6 transition-all"
                          >
                            {" "}
                            {child.label}{" "}
                          </a>
                        ) : (
                          <Link
                            href={child.href}
                            className="block px-5 py-2.5 text-sm font-medium text-black hover:bg-white hover:text-primary hover:pl-6 transition-all"
                          >
                            {" "}
                            {child.label}{" "}
                          </Link>
                        )}{" "}
                      </li>
                    ))}{" "}
                  </ul>
                )}{" "}
              </div>
            ))}{" "}
          </nav>{" "}
          {/* CTA + Hamburger */}{" "}
          <div className="flex items-center gap-4">
            {" "}
            <Link
              href="/support-us"
              className="hidden xl:inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:bg-primary hover:shadow-[0_6px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all"
            >
              {" "}
              Support Us{" "}
            </Link>{" "}
            <button
              className="xl:hidden flex flex-col gap-[5px] w-7 py-1 z-[110]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {" "}
              <span
                className={`w-full h-[2.5px] rounded transition-all origin-center ${scrolled ? "bg-primary" : "bg-white"} ${mobileOpen ? "rotate-45 translate-y-[7.5px]" : ""}`}
              />{" "}
              <span
                className={`w-full h-[2.5px] rounded transition-all ${scrolled ? "bg-primary" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`}
              />{" "}
              <span
                className={`w-full h-[2.5px] rounded transition-all origin-center ${scrolled ? "bg-primary" : "bg-white"} ${mobileOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`}
              />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </header>{" "}
      {/* Mobile Overlay */}{" "}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-primary/70 z-[104] transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}{" "}
      {/* Mobile Nav */}{" "}
      <nav
        className={`fixed top-0 right-0 w-full max-w-[380px] h-screen bg-white z-[105] transition-transform duration-400 overflow-y-auto pt-24 px-6 pb-6 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Mobile Navigation"
      >
        {" "}
        <ul>
          {" "}
          {navItems.map((item) => (
            <li key={item.label}>
              {" "}
              {item.href ? (
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3.5 font-semibold text-black border-b border-black/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {" "}
                  {item.label}{" "}
                </Link>
              ) : (
                <>
                  {" "}
                  <button
                    className="flex items-center justify-between w-full py-3.5 font-semibold text-black border-b border-black/10"
                    onClick={() => toggleSub(item.label)}
                  >
                    {" "}
                    {item.label}{" "}
                    <i
                      className={`fas fa-chevron-down text-xs transition-transform ${openSub === item.label ? "rotate-180" : ""}`}
                    />{" "}
                  </button>{" "}
                  {openSub === item.label && item.children && (
                    <ul className="pl-6 pb-2">
                      {" "}
                      {item.children.map((child) => (
                        <li key={child.label}>
                          {" "}
                          <Link
                            href={child.href || "#"}
                            className="block py-2 text-sm text-black/70 hover:text-primary"
                            onClick={() => setMobileOpen(false)}
                          >
                            {" "}
                            {child.label}{" "}
                          </Link>{" "}
                        </li>
                      ))}{" "}
                    </ul>
                  )}{" "}
                </>
              )}{" "}
            </li>
          ))}{" "}
          <li className="mt-6">
            {" "}
            <Link
              href="/support-us"
              className="block w-full text-center py-3 bg-primary text-white rounded-full font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              {" "}
              Support Us{" "}
            </Link>{" "}
          </li>{" "}
        </ul>{" "}
      </nav>{" "}
    </>
  );
}
