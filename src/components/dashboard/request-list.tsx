import { Request, RequestStatus, User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface RequestListProps {
  requests: Request[];
}

const getStatusClass = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.PENDING: return "bg-yellow-500 hover:bg-yellow-500/80";
    case RequestStatus.APPROVED: return "bg-blue-500 hover:bg-blue-500/80";
    case RequestStatus.WORKING: return "bg-indigo-500 hover:bg-indigo-500/80";
    case RequestStatus.WORK_COMPLETED: return "bg-green-600 hover:bg-green-600/80";
    case RequestStatus.PAYMENT_PENDING: return "bg-orange-500 hover:bg-orange-500/80";
    case RequestStatus.PAYMENT_DONE: return "bg-green-700 hover:bg-green-700/80";
    case RequestStatus.REJECTED: return "bg-red-600 hover:bg-red-600/80";
    case RequestStatus.OVERDUE: return "bg-rose-600 hover:bg-rose-600/80";
    default: return "bg-primary";
  }
};


export function RequestList({ requests }: RequestListProps) {
  return (
    <div className="bg-card p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Request Threads</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px]">
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
          <Card key={request.id} className="shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4 grid md:grid-cols-6 items-center gap-4">
              <div className="md:col-span-4 flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-muted-foreground">{request.id}</span>
                    <Badge variant="secondary">{request.requestType}</Badge>
                </div>
                <h3 className="font-semibold text-lg">{request.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{request.vehicleType} - {request.vehicleNumber}</span>
                    <span>Created: {format(new Date(request.createdAt), "dd MMM, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <p className="truncate italic">"{request.messages[request.messages.length - 1].content}"</p>
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col md:items-end gap-2">
                 <Badge className={`text-white ${getStatusClass(request.status)}`}>{request.status}</Badge>
                 <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/requests/${request.id.replace('TR-','')}`}>
                        Open Chat Thread <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
       {requests.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No requests found matching your criteria.</p>
          </div>
        )}
    </div>
  );
}
