import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, FileCheck, FileX, HandCoins, PiggyBank, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  stats: {
    total: number;
    pending: number;
    working: number;
    workCompleted: number;
    paymentPending: number;
    paymentDone: number;
    rejected: number;
    overdue: number;
  };
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statItems = [
    { title: "Total Requests", value: stats.total, icon: Briefcase, color: "text-[#0055BF]" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-[#FFD700] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]" },
    { title: "Working", value: stats.working, icon: Truck, color: "text-[#00852B]" },
    { title: "Work Completed", value: stats.workCompleted, icon: FileCheck, color: "text-[#0089D9]" },
    { title: "Payment Pending", value: stats.paymentPending, icon: HandCoins, color: "text-[#FF8000]" },
    { title: "Payment Done", value: stats.paymentDone, icon: PiggyBank, color: "text-[#4CAF50]" },
    { title: "Rejected", value: stats.rejected, icon: FileX, color: "text-[#C91A0B]" },
    { title: "Overdue", value: stats.overdue, icon: Clock, color: "text-[#AF1A25]" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {statItems.map((item, index) => (
        <Card key={index} className={cn("border-2 border-black/20 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            <item.icon className={cn("h-5 w-5 text-muted-foreground", item.color)} />
          </CardHeader>
          <CardContent>
            <div className={cn("text-3xl font-bold", item.color)}>{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
