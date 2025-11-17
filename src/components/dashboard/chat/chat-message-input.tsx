import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";

export function ChatMessageInput() {
  return (
    <div className="border-t p-4">
      <div className="relative">
        <Input
          placeholder="Type your message..."
          className="pr-24"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button size="sm" className="h-8">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
        </div>
      </div>
    </div>
  );
}
