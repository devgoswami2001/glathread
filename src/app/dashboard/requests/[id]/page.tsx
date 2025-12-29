'use client';

import * as React from "react";
import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { Request, User, ProgressUpdate, Message, GatePass } from "@/lib/types";
import { MessageType } from "@/lib/types";

function transformApiToRequest(
  apiData: any,
  threadId: string,
  currentUserId: number | null,
  currentUsers: User[]
): { request: Request | null; users: User[] } {
  if (!apiData || !apiData.thread) return { request: null, users: currentUsers };

  const thread = apiData.thread;
  let updatedUsers = [...currentUsers];

  const addOrUpdateUser = (id: number, name: string, role: string) => {
    const isCurrentUser = id === currentUserId;
    const userId = isCurrentUser ? "user-current" : `user-${id}`;

    let user = updatedUsers.find((u) => u.id === userId);

    if (!user) {
      // when first creating current user from thread data, keep role from currentUsers if present
      const existingCurrent = currentUsers.find((u) => u.id === "user-current");
      updatedUsers.push({
        id: userId,
        name,
        avatar: "",
        role: isCurrentUser
          ? existingCurrent?.role || role // prefer role from /auth/me (HOD)
          : role,
      });
    } else {
      // never override role for current user; only update name
      if (isCurrentUser) {
        if (user.name !== name) {
          updatedUsers = updatedUsers.map((u) =>
            u.id === userId ? { ...u, name } : u
          );
        }
      } else {
        // non-current users can have role/name updated
        if (user.name !== name || user.role !== role) {
          updatedUsers = updatedUsers.map((u) =>
            u.id === userId ? { ...u, name, role } : u
          );
        }
      }
    }
  };

  addOrUpdateUser(thread.created_by, thread.created_by_name, "Supervisor");
  if (thread.approved_by) {
    addOrUpdateUser(
      thread.approved_by,
      thread.approved_by_name || `User ${thread.approved_by}`,
      "CFO"
    );
  }
  thread.messages.forEach((msg: any) => {
    addOrUpdateUser(msg.sender, msg.sender_name, "Supervisor");
  });

  const documents = [];
  if (thread.document_1_file)
    documents.push({
      name: thread.document_1_name,
      url: `http://127.0.0.1:8000${thread.document_1_file}`,
    });
  if (thread.document_2_file)
    documents.push({
      name: thread.document_2_name,
      url: `http://127.0.0.1:8000${thread.document_2_file}`,
    });
  if (thread.document_3_file)
    documents.push({
      name: thread.document_3_name,
      url: `http://127.0.0.1:8000${thread.document_3_file}`,
    });
  if (thread.document_4_file)
    documents.push({
      name: thread.document_4_name,
      url: `http://127.0.0.1:8000${thread.document_4_file}`,
    });

  let messages: Message[] = thread.messages.map((msg: any): Message => {
    const baseMessage = {
      id: `msg-${msg.id}`,
      requestId: threadId,
      senderId: msg.sender === currentUserId ? "user-current" : `user-${msg.sender}`,
      timestamp: msg.created_at,
      seen: true,
    };

    if (msg.message_type === "text") {
      return {
        ...baseMessage,
        content: msg.text_message,
        type: MessageType.TEXT,
      };
    } else {
      const getFileType = (apiType: string) => {
        switch (apiType) {
          case "image":
            return "image";
          case "video":
            return "video";
          case "audio":
            return "voice";
          default:
            return "file";
        }
      };
      return {
        ...baseMessage,
        content: msg.text_message || "",
        type: MessageType.FILE,
        file: {
          name: msg.media_file.split("/").pop() || "attachment",
          url: `http://127.0.0.1:8000${msg.media_file}`,
          type: getFileType(msg.message_type),
        },
      };
    }
  });

  messages.unshift({
    id: `msg-${thread.id}-details`,
    requestId: `TR-${String(thread.thread_number).padStart(3, "0")}`,
    senderId: "system",
    type: MessageType.REQUEST_DETAILS,
    content: `Request created by ${thread.created_by_name}.`,
    timestamp: new Date(thread.created_at).toISOString(),
    seen: true,
  });

  const currentUser = updatedUsers.find((u) => u.id === "user-current");
  const isHOD = currentUser?.role === "HOD";
  const isCFO = currentUser?.role === "CFO";
  const isRegistrar = currentUser?.role === "Registrar";
  const isAdministrator = currentUser?.role === "Administrator";

  console.log("DEBUG currentUser in transform:", currentUser);
  console.log("DEBUG role in transform:", currentUser?.role);
  console.log("DEBUG flags isHOD/isCFO/isRegistrar/isAdministrator:", {
    isHOD,
    isCFO,
    isRegistrar,
    isAdministrator,
  });
  console.log("DEBUG thread.approval_status:", thread.approval_status);

  const canApprove = isHOD || isCFO || isRegistrar || isAdministrator;
  console.log("DEBUG canApprove:", canApprove);

  if (thread.approval_status === "pending" && canApprove) {
    console.log("DEBUG adding APPROVAL message for user:", currentUser);
    messages.push({
      id: `msg-${thread.id}-approval`,
      requestId: `TR-${String(thread.thread_number).padStart(3, "0")}`,
      senderId: "system",
      content:
        "This request requires your approval. Please review the details and take action.",
      timestamp: new Date().toISOString(),
      type: MessageType.APPROVAL,
      seen: false,
    });
  } else {
    console.log("DEBUG NOT adding approval. approval_status/canApprove:", {
      approval_status: thread.approval_status,
      canApprove,
    });
  }

  if (thread.progress_updates && thread.progress_updates.length > 0) {
    const progressMessages = thread.progress_updates.map(
      (update: ProgressUpdate): Message => ({
        id: `progress-${update.id}`,
        requestId: threadId,
        senderId: "system",
        content: `Progress updated by ${update.updated_by_name}`,
        timestamp: new Date(update.created_at).toISOString(),
        type: MessageType.PROGRESS_UPDATE,
        seen: true,
        progress: update,
      })
    );
    messages = [...messages, ...progressMessages];
  }

  if (thread.gate_passes && thread.gate_passes.length > 0) {
    thread.gate_passes.forEach((pass: GatePass) => {
      messages.push({
        id: `gatepass-details-${pass.id}`,
        requestId: threadId,
        senderId: "system",
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
          senderId: "system",
          content: "Vehicle marked as OUT.",
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
          senderId: "system",
          content: "Vehicle marked as IN.",
          timestamp: new Date(pass.in_time).toISOString(),
          type: MessageType.GATE_PASS_IN,
          seen: true,
          gatePass: pass,
        });
      }
    });
  }

  messages.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const request: Request = {
    id: `TR-${String(thread.thread_number).padStart(3, "0")}`,
    title: thread.title,
    vehicleType: thread.vehicle_type,
    vehicleNumber: thread.vehicle_number,
    vehicleDetails: `${thread.vehicle_type} - ${thread.vehicle_number}`,
    requestType: thread.request_category_name,
    status: thread.status,
    createdBy: `user-${thread.created_by}`,
    cfo: "user-cfo",
    createdAt: new Date(thread.created_at).toISOString(),
    updatedAt: new Date(thread.updated_at).toISOString(),
    documents: documents,
    messages: messages,
    apiData: thread,
  };

  return { request, users: updatedUsers };
}

