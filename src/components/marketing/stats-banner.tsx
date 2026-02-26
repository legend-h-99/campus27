import { CountUp } from "@/components/ui/count-up";
import { FadeInSection } from "@/components/ui/fade-in-section";

interface StatsBannerProps {
  locale: string;
}

export function StatsBanner({ locale }: StatsBannerProps) {
  const isAr = locale === "ar";
  const stats = [
    { value: 200, prefix: "+", suffix: "",    label: isAr ? "كلية تثق بنا"     : "Colleges Trust Us"  },
    { value: 94,  prefix: "",  suffix: "%",   label: isAr ? "معدل الحضور"      : "Attendance Rate"    },
    { value: 50,  prefix: "+", suffix: "",    label: isAr ? "تخصصاً مدعوماً"   : "Supported Majors"   },
    { value: 99,  prefix: "",  suffix: ".9%", label: isAr ? "وقت تشغيل مضمون" : "Guaranteed Uptime"  },
  ];

  return (
    <FadeInSection>
      <section
        className="relative overflow-hidden py-16"
        style={{ background: "var(--bs-steel)" }}
      >
        {/* Noise overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.04 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="stats-noise-bs">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#stats-noise-bs)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-4xl font-bold text-white md:text-5xl"
                  style={{ fontFamily: "var(--bs-mono)" }}
                >
                  <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
