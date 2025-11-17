import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { requests, users } from "@/lib/data";

export default function RequestPage({ params }: { params: { id: string } }) {
  const requestIdWithPrefix = `TR-${params.id.padStart(3, '0')}`;
  return <ChatLayout requests={requests} users={users} defaultSelectedRequestId={requestIdWithPrefix} />;
}
