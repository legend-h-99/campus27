import { HeroSection } from "@/components/marketing/hero-section";
import { StatsBanner } from "@/components/marketing/stats-banner";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { CTASection } from "@/components/marketing/cta-section";

export default async function MarketingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <HeroSection locale={locale} />
      <StatsBanner locale={locale} />
      <FeaturesGrid locale={locale} />
      <CTASection locale={locale} />
    </>
  );
}
