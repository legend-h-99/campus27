import { CountUp } from "@/components/ui/count-up";
import { FadeInSection } from "@/components/ui/fade-in-section";

interface StatsBannerProps {
  locale: string;
}

export function StatsBanner({ locale }: StatsBannerProps) {
  const isAr = locale === "ar";
  const stats = [
    { value: 200, prefix: "+", suffix: "", label: isAr ? "كلية تستخدمنا" : "Colleges Trust Us" },
    { value: 94, prefix: "", suffix: "%", label: isAr ? "معدل الحضور" : "Attendance Rate" },
    { value: 50, prefix: "+", suffix: "", label: isAr ? "تخصصاً مدعوماً" : "Supported Majors" },
    { value: 99, prefix: "", suffix: ".9%", label: isAr ? "وقت تشغيل مضمون" : "Guaranteed Uptime" },
  ];

  return (
    <FadeInSection>
      <section className="border-y border-slate-100 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900 md:text-4xl">
                  <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
