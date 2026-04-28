import { FadeInSection } from "@/components/ui/fade-in-section";
import { CheckCircle, Clock, Shield } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const trustSignals = [
    { icon: Clock, text: isAr ? "يتواصل معك فريقنا خلال 24 ساعة" : "Our team contacts you within 24 hours" },
    { icon: CheckCircle, text: isAr ? "تجربة مجانية كاملة 30 يوماً" : "Full free trial for 30 days" },
    { icon: Shield, text: isAr ? "بدون بطاقة ائتمانية" : "No credit card required" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <FadeInSection className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            {isAr ? "احجز عرضاً توضيحياً مجانياً" : "Book a Free Demo"}
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            {isAr
              ? "أخبرنا عن مؤسستك وسنقدم لك عرضاً مخصصاً"
              : "Tell us about your institution and we'll tailor the demo for you"}
          </p>
        </FadeInSection>

        <FadeInSection delay={100}>
          <div className="grid gap-8 md:grid-cols-2">
            {/* Form card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <form className="space-y-4">
                {[
                  { id: "name", label: isAr ? "الاسم الكامل" : "Full Name", type: "text" },
                  { id: "email", label: isAr ? "البريد الإلكتروني" : "Email Address", type: "email" },
                  { id: "institution", label: isAr ? "اسم المؤسسة" : "Institution Name", type: "text" },
                ].map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="size" className="mb-1.5 block text-sm font-medium text-slate-700">
                    {isAr ? "عدد الطلاب التقريبي" : "Approximate Student Count"}
                  </label>
                  <select
                    id="size"
                    name="size"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="<500">{isAr ? "أقل من 500" : "Less than 500"}</option>
                    <option value="500-2000">{isAr ? "500 – 2,000" : "500 – 2,000"}</option>
                    <option value="2000-10000">{isAr ? "2,000 – 10,000" : "2,000 – 10,000"}</option>
                    <option value=">10000">{isAr ? "أكثر من 10,000" : "More than 10,000"}</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-teal-700 hover:shadow-lg active:scale-95"
                >
                  {isAr ? "احجز العرض التوضيحي" : "Book the Demo"}
                </button>
              </form>
            </div>

            {/* Trust signals */}
            <div className="flex flex-col justify-center space-y-6">
              {trustSignals.map((s) => (
                <div key={s.text} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <p className="pt-2 text-sm text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
