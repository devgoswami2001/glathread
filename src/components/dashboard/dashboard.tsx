'use client';

import { requests } from "@/lib/data";
import { Request, RequestStatus } from "@/lib/types";
import { QuickStats } from "./quick-stats";
import { SearchFilterBar } from "./search-filter-bar";
import { RequestList } from "./request-list";
import { useState } from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

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

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-semibold">Transport Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all transport requests.</p>
        </div>
        <Button size="lg" className="hidden md:flex">
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New Transport Request
        </Button>
      </div>

      <QuickStats stats={stats} />
      <SearchFilterBar onFilterChange={setFilteredRequests} />
      <RequestList requests={filteredRequests} />

      {/* Floating Action Button for Mobile */}
      <Button className="md:hidden fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-20">
        <PlusCircle className="h-6 w-6" />
        <span className="sr-only">Create New Request</span>
      </Button>
    </>
  );
}
