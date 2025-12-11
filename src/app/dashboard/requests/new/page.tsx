

'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type DocumentFile = {
    name: string;
    file: File | null;
};

type Category = {
    id: number;
    name: string;
};

const vehicleTypes = ["bus", "car", "golf_cart", "e_rickshaw", "ambulance", "other"];

export default function NewRequestPage() {
    const router = useRouter();
    const { toast } = useToast();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requestCategory, setRequestCategory] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [documents, setDocuments] = useState<DocumentFile[]>(Array(4).fill({ name: '', file: null }));
    const [isLoading, setIsLoading] = useState(false);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                 toast({
                    variant: "destructive",
                    title: "Authentication Error",
                    description: "You are not logged in.",
                });
                router.push('/');
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/api/request-categories", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data: Category[] = await response.json();
                setCategories(data);
            } catch (error: any) {
                 toast({
                    variant: "destructive",
                    title: "Failed to load categories",
                    description: error.message || "Could not fetch request categories from the server.",
                });
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, [toast, router]);


    const handleDocNameChange = (index: number, name: string) => {
        const newDocs = [...documents];
        newDocs[index] = { ...newDocs[index], name };
        setDocuments(newDocs);
    };

    const handleDocFileChange = (index: number, file: File | null) => {
        const newDocs = [...documents];
        newDocs[index] = { ...newDocs[index], file };
        setDocuments(newDocs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!requestCategory || !title || !description) {
            toast({
                variant: "destructive",
                title: "Missing Required Fields",
                description: "Please fill out Title, Description, and Request Category.",
            });
            return;
        }
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({
                variant: "destructive",
                title: "Authentication Error",
                description: "You are not logged in. Please log in again.",
            });
            router.push('/');
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        formData.append('request_category', requestCategory);
        formData.append('title', title);
        formData.append('description', description);

        if (vehicleNumber) formData.append('vehicle_number', vehicleNumber);
        if (vehicleType) formData.append('vehicle_type', vehicleType);

        documents.forEach((doc, index) => {
            if (doc.file && doc.name) {
                formData.append(`document_${index + 1}_name`, doc.name);
                formData.append(`document_${index + 1}_file`, doc.file);
            }
        });

        
        
        try {
            const response = await fetch("http://127.0.0.1:8000/api/threads/create/", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast({
                    title: "Thread Created Successfully!",
                    description: `Thread "${result.thread_number}" has been created.`,
                });
                router.push(`/dashboard/requests/${result.thread_number}`);
            } else {
                const errorMessages = Object.values(result).flat().join('\n');
                throw new Error(errorMessages || "An unknown error occurred.");
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Failed to create thread",
                description: error.message || "There was a problem with your request.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" className="h-8 w-8" asChild>
                        <Link href="/dashboard"><ChevronLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-2xl font-headline font-semibold">Create New Thread</h1>
                </div>

                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thread Details</CardTitle>
                            <CardDescription>Fill out the form below to submit a new transport request thread.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="request-category">Request Category (Required)</Label>
                                <Select onValueChange={setRequestCategory} value={requestCategory} disabled={isCategoriesLoading}>
                                    <SelectTrigger id="request-category">
                                        <SelectValue placeholder={isCategoriesLoading ? "Loading categories..." : "Select a request category"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="title">Title (Required)</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Urgent Repair for Clutch Plate"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Required)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Add a detailed description..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle-number">Vehicle Number (Optional)</Label>
                                    <Input
                                        id="vehicle-number"
                                        placeholder="e.g., MH12-AB1234"
                                        value={vehicleNumber}
                                        onChange={(e) => setVehicleNumber(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicle-type">Vehicle Type (Optional)</Label>
                                    <Select onValueChange={setVehicleType} value={vehicleType}>
                                        <SelectTrigger id="vehicle-type">
                                            <SelectValue placeholder="Select vehicle type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicleTypes.map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">{type.replace(/_/g, ' ')}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Documents (Optional - Max 4)</Label>
                                {documents.map((_, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                                        <div className="space-y-2">
                                            <Label htmlFor={`doc-${index}-name`} className="text-sm font-normal">Document {index + 1} Name</Label>
                                            <Input
                                                id={`doc-${index}-name`}
                                                placeholder="e.g., Invoice, Permit..."
                                                onChange={(e) => handleDocNameChange(index, e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`doc-${index}-file`} className="text-sm font-normal">Document {index + 1} File</Label>
                                            <Input 
                                                id={`doc-${index}-file`} 
                                                type="file" 
                                                onChange={(e) => handleDocFileChange(index, e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Request
                            </Button>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
