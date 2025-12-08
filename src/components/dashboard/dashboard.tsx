
'use client';

import { requests } from "@/lib/data";
import { Request, RequestStatus } from "@/lib/types";
import { QuickStats } from "./quick-stats";
import { SearchFilterBar } from "./search-filter-bar";
import { RequestList } from "./request-list";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle, CalendarClock, Briefcase } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { isToday } from 'date-fns';

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

  const todaysPendency = requests.filter(r => r.status === RequestStatus.PENDING && isToday(new Date(r.createdAt))).length;
  const todaysWork = requests.filter(r => r.status === RequestStatus.WORKING && isToday(new Date(r.createdAt))).length;


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

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-2 border-black/20 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-muted-foreground">Today's Pendency</CardTitle>
                <CalendarClock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-amber-500">{todaysPendency}</div>
                <p className="text-xs text-muted-foreground">New requests awaiting approval today</p>
            </CardContent>
        </Card>
        <Card className="border-2 border-black/20 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-transform hover:scale-[1.02]">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold text-muted-foreground">Today's Work</CardTitle>
                <Briefcase className="h-5 w-5 text-cyan-500" />
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-cyan-500">{todaysWork}</div>
                <p className="text-xs text-muted-foreground">Requests created today and in 'Working' status</p>
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
