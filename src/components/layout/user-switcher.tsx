"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import {
  ArrowRightLeft,
  X,
  Shield,
  GraduationCap,
  Users,
  UserCog,
  BookOpen,
  ClipboardCheck,
  Award,
  Loader2,
  CheckCircle,
  Search,
} from "lucide-react";

interface SwitchUser {
  email: string;
  password: string;
  role: string;
  roleAr: string;
  nameAr: string;
  nameEn: string;
  icon: typeof Shield;
  color: string;
}

const switchUsers: SwitchUser[] = [
  {
    email: "admin@saohil1.sa",
    password: "123456",
    role: "super_admin",
    roleAr: "مدير النظام",
    nameAr: "مدير النظام",
    nameEn: "System Admin",
    icon: Shield,
    color: "bg-red-500",
  },
  {
    email: "dean@saohil1.sa",
    password: "123456",
    role: "dean",
    roleAr: "العميد",
    nameAr: "د. أحمد العتيبي",
    nameEn: "Dr. Ahmed Al-Otaibi",
    icon: GraduationCap,
    color: "bg-teal-600",
  },
  {
    email: "vp.trainers@saohil1.sa",
    password: "123456",
    role: "vp_trainers",
    roleAr: "وكيل التدريب",
    nameAr: "د. سعد الغامدي",
    nameEn: "Dr. Saad Al-Ghamdi",
    icon: Users,
    color: "bg-blue-600",
  },
  {
    email: "vp.trainees@saohil1.sa",
    password: "123456",
    role: "vp_trainees",
    roleAr: "وكيل المتدربين",
    nameAr: "د. عبدالرحمن الراشد",
    nameEn: "Dr. Abdulrahman Al-Rashed",
    icon: GraduationCap,
    color: "bg-green-600",
  },
  {
    email: "vp.quality@saohil1.sa",
    password: "123456",
    role: "vp_quality",
    roleAr: "وكيل الجودة",
    nameAr: "د. فاطمة المطيري",
    nameEn: "Dr. Fatima Al-Mutairi",
    icon: Award,
    color: "bg-purple-600",
  },
  {
    email: "head.cs@saohil1.sa",
    password: "123456",
    role: "dept_head",
    roleAr: "رئيس قسم",
    nameAr: "د. خالد بن سعيد الشمراني",
    nameEn: "Dr. Khaled Al-Shamrani",
    icon: UserCog,
    color: "bg-orange-500",
  },
  {
    email: "trainer.abdulaziz.almarri@saohil1.sa",
    password: "123456",
    role: "trainer",
    roleAr: "مدرب",
    nameAr: "عبدالعزيز المري",
    nameEn: "Abdulaziz Al-Marri",
    icon: BookOpen,
    color: "bg-teal-500",
  },
  {
    email: "s241001@stu.saohil1.sa",
    password: "123456",
    role: "trainee",
    roleAr: "متدرب",
    nameAr: "مازن بن منصور الفيفي",
    nameEn: "Mazen Al-Fifi",
    icon: GraduationCap,
    color: "bg-cyan-500",
  },
  {
    email: "accountant@saohil1.sa",
    password: "123456",
    role: "accountant",
    roleAr: "محاسب",
    nameAr: "أ. سلطان الحربي",
    nameEn: "Mr. Sultan Al-Harbi",
    icon: ClipboardCheck,
    color: "bg-amber-600",
  },
  {
    email: "quality@saohil1.sa",
    password: "123456",
    role: "quality_officer",
    roleAr: "مسؤول جودة",
    nameAr: "د. منال الزهراني",
    nameEn: "Dr. Manal Al-Zahrani",
    icon: Award,
    color: "bg-indigo-500",
  },
];

interface UserSwitcherProps {
  currentEmail?: string;
  onClose: () => void;
  isOpen: boolean;
}

export function UserSwitcher({ currentEmail, onClose, isOpen }: UserSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === "ar";
  const modalRef = useRef<HTMLDivElement>(null);
  const [switching, setSwitching] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  const handleSwitch = async (user: SwitchUser) => {
    if (user.email === currentEmail) return;

    setSwitching(user.email);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (result?.error) {
        setError(isAr ? "فشل تبديل المستخدم. تأكد من أن قاعدة البيانات تعمل." : "Failed to switch user. Make sure the database is running.");
        setSwitching(null);
        return;
      }

      setSuccess(user.email);

      // Short delay to show success checkmark, then full reload
      setTimeout(() => {
        window.location.href = `/${locale}`;
      }, 400);
    } catch {
      setError(isAr ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
      setSwitching(null);
    }
  };

  // Filter users by search
  const filteredUsers = searchQuery.trim()
    ? switchUsers.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
          u.nameAr.toLowerCase().includes(q) ||
          u.nameEn.toLowerCase().includes(q) ||
          u.roleAr.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
        );
      })
    : switchUsers;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "dropdown-animate relative z-10 mx-4 flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
          "sm:mx-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label={isAr ? "تبديل المستخدم" : "Switch User"}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-gradient-to-r from-teal-50 to-aqua-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-aqua-600 shadow-md">
              <ArrowRightLeft className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {isAr ? "تبديل المستخدم" : "Switch User"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? "اختر حساباً للتبديل إليه" : "Select an account to switch to"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 border-b border-border px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن مستخدم..." : "Search user..."}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pe-3 ps-9 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-600/10"
              dir={isAr ? "rtl" : "ltr"}
              autoFocus
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="shrink-0 border-b border-red-100 bg-red-50 px-5 py-2">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1.5">
            {filteredUsers.map((user) => {
              const Icon = user.icon;
              const isCurrent = user.email === currentEmail;
              const isSwitching = switching === user.email;
              const isSuccess = success === user.email;

              return (
                <button
                  key={user.email}
                  onClick={() => handleSwitch(user)}
                  disabled={isCurrent || switching !== null}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl p-3 text-start transition-all",
                    isCurrent
                      ? "cursor-default border-2 border-teal-500/30 bg-teal-50/80"
                      : isSuccess
                        ? "border-2 border-green-500/30 bg-green-50"
                        : "border-2 border-transparent hover:border-teal-200 hover:bg-teal-50/50",
                    switching !== null && !isSwitching && !isCurrent && "opacity-50"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white transition-transform",
                      user.color,
                      !isCurrent && !switching && "group-hover:scale-105"
                    )}
                  >
                    {isSwitching ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {isAr ? user.nameAr : user.nameEn}
                      </p>
                      {isCurrent && (
                        <span className="shrink-0 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {isAr ? "الحالي" : "Current"}
                        </span>
                      )}
                      {isSuccess && (
                        <span className="shrink-0 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {isAr ? "✓ تم" : "✓ Done"}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {user.roleAr}
                      </span>
                      <span className="truncate text-[11px] text-slate-400" dir="ltr">
                        {user.email}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  {!isCurrent && !isSwitching && !isSuccess && (
                    <ArrowRightLeft className={cn(
                      "h-4 w-4 shrink-0 text-slate-300 transition-colors",
                      switching === null && "group-hover:text-teal-500"
                    )} />
                  )}
                </button>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-slate-400">
                  {isAr ? "لا توجد نتائج" : "No results found"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-slate-50 px-5 py-3">
          <p className="text-center text-[10px] text-slate-400">
            {isAr
              ? "كلمة المرور لجميع الحسابات التجريبية: 123456"
              : "Password for all demo accounts: 123456"}
          </p>
        </div>
      </div>
    </div>
  );
}
