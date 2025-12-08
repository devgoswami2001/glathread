
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, FileText, Mic, Send, Plus, StopCircle, Trash2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Message, MessageType, Request } from "@/lib/types";

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


type FilePreview = {
  url: string;
  name: string;
  type: 'image' | 'video' | 'doc' | 'voice';
  file: File;
};

interface ChatMessageInputProps {
  request: Request;
  addMessage: (message: Message) => void;
}


export function ChatMessageInput({ request, addMessage }: ChatMessageInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'doc';
      setFilePreview({ url, name: file.name, type: fileType, file });
    }
  };


  const handleAttachmentClick = (accept: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      fileInputRef.current.click();
    }
  };

  const startRecording = async () => {
    setFilePreview(null); // Clear any file preview if starting to record

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
        setFilePreview({
          url: audioUrl,
          name: `voice-message-${Date.now()}.webm`,
          type: 'voice',
          file: new File([audioBlob], `voice-message-${Date.now()}.webm`, { type: 'audio/webm' }),
        });
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
      toast({ title: "Recording stopped. Preview ready." });
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
    if (!request) return;

    const messageId = `msg-${request.id}-${Date.now()}`;

    // Handle file message
    if (filePreview) {
        const dataUrl = await blobToBase64(filePreview.file);
        const newMessage: Message = {
            id: messageId,
            requestId: request.id,
            senderId: 'user-current',
            content: message, // Caption for the file
            timestamp: new Date().toISOString(),
            type: MessageType.FILE,
            seen: false,
            file: {
                name: filePreview.name,
                url: dataUrl,
                type: filePreview.type === 'doc' ? 'file' : filePreview.type, // Map internal type to Message['file']['type']
                size: `${(filePreview.file.size / 1024).toFixed(2)} KB`
            }
        };
        addMessage(newMessage);
        setFilePreview(null);
        setMessage('');
        toast({ title: "Message sent!" });
    } else if (message.trim()) { // Handle text message
         const newMessage: Message = {
            id: messageId,
            requestId: request.id,
            senderId: 'user-current',
            content: message,
            timestamp: new Date().toISOString(),
            type: MessageType.TEXT,
            seen: false,
        };
        addMessage(newMessage);
        setMessage('');
    }
  };

  const cancelPreview = () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview.url);
      }
      setFilePreview(null);
  }
  
  useEffect(() => {
    const currentPreviewUrl = filePreview?.url;
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if(currentPreviewUrl){
        URL.revokeObjectURL(currentPreviewUrl);
      }
    };
  }, [filePreview]);

  return (
    <div className="bg-background/95 backdrop-blur-sm p-2 md:p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
       <AnimatePresence>
       {filePreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 relative bg-secondary/50 rounded-t-xl border-b">
                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/50 z-10" onClick={cancelPreview}>
                    <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center max-h-48">
                {filePreview.type === 'image' && <img src={filePreview.url} alt="preview" className="max-h-48 object-contain rounded-lg"/>}
                {filePreview.type === 'video' && <video src={filePreview.url} controls className="max-h-48 object-contain rounded-lg"/>}
                {filePreview.type === 'voice' && <audio src={filePreview.url} controls className="w-full"/>}
                {filePreview.type === 'doc' && (
                  <div className="flex flex-col items-center gap-2 text-center p-4 bg-background rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <p className="font-medium text-sm truncate max-w-xs">{filePreview.name}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />
      <div className="relative flex items-center gap-2 max-w-2xl mx-auto">
        {!filePreview && (
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
        )}

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
            ) : (
                <Input
                    placeholder={filePreview ? "Add a caption..." : "Type a message..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (handleSendMessage(), e.preventDefault())}
                    className="flex-1 rounded-full bg-secondary px-4 py-2 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
                />
            )}
            </div>
        </AnimatePresence>

        {(message || filePreview) && !isRecording ? (
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

    
