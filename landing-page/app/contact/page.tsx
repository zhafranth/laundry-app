import type { Metadata } from "next";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi tim LaundryKu untuk pertanyaan, dukungan, atau kerja sama. Kami siap membantu Anda.",
};

export default function ContactPage() {
  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl text-center mb-14">
        <p
          className="mb-3"
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#00B4D8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Kontak
        </p>
        <h1
          style={{
            fontFamily: "Manrope, system-ui",
            fontWeight: 800,
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            color: "#0B1D35",
            lineHeight: 1.2,
          }}
        >
          Ada Pertanyaan?{" "}
          <span style={{ color: "#00B4D8" }}>Hubungi Kami</span>
        </h1>
        <p
          className="mx-auto mt-4 max-w-xl"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#5A6B80",
          }}
        >
          Kami selalu senang mendengar dari Anda. Isi form di bawah atau hubungi
          kami langsung.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <ContactForm />
        <ContactInfo />
      </div>
    </SectionWrapper>
  );
}
