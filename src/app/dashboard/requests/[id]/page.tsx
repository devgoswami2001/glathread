

'use client';

import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { users as initialUsers } from "@/lib/data";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Request, User, ProgressUpdate, Message, GatePass } from "@/lib/types";
import { MessageType } from "@/lib/types";

function transformApiToRequest(apiData: any, threadId: string, currentUserId: number | null): { request: Request | null, users: User[] } {
    if (!apiData || !apiData.thread) return { request: null, users: initialUsers };

    const thread = apiData.thread;
    let updatedUsers = [...initialUsers];

    const addOrUpdateUser = (id: number, name: string, role: 'Supervisor' | 'CFO' | 'GateTeam') => {
        const userId = `user-${id}`;
        let user = updatedUsers.find(u => u.id === userId);
        if (!user) {
            user = { id: userId, name: name, avatar: '', role: role };
            updatedUsers.push(user);
        }
        return user;
    };
    
    const createdByUser = addOrUpdateUser(thread.created_by, thread.created_by_name, 'Supervisor');
    if (thread.approved_by) {
        addOrUpdateUser(thread.approved_by, thread.approved_by_name || `User ${thread.approved_by}`, 'CFO');
    }
    thread.messages.forEach((msg: any) => {
        addOrUpdateUser(msg.sender, msg.sender_name, 'Supervisor'); // Assuming senders are supervisors for now
    });
     if (currentUserId) {
        const currentUserInList = updatedUsers.find(u => u.id === `user-${currentUserId}`);
        if (currentUserInList) {
            currentUserInList.id = 'user-current';
        }
    }


    const documents = [];
    if (thread.document_1_file) documents.push({ name: thread.document_1_name, url: `http://127.0.0.1:8000${thread.document_1_file}` });
    if (thread.document_2_file) documents.push({ name: thread.document_2_name, url: `http://127.0.0.1:8000${thread.document_2_file}` });
    if (thread.document_3_file) documents.push({ name: thread.document_3_name, url: `http://127.0.0.1:8000${thread.document_3_file}` });
    if (thread.document_4_file) documents.push({ name: thread.document_4_name, url: `http://127.0.0.1:8000${thread.document_4_file}` });

    let messages: Message[] = thread.messages.map((msg: any): Message => {
        const baseMessage = {
            id: `msg-${msg.id}`,
            requestId: threadId,
            senderId: msg.sender === currentUserId ? 'user-current' : `user-${msg.sender}`,
            timestamp: msg.created_at,
            seen: true,
        };

        if (msg.message_type === 'text') {
            return {
                ...baseMessage,
                content: msg.text_message,
                type: MessageType.TEXT,
            };
        } else {
             const getFileType = (apiType: string) => {
                switch (apiType) {
                    case 'image': return 'image';
                    case 'video': return 'video';
                    case 'audio': return 'voice';
                    default: return 'file';
                }
            };
            return {
                ...baseMessage,
                content: msg.text_message || '',
                type: MessageType.FILE,
                file: {
                    name: msg.media_file.split('/').pop() || 'attachment',
                    url: `http://127.0.0.1:8000${msg.media_file}`,
                    type: getFileType(msg.message_type),
                }
            };
        }
    });
    
     messages.unshift({
        id: `msg-${thread.id}-details`,
        requestId: `TR-${String(thread.thread_number).padStart(3, '0')}`,
        senderId: 'system',
        type: MessageType.REQUEST_DETAILS,
        content: `Request created by ${thread.created_by_name}.`,
        timestamp: new Date(thread.created_at).toISOString(),
        seen: true
    });

    if (thread.approval_status === 'pending' ) {
        messages.push({
            id: `msg-${thread.id}-approval`,
            requestId: `TR-${String(thread.thread_number).padStart(3, '0')}`,
            senderId: 'system',
            content: `This request requires your approval. Please review the details and take action.`,
            timestamp: new Date().toISOString(),
            type: MessageType.APPROVAL,
            seen: false,
        });
    }

    if (thread.progress_updates && thread.progress_updates.length > 0) {
        const progressMessages = thread.progress_updates.map((update: ProgressUpdate): Message => ({
            id: `progress-${update.id}`,
            requestId: threadId,
            senderId: 'system',
            content: `Progress updated by ${update.updated_by_name}`,
            timestamp: new Date(update.created_at).toISOString(),
            type: MessageType.PROGRESS_UPDATE,
            seen: true,
            progress: update,
        }));
        messages = [...messages, ...progressMessages];
    }
    
    if (thread.gate_passes && thread.gate_passes.length > 0) {
        thread.gate_passes.forEach((pass: GatePass) => {
            messages.push({
                id: `gatepass-details-${pass.id}`,
                requestId: threadId,
                senderId: 'system',
                content: `Gate Pass #${pass.id} has been created.`,
                timestamp: new Date(pass.created_at).toISOString(),
                type: MessageType.GATE_PASS_DETAILS,
                seen: true,
                gatePass: pass,
            });

            if (pass.out_time) {
                messages.push({
                    id: `gatepass-out-${pass.id}`,
                    requestId: threadId,
                    senderId: 'system',
                    content: `Vehicle marked as OUT.`,
                    timestamp: new Date(pass.out_time).toISOString(),
                    type: MessageType.GATE_PASS_OUT,
                    seen: true,
                    gatePass: pass,
                });
            }

            if (pass.in_time) {
                 messages.push({
                    id: `gatepass-in-${pass.id}`,
                    requestId: threadId,
                    senderId: 'system',
                    content: `Vehicle marked as IN.`,
                    timestamp: new Date(pass.in_time).toISOString(),
                    type: MessageType.GATE_PASS_IN,
                    seen: true,
                    gatePass: pass,
                });
            }
        });
    }

    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const request: Request = {
        id: `TR-${String(thread.thread_number).padStart(3, '0')}`,
        title: thread.title,
        vehicleType: thread.vehicle_type,
        vehicleNumber: thread.vehicle_number,
        vehicleDetails: `${thread.vehicle_type} - ${thread.vehicle_number}`,
        requestType: thread.request_category_name,
        status: thread.status,
        createdBy: createdByUser.id,
        cfo: 'user-cfo',
        createdAt: new Date(thread.created_at).toISOString(),
        updatedAt: new Date(thread.updated_at).toISOString(),
        documents: documents,
        messages: messages,
        apiData: thread,
    };

    return { request, users: updatedUsers };
}


