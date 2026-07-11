import { useState, useEffect } from 'react';
import { 
  Home, FolderOpen, Map, Users, Settings, 
  HelpCircle, LogOut, Search, Bell, ChevronRight, 
  Plus, SlidersHorizontal, ShieldAlert 
} from 'lucide-react';

import { 
  FleetAsset, ClinicalProject, TeamMember, 
  TelemetryLog, SupportTicket, SystemConfig 
} from './types';

import { 
  INITIAL_ASSETS, INITIAL_PROJECTS, INITIAL_TEAM, 
  INITIAL_LOGS, INITIAL_TICKETS, INITIAL_CONFIG 
} from './mockData';

import { DashboardOverview } from './components/DashboardOverview';
import { HomeOverview } from './components/HomeOverview';
import { ProjectsExplorer } from './components/ProjectsExplorer';
import { TeamDirectory } from './components/TeamDirectory';
import { SupportDesk } from './components/SupportDesk';
import { SettingsPanel } from './components/SettingsPanel';

import { 
  RegisterAssetModal, CreateProjectModal, 
  AssetDetailsModal, ExportReportModal 
} from './components/Modals';

export default function App() {
  // Navigation State - 'routes' (Fleet Management) is default to match mockup instantly
  const [activeTab, setActiveTab] = useState<string>('routes');

  // Core Applet States
  const [assets, setAssets] = useState<FleetAsset[]>(() => {
    const saved = localStorage.getItem('emids_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [projects, setProjects] = useState<ClinicalProject[]>(() => {
    const saved = localStorage.getItem('emids_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('emids_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });

  const [logs, setLogs] = useState<TelemetryLog[]>(() => {
    const saved = localStorage.getItem('emids_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('emids_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('emids_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  // Global UI search (flows into active view if typing)
  const [globalSearch, setGlobalSearch] = useState('');

  // Modal Triggers
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<FleetAsset | null>(null);
  const [isCreateProjOpen, setIsCreateProjOpen] = useState(false);
  const [activeDetailsAsset, setActiveDetailsAsset] = useState<FleetAsset | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('emids_assets', JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem('emids_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('emids_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('emids_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('emids_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('emids_config', JSON.stringify(config));
  }, [config]);

  // Real-time clinical telemetry simulation loop
  useEffect(() => {
    if (!config.enableRealtimeSimulation) return;

    const interval = setInterval(() => {
      // 1. Fluctuate asset diagnostics
      setAssets((prevAssets) =>
        prevAssets.map((asset) => {
          if (asset.status.startsWith('Critical')) return asset; // critical requires manual reset
          
          let speedChange = (Math.random() - 0.5) * 4;
          let tempChange = (Math.random() - 0.5) * 0.3;

          const currentSpeed = asset.telematics?.speed ?? 0;
          let newSpeed = currentSpeed > 0 ? Math.max(15, Math.min(75, currentSpeed + speedChange)) : 0;
          
          // Randomly park or start idle assets on route
          if (Math.random() < 0.05 && asset.route !== '-- Unassigned --') {
            newSpeed = newSpeed === 0 ? 45 : 0;
          }

          let newTemp = asset.temperature;
          if (newTemp !== undefined) {
            newTemp = Number((newTemp + tempChange).toFixed(1));
          }

          return {
            ...asset,
            temperature: newTemp,
            telematics: asset.telematics
              ? {
                  ...asset.telematics,
                  speed: Math.round(newSpeed),
                  lat: asset.telematics.lat + (Math.random() - 0.5) * 0.001,
                  lng: asset.telematics.lng + (Math.random() - 0.5) * 0.001,
                  batteryLevel: asset.telematics.batteryLevel 
                    ? Math.max(10, Math.min(100, asset.telematics.batteryLevel - (newSpeed > 0 ? 1 : 0)))
                    : undefined
                }
              : undefined
          };
        })
      );

      // 2. Spawn occasional telematic logs or temperature alarms
      if (Math.random() < 0.15) {
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const isColdChain = randomAsset.type === 'Vaccine Carrier' || randomAsset.type === 'Refrigerated';
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        
        let logMessage = '';
        let logType: 'info' | 'success' | 'warning' | 'critical' = 'info';

        if (isColdChain && randomAsset.temperature !== undefined) {
          const temp = randomAsset.temperature;
          const isBreached = randomAsset.type === 'Vaccine Carrier' 
            ? (temp < config.tempLimitMin || temp > config.tempLimitMax)
            : temp > -15.0;

          if (isBreached) {
            logMessage = `Container temp warning on ${randomAsset.id}: ${temp}°C exceeds clinical bounds`;
            logType = 'critical';
          } else {
            logMessage = `Cold chain verified on ${randomAsset.id}: ${temp}°C stable`;
            logType = 'success';
          }
        } else {
          const speeds = randomAsset.telematics?.speed ?? 0;
          logMessage = speeds > 0 
            ? `${randomAsset.id} speed adjusted to ${speeds} MPH on corridor` 
            : `${randomAsset.id} stationary at clinical depot`;
          logType = 'info';
        }

        const newLog: TelemetryLog = {
          id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp,
          assetId: randomAsset.id,
          type: logType,
          message: logMessage,
          location: randomAsset.route !== '-- Unassigned --' ? randomAsset.route.split(' ')[0] : 'Maintenance Depot'
        };

        setLogs(prev => [newLog, ...prev.slice(0, 99)]);
      }

    }, 4000);

    return () => clearInterval(interval);
  }, [config.enableRealtimeSimulation, assets, config.tempLimitMin, config.tempLimitMax]);

  // Asset CRUD & Allocate actions
  const handleSaveAsset = (assetData: Omit<FleetAsset, 'id'> & { id?: string }) => {
    const assetId = assetData.id!;
    const exists = assets.some(a => a.id === assetId);

    if (exists) {
      setAssets(prev => prev.map(a => a.id === assetId ? { ...a, ...assetData } : a));
    } else {
      const newAsset: FleetAsset = {
        id: assetId,
        ...assetData
      };
      setAssets(prev => [newAsset, ...prev]);
      
      // Append a system log about new asset
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      const newLog: TelemetryLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp,
        assetId,
        type: 'success',
        message: `Asset registered and calibrated in Clinical Hub registry`,
        location: 'Central Depot 1'
      };
      setLogs(prev => [newLog, ...prev]);
    }
    setEditingAsset(null);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    // Remove from projects
    setProjects(prev => prev.map(p => ({
      ...p,
      assignedAssets: p.assignedAssets.filter(aid => aid !== id)
    })));
  };

  const handleClearAlerts = (id: string) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, status: 'Active', notes: 'Status restored to optimal. Onboard core diagnostic OK.' } : a));
    
    // Add success log
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog: TelemetryLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp,
      assetId: id,
      type: 'success',
      message: `Diagnostic code cleared. Telemetry recertified.`,
      location: 'Central Diagnostic Lab'
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Projects Campaign actions
  const handleSaveProject = (projData: Omit<ClinicalProject, 'id' | 'progress'>) => {
    const newProj: ClinicalProject = {
      id: `PROJ-${Math.floor(100 + Math.random() * 900)}`,
      progress: 0,
      ...projData
    };
    setProjects(prev => [...prev, newProj]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const handleAllocateAsset = (projectId: string, assetId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          assignedAssets: [...p.assignedAssets, assetId],
          progress: Math.min(100, p.progress + 15) // increment progress slightly
        };
      }
      return p;
    }));

    // Update asset corridor based on project
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setAssets(prev => prev.map(a => {
        if (a.id === assetId) {
          return {
            ...a,
            route: `RT-${proj.id.split('-')[1]} (${proj.name.slice(0, 15)}...)`
          };
        }
        return a;
      }));
    }
  };

  // Team Directory action
  const handleAddTeamMember = (memberData: Omit<TeamMember, 'id' | 'rating' | 'avatar'>) => {
    const newMember: TeamMember = {
      id: `T-${Math.floor(10 + Math.random() * 90)}`,
      rating: 4.8 + Math.random() * 0.2,
      avatar: `https://images.unsplash.com/photo-${[
        '1534528741775-53994a69daeb',
        '1544005313-94ddf0286df2',
        '1507003211169-0a1dd7228f2d',
        '1494790108377-be9c29b29330'
      ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&q=80&w=120`,
      ...memberData
    };
    setTeam(prev => [...prev, newMember]);
  };

  // Support Ticketing Chat actions
  const handleAddTicket = (ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'messages' | 'status'>) => {
    const newTicket: SupportTicket = {
      id: `TCK-${Math.floor(800 + Math.random() * 199)}`,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      messages: [
        {
          sender: 'user',
          text: ticketData.description,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ],
      ...ticketData
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const handleSendChatMessage = (ticketId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    // Append user message
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedMessages = [...t.messages, { sender: 'user' as const, text, timestamp }];
          
          return {
            ...t,
            status: 'In Progress' as const,
            messages: updatedMessages
          };
        }
        return t;
      })
    );

    // Auto simulated AI/Dispatch response in 1s
    setTimeout(() => {
      let responseText = "emids Clinical Dispatch has logged your update. We are validating bio-logistics telemetry coordinates.";
      
      const lowerText = text.toLowerCase();
      if (lowerText.includes('temp') || lowerText.includes('temperature') || lowerText.includes('cold')) {
        responseText = "Cold-chain regulation alert: Vaccine storage temperature must not exceed 8.0°C. If compressor failure is confirmed, divert carrier to nearest cold-storage depot immediately.";
      } else if (lowerText.includes('brake') || lowerText.includes('mechanical') || lowerText.includes('engine')) {
        responseText = "Mechanical alert checklist: Instruct driver to pull over safely. We are allocating an EV courier or back-up transport vehicle to offload sensitive medical cargo.";
      } else if (lowerText.includes('route') || lowerText.includes('delay') || lowerText.includes('corridor')) {
        responseText = "Route obstruction detected: Rerouting is permitted via auxiliary arterial pathways. Please report dynamic ETA upon detour entry.";
      }

      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === ticketId) {
            return {
              ...t,
              messages: [
                ...t.messages,
                { sender: 'support' as const, text: responseText, timestamp }
              ]
            };
          }
          return t;
        })
      );
    }, 1200);
  };

  // Factory defaults restorer
  const handleRestoreDefaults = () => {
    localStorage.removeItem('emids_assets');
    localStorage.removeItem('emids_projects');
    localStorage.removeItem('emids_team');
    localStorage.removeItem('emids_logs');
    localStorage.removeItem('emids_tickets');
    localStorage.removeItem('emids_config');

    setAssets(INITIAL_ASSETS);
    setProjects(INITIAL_PROJECTS);
    setTeam(INITIAL_TEAM);
    setLogs(INITIAL_LOGS);
    setTickets(INITIAL_TICKETS);
    setConfig(INITIAL_CONFIG);
    setActiveTab('routes');
  };

  // Dynamic values for general topbar counters
  const criticalAlertCount = assets.filter(a => a.status.startsWith('Critical')).length;

  return (
    <div className="bg-background text-text-primary antialiased min-h-screen flex flex-col md:flex-row font-sans selection:bg-secondary selection:text-black">
      
      {/* TopNavBar (Mobile Only) */}
      <header className="md:hidden bg-[#0a0a0a] border-b border-white/10 w-full h-16 flex justify-between items-center px-4 sticky top-0 z-50">
        <div className="font-mono text-sm font-extrabold text-white tracking-widest uppercase">
          EMIDS <span className="text-secondary font-black">HP™</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveTab('support');
              setGlobalSearch('');
            }}
            className="p-1.5 text-text-secondary hover:text-secondary transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setActiveTab('routes')}
              className="p-1.5 text-text-secondary hover:text-secondary relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {criticalAlertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error animate-ping" />
              )}
            </button>
          </div>
          <img 
            alt="User Profile avatar" 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120"
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-none border border-white/10 object-cover"
          />
        </div>
      </header>

      {/* SideNavBar (Desktop Only) */}
      <nav className="hidden md:flex flex-col bg-[#0a0a0a] h-screen w-64 fixed left-0 top-0 py-6 z-40 border-r border-white/10 justify-between rounded-none">
        <div>
          {/* Logo brand */}
          <div className="px-6 mb-8 mt-2">
            <div className="font-mono text-base font-black text-white tracking-widest uppercase leading-tight">EMIDS TECH™</div>
            <div className="text-[9px] font-mono text-secondary uppercase tracking-widest font-extrabold mt-1">HEALTHCARE LOGISTICS</div>
          </div>

          {/* Create project quick action */}
          <div className="px-4 mb-6">
            <button 
              onClick={() => setIsCreateProjOpen(true)}
              className="w-full bg-secondary text-on-secondary font-mono text-xs font-extrabold py-3 px-4 rounded-none flex items-center justify-center gap-2 border border-secondary hover:bg-black hover:text-secondary transition-all shadow-none uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Create Project
            </button>
          </div>

          {/* Navigation link group */}
          <div className="flex flex-col gap-1 px-3">
            <button
              onClick={() => { setActiveTab('home'); setGlobalSearch(''); }}
              className={`px-4 py-3 flex items-center gap-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest ${
                activeTab === 'home'
                  ? 'bg-secondary-container/10 text-secondary border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4 text-secondary shrink-0" />
              <span>Home</span>
            </button>

            <button
              onClick={() => { setActiveTab('projects'); setGlobalSearch(''); }}
              className={`px-4 py-3 flex items-center gap-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest ${
                activeTab === 'projects'
                  ? 'bg-secondary-container/10 text-secondary border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-secondary shrink-0" />
              <span>Projects</span>
            </button>

            <button
              onClick={() => { setActiveTab('routes'); setGlobalSearch(''); }}
              className={`px-4 py-3 flex items-center gap-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest ${
                activeTab === 'routes'
                  ? 'bg-secondary-container/10 text-secondary border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4 text-secondary shrink-0" />
              <span>Routes</span>
            </button>

            <button
              onClick={() => { setActiveTab('team'); setGlobalSearch(''); }}
              className={`px-4 py-3 flex items-center gap-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest ${
                activeTab === 'team'
                  ? 'bg-secondary-container/10 text-secondary border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-secondary shrink-0" />
              <span>Team</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setGlobalSearch(''); }}
              className={`px-4 py-3 flex items-center gap-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest ${
                activeTab === 'settings'
                  ? 'bg-secondary-container/10 text-secondary border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 text-secondary shrink-0" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Support & Session footer */}
        <div className="px-3 flex flex-col gap-1 border-t border-white/5 pt-4">
          <button
            onClick={() => { setActiveTab('support'); setGlobalSearch(''); }}
            className={`px-4 py-2.5 flex items-center gap-3 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest ${
              activeTab === 'support'
                ? 'bg-secondary-container/10 text-secondary border-r-2 border-secondary'
                : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
            <span>Support</span>
          </button>

          <button
            onClick={handleRestoreDefaults}
            className="px-4 py-2.5 flex items-center gap-3 text-on-surface-variant hover:bg-white/5 rounded-none transition-all font-mono text-xs font-bold uppercase tracking-widest text-left w-full cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400 shrink-0" />
            <span>Reset Demo</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64 flex flex-col min-h-screen pb-16 md:pb-0">
        
        {/* Desktop Top Breadcrumbs Bar */}
        <div className="hidden md:flex items-center justify-between px-10 py-5 border-b border-white/10 bg-[#050505]">
          <div className="flex items-center gap-2 text-text-secondary font-mono text-xs tracking-widest uppercase">
            <span className="text-secondary">{activeTab}</span>
            <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
            <span className="text-white font-extrabold">
              {activeTab === 'routes' ? 'FLEET MANAGEMENT' : activeTab === 'home' ? 'DIAGNOSTICS OVERVIEW' : 'OPERATIONAL WORKSPACE'}
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Quick telemetry bell */}
            {criticalAlertCount > 0 && (
              <div 
                onClick={() => {
                  setActiveTab('routes');
                  setGlobalSearch('');
                }}
                className="py-1.5 px-3 bg-error-container/20 text-error border border-error/40 rounded-none flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest cursor-pointer animate-pulse"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-error" />
                <span>{criticalAlertCount} Bio-Chain Alerts</span>
              </div>
            )}

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 border-l border-white/10 pl-5">
              <img 
                alt="User Profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABC06C92r8lKwdgOOcu1kHZ6ZEwImuqIO2s-1TCaSo8KMmsAUHi6NFdo8nDliRWAoCDNlnPmOZjFuTcur-PoUk5n3Sv6gZK3HTNu3MYz6DdgwtY0IaNfM0psx96Tqayx-Y7uweKhcnagxbCCrKuJdZ-BpLVByjcpHy8KmTUB1ZoZwU-rScBy56SD1Zz6l29q6HgaBD3mSz_IPEa7JF9A8zAdnl8nm3ts0XN5tS6F4Bc32TgojKFZiv0OQA8UNk2PrGWSH_I_ow-Oc"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-none border border-white/20 object-cover"
              />
              <div className="text-left font-mono">
                <div className="text-xs font-black text-white tracking-wider uppercase">Yuvraaj Anshu</div>
                <div className="text-[9px] text-text-secondary font-bold tracking-wider uppercase">Clinical Ops Director</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Content Window */}
        <div className="p-4 md:p-10 max-w-7xl mx-auto w-full flex-1">
          {activeTab === 'routes' && (
            <DashboardOverview
              assets={assets}
              onOpenRegisterModal={() => {
                setEditingAsset(null);
                setIsRegisterOpen(true);
              }}
              onOpenEditModal={(asset) => {
                setEditingAsset(asset);
                setIsRegisterOpen(true);
              }}
              onDeleteAsset={handleDeleteAsset}
              onOpenDetailsModal={(asset) => {
                setActiveDetailsAsset(asset);
              }}
              onClearAlerts={handleClearAlerts}
              onOpenExportModal={() => setIsExportOpen(true)}
            />
          )}

          {activeTab === 'home' && (
            <HomeOverview
              assets={assets}
              projects={projects}
              logs={logs}
              simulationEnabled={config.enableRealtimeSimulation}
              onToggleSimulation={() => setConfig(prev => ({ ...prev, enableRealtimeSimulation: !prev.enableRealtimeSimulation }))}
              onNavigateToView={(view) => setActiveTab(view)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsExplorer
              projects={projects}
              assets={assets}
              onOpenCreateModal={() => setIsCreateProjOpen(true)}
              onDeleteProject={handleDeleteProject}
              onAllocateAsset={handleAllocateAsset}
            />
          )}

          {activeTab === 'team' && (
            <TeamDirectory
              team={team}
              assets={assets}
              onAddTeamMember={handleAddTeamMember}
            />
          )}

          {activeTab === 'support' && (
            <SupportDesk
              tickets={tickets}
              onSubmitTicket={handleAddTicket}
              onSendChatMessage={handleSendChatMessage}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              config={config}
              onUpdateConfig={(updates) => setConfig(prev => ({ ...prev, ...updates }))}
              onRestoreDefaults={handleRestoreDefaults}
            />
          )}
        </div>

        {/* Global Footer */}
        <footer className="w-full bg-surface-gray border-t border-surface-variant py-6 px-4 md:px-10 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <div className="font-semibold text-deep-navy">
              © 2026 emids Healthcare Technology. All rights reserved.
            </div>
            <div className="flex gap-4 text-text-secondary font-medium">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Compliance Guidelines</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">HIPAA Secure Portal</span>
            </div>
          </div>
        </footer>

        {/* Bottom Nav Bar (Mobile Only) */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-surface-variant flex justify-between items-center px-6 h-16 z-50 shadow-lg">
          <button 
            onClick={() => { setActiveTab('home'); setGlobalSearch(''); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-secondary font-bold' : 'text-text-secondary'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </button>
          <button 
            onClick={() => { setActiveTab('routes'); setGlobalSearch(''); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'routes' ? 'text-secondary font-bold' : 'text-text-secondary'}`}
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px]">Routes</span>
          </button>
          <button 
            onClick={() => { setActiveTab('team'); setGlobalSearch(''); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'team' ? 'text-secondary font-bold' : 'text-text-secondary'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">Team</span>
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setGlobalSearch(''); }}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'settings' ? 'text-secondary font-bold' : 'text-text-secondary'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px]">Settings</span>
          </button>
        </nav>
      </main>

      {/* Shared Modals */}
      <RegisterAssetModal
        isOpen={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        editingAsset={editingAsset}
      />

      <CreateProjectModal
        isOpen={isCreateProjOpen}
        onClose={() => setIsCreateProjOpen(false)}
        onSave={handleSaveProject}
      />

      <AssetDetailsModal
        isOpen={activeDetailsAsset !== null}
        onClose={() => setActiveDetailsAsset(null)}
        asset={activeDetailsAsset}
        onClearAlerts={handleClearAlerts}
      />

      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        assets={assets}
      />

    </div>
  );
}
