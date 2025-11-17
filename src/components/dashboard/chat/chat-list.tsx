
import type { Request, User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";

interface ChatListProps {
  requests: Request[];
  users: User[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
}

export function ChatList({ requests, users, selectedRequestId, onSelectRequest }: ChatListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search requests..." className="pl-10" />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {requests.map((request) => {
            const lastMessage = request.messages[request.messages.length - 1];
            if (!lastMessage) return null; // Defensive check
            const createdByUser = users.find(u => u.id === request.createdBy);
            
            return (
              <button
                key={request.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 text-left transition-all hover:bg-secondary",
                  selectedRequestId === request.id && "bg-secondary"
                )}
                onClick={() => onSelectRequest(request.id)}
              >
                <Avatar className="h-10 w-10 border">
                    {createdByUser?.avatar && <AvatarImage src={createdByUser.avatar} alt={createdByUser.name} />}
                    <AvatarFallback>{createdByUser?.name.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{request.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{lastMessage.content}</p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
