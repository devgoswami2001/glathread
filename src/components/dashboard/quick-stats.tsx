import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, FileCheck, FileX, HandCoins, PiggyBank, ThumbsUp, Truck } from "lucide-react";
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
    { title: "Total Requests", value: stats.total, icon: Briefcase, color: "text-blue-500" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { title: "Working", value: stats.working, icon: Truck, color: "text-indigo-500" },
    { title: "Work Completed", value: stats.workCompleted, icon: FileCheck, color: "text-green-600" },
    { title: "Payment Pending", value: stats.paymentPending, icon: HandCoins, color: "text-orange-500" },
    { title: "Payment Done", value: stats.paymentDone, icon: PiggyBank, color: "text-emerald-700" },
    { title: "Rejected", value: stats.rejected, icon: FileX, color: "text-red-600" },
    { title: "Overdue", value: stats.overdue, icon: Clock, color: "text-rose-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
      {statItems.map((item, index) => (
        <Card key={index} className="border-2 border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            <item.icon className={cn("h-5 w-5", item.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
