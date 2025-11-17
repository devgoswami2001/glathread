import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { requests, users } from "@/lib/data";

export default function DashboardPage() {
  return <ChatLayout requests={requests} users={users} />;
}
