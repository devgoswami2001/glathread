import type { Message, User } from "@/lib/types";
import { MessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, ThumbsDown, ThumbsUp, FileText, Download, QrCode } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";

interface ChatMessageProps {
  message: Message;
  sender: User;
  isCurrentUser: boolean;
}

export function ChatMessage({ message, sender, isCurrentUser }: ChatMessageProps) {
  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.APPROVAL:
        return (
          <Card className="bg-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Approval Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{message.content}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><ThumbsUp className="mr-2 h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="destructive"><ThumbsDown className="mr-2 h-4 w-4" /> Reject</Button>
              </div>
            </CardContent>
          </Card>
        );
      case MessageType.DATE_PROMPT:
         return (
          <Card className="bg-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Set Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{message.content}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <DatePicker id="start-date" />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <DatePicker id="end-date" />
                </div>
              </div>
              <Button size="sm">Confirm Dates</Button>
            </CardContent>
          </Card>
        );
      case MessageType.OUTPASS_GENERATION:
        return (
             <Card className="bg-secondary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Out-Pass Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{message.content}</p>
                  <Button size="sm" asChild>
                    <Link href={`/out-pass/${message.requestId}`} target="_blank">
                        <QrCode className="mr-2 h-4 w-4" /> Generate Out-Pass
                    </Link>
                  </Button>
                </CardContent>
            </Card>
        )
       case MessageType.PAYMENT_TRACKING:
         return (
             <Card className="bg-secondary">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">Action Required: Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{message.content}</p>
                  <Button size="sm" variant="outline">
                    <FileText className="mr-2 h-4 w-4" /> Upload GLAMS PDF
                  </Button>
                </CardContent>
            </Card>
         )
      case MessageType.TEXT:
        return (
            <div
                className={cn(
                "rounded-lg px-3 py-2",
                isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                )}
            >
                <p className="text-sm">{message.content}</p>
            </div>
        )
      default: // SYSTEM
        return <p className="text-xs text-center text-muted-foreground italic px-4">{message.content}</p>;
    }
  };
  
  if (message.type === MessageType.SYSTEM || message.type.includes('prompt') || message.type.includes('approval') || message.type.includes('pass') || message.type.includes('payment')) {
    return <div className="my-2">{renderMessageContent()}</div>;
  }

  return (
    <div className={cn("flex items-end gap-2", isCurrentUser && "justify-end")}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={sender.avatar} alt={sender.name} />
          <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className={cn("flex max-w-[75%] flex-col gap-1", isCurrentUser && "items-end")}>
        <div className="flex items-center gap-2">
           {!isCurrentUser && <span className="text-xs font-semibold">{sender.name}</span>}
            <span className="text-xs text-muted-foreground">
                {format(new Date(message.timestamp), 'p')}
            </span>
        </div>
        {renderMessageContent()}
      </div>
       {isCurrentUser && (
          <Check className={cn("h-4 w-4", message.seen ? "text-accent" : "text-muted-foreground")} />
       )}
    </div>
  );
}
