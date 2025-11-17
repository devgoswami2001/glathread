import type { Request } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatTopbarProps {
  request: Request;
  onBack?: () => void;
}

export function ChatTopbar({ request, onBack }: ChatTopbarProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pending Approval': return 'default';
      case 'Approved': return 'secondary';
      case 'Rejected': return 'destructive';
      case 'In Progress': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="flex h-16 items-center gap-3 border-b px-4">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      <div className="flex-1">
        <p className="font-semibold truncate">{request.title}</p>
        <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(request.status)} className="capitalize">{request.status}</Badge>
            <span className="text-xs text-muted-foreground">{request.vehicleDetails}</span>
        </div>
      </div>
    </div>
  );
}
