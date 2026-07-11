import { FleetAsset, ClinicalProject, TeamMember, TelemetryLog, SupportTicket, SystemConfig } from './types';

export const INITIAL_ASSETS: FleetAsset[] = [
  {
    id: 'V-4092',
    type: 'Heavy Transport',
    route: 'RT-104 (Northern Corridor)',
    status: 'Active',
    lastService: 'Oct 12, 2023',
    fuelEfficiency: 12.4,
    driverId: 'T-01',
    notes: 'Transporting bulk medical surgical equipment. Fleet health optimal.',
    telematics: { speed: 55, lat: 40.7128, lng: -74.0060, oilPressure: 'Normal', engineTemp: 185 }
  },
  {
    id: 'V-1184',
    type: 'Courier Light',
    route: 'RT-088 (Metro Central)',
    status: 'Maintenance Due',
    lastService: 'Aug 05, 2023',
    fuelEfficiency: 24.2,
    driverId: 'T-03',
    notes: 'Scheduled for 15,000-mile standard inspection. Brake pads require checking.',
    telematics: { speed: 30, lat: 40.7589, lng: -73.9851, oilPressure: 'Low Warning', engineTemp: 195 }
  },
  {
    id: 'V-5501',
    type: 'Refrigerated',
    route: '-- Unassigned --',
    status: 'Critical (Engine)',
    lastService: 'Jun 20, 2023',
    fuelEfficiency: 11.2,
    temperature: -18.5, // Deep freeze cargo
    driverId: 'T-04',
    notes: 'Engine coolant sensor malfunction detected. Overheating risk.',
    telematics: { speed: 0, lat: 40.7306, lng: -73.9352, oilPressure: 'Critical High', engineTemp: 235 }
  },
  {
    id: 'V-8820',
    type: 'EV Transport',
    route: 'RT-201 (South District)',
    status: 'Active',
    lastService: 'Nov 01, 2023',
    fuelEfficiency: 34.5, // MPG-equivalent
    driverId: 'T-02',
    notes: 'Delivering pharmaceutical products. Battery health 92%.',
    telematics: { speed: 42, lat: 40.6782, lng: -73.9442, batteryLevel: 78, engineTemp: 98 }
  },
  {
    id: 'V-9201',
    type: 'Vaccine Carrier',
    route: 'RT-105 (East Clinical Line)',
    status: 'Active',
    lastService: 'Dec 15, 2023',
    fuelEfficiency: 26.8,
    temperature: 4.2, // Vaccine cold chain (safe range 2.0 - 8.0)
    driverId: 'T-05',
    notes: 'Carrying Moderna COVID-19 & Influenza pediatric vaccines.',
    telematics: { speed: 48, lat: 40.7250, lng: -73.9910, batteryLevel: 94, engineTemp: 104 }
  },
  {
    id: 'V-3304',
    type: 'Vaccine Carrier',
    route: 'RT-108 (Suburban Outreach)',
    status: 'Critical (Engine)', // Counts toward the 3 Critical Alerts
    lastService: 'Sep 02, 2023',
    fuelEfficiency: 25.5,
    temperature: 9.1, // DANGEROUS TEMP! Over standard 8.0°C
    driverId: 'T-06',
    notes: 'Vaccine container compressor experiencing power interruptions. Temperature rising.',
    telematics: { speed: 22, lat: 40.8115, lng: -73.9012, batteryLevel: 41, engineTemp: 120 }
  },
  {
    id: 'V-1442',
    type: 'Emergency Ambulance',
    route: 'RT-001 (Main Hospital Shuttle)',
    status: 'Critical (Engine)', // Counts toward the 3 Critical Alerts
    lastService: 'Jan 05, 2024',
    fuelEfficiency: 9.8,
    driverId: 'T-07',
    notes: 'Siren and onboard telemetry computer power surges. In urgent need of maintenance.',
    telematics: { speed: 0, lat: 40.7829, lng: -73.9654, oilPressure: 'Normal', engineTemp: 210 }
  },
  {
    id: 'V-7110',
    type: 'EV Transport',
    route: 'RT-088 (Metro Central)',
    status: 'Active',
    lastService: 'Sep 22, 2023',
    fuelEfficiency: 35.0,
    driverId: 'T-08',
    notes: 'Express diagnostic kits distribution. Fully operational.',
    telematics: { speed: 38, lat: 40.7410, lng: -73.9890, batteryLevel: 85, engineTemp: 94 }
  },
  {
    id: 'V-2993',
    type: 'Courier Light',
    route: 'RT-104 (Northern Corridor)',
    status: 'Active',
    lastService: 'Jan 10, 2024',
    fuelEfficiency: 24.8,
    driverId: 'T-01',
    notes: 'Pathological specimen rapid shuttle. Priority service.',
    telematics: { speed: 52, lat: 40.7990, lng: -73.9510, oilPressure: 'Normal', engineTemp: 180 }
  },
  {
    id: 'V-6544',
    type: 'Refrigerated',
    route: 'RT-110 (State Line Bio-Deliveries)',
    status: 'Active',
    lastService: 'Oct 28, 2023',
    fuelEfficiency: 11.8,
    temperature: 2.8,
    driverId: 'T-04',
    notes: 'Human plasma shipment. Cold chain verified and stable.',
    telematics: { speed: 50, lat: 40.6920, lng: -74.1200, oilPressure: 'Normal', engineTemp: 188 }
  },
  {
    id: 'V-5091',
    type: 'Emergency Ambulance',
    route: 'RT-002 (Urban Rapid Response)',
    status: 'Active',
    lastService: 'Feb 12, 2024',
    fuelEfficiency: 10.1,
    driverId: 'T-07',
    notes: 'First-response clinical team vehicle. Dynamic positioning active.',
    telematics: { speed: 15, lat: 40.7011, lng: -74.0199, oilPressure: 'Normal', engineTemp: 190 }
  },
  {
    id: 'V-4421',
    type: 'Vaccine Carrier',
    route: 'RT-108 (Suburban Outreach)',
    status: 'Maintenance Due',
    lastService: 'Jul 15, 2023',
    fuelEfficiency: 27.2,
    temperature: 3.5,
    driverId: 'T-06',
    notes: 'Refrigeration unit gasket replacement recommended within 200 miles.',
    telematics: { speed: 12, lat: 40.8521, lng: -73.8540, batteryLevel: 68, engineTemp: 101 }
  }
];

