
'use client';

import type { Message, Request, User } from "@/lib/types";
import { ChatTopbar } from "./chat-topbar";
import { ChatMessageList } from "./chat-message-list";
import { ChatMessageInput } from "./chat-message-input";
import { MoveRight, Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatDisplayProps {
  request: Request | null;
  users: User[];
  currentUser: User;
  onBack?: () => void;
  addMessage: (message: Message) => void;
  onApprovalAction: (status: 'approved' | 'rejected') => void;
  onProgressUpdate: (progress: any) => void;
  onGatePassUpdate: (passId: number) => void;
  onMarkCompleted: () => void;
  currentUserId: number | null;
}

export function ChatDisplay({ request, users, currentUser, onBack, addMessage, onApprovalAction, onProgressUpdate, onGatePassUpdate, onMarkCompleted, currentUserId }: ChatDisplayProps) {
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>();
  const [reminderTime, setReminderTime] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!request) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
            <MoveRight className="h-10 w-10"/>
        </div>
        <h3 className="font-headline text-2xl font-semibold">Welcome to GLAThread</h3>
        <p className="text-muted-foreground">Select a request from the sidebar to start the conversation.</p>
      </div>
    );
  }

  const handleSetReminder = async () => {
    if (!request || !reminderDate || !reminderTime || !reminderMessage) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all reminder fields.",
      });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast({ variant: "destructive", title: "Authentication Error" });
        return;
    }

    setIsSubmitting(true);
    try {
        const formattedDate = format(reminderDate, 'yyyy-MM-dd');
        const reminderAt = `${formattedDate}T${reminderTime}:00`;

        const payload = {
            work_thread: request.apiData.id,
            reminder_at: reminderAt,
            message: reminderMessage
        };

        const response = await fetch("http://127.0.0.1:8000/api/reminders/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to set reminder.");
        }

        toast({
            title: "Reminder Set!",
            description: `A reminder has been set for ${format(new Date(reminderAt), 'PPp')}.`
        });
        
        // Reset form and close modal
        setReminderDate(undefined);
        setReminderTime('');
        setReminderMessage('');
        setIsReminderOpen(false);

    } catch (error: any) {
         toast({ variant: "destructive", title: "Failed to set reminder", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  }


  return (
    <div className="flex h-full flex-col relative">
      <ChatTopbar request={request} onBack={onBack} />
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogTrigger asChild>
          <Button size="icon" className="rounded-full h-12 w-12 shadow-lg absolute top-20 right-4 z-10 md:top-4">
              <Bell className="h-6 w-6" />
              <span className="sr-only">Set Reminder</span>
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Set a Reminder for this Thread</DialogTitle>
                <DialogDescription>
                    Schedule a reminder and you will be notified at the specified time.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="reminder-date">Date</Label>
                    <DatePicker id="reminder-date" onDateSelect={setReminderDate} />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="reminder-time">Time</Label>
                    <Input id="reminder-time" type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="reminder-message">Message</Label>
                    <Textarea id="reminder-message" placeholder="e.g., Follow up for final approval" value={reminderMessage} onChange={(e) => setReminderMessage(e.target.value)} />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSetReminder} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Set Reminder
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="relative flex-1 overflow-y-auto">
        <ChatMessageList 
          request={request} 
          users={users} 
          currentUser={currentUser}
          onApprovalAction={onApprovalAction}
        />
      </div>
      <ChatMessageInput 
        request={request} 
        addMessage={addMessage}
        onProgressUpdate={onProgressUpdate} 
        onGatePassUpdate={onGatePassUpdate}
        onMarkCompleted={onMarkCompleted}
        currentUserId={currentUserId}
      />
    </div>
  );
}
