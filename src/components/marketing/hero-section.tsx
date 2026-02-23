import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const isAr = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50 pt-32 pb-20">
      {/* Subtle background radial gradients */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(27,169,160,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(59,172,201,0.06) 0%, transparent 50%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div className="text-center lg:text-start">
            {/* Animated badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-700"
              style={{ animation: "fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) both" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              {isAr ? "منصة معتمدة لكليات التقنية" : "Certified Platform for Technical Colleges"}
            </div>

            {/* Headline */}
            <h1
              className="mb-6 text-4xl font-bold leading-tight text-slate-900 lg:text-5xl xl:text-6xl"
              style={{ animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
            >
              {isAr ? (
                <>
                  إدارة كليتك التقنية
                  <br />
                  <span className="text-teal-600">بذكاء واحترافية</span>
                </>
              ) : (
                <>
                  Manage Your Technical
                  <br />
                  <span className="text-teal-600">College with Intelligence</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="mb-8 text-lg leading-relaxed text-slate-500 lg:text-xl"
              style={{ animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
            >
              {isAr
                ? "من القبول إلى التخرج — كل شيء في مكان واحد، بالعربية والإنجليزية"
                : "From Admission to Graduation — Everything in One Place, Arabic & English"}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={{ animation: "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) 0.3s both" }}
            >
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95"
              >
                {isAr ? "ابدأ تجربتك المجانية" : "Start Free Trial"}
                {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
              </Link>
              <Link
                href="/features"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 active:scale-95"
              >
                <Play className="h-4 w-4" />
                {isAr ? "شاهد العرض التوضيحي" : "Watch Demo"}
              </Link>
            </div>
          </div>

          {/* Floating dashboard mockup */}
          <div
            className="relative"
            style={{ animation: "float-in 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both" }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-teal-100/50">
              {/* Browser chrome bar */}
              <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <div className="mx-4 flex-1 rounded-md bg-slate-200 px-3 py-1 text-xs text-slate-400">
                  app.saohil1.sa
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="space-y-4 p-6">
                {/* Fake KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: isAr ? "الطلاب" : "Students", value: "1,247", color: "bg-teal-50 text-teal-700" },
                    { label: isAr ? "الحضور" : "Attendance", value: "94%", color: "bg-emerald-50 text-emerald-700" },
                    { label: isAr ? "المقررات" : "Courses", value: "86", color: "bg-sky-50 text-sky-700" },
                  ].map((kpi) => (
                    <div key={kpi.label} className={`rounded-xl p-3 ${kpi.color}`}>
                      <p className="text-xs font-medium opacity-70">{kpi.label}</p>
                      <p className="text-xl font-bold">{kpi.value}</p>
                    </div>
                  ))}
                </div>
                {/* Fake chart */}
                <div className="rounded-xl border border-slate-100 p-4">
                  <p className="mb-3 text-xs font-medium text-slate-500">
                    {isAr ? "حضور الأسبوع" : "Weekly Attendance"}
                  </p>
                  <div className="flex h-16 items-end gap-2">
                    {[60, 85, 70, 95, 75, 90, 65].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-teal-500 opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                {/* Fake table rows */}
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-50 p-2">
                      <div className="h-6 w-6 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 w-24 rounded bg-slate-200" />
                        <div className="h-1.5 w-16 rounded bg-slate-100" />
                      </div>
                      <div className="h-5 w-14 rounded-full bg-teal-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating accent chips */}
            <div className="absolute -bottom-4 -start-6 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-lg">
              <span className="font-semibold text-teal-600">+12</span>
              <span className="ms-1 text-slate-500">{isAr ? "متدرب جديد" : "new trainees"}</span>
            </div>
            <div className="absolute -end-4 -top-4 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm shadow-lg">
              <span className="font-semibold text-green-600">94%</span>
              <span className="ms-1 text-slate-500">{isAr ? "معدل الحضور" : "attendance"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
