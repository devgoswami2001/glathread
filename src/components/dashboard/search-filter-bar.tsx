import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { RequestStatus, RequestType, VehicleType } from "@/lib/types";
import { Filter, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

interface SearchFilterBarProps {
  onFilterChange: (filteredRequests: any[]) => void;
}

export function SearchFilterBar({ onFilterChange }: SearchFilterBarProps) {
  const renderFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-row gap-4">
      <Input placeholder="Request ID (TR-xxxx)" className="xl:w-40"/>
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
        <SelectTrigger className="xl:w-40">
          <SelectValue placeholder="Request Type" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(RequestType).map(type => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
       <Select>
        <SelectTrigger className="xl:w-40">
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
        <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Search</Button>
        <Button variant="ghost"><X className="mr-2 h-4 w-4" /> Clear</Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-card rounded-lg border shadow-sm">
      {/* Desktop View */}
      <div className="hidden md:block">
        {renderFilters()}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Search & Filter
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-lg">
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4">
                {renderFilters()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
