
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageType, Request, RequestStatus, RequestType, VehicleType } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { requests, users } from "@/lib/data";

type Document = { name: string; url: string };

export default function NewRequestPage() {
    const router = useRouter();
    const [vehicleType, setVehicleType] = useState<VehicleType | ''>('');
    const [requestType, setRequestType] = useState<RequestType | ''>('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [description, setDescription] = useState('');
    const [documents, setDocuments] = useState<Document[]>([]);

    const handleDocChange = (index: number, field: 'name' | 'file', value: string) => {
        const newDocs = [...documents];
        if (!newDocs[index]) {
            newDocs[index] = { name: '', url: '#' };
        }
        if (field === 'name') {
            newDocs[index].name = value;
        }
        setDocuments(newDocs);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vehicleType || !requestType || !vehicleNumber) {
            // Basic validation
            alert("Please fill out all required fields.");
            return;
        }

        const newRequestIdNumber = requests.length + 1;
        const newRequestId = `TR-${String(newRequestIdNumber).padStart(3, '0')}`;
        const newTitle = `${requestType} for ${vehicleNumber}`;

        const newRequest: Request = {
            id: newRequestId,
            title: newTitle,
            vehicleType,
            vehicleNumber,
            vehicleDetails: `${vehicleType} - ${vehicleNumber}`,
            requestType,
            status: RequestStatus.PENDING,
            createdBy: 'user-current',
            cfo: 'user-cfo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            documents: documents.filter(doc => doc.name), // Only add docs with names
            messages: [
                {
                    id: `msg-${newRequestId}-1`,
                    requestId: newRequestId,
                    senderId: 'system',
                    type: MessageType.REQUEST_DETAILS,
                    content: 'Request created by You.',
                    timestamp: new Date().toISOString(),
                    seen: true,
                },
                 { 
                    id: `msg-${newRequestId}-2`, 
                    requestId: newRequestId, 
                    senderId: 'user-current', 
                    content: description || "New request created.", 
                    timestamp: new Date(Date.now() + 1000).toISOString(), 
                    type: MessageType.TEXT, 
                    seen: false 
                }
            ],
        };
        
        requests.unshift(newRequest); // Add to the beginning of the list

        router.push(`/dashboard/requests/${newRequestId.replace('TR-', '')}`);
    };

    const documentFields = Array.from({ length: 4 });

    return (
        <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-2xl font-headline font-semibold">Create New Request</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Details</CardTitle>
                            <CardDescription>Fill out the form below to submit a new transport request.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                                    <Select onValueChange={(value) => setVehicleType(value as VehicleType)} value={vehicleType}>
                                        <SelectTrigger id="vehicle-type">
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(VehicleType).map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="request-type">Request Type</Label>
                                    <Select onValueChange={(value) => setRequestType(value as RequestType)} value={requestType}>
                                        <SelectTrigger id="request-type">
                                            <SelectValue placeholder="Select a request type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(RequestType).map((type) => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vehicle-number">Vehicle Number</Label>
                                <Input
                                    id="vehicle-number"
                                    placeholder="e.g., MH12-AB1234"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description / Initial Message</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Add a detailed description or an initial message for the request thread..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <Label>Documents</Label>
                                {documentFields.map((_, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                        <div className="space-y-2">
                                            <Label htmlFor={`doc-${index}-name`} className="text-sm font-normal">Document {index + 1} Name</Label>
                                            <Input
                                                id={`doc-${index}-name`}
                                                placeholder="e.g., Invoice, Permit..."
                                                onChange={(e) => handleDocChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`doc-${index}-file`} className="text-sm font-normal">Document {index + 1} File</Label>
                                            <Input id={`doc-${index}-file`} type="file" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" size="lg">Submit Request</Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
