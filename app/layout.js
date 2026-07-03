import { Plus_Jakarta_Sans, Nunito } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});
const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
export const metadata = {
  title: "ARIFA — Africa Research Institute for AI",
  description:
    "ARIFA is advancing artificial intelligence research, training, and innovation across Africa. Explore our research projects, certification programs, and industry partnerships.",
  keywords:
    "AI research Africa, artificial intelligence Tanzania, ARIFA, machine learning Africa, data science training",
  authors: [{ name: "ARIFA" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://arifa.org",
  ),
  openGraph: {
    title: "ARIFA — Africa Research Institute for AI",
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
    title: "ARIFA — Africa Research Institute for AI",
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
      className={`${jakartaSans.variable} ${nunito.variable} scroll-smooth`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