export default function RequestPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { toast } = useToast();
  const [request, setRequest] = useState<Request | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchUserAndThread = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You are not logged in." });
        router.push('/');
        return;
      }

      try {
        // Fetch current user
        const userResponse = await fetch(`http://127.0.0.1:8000/api/auth/me/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userResponse.ok) throw new Error('Failed to fetch user details');
        const userData = await userResponse.json();
        setCurrentUserId(userData.user.id);
        const currentUserFromApi : User = { 
            id: 'user-current', 
            name: userData.user.full_name, 
            avatar: '', 
            role: 'Supervisor' // Role mapping needed
        };
        setCurrentUser(currentUserFromApi);

        // Fetch thread details
        const threadResponse = await fetch(`http://127.0.0.1:8000/api/threads/${id}/full-detail/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!threadResponse.ok) {
           if (threadResponse.status === 401) {
             toast({ variant: "destructive", title: "Authentication Expired", description: "Please log in again." });
             router.push('/');
             return;
           }
          throw new Error('Failed to fetch thread details');
        }

        const threadData = await threadResponse.json();
        if (threadData.success) {
          const { request: transformedRequest, users: updatedUsers } = transformApiToRequest(threadData, id, userData.user.id);
          setRequest(transformedRequest);
          setUsers(updatedUsers);
        } else {
          throw new Error(threadData.message || 'Could not load thread data.');
        }

      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserAndThread();
    }
  }, [id, router, toast]);

  if (isLoading) {
    return (
        <div className="h-full -m-4 md:-m-6 flex flex-col">
            <div className="flex h-16 items-center gap-3 border-b px-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
            </div>
            <div className="flex-1 p-6 space-y-6">
                <Skeleton className="h-20 w-full" />
                <div className="flex items-end gap-2 justify-end">
                    <Skeleton className="h-10 w-2/3 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="flex items-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-10 w-1/2 rounded-lg" />
                </div>
                 <div className="flex items-end gap-2 justify-end">
                    <Skeleton className="h-10 w-1/3 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
             <div className="p-4 border-t">
                <Skeleton className="h-10 w-full rounded-full" />
             </div>
        </div>
    );
  }

  if (!request || !currentUser) {
    // This part can be improved with a proper "Not Found" component
    return <div className="text-center p-8">Request not found or user not available.</div>;
  }

  return <div className="h-full -m-4 md:-m-6"><ChatLayout request={request} users={users} currentUser={currentUser} currentUserId={currentUserId} /></div>;
}
