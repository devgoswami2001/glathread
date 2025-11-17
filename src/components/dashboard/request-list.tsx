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
    case RequestStatus.PENDING: return "bg-[#FFD700] text-black hover:bg-[#FFD700]/80";
    case RequestStatus.APPROVED: return "bg-[#0089D9] text-white hover:bg-[#0089D9]/80";
    case RequestStatus.WORKING: return "bg-[#00852B] text-white hover:bg-[#00852B]/80";
    case RequestStatus.WORK_COMPLETED: return "bg-[#0089D9] text-white hover:bg-[#0089D9]/80";
    case RequestStatus.PAYMENT_PENDING: return "bg-[#FF8000] text-black hover:bg-[#FF8000]/80";
    case RequestStatus.PAYMENT_DONE: return "bg-[#4CAF50] text-white hover:bg-[#4CAF50]/80";
    case RequestStatus.REJECTED: return "bg-[#C91A0B] text-white hover:bg-[#C91A0B]/80";
    case RequestStatus.OVERDUE: return "bg-[#AF1A25] text-white hover:bg-[#AF1A25]/80";
    default: return "bg-gray-400 text-gray-900";
  }
};


export function RequestList({ requests }: RequestListProps) {
  return (
    <div className="bg-card p-4 sm:p-6 rounded-md border-2 border-black/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-xl font-semibold tracking-tight">Request Threads</h2>
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">Sort by:</span>
                <Select defaultValue="newest">
                    <SelectTrigger className="w-full sm:w-[180px] rounded-sm border-2 border-input">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm">
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="vehicle-number">Vehicle Number</SelectItem>
                        <SelectItem value="start-date">Start Date</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      <div className="grid gap-3">
        {requests.map((request) => (
          <Card key={request.id} className="rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 border-2 border-black/20">
             <Link href={`/dashboard/requests/${request.id.replace('TR-','')}`} className="block hover:bg-black/5 rounded-sm">
                <CardContent className="p-4 grid md:grid-cols-12 items-center gap-4">
                    <div className="md:col-span-8 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm text-black/60 bg-black/10 px-2 py-1 rounded-sm">{request.id}</span>
                            <Badge variant="outline" className="text-xs border-dashed rounded-sm">{request.requestType}</Badge>
                        </div>
                        <h3 className="font-semibold text-lg leading-tight">{request.title}</h3>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{request.vehicleDetails}</span>
                            <Dot className="hidden sm:inline-block -mx-2.5"/>
                            <span>Created: {format(new Date(request.createdAt), "dd MMM, yyyy")}</span>
                        </div>
                    </div>
                    <div className="md:col-span-3 flex md:flex-col md:items-end gap-2">
                        <Badge className={`py-1 px-2 text-xs font-bold rounded-sm border-2 border-black/20 ${getStatusClass(request.status)}`}>{request.status.toUpperCase()}</Badge>
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
