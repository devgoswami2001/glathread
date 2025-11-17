export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'Supervisor' | 'CFO' | 'GateTeam';
};

export enum MessageType {
  TEXT = 'text',
  SYSTEM = 'system',
  APPROVAL = 'approval',
  DATE_PROMPT = 'date_prompt',
  OUTPASS_GENERATION = 'outpass_generation',
  DEADLINE_MISSED = 'deadline_missed',
  PAYMENT_TRACKING = 'payment_tracking',
  FILE = 'file'
}

export type Message = {
  id: string;
  requestId: string;
  senderId: string; // 'system' for automated messages
  content: string;
  timestamp: string;
  type: MessageType;
  seen: boolean;
  file?: {
    name: string;
    url: string;
    type: 'image' | 'video' | 'pdf' | 'docx' | 'voice';
  };
};

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  WORKING = 'Working',
  WORK_COMPLETED = 'Work Completed',
  PAYMENT_PENDING = 'Payment Pending',
  PAYMENT_DONE = 'Payment Done',
  REJECTED = 'Rejected',
  OVERDUE = 'Overdue',
}

export enum RequestType {
  LOCAL_TRIP = 'Local Trip',
  OUTSTATION_TRIP = 'Outstation Trip',
  MATERIAL_DISPATCH = 'Material Dispatch',
}

export enum VehicleType {
    CAR = 'Car',
    TRUCK = 'Truck',
    BIKE = 'Bike',
}

export type Request = {
  id: string;
  title: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  vehicleDetails: string;
  requestType: RequestType;
  status: RequestStatus;
  createdBy: string; // supervisor's user ID
  cfo: string; // cfo's user ID
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  documents: { name: string; url: string }[];
  startDate?: string;
  endDate?: string;
  outpass_qr?: string;
};
