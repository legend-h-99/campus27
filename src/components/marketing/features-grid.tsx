import { StaggerChildren } from "@/components/ui/stagger-children";
import { FadeInSection } from "@/components/ui/fade-in-section";
import { GraduationCap, Calendar, Award, DollarSign, Brain, BarChart3 } from "lucide-react";

interface FeaturesGridProps {
  locale: string;
}

export function FeaturesGrid({ locale }: FeaturesGridProps) {
  const isAr = locale === "ar";

  const features = [
    {
      icon: GraduationCap,
      title: isAr ? "إدارة الطلاب" : "Student Management",
      desc: isAr ? "تسجيل، حضور، درجات، وتحذيرات مبكرة ذكية" : "Enrollment, attendance, grades, and smart early warnings",
      color: "text-teal-600 bg-teal-50",
    },
    {
      icon: Calendar,
      title: isAr ? "الجداول الذكية" : "Smart Scheduling",
      desc: isAr ? "جداول تلقائية تتجنب التعارضات وتحسن التوزيع" : "Auto-generated schedules with conflict detection",
      color: "text-sky-600 bg-sky-50",
    },
    {
      icon: Award,
      title: isAr ? "الجودة والاعتماد" : "Quality & Accreditation",
      desc: isAr ? "مؤشرات KPI، مسوحات، وخطط تحسين مستمر" : "KPIs, surveys, and continuous improvement plans",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: DollarSign,
      title: isAr ? "الإدارة المالية" : "Finance Management",
      desc: isAr ? "رسوم، فواتير، مدفوعات، ومنح دراسية" : "Fees, invoices, payments, and scholarships",
      color: "text-teal-600 bg-teal-50",
    },
    {
      icon: Brain,
      title: isAr ? "الذكاء الاصطناعي" : "AI-Powered Insights",
      desc: isAr ? "توصيات ذكية وتحليلات تنبؤية للأداء الأكاديمي" : "Smart recommendations and predictive academic analytics",
      color: "text-sky-600 bg-sky-50",
    },
    {
      icon: BarChart3,
      title: isAr ? "التقارير والتحليلات" : "Reports & Analytics",
      desc: isAr ? "تقارير قابلة للتخصيص مع تصدير Excel وPDF" : "Customizable reports with Excel and PDF export",
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            {isAr ? "كل ما تحتاجه في منصة واحدة" : "Everything You Need in One Platform"}
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "أدوات متكاملة صُممت خصيصاً لكليات التقنية والتدريب"
              : "Integrated tools designed specifically for technical colleges"}
          </p>
        </FadeInSection>
        <StaggerChildren className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerMs={80}>
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`mb-4 inline-flex rounded-xl p-2.5 ${f.color}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{f.desc}</p>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
