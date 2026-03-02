import { Mail, Phone, MapPin, Clock } from "lucide-react";

const CONTACT_ITEMS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@laundryku.com",
    href: "mailto:hello@laundryku.com",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Jakarta, Indonesia",
  },
  {
    icon: Clock,
    label: "Jam Operasional",
    value: "Senin — Jumat, 09.00 — 18.00 WIB",
  },
];

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-4">
      <h3
        style={{
          fontFamily: "Manrope, system-ui",
          fontWeight: 800,
          fontSize: "1.25rem",
          color: "#0B1D35",
          marginBottom: 4,
        }}
      >
        Informasi Kontak
      </h3>
      <p
        style={{
          fontFamily: "Nunito Sans, system-ui",
          fontSize: "0.925rem",
          lineHeight: 1.7,
          color: "#5A6B80",
          marginBottom: 8,
        }}
      >
        Punya pertanyaan atau butuh bantuan? Hubungi tim kami dan kami akan
        dengan senang hati membantu Anda.
      </p>

      <div className="flex flex-col gap-4">
        {CONTACT_ITEMS.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              className="flex items-start gap-4 rounded-2xl p-5"
              style={{ border: "1.5px solid #E8EDF2", background: "white" }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center"
                style={{
                  borderRadius: 12,
                  background: "rgba(0,180,216,0.08)",
                }}
              >
                <Icon size={20} color="#00B4D8" />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Manrope, system-ui",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    color: "#8899AA",
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "Nunito Sans, system-ui",
                    fontSize: "0.925rem",
                    color: "#0B1D35",
                    fontWeight: 600,
                  }}
                >
                  {item.value}
                </p>
              </div>
            </div>
          );

          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all hover:opacity-80"
              >
                {content}
              </a>
            );
          }

          return <div key={item.label}>{content}</div>;
        })}
      </div>
    </div>
  );
}
