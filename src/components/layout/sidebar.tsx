"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { useSidebarStore } from "@/stores/sidebar-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  Award,
  UserCog,
  CheckSquare,
  FolderKanban,
  Monitor,
  FlaskConical,
  Heart,
  BarChart3,
  Bell,
  Settings,
  Shield,
  Brain,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  LogOut,
  HelpCircle,
  TrendingUp,
  ArrowRightLeft,
  type LucideIcon,
} from "lucide-react";
import { type Permission, hasAnyPermission } from "@/lib/permissions";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { UserSwitcher } from "@/components/layout/user-switcher";

/* ═══════════════════════════════════════════
   TYPES & NAVIGATION CONFIG
   ═══════════════════════════════════════════ */

interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  permissions?: Permission[];
  badge?: string;
  badgeType?: "red" | "teal";
}

interface NavSection {
  titleKey?: string;
  items: NavItem[];
}

// ═══ Navigation Sections (matching reference image structure) ═══
const navSections: NavSection[] = [
  {
    // Main section (no title for first section - like "Home" section in reference)
    titleKey: "main",
    items: [
      { labelKey: "dashboard", href: "/", icon: LayoutDashboard },
      {
        labelKey: "trainees",
        href: "/trainees",
        icon: GraduationCap,
        permissions: ["trainees:view", "trainees:view_own"],
      },
      {
        labelKey: "trainers",
        href: "/trainers",
        icon: Users,
        permissions: ["trainers:view", "trainers:view_own"],
      },
      {
        labelKey: "courses",
        href: "/courses",
        icon: BookOpen,
        permissions: ["courses:view"],
      },
      {
        labelKey: "departments",
        href: "/departments",
        icon: Building2,
        permissions: ["departments:view", "departments:view_own"],
      },
      {
        labelKey: "schedules",
        href: "/schedules",
        icon: Calendar,
        permissions: ["schedules:view", "schedules:view_own"],
      },
      {
        labelKey: "grades",
        href: "/grades",
        icon: FileText,
        permissions: ["grades:view", "grades:view_own"],
      },
    ],
  },
  {
    // Management section (like "Communication" in reference)
    titleKey: "management",
    items: [
      {
        labelKey: "attendance",
        href: "/attendance",
        icon: ClipboardList,
        permissions: ["attendance:view", "attendance:view_own"],
      },
      {
        labelKey: "finance",
        href: "/finance",
        icon: DollarSign,
        permissions: ["finance:view"],
      },
      {
        labelKey: "quality",
        href: "/quality",
        icon: Award,
        permissions: ["quality:view"],
      },
      {
        labelKey: "hr",
        href: "/hr",
        icon: UserCog,
        permissions: ["hr:view"],
      },
      {
        labelKey: "tasks",
        href: "/tasks",
        icon: CheckSquare,
        permissions: ["tasks:view", "tasks:view_own"],
        badge: "5",
        badgeType: "teal",
      },
      {
        labelKey: "projects",
        href: "/projects",
        icon: FolderKanban,
        permissions: ["projects:view"],
      },
    ],
  },
  {
    // Advanced section
    titleKey: "advanced",
    items: [
      {
        labelKey: "elearning",
        href: "/elearning",
        icon: Monitor,
        permissions: ["elearning:view"],
      },
      {
        labelKey: "research",
        href: "/research",
        icon: FlaskConical,
        permissions: ["research:view"],
      },
      {
        labelKey: "community",
        href: "/community",
        icon: Heart,
        permissions: ["community:view"],
      },
      {
        labelKey: "reports",
        href: "/reports",
        icon: BarChart3,
        permissions: ["reports:view"],
      },
      {
        labelKey: "ai",
        href: "/ai",
        icon: Brain,
      },
    ],
  },
];

