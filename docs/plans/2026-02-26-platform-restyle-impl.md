# Platform Restyle — SaaS Clean Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the platform's visual language to a modern SaaS clean aesthetic — white surfaces, subtle borders, teal reserved for active/CTA only, collapsible sidebar.

**Architecture:** CSS tokens first (globals.css) → layout components (sidebar, header, responsive-content) → UI primitives (stat-card). Each task is independently deployable with no broken states.

**Tech Stack:** Next.js 16, Tailwind v4, CSS custom properties, Zustand (sidebar-store already has `mode: "full" | "collapsed" | "hidden"`), Lucide icons

**Design doc:** `docs/plans/2026-02-26-platform-restyle-design.md`

---

## Task 1: Design Tokens + Surface Reset

**Files:**
- Modify: `src/app/globals.css`

### Step 1: Add new surface/border/text variables

Find the `/* ═══ Surface Colors ═══ */` block (around line 77) and replace the surface variable definitions plus the body background rule.

**Find this block:**
```css
  /* ═══ Surface Colors ═══ */
  --color-background: #F8FAFC;
  --color-foreground: #4A4F5B;
```

**Replace with:**
```css
  /* ═══ Surface Colors ═══ */
  --color-background: #F7F8FA;
  --color-foreground: #0F172A;

  /* ─── SaaS Clean Surfaces ─── */
  --surface-0: #FFFFFF;
  --surface-1: #F7F8FA;
  --surface-2: #F0F1F4;
  --surface-3: #E8E9EC;

  /* ─── Borders ─── */
  --border-default: #E2E8F0;
  --border-subtle: #EEF0F3;
  --border-strong: #CBD5E1;

  /* ─── Text ─── */
  --text-primary: #0F172A;
  --text-secondary: #64748B;
  --text-muted: #94A3B8;

  /* ─── Primary surface for active states ─── */
  --primary-surface: rgba(27, 169, 160, 0.08);
  --primary-border-color: rgba(27, 169, 160, 0.20);

  /* ─── Shadows (minimal) ─── */
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-popover: 0 4px 16px rgba(0, 0, 0, 0.10);
```

### Step 2: Replace body gradient with flat background

**Find:**
```css
body {
  background:
    radial-gradient(circle at 20% 50%, rgba(27, 169, 160, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(168, 213, 186, 0.03) 0%, transparent 50%),
    linear-gradient(135deg, #F0FCFB 0%, #F0F3FA 35%, #F4FCFA 70%, #F8FAFC 100%);
  background-attachment: fixed;
  color: var(--color-foreground);
  font-family: var(--font-sans);
```

**Replace with:**
```css
body {
  background: var(--surface-1);
  color: var(--text-primary);
  font-family: var(--font-sans);
```

### Step 3: Replace glass-sidebar CSS with clean white

**Find `.glass-sidebar {` block and replace entirely:**
```css
.glass-sidebar {
  background: var(--surface-0);
  border-right: 1px solid var(--border-default);
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--border-strong) transparent;
}

[dir="rtl"] .glass-sidebar {
  border-right: none;
  border-left: 1px solid var(--border-default);
}
```

### Step 4: Replace glass-header CSS with clean white

**Find `.glass-header {` block and replace:**
```css
.glass-header {
  background: var(--surface-0);
  border-bottom: 1px solid var(--border-default);
}
```

### Step 5: Replace stats-card CSS with clean border card

**Find `.stats-card {` block and replace:**
```css
.stats-card {
  background: var(--surface-0);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.stats-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: var(--border-strong);
}
```

### Step 6: Replace glass-card CSS with clean border card

**Find `.glass-card {` block and replace:**
```css
.glass-card {
  background: var(--surface-0);
  border: 1px solid var(--border-default);
  border-radius: 10px;
  box-shadow: var(--shadow-card);
  transition: box-shadow 0.15s ease;
}

.glass-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Step 7: Verify visually

Open http://localhost:3001 — the dashboard should now show:
- White card backgrounds with subtle gray borders (no teal glow)
- Light gray page background (barely perceptible vs white)
- Header with clean bottom border (no blur/glow)

### Step 8: Commit

```bash
git add src/app/globals.css
git commit -m "style: replace glass surfaces with SaaS clean tokens — white cards, border-based layout"
```

---

## Task 2: Sidebar — Collapsible Rewrite

**Files:**
- Modify: `src/components/layout/sidebar.tsx`

**Context:** The `sidebar-store.ts` already has `mode: "full" | "collapsed" | "hidden"` and `isOpen`. We use `isOpen` as the expanded/collapsed toggle (desktop), and `isMobileOpen` for mobile overlay.

### Step 1: Update sidebar dimensions constants

At the top of the component (after imports), find the existing width constants or add them:

```tsx
// Sidebar dimensions
const SIDEBAR_EXPANDED = 240;   // px
const SIDEBAR_COLLAPSED = 64;   // px
```

### Step 2: Rewrite the outer sidebar container

Find the main `<aside>` or outer container element in the sidebar return. Replace its className with:

```tsx
<aside
  className={cn(
    "glass-sidebar fixed top-0 z-40 flex h-screen flex-col overflow-hidden transition-all duration-200 ease-in-out",
    // RTL: right side; LTR: left side
    isRtl ? "right-0" : "left-0",
    // Desktop: expand/collapse based on isOpen
    "hidden md:flex",
    isOpen
      ? isRtl ? "w-[240px]" : "w-[240px]"
      : isRtl ? "w-16" : "w-16",
  )}
