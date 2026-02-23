"use client";

import { useTranslations, useLocale } from "next-intl";
import { signOut } from "next-auth/react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  Menu,
  Bell,
  Globe,
  LogOut,
  User,
  Settings,
  ChevronDown,
  GraduationCap,
  ArrowRightLeft,
  Search,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { UserSwitcher } from "@/components/layout/user-switcher";
import { useCommandPaletteStore } from "@/stores/command-palette-store";

interface HeaderProps {
  user: {
    nameAr: string;
    nameEn: string;
    role: string;
    email?: string;
    avatar?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { isOpen, mode, toggle, openMobile } = useSidebarStore();
  const { open: openPalette } = useCommandPaletteStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === "ar";
  const userName = locale === "ar" ? user.nameAr : user.nameEn;

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape" && showUserMenu) {
      setShowUserMenu(false);
    }
  }, [showUserMenu]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Open Command Palette on ⌘K / Ctrl+K
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openPalette();
      }
    };
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, [openPalette]);

  // Calculate header positioning based on sidebar mode
  const getHeaderPosition = () => {
    if (mode === "hidden") {
      return "inset-x-0";
    }
    if (mode === "collapsed") {
      return isRtl
        ? isOpen ? "left-0 right-[280px]" : "left-0 right-20"
        : isOpen ? "left-[280px] right-0" : "left-20 right-0";
    }
    return isRtl
      ? isOpen ? "left-0 right-[280px]" : "left-0 right-20"
      : isOpen ? "left-[280px] right-0" : "left-20 right-0";
  };

  return (
    <header
      className={cn(
        "glass-header fixed top-0 z-30 flex h-16 items-center justify-between px-4 transition-all duration-300 md:h-[72px] md:px-6",
        getHeaderPosition()
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Hamburger for mobile */}
        {mode === "hidden" && (
          <button
            onClick={openMobile}
            className="rounded-lg p-2 text-muted transition-all duration-200 hover:bg-teal-50 hover:text-teal-600 active:scale-95"
            aria-label={locale === "ar" ? "فتح القائمة" : "Open menu"}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Mobile logo */}
        {mode === "hidden" && (
          <Link href="/" className="flex items-center gap-1.5 md:hidden">
            <GraduationCap className="h-6 w-6 text-teal-600" />
            <span className="text-sm font-bold text-teal-600">Saohil1</span>
          </Link>
        )}

        {/* Welcome text */}
        <h2 className="hidden text-base font-semibold text-foreground xs:block md:text-lg">
          {t("dashboard.welcome")}، {userName} 👋
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 md:gap-3">
        {/* Language Switcher */}
        <Link
          href="/"
          locale={locale === "ar" ? "en" : "ar"}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-muted transition-all duration-200 hover:bg-teal-50 hover:text-teal-600 md:gap-1.5 md:px-3 md:py-2"
          aria-label={locale === "ar" ? "Switch to English" : "التبديل للعربية"}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden xs:inline">{locale === "ar" ? "EN" : "ع"}</span>
        </Link>

        {/* Global Search Button */}
        <button
          onClick={openPalette}
          className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[12px] text-slate-400 transition-all duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600 sm:flex"
          aria-label={locale === "ar" ? "بحث شامل" : "Global search"}
        >
          <Search className="h-3.5 w-3.5" />
          <span>{locale === "ar" ? "ابحث..." : "Search..."}</span>
          <span className="kbd-badge">⌘K</span>
        </button>

        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative rounded-lg p-1.5 text-muted transition-all duration-200 hover:bg-teal-50 hover:text-teal-600 md:p-2"
          aria-label={locale === "ar" ? "الإشعارات" : "Notifications"}
        >
          <Bell className="h-5 w-5" />
          <span className="notification-badge-pulse absolute end-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white md:end-1 md:top-1">
            3
          </span>
        </Link>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-all duration-200 hover:bg-teal-50/60 md:gap-2 md:px-3 md:py-2"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            aria-label={locale === "ar" ? "قائمة المستخدم" : "User menu"}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-600 to-aqua-600 text-xs font-bold text-white shadow-sm shadow-teal-600/20 transition-transform duration-200 hover:scale-105 md:h-8 md:w-8 md:text-sm">
              {userName.charAt(0)}
            </div>
            <div className="hidden text-start md:block">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted">{user.role}</p>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted chevron-rotate",
                showUserMenu && "open"
              )}
            />
          </button>

          {showUserMenu && (
            <div
              className={cn(
                "dropdown-animate glass-card absolute top-full mt-2 w-48 overflow-hidden py-1",
                isRtl ? "left-0" : "right-0"
              )}
              role="menu"
              aria-orientation="vertical"
            >
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => setShowUserMenu(false)}
                role="menuitem"
              >
                <User className="h-4 w-4" />
                {t("auth.profile")}
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => setShowUserMenu(false)}
                role="menuitem"
              >
                <Settings className="h-4 w-4" />
                {t("auth.settings")}
              </Link>
              <hr className="my-1 border-border" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowUserSwitcher(true);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-teal-50 hover:text-teal-700"
                role="menuitem"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {locale === "ar" ? "تبديل المستخدم" : "Switch User"}
              </button>
              <hr className="my-1 border-border" />
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                {t("auth.logout")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Switcher Modal */}
      <UserSwitcher
        isOpen={showUserSwitcher}
        onClose={() => setShowUserSwitcher(false)}
        currentEmail={user.email}
      />
    </header>
  );
}
