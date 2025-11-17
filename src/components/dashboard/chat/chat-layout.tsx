'use client';

import type { Request, User } from '@/lib/types';
import { ChatDisplay } from './chat-display';
import { AnimatePresence, motion } from 'framer-motion';

interface ChatLayoutProps {
  request: Request | null;
  users: User[];
  currentUser: User;
}

export function ChatLayout({ request, users, currentUser }: ChatLayoutProps) {
  return (
    <div className="relative flex h-full w-full bg-muted/20 overflow-hidden">
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
                />
            </motion.div>
        </AnimatePresence>
    </div>
  );
}
