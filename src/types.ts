export type AssetStatus = 'Active' | 'Maintenance Due' | 'Critical (Engine)' | 'In Transit' | 'Standby';

export type AssetType = 
  | 'Heavy Transport' 
  | 'Courier Light' 
  | 'Refrigerated' 
  | 'EV Transport' 
  | 'Vaccine Carrier' 
  | 'Emergency Ambulance';

export interface FleetAsset {
  id: string; // e.g., V-4092
  type: AssetType;
  route: string; // e.g., RT-104 (Northern Corridor) or '-- Unassigned --'
  status: AssetStatus;
  lastService: string; // e.g., 'Oct 12, 2023'
  fuelEfficiency: number; // in MPG
  temperature?: number; // for Refrigerated / Vaccine Carrier (e.g., 2.4°C)
  driverId?: string; // assigned team member
  notes?: string;
  telematics?: {
    speed: number;
    lat: number;
    lng: number;
    batteryLevel?: number; // for EV
    oilPressure?: string;
    engineTemp?: number;
  };
}

export interface ClinicalProject {
  id: string; // e.g., PROJ-101
  name: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Delayed' | 'Planning';
  assignedAssets: string[]; // Asset IDs
  manager: string; // Team member name
  targetDate: string;
  progress: number; // 0 - 100
  priority: 'High' | 'Medium' | 'Low';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'On Shift' | 'Off Duty' | 'Emergency Standby';
  avatar: string; // hotlink
  licenseType: string;
  rating: number;
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  assetId: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  message: string;
  location: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Cold Chain Alert' | 'Vehicle Mechanical' | 'Route Delay' | 'Software Glitch';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved' | 'In Progress';
  description: string;
  createdAt: string;
  messages: Array<{
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }>;
}

export interface SystemConfig {
  tempLimitMin: number; // e.g., 2.0 °C
  tempLimitMax: number; // e.g., 8.0 °C (Standard vaccine cold chain)
  fuelThresholdLow: number; // e.g., 12 MPG
  enableRealtimeSimulation: boolean;
  alertOnDelay: boolean;
  distanceUnit: 'miles' | 'km';
  theme: 'light' | 'dark';
}
