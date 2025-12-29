
'use client';

import type { Request, User } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface ChatMessageListProps {
  request: Request;
  users: User[];
  currentUser: User;
  onApprovalAction: (status: 'approved' | 'rejected') => void;
}

export function ChatMessageList({ request, users, currentUser, onApprovalAction }: ChatMessageListProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTo({
          top: viewportRef.current.scrollHeight,
          behavior: 'smooth',
        });
    }
  }, [request.messages]);
  
  return (
    <ScrollArea className="h-full" viewportRef={viewportRef}>
      <div className="relative p-4 md:p-6">
        
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {request.messages.map((message) => {
             const sender = message.senderId === 'system' 
              ? { id: 'system', name: 'System', avatar: '/logo.svg', role: 'CFO' as const } 
              : users.find((u) => u.id === message.senderId) || { id: message.senderId, name: 'Unknown User', avatar: '', role: 'Supervisor' as const};

            return (
              <ChatMessage
                key={message.id}
                message={message}
                sender={sender}
                isCurrentUser={message.senderId === currentUser.id}
                request={request}
                onApprovalAction={onApprovalAction}
                currentUser={currentUser}
              />
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
