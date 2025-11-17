import { PlaceHolderImages } from "./placeholder-images";
import type { Request, User } from "./types";
import { MessageType, RequestStatus, RequestType } from "./types";

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
    id: '1',
    title: 'Urgent Material Dispatch',
    vehicleDetails: 'TATA ACE - MH12-AB1234',
    requestType: RequestType.MATERIAL_DISPATCH,
    status: RequestStatus.PENDING,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    documents: [{ name: 'invoice_123.pdf', url: '#' }],
    messages: [
      {
        id: 'msg-1-1',
        requestId: '1',
        senderId: 'system',
        content: 'Request created by Phoenix Baker. Awaiting CFO approval.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: MessageType.SYSTEM,
        seen: true,
      },
      {
        id: 'msg-1-2',
        requestId: '1',
        senderId: 'system',
        content: 'Approval required from Olivia Rhye (CFO).',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        type: MessageType.APPROVAL,
        seen: false,
      }
    ]
  },
  {
    id: '2',
    title: 'Outstation Trip to Pune',
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
      {
        id: 'msg-2-1',
        requestId: '2',
        senderId: 'system',
        content: 'Request created by Lana Steiner.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        type: MessageType.SYSTEM,
        seen: true,
      },
      {
        id: 'msg-2-2',
        requestId: '2',
        senderId: 'user-cfo',
        content: 'Approved. Please proceed.',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        type: MessageType.TEXT,
        seen: true,
      },
      {
        id: 'msg-2-3',
        requestId: '2',
        senderId: 'system',
        content: 'Request approved by Olivia Rhye. Start and End dates have been set.',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        type: MessageType.SYSTEM,
        seen: true,
      },
      {
        id: 'msg-2-4',
        requestId: '2',
        senderId: 'system',
        content: 'Generate Out-Pass for vehicle exit.',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        type: MessageType.OUTPASS_GENERATION,
        seen: true,
      },
       {
        id: 'msg-2-5',
        requestId: '2',
        senderId: 'user-supervisor-2',
        content: 'Thanks! I have generated the out-pass and shared it with the driver.',
        timestamp: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString(),
        type: MessageType.TEXT,
        seen: false,
      }
    ]
  },
  {
    id: '3',
    title: 'Local trip for client visit',
    vehicleDetails: 'Swift Dzire - MH01-EF9012',
    requestType: RequestType.LOCAL_TRIP,
    status: RequestStatus.COMPLETED,
    createdBy: 'user-current',
    cfo: 'user-cfo',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
       {
        id: 'msg-3-1',
        requestId: '3',
        senderId: 'user-current',
        content: 'Requesting a car for a local client visit tomorrow.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: MessageType.TEXT,
        seen: true,
      },
      {
        id: 'msg-3-2',
        requestId: '3',
        senderId: 'system',
        content: 'Request approved by Olivia Rhye.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
        type: MessageType.SYSTEM,
        seen: true,
      },
      {
        id: 'msg-3-3',
        requestId: '3',
        senderId: 'system',
        content: 'Work marked as completed by You. Please upload GLAMS approval for payment processing.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: MessageType.PAYMENT_TRACKING,
        seen: true,
      }
    ]
  },
   {
    id: '4',
    title: 'Rejected Request Example',
    vehicleDetails: 'N/A',
    requestType: RequestType.LOCAL_TRIP,
    status: RequestStatus.REJECTED,
    createdBy: 'user-supervisor-1',
    cfo: 'user-cfo',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    documents: [],
    messages: [
      {
        id: 'msg-4-1',
        requestId: '4',
        senderId: 'system',
        content: 'Request created by Phoenix Baker.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: MessageType.SYSTEM,
        seen: true,
      },
      {
        id: 'msg-4-2',
        requestId: '4',
        senderId: 'user-cfo',
        content: 'Rejected. This is not a valid business expense.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: MessageType.TEXT,
        seen: true,
      },
      {
        id: 'msg-4-3',
        requestId: '4',
        senderId: 'system',
        content: 'Request was rejected by Olivia Rhye. This thread is now closed.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
        type: MessageType.SYSTEM,
        seen: true,
      }
    ]
  }
];
