import { FadeInSection } from "@/components/ui/fade-in-section";
import { FeaturesGrid } from "@/components/marketing/features-grid";

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-4 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            {isAr ? "ميزات منصة Saohil1" : "Saohil1 Platform Features"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
            {isAr
              ? "منصة شاملة تغطي كل احتياجات كليتك التقنية من يوم القبول حتى يوم التخرج"
              : "A comprehensive platform covering all your technical college needs from admission to graduation"}
          </p>
        </FadeInSection>
      </div>
      <FeaturesGrid locale={locale} />
    </div>
  );
}
