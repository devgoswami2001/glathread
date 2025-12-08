import type { Message, Request, User } from "@/lib/types";
import { ChatTopbar } from "./chat-topbar";
import { ChatMessageList } from "./chat-message-list";
import { ChatMessageInput } from "./chat-message-input";
import { MoveRight } from "lucide-react";

interface ChatDisplayProps {
  request: Request | null;
  users: User[];
  currentUser: User;
  onBack?: () => void;
  addMessage: (message: Message) => void;
}

export function ChatDisplay({ request, users, currentUser, onBack, addMessage }: ChatDisplayProps) {
  if (!request) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
            <MoveRight className="h-10 w-10"/>
        </div>
        <h3 className="font-headline text-2xl font-semibold">Welcome to GLAThread</h3>
        <p className="text-muted-foreground">Select a request from the sidebar to start the conversation.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatTopbar request={request} onBack={onBack} />
      <div className="flex-1 overflow-y-auto">
        <ChatMessageList request={request} users={users} currentUser={currentUser} />
      </div>
      <ChatMessageInput request={request} addMessage={addMessage} />
    </div>
  );
}
