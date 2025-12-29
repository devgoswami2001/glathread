

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'Supervisor' | 'CFO' | 'GateTeam' | 'HOD' | 'Registrar' | 'Administrator' | string;
};

export enum MessageType {
  TEXT = 'text',
  SYSTEM = 'system',
  APPROVAL = 'approval',
  DATE_PROMPT = 'date_prompt',
  OUTPASS_GENERATION = 'outpass_generation',
  DEADLINE_MISSED = 'deadline_missed',
  PAYMENT_TRACKING = 'payment_tracking',
  FILE = 'file',
  REQUEST_DETAILS = 'request_details',
  PROGRESS_UPDATE = 'progress_update',
  GATE_PASS_DETAILS = 'gate_pass_details',
  GATE_PASS_UPDATE = 'gate_pass_update',
  GATE_PASS_OUT = 'gate_pass_out',
  GATE_PASS_IN = 'gate_pass_in',
}

export type ProgressUpdate = {
  id: number;
  progress_type: 'initial' | 'delay' | 'completed';
  expected_end_date: string;
  delay_reason: string | null;
  updated_by: number;
  updated_by_name: string;
  created_at: string;
}

export type GatePass = {
  id: number;
  issued_to: number;
  issued_to_name: string;
  vehicle_number: string;
  purpose: string;
  valid_from: string;
  valid_to: string;
  status: string;
  created_at: string;
  pass_mode: 'in' | 'out';
  out_time: string | null;
  in_time: string | null;
};

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
    type: 'image' | 'video' | 'pdf' | 'docx' | 'voice' | 'file';
    size?: string;
  };
  progress?: ProgressUpdate;
  gatePass?: GatePass;
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
  MAINTENANCE = 'Maintenance',
  SERVICE = 'Service',
  VEHICLE_RELATED_SERVICE = 'Vehicle Related Service',
  LOCAL_TRIP = 'Local Trip',
  OUTSTATION_TRIP = 'Outstation Trip',
  MATERIAL_DISPATCH = 'Material Dispatch',
  BILL = 'Bill',
  MONTHLY_BUS_BILL = 'Monthly Bus Bill',
}

export enum VehicleType {
    CAR = 'Car',
    TRUCK = 'Truck',
    BIKE = 'Bike',
    BUS = 'Bus',
    GOLF_CART = 'Golf Cart',
    E_RICKSHAW = 'E-Rickshaw',
    E_LOADER = 'E-Loader',
    AMBULANCE = 'Ambulance',
    OTHER = 'Other'
}

export type Request = {
  id: string;
  title: string;
  vehicleType: VehicleType | string;
  vehicleNumber: string;
  vehicleDetails: string;
  requestType: RequestType | string;
  status: RequestStatus | string;
  createdBy: string; // supervisor's user ID
  cfo: string; // cfo's user ID
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  documents: { name: string; url: string }[];
  startDate?: string;
  endDate?: string;
  outpass_qr?: string;
  apiData?: any; // To store the raw API thread object
};

    