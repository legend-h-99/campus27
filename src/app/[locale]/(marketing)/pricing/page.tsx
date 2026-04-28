import { FadeInSection } from "@/components/ui/fade-in-section";
import { StaggerChildren } from "@/components/ui/stagger-children";
import { Link } from "@/i18n/routing";
import { Check } from "lucide-react";

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const plans = [
    {
      nameEn: "Starter",
      name: isAr ? "المبتدئ" : "Starter",
      price: "1,200",
      currency: isAr ? "ر.س/شهر" : "SAR/mo",
      description: isAr ? "للمعاهد الصغيرة" : "For small institutes",
      limit: isAr ? "حتى 500 طالب" : "Up to 500 students",
      highlight: false,
      features: [
        isAr ? "إدارة الطلاب والمدربين" : "Students & trainers management",
        isAr ? "الجداول الأساسية" : "Basic scheduling",
        isAr ? "التقارير الأساسية" : "Basic reports",
        isAr ? "دعم بالبريد الإلكتروني" : "Email support",
      ],
    },
    {
      nameEn: "Professional",
      name: isAr ? "الاحترافي" : "Professional",
      price: "3,500",
      currency: isAr ? "ر.س/شهر" : "SAR/mo",
      description: isAr ? "للكليات المتوسطة" : "For mid-size colleges",
      limit: isAr ? "حتى 5,000 طالب" : "Up to 5,000 students",
      highlight: true,
      features: [
        isAr ? "كل ميزات المبتدئ" : "All Starter features",
        isAr ? "الذكاء الاصطناعي" : "AI insights",
        isAr ? "إدارة الجودة والاعتماد" : "Quality & accreditation",
        isAr ? "الإدارة المالية الكاملة" : "Full finance management",
        isAr ? "دعم ذو أولوية" : "Priority support",
      ],
    },
    {
      nameEn: "Enterprise",
      name: isAr ? "المؤسسي" : "Enterprise",
      price: isAr ? "تواصل معنا" : "Contact Us",
      currency: "",
      description: isAr ? "للجامعات والمجموعات" : "For universities & groups",
      limit: isAr ? "طلاب غير محدودين" : "Unlimited students",
      highlight: false,
      features: [
        isAr ? "كل ميزات الاحترافي" : "All Professional features",
        isAr ? "API مخصص" : "Custom API access",
        isAr ? "تكامل الأنظمة الخارجية" : "External system integration",
        isAr ? "مدير حساب مخصص" : "Dedicated account manager",
        isAr ? "SLA مضمون 99.9%" : "99.9% SLA guarantee",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInSection className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            {isAr ? "خطط تناسب كل مؤسسة" : "Plans for Every Institution"}
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "ابدأ مجاناً لمدة 30 يوماً. لا تحتاج بطاقة ائتمانية."
              : "Start free for 30 days. No credit card required."}
          </p>
        </FadeInSection>

        <StaggerChildren className="grid gap-6 md:grid-cols-3" staggerMs={100} initialDelay={100}>
          {plans.map((plan) => (
            <div
              key={plan.nameEn}
              className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-teal-300 bg-white shadow-xl shadow-teal-100/50 ring-2 ring-teal-200"
                  : "border-slate-200 bg-white shadow-sm hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-teal-600 px-4 py-1 text-xs font-semibold text-white">
                    {isAr ? "الأكثر شيوعاً" : "Most Popular"}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {plan.price}
                {plan.currency && (
                  <span className="text-base font-normal text-slate-500"> {plan.currency}</span>
                )}
              </p>
              <p className="mt-1 text-xs font-medium text-teal-600">{plan.limit}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-8 block rounded-xl px-4 py-3 text-center text-sm font-semibold transition-all active:scale-95 ${
                  plan.highlight
                    ? "bg-teal-600 text-white shadow-md hover:bg-teal-700 hover:shadow-lg"
                    : "border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                }`}
              >
                {plan.nameEn === "Enterprise"
                  ? isAr ? "تواصل مع فريق المبيعات" : "Contact Sales"
                  : isAr ? "ابدأ مجاناً" : "Start Free"}
              </Link>
            </div>
          ))}
        </StaggerChildren>
      </div>
    </div>
  );
}
