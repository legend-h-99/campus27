"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import {
  User,
  Globe,
  Bell,
  Shield,
  Palette,
  Save,
  Camera,
  Mail,
  Phone,
  Building2,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const [activeTab, setActiveTab] = useState("profile");
  const [language, setLanguage] = useState("ar");
  const [theme, setTheme] = useState("light");
  const [notifSettings, setNotifSettings] = useState({
    email: true,
    browser: true,
    grades: true,
    attendance: true,
    tasks: true,
    finance: false,
    system: true,
  });

  const tabs = [
    { key: "profile", label: "الملف الشخصي", icon: User },
    { key: "language", label: t("language"), icon: Globe },
    { key: "notifications", label: t("notifications"), icon: Bell },
    { key: "appearance", label: t("theme"), icon: Palette },
    { key: "security", label: t("security"), icon: Shield },
  ];

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      <PageHeader
        title={t("title")}
        description="إدارة إعدادات الحساب والتفضيلات الشخصية"
      />

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="glass-card flex gap-2 overflow-x-auto rounded-xl p-2 lg:flex-col lg:gap-0 lg:overflow-visible">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:w-full lg:gap-3 lg:px-4 lg:py-3 ${
                    activeTab === tab.key
                      ? "bg-teal-600 text-white"
                      : "text-foreground hover:bg-background"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="glass-card rounded-xl p-4 md:p-6">
              <h3 className="mb-4 text-base font-semibold text-foreground md:mb-6 md:text-lg">الملف الشخصي</h3>

              {/* Avatar */}
              <div className="mb-6 flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-600 text-2xl font-bold text-white">
                    عم
                  </div>
                  <button className="absolute -bottom-1 -end-1 rounded-full bg-white p-1.5 shadow-md hover:scale-110 hover:bg-white/90 transition-all duration-200">
                    <Camera className="h-4 w-4 text-muted" />
                  </button>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">د. عبدالله المحمدي</h4>
                  <p className="text-sm text-muted">عميد الكلية</p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      الاسم بالعربية
                    </label>
                    <input
                      type="text"
                      defaultValue="د. عبدالله المحمدي"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      الاسم بالإنجليزية
                    </label>
                    <input
                      type="text"
                      defaultValue="Dr. Abdullah Al-Mohammadi"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Mail className="h-4 w-4 text-muted" />
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      defaultValue="a.mohammadi@tvtc.gov.sa"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Phone className="h-4 w-4 text-muted" />
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      defaultValue="0551234567"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Building2 className="h-4 w-4 text-muted" />
                    الجهة
                  </label>
                  <input
                    type="text"
                    defaultValue="الكلية التقنية بالدمام"
                    disabled
                    className="w-full rounded-lg border border-border bg-background/50 px-4 py-2.5 text-sm text-muted"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
                    <Save className="h-4 w-4" />
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Language Settings */}
          {activeTab === "language" && (
            <div className="glass-card rounded-xl p-4 md:p-6">
              <h3 className="mb-4 text-base font-semibold text-foreground md:mb-6 md:text-lg">{t("language")}</h3>
              <div className="space-y-3">
                {[
                  { code: "ar", label: t("arabic"), sublabel: "Arabic", dir: "RTL" },
                  { code: "en", label: t("english"), sublabel: "English", dir: "LTR" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex w-full items-center justify-between rounded-lg border-2 p-4 transition-all duration-300 ${
                      language === lang.code
                        ? "border-teal-600 bg-teal-600/5"
                        : "border-border hover:border-teal-600/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Globe className={`h-5 w-5 ${language === lang.code ? "text-teal-600" : "text-muted"}`} />
                      <div className="text-start">
                        <p className="text-sm font-semibold text-foreground">{lang.label}</p>
                        <p className="text-xs text-muted">{lang.sublabel} ({lang.dir})</p>
                      </div>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 ${
                      language === lang.code ? "border-teal-600 bg-teal-600" : "border-border"
                    }`}>
                      {language === lang.code && (
                        <div className="flex h-full w-full items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Notification Preferences */}
          {activeTab === "notifications" && (
            <div className="glass-card rounded-xl p-4 md:p-6">
              <h3 className="mb-4 text-base font-semibold text-foreground md:mb-6 md:text-lg">تفضيلات الإشعارات</h3>

              <div className="space-y-6">
                {/* Channel Settings */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-muted">قنوات الإشعارات</h4>
                  <div className="space-y-3">
                    {[
                      { key: "email" as const, label: "البريد الإلكتروني", desc: "استلام الإشعارات عبر البريد" },
                      { key: "browser" as const, label: "المتصفح", desc: "إشعارات المتصفح الفورية" },
                    ].map((channel) => (
                      <div key={channel.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{channel.label}</p>
                          <p className="text-xs text-muted">{channel.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            setNotifSettings((prev) => ({ ...prev, [channel.key]: !prev[channel.key] }))
                          }
                          role="switch"
                          aria-checked={notifSettings[channel.key]}
                          aria-label={channel.label}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            notifSettings[channel.key] ? "bg-teal-600" : "bg-border"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                              notifSettings[channel.key] ? "start-5" : "start-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Settings */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-muted">فئات الإشعارات</h4>
                  <div className="space-y-3">
                    {[
                      { key: "grades" as const, label: "الدرجات", desc: "إشعارات اعتماد ورصد الدرجات" },
                      { key: "attendance" as const, label: "الحضور والغياب", desc: "تنبيهات الحضور والتأخر" },
                      { key: "tasks" as const, label: "المهام", desc: "المهام الجديدة والمواعيد النهائية" },
                      { key: "finance" as const, label: "الشؤون المالية", desc: "المعاملات المالية والميزانية" },
                      { key: "system" as const, label: "النظام", desc: "تحديثات وصيانة النظام" },
                    ].map((cat) => (
                      <div key={cat.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="text-sm font-medium text-foreground">{cat.label}</p>
                          <p className="text-xs text-muted">{cat.desc}</p>
                        </div>
                        <button
                          onClick={() =>
                            setNotifSettings((prev) => ({ ...prev, [cat.key]: !prev[cat.key] }))
                          }
                          role="switch"
                          aria-checked={notifSettings[cat.key]}
                          aria-label={cat.label}
                          className={`relative h-6 w-11 rounded-full transition-colors ${
                            notifSettings[cat.key] ? "bg-teal-600" : "bg-border"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                              notifSettings[cat.key] ? "start-5" : "start-0.5"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="glass-card rounded-xl p-4 md:p-6">
              <h3 className="mb-4 text-base font-semibold text-foreground md:mb-6 md:text-lg">{t("theme")}</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { key: "light", label: "فاتح", icon: Sun, desc: "المظهر الفاتح الافتراضي" },
                  { key: "dark", label: "داكن", icon: Moon, desc: "مظهر داكن مريح للعين" },
                  { key: "system", label: "تلقائي", icon: Monitor, desc: "حسب إعدادات النظام" },
                ].map((opt) => {
                  const OptIcon = opt.icon;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setTheme(opt.key)}
                      className={`flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-300 ${
                        theme === opt.key
                          ? "border-teal-600 bg-teal-600/5"
                          : "border-border hover:border-teal-600/30"
                      }`}
                    >
                      <OptIcon className={`h-8 w-8 ${theme === opt.key ? "text-teal-600" : "text-muted"}`} />
                      <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="glass-card rounded-xl p-4 md:p-6">
              <h3 className="mb-4 text-base font-semibold text-foreground md:mb-6 md:text-lg">{t("security")}</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    كلمة المرور الحالية
                  </label>
                  <input
                    type="password"
                    placeholder="أدخل كلمة المرور الحالية"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-1 gap-3 md:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      type="password"
                      placeholder="أدخل كلمة المرور الجديدة"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      type="password"
                      placeholder="أعد إدخال كلمة المرور الجديدة"
                      className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 active:scale-[0.98]">
                    <Shield className="h-4 w-4" />
                    تحديث كلمة المرور
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
