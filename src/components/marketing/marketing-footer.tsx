import Link from "next/link";

interface MarketingFooterProps {
  locale: string;
}

export function MarketingFooter({ locale }: MarketingFooterProps) {
  const isAr = locale === "ar";

  return (
    <footer className="border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white font-bold text-xs">
              S
            </div>
            <span className="font-semibold text-slate-900">Saohil1</span>
            <span className="text-sm text-slate-400">
              {isAr ? "© 2026 جميع الحقوق محفوظة" : "© 2026 All rights reserved"}
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link href={`/${locale}/features`} className="hover:text-teal-600 transition-colors">
              {isAr ? "الميزات" : "Features"}
            </Link>
            <Link href={`/${locale}/pricing`} className="hover:text-teal-600 transition-colors">
              {isAr ? "التسعير" : "Pricing"}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-teal-600 transition-colors">
              {isAr ? "تواصل معنا" : "Contact"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