>
```

### Step 3: Add logo area at the top (hidden text when collapsed)

At the top of the sidebar content, before the nav sections, add:

```tsx
{/* Logo area */}
<div className={cn(
  "flex h-14 shrink-0 items-center border-b px-4",
  "border-[var(--border-default)]",
  !isOpen && "justify-center px-0"
)}>
  {isOpen ? (
    <span className="text-sm font-semibold text-[var(--text-primary)]">سهيل</span>
  ) : (
    <span className="text-sm font-bold text-[var(--color-primary)]">س</span>
  )}
</div>
```

### Step 4: Update each nav item to support collapsed icon-only mode

For each nav item rendered in the sidebar, wrap the label so it hides when collapsed:

```tsx
<Link
  href={...}
  className={cn(
    "nav-item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    isOpen ? "px-3" : "justify-center px-0",
    isActive
      ? "bg-[var(--primary-surface)] text-[var(--color-primary)] font-medium"
      : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
  )}
>
  <Icon className="h-[18px] w-[18px] shrink-0" />
  {isOpen && (
    <span className="truncate">{t(item.labelKey)}</span>
  )}
  {isOpen && item.badge && (
    <span className={cn("ms-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold", ...)}>
      {item.badge}
    </span>
  )}
</Link>
```

### Step 5: Update section title labels to hide when collapsed

```tsx
{section.titleKey && isOpen && (
  <p className="mb-1 mt-5 px-3 text-[10px] font-medium uppercase tracking-widest text-[var(--text-muted)]">
    {t(`nav.sections.${section.titleKey}`)}
  </p>
)}
```

### Step 6: Add toggle button at the bottom of the sidebar

Before closing `</aside>`, add:

```tsx
{/* Toggle button */}
<div className="mt-auto border-t border-[var(--border-default)] p-2">
  <button
    onClick={toggle}
    className={cn(
      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]",
      !isOpen && "justify-center px-0"
    )}
    title={isOpen ? "تصغير القائمة" : "توسيع القائمة"}
  >
    {isRtl
      ? (isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />)
      : (isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)
    }
    {isOpen && <span className="text-xs">تصغير</span>}
  </button>
