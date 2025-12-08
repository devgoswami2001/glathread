
'use client';

import { requests } from "@/lib/data";
import { Request, RequestStatus } from "@/lib/types";
import { QuickStats } from "./quick-stats";
import { SearchFilterBar } from "./search-filter-bar";
import { RequestList } from "./request-list";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle, CalendarClock, Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "../ui/card";
import { isToday } from 'date-fns';
import { Badge } from "../ui/badge";

export function Dashboard() {
  const [filteredRequests, setFilteredRequests] = useState<Request[]>(requests);

  const stats = requests.reduce((acc, request) => {
    acc.total++;
    switch (request.status) {
      case RequestStatus.PENDING:
        acc.pending++;
        break;
      case RequestStatus.WORKING:
        acc.working++;
        break;
      case RequestStatus.WORK_COMPLETED:
        acc.workCompleted++;
        break;
      case RequestStatus.PAYMENT_PENDING:
        acc.paymentPending++;
        break;
      case RequestStatus.PAYMENT_DONE:
        acc.paymentDone++;
        break;
      case RequestStatus.REJECTED:
        acc.rejected++;
        break;
      case RequestStatus.OVERDUE:
        acc.overdue++;
        break;
    }
    return acc;
  }, {
    total: 0,
    pending: 0,
    working: 0,
    workCompleted: 0,
    paymentPending: 0,
    paymentDone: 0,
    rejected: 0,
    overdue: 0,
  });

  const todaysPendency = requests.filter(r => r.status === RequestStatus.PENDING && isToday(new Date(r.createdAt))).slice(0, 5);
  const todaysWork = requests.filter(r => r.status === RequestStatus.WORKING && isToday(new Date(r.createdAt))).slice(0, 5);


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

      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Today's Pendency</CardTitle>
                    <CardDescription>New requests created today that are awaiting approval.</CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">View All <ArrowRight className="h-4 w-4" /></Link>
                 </Button>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="grid gap-3">
                    {todaysPendency.length > 0 ? todaysPendency.map(request => (
                       <div key={request.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                           <div className="flex-1 space-y-1">
                               <p className="text-sm font-medium leading-none truncate">{request.title}</p>
                               <p className="text-sm text-muted-foreground">{request.vehicleDetails}</p>
                           </div>
                           <Badge className="bg-amber-500 text-white">Pending</Badge>
                           <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                             <Link href={`/dashboard/requests/${request.id.replace('TR-','')}`}><ArrowRight className="h-4 w-4" /></Link>
                           </Button>
                       </div>
                    )) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <CalendarClock className="mx-auto h-8 w-8 mb-2" />
                            <p>No pending requests for today.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
        <Card className="flex flex-col">
             <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Today's Work</CardTitle>
                    <CardDescription>Requests created today that are currently in progress.</CardDescription>
                </div>
                 <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">View All <ArrowRight className="h-4 w-4" /></Link>
                 </Button>
            </CardHeader>
            <CardContent className="flex-1">
                 <div className="grid gap-3">
                    {todaysWork.length > 0 ? todaysWork.map(request => (
                       <div key={request.id} className="flex items-center gap-4 p-3 bg-secondary/50 rounded-lg">
                           <div className="flex-1 space-y-1">
                               <p className="text-sm font-medium leading-none truncate">{request.title}</p>
                               <p className="text-sm text-muted-foreground">{request.vehicleDetails}</p>
                           </div>
                           <Badge className="bg-cyan-500 text-white">Working</Badge>
                           <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                             <Link href={`/dashboard/requests/${request.id.replace('TR-','')}`}><ArrowRight className="h-4 w-4" /></Link>
                           </Button>
                       </div>
                    )) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <Briefcase className="mx-auto h-8 w-8 mb-2" />
                            <p>No work started for today's requests.</p>
                        </div>
                    )}
                </div>
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

    