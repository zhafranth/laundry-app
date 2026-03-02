import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Instagram, Mail, Phone } from "lucide-react";

const FOOTER_LINKS = {
  Produk: [
    { label: "Fitur", href: "/features" },
    { label: "Harga", href: "/features#pricing" },
    { label: "Blog", href: "/blog" },
  ],
  Perusahaan: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Kontak", href: "/contact" },
  ],
  Legal: [
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <BrandLogo size="sm" light />
            <p
              className="mt-4 text-sm leading-relaxed text-gray-500"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Dashboard manajemen laundry terlengkap untuk UMKM Indonesia.
              Kelola cerdas, untung lebih.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-gray-500 transition-colors hover:bg-primary-500 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="mailto:hello@laundryku.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-gray-500 transition-colors hover:bg-primary-500 hover:text-white"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
              <a
                href="tel:+6281234567890"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-gray-500 transition-colors hover:bg-primary-500 hover:text-white"
                aria-label="Phone"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                className="mb-4 text-sm font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="my-10 border-navy-800" />

        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} LaundryKu. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
