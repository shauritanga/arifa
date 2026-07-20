import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "About ARIFA", href: "/about" },
  { label: "Research Projects", href: "/research/research-projects" },
  { label: "Publications", href: "/publications" },
  { label: "Certifications", href: "/training/certifications" },
  { label: "Events", href: "/events" },
  { label: "Careers", href: "/opportunities/careers" },
];

const resources = [
  {
    label: "ICAFoW 2026 Conference",
    href: "https://aiconference.arifa.org",
  },
  { label: "ARIFA Journal (IJAIT)", href: "https://ijait.arifa.org" },
  { label: "Short Courses", href: "/training/short-courses" },
  { label: "Annual Calendar", href: "/calendar" },
  {
    label: "Industry Engagement",
    href: "/industry/levels-of-engagement-and-support",
  },
  { label: "Our Team", href: "/team" },
];

const socials = [
  {
    icon: "fab fa-linkedin-in",
    href: "https://www.linkedin.com/company/arifaai/",
    label: "LinkedIn",
  },
  {
    icon: "fab fa-facebook-f",
    href: "https://www.facebook.com/arifa1ai",
    label: "Facebook",
  },
  {
    icon: "fab fa-twitter",
    href: "https://twitter.com/arifa__ai",
    label: "Twitter",
  },
  {
    icon: "fab fa-instagram",
    href: "https://www.instagram.com/arifa_ai/",
    label: "Instagram",
  },
  {
    icon: "fab fa-youtube",
    href: "https://www.youtube.com/@ARIFA_AI",
    label: "YouTube",
  },
  {
    icon: "fab fa-tiktok",
    href: "https://www.tiktok.com/ARIFA_AI",
    label: "TikTok",
  },
];

export default function Footer() {
  return (
    <footer className="bg-night text-white/75 pt-16 md:pt-20 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          <div className="max-w-[22rem]">
            <Image
              src="https://arifa.org/assets/img/black-logo3.png"
              alt="ARIFA Logo"
              width={240}
              height={72}
              className="h-14 w-auto mb-5 brightness-0 invert opacity-95"
            />
            <p className="text-sm leading-relaxed mb-6 text-white/60">
              The Africa Research Institute For AI is dedicated to advancing
              artificial intelligence research, training, and innovation across
              the African continent.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-md flex items-center justify-center bg-white/6 border border-white/10 text-white/70 text-sm hover:bg-primary hover:border-primary hover:text-white"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-5">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("http") ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/55 hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide mb-5">
              Contact Us
            </h4>
            <div className="space-y-4 text-sm text-white/55">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/6 border border-white/10 text-white/70 shrink-0 text-xs">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <p className="leading-relaxed">
                  Old Bagamoyo Road, Brown Street, <br /> Box 2512, Mbezi Beach,
                  Kinondoni, <br /> Dar es Salaam, Tanzania
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/6 border border-white/10 text-white/70 shrink-0 text-xs">
                  <i className="fas fa-envelope" />
                </div>
                <a
                  href="mailto:info@arifa.org"
                  className="text-white/70 hover:text-white"
                >
                  info@arifa.org
                </a>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-white/6 border border-white/10 text-white/70 shrink-0 text-xs">
                  <i className="fas fa-clock" />
                </div>
                <p>Mon – Sat: 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-xs text-white/40 gap-3">
          <p>
            &copy; {new Date().getFullYear()} Africa Research Institute For AI
            (ARIFA). All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-white/35">Privacy Policy</span>
            <span className="text-white/35">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
