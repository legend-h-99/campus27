export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* TVTC-inspired gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-teal-50 via-aqua-50/50 to-sage-50" />
      <div className="fixed inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-aqua-400/12 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint-300/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-sage-400/10 blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
