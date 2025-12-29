

'use client';

import { requests } from "@/lib/data";
import { Request, RequestStatus } from "@/lib/types";
import { QuickStats } from "./quick-stats";
import { SearchFilterBar } from "./search-filter-bar";
import { RequestList } from "./request-list";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { PlusCircle, CalendarClock, Briefcase, ArrowRight, Loader2, Dot, AlertTriangle, Bell } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useRouter } from "next/navigation";

interface DashboardData {
  total_requests: number;
  pending: number;
  working: number;
  work_completed: number;
  payment_pending: number;
  payment_done: number;
  rejected: number;
  overdue: {
    count: number;
    threads: any[];
  };
  todays_pendency: {
    count: number;
    threads: any[];
  };
  todays_work: {
    count: number;
    threads: any[];
  };
  todays_reminders: {
    count: number;
    reminders: any[];
  }
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case RequestStatus.PENDING.toLowerCase(): return "bg-[#FFD700] text-black hover:bg-[#FFD700]/80";
    case RequestStatus.APPROVED.toLowerCase(): return "bg-[#0089D9] text-white hover:bg-[#0089D9]/80";
    case RequestStatus.WORKING.toLowerCase(): return "bg-[#00852B] text-white hover:bg-[#00852B]/80";
    case RequestStatus.WORK_COMPLETED.toLowerCase(): return "bg-[#0089D9] text-white hover:bg-[#0089D9]/80";
    case RequestStatus.PAYMENT_PENDING.toLowerCase(): return "bg-[#FF8000] text-black hover:bg-[#FF8000]/80";
    case RequestStatus.PAYMENT_DONE.toLowerCase(): return "bg-[#4CAF50] text-white hover:bg-[#4CAF50]/80";
    case RequestStatus.REJECTED.toLowerCase(): return "bg-[#C91A0B] text-white hover:bg-[#C91A0B]/80";
    case RequestStatus.OVERDUE.toLowerCase(): return "bg-[#AF1A25] text-white hover:bg-[#AF1A25]/80";
    default: return "bg-gray-400 text-gray-900";
  }
};


