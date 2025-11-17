'use client';

import type { Request, User } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { ChatDisplay } from './chat-display';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatLayoutProps {
  requests: Request[];
  users: User[];
  defaultSelectedRequestId?: string;
}

export function ChatLayout({ requests, users, defaultSelectedRequestId }: ChatLayoutProps) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(defaultSelectedRequestId || null);
  const isMobile = useIsMobile();
  const currentUser = users.find(u => u.id === 'user-current');

  if (isMobile === undefined) {
    return null; // or a loading skeleton
  }

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  const handleSelectRequest = (id: string) => {
    setSelectedRequestId(id);
  };
  
  const handleBack = () => {
    setSelectedRequestId(null);
  }

  return (
    <div className="relative flex h-[calc(100vh-12rem)] w-full rounded-lg border bg-card">
      <div className="h-full flex-1">
        <ChatDisplay 
          request={selectedRequest || null} 
          users={users} 
          currentUser={currentUser!}
        />
      </div>
    </div>
  );
}
