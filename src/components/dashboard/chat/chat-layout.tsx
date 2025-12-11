'use client';

import type { Message, Request, User } from '@/lib/types';
import { MessageType, RequestStatus } from '@/lib/types';
import { ChatDisplay } from './chat-display';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ChatLayoutProps {
  request: Request | null;
  users: User[];
  currentUser: User;
  currentUserId: number | null;
}

export function ChatLayout({ request: initialRequest, users, currentUser, currentUserId }: ChatLayoutProps) {
  const [request, setRequest] = useState(initialRequest);
  const { toast } = useToast();

  useEffect(() => {
    setRequest(initialRequest);
  }, [initialRequest]);


  const addMessage = (newMessage: Message) => {
    setRequest(prevRequest => {
      if (!prevRequest) return null;
      // Avoid adding duplicate messages
      if (prevRequest.messages.some(msg => msg.id === newMessage.id)) {
        return prevRequest;
      }
      return {
        ...prevRequest,
        messages: [...prevRequest.messages, newMessage],
        // Also update apiData if the new message changes it (e.g. gate pass)
        apiData: {
            ...prevRequest.apiData,
            gate_passes: newMessage.gatePass ? [...(prevRequest.apiData.gate_passes || []), newMessage.gatePass] : prevRequest.apiData.gate_passes
        }
      };
    });
  };

  const handleApprovalAction = async (status: 'approved' | 'rejected') => {
    if (!request) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ variant: "destructive", title: "Authentication Error" });
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/threads/${request.apiData.id}/approve-reject/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ approval_status: status })
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to update status');
      }

      // ✅ Update local state SAFELY using only what backend sends
      setRequest(prevRequest => {
        if (!prevRequest) return null;

        return {
          ...prevRequest,
          status: status === 'approved' ? RequestStatus.APPROVED : RequestStatus.REJECTED,
          apiData: {
            ...prevRequest.apiData,
            status: status === 'approved' ? RequestStatus.APPROVED : RequestStatus.REJECTED,
            approval_status: status,
          },
          // ✅ Remove approval message safely
          messages: prevRequest.messages.filter(
            msg => msg.type !== MessageType.APPROVAL
          ),
        };
      });

      toast({
        title: `Request ${status}`,
        description: responseData.message || `The request has been successfully ${status}.`,
      });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: error.message,
      });
    }
  };


  const onProgressUpdate = (newProgress: any) => {
    setRequest(prevRequest => {
      if (!prevRequest) return null;

      const newUpdateMessage: Message = {
        id: `progress-${newProgress.id}`,
        requestId: prevRequest.id,
        senderId: 'system',
        content: `Progress updated by ${newProgress.updated_by_name}`,
        timestamp: newProgress.created_at,
        type: MessageType.PROGRESS_UPDATE,
        seen: true,
        progress: newProgress,
      };

      return {
        ...prevRequest,
        apiData: {
          ...prevRequest.apiData,
          progress_updates: [...(prevRequest.apiData.progress_updates || []), newProgress]
        },
        messages: [...prevRequest.messages, newUpdateMessage]
      };
    });
  };
  
  const onGatePassUpdate = (passId: number) => {
    setRequest(prevRequest => {
      if (!prevRequest) return null;
      
      const inTime = new Date().toISOString();
      const newUpdateMessage: Message = {
        id: `gatepass-in-${passId}`,
        requestId: prevRequest.id,
        senderId: 'system',
        content: `Vehicle marked as IN.`,
        timestamp: inTime,
        type: MessageType.GATE_PASS_IN,
        seen: true,
        gatePass: prevRequest.apiData.gate_passes.find((p: any) => p.id === passId)
      };

      return {
        ...prevRequest,
        apiData: {
            ...prevRequest.apiData,
            gate_passes: prevRequest.apiData.gate_passes.map((p: any) => 
                p.id === passId ? { ...p, in_time: inTime, status: 'completed' } : p
            )
        },
        messages: [...prevRequest.messages, newUpdateMessage],
      }
    });
  };
  
  const handleMarkCompleted = async () => {
    if (!request) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ variant: "destructive", title: "Authentication Error" });
      return;
    }
    
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/threads/${request.apiData.id}/mark-completed/`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || "Failed to mark as completed.");
        }
        
        setRequest(prevRequest => {
            if (!prevRequest) return null;
            return {
                ...prevRequest,
                status: RequestStatus.WORK_COMPLETED,
                apiData: { ...prevRequest.apiData, status: 'completed' }
            };
        });
        
        toast({ title: "Work Completed!", description: result.message });
        
    } catch (error: any) {
         toast({ variant: "destructive", title: "Action Failed", description: error.message });
    }
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
            onApprovalAction={handleApprovalAction}
            onProgressUpdate={onProgressUpdate}
            onGatePassUpdate={onGatePassUpdate}
            onMarkCompleted={handleMarkCompleted}
            currentUserId={currentUserId}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
