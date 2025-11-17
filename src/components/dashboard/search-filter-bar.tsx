
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { RequestStatus, RequestType, VehicleType } from "@/lib/types";
import { Filter, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

interface SearchFilterBarProps {
  onFilterChange: (filteredRequests: any[]) => void;
}

export function SearchFilterBar({ onFilterChange }: SearchFilterBarProps) {
  const filterElements = (
    <>
      <Input placeholder="Request ID (TR-xxxx)" className="xl:w-40" />
      <Input placeholder="Vehicle Number" className="xl:w-40" />
      <Select>
        <SelectTrigger className="xl:w-40">
          <SelectValue placeholder="Vehicle Type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(VehicleType).map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="xl:w-48">
          <SelectValue placeholder="Request Type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(RequestType).map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="xl:w-48">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(RequestStatus).map(status => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker id="from-date" />
      <DatePicker id="to-date" />
      <div className="flex gap-2">
        <Button className="w-full md:w-auto"><Search className="mr-2 h-4 w-4" /> Search</Button>
        <Button variant="ghost" className="w-full md:w-auto"><X className="mr-2 h-4 w-4" /> Clear</Button>
      </div>
    </>
  );

  return (
    <div className="p-4 bg-card rounded-lg border-2 shadow-md">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-row gap-2">
              {filterElements}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Search & Filter...
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg h-[80vh] flex flex-col">
            <SheetHeader className="mb-2 text-left">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine your search results.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto pr-6 -mr-6">
              <div className="grid grid-cols-1 gap-4">
                {filterElements}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
