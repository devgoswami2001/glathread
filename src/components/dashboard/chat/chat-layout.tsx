'use client';

import type { Request, User } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { ChatList } from './chat-list';
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
    <div className="relative flex h-full w-full">
      <div className={cn("h-full w-full md:w-1/3 md:border-r", isMobile && selectedRequestId ? 'hidden' : 'block')}>
        <ChatList
          requests={requests}
          users={users}
          selectedRequestId={selectedRequestId}
          onSelectRequest={handleSelectRequest}
        />
      </div>

      <AnimatePresence>
        {selectedRequest && isMobile ? (
          <motion.div
            key="chat-display"
            className="absolute inset-0 z-10 bg-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <ChatDisplay 
              request={selectedRequest} 
              users={users} 
              currentUser={currentUser!}
              onBack={handleBack}
            />
          </motion.div>
        ) : (
          <div className={cn("h-full flex-1", isMobile ? 'hidden' : 'flex')}>
            <ChatDisplay 
              request={selectedRequest || null} 
              users={users} 
              currentUser={currentUser!}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
