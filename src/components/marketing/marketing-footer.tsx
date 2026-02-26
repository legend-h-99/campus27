import { Link } from "@/i18n/routing";
import { BRAND } from "@/config/brand";

interface MarketingFooterProps {
  locale: string;
}

export function MarketingFooter({ locale }: MarketingFooterProps) {
  const isAr = locale === "ar";

  const year = new Date().getFullYear();

  const navGroups = [
    {
      title: isAr ? "المنتج" : "Product",
      links: [
        { href: "/features", label: isAr ? "الميزات" : "Features" },
        { href: "/pricing",  label: isAr ? "التسعير" : "Pricing"  },
        { href: "/contact",  label: isAr ? "تواصل" : "Contact"    },
      ],
    },
    {
      title: isAr ? "قانوني" : "Legal",
      links: [
        { href: "/privacy", label: isAr ? "الخصوصية" : "Privacy" },
        { href: "/terms",   label: isAr ? "الشروط" : "Terms"      },
      ],
    },
  ];

  return (
    <footer
      className="rounded-t-[3rem]"
      style={{ background: "var(--bs-steel)" }}
    >
      {/* Noise */}
      <div className="relative overflow-hidden rounded-t-[3rem]">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.04 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="footer-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#footer-noise)" />
        </svg>

        <div className="relative mx-auto max-w-7xl px-8 py-16">
          <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-sm text-white"
                  style={{ background: "var(--bs-signal)" }}
                >
                  {BRAND.iconLetter}
                </div>
                <span
                  className="text-base font-bold text-white"
                  style={{ fontFamily: "var(--bs-grotesk)" }}
                >
                  {BRAND.nameAr}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--bs-grotesk)" }}
              >
                {isAr
                  ? "منصة ذكية لإدارة التدريب المؤسسي — تتبع الأداء، جدوِل ببراعة، احصد النتائج."
                  : "Smart enterprise training platform — track performance, schedule brilliantly, harvest results."}
              </p>
            </div>

            {/* Nav columns */}
            {navGroups.map((g) => (
              <div key={g.title}>
                <p
                  className="mb-4 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--bs-mono)" }}
                >
                  {g.title}
                </p>
                <ul className="space-y-2">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="mt-12 flex flex-col items-start justify-between gap-4 border-t pt-8 md:flex-row md:items-center"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            {/* Copyright */}
            <p
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--bs-mono)" }}
            >
              © {year} {BRAND.nameAr}. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>

            {/* SYSTEM OPERATIONAL */}
            <div className="flex items-center gap-2">
              <span
                className="relative flex h-2.5 w-2.5"
              >
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: "#22c55e" }}
                />
                <span
                  className="relative inline-flex h-2.5 w-2.5 rounded-full"
                  style={{ background: "#22c55e" }}
                />
              </span>
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--bs-mono)" }}
              >
                SYSTEM OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
