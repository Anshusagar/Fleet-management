import React from 'react';
import { Thermometer, Database, Eye, BellRing, RefreshCw } from 'lucide-react';
import { SystemConfig } from '../types';

interface SettingsPanelProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: Partial<SystemConfig>) => void;
  onRestoreDefaults: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  config,
  onUpdateConfig,
  onRestoreDefaults
}) => {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="text-[10px] font-mono font-black text-secondary uppercase tracking-[0.3em] mb-2">SYSTEM PARAMETERS</div>
        <h2 className="font-sans text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
          PORTAL <span className="text-secondary">CUSTOMIZATION</span>
        </h2>
        <p className="font-mono text-xs text-text-secondary mt-2 tracking-wide uppercase">
          GOVERN CLINICAL BOUNDARIES, COLD-CHAIN ALERT THRESHOLDS, AND TELEMATIC FLOW STATE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cold-Chain Safeguard Thresholds */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-3">
            <Thermometer className="w-5 h-5 text-secondary" />
            <h3 className="font-sans text-sm font-black text-white uppercase tracking-wider">BIOLOGICAL SAFEGUARD LIMITS</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Vaccine Floor Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={config.tempLimitMin}
                onChange={(e) => onUpdateConfig({ tempLimitMin: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white"
              />
              <span className="text-[9px] text-text-secondary mt-1 block uppercase">Standard target: 2.0°C</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Vaccine Ceiling Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                value={config.tempLimitMax}
                onChange={(e) => onUpdateConfig({ tempLimitMax: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white"
              />
              <span className="text-[9px] text-text-secondary mt-1 block uppercase">Standard target: 8.0°C</span>
            </div>
          </div>

          <div className="p-3 bg-black border border-white/5 rounded-none text-[10px] font-mono text-text-secondary uppercase leading-relaxed">
            📌 <strong>Regulatory Note:</strong> safe pediatric immunizations must be kept in the 2.0°C to 8.0°C cold chain buffer to prevent structural protein denaturation.
          </div>
        </div>

        {/* Telematic & Simulation parameters */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-3">
            <Eye className="w-5 h-5 text-secondary" />
            <h3 className="font-sans text-sm font-black text-white uppercase tracking-wider">DYNAMIC TELEMATICS CONTROL</h3>
          </div>

          <div className="flex items-center justify-between p-3 bg-black border border-white/5 rounded-none font-mono">
            <div>
              <div className="text-[11px] font-black text-white uppercase tracking-wide">Active GPS Motion Loops</div>
              <div className="text-[9px] text-text-secondary uppercase mt-0.5">Fluctuate speeds & thermals dynamically</div>
            </div>
            <button
              onClick={() => onUpdateConfig({ enableRealtimeSimulation: !config.enableRealtimeSimulation })}
              className={`w-12 h-6 rounded-none p-1 transition-all border cursor-pointer ${config.enableRealtimeSimulation ? 'bg-secondary border-secondary' : 'bg-neutral-800 border-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-none transition-all ${config.enableRealtimeSimulation ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Distance Metric</label>
              <select
                value={config.distanceUnit}
                onChange={(e) => onUpdateConfig({ distanceUnit: e.target.value as any })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-text-secondary cursor-pointer uppercase"
              >
                <option value="miles" className="bg-black">Imperial (Miles / MPG)</option>
                <option value="km" className="bg-black">Metric (KM / L/100km)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Low-Fuel Trigger (MPG)</label>
              <input
                type="number"
                value={config.fuelThresholdLow}
                onChange={(e) => onUpdateConfig({ fuelThresholdLow: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Alerts and Security Configuration */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-3">
            <BellRing className="w-5 h-5 text-secondary" />
            <h3 className="font-sans text-sm font-black text-white uppercase tracking-wider">INCIDENT ALERTS</h3>
          </div>

          <div className="flex items-center justify-between p-3 bg-black border border-white/5 rounded-none font-mono">
            <div>
              <div className="text-[11px] font-black text-white uppercase tracking-wide">Transit Corridor Delays</div>
              <div className="text-[9px] text-text-secondary uppercase mt-0.5">Alert instantly if route deviation exceeds 15m</div>
            </div>
            <button
              onClick={() => onUpdateConfig({ alertOnDelay: !config.alertOnDelay })}
              className={`w-12 h-6 rounded-none p-1 transition-all border cursor-pointer ${config.alertOnDelay ? 'bg-secondary border-secondary' : 'bg-neutral-800 border-white/10'}`}
            >
              <div className={`w-4 h-4 rounded-none transition-all ${config.alertOnDelay ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'}`} />
            </button>
          </div>

          <div className="text-[10px] font-mono text-text-secondary uppercase tracking-wider leading-relaxed">
            * Warning alerts sync directly with the top telemetry bell icon and dispatch coordinators.
          </div>
        </div>

        {/* Data Persistence and System Restore */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-3">
              <Database className="w-5 h-5 text-secondary" />
              <h3 className="font-sans text-sm font-black text-white uppercase tracking-wider">STORAGE & PERSISTENCE</h3>
            </div>
            <p className="text-[10px] font-mono text-text-secondary uppercase leading-relaxed">
              All fleet configurations, active biological thermals, and logged incidents are stored in local secure cache. Clear or reset state to default clinical test arrays.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to restore all fleet metrics to standard clinical mock values? All current edits will be overwritten.')) {
                onRestoreDefaults();
              }
            }}
            className="w-full bg-secondary text-black hover:bg-black hover:text-secondary font-mono text-xs font-black py-3 px-4 rounded-none border border-secondary transition-all uppercase tracking-widest cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 inline-block mr-2 shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
            Restore Factory Telematics Dataset
          </button>
        </div>
      </div>
    </div>
  );
};