export const INITIAL_PROJECTS: ClinicalProject[] = [
  {
    id: 'PROJ-101',
    name: 'State pediatric vaccine push',
    description: 'Rapid distribution of MMR & Influenza immunizations to 45 community health clinics in northern and eastern districts.',
    status: 'In Progress',
    assignedAssets: ['V-9201', 'V-3304', 'V-4421'],
    manager: 'Dr. Sarah Jenkins',
    targetDate: 'Jul 30, 2026',
    progress: 68,
    priority: 'High'
  },
  {
    id: 'PROJ-102',
    name: 'Metro blood bank network consolidation',
    description: 'Ensuring blood plasma and whole blood supply levels are balanced daily between regional hospitals and central archives.',
    status: 'In Progress',
    assignedAssets: ['V-1184', 'V-7110', 'V-6544'],
    manager: 'Marcus Vance',
    targetDate: 'Aug 15, 2026',
    progress: 42,
    priority: 'High'
  },
  {
    id: 'PROJ-103',
    name: 'Rural oncology supply logistics',
    description: 'Weekly delivery of highly sensitive, refrigerated chemotherapeutic compounds to remote hospice clinics.',
    status: 'Planning',
    assignedAssets: ['V-5501'],
    manager: 'Elena Rostova',
    targetDate: 'Sep 01, 2026',
    progress: 15,
    priority: 'Medium'
  },
  {
    id: 'PROJ-104',
    name: 'Dialysis center critical shuttle setup',
    description: 'Establishment of dedicated express logistics for emergency medical consumables, filters, and sanitizers.',
    status: 'Completed',
    assignedAssets: ['V-4092', 'V-2993'],
    manager: 'James Carter',
    targetDate: 'Jun 28, 2026',
    progress: 100,
    priority: 'Medium'
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'T-01',
    name: 'James Carter',
    role: 'Lead Heavy Transport Specialist',
    email: 'j.carter@emidstech.com',
    phone: '(555) 019-2831',
    status: 'On Shift',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    licenseType: 'CDL Class A (Specialist)',
    rating: 4.9
  },
  {
    id: 'T-02',
    name: 'Elena Rostova',
    role: 'EV Fleet Operator',
    email: 'e.rostova@emidstech.com',
    phone: '(555) 014-9912',
    status: 'On Shift',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    licenseType: 'Class D (Clean Air Cert)',
    rating: 4.85
  },
  {
    id: 'T-03',
    name: 'Dr. Sarah Jenkins',
    role: 'Medical Logistics Director',
    email: 's.jenkins@emidstech.com',
    phone: '(555) 011-4043',
    status: 'Emergency Standby',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    licenseType: 'MD / Clinical Logistics Specialist',
    rating: 5.0
  },
  {
    id: 'T-04',
    name: 'Marcus Vance',
    role: 'Bio-Logistics Coordinator',
    email: 'm.vance@emidstech.com',
    phone: '(555) 018-4822',
    status: 'On Shift',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    licenseType: 'CDL Class B (HazMat/Bio)',
    rating: 4.92
  },
  {
    id: 'T-05',
    name: 'David Miller',
    role: 'Clinical Transport Driver',
    email: 'd.miller@emidstech.com',
    phone: '(555) 012-7811',
    status: 'Off Duty',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    licenseType: 'Class D (Specimen Cert)',
    rating: 4.78
  },
  {
    id: 'T-06',
    name: 'Clara Oswald',
    role: 'Vaccine Cold-Chain Specialist',
    email: 'c.oswald@emidstech.com',
    phone: '(555) 019-1229',
    status: 'On Shift',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    licenseType: 'Class D (BioTemp Expert)',
    rating: 4.95
  },
  {
    id: 'T-07',
    name: 'Robert Stark',
    role: 'Paramedic Transport Lead',
    email: 'r.stark@emidstech.com',
    phone: '(555) 016-8812',
    status: 'Emergency Standby',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    licenseType: 'Class D (Ambulance Endorsed)',
    rating: 4.99
  }
];

