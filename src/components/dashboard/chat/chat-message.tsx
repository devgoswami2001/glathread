import type { Message, Request, User } from "@/lib/types";
import { MessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, ThumbsDown, ThumbsUp, FileText, Download, QrCode, Image as ImageIcon, Play, File as FileIcon, Paperclip, Truck, Car, Bike, Bus, StopCircle } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";
import Image from "next/image";
import { requests } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { useRef, useState, useEffect } from "react";


interface ChatMessageProps {
  message: Message;
  sender: User;
  isCurrentUser: boolean;
}

function FileMessageContent({ file, isCurrentUser }: { file: NonNullable<Message['file']>, isCurrentUser: boolean }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setProgress((audio.currentTime / audio.duration) * 100);
        };
         const onEnded = () => {
            setIsPlaying(false);
            setProgress(0);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('play', () => setIsPlaying(true));
        audio.addEventListener('pause', () => setIsPlaying(false));
        audio.addEventListener('ended', onEnded);
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('play', () => setIsPlaying(true));
            audio.removeEventListener('pause', () => setIsPlaying(false));
            audio.removeEventListener('ended', onEnded);
        };
    }, []);


    const renderContent = () => {
        switch (file.type) {
            case 'image':
                return (
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="block relative aspect-square w-full max-w-xs overflow-hidden rounded-lg">
                        <Image src={file.url} alt={file.name} layout="fill" className="object-cover" />
                    </a>
                );
            case 'video':
                return (
                     <div className="relative flex aspect-video w-full max-w-sm items-center justify-center overflow-hidden rounded-lg bg-black">
                        <video src={file.url} className="h-full w-full object-cover" controls />
                    </div>
                );
            case 'voice':
                return (
                     <div className={cn(
                        "flex items-center gap-2 p-2 rounded-lg w-64",
                        isCurrentUser ? "bg-primary/80" : "bg-background/50"
                    )}>
                        <audio 
                            ref={audioRef} 
                            src={file.url}
                            preload="metadata"
                        />
                        <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 flex-shrink-0 bg-background/30 hover:bg-background/50 text-foreground" onClick={handlePlayPause}>
                            <Play className={cn("size-5 fill-current", isPlaying && "hidden")} />
                            <StopCircle className={cn("size-5 fill-current", !isPlaying && "hidden")} />
                        </Button>
                        <div className="flex-1 space-y-1">
                             <div className="h-1.5 w-full rounded-full bg-muted-foreground/30 relative overflow-hidden">
                                <div className="h-full bg-foreground/80 absolute" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs text-foreground/80">{file.size}</span>
                        </div>
                    </div>
                );
            default:
                const getFileIcon = () => {
                    if (file.name.endsWith('.pdf')) return <FileText className="h-8 w-8 text-red-500" />;
                    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) return <FileText className="h-8 w-8 text-blue-500" />;
                    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) return <FileText className="h-8 w-8 text-green-500" />;
                    return <FileIcon className="h-8 w-8 text-muted-foreground" />;
                }
                return (
                     <div className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 w-80 max-w-full",
                         isCurrentUser ? "bg-primary/80 border-primary-foreground/20" : "bg-card border-border"
                    )}>
                        <div className="flex-shrink-0">{getFileIcon()}</div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-foreground/80">{file.size || 'N/A'}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="flex-shrink-0 h-9 w-9" asChild>
                            <a href={file.url} download>
                                <Download className="size-5" />
                            </a>
                        </Button>
                    </div>
                );
        }
    }
    
    return (
        <div className={cn(
            "p-1.5 rounded-lg",
            isCurrentUser ? 'bg-primary' : 'bg-card'
        )}>
            {renderContent()}
        </div>
    )
}

function RequestDetailsMessage({ request }: { request: Request }) {
    const getVehicleIcon = (vehicleType: string) => {
        switch(vehicleType) {
            case 'Car': return <Car className="h-6 w-6 text-primary" />;
            case 'Truck': return <Truck className="h-6 w-6 text-primary" />;
            case 'Bike': return <Bike className="h-6 w-6 text-primary" />;
            case 'Bus': return <Bus className="h-6 w-6 text-primary" />;
            default: return <Car className="h-6 w-6 text-primary" />;
        }
    }

    return (
        <Card className="bg-secondary/50 border-dashed">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        {getVehicleIcon(request.vehicleType)}
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold leading-tight">{request.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">{request.vehicleDetails}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <Separator/>
                <div className="space-y-1">
                    <p className="font-medium text-sm">Description</p>
                    <p className="text-muted-foreground text-sm">{request.messages.find(m => m.type === MessageType.TEXT)?.content || "No description provided."}</p>
                </div>
                {request.documents.length > 0 && (
                    <div>
                        <p className="font-medium text-sm mb-2">Documents</p>
                        <div className="space-y-2">
                            {request.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between rounded-md border bg-background/50 p-2 text-sm">
                                    <div className="flex items-center gap-2 truncate">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                        <span className="truncate">{doc.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                        <a href={doc.url} download>
                                            <Download className="h-4 w-4"/>
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export function ChatMessage({ message, sender, isCurrentUser }: ChatMessageProps) {
  const request = requests.find(r => r.id === message.requestId);

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
        case MessageType.FILE:
            if (!message.file) return null;
             return <FileMessageContent file={message.file} isCurrentUser={isCurrentUser} />;
        case MessageType.REQUEST_DETAILS:
             return request ? <RequestDetailsMessage request={request} /> : null;
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
  
  if ([MessageType.SYSTEM, MessageType.APPROVAL, MessageType.DATE_PROMPT, MessageType.OUTPASS_GENERATION, MessageType.PAYMENT_TRACKING, MessageType.REQUEST_DETAILS].includes(message.type)) {
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

    