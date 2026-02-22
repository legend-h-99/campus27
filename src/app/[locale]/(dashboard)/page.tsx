import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { DeanDashboard } from "@/components/dashboards/dean-dashboard";
import { TrainerDashboard } from "@/components/dashboards/trainer-dashboard";
import { TraineeDashboard } from "@/components/dashboards/trainee-dashboard";

export default async function DashboardPage() {
  const session = await auth();
  const t = await getTranslations("dashboard");
  const role = session?.user?.role || "trainee";

  return (
    <div className="animate-fade-in">
      <h1 className="mb-4 text-xl font-bold text-foreground md:mb-6 md:text-2xl">
        {t("welcome")}، {session?.user?.nameAr}
      </h1>

      {(role === "dean" || role === "super_admin") && <DeanDashboard />}
      {role === "trainer" && <TrainerDashboard />}
      {role === "trainee" && <TraineeDashboard />}
      {!["dean", "super_admin", "trainer", "trainee"].includes(role) && (
        <DeanDashboard />
      )}
    </div>
  );
}
