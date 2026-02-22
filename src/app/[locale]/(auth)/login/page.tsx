"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Users,
  UserCog,
  BookOpen,
  ClipboardCheck,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "@/i18n/routing";

interface DemoUser {
  email: string;
  password: string;
  role: string;
  roleAr: string;
  nameAr: string;
  nameEn: string;
  icon: typeof Shield;
  color: string;
}

const demoUsers: DemoUser[] = [
  {
    email: "admin@campus26.sa",
    password: "123456",
    role: "super_admin",
    roleAr: "مدير النظام",
    nameAr: "مدير النظام",
    nameEn: "System Admin",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    email: "dean@campus26.sa",
    password: "123456",
    role: "dean",
    roleAr: "العميد",
    nameAr: "د. أحمد بن محمد العتيبي",
    nameEn: "Dr. Ahmed Al-Otaibi",
    icon: GraduationCap,
    color: "bg-teal-600",
  },
  {
    email: "vp.trainers@campus26.sa",
    password: "123456",
    role: "vp_trainers",
    roleAr: "وكيل التدريب",
    nameAr: "د. سعد بن عبدالله الغامدي",
    nameEn: "Dr. Saad Al-Ghamdi",
    icon: Users,
    color: "bg-blue-600",
  },
  {
    email: "vp.trainees@campus26.sa",
    password: "123456",
    role: "vp_trainees",
    roleAr: "وكيل المتدربين",
    nameAr: "د. عبدالرحمن بن سليمان الراشد",
    nameEn: "Dr. Abdulrahman Al-Rashed",
    icon: GraduationCap,
    color: "bg-green-600",
  },
  {
    email: "vp.quality@campus26.sa",
    password: "123456",
    role: "vp_quality",
    roleAr: "وكيل الجودة",
    nameAr: "د. فاطمة بنت خالد المطيري",
    nameEn: "Dr. Fatima Al-Mutairi",
    icon: Award,
    color: "bg-purple-600",
  },
  {
    email: "head.cs@campus26.sa",
    password: "123456",
    role: "dept_head",
    roleAr: "رئيس قسم حاسب",
    nameAr: "د. خالد بن سعيد الشمراني",
    nameEn: "Dr. Khaled Al-Shamrani",
    icon: UserCog,
    color: "bg-orange-500",
  },
  {
    email: "head.ee@campus26.sa",
    password: "123456",
    role: "dept_head",
    roleAr: "رئيس قسم كهرباء",
    nameAr: "م. فهد بن ناصر الدوسري",
    nameEn: "Eng. Fahad Al-Dosari",
    icon: UserCog,
    color: "bg-orange-500",
  },
  {
    email: "trainer.abdulaziz.almarri@campus26.sa",
    password: "123456",
    role: "trainer",
    roleAr: "مدرب",
    nameAr: "عبدالعزيز المري",
    nameEn: "Abdulaziz Al-Marri",
    icon: BookOpen,
    color: "bg-teal-500",
  },
  {
    email: "trainer.abdullah.almarri@campus26.sa",
    password: "123456",
    role: "trainer",
    roleAr: "مدرب",
    nameAr: "عبدالله المري",
    nameEn: "Abdullah Al-Marri",
    icon: BookOpen,
    color: "bg-teal-500",
  },
  {
    email: "s241001@stu.campus26.sa",
    password: "123456",
    role: "trainee",
    roleAr: "متدرب",
    nameAr: "مازن بن منصور الفيفي",
    nameEn: "Mazen Al-Fifi",
    icon: GraduationCap,
    color: "bg-cyan-500",
  },
  {
    email: "accountant@campus26.sa",
    password: "123456",
    role: "accountant",
    roleAr: "محاسب",
    nameAr: "أ. سلطان الحربي",
    nameEn: "Mr. Sultan Al-Harbi",
    icon: ClipboardCheck,
    color: "bg-amber-600",
  },
  {
    email: "quality@campus26.sa",
    password: "123456",
    role: "quality_officer",
    roleAr: "مسؤول جودة",
    nameAr: "د. منال الزهراني",
    nameEn: "Dr. Manal Al-Zahrani",
    icon: Award,
    color: "bg-indigo-500",
  },
];

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const isAr = locale === "ar";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (user: DemoUser) => {
    setEmail(user.email);
    setPassword(user.password);
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("invalidCredentials"));
      } else {
        router.push(`/${locale}`);
        router.refresh();
      }
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  const visibleUsers = showAllUsers ? demoUsers : demoUsers.slice(0, 5);

  return (
    <div className="w-full max-w-5xl animate-fade-in px-4 xs:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Login Form - Left Side */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 xs:p-8">
            {/* Logo */}
            <div className="mb-6 text-center xs:mb-8">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600/10 xs:mb-4 xs:h-16 xs:w-16">
                <GraduationCap className="h-7 w-7 text-teal-600 xs:h-8 xs:w-8" />
              </div>
              <h1 className="text-xl font-bold text-teal-600 xs:text-2xl">Campus26</h1>
              <p className="mt-1.5 text-xs text-muted xs:mt-2 xs:text-sm">{t("loginSubtitle")}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5">
              {error && (
                <div role="alert" className="rounded-lg bg-danger/10 p-3 text-center text-sm text-danger">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  {t("email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 xs:px-4 xs:py-3"
                  placeholder="admin@campus26.sa"
                  dir="ltr"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 pe-12 xs:px-4 xs:py-3"
                    placeholder="********"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
                    aria-label={showPassword ? (isAr ? "إخفاء كلمة المرور" : "Hide password") : (isAr ? "إظهار كلمة المرور" : "Show password")}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-aqua-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-teal-700 hover:to-aqua-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 xs:py-3"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {t("login")}
              </button>
            </form>

            {/* Language Switcher */}
            <div className="mt-5 flex items-center justify-center gap-2 text-sm text-muted xs:mt-6">
              <Link href="/login" locale="ar" className="rounded-md px-3 py-2 hover:text-teal-600 hover:bg-teal-50 transition-colors min-h-[44px] flex items-center">
                العربية
              </Link>
              <span className="text-border">|</span>
              <Link href="/login" locale="en" className="rounded-md px-3 py-2 hover:text-teal-600 hover:bg-teal-50 transition-colors min-h-[44px] flex items-center">
                English
              </Link>
            </div>

            {/* Note */}
            <div className="mt-3 rounded-lg bg-teal-50 p-2.5 text-center text-[11px] text-muted xs:mt-4 xs:p-3 xs:text-xs">
              <p>
                {isAr
                  ? "كلمة المرور لجميع الحسابات: 123456"
                  : "Password for all accounts: 123456"}
              </p>
            </div>
          </div>
        </div>

        {/* Demo Users Panel - Right Side */}
        <div className="lg:col-span-3">
          <div className="glass-card p-5 xs:p-6">
            <h2 className="mb-1 text-base font-bold text-foreground xs:text-lg">
              {isAr ? "🔑 حسابات تجريبية - اضغط للدخول السريع" : "🔑 Demo Accounts - Click to Quick Login"}
            </h2>
            <p className="mb-4 text-xs text-muted">
              {isAr
                ? "اختر حساباً ثم اضغط زر تسجيل الدخول. كلمة المرور لجميع الحسابات: 123456"
                : "Select an account then click Login. Password for all accounts: 123456"}
            </p>

            <div className="space-y-2">
              {visibleUsers.map((user) => {
                const Icon = user.icon;
                const isSelected = email === user.email;
                return (
                  <button
                    key={user.email}
                    onClick={() => handleQuickLogin(user)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-start transition-all hover:shadow-md xs:gap-4 xs:p-3.5 ${
                      isSelected
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-transparent bg-background hover:border-border"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${user.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {isAr ? user.nameAr : user.nameEn}
                        </p>
                        {isSelected && (
                          <span className="shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            {isAr ? "✓ محدد" : "✓ Selected"}
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[10px] font-medium text-foreground/70">
                          {user.roleAr}
                        </span>
                        <span className="truncate text-[11px] text-muted" dir="ltr">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {demoUsers.length > 5 && (
              <button
                onClick={() => setShowAllUsers(!showAllUsers)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-3 text-xs font-medium text-muted transition-colors hover:bg-background hover:text-foreground min-h-[44px]"
              >
                {showAllUsers ? (
                  <>
                    {isAr ? "عرض أقل" : "Show Less"}
                    <ChevronUp className="h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    {isAr
                      ? `عرض جميع الحسابات (${demoUsers.length})`
                      : `Show All Accounts (${demoUsers.length})`}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            )}

            {/* Quick Reference Table */}
            <div className="mt-4 rounded-xl bg-background p-3 xs:p-4">
              <h3 className="mb-2 text-xs font-bold text-foreground">
                {isAr ? "📋 ملخص الأدوار" : "📋 Roles Summary"}
              </h3>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] xs:grid-cols-3">
                {[
                  { role: isAr ? "مدير النظام" : "Super Admin", count: 1 },
                  { role: isAr ? "العميد" : "Dean", count: 1 },
                  { role: isAr ? "الوكلاء" : "VPs", count: 3 },
                  { role: isAr ? "رؤساء أقسام" : "Dept Heads", count: 8 },
                  { role: isAr ? "المدربون" : "Trainers", count: 5 },
                  { role: isAr ? "المتدربون" : "Trainees", count: 1 },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5"
                  >
                    <span className="text-muted">{item.role}</span>
                    <span className="font-bold text-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-muted">
                {isAr ? "إجمالي الحسابات: 19 حساب" : "Total Accounts: 19"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
