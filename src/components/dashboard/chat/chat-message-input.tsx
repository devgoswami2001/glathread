
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, FileText, Mic, Send, Plus, Paperclip } from "lucide-react";
import { useState } from "react";

export function ChatMessageInput() {
  const [message, setMessage] = useState('');

  return (
    <div className="border-t bg-card p-4">
      <div className="relative flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-12 w-12 flex-col gap-1">
                <Image className="h-5 w-5" />
                <span className="text-xs">Photo</span>
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 flex-col gap-1">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Doc</span>
              </Button>
               <Button variant="outline" size="icon" className="h-12 w-12 flex-col gap-1">
                <Mic className="h-5 w-5" />
                <span className="text-xs">Voice</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 rounded-full bg-secondary px-4 py-2 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
        />

        {message ? (
          <Button size="icon" className="h-9 w-9 flex-shrink-0 rounded-full bg-primary text-primary-foreground">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        ) : (
          <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="ghost">
            <Mic className="h-5 w-5" />
            <span className="sr-only">Record voice message</span>
          </Button>
        )}
      </div>
    </div>
  );
}
