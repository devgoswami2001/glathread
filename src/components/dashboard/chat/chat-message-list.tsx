
'use client';

import type { Request, User } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { useEffect, useRef } from "react";

interface ChatMessageListProps {
  request: Request;
  users: User[];
  currentUser: User;
}

export function ChatMessageList({ request, users, currentUser }: ChatMessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [request.messages]);
  
  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
          {request.messages.map((message) => {
             const sender = message.senderId === 'system' 
              ? { id: 'system', name: 'System', avatar: '/logo.svg', role: 'CFO' as const } 
              : users.find((u) => u.id === message.senderId);

            return (
              <ChatMessage
                key={message.id}
                message={message}
                sender={sender!}
                isCurrentUser={message.senderId === currentUser.id}
              />
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
