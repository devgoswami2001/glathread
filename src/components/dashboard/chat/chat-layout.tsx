'use client';

import type { Request, User } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { ChatDisplay } from './chat-display';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChatList } from './chat-list';

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
    <div className="relative flex h-[calc(100vh-12rem)] w-full rounded-lg border bg-card overflow-hidden">
        <div className={cn(
            "h-full transition-all duration-300 ease-in-out",
            isMobile ? "w-full" : "w-[320px] border-r",
            isMobile && selectedRequestId ? "absolute -left-full" : "relative left-0"
        )}>
            <ChatList
                requests={requests}
                users={users}
                selectedRequestId={selectedRequestId}
                onSelectRequest={handleSelectRequest}
            />
        </div>
        <AnimatePresence>
            <motion.div 
                key={selectedRequestId || 'no-chat'}
                className={cn(
                    "h-full flex-1",
                    isMobile && selectedRequestId ? "block" : isMobile ? "hidden" : "block"
                )}
                initial={isMobile ? { x: '100%' } : { x: 0 }}
                animate={isMobile ? { x: 0 } : { x: 0 }}
                exit={isMobile ? { x: '100%' } : { x: 0 }}
                transition={{ duration: 0.3, ease: 'inOut' }}
            >
                <ChatDisplay 
                    request={selectedRequest || null} 
                    users={users} 
                    currentUser={currentUser!}
                    onBack={isMobile ? handleBack : undefined}
                />
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
