import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requests } from "@/lib/data";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function OutPassPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const request = requests.find(r => r.id === id);

    if (!request) {
        notFound();
    }

    const qrData = JSON.stringify({
        requestId: request.id,
        vehicle: request.vehicleDetails,
        type: request.requestType,
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=200x200&bgcolor=ECEFF1`;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-muted">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="font-headline text-2xl">Vehicle Out-Pass</CardTitle>
                    <CardDescription>Gate Security Scan</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex flex-col items-center justify-center">
                         <Image 
                            src={qrCodeUrl} 
                            alt="QR Code for Out-Pass" 
                            width={200} 
                            height={200} 
                            data-ai-hint="qr code" 
                            className="rounded-lg border p-2"
                        />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="col-span-1 text-muted-foreground">Request ID</div>
                        <div className="col-span-2 font-mono">{request.id}</div>

                        <div className="col-span-1 text-muted-foreground">Vehicle</div>
                        <div className="col-span-2 font-semibold">{request.vehicleDetails}</div>
                        
                        <div className="col-span-1 text-muted-foreground">Request Type</div>
                        <div className="col-span-2">
                             <Badge variant="secondary">{request.requestType}</Badge>
                        </div>
                        
                        <div className="col-span-1 text-muted-foreground">Status</div>
                        <div className="col-span-2">
                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">VALID FOR EXIT</Badge>
                        </div>

                         <div className="col-span-1 text-muted-foreground">Start Date</div>
                        <div className="col-span-2">{request.startDate ? format(new Date(request.startDate), 'PP') : 'N/A'}</div>

                         <div className="col-span-1 text-muted-foreground">End Date</div>
                        <div className="col-span-2">{request.endDate ? format(new Date(request.endDate), 'PP') : 'N/A'}</div>

                    </div>
                </CardContent>
                <CardFooter className="text-center text-xs text-muted-foreground">
                    Generated on {format(new Date(), 'PPp')}
                </CardFooter>
            </Card>
        </main>
    )
}
