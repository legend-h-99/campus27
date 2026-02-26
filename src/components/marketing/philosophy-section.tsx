"use client";

import { useEffect, useRef } from "react";

interface PhilosophySectionProps {
  locale: string;
}

export function PhilosophySection({ locale }: PhilosophySectionProps) {
  const isAr = locale === "ar";
  const ref = useRef<HTMLDivElement>(null);

  // Staggered word reveal on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLSpanElement>("[data-word]");
    words.forEach((w) => {
      w.style.opacity = "0";
      w.style.transform = "translateY(14px)";
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        words.forEach((w, i) => {
          setTimeout(() => {
            w.style.transition = "opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)";
            w.style.opacity = "1";
            w.style.transform = "translateY(0)";
          }, i * 60);
        });
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const wrap = (text: string, accentWord?: string) =>
    text.split(" ").map((word, i) => (
      <span
        key={i}
        data-word
        className="inline-block"
        style={{
          marginInlineEnd: "0.35em",
          color: accentWord && word === accentWord ? "var(--bs-signal)" : undefined,
        }}
      >
        {word}
      </span>
    ));

  return (
    <section
      className="relative overflow-hidden py-32"
      style={{ background: "var(--bs-steel)" }}
    >
      {/* Noise */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="philo-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#philo-noise)" />
      </svg>

      {/* Signal accent bar */}
      <div
        className="absolute start-0 top-0 h-full w-[3px]"
        style={{ background: "linear-gradient(to bottom, var(--bs-signal), transparent)" }}
      />

      <div className="relative mx-auto max-w-4xl px-8" ref={ref}>
        {/* Label */}
        <p
          className="mb-12 text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}
          data-word
        >
          {isAr ? "// فلسفة العمل" : "// Philosophy"}
        </p>

        {/* Line 1 */}
        <p
          className="mb-4 leading-snug"
          style={{
            fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "var(--bs-grotesk)",
            fontWeight: 600,
          }}
        >
          {isAr
            ? wrap("معظم برامج الإدارة تُعقّد العمليات الأكاديمية.")
            : wrap("Most management systems complicate academic operations.")}
        </p>

        {/* Line 2 — highlighted */}
        <p
          className="leading-snug"
          style={{
            fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
            color: "#fff",
            fontFamily: "var(--font-drama)",
            fontStyle: "italic",
            fontWeight: 700,
          }}
        >
          {isAr
            ? wrap("نحن نُبسّطها باحترافية.", "باحترافية.")
            : wrap("We simplify them. Professionally.", "Professionally.")}
        </p>

        {/* Divider */}
        <div
          className="mt-16 h-px w-24"
          style={{ background: "rgba(255,255,255,0.12)" }}
          data-word
        />
        <p
          className="mt-8 max-w-lg text-base leading-relaxed"
          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--bs-grotesk)" }}
          data-word
        >
          {isAr
            ? "سهيل يضع كل أداة تحتاجها إدارة الكلية في مكان واحد — من القبول إلى التخرج."
            : "Suhail puts every tool a college administration needs in one place — from admission to graduation."}
        </p>
      </div>
    </section>
  );
}