export const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'LOG-01',
    timestamp: '14:02:11',
    assetId: 'V-4092',
    type: 'success',
    message: 'Completed clinical delivery at Northern General Hospital',
    location: 'RT-104 Corridor Mile 42'
  },
  {
    id: 'LOG-02',
    timestamp: '13:58:45',
    assetId: 'V-9201',
    type: 'info',
    message: 'Cold chain validated. Container temperature stable at 4.2°C',
    location: 'RT-105 East Line Terminal A'
  },
  {
    id: 'LOG-03',
    timestamp: '13:45:10',
    assetId: 'V-3304',
    type: 'critical',
    message: 'Container temperature threshold breached: 9.1°C (Limit: 8.0°C)',
    location: 'RT-108 Suburb Circle'
  },
  {
    id: 'LOG-04',
    timestamp: '13:22:15',
    assetId: 'V-1184',
    type: 'warning',
    message: 'Low brake pressure warning. Service recommended',
    location: 'RT-088 Interstate Junction 5'
  },
  {
    id: 'LOG-05',
    timestamp: '13:05:00',
    assetId: 'V-5501',
    type: 'critical',
    message: 'Engine diagnostic code: E-219 (Coolant level critical)',
    location: '-- Unassigned (Maintenance Depot)'
  },
  {
    id: 'LOG-06',
    timestamp: '12:55:30',
    assetId: 'V-8820',
    type: 'success',
    message: 'Regenerative braking active, battery charged +4%',
    location: 'RT-201 Coastal Descent'
  },
  {
    id: 'LOG-07',
    timestamp: '12:30:12',
    assetId: 'V-6544',
    type: 'info',
    message: 'Blood shipment temperature lock active: 2.8°C',
    location: 'State Route 9 Northward'
  }
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-809',
    subject: 'Compressor power oscillation on RT-108 Outreach',
    category: 'Cold Chain Alert',
    priority: 'High',
    status: 'In Progress',
    description: 'Vehicle V-3304 reported transient voltage drop affecting the pharmaceutical refrigeration container. Need immediate guidance on vaccine preservation guidelines for the pediatric flu vials on board.',
    createdAt: '2026-07-10 11:22',
    messages: [
      {
        sender: 'user',
        text: 'The secondary compressor is clicking repeatedly and temp has climbed to 9.1 degrees. Can we divert or offload?',
        timestamp: '11:22'
      },
      {
        sender: 'support',
        text: 'Hello. Medical protocol mandates that for pediatric flu vaccines, if temperature exceeds 8.0 degrees for more than 45 minutes, they must be quarantined. Please proceed to the nearest cold-chain buffer depot at Mile 14. We are alerting the depot coordinator.',
        timestamp: '11:35'
      }
    ]
  },
  {
    id: 'TCK-810',
    subject: 'Pre-service dispatch check warning V-1184',
    category: 'Vehicle Mechanical',
    priority: 'Medium',
    status: 'Open',
    description: 'Pre-trip diagnostic scanned minor friction in rear passenger calipers. Driver suggests performing immediate standard inspection rather than dispatching for Metro Central route.',
    createdAt: '2026-07-10 13:02',
    messages: [
      {
        sender: 'user',
        text: 'I suggest swapping V-1184 with V-7110 for today\'s Metro route so we can inspect the brakes.',
        timestamp: '13:02'
      }
    ]
  }
];

export const INITIAL_CONFIG: SystemConfig = {
  tempLimitMin: 2.0,
  tempLimitMax: 8.0,
  fuelThresholdLow: 12.0,
  enableRealtimeSimulation: true,
  alertOnDelay: true,
  distanceUnit: 'miles',
  theme: 'light'
};
