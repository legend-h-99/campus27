import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus26 - نظام إدارة الكليات التقنية",
  description: "منصة SaaS شاملة لإدارة الكليات التقنية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