// Bottom nav items (Settings, Help equivalent)
const bottomNavItems: NavItem[] = [
  {
    labelKey: "notifications",
    href: "/notifications",
    icon: Bell,
    badge: "3",
    badgeType: "red",
  },
  {
    labelKey: "settings",
    href: "/settings",
    icon: Settings,
    permissions: ["settings:view"],
  },
  {
    labelKey: "admin",
    href: "/admin",
    icon: Shield,
    permissions: ["settings:admin"],
  },
];

/* ═══════════════════════════════════════════
   CIRCULAR PROGRESS COMPONENT
   (Matching the "Used capacity 60%" card in reference)
   ═══════════════════════════════════════════ */

function CircularProgress({ percentage, size = 56 }: { percentage: number; size?: number }) {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(27, 169, 160, 0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#tealGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1BA9A0" />
            <stop offset="100%" stopColor="#3BACC9" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-teal-600">{percentage}%</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SIDEBAR COMPONENT
   ═══════════════════════════════════════════ */

interface SidebarProps {
  userPermissions: Permission[];
}

export function Sidebar({ userPermissions }: SidebarProps) {
  const t = useTranslations("nav");
  const tDash = useTranslations("dashboard");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isOpen, isMobileOpen, mode, toggle, closeMobile, updateForScreenSize } =
    useSidebarStore();
  const isRtl = locale === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [showCapacityCard, setShowCapacityCard] = useState(true);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  // Screen size listener
  useEffect(() => {
    const handleResize = () => updateForScreenSize(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateForScreenSize]);

  const sidebarExpanded = mode === "full" ? isOpen : mode === "collapsed" ? false : true;

  // ═══ Filter navigation by permissions ═══
  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          !item.permissions ||
          hasAnyPermission(userPermissions, item.permissions as Permission[])
      ),
    }))
    .filter((section) => section.items.length > 0);

  const filteredBottomItems = bottomNavItems.filter(
    (item) =>
      !item.permissions ||
      hasAnyPermission(userPermissions, item.permissions as Permission[])
  );

  // ═══ Search filter ═══
  const getFilteredSections = () => {
    if (!searchQuery.trim()) return filteredSections;
    const q = searchQuery.toLowerCase();
    return filteredSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          t(item.labelKey).toLowerCase().includes(q)
        ),
      }))
      .filter((section) => section.items.length > 0);
  };

  const visibleSections = getFilteredSections();

  // ═══ Width class ═══
  const getWidthClass = () => {
    if (mode === "hidden") return "w-[280px]";
    if (mode === "collapsed") return isOpen ? "w-[280px]" : "w-20";
    return isOpen ? "w-[280px]" : "w-20";
  };

  // ═══ User info ═══
  const userName = session?.user
    ? locale === "ar" ? session.user.nameAr : session.user.nameEn
    : "";
  const userEmail = session?.user?.email || "";
  const userRole = session?.user?.role || "";
  const userInitial = userName ? userName.charAt(0) : "U";

  /* ═══════════════════════════════════════════
     RENDER HELPERS
     ═══════════════════════════════════════════ */

  // ═══ Single Nav Item ═══
  // Spacing: py-2.5 (10px) = closest to reference ~40px total height with icon
  // Gap between items: space-y-1 (4px) matching reference
  const renderNavItem = (item: NavItem, expanded: boolean, onClickExtra?: () => void) => {
    const isActive =
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          onClick={onClickExtra}
          className={cn(
            "nav-item group relative flex items-center rounded-xl transition-all duration-200",
            // Expanded: px-4 (16px sides), py-2.5 (10px top/bottom) → ~40px total
            // Collapsed: centered icon
            expanded
              ? "mx-4 gap-3 px-3 py-2.5"
              : "mx-2 justify-center px-0 py-2.5",
            isActive
              ? "nav-item-active bg-gradient-to-r from-teal-600 to-aqua-600 text-white shadow-lg shadow-teal-600/25"
              : "text-slate-600 hover:text-teal-700"
          )}
          title={!expanded ? t(item.labelKey) : undefined}
          aria-label={t(item.labelKey)}
          aria-current={isActive ? "page" : undefined}
        >
          {/* Active indicator bar (left/right edge) */}
          {isActive && (
            <span
              className={cn(
                "absolute top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-white/80",
                isRtl ? "right-0 rounded-r-none" : "left-0 rounded-l-none"
              )}
            />
          )}

          <Icon
            className={cn(
              "h-5 w-5 shrink-0 transition-all duration-200",
              isActive
                ? "text-white"
                : "text-teal-600/70 group-hover:text-teal-600 group-hover:scale-110"
            )}
          />

          {expanded && (
            <>
              <span className="flex-1 truncate text-[14px] font-medium">
                {t(item.labelKey)}
              </span>

              {/* Badge - matching reference badge style */}
              {item.badge && (
                <span
                  className={cn(
                    "flex h-[22px] min-w-[22px] items-center justify-center rounded-md px-1.5 text-[11px] font-bold",
                    isActive
                      ? "bg-white/20 text-white"
                      : item.badgeType === "red"
                        ? "bg-red-500 text-white shadow-sm shadow-red-500/30"
                        : "bg-teal-100 text-teal-700"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}

          {/* Collapsed mode: badge indicator */}
          {!expanded && item.badge && (
            <span
              className={cn(
                "absolute top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white",
                isRtl ? "left-1" : "right-1",
                item.badgeType === "red" ? "bg-red-500" : "bg-teal-500"
              )}
            >
              {item.badge}
            </span>
          )}
        </Link>
      </li>
    );
  };

  // ═══ Section Title ═══
  // Spacing: 16px gap between section title and first item (pb-1 = 4px, items have own padding)
  // 16px between sections (handled by parent spacing)
  const renderSectionTitle = (titleKey?: string, expanded?: boolean) => {
    if (!titleKey || !expanded) return null;
    return (
      <div className="px-4 pb-1 pt-4">
        <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400/80">
          {t(titleKey)}
        </p>
      </div>
    );
  };

  // ═══ Capacity Card (matching "Used capacity 60%" in reference) ═══
  // Card spacing: 48px margin top/bottom (my-6 = 24px * 2 ≈ 48px visual), 16px sides
  // Card content: 56px top padding for circle, 208px total height
  const renderCapacityCard = (expanded: boolean) => {
    if (!expanded || !showCapacityCard) return null;

    const completionRate = 72;
    const isAr = locale === "ar";

    return (
      <div className="mx-4 my-3">
        <div className="sidebar-capacity-card relative overflow-hidden rounded-xl border border-teal-600/10 bg-gradient-to-br from-teal-50/80 via-white to-aqua-50/50 p-3 shadow-sm">
          {/* Close button */}
          <button
            onClick={() => setShowCapacityCard(false)}
            className="absolute end-1.5 top-1.5 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label={isAr ? "إخفاء" : "Dismiss"}
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex items-center gap-3">
            {/* Circular progress */}
            <CircularProgress percentage={completionRate} size={44} />

            {/* Title + Description */}
            <div className="min-w-0 flex-1">
              <h4 className="text-[12px] font-bold text-slate-800">
                {isAr ? "نسبة الإنجاز" : "Completion Rate"}
              </h4>
              <p className="text-[10px] leading-snug text-slate-500">
                {isAr
                  ? `${completionRate}% من أهداف الفصل`
                  : `${completionRate}% of semester goals`}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ═══ User Profile Footer ═══
  // Spacing: 40px margin top, 16px bottom padding, 48px total height for row
  const renderUserProfile = (expanded: boolean) => (
    <div
      className="mt-auto border-t border-teal-600/8 px-3 py-3"
      role="region"
      aria-label={locale === "ar" ? "ملف المستخدم" : "User Profile"}
    >
      {expanded ? (
        <div className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-teal-600/[0.05]">
          {/* Avatar - 40px matching reference */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-aqua-600 text-sm font-semibold text-white shadow-md shadow-teal-600/20 transition-transform duration-200 group-hover:scale-105">
            {userInitial}
          </div>
          {/* Name + Email */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-800">
              {userName || "User"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {userEmail || userRole}
            </p>
          </div>
          {/* Switch User icon */}
          <button
            onClick={() => setShowUserSwitcher(true)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
            title={locale === "ar" ? "تبديل المستخدم" : "Switch User"}
            aria-label={locale === "ar" ? "تبديل المستخدم" : "Switch User"}
          >
            <ArrowRightLeft className="h-4 w-4" />
          </button>
          {/* Logout icon */}
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            title={locale === "ar" ? "تسجيل الخروج" : "Logout"}
            aria-label={locale === "ar" ? "تسجيل الخروج" : "Logout"}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-aqua-600 text-xs font-semibold text-white shadow-md shadow-teal-600/20">
            {userInitial}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowUserSwitcher(true)}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
              title={locale === "ar" ? "تبديل المستخدم" : "Switch User"}
              aria-label={locale === "ar" ? "تبديل المستخدم" : "Switch User"}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
              title={locale === "ar" ? "تسجيل الخروج" : "Logout"}
              aria-label={locale === "ar" ? "تسجيل الخروج" : "Logout"}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* User Switcher Modal */}
      <UserSwitcher
        isOpen={showUserSwitcher}
        onClose={() => setShowUserSwitcher(false)}
        currentEmail={userEmail}
      />
    </div>
  );

  /* ═══════════════════════════════════════════
     MOBILE: Overlay Drawer
     ═══════════════════════════════════════════ */
  if (mode === "hidden") {
    return (
      <>
        {/* Overlay backdrop */}
        <div
          className={cn("sidebar-overlay", isMobileOpen && "active")}
          onClick={closeMobile}
          aria-hidden="true"
        />

        {/* Drawer */}
        <aside
          className={cn(
            "fixed top-0 z-40 flex h-screen w-[280px] flex-col glass-sidebar transition-transform duration-300",
            isRtl ? "right-0" : "left-0",
            isMobileOpen
              ? "translate-x-0"
              : isRtl ? "translate-x-full" : "-translate-x-full"
          )}
          role="navigation"
          aria-label={locale === "ar" ? "القائمة الرئيسية" : "Main Navigation"}
        >
          {/* ═══ Header: Logo + Close ═══ */}
          {/* Spacing: pt-8 (32px top), px-4 (16px sides) */}
          <div className="flex items-center justify-between px-4 pb-6 pt-8">
            <Link href="/" className="flex items-center gap-3" onClick={closeMobile}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-aqua-600 shadow-md shadow-teal-600/15">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-[17px] font-bold text-slate-800">Saohil1</span>
            </Link>
            <button
              onClick={closeMobile}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ═══ Search Bar ═══ */}
          {/* Spacing: mx-4 (16px sides), mb-4 (16px bottom) */}
          <div className="mx-4 mb-4">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === "ar" ? "ابحث عن أي شيء..." : "Search anything..."}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pe-4 ps-10 text-[13px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:shadow-sm focus:shadow-teal-600/10 focus:ring-2 focus:ring-teal-600/10"
                dir={isRtl ? "rtl" : "ltr"}
                aria-label={locale === "ar" ? "بحث في القائمة" : "Search navigation"}
              />
            </div>
          </div>

          {/* ═══ Main Navigation (scrollable) ═══ */}
          <nav className="sidebar-nav flex-1 overflow-y-auto" aria-label="Primary">
            {visibleSections.map((section, idx) => (
              <div key={idx}>
                {/* 16px spacing between sections */}
                {idx > 0 && <div className="my-2" />}
                {renderSectionTitle(section.titleKey, true)}
                {/* 4px between items = space-y-1 */}
                <ul className="space-y-1" role="list">
                  {section.items.map((item) =>
                    renderNavItem(item, true, closeMobile)
                  )}
                </ul>
              </div>
            ))}

            {/* ═══ Capacity Card ═══ */}
            {renderCapacityCard(true)}
          </nav>

          {/* ═══ Bottom Section: Settings/Help items ═══ */}
          {/* 48px top spacing */}
          <div className="border-t border-slate-200/60 pt-2">
            <ul className="space-y-1" role="list">
              {filteredBottomItems.map((item) =>
                renderNavItem(item, true, closeMobile)
              )}
            </ul>
          </div>

          {/* ═══ User Profile Footer ═══ */}
          {renderUserProfile(true)}
        </aside>
      </>
    );
  }

  /* ═══════════════════════════════════════════
     TABLET + DESKTOP: Fixed Sidebar
     ═══════════════════════════════════════════ */
  return (
    <aside
      className={cn(
        "fixed top-0 z-40 flex h-screen flex-col glass-sidebar transition-all duration-300",
        getWidthClass(),
        isRtl ? "right-0" : "left-0"
      )}
      role="navigation"
      aria-label={locale === "ar" ? "القائمة الرئيسية" : "Main Navigation"}
    >
      {/* ═══ Header: Logo + Collapse toggle ═══ */}
      {/* Spacing: pt-8 (32px top), px-4 (16px sides) */}
      <div
        className={cn(
          "flex items-center",
          sidebarExpanded
            ? "justify-between px-4 pb-6 pt-8"
            : "flex-col justify-center gap-3 px-2 pb-4 pt-6"
        )}
      >
        {sidebarExpanded ? (
          <>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-aqua-600 shadow-md shadow-teal-600/15">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-[17px] font-bold text-slate-800">Saohil1</span>
            </Link>
            <button
              onClick={toggle}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={locale === "ar" ? "طي القائمة" : "Collapse sidebar"}
            >
              {isRtl ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <>
            <Link href="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-aqua-600 shadow-md shadow-teal-600/15 transition-transform hover:scale-105">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </Link>
            <button
              onClick={toggle}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label={locale === "ar" ? "فتح القائمة" : "Expand sidebar"}
            >
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>

      {/* ═══ Search Bar ═══ */}
      {/* Spacing: mx-4 (16px sides), mb-4 (16px bottom) matching reference: 32px total vertical */}
      {sidebarExpanded ? (
        <div className="mx-4 mb-4">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === "ar" ? "ابحث عن أي شيء..." : "Search anything..."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 pe-4 ps-10 text-[13px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:shadow-sm focus:shadow-teal-600/10 focus:ring-2 focus:ring-teal-600/10"
              dir={isRtl ? "rtl" : "ltr"}
              aria-label={locale === "ar" ? "بحث في القائمة" : "Search navigation"}
            />
          </div>
        </div>
      ) : (
        <div className="mb-2 flex justify-center">
          <button
            onClick={toggle}
            className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
            title={locale === "ar" ? "بحث" : "Search"}
            aria-label={locale === "ar" ? "فتح البحث" : "Open search"}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* ═══ Main Navigation (scrollable middle) ═══ */}
      <nav className="sidebar-nav flex-1 overflow-y-auto" aria-label="Primary">
        {visibleSections.map((section, idx) => (
          <div key={idx}>
            {/* 16px spacing between sections */}
            {idx > 0 && (sidebarExpanded ? <div className="my-2" /> : <div className="my-1.5" />)}
            {renderSectionTitle(section.titleKey, sidebarExpanded)}
            {/* 4px between items = space-y-1 */}
            <ul className="space-y-1" role="list">
              {section.items.map((item) => renderNavItem(item, sidebarExpanded))}
            </ul>
          </div>
        ))}

        {/* ═══ Capacity Card (only expanded) ═══ */}
        {renderCapacityCard(sidebarExpanded)}
      </nav>

      {/* ═══ Bottom Section: Settings + Help ═══ */}
      {/* 48px top spacing from card area */}
      <div className="border-t border-slate-200/60 pt-2">
        <ul className="space-y-1" role="list">
          {filteredBottomItems.map((item) => renderNavItem(item, sidebarExpanded))}
        </ul>
      </div>

      {/* ═══ User Profile Footer ═══ */}
      {renderUserProfile(sidebarExpanded)}
    </aside>
  );
}
