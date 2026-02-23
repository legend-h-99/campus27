import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPermissionsForRole, type Role } from "@/lib/permissions";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SessionProvider } from "@/components/shared/session-provider";
import { ResponsiveContent } from "@/components/layout/responsive-content";
import { AIChatbot } from "@/components/ai/ai-chatbot";
import { CommandPalette } from "@/components/ui/command-palette";
import { PageTransition } from "@/components/ui/page-transition";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const permissions = getPermissionsForRole(session.user.role as Role);
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <SessionProvider>
      <div className="min-h-screen bg-background">
        {/* Skip to content link for keyboard/screen reader users */}
        <a href="#main-content" className="skip-to-content">
          {isAr ? "تخطي إلى المحتوى الرئيسي" : "Skip to main content"}
        </a>
        <Sidebar userPermissions={permissions} />
        <Header
          user={{
            nameAr: session.user.nameAr,
            nameEn: session.user.nameEn,
            role: session.user.role,
            email: session.user.email,
            avatar: session.user.avatar,
          }}
        />
        <div id="main-content">
          <PageTransition>
            <ResponsiveContent>{children}</ResponsiveContent>
          </PageTransition>
        </div>
        <AIChatbot />
        <CommandPalette />
      </div>
    </SessionProvider>
  );
}
