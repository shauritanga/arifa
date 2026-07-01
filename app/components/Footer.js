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
  { label: "ARIFA Journal (IJAIT)", href: "https://ijait.arifa.org" },
  { label: "Short Courses", href: "/training/short-courses" },
  { label: "Annual Calendar", href: "/calendar" },
  { label: "Industry Engagement", href: "/industry/levels-of-engagement-and-support" },
  { label: "Our Team", href: "/team" },
];

const socials = [
  { icon: "fab fa-facebook-f", href: "https://www.facebook.com/", label: "Facebook" },
  { icon: "fab fa-twitter", href: "https://www.twitter.com/", label: "Twitter" },
  { icon: "fab fa-linkedin-in", href: "https://www.linkedin.com/", label: "LinkedIn" },
  { icon: "fab fa-instagram", href: "https://www.instagram.com/", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70 pt-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/8">
          {/* About Column */}
          <div className="max-w-[320px]">
            <Image
              src="https://arifa.org/assets/img/black-logo3.png"
              alt="ARIFA Logo"
              width={140}
              height={40}
              className="h-10 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-sm leading-relaxed mb-6">
              The Africa Research Institute for AI is dedicated to advancing
              artificial intelligence research, training, and innovation across
              the African continent.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/8 text-white/60 text-sm hover:bg-primary hover:text-white transition-all"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-secondary hover:pl-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-secondary hover:pl-1 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-white/6 text-secondary shrink-0 text-sm">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <p className="text-sm">
                  YMCA Building, Upanga Rd,
                  <br />
                  Box 2512, Ilala CBD,
                  <br />
                  Dar es Salaam, Tanzania
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-white/6 text-secondary shrink-0 text-sm">
                  <i className="fas fa-envelope" />
                </div>
                <p className="text-sm">
                  <a
                    href="mailto:info@arifa.org"
                    className="text-white/60 hover:text-secondary"
                  >
                    info@arifa.org
                  </a>
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-white/6 text-secondary shrink-0 text-sm">
                  <i className="fas fa-clock" />
                </div>
                <p className="text-sm">Mon – Sat: 8:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 text-xs text-white/40 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Africa Research Institute for AI
            (ARIFA). All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-secondary">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-secondary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
