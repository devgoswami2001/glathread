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
    case RequestStatus.PENDING: return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700";
    case RequestStatus.APPROVED: return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700";
    case RequestStatus.WORKING: return "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-300 dark:border-indigo-700";
    case RequestStatus.WORK_COMPLETED: return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700";
    case RequestStatus.PAYMENT_PENDING: return "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700";
    case RequestStatus.PAYMENT_DONE: return "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/50 dark:text-teal-300 dark:border-teal-700";
    case RequestStatus.REJECTED: return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700";
    case RequestStatus.OVERDUE: return "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700";
    default: return "bg-secondary";
  }
};


export function RequestList({ requests }: RequestListProps) {
  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg border">
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
          <Card key={request.id} className="shadow-sm hover:shadow-md transition-all duration-300">
             <Link href={`/dashboard/requests/${request.id.replace('TR-','')}`} className="block hover:bg-secondary/50 rounded-lg">
                <CardContent className="p-4 grid md:grid-cols-12 items-center gap-4">
                    <div className="md:col-span-8 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-muted-foreground">{request.id}</span>
                            <Badge variant="outline" className="text-xs">{request.requestType}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg leading-tight">{request.title}</h3>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{request.vehicleDetails}</span>
                            <Dot className="hidden sm:inline-block -mx-2.5"/>
                            <span>Created: {format(new Date(request.createdAt), "dd MMM, yyyy")}</span>
                        </div>
                    </div>
                    <div className="md:col-span-3 flex md:flex-col md:items-end gap-2">
                        <Badge className={`py-1 px-3 text-xs font-medium rounded-md border ${getStatusClass(request.status)}`}>{request.status}</Badge>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
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
