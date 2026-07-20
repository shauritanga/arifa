import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SiteChrome from "./components/SiteChrome";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "ARIFA | Africa Research Institute For AI",
  description:
    "ARIFA is advancing artificial intelligence research, training, and innovation across Africa. Explore our research projects, certification programs, and industry partnerships.",
  keywords:
    "AI research Africa, artificial intelligence Tanzania, ARIFA, machine learning Africa, data science training",
  authors: [{ name: "ARIFA" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://arifa.org",
  ),
  openGraph: {
    title: "ARIFA | Africa Research Institute For AI",
    description:
      "Advancing artificial intelligence research, training, and innovation across Africa.",
    url: "/",
    type: "website",
    siteName: "ARIFA",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ARIFA social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ARIFA | Africa Research Institute For AI",
    description:
      "Advancing artificial intelligence research, training, and innovation across Africa.",
    images: [
      {
        url: "/twitter-image",
        alt: "ARIFA social preview",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} ${sourceSerif.variable} scroll-smooth`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-canvas text-ink-soft">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[200] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
        >
          Skip to main content
        </a>
        <SiteChrome header={<Header />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
