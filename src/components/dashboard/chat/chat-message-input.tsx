
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, FileText, Mic, Send, Plus, StopCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function ChatMessageInput() {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} is ready to be sent.`,
      });
      // Here you would typically handle the file upload process
    }
  };

  const handleAttachmentClick = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        // Here you would typically send the audio file as a message
        // For now, we'll just log it and show a toast.
        console.log("Recorded Audio URL:", audioUrl);
        toast({
          title: "Recording Complete",
          description: "Your voice message is ready to be sent.",
        });
        
        // Clean up the stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "Recording started..." });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Access Denied",
        description: "Please enable microphone permissions in your browser settings.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
          placeholder={isRecording ? "Recording in progress..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isRecording}
          className="flex-1 rounded-full bg-secondary px-4 py-2 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
        />

        {message && !isRecording ? (
          <Button size="icon" className="h-9 w-9 flex-shrink-0 rounded-full bg-primary text-primary-foreground">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        ) : (
          <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="ghost" onClick={handleVoiceClick}>
            {isRecording ? <StopCircle className="h-5 w-5 text-destructive animate-pulse" /> : <Mic className="h-5 w-5" />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Record voice message"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
