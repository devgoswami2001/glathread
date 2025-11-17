'use client';

import type { Message, Request, User } from "@/lib/types";
import { MessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, ThumbsDown, ThumbsUp, FileText, Download, QrCode, Image as ImageIcon, Play, File as FileIcon, Paperclip, Truck, Car, Bike, Bus, StopCircle, FileType2, Sheet } from "lucide-react";
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import Link from "next/link";
import Image from "next/image";
import { requests } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/lib/types";


interface ChatMessageProps {
  message: Message;
  sender: User;
  isCurrentUser: boolean;
}

function getStatusClass(status: RequestStatus) {
    switch (status) {
        case RequestStatus.PENDING: return "bg-amber-100 text-amber-700 border-amber-200";
        case RequestStatus.APPROVED: return "bg-blue-100 text-blue-700 border-blue-200";
        case RequestStatus.WORKING: return "bg-teal-100 text-teal-700 border-teal-200";
        case RequestStatus.WORK_COMPLETED: return "bg-sky-100 text-sky-700 border-sky-200";
        case RequestStatus.PAYMENT_PENDING: return "bg-orange-100 text-orange-700 border-orange-200";
        case RequestStatus.PAYMENT_DONE: return "bg-green-100 text-green-700 border-green-200";
        case RequestStatus.REJECTED: return "bg-red-100 text-red-700 border-red-200";
        case RequestStatus.OVERDUE: return "bg-rose-100 text-rose-700 border-rose-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
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
                    if (file.name.endsWith('.pdf')) return <FileText className="h-6 w-6 text-red-600" />;
                    if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) return <FileText className="h-6 w-6 text-blue-600" />;
                    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) return <FileText className="h-6 w-6 text-green-600" />;
                    return <FileIcon className="h-6 w-6 text-muted-foreground" />;
                }
                return (
                     <div className={cn(
                        "flex items-center gap-3 rounded-lg border bg-secondary/30 p-3 w-80 max-w-full hover:bg-secondary/60 transition-colors group",
                         isCurrentUser ? "bg-primary/10 border-primary/20" : "bg-card border-border"
                    )}>
                        <div className="flex-shrink-0">{getFileIcon()}</div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size || 'N/A'}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="flex-shrink-0 h-9 w-9 opacity-50 group-hover:opacity-100" asChild>
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
            ['image', 'video'].includes(file.type) && (isCurrentUser ? 'bg-primary' : 'bg-card shadow-sm')
        )}>
            {renderContent()}
        </div>
    )
}

function RequestDetailsMessage({ request }: { request: Request }) {
    const getVehicleIcon = (vehicleType: string) => {
        switch(vehicleType) {
            case 'Car': return <Car className="h-5 w-5 text-primary" />;
            case 'Truck': return <Truck className="h-5 w-5 text-primary" />;
            case 'Bike': return <Bike className="h-5 w-5 text-primary" />;
            case 'Bus': return <Bus className="h-5 w-5 text-primary" />;
            default: return <Car className="h-5 w-5 text-primary" />;
        }
    }

    const getFileIcon = (fileName: string) => {
        if (fileName.endsWith('.pdf')) return <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />;
        if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />;
        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return <Sheet className="h-5 w-5 text-green-500 flex-shrink-0" />;
        return <FileType2 className="h-5 w-5 text-muted-foreground flex-shrink-0" />;
    }

    return (
        <div className="w-full max-w-2xl mx-auto my-4">
            <div className="bg-card rounded-xl border border-gray-200/80 shadow-sm">
                <div className="p-4 md:p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold tracking-tight">{request.title}</h2>
                            <p className="text-sm text-gray-500">{request.vehicleDetails}</p>
                        </div>
                         <Badge className={`px-3 py-1 text-xs rounded-full font-medium border ${getStatusClass(request.status)}`}>
                            {request.status.toUpperCase()}
                        </Badge>
                    </div>

                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                        <div>
                             <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
                             <p className="text-sm leading-relaxed text-gray-800">{request.messages.find(m => m.type === MessageType.TEXT)?.content || "No description provided."}</p>
                        </div>
                        {request.documents.length > 0 && (
                             <div>
                                <h3 className="text-sm font-medium text-gray-600 mb-2">Documents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {request.documents.map((doc, index) => (
                                        <a href={doc.url} key={index} download className="group">
                                            <div className="flex items-center gap-3 rounded-lg border bg-gray-50/80 p-2.5 hover:bg-gray-100 hover:shadow-sm transition-all duration-200">
                                                {getFileIcon(doc.name)}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{doc.name}</p>
                                                </div>
                                                <Download className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export function ChatMessage({ message, sender, isCurrentUser }: ChatMessageProps) {
  const request = requests.find(r => r.id === message.requestId);

  const renderMessageContent = () => {
    switch (message.type) {
      case MessageType.APPROVAL:
        return (
          <Card className="bg-secondary/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Approval Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{message.content}</p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white"><ThumbsUp className="mr-2 h-4 w-4" /> Approve</Button>
                <Button size="sm" variant="destructive"><ThumbsDown className="mr-2 h-4 w-4" /> Reject</Button>
              </div>
            </CardContent>
          </Card>
        );
      case MessageType.DATE_PROMPT:
         return (
          <Card className="bg-secondary/50">
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
             <Card className="bg-secondary/50">
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
             <Card className="bg-secondary/50">
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
                "rounded-lg px-3 py-2 shadow-sm",
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

    
