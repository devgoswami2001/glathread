'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, FileText, Mic, Send, Plus, StopCircle, Trash2, X, CalendarClock, Loader2, AlertTriangle, QrCode, LogIn, CheckCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Message, MessageType, Request, RequestStatus, GatePass } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { format, isPast } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
    onProgressUpdate: (progress: any) => void;
    onGatePassUpdate: (passId: number) => void;
    onMarkCompleted: () => void;
    currentUserId: number | null;
}

export function ChatMessageInput({ request, addMessage, onProgressUpdate, currentUserId, onGatePassUpdate, onMarkCompleted }: ChatMessageInputProps) {
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
    const [isSending, setIsSending] = useState(false);

    const [showTimeLimitForm, setShowTimeLimitForm] = useState(false);
    const [showDelayForm, setShowDelayForm] = useState(false);
    const [showGatePassPrompt, setShowGatePassPrompt] = useState(false);
    const [showGatePassForm, setShowGatePassForm] = useState(false);

    const [expectedEndDate, setExpectedEndDate] = useState<Date | undefined>();
    const [delayReason, setDelayReason] = useState('');
    
    const [gatePassPurpose, setGatePassPurpose] = useState('');
    const [gatePassValidFrom, setGatePassValidFrom] = useState<Date|undefined>();
    const [gatePassValidTo, setGatePassValidTo] = useState<Date|undefined>();
    const [isSubmittingGatePass, setIsSubmittingGatePass] = useState(false);

    const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);
    const [hasInitialProgress, setHasInitialProgress] = useState(false);
    const [isOverdue, setIsOverdue] = useState(false);
    const [activeOutPass, setActiveOutPass] = useState<GatePass | null>(null);
    const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);

    const isInputDisabled = [
        RequestStatus.WORK_COMPLETED.toLowerCase(),
        RequestStatus.PAYMENT_PENDING.toLowerCase(),
        RequestStatus.PAYMENT_DONE.toLowerCase(),
        RequestStatus.REJECTED.toLowerCase(),
        'completed'
    ].includes(request.status.toLowerCase());

    useEffect(() => {
        const checkProgressStatus = () => {
            if (!request || !request.apiData || request.apiData.approval_status !== 'approved') {
                setHasInitialProgress(true); 
                setIsOverdue(false);
                setShowGatePassPrompt(false);
                setActiveOutPass(null);
                return;
            }

            const progressUpdates = request.apiData.progress_updates || [];
            const initialExists = progressUpdates.some((p: any) => p.progress_type === 'initial');
            setHasInitialProgress(initialExists);

            const gatePasses = request.apiData.gate_passes || [];
            const latestOutPass = gatePasses
                .filter((p: GatePass) => p.pass_mode === 'out')
                .sort((a: GatePass, b: GatePass) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

            if (latestOutPass && !latestOutPass.in_time) {
                setActiveOutPass(latestOutPass);
                setShowGatePassPrompt(false);
            } else {
                setActiveOutPass(null);
                setShowGatePassPrompt(initialExists);
            }

            if (progressUpdates.length > 0) {
                const lastUpdate = progressUpdates[progressUpdates.length - 1];
                const isTaskOverdue = isPast(new Date(lastUpdate.expected_end_date)) && request.status !== RequestStatus.WORK_COMPLETED && request.status !== RequestStatus.PAYMENT_PENDING;
                setIsOverdue(isTaskOverdue);
            } else {
                setIsOverdue(false);
            }
        };
        checkProgressStatus();
    }, [request]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'doc';
            setFilePreview({ url, name: file.name, type: fileType as any, file });
        }
    };

    const handleAttachmentClick = (accept: string) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = accept;
            fileInputRef.current.click();
        }
    };

    const startRecording = async () => {
        setFilePreview(null);

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

    const handleSendMessage = async () => {
        if (!request || (!message.trim() && !filePreview)) return;

        setIsSending(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ variant: "destructive", title: "Authentication Error" });
            setIsSending(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('thread', String(request.apiData.id));

            let messageTypeApi: 'text' | 'image' | 'video' | 'audio' | 'document';

            if (filePreview) {
                switch (filePreview.type) {
                    case 'image': messageTypeApi = 'image'; break;
                    case 'video': messageTypeApi = 'video'; break;
                    case 'voice': messageTypeApi = 'audio'; break;
                    case 'doc': messageTypeApi = 'document'; break;
                    default: messageTypeApi = 'document';
                }
                formData.append('message_type', messageTypeApi);
                formData.append('media_file', filePreview.file, filePreview.name);
                if (message.trim()) {
                    formData.append('text_message', message);
                }
            } else {
                messageTypeApi = 'text';
                formData.append('message_type', messageTypeApi);
                formData.append('text_message', message);
            }

            const response = await fetch("http://127.0.0.1:8000/api/threads/send-message/", {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Failed to send message');
            }

            const sentMessage = result.data;

            const getFileType = (apiType: string) => {
                switch (apiType) {
                    case 'image': return 'image';
                    case 'video': return 'video';
                    case 'audio': return 'voice';
                    default: return 'file';
                }
            };

            addMessage({
                id: `msg-${sentMessage.id}`,
                requestId: request.id,
                senderId: 'user-current',
                content: sentMessage.text_message || '',
                timestamp: new Date(sentMessage.created_at).toISOString(),
                type: sentMessage.media_file ? MessageType.FILE : MessageType.TEXT,
                seen: false,
                file: sentMessage.media_file ? {
                    name: sentMessage.media_file.split('/').pop() || '',
                    url: `http://127.0.0.1:8000${sentMessage.media_file}`,
                    type: getFileType(sentMessage.message_type),
                    size: '0 KB' 
                } : undefined
            });

            setMessage('');
            if (filePreview) {
                URL.revokeObjectURL(filePreview.url);
            }
            setFilePreview(null);
            toast({ title: "Message sent!" });
        } catch (error: any) {
            toast({ variant: "destructive", title: "Failed to send", description: error.message });
        } finally {
            setIsSending(false);
        }
    };

    const cancelPreview = () => {
        if (filePreview) {
            URL.revokeObjectURL(filePreview.url);
        }
        setFilePreview(null);
    }

    const handleSubmitProgress = async (progressType: 'initial' | 'delay') => {
        if (!request || !expectedEndDate) {
            toast({ variant: "destructive", title: "Missing Date", description: "Please select an expected end date." });
            return;
        }
        if (progressType === 'delay' && !delayReason) {
            toast({ variant: "destructive", title: "Missing Reason", description: "Please provide a reason for the delay." });
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ variant: "destructive", title: "Authentication Error" });
            return;
        }
        
        setIsSubmittingProgress(true);
        try {
            const payload: any = {
                thread: request.apiData.id,
                progress_type: progressType,
                expected_end_date: format(expectedEndDate, 'yyyy-MM-dd')
            };

            if (progressType === 'delay') {
                payload.delay_reason = delayReason;
            }

            const response = await fetch("http://127.0.0.1:8000/api/work-progress/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to set ${progressType} time limit.`);
            }

            const newProgress = await response.json();
            onProgressUpdate(newProgress);
            
            if (progressType === 'initial') {
                setShowTimeLimitForm(false);
                setHasInitialProgress(true);
                setShowGatePassPrompt(true);
                toast({ title: "Time Limit Set!", description: `Expected completion date is ${format(expectedEndDate, 'PPP')}.`});
            } else {
                setShowDelayForm(false);
                setIsOverdue(false);
                setDelayReason('');
                toast({ title: "Delay Reported!", description: `New expected completion date is ${format(expectedEndDate, 'PPP')}.`});
            }
            setExpectedEndDate(undefined);

        } catch (error: any) {
            toast({ variant: "destructive", title: "Submission Failed", description: error.message });
        } finally {
            setIsSubmittingProgress(false);
        }
    };

    const handleCreateGatePass = async () => {
        if (!request || !gatePassPurpose || !gatePassValidFrom || !gatePassValidTo) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all fields for the gate pass." });
            return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ variant: "destructive", title: "Authentication Error" });
            return;
        }

        setIsSubmittingGatePass(true);
        try {
            const payload = {
                thread: request.apiData.id,
                issued_to: request.apiData.created_by, // Assuming it's issued to the creator
                vehicle_number: request.apiData.vehicle_number,
                purpose: gatePassPurpose,
                valid_from: gatePassValidFrom.toISOString(),
                valid_to: gatePassValidTo.toISOString(),
            };

            const response = await fetch("http://127.0.0.1:8000/api/gate-passes/", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            
            if (!result.success) {
                 throw new Error(result.message || 'Failed to create gate pass.');
            }
            
            addMessage({
                id: `gatepass-details-${result.data.id}`,
                requestId: request.id,
                senderId: 'system',
                content: `Gate Pass #${result.data.id} has been created.`,
                timestamp: new Date().toISOString(),
                type: MessageType.GATE_PASS_DETAILS,
                seen: true,
                gatePass: result.data,
            });

            toast({ title: "Gate Pass Created!", description: "The gate pass has been successfully created."});
            setShowGatePassForm(false);
            setShowGatePassPrompt(false); 
            setActiveOutPass(result.data);
            
        } catch(error: any) {
             toast({ variant: "destructive", title: "Gate Pass Creation Failed", description: error.message });
        } finally {
            setIsSubmittingGatePass(false);
        }
    };
    
    const handleMarkIn = async () => {
        if (!activeOutPass) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ variant: "destructive", title: "Authentication Error" });
            return;
        }

        setIsSubmittingGatePass(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/gate-passes/${activeOutPass.id}/mark-in/`, {
                method: "PATCH",
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message || 'Failed to mark vehicle as IN.');
            }

            onGatePassUpdate(activeOutPass.id);
            toast({ title: "Vehicle Marked IN", description: "The vehicle has been successfully marked as returned." });
            setActiveOutPass(null); 
            
        } catch (error: any) {
            toast({ variant: "destructive", title: "Action Failed", description: error.message });
        } finally {
            setIsSubmittingGatePass(false);
        }
    };
    
    const handleConfirmMarkCompleted = async () => {
        setIsMarkingCompleted(true);
        await onMarkCompleted();
        setIsMarkingCompleted(false);
    }

    useEffect(() => {
        const currentPreviewUrl = filePreview?.url;
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }
        };
    }, [filePreview]);
    
    const canSetTimeLimit = request?.apiData?.approval_status === 'approved' && !hasInitialProgress && request.apiData.created_by === currentUserId;
    const canMarkCompleted = request.status.toLowerCase() === RequestStatus.APPROVED.toLowerCase() || request.status.toLowerCase() === RequestStatus.WORKING.toLowerCase();

    return (
        <div className="bg-background/95 backdrop-blur-sm p-2 md:p-4 border-t shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.05)]">
            <AnimatePresence>
                {!isInputDisabled && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pb-2 px-2 max-w-2xl mx-auto flex gap-2">
                        {canSetTimeLimit && !showTimeLimitForm && (
                            <Button variant="outline" className="flex-1" onClick={() => setShowTimeLimitForm(true)}>
                                <CalendarClock className="mr-2 h-4 w-4" />
                                Set Initial Time Limit
                            </Button>
                        )}
                        {showGatePassPrompt && !showGatePassForm && !activeOutPass && (
                            <Button variant="outline" className="flex-1" onClick={() => {setShowGatePassForm(true); setShowGatePassPrompt(false);}}>
                                <QrCode className="mr-2 h-4 w-4" />
                                Create Gate Pass
                            </Button>
                        )}
                        {activeOutPass && (
                            <Button variant="outline" className="flex-1" onClick={handleMarkIn} disabled={isSubmittingGatePass}>
                                {isSubmittingGatePass ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                                Mark Vehicle as IN
                            </Button>
                        )}
                        {canMarkCompleted && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="flex-1 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Completed
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will mark the work for this thread as completed. You won't be able to send further messages or updates. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                            className="bg-green-600 hover:bg-green-700" 
                                            onClick={handleConfirmMarkCompleted}
                                            disabled={isMarkingCompleted}
                                        >
                                            {isMarkingCompleted ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Yes, Mark as Completed
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </motion.div>
                )}


                {showTimeLimitForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden max-w-2xl mx-auto mb-2">
                        <Card className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                    Set Expected Completion Date
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowTimeLimitForm(false)}><X className="h-4 w-4" /></Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DatePicker onDateSelect={setExpectedEndDate} />
                                <Button onClick={() => handleSubmitProgress('initial')} disabled={isSubmittingProgress}>
                                    {isSubmittingProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirm Date
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {showGatePassForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden max-w-2xl mx-auto mb-2">
                         <Card className="bg-secondary/50">
                            <CardHeader>
                                 <CardTitle className="text-base flex justify-between items-center">
                                    Create Gate Pass
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowGatePassForm(false)}><X className="h-4 w-4" /></Button>
                                 </CardTitle>
                                 <CardDescription>Fill the details to generate a gate pass for this request.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Purpose</label>
                                    <Textarea placeholder="e.g., Material Purchase, Client Visit..." value={gatePassPurpose} onChange={(e) => setGatePassPurpose(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Valid From</label>
                                    <DatePicker onDateSelect={setGatePassValidFrom} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Valid To</label>
                                    <DatePicker onDateSelect={setGatePassValidTo} />
                                </div>
                                <Button onClick={handleCreateGatePass} disabled={isSubmittingGatePass}>
                                    {isSubmittingGatePass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create and Issue Pass
                                </Button>
                            </CardContent>
                         </Card>
                    </motion.div>
                )}


                {isOverdue && !showDelayForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pb-2 px-2 max-w-2xl mx-auto">
                        <Button variant="destructive" className="w-full" onClick={() => setShowDelayForm(true)}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Task is Overdue. Report Delay.
                        </Button>
                    </motion.div>
                )}

                {showDelayForm && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden max-w-2xl mx-auto mb-2">
                        <Card className="bg-destructive/10 border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                    Report Delay and Update Timeline
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowDelayForm(false)}><X className="h-4 w-4" /></Button>
                                </CardTitle>
                                <CardDescription>Provide a new expected date and a reason for the delay.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">New Expected End Date</label>
                                    <DatePicker onDateSelect={setExpectedEndDate} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Reason for Delay</label>
                                    <Textarea placeholder="e.g., Parts not available, awaiting vendor response..." value={delayReason} onChange={(e) => setDelayReason(e.target.value)} />
                                </div>
                                <Button variant="destructive" onClick={() => handleSubmitProgress('delay')} disabled={isSubmittingProgress}>
                                    {isSubmittingProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Delay Report
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {filePreview && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
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
                 {isInputDisabled ? (
                    <div className="flex-1 text-center text-sm text-muted-foreground bg-secondary rounded-full h-10 flex items-center justify-center">
                        This thread is closed.
                    </div>
                ) : (
                    <>
                        {!filePreview && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0 text-muted-foreground hover:text-primary" disabled={isInputDisabled}>
                                        <Plus className="h-5 w-5" />
                                        <span className="sr-only">Attach file</span>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2">
                                    <div className="flex gap-1">
                                        <Button variant="outline" size="icon" className="h-12 w-12 flex-col gap-1" onClick={() => handleAttachmentClick("image/*,video/*")}>
                                            <Image className="h-5 w-5" />
                                            <span className="text-xs">Photo</span>
                                        </Button>
                                        <Button variant="outline" size="icon" className="h-12 w-12 flex-col gap-1" onClick={() => handleAttachmentClick(".pdf,.doc,.docx,.xls,.xlsx")}>
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
                                    <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '100%', opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="w-full">
                                        <WaveformAnimation />
                                    </motion.div>
                                ) : (
                                    <Input
                                        placeholder={filePreview ? "Add a caption..." : "Type a message..."}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                                                handleSendMessage();
                                                e.preventDefault();
                                            }
                                        }}
                                        disabled={isSending || isInputDisabled}
                                        className="flex-1 rounded-full bg-secondary px-4 py-2 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
                                    />
                                )}
                            </div>
                        </AnimatePresence>

                        {(message || filePreview) && !isRecording ? (
                            <Button size="icon" className="h-9 w-9 flex-shrink-0 rounded-full bg-primary text-primary-foreground" onClick={handleSendMessage} disabled={isSending || isInputDisabled}>
                                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                <span className="sr-only">Send</span>
                            </Button>
                        ) : (
                            <Button size="icon" className="h-9 w-9 flex-shrink-0" variant="ghost" onClick={handleVoiceClick} disabled={isSending || isInputDisabled}>
                                {isRecording ? <StopCircle className="h-5 w-5 text-destructive animate-pulse" /> : <Mic className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                                <span className="sr-only">{isRecording ? "Stop recording" : "Record voice message"}</span>
                            </Button>
                        )}
                    </>
                 )}
            </div>
        </div>
    );
}
