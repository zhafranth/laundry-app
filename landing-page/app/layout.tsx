import type { Metadata } from "next";
import { Manrope, Nunito_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LaundryKu — Kelola Cerdas, Untung Lebih",
    template: "%s | LaundryKu",
  },
  description:
    "Dashboard manajemen laundry terlengkap untuk UMKM Indonesia. Catat order, kelola keuangan, dan dapatkan insight bisnis cerdas.",
  keywords: [
    "laundry",
    "manajemen laundry",
    "dashboard laundry",
    "UMKM",
    "Indonesia",
    "software laundry",
  ],
  metadataBase: new URL("https://laundryku.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "LaundryKu",
    title: "LaundryKu — Kelola Cerdas, Untung Lebih",
    description:
      "Dashboard manajemen laundry terlengkap untuk UMKM Indonesia.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LaundryKu",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Dashboard manajemen laundry terlengkap untuk UMKM Indonesia. Catat order, kelola keuangan, dan dapatkan insight bisnis cerdas.",
  url: "https://laundryku.com",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "99000",
    highPrice: "199000",
    priceCurrency: "IDR",
  },
  publisher: {
    "@type": "Organization",
    name: "LaundryKu",
    url: "https://laundryku.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} ${nunitoSans.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
