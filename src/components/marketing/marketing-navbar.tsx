"use client";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function MarketingNavbar() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/features", label: isAr ? "الميزات" : "Features" },
    { href: "/pricing", label: isAr ? "التسعير" : "Pricing" },
    { href: "/contact", label: isAr ? "تواصل معنا" : "Contact" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur-md border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-sm">
            S
          </div>
          <span className="text-lg font-bold text-slate-900">Saohil1</span>
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-600"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-600"
          >
            {isAr ? "تسجيل الدخول" : "Sign In"}
          </Link>
          <Link
            href="/contact"
            className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-md active:scale-95"
          >
            {isAr ? "ابدأ تجربتك" : "Get Started"}
          </Link>
        </div>
        <button
          className="flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={isAr ? "فتح/إغلاق القائمة" : "Toggle menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-slate-100 bg-white px-6 pb-4 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-3 text-sm font-medium text-slate-700"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 block rounded-xl bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            {isAr ? "ابدأ تجربتك" : "Get Started"}
          </Link>
        </div>
      )}
    </header>
  );
}
