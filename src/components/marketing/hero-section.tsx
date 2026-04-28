import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  locale: string;
}

// Unsplash: modern academic institution, architectural, cinematic
const BG_IMAGE =
  "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80";

export function HeroSection({ locale }: HeroSectionProps) {
  const isAr = locale === "ar";

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-20 ps-8 pe-8"
      style={{
        backgroundImage: `url(${BG_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/55 to-transparent" />

      {/* Noise overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hero-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-noise)" />
      </svg>

      {/* Content — bottom-start */}
      <div className="relative z-10 max-w-2xl">
        {/* Badge */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300"
          style={{ animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          {isAr ? "منصة معتمدة للكليات التقنية" : "Certified Platform for Technical Colleges"}
        </div>

        {/* Dramatic headline */}
        <h1
          className="mb-6 text-white"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
        >
          <span className="block text-5xl font-bold leading-tight lg:text-7xl">
            {isAr ? "إدارة الكلية" : "College Management"}
          </span>
          <span
            className="block text-5xl leading-tight text-teal-400 lg:text-7xl"
            style={{ fontFamily: "var(--font-drama)", fontStyle: "italic", fontWeight: 800 }}
          >
            {isAr ? "بـ ذكاء." : "with Intelligence."}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-8 max-w-xl text-lg leading-relaxed text-slate-300"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
        >
          {isAr
            ? "من القبول إلى التخرج — كل شيء في مكان واحد، بالعربية والإنجليزية"
            : "From Admission to Graduation — Everything in One Place, Arabic & English"}
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap items-center gap-3"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
        >
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg
                       transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-xl active:scale-95"
          >
            {isAr ? "ابدأ تجربتك المجانية" : "Start Free Trial"}
            {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </Link>
          <Link
            href="/features"
            className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm
                       transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5 active:scale-95"
          >
            {isAr ? "اكتشف الميزات" : "Explore Features"}
          </Link>
        </div>

        {/* Floating stats */}
        <div
          className="mt-10 flex flex-wrap gap-6"
          style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.65s both" }}
        >
          {[
            { n: "+200", l: isAr ? "كلية" : "Colleges" },
            { n: "94%",  l: isAr ? "معدل حضور" : "Attendance" },
            { n: "99.9%",l: isAr ? "وقت تشغيل" : "Uptime" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold text-white">{s.n}</p>
              <p className="text-xs text-slate-400">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 start-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40"
        style={{ animation: "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.8s both" }}
      >
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-white/30" />
        <p className="text-xs font-mono">{isAr ? "مرر للأسفل" : "scroll"}</p>
      </div>
    </section>
  );
}
