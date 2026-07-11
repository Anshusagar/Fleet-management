import React, { useState, useEffect } from 'react';
import { Truck, AlertTriangle, ShieldCheck, Activity, Play, Pause, Calendar, ArrowRight } from 'lucide-react';
import { FleetAsset, ClinicalProject, TelemetryLog } from '../types';

interface HomeOverviewProps {
  assets: FleetAsset[];
  projects: ClinicalProject[];
  logs: TelemetryLog[];
  simulationEnabled: boolean;
  onToggleSimulation: () => void;
  onNavigateToView: (view: string) => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  assets,
  projects,
  logs,
  simulationEnabled,
  onToggleSimulation,
  onNavigateToView
}) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const d = new Date();
    setCurrentDate(d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
  }, []);

  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const highPriorityProjectsCount = projects.filter(p => p.priority === 'High' && p.status !== 'Completed').length;
  const coldChainBreaches = assets.filter(
    a => 
      a.type === 'Vaccine Carrier' && 
      a.temperature !== undefined && 
      (a.temperature < 2.0 || a.temperature > 8.0)
  ).length;

  return (
    <div className="space-y-8">
      {/* Welcome & Directive Banner */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-none relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full bg-secondary/5 skew-x-12 translate-x-16 -z-0" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-secondary text-black text-[9px] font-bold px-2 py-0.5 rounded-none font-mono uppercase tracking-widest">
                CLINICAL PORTAL ACTIVE
              </span>
              <span className="text-white/60 text-xs font-mono flex items-center gap-1 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                {currentDate}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
              WELCOME BACK, <span className="text-secondary">COORDINATOR</span>
            </h2>
            <p className="text-text-secondary text-xs font-mono max-w-2xl mt-2 leading-relaxed uppercase">
              emids HealthPortal clinical dispatch is currently monitoring <strong className="text-white">{assets.length}</strong> active biological transit assets across <strong className="text-white">{projects.length}</strong> critical regional campaigns.
            </p>
          </div>
          <button
            onClick={onToggleSimulation}
            className={`px-5 py-3 rounded-none font-mono text-xs font-black uppercase tracking-widest transition-all border shrink-0 cursor-pointer ${
              simulationEnabled 
                ? 'bg-secondary text-black border-secondary hover:bg-black hover:text-secondary' 
                : 'bg-black text-white border-white/20 hover:bg-white/5'
            }`}
          >
            {simulationEnabled ? (
              <span className="flex items-center gap-2">
                <Pause className="w-4 h-4 fill-current" />
                <span>SIMULATION: ON</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                <span>SIMULATE TELEMETRY</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mini Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Campaign Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">CLINICAL CAMPAIGNS</div>
            <div className="text-xl font-black text-white uppercase tracking-tight">{activeProjectsCount} Active</div>
            <div className="text-[10px] font-mono text-secondary uppercase tracking-wider mt-0.5">{highPriorityProjectsCount} HIGH PRIORITY</div>
          </div>
          <div className="p-2 border border-secondary/25 bg-secondary/5 text-secondary rounded-none">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Compliant Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">TRANSIT SECURE</div>
            <div className="text-xl font-black text-secondary uppercase tracking-tight">100%</div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mt-0.5">BIO-COMPLIANT</div>
          </div>
          <div className="p-2 border border-secondary/20 bg-secondary-container/10 text-secondary rounded-none">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Thermal Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-none flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">THERMAL ALERTS</div>
            <div className={`text-xl font-black uppercase tracking-tight ${coldChainBreaches > 0 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {coldChainBreaches} BREACHES
            </div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider mt-0.5">VACCINE COOLERS</div>
          </div>
          <div className={`p-2 border rounded-none ${coldChainBreaches > 0 ? 'border-red-500 bg-red-950/20 text-red-400' : 'border-white/10 text-text-secondary'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Fleet Assets */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-none flex items-center justify-between cursor-pointer hover:border-secondary transition-all"
             onClick={() => onNavigateToView('routes')}>
          <div>
            <div className="text-[10px] font-mono text-text-secondary uppercase tracking-widest mb-1">FLEET ASSETS</div>
            <div className="text-xl font-black text-white uppercase tracking-tight">{assets.length} Total</div>
            <div className="text-[10px] font-mono text-secondary hover:underline font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1">
              Manage →
            </div>
          </div>
          <div className="p-2 border border-white/10 bg-white/5 text-white rounded-none">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Schematic & Live Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Route Interactive Map */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-mono text-xs font-extrabold tracking-widest text-white uppercase">LIVE CLINICAL TRANSIT CORRIDORS</h3>
              <p className="text-[10px] font-mono text-text-secondary uppercase mt-0.5">GPS positioning telemetry coordinate grid</p>
            </div>
            <div className="flex gap-3 text-[9px] font-mono text-text-secondary uppercase">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-400 inline-block"></span> CRIT</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-secondary inline-block"></span> ACT</span>
            </div>
          </div>

          {/* Styled schematic SVG */}
          <div className="h-72 bg-black border border-white/10 rounded-none relative overflow-hidden flex-1 min-h-[280px]">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(var(--color-secondary) 1.5px, transparent 0)',
              backgroundSize: '20px 20px'
            }} />
            
            <svg className="w-full h-full p-4" viewBox="0 0 500 250">
              {/* Glowing Roads/Paths */}
              {/* Northern Corridor */}
              <path d="M 50,50 Q 250,30 450,50" fill="none" stroke="#222" strokeWidth="3" strokeLinecap="round" />
              <path d="M 50,50 Q 250,30 450,50" fill="none" stroke="var(--color-secondary)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="3,6" />
              
              {/* Metro Central */}
              <path d="M 50,120 L 450,120" fill="none" stroke="#222" strokeWidth="3" />
              <path d="M 50,120 L 450,120" fill="none" stroke="var(--color-secondary)" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4,5" />

              {/* Connected Hubs (Dots) */}
              <g>
                <circle cx="50" cy="120" r="8" fill="var(--color-secondary)" />
                <circle cx="50" cy="120" r="12" fill="none" stroke="var(--color-secondary)" strokeWidth="1" strokeOpacity="0.3" />
                <text x="50" y="140" textAnchor="middle" fontSize="7" fill="#888" fontFamily="monospace" fontWeight="bold">HQ_CENTRAL</text>
              </g>

              <g>
                <circle cx="450" cy="50" r="6" fill="#444" />
                <text x="450" y="38" textAnchor="middle" fontSize="7" fill="#888" fontFamily="monospace">EAST_DEPOT</text>
              </g>

              <g>
                <circle cx="250" cy="40" r="6" fill="#444" />
                <text x="250" y="28" textAnchor="middle" fontSize="7" fill="#888" fontFamily="monospace">NORTH_MED</text>
              </g>

              {/* Moving Vehicles (Dynamic circles reflecting real data!) */}
              {assets.map((asset, index) => {
                let x = 50;
                let y = 120;
                const seed = index * 45;

                // Position calculation based on asset route
                if (asset.route.includes('Northern')) {
                  const progress = simulationEnabled ? ((Date.now() + seed) % 15000) / 15000 : 0.4;
                  x = 50 + progress * 400;
                  y = 50 - Math.sin(progress * Math.PI) * 20;
                } else if (asset.route.includes('Metro')) {
                  const progress = simulationEnabled ? ((Date.now() + seed) % 12000) / 12000 : 0.6;
                  x = 50 + progress * 400;
                  y = 120;
                } else if (asset.route.includes('South')) {
                  const progress = simulationEnabled ? ((Date.now() + seed) % 18000) / 18000 : 0.35;
                  x = 50 + progress * 400;
                  y = 190 + Math.sin(progress * Math.PI) * 10;
                } else if (asset.route.includes('East')) {
                  const progress = simulationEnabled ? ((Date.now() + seed) % 10000) / 10000 : 0.7;
                  x = 50 + progress * 400;
                  y = 120 - progress * 70;
                } else {
                  x = 50 + (index * 25) % 100;
                  y = 145;
                }

                const isCritical = asset.status.startsWith('Critical');
                const isMaint = asset.status === 'Maintenance Due';

                return (
                  <g key={asset.id}>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r={isCritical ? "6" : "4"} 
                      fill={isCritical ? "#f87171" : isMaint ? "#fbbf24" : "var(--color-secondary)"} 
                      className={isCritical ? "animate-pulse" : ""}
                    />
                    <text x={x} y={y - 8} textAnchor="middle" fontSize="6" fill="#fff" fontFamily="monospace" fontWeight="bold">
                      {asset.id}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Custom UI overlay to guide map usage */}
            <div className="absolute bottom-3 right-3 bg-black border border-white/20 px-3 py-1.5 rounded-none text-[9px] font-mono shadow-none space-y-0.5">
              <div className="font-bold text-secondary uppercase">GPS COORDINATOR PANEL</div>
              <div className="text-white/40">REAL-TIME TELEMETRY STREAMING</div>
            </div>
          </div>
        </div>

        {/* Live Telemetric Logs Stream */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-5 flex flex-col h-[380px] lg:h-auto">
          <div className="mb-4">
            <h3 className="font-mono text-xs font-extrabold tracking-widest text-white uppercase">LIVE LOG DIAGNOSTICS</h3>
            <p className="text-[10px] font-mono text-text-secondary uppercase mt-0.5">Telematic incident & corridor message stream</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-secondary text-center p-6 italic uppercase">
                Awaiting telemetry stream... Toggle simulator above.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 bg-black border border-white/5 space-y-1 hover:border-white/20 transition-all">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-extrabold text-white tracking-wide">{log.assetId}</span>
                    <span className="text-white/40">{log.timestamp}</span>
                  </div>
                  <div className={`text-xs uppercase tracking-wide leading-tight ${
                    log.type === 'critical' ? 'text-red-400 font-extrabold' : log.type === 'warning' ? 'text-amber-400' : 'text-white'
                  }`}>
                    {log.message}
                  </div>
                  <div className="text-[9px] text-white/50 flex justify-between uppercase">
                    <span>📍 {log.location}</span>
                    <span className="text-secondary font-bold">[{log.type}]</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 pt-3 mt-3 flex justify-between items-center text-[9px] text-text-secondary font-mono uppercase">
            <span>Buffer: 100 Entries</span>
            <span className="text-secondary font-bold animate-pulse">● FEED ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
