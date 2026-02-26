import { Link } from "@/i18n/routing";
import { Check } from "lucide-react";

interface PricingSectionProps {
  locale: string;
}

export function PricingSection({ locale }: PricingSectionProps) {
  const isAr = locale === "ar";

  const tiers = [
    {
      name: isAr ? "أساسي" : "Essential",
      price: isAr ? "مجاني" : "Free",
      sub: isAr ? "للبدء الفوري" : "To get started",
      features: isAr
        ? ["حتى 25 متدرب", "جدولة أساسية", "تقارير أسبوعية", "دعم عبر البريد"]
        : ["Up to 25 trainees", "Basic scheduling", "Weekly reports", "Email support"],
      cta: isAr ? "ابدأ مجانًا" : "Start Free",
      href: "/contact",
      highlighted: false,
    },
    {
      name: isAr ? "متقدم" : "Performance",
      price: isAr ? "199 ر.س" : "$55",
      sub: isAr ? "شهريًا / لكل فريق" : "per month / team",
      features: isAr
        ? ["متدربون غير محدودين", "تتبع الأداء لحظيًا", "تقارير احترافية", "جدولة ذكية بـ AI", "تكاملات مرنة", "أولوية الدعم"]
        : ["Unlimited trainees", "Real-time performance", "Professional reports", "AI smart scheduling", "Flexible integrations", "Priority support"],
      cta: isAr ? "ابدأ التجربة" : "Start Trial",
      href: "/contact",
      highlighted: true,
    },
    {
      name: isAr ? "مؤسسي" : "Enterprise",
      price: isAr ? "تواصل معنا" : "Contact Us",
      sub: isAr ? "لفرق 100+" : "for 100+ teams",
      features: isAr
        ? ["كل ميزات متقدم", "SSO وأمان متقدم", "SLA مضمون 99.9%", "مدير حساب مخصص", "تدريب مخصص", "API كامل"]
        : ["Everything in Performance", "SSO & advanced security", "99.9% SLA guarantee", "Dedicated account manager", "Custom training", "Full API access"],
      cta: isAr ? "تواصل مع المبيعات" : "Talk to Sales",
      href: "/contact",
      highlighted: false,
    },
  ];

  return (
    <section className="py-24" style={{ background: "var(--bs-concrete)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}
          >
            {isAr ? "// التسعير" : "// Pricing"}
          </p>
          <h2
            className="text-3xl font-extrabold md:text-4xl"
            style={{ color: "var(--bs-steel)", fontFamily: "var(--bs-grotesk)" }}
          >
            {isAr ? "اختر ما يناسبك" : "Choose Your Scale"}
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--bs-muted)" }}>
            {isAr
              ? "جميع الباقات تشمل وصولاً فوريًا — لا بطاقة ائتمان مطلوبة"
              : "All plans include instant access — no credit card required"}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="relative flex flex-col rounded-3xl p-8 transition-all duration-300"
              style={
                tier.highlighted
                  ? {
                      background: "var(--bs-steel)",
                      border: "2px solid var(--bs-signal)",
                      boxShadow: "0 8px 40px rgba(255,59,48,0.18)",
                      transform: "scale(1.03)",
                    }
                  : {
                      background: "#fff",
                      border: "1px solid rgba(28,28,30,0.08)",
                      boxShadow: "0 2px 12px rgba(28,28,30,0.05)",
                    }
              }
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div
                  className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                  style={{ background: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}
                >
                  {isAr ? "الأكثر شيوعًا" : "Most Popular"}
                </div>
              )}

              {/* Name */}
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{
                  color: tier.highlighted ? "rgba(255,255,255,0.5)" : "var(--bs-muted)",
                  fontFamily: "var(--bs-mono)",
                }}
              >
                {tier.name}
              </p>

              {/* Price */}
              <p
                className="mt-4 text-4xl font-extrabold"
                style={{
                  color: tier.highlighted ? "#fff" : "var(--bs-steel)",
                  fontFamily: "var(--bs-grotesk)",
                }}
              >
                {tier.price}
              </p>
              <p
                className="text-sm"
                style={{ color: tier.highlighted ? "rgba(255,255,255,0.45)" : "var(--bs-muted)" }}
              >
                {tier.sub}
              </p>

              {/* Divider */}
              <div
                className="my-6 h-px"
                style={{
                  background: tier.highlighted ? "rgba(255,255,255,0.1)" : "rgba(28,28,30,0.07)",
                }}
              />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: tier.highlighted ? "var(--bs-signal)" : "var(--bs-signal)" }}
                    />
                    <span style={{ color: tier.highlighted ? "rgba(255,255,255,0.75)" : "var(--bs-muted)" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.href}
                className="mt-8 block rounded-2xl py-3 text-center text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={
                  tier.highlighted
                    ? { background: "var(--bs-signal)", color: "#fff" }
                    : {
                        background: "rgba(28,28,30,0.05)",
                        color: "var(--bs-steel)",
                        border: "1px solid rgba(28,28,30,0.12)",
                      }
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
