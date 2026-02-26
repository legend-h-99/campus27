# Campus27 — Cinematic Marketing Site Design
**Date:** 2026-02-25
**Status:** Approved
**Scope:** Upgrade existing marketing pages + add new cinematic sections

---

## Overview

Upgrade the existing Next.js marketing site from a clean functional design to a cinematic, intentional digital instrument. No new framework installs — CSS-only animations using the rich `globals.css` keyframe library already in place.

---

## Design Tokens

```css
--c27-primary:   #1BA9A0   /* teal — trust */
--c27-accent:    #F97316   /* orange — action */
--c27-dark:      #0F172A   /* slate-950 — authority */
--c27-surface:   #F8FAFC   /* slate-50 — clean */
```

**Fonts already loaded:** Inter, Cairo, Tajawal via `globals.css`
**Drama font to add:** Playfair Display (Google Fonts `<link>` in `layout.tsx`)

---

## Component Changes

### 1. Navbar — Floating Island
**File:** `src/components/marketing/marketing-navbar.tsx`
- Pill shape: `mx-auto w-fit rounded-full` centered with `flex justify-center`
- At top: `bg-transparent` white text
- Scrolled: `bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-lg`
- CTA button: orange accent with sliding `<span>` background on hover
- Already has scroll detection — just restyle

### 2. Hero — Opening Shot
**File:** `src/components/marketing/hero-section.tsx`
- `min-h-[100dvh]` full screen
- Background: CSS `background-image: url(https://images.unsplash.com/...)` with `bg-cover bg-center`
- Overlay: `bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/60 to-transparent`
- Text: bottom-start aligned using `pb-20 ps-8`
- Arabic headline pattern: "إدارة الكلية" (Tajawal Bold 56px) + "بـ ذكاء." (Playfair Display Italic, teal)
- Animation: staggered CSS `animation-delay` using existing `fade-in-up` keyframe
- Add Unsplash domain to `next.config.ts` remote patterns

### 3. Stats Banner — Dark + Noise
**File:** `src/components/marketing/stats-banner.tsx`
- Dark teal background `bg-teal-900`
- SVG `<feTurbulence>` noise overlay at 0.04 opacity (inline SVG)
- White text for numbers, teal-200 for labels

### 4. Features — 3 Micro-UI Cards
**File:** `src/components/marketing/features-grid.tsx`
Replace 6 static cards with 3 animated interactive cards:

**Card 1 — Diagnostic Shuffler** (إدارة المتدربين)
- 3 overlapping mini-cards: القبول / الحضور / الدرجات
- `useState` cycles every 3s, CSS spring transform

**Card 2 — Telemetry Typewriter** (تقارير لحظية)
- Monospace live feed with `useEffect` typewriter
- Teal blinking cursor, pulsing "بث مباشر" dot

**Card 3 — Scheduler Animation** (جداول ذكية)
- Weekly grid S-F
- CSS animated cursor clicks days, highlights in teal
- Pure `@keyframes` for cursor movement path

### 5. Philosophy Section — New
**File:** `src/components/marketing/philosophy-section.tsx`
- Full-width dark (`#0F172A`) background
- Inline SVG noise overlay
- Two dramatic lines with IntersectionObserver + CSS stagger reveal:
  - "معظم الأنظمة تُركّز على: الأوراق والإجراءات."
  - "نحن نُركّز على: **النتيجة والإنسان**." (teal accent)

### 6. Protocol Section — Sticky Stacking
**File:** `src/components/marketing/protocol-section.tsx`
- 3 `position: sticky top-0` cards in sequence
- Previous card: `scale(0.9) blur(20px) opacity-50` via CSS class toggle + IntersectionObserver
- Step 1: "القبول الذكي" → rotating concentric circles SVG
- Step 2: "التتبع اللحظي" → scanning horizontal line SVG over grid
- Step 3: "التقارير التلقائية" → EKG waveform SVG (stroke-dashoffset animation)

### 7. Pricing — Toggle + Scale
**File:** `src/app/[locale]/(marketing)/pricing/page.tsx`
- Annual/monthly toggle: `useState` + CSS sliding pill
- Middle card: `scale-[1.04]` + `ring-2 ring-teal-400`
- Orange CTA for highlighted plan

### 8. Footer — Cinematic Dark
**File:** `src/components/marketing/marketing-footer.tsx`
- `bg-[#0F172A] rounded-t-[4rem]`
- Grid layout: brand + tagline | nav columns | legal
- "النظام يعمل / SYSTEM OPERATIONAL" — pulsing green dot + IBM Plex Mono

### 9. CinematicSearchBar — New Component
**File:** `src/components/marketing/cinematic-search-bar.tsx`
- 5 states: idle / focus / typing / submit / suggestions
- All via `useState` + CSS transitions (no library)
- Connects to existing `/api/search` route

---

## New API Routes

```
src/app/api/v1/
  engagement/event/route.ts   POST — track section_view, cta_click, etc.
  acquisition/lead/route.ts   POST — save marketing leads
  health/route.ts             GET  — system status
```

Response envelope:
```ts
{ success: boolean, data: any, error: {code, message} | null, meta: {requestId, durationMs} }
```

---

## Prisma Additions (append to schema.prisma)

```prisma
model MarketingEvent {
  id         String   @id @default(cuid())
  sessionId  String
  eventType  String
  payload    Json
  occurredAt DateTime
  createdAt  DateTime @default(now())
}

model MarketingLead {
  id        String   @id @default(cuid())
  email     String
  name      String?
  intent    String?
  utm       Json?
  metadata  Json?
  createdAt DateTime @default(now())
}
```

Migration: `npx prisma migrate dev --name add_marketing_events_leads`

---

## Home Page Composition (updated)

```tsx
// src/app/[locale]/(marketing)/home/page.tsx
<HeroSection />
<StatsBanner />
<FeaturesGrid />        // upgraded to 3 micro-UI cards
<PhilosophySection />   // NEW
<ProtocolSection />     // NEW
<CTASection />
```

---

## No New Dependencies

All animations via existing CSS keyframes in `globals.css`.
Add Playfair Display via `<link>` in `src/app/[locale]/layout.tsx`.
Add `images.unsplash.com` to `next.config.ts` remote patterns.

---

## RTL/LTR

Every component receives `locale` prop or uses `useLocale()`.
All spacing uses logical properties: `ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`.

---

## prefers-reduced-motion

All `@keyframes` animations wrapped in:
```css
@media (prefers-reduced-motion: no-preference) { ... }
```
