# Platform Restyle — SaaS Clean Design
**Date:** 2026-02-26
**Status:** Approved
**Scope:** Full platform restyle — Dashboard + Sidebar + all pages
**Approach:** B — Full Restyle (~90% reference match)

---

## Goals

Transform the platform's visual language from a "teal-heavy cards" look to a modern, clean SaaS aesthetic — similar to close-CRM and similar B2B tools — while preserving the TVTC brand identity (teal stays as primary/CTA/active color only).

---

## Design Principles

1. **White-first surfaces** — content areas are pure white; gray is reserved for page backgrounds
2. **Borders over shadows** — 1px subtle borders instead of glow/elevation
3. **Teal is earned** — only active states, CTAs, and key indicators use teal
4. **RTL-native** — all layouts are designed right-to-left by default

---

## Section 1 — Design Tokens

### Surface Hierarchy
```css
--surface-0: #FFFFFF;          /* cards, main content areas */
--surface-1: #F7F8FA;          /* page background */
--surface-2: #F0F1F4;          /* hover states, input backgrounds */
--surface-3: #E8E9EC;          /* pressed states, striped rows */
```

### Borders
```css
--border-default: #E2E8F0;     /* card borders, separators */
--border-subtle:  #EEF0F3;     /* inner dividers */
--border-strong:  #CBD5E1;     /* focused inputs, prominent dividers */
```

### Text
```css
--text-primary:   #0F172A;     /* page titles, important labels (slate-950) */
--text-secondary: #64748B;     /* secondary labels, descriptions (slate-500) */
--text-muted:     #94A3B8;     /* placeholders, disabled (slate-400) */
```

### Primary (Teal — unchanged hue, updated usage)
```css
--color-primary:       #1BA9A0;                    /* CTA buttons, links */
--color-primary-dark:  #0D7A73;                    /* hover on primary */
--primary-surface:     rgba(27, 169, 160, 0.08);   /* active sidebar item bg */
--primary-border:      rgba(27, 169, 160, 0.20);   /* active sidebar item border */
```

### Shadows (minimal)
```css
--shadow-card:   0 1px 3px rgba(0, 0, 0, 0.06);   /* replaces current glow */
--shadow-popover: 0 4px 16px rgba(0, 0, 0, 0.10);
```

---

## Section 2 — Sidebar (Collapsible)

### Dimensions
| State     | Width  | Content              |
|-----------|--------|----------------------|
| Expanded  | 240px  | Icon (20px) + Label  |
| Collapsed | 64px   | Icon only + tooltip  |

### Behavior
- **Toggle button**: small button at sidebar bottom (not in header)
- **Expand trigger**: click toggle OR hover (hover expands temporarily, click locks)
- **Transition**: `width 200ms ease-in-out`, text fades with `opacity 150ms`
- **RTL**: sidebar on right side, border on left (`border-left: 1px solid var(--border-default)`)

### Visual Spec
```
Background:     var(--surface-0) #FFFFFF
Border:         1px solid var(--border-default) — left side (RTL)
Logo area:      48px height, platform logo + name (hidden when collapsed)
Nav item:       height 36px, border-radius 8px, gap-3 icon+text
Active item:    background var(--primary-surface), color var(--color-primary),
                icon color: teal, text: teal, border-right: 2px solid teal (RTL: border-left)
Hover item:     background var(--surface-2)
Section label:  10px uppercase, letter-spacing 0.08em, color var(--text-muted), mt-6 mb-1
Icon size:      18px
Font:           14px, weight 500 (active), 400 (rest)
```

### Sections Structure
```
── الرئيسية
   ├── لوحة التحكم
── الأشخاص
   ├── المتدربون
   ├── المدربون
   ├── المستخدمون
── الإدارة
   ├── الأقسام
   ├── البرامج
   ├── الجداول
   ├── الميزانية
── الأتمتة
   ├── سير العمل الآلي
── النظام
   ├── الإعدادات
   └── تسجيل الخروج
```

---

## Section 3 — Cards

### Stat Cards (Dashboard)
```
Background:    #FFFFFF
Border:        1px solid var(--border-default)
Border-radius: 10px
Shadow:        var(--shadow-card)
Padding:       20px
Icon container: 36px × 36px, border-radius 8px, tinted background
Value:         24px, weight 700, var(--text-primary)
Label:         13px, weight 500, var(--text-secondary)
Change badge:  12px, green/red pill — no teal (teal = primary only rule)
```

### General Cards (tables, forms, panels)
```
Background:    #FFFFFF
Border:        1px solid var(--border-default)
Border-radius: 8px
Header:        16px title weight 600, border-bottom 1px var(--border-subtle), padding 16px 20px
Body:          padding 20px
```

---

## Section 4 — Header (Top Bar)

```
Height:        56px (down from ~64px)
Background:    #FFFFFF
Border-bottom: 1px solid var(--border-default)
Left (RTL):    Platform logo / page breadcrumb + page title
Center:        Search bar (compact, 320px, border: 1px solid var(--border-default))
Right (RTL):   Locale switcher → Notifications bell → User avatar + name
```

---

## Section 5 — Typography Scale

| Element         | Size  | Weight | Color               |
|-----------------|-------|--------|---------------------|
| Page title      | 20px  | 600    | var(--text-primary) |
| Section title   | 16px  | 600    | var(--text-primary) |
| Card title      | 14px  | 600    | var(--text-primary) |
| Body / default  | 14px  | 400    | var(--text-primary) |
| Label / meta    | 13px  | 500    | var(--text-secondary)|
| Caption / hint  | 12px  | 400    | var(--text-muted)   |
| Section nav label | 10px | 500  | var(--text-muted)   |

---

## Section 6 — Buttons

```
Primary:    bg teal, white text, border-radius 8px, height 36px, px-4
Secondary:  bg var(--surface-2), var(--text-primary), border 1px var(--border-default)
Danger:     bg #FEF2F2, color #DC2626, border 1px #FECACA
Ghost:      no bg, no border, var(--text-secondary), hover: var(--surface-2)
Size sm:    height 28px, px-3, text 12px
Size md:    height 36px, px-4, text 13px (default)
Size lg:    height 42px, px-5, text 14px
```

---

## Files to Change

| File | Change Type |
|------|-------------|
| `src/app/globals.css` | Token overrides — surface/border/text variables |
| `src/components/layout/sidebar.tsx` | Full rewrite — collapsible, sections, new styling |
| `src/components/layout/header.tsx` | Restyle — height, border, cleaner layout |
| `src/app/[locale]/(dashboard)/layout.tsx` | Layout padding/background update |
| `src/app/globals.css` (card utilities) | `.card` utility class new style |

---

## Out of Scope (this PR)

- Marketing pages (separate branch already in progress)
- Workflow Builder canvas (already built, inherits token changes)
- Dark mode
- Mobile/responsive changes beyond what naturally follows

---

## Success Criteria

- [ ] Sidebar collapses to 64px icons-only, expands to 240px on toggle
- [ ] Page background is `#F7F8FA`, cards are `#FFFFFF` with visible border
- [ ] No teal except: active sidebar item, CTA buttons, stat card icons
- [ ] Header is 56px with clean bottom border (no gradient/glow)
- [ ] Typography hierarchy clear: dark primary text vs slate-500 secondary
- [ ] RTL layout preserved perfectly
