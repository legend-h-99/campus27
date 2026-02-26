"use client";

import { useEffect, useRef } from "react";

interface ProtocolSectionProps {
  locale: string;
}

// SVG animations for each card step
function GeometricSpin() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-hidden>
      <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,59,48,0.15)" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="20" fill="none" stroke="rgba(255,59,48,0.25)" strokeWidth="1.5" />
      <g style={{ transformOrigin: "40px 40px", animation: "concentric-spin 8s linear infinite" }}>
        <line x1="40" y1="10" x2="40" y2="70" stroke="rgba(255,59,48,0.4)" strokeWidth="1" />
        <line x1="10" y1="40" x2="70" y2="40" stroke="rgba(255,59,48,0.4)" strokeWidth="1" />
      </g>
      <circle cx="40" cy="40" r="4" fill="var(--bs-signal)" />
    </svg>
  );
}

function ScanLine() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-hidden style={{ overflow: "visible" }}>
      {/* Grid */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 20}
            y={row * 20}
            width="18"
            height="18"
            rx="2"
            fill="rgba(255,59,48,0.06)"
            stroke="rgba(255,59,48,0.12)"
            strokeWidth="0.5"
          />
        ))
      )}
      {/* Scan line */}
      <rect
        x="0" y="0" width="80" height="3" rx="1.5"
        fill="var(--bs-signal)"
        style={{ opacity: 0.7, animation: "scan-line 2s ease-in-out infinite" }}
      />
    </svg>
  );
}

function EkgWave() {
  const path = "M0,40 L10,40 L15,20 L20,60 L25,40 L35,40 L40,15 L45,65 L50,40 L60,40 L65,30 L70,50 L75,40 L80,40";
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" aria-hidden>
      <path
        d={path}
        fill="none"
        stroke="var(--bs-signal)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="400"
        style={{ animation: "ekg-draw 2.5s ease-in-out infinite" }}
      />
    </svg>
  );
}

export function ProtocolSection({ locale }: ProtocolSectionProps) {
  const isAr = locale === "ar";
  const containerRef = useRef<HTMLDivElement>(null);

  // CSS-only sticky stacking — no GSAP dependency needed
  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll<HTMLDivElement>("[data-protocol-card]");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLDivElement;
          const index = Number(card.dataset.protocolCard);
          if (!entry.isIntersecting) {
            card.style.transform = `scale(0.92) translateY(-${index * 8}px)`;
            card.style.filter = "blur(2px)";
            card.style.opacity = "0.5";
          } else {
            card.style.transform = "scale(1) translateY(0)";
            card.style.filter = "none";
            card.style.opacity = "1";
          }
        });
      },
      { threshold: 0.6 }
    );

    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: "01",
      title: isAr ? "أعدّ كليتك" : "Set Up Your College",
      desc: isAr
        ? "أنشئ الأقسام والتخصصات والخطط الدراسية في دقائق — وأضف المدربين والمتدربين بسهولة تامة."
        : "Create departments, majors, and study plans in minutes — add trainers and trainees with ease.",
      animation: <GeometricSpin />,
    },
    {
      num: "02",
      title: isAr ? "أدِر بدقة" : "Manage with Precision",
      desc: isAr
        ? "جداول ذكية، حضور آني، درجات مرصودة — وتنبيهات فورية لكل حالة استثنائية."
        : "Smart schedules, real-time attendance, recorded grades — and instant alerts for every exception.",
      animation: <ScanLine />,
    },
    {
      num: "03",
      title: isAr ? "احصد التقارير" : "Generate Reports",
      desc: isAr
        ? "تقارير أكاديمية ومالية وإدارية جاهزة للعرض والتصدير — بيانات حقيقية تدعم القرار."
        : "Academic, financial, and administrative reports ready to present and export — real data that drives decisions.",
      animation: <EkgWave />,
    },
  ];

  return (
    <section
      className="py-24"
      style={{ background: "var(--bs-concrete)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-20 max-w-xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--bs-signal)", fontFamily: "var(--bs-mono)" }}
          >
            {isAr ? "// البروتوكول" : "// Protocol"}
          </p>
          <h2
            className="text-3xl font-extrabold leading-tight md:text-4xl"
            style={{ color: "var(--bs-steel)", fontFamily: "var(--bs-grotesk)" }}
          >
            {isAr ? "ثلاث خطوات. كلية تعمل باحترافية." : "Three Steps. A College Running Professionally."}
          </h2>
        </div>

        {/* Stacked cards */}
        <div ref={containerRef} className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-protocol-card={i}
              className="flex flex-col gap-6 rounded-3xl p-8 transition-all duration-500 md:flex-row md:items-center"
              style={{
                background: "#fff",
                border: "1px solid rgba(28,28,30,0.08)",
                boxShadow: "0 4px 24px rgba(28,28,30,0.06)",
              }}
            >
              {/* Step number */}
              <div className="shrink-0">
                <span
                  className="text-5xl font-extrabold"
                  style={{
                    color: "rgba(28,28,30,0.06)",
                    fontFamily: "var(--bs-mono)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.num}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3
                  className="mb-2 text-xl font-bold"
                  style={{ color: "var(--bs-steel)", fontFamily: "var(--bs-grotesk)" }}
                >
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--bs-muted)" }}>
                  {step.desc}
                </p>
              </div>

              {/* Animation */}
              <div
                className="flex shrink-0 items-center justify-center rounded-2xl p-4"
                style={{ background: "rgba(28,28,30,0.03)", border: "1px solid rgba(28,28,30,0.06)" }}
              >
                {step.animation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
