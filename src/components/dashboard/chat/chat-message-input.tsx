
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, FileText, Mic, Send, Plus, StopCircle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Message, MessageType, Request } from "@/lib/types";
import { requests } from "@/lib/data";

function WaveformAnimation() {
    return (
        <div className="flex w-full items-center justify-center gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-primary/80"
                    animate={{ height: [2, 16, 5, 12, 4, 18, 2].map(h => h + Math.random() * 8) }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                        delay: i * 0.05,
                    }}
                />
            ))}
        </div>
    )
}

export function ChatMessageInput() {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

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
    setAudioPreviewUrl(null);
    setAudioBlob(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
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
        setAudioBlob(audioBlob);
        setAudioPreviewUrl(audioUrl);
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

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSendMessage = async () => {
     // This is a placeholder for sending a message.
     // In a real app, you would get the current request from context or props.
    const currentRequest: Request | undefined = requests[0];
    if (!currentRequest) return;

    if (audioPreviewUrl && audioBlob) {
        const audioDataUrl = await blobToBase64(audioBlob);
        const newMessage: Message = {
            id: `msg-${currentRequest.id}-${currentRequest.messages.length + 1}`,
            requestId: currentRequest.id,
            senderId: 'user-current',
            content: '',
            timestamp: new Date().toISOString(),
            type: MessageType.FILE,
            seen: false,
            file: {
                name: `voice-message-${Date.now()}.webm`,
                url: audioDataUrl,
                type: 'voice',
                size: `${(audioBlob.size / 1024).toFixed(2)} KB`
            }
        };
        currentRequest.messages.push(newMessage);
        setAudioPreviewUrl(null);
        setAudioBlob(null);
        toast({ title: "Voice message sent!" });
    } else if (message.trim()) {
         const newMessage: Message = {
            id: `msg-${currentRequest.id}-${currentRequest.messages.length + 1}`,
            requestId: currentRequest.id,
            senderId: 'user-current',
            content: message,
            timestamp: new Date().toISOString(),
            type: MessageType.TEXT,
            seen: false,
        };
        currentRequest.messages.push(newMessage);
        setMessage('');
    }
  };

  const cancelRecording = () => {
      setAudioPreviewUrl(null);
      setAudioBlob(null);
  }
  
  useEffect(() => {
    const currentAudioUrl = audioPreviewUrl;
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if(currentAudioUrl){
        URL.revokeObjectURL(currentAudioUrl);
      }
    };
  }, [audioPreviewUrl]);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-2 md:p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="relative flex items-center gap-2 max-w-2xl mx-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 text-muted-foreground hover:text-primary">
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
            </div>
          </PopoverContent>
        </Popover>

        <AnimatePresence>
            <div className="flex-1 h-10 flex items-center">
            {isRecording ? (
                <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="w-full"
                >
                    <WaveformAnimation />
                </motion.div>
            ) : audioPreviewUrl ? (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex w-full items-center gap-2 bg-secondary rounded-full px-3"
                >
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={cancelRecording}>
                        <Trash2 className="text-destructive h-5 w-5"/>
                    </Button>
                    <audio src={audioPreviewUrl} controls className="w-full h-8"/>
                 </motion.div>
            ) : (
                <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 rounded-full bg-secondary px-4 py-2 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
                />
            )}
            </div>
        </AnimatePresence>

        {(message || audioPreviewUrl) && !isRecording ? (
          <Button size="icon" className="h-9 w-9 flex-shrink-0 rounded-full bg-primary text-primary-foreground" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        ) : (
          <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="ghost" onClick={handleVoiceClick}>
            {isRecording ? <StopCircle className="h-5 w-5 text-destructive animate-pulse" /> : <Mic className="h-5 w-5 text-muted-foreground hover:text-primary" />}
            <span className="sr-only">{isRecording ? "Stop recording" : "Record voice message"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