export function Dashboard() {
  const [filteredRequests, setFilteredRequests] = useState<Request[]>(requests);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You are not logged in. Redirecting to login page.",
        });
        router.push('/');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/dashboard-counts/", {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          if (response.status === 401) {
             toast({
              variant: "destructive",
              title: "Authentication Expired",
              description: "Please log in again.",
            });
            router.push('/');
            return;
          }
          throw new Error("Failed to fetch dashboard data.");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error.message || "Could not load dashboard data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast, router]);

  const stats = dashboardData ? {
    total: dashboardData.total_requests,
    pending: dashboardData.pending,
    working: dashboardData.working,
    workCompleted: dashboardData.work_completed,
    paymentPending: dashboardData.payment_pending,
    paymentDone: dashboardData.payment_done,
    rejected: dashboardData.rejected,
    overdue: dashboardData.overdue.count,
  } : {
    total: 0, pending: 0, working: 0, workCompleted: 0,
    paymentPending: 0, paymentDone: 0, rejected: 0, overdue: 0,
  };

  const todaysPendency = dashboardData?.todays_pendency?.threads || [];
  const overdueThreads = dashboardData?.overdue?.threads || [];
  const todaysWork = dashboardData?.todays_work?.threads || [];
  const todaysReminders = dashboardData?.todays_reminders?.reminders || [];
  
  const RequestThreadCard = ({ request, showStatus = true } : { request: any, showStatus?: boolean }) => (
    <Card key={request.thread_number} className="rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 border-2 border-black/20">
       <Link href={`/dashboard/requests/${request.thread_number}`} className="block hover:bg-black/5 rounded-sm">
          <CardContent className="p-4 grid md:grid-cols-12 items-center gap-4">
              <div className="md:col-span-8 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-black/60 bg-black/10 px-2 py-1 rounded-sm">TR-{String(request.thread_number).padStart(3, '0')}</span>
                  </div>
                  <h3 className="font-semibold text-base leading-tight truncate">{request.title}</h3>
                  <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Created by: {request.created_by_name}</span>
                      {request.due_date && (
                        <>
                          <Dot className="hidden sm:inline-block -mx-2.5"/>
                          <span>Due: {format(new Date(request.due_date), "dd MMM, yyyy")}</span>
                        </>
                      )}
                  </div>
              </div>
              <div className="md:col-span-3 flex md:flex-col md:items-end gap-2">
                  {showStatus && <Badge className={`py-1 px-2 text-xs font-bold rounded-sm border-2 border-black/20 ${getStatusClass(request.status)}`}>{request.status.toUpperCase()}</Badge>}
              </div>
              <div className="md:col-span-1 flex justify-end">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full">
                      <ArrowRight className="h-5 w-5" />
                  </Button>
              </div>
          </CardContent>
       </Link>
    </Card>
  );

  const ReminderCard = ({ reminder }: { reminder: any }) => (
    <Card key={reminder.id} className="rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all duration-200 border-2 border-black/20">
        <Link href={`/dashboard/requests/${reminder.id}`} className="block hover:bg-black/5 rounded-sm">
             <CardContent className="p-4 grid grid-cols-12 items-center gap-4">
              <div className="col-span-12 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-black/60 bg-black/10 px-2 py-1 rounded-sm">{reminder.work_thread_number}</span>
                       <Badge variant="destructive" className="text-xs">
                          {formatInTimeZone(new Date(reminder.reminder_at), 'UTC', 'p')}
                      </Badge>
                  </div>
                  <h3 className="font-semibold text-base leading-tight truncate">{reminder.title}</h3>
                  <p className="text-sm text-muted-foreground truncate italic">"{reminder.message}"</p>

              </div>
          </CardContent>
        </Link>
    </Card>
);


  if (isLoading) {
      return (
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-9 w-64 mb-2" />
                  <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-12 w-64 hidden md:flex" />
              </div>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i}>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-5" />
                          </CardHeader>
                           <CardContent>
                             <Skeleton className="h-8 w-12" />
                           </CardContent>
                      </Card>
                  ))}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  <Card><CardContent className="p-6"><Skeleton className="h-40" /></CardContent></Card>
                  <Card><CardContent className="p-6"><Skeleton className="h-40" /></CardContent></Card>
                  <Card><CardContent className="p-6"><Skeleton className="h-40" /></CardContent></Card>
              </div>

              <Skeleton className="h-16" />
              <div className="space-y-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
          </div>
      )
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Transport Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all transport requests.</p>
        </div>
        <Button size="lg" className="hidden md:flex shadow-md hover:shadow-lg transition-shadow" asChild>
          <Link href="/dashboard/requests/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Transport Request
          </Link>
        </Button>
      </div>

      <QuickStats stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Reminders</CardTitle>
                    <CardDescription>Important actions and notifications for today.</CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">View All <ArrowRight className="h-4 w-4" /></Link>
                 </Button>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {todaysReminders.length > 0 ? todaysReminders.map((reminder: any) => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                )) : (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center">
                        <Bell className="mx-auto h-8 w-8 mb-2" />
                        <p>No reminders for today.</p>
                    </div>
                )}
            </CardContent>
        </Card>
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Today’s Pendency</CardTitle>
                    <CardDescription>Threads created today that are awaiting approval.</CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">View All <ArrowRight className="h-4 w-4" /></Link>
                 </Button>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                {todaysPendency.length > 0 ? todaysPendency.map((request: any) => (
                    <RequestThreadCard key={request.thread_number} request={request} />
                )) : (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center">
                        <CalendarClock className="mx-auto h-8 w-8 mb-2" />
                        <p>No pending requests for today.</p>
                    </div>
                )}
            </CardContent>
        </Card>
         <Card className="flex flex-col">
             <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Overdue Threads</CardTitle>
                    <CardDescription>Threads that have passed their due date.</CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">View All <ArrowRight className="h-4 w-4" /></Link>
                 </Button>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                 {overdueThreads.length > 0 ? overdueThreads.map((request: any) => (
                   <RequestThreadCard key={request.thread_number} request={request} />
                 )) : (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center">
                        <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                        <p>No overdue threads.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 lg:gap-6 mt-4">
         <Card className="flex flex-col">
             <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Today’s Work</CardTitle>
                    <CardDescription>All threads that were created today.</CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">View All <ArrowRight className="h-4 w-4" /></Link>
                 </Button>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                 {todaysWork.length > 0 ? todaysWork.map((request: any) => (
                   <RequestThreadCard key={request.thread_number} request={request} />
                 )) : (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg h-full flex flex-col justify-center items-center">
                        <Briefcase className="mx-auto h-8 w-8 mb-2" />
                        <p>No new threads created today.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

      <SearchFilterBar onFilterChange={setFilteredRequests} />
      <RequestList requests={filteredRequests} />

      {/* Floating Action Button for Mobile */}
      <Button asChild className="md:hidden fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg z-20">
         <Link href="/dashboard/requests/new">
            <PlusCircle className="h-7 w-7" />
            <span className="sr-only">Create New Request</span>
         </Link>
      </Button>
    </>
  );
}
