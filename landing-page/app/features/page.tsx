import type { Metadata } from "next";
import { FeatureGrid } from "@/components/features/FeatureGrid";
import { ComparisonTable } from "@/components/features/ComparisonTable";
import { PricingCards } from "@/components/features/PricingCards";
import { CTASection } from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Fitur & Harga",
  description:
    "12 fitur lengkap untuk mengelola operasional, keuangan, dan insight bisnis laundry. Mulai dari Rp 99.000/bulan.",
};

export default function FeaturesPage() {
  return (
    <>
      <FeatureGrid />
      <ComparisonTable />
      <PricingCards />
      <CTASection />
    </>
  );
}
