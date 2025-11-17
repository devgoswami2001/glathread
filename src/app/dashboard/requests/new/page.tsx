

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RequestType, VehicleType } from "@/lib/types";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewRequestPage() {
  return (
    <div className="flex-1 overflow-auto p-4 md:p-8">
       <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
            </Button>
            <h1 className="text-2xl font-headline font-semibold">Create New Request</h1>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Request Details</CardTitle>
                <CardDescription>Fill out the form below to submit a new transport request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="vehicle-type">Vehicle Type</Label>
                        <Select>
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
                        <Select>
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
                    <Input id="vehicle-number" placeholder="e.g., MH12-AB1234" />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Add a detailed description of the request..." />
                </div>

                <div className="space-y-4">
                    <Label>Documents</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="doc-a-name" className="text-sm font-normal">Document A Name</Label>
                            <Input id="doc-a-name" placeholder="e.g., Invoice" />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="doc-a-file" className="text-sm font-normal">Document A File</Label>
                            <Input id="doc-a-file" type="file" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="doc-b-name" className="text-sm font-normal">Document B Name</Label>
                            <Input id="doc-b-name" placeholder="e.g., Challan" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doc-b-file" className="text-sm font-normal">Document B File</Label>
                            <Input id="doc-b-file" type="file" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="doc-c-name" className="text-sm font-normal">Document C Name</Label>
                            <Input id="doc-c-name" placeholder="e.g., Quotation" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doc-c-file" className="text-sm font-normal">Document C File</Label>
                            <Input id="doc-c-file" type="file" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="doc-d-name" className="text-sm font-normal">Document D Name</Label>
                            <Input id="doc-d-name" placeholder="e.g., Permit" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="doc-d-file" className="text-sm font-normal">Document D File</Label>
                            <Input id="doc-d-file" type="file" />
                        </div>
                    </div>
                </div>

                <Button type="submit" size="lg">Submit Request</Button>
            </CardContent>
        </Card>
       </div>
    </div>
  )
}
