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
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "var(--bs-steel)" }}
      >
        {/* Noise */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.04 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="cta-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cta-noise)" />
        </svg>
        {/* Signal accent line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
          style={{ background: "var(--bs-signal)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}
          >
            {isAr ? "// جاهز؟" : "// Ready?"}
          </p>
          <h2
            className="mb-4 font-extrabold text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontFamily: "var(--bs-grotesk)" }}
          >
            {isAr ? "حوّل تدريب فريقك اليوم" : "Transform Your Team Training Today"}
          </h2>
          <p className="mb-10 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            {isAr
              ? "انضم لأكثر من 500 مؤسسة تثق في سهيل"
              : "Join 500+ organizations that trust Suhail"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
              style={{ background: "var(--bs-signal)" }}
            >
              {isAr ? "ابدأ مجانًا الآن" : "Start Free Now"}
              {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <MessageSquare className="h-4 w-4" />
              {isAr ? "تحدث مع فريق المبيعات" : "Talk to Sales"}
            </Link>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
