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
    { title: "Total Requests", value: stats.total, icon: Briefcase, color: "bg-[#0055BF] text-white" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "bg-[#FFD700] text-black" },
    { title: "Working", value: stats.working, icon: Truck, color: "bg-[#00852B] text-white" },
    { title: "Work Completed", value: stats.workCompleted, icon: FileCheck, color: "bg-[#0089D9] text-white" },
    { title: "Payment Pending", value: stats.paymentPending, icon: HandCoins, color: "bg-[#FF8000] text-black" },
    { title: "Payment Done", value: stats.paymentDone, icon: PiggyBank, color: "bg-[#4CAF50] text-white" },
    { title: "Rejected", value: stats.rejected, icon: FileX, color: "bg-[#C91A0B] text-white" },
    { title: "Overdue", value: stats.overdue, icon: Clock, color: "bg-[#AF1A25] text-white" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {statItems.map((item, index) => (
        <Card key={index} className={cn("border-2 border-black/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]", item.color)}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-80">{item.title}</CardTitle>
            <item.icon className={cn("h-5 w-5 opacity-80")} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
