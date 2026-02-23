# Saohil1 — Marketing Site + App Enhancement Design
**Date:** 2026-02-23
**Approach:** B — Marketing First, App Second
**Style:** Institutional SaaS (Professional × Modern SaaS balance)

---

## 1. Decisions Made

| القرار | الاختيار | السبب |
|--------|----------|-------|
| موقع الكود | Route group `(marketing)` داخل نفس المشروع | يشارك Design Tokens، نشر واحد، صيانة أقل |
| أسلوب الحركة | Institutional SaaS | مناسب للجهات الحكومية والمستثمرين معاً |
| الأولوية | Marketing أولاً، App ثانياً | قيمة ملموسة بأسرع وقت |

---

## 2. Information Architecture

### Phase 1 — Marketing Site (Route Group)
```
src/app/[locale]/(marketing)/
├── layout.tsx          ← MarketingNavbar + MarketingFooter
├── page.tsx            ← Home / Landing
├── features/
│   └── page.tsx        ← Features overview (tabbed)
├── pricing/
│   └── page.tsx        ← Pricing plans comparison
└── contact/
    └── page.tsx        ← Demo request form
```

### Phase 2 — App Enhancements (existing dashboard)
```
src/app/[locale]/(dashboard)/   ← unchanged structure
src/components/ui/              ← new motion utilities added
src/app/globals.css             ← new animation keyframes added
```

---

## 3. New Components

### Marketing Components
```
src/components/marketing/
├── marketing-navbar.tsx     ← Logo + nav links + CTA button
├── marketing-footer.tsx     ← Links + copyright
├── hero-section.tsx         ← Value prop + floating mockup
├── features-grid.tsx        ← 6-card feature overview
├── stats-banner.tsx         ← CountUp numbers (200+ كلية, 94%...)
└── cta-section.tsx          ← Bottom conversion section
```

### Shared Animation Utilities
```
src/components/ui/
├── fade-in-section.tsx      ← Intersection Observer scroll trigger
└── stagger-children.tsx     ← Sequential delay for child elements
```

---

## 4. Page Designs

### Landing Page — Section Order
1. **MarketingNavbar** — Logo + روابط + [ابدأ تجربتك]
2. **Hero** — Badge + H1 + Subtitle + 2 CTAs + floating dashboard mockup
3. **Stats Banner** — 4 أرقام (CountUp on scroll)
4. **Features Grid** — 6 بطاقات (3×2 grid)
5. **CTA Section** — "جاهز لتحديث إدارة كليتك؟"
6. **MarketingFooter**

### Pricing Page — Section Order
1. H2 + Toggle شهري/سنوي
2. 3-column plan cards (Starter / Professional★ / Enterprise)
3. Expandable features comparison table

### Features Page — Section Order
1. H2 header
2. Tabs: الطلاب / المدربون / الجداول / المالية / AI
3. 2-column: text description + app screenshot/mockup

### Contact Page — Section Order
1. H2 "احجز عرضاً توضيحياً مجانياً"
2. 2-column: form (left) + trust signals (right)

---

## 5. Motion Design Spec

### Marketing Site Animations
| Element | Animation | Duration | Trigger |
|---------|-----------|----------|---------|
| Hero Badge | fade-in + slide-up | 300ms | page load |
| Hero H1 | slide-up | 400ms | +100ms delay |
| Hero Subtitle | fade-in | 300ms | +200ms delay |
| Hero Buttons | fade-in | 300ms | +300ms delay |
| Hero Mockup | fade-in + float-up | 500ms | +400ms delay |
| Stats numbers | CountUp | 1500ms | Intersection |
| Feature cards | stagger fade-in | 80ms each | Intersection |
| Section entries | fade-in + translateY(16px→0) | 400ms | Intersection |

**Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (spring) for entrances
**Easing:** `ease-out` for fades and slides

### App Enhancement Animations
| Element | Animation | Duration |
|---------|-----------|----------|
| Page transitions | opacity + translateY(-4px→0) | 150ms out / 200ms in |
| KPI card numbers | CountUp on mount | 800ms |
| Chart entrance | fade-in + scale(0.95→1) | 200ms |
| Table row hover | background slide (RTL-aware) | 150ms |
| Table row select | teal border-right + bg-teal-50 | 100ms |
| Sort icon | rotate 180deg | 200ms |
| Filter panel open | height 0→auto slide | 200ms |
| Toast success | slide-in from right | 300ms, 3s auto-dismiss |
| Toast error | slide-in from right | 300ms, manual dismiss |
| Empty state | fade-in | 400ms |

**Reduce-motion:** All animations disabled via `@media (prefers-reduced-motion: reduce)`

---

## 6. Visual Design Tokens (existing — no changes needed)

The project already has a complete design system in `globals.css`:
- **Primary:** `--color-teal-600: #1BA9A0`
- **Background:** `--color-slate-50: #F8FAFC`
- **Headings:** Tailwind `font-bold text-slate-900`
- **Body:** `text-slate-600`
- **Cards:** `bg-white rounded-2xl shadow-sm border border-slate-100`

Marketing site reuses these tokens — zero new colors introduced.

---

## 7. Copy Examples

### Arabic Headlines
| Context | Arabic | English |
|---------|--------|---------|
| Hero H1 | إدارة كليتك التقنية بذكاء واحترافية | Manage Your Technical College with Intelligence |
| Hero subtitle | من القبول إلى التخرج — كل شيء في مكان واحد | From Admission to Graduation — Everything in One Place |
| Stats: colleges | +200 كلية تستخدمنا | 200+ Colleges Trust Us |
| Stats: attendance | 94% معدل الحضور | 94% Attendance Rate |
| Pricing H2 | خطط تناسب كل مؤسسة | Plans for Every Institution |
| CTA | ابدأ تجربتك المجانية | Start Your Free Trial |
| Demo CTA | احجز عرضاً توضيحياً | Book a Demo |
| Empty state | لا يوجد طلاب مسجلون بعد | No Students Enrolled Yet |

---

## 8. RTL Implementation Notes

- `(marketing)/layout.tsx` uses `dir={locale === "ar" ? "rtl" : "ltr"}`
- All flex/grid layouts use `rtl:flex-row-reverse` or `space-x-reverse`
- Toast notifications slide in from **left** in RTL (not right)
- Table row hover "ink" slides from **right** in RTL
- Pricing card shadow leans **left** in RTL

---

## 9. Implementation Phases

### Phase 1 — Marketing Site (این الجلسة)
1. Create `(marketing)/layout.tsx` with MarketingNavbar + MarketingFooter
2. Build animation utilities: `FadeInSection` + `StaggerChildren`
3. Build Landing Page (all sections)
4. Build Pricing Page
5. Build Features Page
6. Build Contact Page
7. Add CountUp utility

### Phase 2 — App Enhancements
1. Add page transition wrapper to `(dashboard)/layout.tsx`
2. Add CountUp to KPI cards on main dashboard
3. Enhance table interactions (hover ink, row select, sort animation)
4. Add filter panel slide animation
5. Build Toast notification system
6. Add empty state components with animations
7. Ensure `prefers-reduced-motion` respected everywhere

---

## 10. File Count Estimate

| Category | New Files | Modified Files |
|----------|-----------|----------------|
| Marketing layout + pages | 6 | 0 |
| Marketing components | 6 | 0 |
| Animation utilities | 2 | 0 |
| App enhancements | 2 | 4 |
| CSS additions | 0 | 1 |
| **Total** | **16** | **5** |
