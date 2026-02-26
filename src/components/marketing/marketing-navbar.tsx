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
    { href: "/contact",  label: isAr ? "تواصل" : "Contact" },
  ];

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav
        aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
        className="flex items-center gap-6 rounded-full px-5 py-2.5 transition-all duration-500"
        style={{
          fontFamily: "var(--bs-grotesk)",
          background: scrolled ? "rgba(240,237,232,0.92)" : "rgba(28,28,30,0.45)",
          backdropFilter: "blur(20px)",
          border: scrolled ? "1px solid rgba(28,28,30,0.12)" : "1px solid rgba(255,255,255,0.12)",
          boxShadow: scrolled ? "0 4px 24px rgba(28,28,30,0.08)" : "none",
        }}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-xl font-bold text-xs text-white"
            style={{ background: "var(--bs-signal)" }}
          >
            س
          </div>
          <span
            className="text-sm font-bold transition-colors duration-300"
            style={{ color: scrolled ? "var(--bs-steel)" : "#fff" }}
          >
            سهيل
          </span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: scrolled ? "var(--bs-muted)" : "rgba(255,255,255,0.8)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: scrolled ? "var(--bs-muted)" : "rgba(255,255,255,0.8)" }}
          >
            {isAr ? "دخول" : "Sign In"}
          </Link>
          <Link
            href="/contact"
            className="relative overflow-hidden rounded-full px-4 py-1.5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
            style={{ background: "var(--bs-signal)" }}
          >
            {isAr ? "ابدأ مجانًا" : "Start Free"}
          </Link>
        </div>

        <button
          className="flex items-center justify-center rounded-full p-1.5 transition-colors md:hidden"
          style={{ color: scrolled ? "var(--bs-steel)" : "#fff" }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={isAr ? "القائمة" : "Menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="absolute inset-x-4 top-14 rounded-2xl p-4 shadow-xl md:hidden"
          style={{
            background: "rgba(240,237,232,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(28,28,30,0.1)",
            animation: "scaleIn 0.15s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block py-2.5 text-sm font-medium"
              style={{ color: "var(--bs-steel)" }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-3 block rounded-xl px-4 py-2 text-center text-sm font-semibold text-white"
            style={{ background: "var(--bs-signal)" }}
            onClick={() => setMenuOpen(false)}
          >
            {isAr ? "ابدأ مجانًا" : "Start Free"}
          </Link>
        </div>
      )}
    </header>
  );
}