type RequestPageProps = {
  params: Promise<{ id: string }>;
};

export default function RequestPage({ params }: RequestPageProps) {
  // Next 15: params is async, unwrap with React.use in client components
  const { id } = React.use(params); // [attached_file:1][web:27]

  const router = useRouter();
  const { toast } = useToast();
  const [request, setRequest] = useState<Request | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchThreadDetails = async (isInitialLoad = false) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      if (isInitialLoad) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You are not logged in.",
        });
        router.push("/");
      }
      return;
    }

    try {
      const localUserId =
        currentUserId ||
        JSON.parse(localStorage.getItem("currentUser") || "{}").id;

      const threadResponse = await fetch(
        `http://127.0.0.1:8000/api/threads/${id}/full-detail/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!threadResponse.ok) {
        if (isInitialLoad) {
          if (threadResponse.status === 401) {
            toast({
              variant: "destructive",
              title: "Authentication Expired",
              description: "Please log in again.",
            });
            router.push("/");
          } else {
            throw new Error("Failed to fetch thread details");
          }
        }
        return;
      }

      const threadData = await threadResponse.json();
      if (threadData.success) {
        setUsers((currentUsers) => {
          const { request: transformedRequest, users: updatedUsers } =
            transformApiToRequest(threadData, id, localUserId, currentUsers);

          setRequest((prevRequest) => {
            if (
              JSON.stringify(prevRequest?.apiData) !==
              JSON.stringify(transformedRequest?.apiData)
            ) {
              return transformedRequest;
            }
            return prevRequest;
          });

          return updatedUsers;
        });
      } else {
        if (isInitialLoad) {
          throw new Error(threadData.message || "Could not load thread data.");
        }
      }
    } catch (error: any) {
      if (isInitialLoad) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        router.push("/dashboard");
      }
    } finally {
      if (isInitialLoad) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "You are not logged in.",
        });
        router.push("/");
        return;
      }

      setIsLoading(true);
      try {
        const userResponse = await fetch(`http://127.0.0.1:8000/api/auth/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user details");
        const userData = await userResponse.json();

        console.log("DEBUG userData.user:", userData.user);
        console.log("DEBUG role_display from API:", userData.user.role_display);

        const userRole = userData.user.role_display; // "HOD" for you
        const apiUserId = userData.user.id;
        localStorage.setItem("currentUser", JSON.stringify({ id: apiUserId }));

        const currentUserFromApi: User = {
          id: "user-current",
          name: userData.user.full_name,
          avatar: "",
          role: userRole,
        };
        console.log("DEBUG currentUserFromApi:", currentUserFromApi);

        setCurrentUser(currentUserFromApi);
        setCurrentUserId(apiUserId);

        const threadResponse = await fetch(
          `http://127.0.0.1:8000/api/threads/${id}/full-detail/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!threadResponse.ok)
          throw new Error("Failed to fetch initial thread details");
        const threadData = await threadResponse.json();

        if (threadData.success) {
          setUsers(() => {
            const { request: transformedRequest, users: updatedUsers } =
              transformApiToRequest(
                threadData,
                id,
                apiUserId,
                [currentUserFromApi]
              );
            setRequest(transformedRequest);
            return updatedUsers;
          });
        } else {
          throw new Error(threadData.message || "Could not load thread data.");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchInitialData();

      pollingIntervalRef.current = setInterval(() => {
        fetchThreadDetails(false);
      }, 5000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      localStorage.removeItem("currentUser");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return (
      <div className="text-center p-8">
        Request not found or user not available.
      </div>
    );
  }

  return (
    <div className="h-full -m-4 md:-m-6">
      <ChatLayout
        request={request}
        users={users}
        currentUser={currentUser}
        currentUserId={currentUserId}
      />
    </div>
  );
}
