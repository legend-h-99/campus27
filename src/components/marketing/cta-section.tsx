import { Link } from "@/i18n/routing";
import { FadeInSection } from "@/components/ui/fade-in-section";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";

interface CTASectionProps {
  locale: string;
}

export function CTASection({ locale }: CTASectionProps) {
  const isAr = locale === "ar";

  return (
    <FadeInSection>
      <section className="bg-gradient-to-br from-teal-600 to-teal-700 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {isAr ? "جاهز لتحديث إدارة كليتك؟" : "Ready to Transform Your College?"}
          </h2>
          <p className="mb-8 text-lg text-teal-100">
            {isAr
              ? "انضم لأكثر من 200 كلية تقنية تثق بمنصة Saohil1"
              : "Join 200+ technical colleges that trust Saohil1"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-teal-700 shadow-md transition-all hover:bg-teal-50 hover:shadow-lg active:scale-95"
            >
              {isAr ? "ابدأ الآن مجاناً" : "Start Free Now"}
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-xl border border-teal-400 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-teal-500 active:scale-95"
            >
              <MessageSquare className="h-4 w-4" />
              {isAr ? "تواصل مع فريق المبيعات" : "Talk to Sales"}
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
