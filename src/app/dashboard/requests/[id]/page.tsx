import { ChatLayout } from "@/components/dashboard/chat/chat-layout";
import { requests, users } from "@/lib/data";
import { notFound } from "next/navigation";

export default function RequestPage({ params }: { params: { id: string } }) {
  const requestIdWithPrefix = `TR-${params.id.padStart(3, '0')}`;
  const request = requests.find(r => r.id === requestIdWithPrefix);
  const currentUser = users.find(u => u.id === 'user-current');

  if (!request || !currentUser) {
    notFound();
  }

  return <ChatLayout request={request} users={users} currentUser={currentUser} />;
}
