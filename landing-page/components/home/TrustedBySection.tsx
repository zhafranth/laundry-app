import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function TrustedBySection() {
  return (
    <section className="border-b border-gray-300 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p
          className="mb-8 text-center"
          style={{
            fontFamily: "Nunito Sans, system-ui",
            fontSize: "0.9rem",
            color: "#8899AA",
          }}
        >
          Dipercaya oleh 2.000+ laundry di seluruh Indonesia
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex h-10 w-28 items-center justify-center rounded-lg sm:w-32"
              style={{ background: "#E8EDF2" }}
            >
              <span
                style={{
                  fontFamily: "Manrope, system-ui",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  color: "#8899AA",
                }}
              >
                Partner {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
