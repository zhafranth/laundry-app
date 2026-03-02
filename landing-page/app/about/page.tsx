import type { Metadata } from "next";
import { VisionSection } from "@/components/about/VisionSection";
import { TeamSection } from "@/components/about/TeamSection";
import { StatsSection } from "@/components/about/StatsSection";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kenali LaundryKu — platform manajemen laundry #1 di Indonesia yang membantu UMKM laundry go digital.",
};

export default function AboutPage() {
  return (
    <>
      <VisionSection />
      <StatsSection />
      <TeamSection />
      <CTASection />
    </>
  );
}
