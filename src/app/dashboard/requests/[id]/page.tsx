import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { requests, users } from "@/lib/data";

export default function RequestPage({ params }: { params: { id: string } }) {
  return <ChatLayout requests={requests} users={users} defaultSelectedRequestId={params.id} />;
}
