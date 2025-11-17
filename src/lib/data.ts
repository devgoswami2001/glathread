
import { PlaceHolderImages } from "./placeholder-images";
import type { Request, User } from "./types";
import { MessageType, RequestStatus, RequestType, VehicleType } from "./types";

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || "https://picsum.photos/seed/placeholder/100/100";

export const users: User[] = [
  { id: 'user-cfo', name: 'Olivia Rhye', avatar: findImage('user-cfo'), role: 'CFO' },
  { id: 'user-supervisor-1', name: 'Phoenix Baker', avatar: findImage('user-supervisor-1'), role: 'Supervisor' },
  { id: 'user-supervisor-2', name: 'Lana Steiner', avatar: findImage('user-supervisor-2'), role: 'Supervisor' },
  { id: 'user-gate-team', name: 'Ken T.', avatar: findImage('user-gate-team'), role: 'GateTeam' },
  { id: 'user-current', name: 'You', avatar: findImage('user-current'), role: 'Supervisor' }
];

export const requests: Request[] = [
  {
    id: 'TR-001',
    title: 'Monthly Bus Bill - January 2025',
    vehicleType: VehicleType.BUS,
    vehicleNumber: 'UP85 XX 4521',
    vehicleDetails: 'Bus - UP85 XX 4521',
    requestType: RequestType.MONTHLY_BUS_BILL,
    status: RequestStatus.PENDING,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: "2024-07-29T10:30:00.000Z",
    updatedAt: "2024-07-29T10:30:00.000Z",
    documents: [
        { name: 'jan-bus-invoice.pdf', url: '#' },
        { name: 'fuel-report-jan.xlsx', url: '#' },
        { name: 'logsheet-jan.pdf', url: '#' },
        { name: 'route-utilization-jan.pdf', url: '#' }
    ],
    messages: [
      { 
        id: 'msg-1-0', 
        requestId: 'TR-001', 
        senderId: 'system', 
        type: MessageType.REQUEST_DETAILS, 
        content: 'Request created by Phoenix Baker.', 
        timestamp: "2024-07-29T10:30:00.000Z", 
        seen: true 
      },
      { id: 'msg-1-1', requestId: 'TR-001', senderId: 'user-supervisor-1', content: 'Monthly bus bill for January 2025 with all supporting documents attached.', timestamp: "2024-07-29T10:30:05.000Z", type: MessageType.TEXT, seen: true },
      { 
        id: 'msg-1-3', 
        requestId: 'TR-001', 
        senderId: 'user-cfo', 
        content: 'Please review the attached documents for the monthly bus bill and approve or reject the request.', 
        timestamp: "2024-07-29T12:00:00.000Z", 
        type: MessageType.APPROVAL, 
        seen: false,
      }
    ]
  },
  {
    id: 'TR-002',
    title: 'Outstation Trip to Pune for Client Meeting',
    vehicleType: VehicleType.CAR,
    vehicleNumber: 'MH14-CD5678',
    vehicleDetails: 'Innova Crysta - MH14-CD5678',
    requestType: RequestType.OUTSTATION_TRIP,
    status: RequestStatus.APPROVED,
    createdBy: 'user-supervisor-2',
    cfo: 'user-cfo',
    createdAt: "2024-07-28T12:30:00.000Z",
    updatedAt: "2024-07-29T00:30:00.000Z",
    startDate: "2024-07-31T00:00:00.000Z",
    endDate: "2024-08-03T00:00:00.000Z",
    documents: [],
    messages: [
      { id: 'msg-2-1', requestId: '2', senderId: 'user-cfo', content: 'Approved. Please proceed.', timestamp: "2024-07-28T13:30:00.000Z", type: MessageType.TEXT, seen: true },
    ]
  },
  {
    id: 'TR-003',
    title: 'Local trip for airport drop',
    vehicleType: VehicleType.CAR,
    vehicleNumber: 'MH01-EF9012',
    vehicleDetails: 'Swift Dzire - MH01-EF9012',
    requestType: RequestType.LOCAL_TRIP,
    status: RequestStatus.WORK_COMPLETED,
    createdBy: 'user-current',
    cfo: 'user-cfo',
    createdAt: "2024-07-24T12:30:00.000Z",
    updatedAt: "2024-07-27T12:30:00.000Z",
    documents: [],
    messages: [
      { id: 'msg-3-1', requestId: '3', senderId: 'system', content: 'Work marked as completed by You. Please upload GLAMS for payment.', timestamp: "2024-07-27T12:30:00.000Z", type: MessageType.SYSTEM, seen: true },
    ]
  },
   {
    id: 'TR-004',
    title: 'Scheduled Maintenance for Innova',
    vehicleType: VehicleType.CAR,
    vehicleNumber: 'MH14-CD5678',
    vehicleDetails: 'Innova Crysta - MH14-CD5678',
    requestType: RequestType.MAINTENANCE,
    status: RequestStatus.REJECTED,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: "2024-07-27T12:30:00.000Z",
    updatedAt: "2024-07-28T12:30:00.00Z",
    documents: [],
    messages: [
       { id: 'msg-4-1', requestId: '4', senderId: 'user-cfo', content: 'Rejected. Please provide a quotation before proceeding.', timestamp: "2024-07-28T12:30:00.00Z", type: MessageType.TEXT, seen: true },
    ]
  },
  {
    id: 'TR-005',
    title: 'Site visit for new project',
    vehicleType: VehicleType.BIKE,
    vehicleNumber: 'MH02-GH3456',
    vehicleDetails: 'Honda Activa - MH02-GH3456',
    requestType: RequestType.LOCAL_TRIP,
    status: RequestStatus.WORKING,
    createdBy: 'user-supervisor-2',
    cfo: 'user-cfo',
    createdAt: "2024-07-26T12:30:00.000Z",
    updatedAt: "2024-07-28T12:30:00.000Z",
    documents: [],
    messages: [
        { id: 'msg-5-1', requestId: '5', senderId: 'user-supervisor-2', content: 'On my way to the site now.', timestamp: "2024-07-28T12:30:00.000Z", type: MessageType.TEXT, seen: true },
    ]
  },
  {
    id: 'TR-006',
    title: 'Invoice Payment for Oct Trip',
    vehicleType: VehicleType.CAR,
    vehicleNumber: 'MH14-CD5678',
    vehicleDetails: 'Innova Crysta - MH14-CD5678',
    requestType: RequestType.OUTSTATION_TRIP,
    status: RequestStatus.PAYMENT_PENDING,
    createdBy: 'user-supervisor-2',
    cfo: 'user-cfo',
    createdAt: "2024-07-19T12:30:00.000Z",
    updatedAt: "2024-07-28T12:30:00.000Z",
    documents: [],
    messages: [
        { id: 'msg-6-1', requestId: '6', senderId: 'system', content: 'Payment is pending for this trip. Please process.', timestamp: "2024-07-28T12:30:00.000Z", type: MessageType.SYSTEM, seen: false },
    ]
  },
    {
    id: 'TR-007',
    title: 'Team Outing Transport',
    vehicleType: VehicleType.CAR,
    vehicleNumber: 'MH04-JK1234',
    vehicleDetails: 'Toyota Etios - MH04-JK1234',
    requestType: RequestType.LOCAL_TRIP,
    status: RequestStatus.PAYMENT_DONE,
    createdBy: 'user-current',
    cfo: 'user-cfo',
    createdAt: "2024-07-14T12:30:00.000Z",
    updatedAt: "2024-07-22T12:30:00.000Z",
    documents: [],
    messages: [
        { id: 'msg-7-1', requestId: '7', senderId: 'system', content: 'Payment processed and completed.', timestamp: "2024-07-22T12:30:00.000Z", type: MessageType.SYSTEM, seen: true },
    ]
  },
  {
    id: 'TR-008',
    title: 'Urgent Material Dispatch to Site A',
    vehicleType: VehicleType.BIKE,
    vehicleNumber: 'MH03-LM5678',
    vehicleDetails: 'Bajaj Pulsar - MH03-LM5678',
    requestType: RequestType.MATERIAL_DISPATCH,
    status: RequestStatus.OVERDUE,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: "2024-07-21T12:30:00.000Z",
    updatedAt: "2024-07-29T11:30:00.000Z",
    documents: [],
    messages: [
        { id: 'msg-8-1', requestId: '8', senderId: 'user-supervisor-1', content: 'Need this approved ASAP to avoid delays.', timestamp: "2024-07-21T12:30:00.000Z", type: MessageType.TEXT, seen: true },
        { 
            id: 'msg-8-2', 
            requestId: '8', 
            senderId: 'user-cfo', 
            content: '', 
            timestamp: "2024-07-29T11:30:00.000Z", 
            type: MessageType.FILE,
            seen: true,
            file: {
                name: 'urgent-dispatch-approval.wav',
                url: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=',
                type: 'voice',
                size: '0.12 KB'
            }
        },
    ]
  },
  {
    id: 'TR-009',
    title: 'Vehicle Servicing for TATA ACE',
    vehicleType: VehicleType.TRUCK,
    vehicleNumber: 'MH12-PQ3456',
    vehicleDetails: 'TATA ACE - MH12-PQ3456',
    requestType: RequestType.SERVICE,
    status: RequestStatus.PENDING,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: "2024-07-28T12:30:00.000Z",
    updatedAt: "2024-07-28T12:30:00.000Z",
    documents: [],
    messages: [
        { id: 'msg-9-1', requestId: '9', senderId: 'system', content: 'Request for servicing created. Awaiting approval.', timestamp: "2024-07-28T12:30:00.000Z", type: MessageType.SYSTEM, seen: true },
    ]
  },
   {
    id: 'TR-010',
    title: 'Mumbai-Goa trip for conference',
    vehicleType: VehicleType.CAR,
    vehicleNumber: 'MH02-DE7890',
    vehicleDetails: 'Honda City - MH02-DE7890',
    requestType: RequestType.OUTSTATION_TRIP,
    status: RequestStatus.APPROVED,
    createdBy: 'user-current',
    cfo: 'user-cfo',
    createdAt: "2024-07-25T12:30:00.000Z",
    updatedAt: "2024-07-27T12:30:00.000Z",
    startDate: "2024-08-05T00:00:00.000Z",
    endDate: "2024-08-09T00:00:00.000Z",
    documents: [{name: "conference_pass.pdf", url: "#"}],
    messages: [
        { id: 'msg-10-1', requestId: '10', senderId: 'user-cfo', content: 'Trip to Goa is approved. Ensure all toll receipts are submitted.', timestamp: "2024-07-27T12:30:00.000Z", type: MessageType.TEXT, seen: true },
    ]
  },
  {
    id: 'TR-011',
    title: 'Fixing punctured tyre for Bike',
    vehicleType: VehicleType.BIKE,
    vehicleNumber: 'MH03-LM5678',
    vehicleDetails: 'Bajaj Pulsar - MH03-LM5678',
    requestType: RequestType.VEHICLE_RELATED_SERVICE,
    status: RequestStatus.WORK_COMPLETED,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: "2024-07-23T12:30:00.000Z",
    updatedAt: "2024-07-24T12:30:00.000Z",
    documents: [{name: "puncture_bill.jpg", url: "#"}],
    messages: [
        { id: 'msg-11-1', requestId: '11', senderId: 'system', content: 'Work completed. Please submit bills for reimbursement.', timestamp: "2024-07-24T12:30:00.000Z", type: MessageType.SYSTEM, seen: true },
    ]
  }
];
