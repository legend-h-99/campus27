import { HeroSection }       from "@/components/marketing/hero-section";
import { StatsBanner }       from "@/components/marketing/stats-banner";
import { FeaturesGrid }      from "@/components/marketing/features-grid";
import { PhilosophySection } from "@/components/marketing/philosophy-section";
import { ProtocolSection }   from "@/components/marketing/protocol-section";
import { PricingSection }    from "@/components/marketing/pricing-section";
import { CTASection }        from "@/components/marketing/cta-section";

export default async function MarketingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      <HeroSection       locale={locale} />
      <StatsBanner       locale={locale} />
      <FeaturesGrid      locale={locale} />
      <PhilosophySection locale={locale} />
      <ProtocolSection   locale={locale} />
      <PricingSection    locale={locale} />
      <CTASection        locale={locale} />
    </>
  );
}
