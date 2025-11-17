
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RequestType } from "@/lib/types";
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
                <div className="space-y-2">
                    <Label htmlFor="title">Request Title</Label>
                    <Input id="title" placeholder="e.g., Urgent Material Dispatch to Site A" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="vehicle-details">Vehicle Details</Label>
                    <Input id="vehicle-details" placeholder="e.g., TATA ACE - MH12-AB1234" />
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
                 <div className="space-y-2">
                    <Label htmlFor="documents">Upload Documents</Label>
                    <Input id="documents" type="file" />
                    <p className="text-xs text-muted-foreground">Attach relevant documents like invoices, challans, etc.</p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Initial Message</Label>
                    <Textarea id="message" placeholder="Add any additional details or instructions for the approver." />
                </div>
                <Button type="submit">Submit Request</Button>
            </CardContent>
        </Card>
       </div>
    </div>
  )
}
