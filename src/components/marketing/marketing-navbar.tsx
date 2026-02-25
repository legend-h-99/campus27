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
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/features", label: isAr ? "الميزات" : "Features" },
    { href: "/pricing",  label: isAr ? "التسعير" : "Pricing"  },
    { href: "/contact",  label: isAr ? "تواصل معنا" : "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      {/* Floating Pill */}
      <nav
        aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
        className={`flex items-center gap-6 rounded-full px-5 py-2.5 transition-all duration-500
          ${scrolled
            ? "bg-white/85 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-slate-900/10"
            : "bg-transparent border border-white/20"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600 text-white font-bold text-xs shadow-sm">
            C
          </div>
          <span className={`text-sm font-bold transition-colors duration-300 ${scrolled ? "text-slate-900" : "text-white"}`}>
            Campus27
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors duration-300 hover:text-teal-500
                ${scrolled ? "text-slate-600" : "text-white/80"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors duration-300
              ${scrolled ? "text-slate-600 hover:text-teal-600" : "text-white/80 hover:text-white"}`}
          >
            {isAr ? "دخول" : "Sign In"}
          </Link>
          <Link
            href="/contact"
            className="relative overflow-hidden rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md
                       transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            <span className="relative z-10">{isAr ? "ابدأ الآن" : "Get Started"}</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`flex items-center justify-center rounded-full p-1.5 transition-colors md:hidden
            ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-white hover:bg-white/10"}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={isAr ? "القائمة" : "Menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-4 top-14 rounded-2xl border border-slate-100 bg-white/95 backdrop-blur-xl p-4 shadow-xl md:hidden"
          style={{ animation: "scaleIn 0.15s cubic-bezier(0.16,1,0.3,1) both" }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm font-medium text-slate-700 hover:text-teal-600"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-3 block rounded-xl bg-orange-500 px-4 py-2 text-center text-sm font-semibold text-white"
            onClick={() => setMenuOpen(false)}
          >
            {isAr ? "ابدأ الآن" : "Get Started"}
          </Link>
        </div>
      )}
    </header>
  );
}
