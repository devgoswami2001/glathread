'use client';

import type { Message, Request, User } from '@/lib/types';
import { ChatDisplay } from './chat-display';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface ChatLayoutProps {
  request: Request | null;
  users: User[];
  currentUser: User;
}

export function ChatLayout({ request: initialRequest, users, currentUser }: ChatLayoutProps) {
  const [request, setRequest] = useState(initialRequest);

  const addMessage = (newMessage: Message) => {
    setRequest(prevRequest => {
      if (!prevRequest) return null;
      return {
        ...prevRequest,
        messages: [...prevRequest.messages, newMessage],
      };
    });
  };
  
  return (
    <div className="relative flex h-full w-full flex-col bg-muted/20 overflow-hidden">
        <AnimatePresence>
            <motion.div 
                key={request?.id || 'no-chat'}
                className="h-full flex-1"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                exit={{ x: 0 }}
                transition={{ duration: 0.3, ease: 'inOut' }}
            >
                <ChatDisplay 
                    request={request} 
                    users={users} 
                    currentUser={currentUser!}
                    addMessage={addMessage}
                />
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
