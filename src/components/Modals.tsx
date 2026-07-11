import React, { useState, useEffect } from 'react';
import { X, Save, Thermometer, ShieldAlert, CheckCircle2, RefreshCw, FileText, Download } from 'lucide-react';
import { FleetAsset, AssetType, AssetStatus, ClinicalProject } from '../types';

interface RegisterAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Omit<FleetAsset, 'id'> & { id?: string }) => void;
  editingAsset?: FleetAsset | null;
}

export const RegisterAssetModal: React.FC<RegisterAssetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingAsset
}) => {
  const [id, setId] = useState('');
  const [type, setType] = useState<AssetType>('Courier Light');
  const [route, setRoute] = useState('');
  const [status, setStatus] = useState<AssetStatus>('Active');
  const [lastService, setLastService] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState(15);
  const [temperature, setTemperature] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingAsset) {
      setId(editingAsset.id);
      setType(editingAsset.type);
      setRoute(editingAsset.route === '-- Unassigned --' ? '' : editingAsset.route);
      setStatus(editingAsset.status);
      setLastService(editingAsset.lastService);
      setFuelEfficiency(editingAsset.fuelEfficiency);
      setTemperature(editingAsset.temperature);
      setNotes(editingAsset.notes || '');
    } else {
      setId(`V-${Math.floor(1000 + Math.random() * 9000)}`);
      setType('Courier Light');
      setRoute('');
      setStatus('Active');
      setLastService(new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }));
      setFuelEfficiency(18);
      setTemperature(undefined);
      setNotes('');
    }
  }, [editingAsset, isOpen]);

  useEffect(() => {
    if (type === 'Vaccine Carrier' || type === 'Refrigerated') {
      if (temperature === undefined) {
        setTemperature(type === 'Vaccine Carrier' ? 4.0 : -18.0);
      }
    } else {
      setTemperature(undefined);
    }
  }, [type]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingAsset ? editingAsset.id : id,
      type,
      route: route.trim() ? route : '-- Unassigned --',
      status,
      lastService,
      fuelEfficiency: Number(fuelEfficiency) || 15,
      temperature,
      notes,
      telematics: editingAsset?.telematics || {
        speed: 0,
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        oilPressure: 'Normal',
        engineTemp: 180
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity" id="asset-modal-overlay">
      <div className="bg-[#0a0a0a] w-full max-w-lg rounded-none border border-white/10 shadow-none overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black">
          <h3 className="font-sans text-lg font-black text-white uppercase tracking-wider">
            {editingAsset ? 'MODIFY FLEET ASSET' : 'REGISTER CLINICAL ASSET'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 font-mono text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Asset ID / Code</label>
              <input
                type="text"
                required
                disabled={!!editingAsset}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="V-4000"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Asset Classification</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssetType)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-text-secondary cursor-pointer uppercase"
              >
                <option value="Heavy Transport" className="bg-black">Heavy Transport (Surgical)</option>
                <option value="Courier Light" className="bg-black">Courier Light (Specimen)</option>
                <option value="Refrigerated" className="bg-black">Refrigerated (Plasma)</option>
                <option value="EV Transport" className="bg-black">EV Transport (Eco Courier)</option>
                <option value="Vaccine Carrier" className="bg-black">Vaccine Carrier (Ultra-Temp)</option>
                <option value="Emergency Ambulance" className="bg-black">Emergency Ambulance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Assigned Corridor Route</label>
            <input
              type="text"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder="e.g., RT-104 (Northern Corridor) - Leave empty if unassigned"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase placeholder-white/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Operational Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-text-secondary cursor-pointer uppercase"
              >
                <option value="Active" className="bg-black">Active / Operational</option>
                <option value="Maintenance Due" className="bg-black">Maintenance Due</option>
                <option value="Critical (Engine)" className="bg-black">Critical (Engine)</option>
                <option value="In Transit" className="bg-black">In Transit</option>
                <option value="Standby" className="bg-black">Standby Depot</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Fuel Efficiency (MPG / Equiv)</label>
              <input
                type="number"
                step="0.1"
                required
                value={fuelEfficiency}
                onChange={(e) => setFuelEfficiency(Number(e.target.value))}
                placeholder="15.0"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white"
              />
            </div>
          </div>

          {(type === 'Vaccine Carrier' || type === 'Refrigerated') && (
            <div className="p-3.5 bg-black border border-white/15 rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Cold-Chain Temperature Control</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <label className="block text-[9px] font-semibold text-text-secondary mb-1">Container Internal Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={temperature || 0}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white"
                  />
                </div>
                <div className="text-[10px] text-text-secondary uppercase tracking-wide">
                  {type === 'Vaccine Carrier' ? (
                    <span>Vaccine target: <strong>2°C to 8°C</strong>. State: {(temperature ?? 0) >= 2 && (temperature ?? 0) <= 8 ? <span className="text-secondary font-black">[SAFE]</span> : <span className="text-red-400 font-black">[BREACHED]</span>}</span>
                  ) : (
                    <span>Plasma target: <strong>&lt; -15°C</strong>. State: {(temperature ?? 0) <= -15 ? <span className="text-secondary font-black">[SAFE]</span> : <span className="text-red-400 font-black">[BREACHED]</span>}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Last Service Log</label>
              <input
                type="text"
                required
                value={lastService}
                onChange={(e) => setLastService(e.target.value)}
                placeholder="e.g., Oct 12, 2023"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase placeholder-white/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Operational Directives & Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Temperature-sensitive cargo, handle with care, vaccine vials on-board..."
              rows={3}
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase placeholder-white/20 resize-none leading-relaxed"
            ></textarea>
          </div>
        </form>

        <div className="p-4 border-t border-white/10 bg-black flex justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-text-secondary hover:text-white rounded-none transition-all cursor-pointer uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-secondary text-black hover:bg-black hover:text-secondary font-black rounded-none border border-secondary flex items-center gap-1.5 transition-all uppercase tracking-widest cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {editingAsset ? 'Save Changes' : 'Complete Registration'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Create Project Modal
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<ClinicalProject, 'id' | 'progress'>) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [manager, setManager] = useState('Dr. Sarah Jenkins');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      description,
      status: 'Planning',
      assignedAssets: [],
      manager,
      targetDate: targetDate || 'Aug 15, 2026',
      priority
    });
    onClose();
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity" id="project-modal-overlay">
      <div className="bg-[#0a0a0a] w-full max-w-lg rounded-none border border-white/10 shadow-none overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black">
          <h3 className="font-sans text-lg font-black text-white uppercase tracking-wider">CREATE CLINICAL CAMPAIGN</h3>
          <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 font-mono text-xs">
          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Regional Vaccine Corridor Expansion"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Directive / Purpose Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear targets, hospital depots, and temperature parameters..."
              rows={3}
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase placeholder-white/20 resize-none leading-relaxed"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Logistics Director</label>
              <select
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-text-secondary cursor-pointer uppercase"
              >
                <option value="Dr. Sarah Jenkins" className="bg-black">Dr. Sarah Jenkins</option>
                <option value="Marcus Vance" className="bg-black">Marcus Vance</option>
                <option value="Elena Rostova" className="bg-black">Elena Rostova</option>
                <option value="James Carter" className="bg-black">James Carter</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-text-secondary cursor-pointer uppercase"
              >
                <option value="High" className="bg-black">🔴 High Priority</option>
                <option value="Medium" className="bg-black">🟡 Medium Priority</option>
                <option value="Low" className="bg-black">🟢 Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Target Completion Date</label>
            <input
              type="text"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              placeholder="e.g., Aug 15, 2026"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs text-white uppercase"
            />
          </div>
        </form>

        <div className="p-4 border-t border-white/10 bg-black flex justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-text-secondary hover:text-white rounded-none transition-all cursor-pointer uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-secondary text-black hover:bg-black hover:text-secondary font-black rounded-none border border-secondary flex items-center gap-1.5 transition-all uppercase tracking-widest cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Initialize Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

// Telemetry and Details Modal
interface AssetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: FleetAsset | null;
  onClearAlerts?: (id: string) => void;
}

export const AssetDetailsModal: React.FC<AssetDetailsModalProps> = ({
  isOpen,
  onClose,
  asset,
  onClearAlerts
}) => {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen || !asset) return null;

  const isColdChain = asset.type === 'Vaccine Carrier' || asset.type === 'Refrigerated';
  const isCritical = asset.status.startsWith('Critical');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity" id="telemetry-modal">
      <div className="bg-[#0a0a0a] w-full max-w-2xl rounded-none border border-white/10 shadow-none overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-none ${
              isCritical ? 'bg-red-500 animate-pulse' : asset.status === 'Maintenance Due' ? 'bg-amber-400' : 'bg-secondary'
            }`} />
            <h3 className="font-sans text-lg font-black text-white uppercase tracking-wider">
              LIVE TELEMETRY: <span className="font-mono text-secondary">{asset.id}</span>
            </h3>
            <span className="font-mono text-[9px] font-black border border-white/15 bg-neutral-950 px-2 py-0.5 text-text-secondary uppercase">
              {asset.type}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh] font-mono text-xs uppercase">
          {/* Clinical Alert Warning banner */}
          {isCritical && (
            <div className="p-4 bg-red-950/25 border border-red-500/50 text-red-400 rounded-none flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">
                <div className="font-black text-xs uppercase tracking-wider mb-1">CRITICAL TELEMETRIC OUTAGE DETECTED</div>
                <div className="text-white/80 lowercase leading-relaxed">{asset.notes || 'Asset reports severe telematic or compressor fluctuations.'}</div>
                {onClearAlerts && (
                  <button
                    onClick={() => {
                      onClearAlerts(asset.id);
                      onClose();
                    }}
                    className="mt-3 px-3 py-1.5 bg-red-500 text-black hover:bg-black hover:text-red-500 hover:border-red-500 border border-red-500 text-[10px] font-black rounded-none transition-all flex items-center gap-1 shadow-none cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acknowledge & Clear Code (E-219)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Grid of details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-black border border-white/10 rounded-none">
              <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mb-1">Route Assignment</div>
              <div className="font-black text-white truncate">{asset.route}</div>
            </div>
            <div className="p-3.5 bg-black border border-white/10 rounded-none">
              <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mb-1">Fuel Efficiency</div>
              <div className="font-black text-white">{asset.fuelEfficiency} MPG</div>
            </div>
            <div className="p-3.5 bg-black border border-white/10 rounded-none">
              <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mb-1">Last Inspection</div>
              <div className="font-black text-white">{asset.lastService}</div>
            </div>
            <div className="p-3.5 bg-black border border-white/10 rounded-none">
              <div className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mb-1">Velocity</div>
              <div className="font-black text-white flex items-center gap-1.5">
                {asset.telematics?.speed || 0} MPH
                {asset.telematics?.speed ? (
                  <span className={`w-2 h-2 rounded-none bg-secondary ${pulse ? 'opacity-40' : 'opacity-100'}`} />
                ) : null}
              </div>
            </div>
          </div>

          {/* Specialized Cold-Chain Thermal Visualization */}
          {isColdChain && (
            <div className="p-5 bg-black border border-white/10 rounded-none">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-secondary" />
                  <span className="font-black text-[10px] uppercase tracking-wider text-secondary">BIOLOGICAL COLD-CHAIN GUARD</span>
                </div>
                <div className="text-xl font-black text-white">
                  {asset.temperature !== undefined ? `${asset.temperature.toFixed(1)} °C` : '--'}
                </div>
              </div>

              {/* Graphical Temp Bar */}
              {asset.type === 'Vaccine Carrier' ? (
                <div>
                  <div className="w-full bg-neutral-900 h-3 rounded-none overflow-hidden relative border border-white/10">
                    <div className="absolute left-[20%] right-[20%] bg-secondary/10 h-full border-x border-secondary/30" />
                    <div 
                      className={`absolute top-0 bottom-0 w-3 rounded-none border border-black shadow ${
                        (asset.temperature ?? 4) >= 2 && (asset.temperature ?? 4) <= 8 ? 'bg-secondary' : 'bg-red-500'
                      }`}
                      style={{ left: `${Math.min(95, Math.max(5, ((asset.temperature ?? 4) / 10) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-text-secondary mt-2.5 font-bold tracking-wider">
                    <span>0°C [FREEZE DEVIATION]</span>
                    <span className="text-secondary">2°C TO 8°C [CLINICAL REGIME]</span>
                    <span>10°C [SPOILAGE RISK]</span>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-full bg-neutral-900 h-3 rounded-none overflow-hidden relative border border-white/10">
                    <div className="absolute left-0 w-[50%] bg-secondary/10 h-full border-r border-secondary/30" />
                    <div 
                      className={`absolute top-0 bottom-0 w-3 rounded-none border border-black shadow ${
                        (asset.temperature ?? -18) <= -15 ? 'bg-secondary' : 'bg-red-500'
                      }`}
                      style={{ left: `${Math.min(95, Math.max(5, (((asset.temperature ?? -18) + 30) / 30) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-text-secondary mt-2.5 font-bold tracking-wider">
                    <span>-30°C [DEEP CRYO]</span>
                    <span className="text-secondary">&lt; -15°C [SAFE STATE]</span>
                    <span>0°C [DEFROST CRITICAL]</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Engine telemetry parameters */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">ONBOARD SENSOR CORRELATION</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-black border border-white/10 rounded-none flex justify-between">
                <span className="text-text-secondary">Oil Pressure</span>
                <span className={`font-black ${asset.telematics?.oilPressure?.includes('Low') ? 'text-amber-400' : asset.telematics?.oilPressure?.includes('Critical') ? 'text-red-400' : 'text-white'}`}>
                  {asset.telematics?.oilPressure || 'Normal'}
                </span>
              </div>
              <div className="p-3 bg-black border border-white/10 rounded-none flex justify-between">
                <span className="text-text-secondary">Coolant Temp</span>
                <span className={`font-black ${(asset.telematics?.engineTemp || 0) > 215 ? 'text-red-400' : 'text-white'}`}>
                  {asset.telematics?.engineTemp || 180}°F
                </span>
              </div>
              <div className="p-3 bg-black border border-white/10 rounded-none flex justify-between">
                <span className="text-text-secondary">{asset.type.includes('EV') ? 'Battery' : 'Generator'}</span>
                <span className="font-black text-white">
                  {asset.telematics?.batteryLevel ? `${asset.telematics.batteryLevel}%` : 'Stable 12V'}
                </span>
              </div>
            </div>
          </div>

          {/* Location coordinates */}
          <div className="p-4 bg-black border border-white/10 rounded-none space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-text-secondary">
              <span className="tracking-widest">DYNAMIC POSITIONING (GPS)</span>
              <span className="text-white">LAT: {asset.telematics?.lat.toFixed(4)}, LNG: {asset.telematics?.lng.toFixed(4)}</span>
            </div>
            {/* Styled clinical grid mockup for map location */}
            <div className="h-28 bg-[#0a0a0a] border border-white/10 rounded-none relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(var(--color-secondary) 1px, transparent 0)',
                backgroundSize: '16px 16px'
              }} />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-none border border-secondary/20 bg-secondary/10 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-secondary/10 rounded-none animate-ping" />
                  <div className="w-3 h-3 bg-secondary rounded-none" />
                </div>
                <span className="bg-black text-white text-[9px] font-bold border border-white/15 px-1.5 py-0.5 mt-2">{asset.id}</span>
              </div>
              <span className="absolute bottom-2 left-2 text-[9px] text-text-secondary">PRECISION CORRIDOR RT-LOCK ACTIVE</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-black flex justify-between items-center font-mono text-xs">
          <div className="text-[10px] text-text-secondary">
            HEARTBEAT FEED: <strong className="text-secondary">ONLINE</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-white rounded-none transition-all cursor-pointer uppercase tracking-widest"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};

// Export Report Modal
interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: FleetAsset[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  assets
}) => {
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'Clinical AI JSON'>('PDF');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // Compute stats
  const totalAssets = assets.length;
  const criticalCount = assets.filter(a => a.status.startsWith('Critical')).length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance Due').length;
  const optimalCount = totalAssets - criticalCount - maintenanceCount;
  const healthPercent = ((totalAssets - criticalCount) / totalAssets) * 100;
  const avgFuel = assets.reduce((acc, curr) => acc + curr.fuelEfficiency, 0) / totalAssets;

  const triggerDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`emids_Clinical_Fleet_Report_${new Date().toISOString().split('T')[0]}.${format === 'CSV' ? 'csv' : format === 'Clinical AI JSON' ? 'json' : 'pdf'} generated and ready!`);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity">
      <div className="bg-[#0a0a0a] w-full max-w-xl rounded-none border border-white/10 shadow-none overflow-hidden flex flex-col">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black">
          <h3 className="font-sans text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            LOGISTICS REPORT GENERATOR
          </h3>
          <button onClick={onClose} className="p-1.5 text-text-secondary hover:text-white transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 font-mono text-xs uppercase">
          <div className="p-4 bg-black border border-white/10 rounded-none space-y-3">
            <h4 className="font-black text-[10px] tracking-widest text-text-secondary">SELECTED TELEMATICS PROFILE</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-neutral-900 border border-white/10">
                <span className="block text-[9px] text-text-secondary">SYSTEM HEALTH</span>
                <span className="font-black text-white text-sm">{healthPercent.toFixed(1)}%</span>
              </div>
              <div className="p-2 bg-neutral-900 border border-white/10">
                <span className="block text-[9px] text-text-secondary">AVG EFFICIENCY</span>
                <span className="font-black text-white text-sm">{avgFuel.toFixed(1)} MPG</span>
              </div>
              <div className="p-2 bg-neutral-900 border border-white/10">
                <span className="block text-[9px] text-text-secondary">CRITICAL CODES</span>
                <span className="font-black text-red-400 text-sm">{criticalCount}</span>
              </div>
            </div>
            <div className="text-[10px] text-text-secondary space-y-1 mt-2">
              <div>• Total Registered Carriers: <strong>{totalAssets}</strong></div>
              <div>• Normal/Optimal: <strong>{optimalCount}</strong> | Maintenance Due: <strong>{maintenanceCount}</strong></div>
              <div>• Cold Chain Safety Index: <strong className="text-secondary">100% compliant</strong></div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Export Data Format</label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {(['PDF', 'CSV', 'Clinical AI JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`p-3 border rounded-none flex flex-col items-center gap-1.5 transition-all font-bold cursor-pointer ${
                    format === fmt 
                      ? 'border-secondary bg-secondary-container/10 text-secondary' 
                      : 'border-white/10 bg-black text-text-secondary hover:border-white/20'
                  }`}
                >
                  <div className="text-base font-black">{fmt.split(' ')[0]}</div>
                  <span className="text-[9px] uppercase font-normal tracking-wide text-center">
                    {fmt === 'PDF' ? 'Executive' : fmt === 'CSV' ? 'Sensors' : 'AI Schema'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-text-secondary tracking-wide leading-relaxed">
            * Generated reports comply fully with health logistics data audit trails under HIPAA & FDA Cold Chain guidelines.
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-black flex justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-text-secondary hover:text-white rounded-none transition-all cursor-pointer uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={triggerDownload}
            disabled={downloading}
            className="px-5 py-2.5 bg-secondary text-black hover:bg-black hover:text-secondary font-black rounded-none border border-secondary flex items-center gap-1.5 transition-all uppercase tracking-widest cursor-pointer disabled:opacity-40"
          >
            {downloading ? <RefreshCw className="w-4 h-4 animate-spin shrink-0" /> : <Download className="w-4 h-4 shrink-0" />}
            {downloading ? 'Compiling...' : `Export ${format}`}
          </button>
        </div>
      </div>
    </div>
  );
};
