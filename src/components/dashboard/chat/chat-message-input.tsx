
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, FileText, Mic, Send, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export function ChatMessageInput() {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} is ready to be sent.`,
      });
      // Here you would typically handle the file upload process
      // For now, we just show a toast notification.
    }
  };

  const handleAttachmentClick = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const handleVoiceClick = () => {
    toast({
        title: "Voice Recording",
        description: "Voice recording functionality is not yet implemented.",
    });
  };

  return (
    <div className="border-t bg-card p-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
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
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 flex-col gap-1"
                onClick={() => handleAttachmentClick("image/*,video/*")}
              >
                <Image className="h-5 w-5" />
                <span className="text-xs">Photo</span>
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 flex-col gap-1"
                onClick={() => handleAttachmentClick(".pdf,.doc,.docx,.xls,.xlsx")}
              >
                <FileText className="h-5 w-5" />
                <span className="text-xs">Doc</span>
              </Button>
               <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 flex-col gap-1"
                onClick={handleVoiceClick}
               >
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
          <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="ghost" onClick={handleVoiceClick}>
            <Mic className="h-5 w-5" />
            <span className="sr-only">Record voice message</span>
          </Button>
        )}
      </div>
    </div>
  );
}
