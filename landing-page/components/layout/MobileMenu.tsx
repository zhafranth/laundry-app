"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
  pathname: string;
}

export function MobileMenu({ open, onClose, links, pathname }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl"
        style={{ animation: "fade-in 0.2s ease" }}
      >
        <div className="mt-16 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`rounded-lg px-3 py-2.5 text-base font-semibold transition-colors ${
                pathname === link.href
                  ? "bg-primary-500/10 text-primary-500"
                  : "text-navy-950 hover:bg-gray-100"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {link.label}
            </Link>
          ))}

          <hr className="my-2 border-gray-300" />

          <Link href="https://app.laundryku.com/login" onClick={onClose}>
            <Button variant="outline" fullWidth>
              Masuk
            </Button>
          </Link>
          <Link href="https://app.laundryku.com/register" onClick={onClose}>
            <Button fullWidth>Mulai Gratis</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
