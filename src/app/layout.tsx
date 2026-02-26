import type { Metadata } from "next";
import { headers } from "next/headers";
import { BRAND } from "@/config/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND.nameEn} - ${BRAND.taglineAr}`,
  description: "منصة SaaS شاملة لإدارة الكليات التقنية",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // next-intl middleware injects x-next-intl-locale into every request
  const headersList = await headers();
  const locale = headersList.get("x-next-intl-locale") ?? "ar";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
