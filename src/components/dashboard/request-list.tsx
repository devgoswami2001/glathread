import { Request, RequestStatus, User } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ArrowRight, MessageSquare, Dot } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

interface RequestListProps {
  requests: Request[];
}

const getStatusClass = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.PENDING: return "bg-yellow-400 text-yellow-900 border-yellow-500";
    case RequestStatus.APPROVED: return "bg-blue-400 text-blue-900 border-blue-500";
    case RequestStatus.WORKING: return "bg-indigo-400 text-indigo-900 border-indigo-500";
    case RequestStatus.WORK_COMPLETED: return "bg-green-400 text-green-900 border-green-500";
    case RequestStatus.PAYMENT_PENDING: return "bg-orange-400 text-orange-900 border-orange-500";
    case RequestStatus.PAYMENT_DONE: return "bg-emerald-400 text-emerald-900 border-emerald-500";
    case RequestStatus.REJECTED: return "bg-red-500 text-white border-red-600";
    case RequestStatus.OVERDUE: return "bg-rose-500 text-white border-rose-600";
    default: return "bg-gray-400 text-gray-900 border-gray-500";
  }
};


export function RequestList({ requests }: RequestListProps) {
  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg border-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Request Threads</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                <Select defaultValue="newest">
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="vehicle-number">Vehicle Number</SelectItem>
                        <SelectItem value="start-date">Start Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-2 border-border/60">
             <Link href={`/dashboard/requests/${request.id.replace('TR-','')}`} className="block hover:bg-secondary/50 rounded-lg">
                <CardContent className="p-4 grid md:grid-cols-12 items-center gap-4">
                    <div className="md:col-span-8 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-muted-foreground bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">{request.id}</span>
                            <Badge variant="outline" className="text-xs border-dashed">{request.requestType}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg leading-tight">{request.title}</h3>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{request.vehicleDetails}</span>
                            <Dot className="hidden sm:inline-block -mx-2.5"/>
                            <span>Created: {format(new Date(request.createdAt), "dd MMM, yyyy")}</span>
                        </div>
                    </div>
                    <div className="md:col-span-3 flex md:flex-col md:items-end gap-2">
                        <Badge className={`py-1.5 px-3 text-xs font-bold rounded-md border-2 ${getStatusClass(request.status)}`}>{request.status.toUpperCase()}</Badge>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full">
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardContent>
             </Link>
          </Card>
        ))}
      </div>
       {requests.length === 0 && (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="font-medium">No requests found</p>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
    </div>
  );
}
