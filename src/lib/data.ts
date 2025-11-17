
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
    title: 'Urgent Material Dispatch to Site A',
    vehicleType: VehicleType.TRUCK,
    vehicleNumber: 'MH12-AB1234',
    vehicleDetails: 'TATA ACE - MH12-AB1234',
    requestType: RequestType.MATERIAL_DISPATCH,
    status: RequestStatus.PENDING,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    documents: [{ name: 'invoice_123.pdf', url: '#' }],
    messages: [
      { id: 'msg-1-1', requestId: '1', senderId: 'system', content: 'Request created by Phoenix Baker. Awaiting CFO approval.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: true },
      { id: 'msg-1-2', requestId: '1', senderId: 'user-supervisor-1', content: 'Need this approved ASAP to avoid delays.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), type: MessageType.TEXT, seen: false }
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
      { id: 'msg-2-1', requestId: '2', senderId: 'user-cfo', content: 'Approved. Please proceed.', timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), type: MessageType.TEXT, seen: true },
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
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
      { id: 'msg-3-1', requestId: '3', senderId: 'system', content: 'Work marked as completed by You. Please upload GLAMS for payment.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: true },
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
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
       { id: 'msg-4-1', requestId: '4', senderId: 'user-cfo', content: 'Rejected. Please provide a quotation before proceeding.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.TEXT, seen: true },
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
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
        { id: 'msg-5-1', requestId: '5', senderId: 'user-supervisor-2', content: 'On my way to the site now.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.TEXT, seen: true },
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
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
        { id: 'msg-6-1', requestId: '6', senderId: 'system', content: 'Payment is pending for this trip. Please process.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: false },
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
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
        { id: 'msg-7-1', requestId: '7', senderId: 'system', content: 'Payment processed and completed.', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: true },
    ]
  },
  {
    id: 'TR-008',
    title: 'Urgent: deliver documents to HQ',
    vehicleType: VehicleType.BIKE,
    vehicleNumber: 'MH03-LM5678',
    vehicleDetails: 'Bajaj Pulsar - MH03-LM5678',
    requestType: RequestType.MATERIAL_DISPATCH,
    status: RequestStatus.OVERDUE,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
        { id: 'msg-8-1', requestId: '8', senderId: 'system', content: 'This request is overdue. Please take action.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: false },
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
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
        { id: 'msg-9-1', requestId: '9', senderId: 'system', content: 'Request for servicing created. Awaiting approval.', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: true },
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
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [{name: "conference_pass.pdf", url: "#"}],
    messages: [
        { id: 'msg-10-1', requestId: '10', senderId: 'user-cfo', content: 'Trip to Goa is approved. Ensure all toll receipts are submitted.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.TEXT, seen: true },
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
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [{name: "puncture_bill.jpg", url: "#"}],
    messages: [
        { id: 'msg-11-1', requestId: '11', senderId: 'system', content: 'Work completed. Please submit bills for reimbursement.', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), type: MessageType.SYSTEM, seen: true },
    ]
  }
];
