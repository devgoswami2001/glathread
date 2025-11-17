import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col bg-card">
      <DashboardHeader />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
