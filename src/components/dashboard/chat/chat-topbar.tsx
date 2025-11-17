import type { Request } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

interface ChatTopbarProps {
  request: Request;
  onBack?: () => void;
}

export function ChatTopbar({ request, onBack }: ChatTopbarProps) {
  return (
    <div className="flex h-16 items-center gap-3 border-b px-4">
       <Button variant="ghost" size="icon" onClick={onBack} className={onBack ? "flex md:hidden" : "hidden"}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
          <Link href="/dashboard">
            <Home className="h-5 w-5" />
          </Link>
        </Button>
      <div className="flex-1">
        <p className="font-semibold truncate">{request.title} <span className="font-mono text-muted-foreground text-sm">({request.id})</span></p>
        <div className="flex items-center gap-2">
            <Badge variant={"secondary"} className="capitalize">{request.status}</Badge>
            <span className="text-xs text-muted-foreground">{request.vehicleDetails}</span>
        </div>
      </div>
    </div>
  );
}
