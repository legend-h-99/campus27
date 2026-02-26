import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  locale: string;
}

// Unsplash: high-end training facility, control room, team performance
const BG_IMAGE =
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80";

export function HeroSection({ locale }: HeroSectionProps) {
  const isAr = locale === "ar";

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-20 ps-8 pe-8"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Deep gradient: Steel from bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(28,28,30,0.97) 0%, rgba(28,28,30,0.55) 40%, rgba(28,28,30,0.10) 100%)",
        }}
      />

      {/* SVG noise overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0.035 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-noise-bs">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise-bs)" />
      </svg>

      {/* Accent bar — top edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{ background: "var(--bs-signal)" }}
      />

      {/* Content — bottom-start */}
      <div className="relative z-10 max-w-3xl" style={{ fontFamily: "var(--bs-grotesk)" }}>

        {/* System badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
          style={{
            borderColor: "rgba(255,59,48,0.35)",
            background: "rgba(255,59,48,0.08)",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "var(--bs-mono)",
            animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: "var(--bs-signal)" }}
          />
          {isAr ? "نظام إدارة الكليات التقنية — الإصدار 2.0" : "Technical College Management System — v2.0"}
        </div>

        {/* Dramatic headline */}
        <h1
          className="mb-6 text-white"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
        >
          <span
            className="block font-extrabold leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            {isAr ? "إدارة الكلية" : "College Management"}
          </span>
          <span
            className="block leading-[1.05]"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              color: "var(--bs-signal)",
              fontFamily: "var(--font-drama)",
              fontStyle: "italic",
              fontWeight: 800,
            }}
          >
            {isAr ? "باحترافية تامة." : "Done Right."}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-8 max-w-xl text-lg leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.65)",
            animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both",
          }}
        >
          {isAr
            ? "نظام متكامل لإدارة الكليات التقنية — المتدربون، المدربون، الجداول، والتقارير الأكاديمية. كل شيء في مكان واحد."
            : "Complete system for technical colleges — trainees, trainers, schedules, and academic reports. Everything in one place."}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center gap-3"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
        >
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            style={{ background: "var(--bs-signal)" }}
          >
            {isAr ? "ابدأ مجانًا" : "Start for Free"}
            {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
          <Link
            href="/features"
            className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:-translate-y-0.5 active:scale-95"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            {isAr ? "اكتشف الميزات" : "Explore Features"}
          </Link>
        </div>

        {/* Stats */}
        <div
          className="mt-10 flex flex-wrap gap-8"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}
        >
          {[
            { n: "+200", l: isAr ? "كلية تقنية تثق بنا" : "Technical Colleges" },
            { n: "94%",  l: isAr ? "نسبة إتمام البرامج" : "Program Completion" },
            { n: "3×",   l: isAr ? "أسرع في الجدولة" : "Faster Scheduling" },
          ].map((s) => (
            <div key={s.l}>
              <p
                className="text-2xl font-extrabold text-white"
                style={{ fontFamily: "var(--bs-mono)" }}
              >
                {s.n}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 start-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{
          color: "rgba(255,255,255,0.3)",
          animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.8s both",
        }}
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-white/25" />
        <p className="text-xs" style={{ fontFamily: "var(--bs-mono)" }}>
          {isAr ? "مرر" : "scroll"}
        </p>
      </div>
    </section>
  );
}