</div>
```

### Step 7: Verify visually

Open http://localhost:3001 — click the toggle button at the bottom of the sidebar:
- Should collapse to 64px icons-only
- Should expand back to 240px with labels
- Active item should have teal background pill
- Section labels should hide when collapsed

### Step 8: Commit

```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat(sidebar): collapsible 240px/64px — icons-only collapsed, toggle button, SaaS clean style"
```

---

## Task 3: Header — 56px Clean White

**Files:**
- Modify: `src/components/layout/header.tsx`

### Step 1: Change header height

**Find:**
```tsx
"glass-header fixed top-0 z-30 flex h-16 items-center justify-between px-4 transition-all duration-300 md:h-[72px] md:px-6",
```

**Replace with:**
```tsx
"glass-header fixed top-0 z-30 flex h-14 items-center justify-between px-4 transition-all duration-300",
```

(Remove `md:h-[72px] md:px-6` — single height 56px everywhere)

### Step 2: Update header width offset to account for sidebar

The header needs to shrink its width when sidebar is open. Find the header container and add the sidebar offset:

```tsx
className={cn(
  "glass-header fixed top-0 z-30 flex h-14 items-center justify-between px-4 transition-all duration-300",
  // Offset for sidebar (desktop only)
  isRtl
    ? (isOpen ? "left-0 right-[240px]" : "left-0 right-16")
    : (isOpen ? "right-0 left-[240px]" : "right-0 left-16"),
  "hidden md:flex"
)}
```

### Step 3: Verify visually

http://localhost:3001 — header should be:
- 56px tall (slightly more compact)
- White background with clean border-bottom
- Adjusts width when sidebar collapses

### Step 4: Commit

```bash
git add src/components/layout/header.tsx
git commit -m "style(header): 56px clean white — remove glass blur, adjust for collapsible sidebar"
```

---

## Task 4: ResponsiveContent — Update Layout Offsets

**Files:**
- Modify: `src/components/layout/responsive-content.tsx`

### Step 1: Read the full file

```bash
cat src/components/layout/responsive-content.tsx
```

### Step 2: Update sidebar width offsets

**Find:**
```tsx
return isOpen ? "ps-[280px]" : "ps-20";
```
(may appear twice for different breakpoints)

**Replace both occurrences:**
```tsx
return isOpen ? "ps-[240px]" : "ps-16";
```

(`ps-16` = 64px, matching collapsed sidebar width)

### Step 3: Update top padding for new header height

**Find:**
```tsx
"min-h-screen pt-16 transition-all duration-300 ease-out md:pt-[72px]",
```

**Replace with:**
```tsx
"min-h-screen pt-14 transition-all duration-300 ease-out",
```

(`pt-14` = 56px, matching new header height)

### Step 4: Verify visually

Expand and collapse the sidebar — main content should:
- Shift left/right by exactly the sidebar width
- No overlap between sidebar and content
- No content hidden under header

### Step 5: Commit

```bash
git add src/components/layout/responsive-content.tsx
git commit -m "style(layout): update content offsets — 240px/64px sidebar, 56px header"
```

---

## Task 5: StatCard — Clean White Border Style

**Files:**
- Modify: `src/components/ui/stat-card.tsx`

### Step 1: Update the glass/clean mode card wrapper

**Find:**
```tsx
<div
  className={cn(
    "stats-card group p-4 md:p-6",
    className
  )}
>
```

**Replace with:**
```tsx
<div
  className={cn(
    "stats-card group p-5",
    className
  )}
>
```

(Remove responsive padding variation — single `p-5` is cleaner)

### Step 2: Update trend badge — change teal to green

The trend badge currently uses `bg-teal-100 text-teal-700` for positive trends. Teal is reserved for primary/active states only. Change to green:

**Find:**
```tsx
trend.isPositive
  ? "bg-teal-100 text-teal-700"
  : "bg-red-100 text-danger"
```

**Replace with:**
```tsx
trend.isPositive
  ? "bg-emerald-50 text-emerald-700"
  : "bg-red-50 text-red-600"
```

### Step 3: Update icon container style

The icon container uses `group-hover:shadow-md` which adds a teal-ish shadow. Simplify:

**Find:**
```tsx
<div className={cn(
  "rounded-2xl p-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md md:p-3.5",
  iconColor
)}>
```

**Replace with:**
```tsx
<div className={cn(
  "rounded-xl p-2.5 transition-transform duration-150 group-hover:scale-105",
  iconColor
)}>
```

### Step 4: Verify visually

http://localhost:3001 — stat cards should show:
- White background with visible 1px border
- Trend pill: green (not teal) for positive, red for negative
- Icon container: smaller radius (xl not 2xl), subtle hover scale

### Step 5: Commit

```bash
git add src/components/ui/stat-card.tsx
git commit -m "style(stat-card): clean white border, emerald trend badge, no teal bleed"
```

---

## Smoke Test Checklist

After all 5 tasks:

- [ ] **Sidebar expanded**: 240px, all nav items show icon + Arabic label
- [ ] **Sidebar collapsed**: 64px, icons only, labels hidden
- [ ] **Toggle button**: bottom of sidebar, collapses/expands correctly
- [ ] **Active nav item**: teal background pill, teal icon + text
- [ ] **Section labels**: visible when expanded, hidden when collapsed (e.g., "الرئيسية")
- [ ] **Page background**: `#F7F8FA` (light gray, not white)
- [ ] **Cards**: white background, `1px solid #E2E8F0` border, no teal glow
- [ ] **Header**: 56px, white, single clean bottom border
- [ ] **Content offset**: no overlap with sidebar at any state
- [ ] **Teal only appears**: active sidebar item, CTA buttons, stat card icons
- [ ] **RTL layout**: sidebar on right, toggle chevron points correctly

---

## Out of Scope (do NOT implement)

- Mobile hamburger menu changes (keep as-is)
- Marketing pages
- Workflow builder canvas
- Dark mode
- Tooltip on collapsed sidebar icons (nice to have, not in spec)
