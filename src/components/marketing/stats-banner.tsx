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
      <section className="relative overflow-hidden bg-teal-900 py-16">
        {/* Noise overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="stats-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#stats-noise)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-white md:text-5xl">
                  <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm text-teal-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
