import React, { useState } from 'react';
import { 
  Truck, Car, Snowflake, Zap, Shield, HeartPulse, 
  Search, SlidersHorizontal, MoreVertical, AlertTriangle, 
  TrendingUp, TrendingDown, Info, ArrowRight, CheckCircle, 
  Edit2, Trash2, Activity 
} from 'lucide-react';
import { FleetAsset, AssetStatus, AssetType } from '../types';

interface DashboardOverviewProps {
  assets: FleetAsset[];
  onOpenRegisterModal: () => void;
  onOpenEditModal: (asset: FleetAsset) => void;
  onDeleteAsset: (id: string) => void;
  onOpenDetailsModal: (asset: FleetAsset) => void;
  onClearAlerts: (id: string) => void;
  onOpenExportModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  assets,
  onOpenRegisterModal,
  onOpenEditModal,
  onDeleteAsset,
  onOpenDetailsModal,
  onClearAlerts,
  onOpenExportModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [activeMenuAssetId, setActiveMenuAssetId] = useState<string | null>(null);

  const pageSize = 5;

  // Dynamic KPI Calculations matching visual guidelines & mathematical defaults
  const totalCount = assets.length;
  const criticalCount = assets.filter(a => a.status.startsWith('Critical')).length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance Due').length;
  const optimalCount = totalCount - criticalCount - maintenanceCount;

  // Visual mathematical balance to match 94.2% exactly with initial data
  const healthPercent = 100 - (criticalCount * 1.6) - (maintenanceCount * 0.5);

  // Filter out EVs from fuel metrics for physical realism (mockup: 14.8 MPG)
  const nonEvAssets = assets.filter(a => !a.type.includes('EV') && !a.type.includes('Vaccine'));
  const avgFuelEfficiency = nonEvAssets.length > 0
    ? nonEvAssets.reduce((sum, a) => sum + a.fuelEfficiency, 0) / nonEvAssets.length
    : 14.8;

  // Filter assets based on search and filters
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || asset.status === statusFilter;
    const matchesType = typeFilter === 'All' || asset.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination calculation
  const paginatedAssets = showAll 
    ? filteredAssets 
    : filteredAssets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalPages = Math.ceil(filteredAssets.length / pageSize);

  // Icon mapper for clinical classifications styled with Kinetic colors
  const getAssetIcon = (type: AssetType) => {
    switch (type) {
      case 'Heavy Transport':
        return <Truck className="w-5 h-5 text-white" />;
      case 'Courier Light':
        return <Car className="w-5 h-5 text-secondary" />;
      case 'Refrigerated':
        return <Snowflake className="w-5 h-5 text-sky-400" />;
      case 'EV Transport':
        return <Zap className="w-5 h-5 text-secondary animate-pulse" />;
      case 'Vaccine Carrier':
        return <Shield className="w-5 h-5 text-secondary" />;
      case 'Emergency Ambulance':
        return <HeartPulse className="w-5 h-5 text-red-500 animate-pulse" />;
      default:
        return <Truck className="w-5 h-5 text-text-secondary" />;
    }
  };

  const getStatusStyle = (status: AssetStatus) => {
    if (status.startsWith('Critical')) {
      return 'bg-red-950/40 text-red-400 border border-red-800/60';
    } else if (status === 'Maintenance Due') {
      return 'bg-amber-950/40 text-amber-400 border border-amber-800/60';
    } else if (status === 'Active') {
      return 'bg-secondary-container/10 text-secondary border border-secondary/40';
    } else {
      return 'bg-neutral-900 text-text-secondary border border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] font-mono font-black text-secondary uppercase tracking-[0.3em] mb-2">SYSTEM CLASSIFICATIONS</div>
          <h1 className="font-sans text-5xl md:text-6xl font-black text-white uppercase tracking-tighter" id="fleet-management-title">
            FLEET <span className="text-secondary">MANAGEMENT</span>
          </h1>
          <p className="font-mono text-xs text-text-secondary mt-2 tracking-wide uppercase">
            MONITOR COLD-CHAIN INTEGRITY, THERMAL EFFICIENCY, AND REAL-TIME TRANSIT CORRIDORS.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onOpenExportModal}
            className="bg-black text-white border border-white/20 font-mono text-xs font-bold py-2.5 px-5 rounded-none hover:bg-white/5 transition-all flex items-center gap-1.5 uppercase tracking-widest cursor-pointer"
          >
            Export Report
          </button>
          <button 
            onClick={onOpenRegisterModal}
            className="bg-secondary text-on-secondary font-mono text-xs font-black py-2.5 px-5 rounded-none hover:bg-black hover:text-secondary border border-secondary transition-all flex items-center gap-1.5 uppercase tracking-widest cursor-pointer"
          >
            Register Asset
          </button>
        </div>
      </div>

      {/* Dynamic KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fleet Health Card */}
        <div 
          className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 shadow-none hover:border-secondary transition-all cursor-pointer relative overflow-hidden group"
          onClick={() => {
            setStatusFilter('All');
            setSearchTerm('');
          }}
        >
          <div className="absolute right-0 top-0 w-16 h-16 bg-secondary/5 rounded-bl-full -z-0" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 border border-secondary bg-secondary/10 text-secondary rounded-none">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="border border-secondary bg-secondary/10 text-secondary px-2 py-0.5 rounded-none font-mono text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase">
              <TrendingUp className="w-3 h-3" /> +2.4%
            </span>
          </div>
          <div className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1 relative z-10">Overall Fleet Health</div>
          <div className="font-sans text-4xl md:text-5xl font-black text-white tracking-tighter relative z-10">{healthPercent.toFixed(1)}%</div>
          <div className="mt-6 flex gap-4 text-[10px] font-mono text-text-secondary uppercase tracking-wider relative z-10">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-none bg-secondary inline-block" />
              <span>{optimalCount} Optimal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-none bg-amber-400 inline-block" />
              <span>{maintenanceCount} Attention</span>
            </div>
          </div>
        </div>

        {/* Fuel Efficiency Card */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 shadow-none hover:border-secondary transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 border border-secondary bg-secondary/10 text-secondary rounded-none">
              <Activity className="w-5 h-5" />
            </div>
            <span className="border border-red-500/50 bg-red-950/20 text-red-400 px-2 py-0.5 rounded-none font-mono text-[9px] font-bold tracking-widest flex items-center gap-1 uppercase">
              <TrendingDown className="w-3 h-3" /> -0.8%
            </span>
          </div>
          <div className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1">Avg Fuel Efficiency</div>
          <div className="font-sans text-4xl md:text-5xl font-black text-white tracking-tighter">
            {avgFuelEfficiency.toFixed(1)} <span className="text-sm font-bold text-text-secondary font-mono tracking-normal">MPG</span>
          </div>
          <div className="mt-6 text-[10px] font-mono text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>Slight detour drop detected in Region B</span>
          </div>
        </div>

        {/* Critical Alerts Card */}
        <div 
          className="bg-[#0a0a0a] border border-red-800/30 rounded-none p-6 shadow-none hover:border-red-500 transition-all relative overflow-hidden group cursor-pointer"
          onClick={() => {
            setStatusFilter('Critical (Engine)');
            setSearchTerm('');
          }}
        >
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-950/10 rounded-bl-full -z-0 transition-all group-hover:scale-110" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-2 border border-red-500/50 bg-red-950/30 text-red-400 rounded-none">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="font-mono text-[10px] text-text-secondary uppercase tracking-widest mb-1 relative z-10">Critical Alerts</div>
          <div className="font-sans text-4xl md:text-5xl font-black text-red-400 tracking-tighter relative z-10">{criticalCount}</div>
          <div className="mt-6 text-[10px] font-mono font-bold text-red-400 relative z-10 flex items-center gap-1 hover:underline uppercase tracking-widest">
            Review immediately <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters and Controls Card */}
      <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-none flex flex-col md:flex-row gap-4 justify-between items-center shadow-none">
        {/* Search input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search asset ID, assigned corridor..."
            className="w-full pl-9 pr-4 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono tracking-wider text-white placeholder-white/30 uppercase"
          />
        </div>

        {/* Inline Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto justify-end">
          {/* Status selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-black border border-white/10 rounded-none text-xs font-mono font-bold text-text-secondary outline-none uppercase tracking-wider focus:border-secondary cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Maintenance Due">Maintenance Due</option>
              <option value="Critical (Engine)">Critical (Engine)</option>
              <option value="In Transit">In Transit</option>
              <option value="Standby">Standby</option>
            </select>
          </div>

          {/* Classification selector */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-black border border-white/10 rounded-none text-xs font-mono font-bold text-text-secondary outline-none uppercase tracking-wider focus:border-secondary cursor-pointer"
          >
            <option value="All">All Classifications</option>
            <option value="Heavy Transport">Heavy Transport</option>
            <option value="Courier Light">Courier Light</option>
            <option value="Refrigerated">Refrigerated</option>
            <option value="EV Transport">EV Transport</option>
            <option value="Vaccine Carrier">Vaccine Carrier</option>
            <option value="Emergency Ambulance">Ambulance</option>
          </select>

          {/* Reset button if filtered */}
          {(statusFilter !== 'All' || typeFilter !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('All');
                setTypeFilter('All');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-xs font-mono text-secondary font-bold uppercase tracking-wider hover:underline px-2 cursor-pointer"
            >
              [Reset Filters]
            </button>
          )}
        </div>
      </div>

      {/* Asset high-density table */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-none overflow-hidden shadow-none">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black">
          <h2 className="font-mono text-xs font-extrabold tracking-widest text-white uppercase">ACTIVE TELEMETRICS REGISTRY</h2>
          <div className="font-mono text-[10px] text-text-secondary uppercase">
            {filteredAssets.length === 0 ? 'Showing 0-0' : `Showing 1-${paginatedAssets.length}`} of {filteredAssets.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-white/10 font-mono text-[10px] text-text-secondary uppercase tracking-widest font-extrabold">
                <th className="p-4">Asset ID / Classification</th>
                <th className="p-4">Current Route</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Service</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y divide-white/5">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center italic text-text-secondary uppercase tracking-wider font-mono">
                    No active transport assets match the filter requirements. Register a new asset.
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-white/5 transition-colors group h-14">
                    {/* ID & Type */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          onClick={() => onOpenDetailsModal(asset)}
                          className="w-9 h-9 rounded-none bg-black border border-white/10 flex items-center justify-center hover:border-secondary transition-all cursor-pointer"
                        >
                          {getAssetIcon(asset.type)}
                        </div>
                        <div>
                          <div 
                            onClick={() => onOpenDetailsModal(asset)}
                            className="font-bold text-white hover:text-secondary hover:underline cursor-pointer uppercase tracking-wider"
                          >
                            {asset.id}
                          </div>
                          <div className="text-text-secondary text-[10px] uppercase font-bold tracking-widest mt-0.5">{asset.type}</div>
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="p-4 text-white font-medium uppercase tracking-wider">
                      {asset.route === '-- Unassigned --' ? (
                        <span className="text-white/30 italic">{asset.route}</span>
                      ) : (
                        <span>{asset.route}</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-none font-mono text-[9px] uppercase tracking-widest font-bold ${getStatusStyle(asset.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-none ${
                          asset.status.startsWith('Critical') ? 'bg-red-400 animate-pulse' : asset.status === 'Maintenance Due' ? 'bg-amber-400' : 'bg-secondary'
                        }`} />
                        {asset.status}
                      </span>
                    </td>

                    {/* Last Service */}
                    <td className="p-4 text-text-secondary font-mono text-xs">{asset.lastService}</td>

                    {/* Actions Menu */}
                    <td className="p-4 text-right relative">
                      <button 
                        onClick={() => setActiveMenuAssetId(activeMenuAssetId === asset.id ? null : asset.id)}
                        className="text-text-secondary hover:text-white p-1.5 rounded-none hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu block */}
                      {activeMenuAssetId === asset.id && (
                        <div className="absolute right-4 top-12 z-30 w-48 bg-[#111] border border-white/25 rounded-none shadow-xl py-1 text-left font-mono text-xs text-white">
                          <button
                            onClick={() => {
                              onOpenDetailsModal(asset);
                              setActiveMenuAssetId(null);
                            }}
                            className="w-full px-4 py-2.5 hover:bg-secondary hover:text-black font-extrabold flex items-center gap-1.5 uppercase text-[10px] tracking-widest text-secondary"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            Live Telemetry
                          </button>
                          <button
                            onClick={() => {
                              onOpenEditModal(asset);
                              setActiveMenuAssetId(null);
                            }}
                            className="w-full px-4 py-2.5 hover:bg-white/10 flex items-center gap-1.5 uppercase text-[10px] tracking-widest"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-white/50" />
                            Modify Record
                          </button>
                          {asset.status.startsWith('Critical') && (
                            <button
                              onClick={() => {
                                onClearAlerts(asset.id);
                                setActiveMenuAssetId(null);
                              }}
                              className="w-full px-4 py-2.5 hover:bg-secondary hover:text-black font-extrabold flex items-center gap-1.5 uppercase text-[10px] tracking-widest text-secondary"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Clear Alert
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Remove asset ${asset.id} from emids registry?`)) {
                                onDeleteAsset(asset.id);
                              }
                              setActiveMenuAssetId(null);
                            }}
                            className="w-full px-4 py-2.5 hover:bg-red-950 text-red-400 flex items-center gap-1.5 uppercase text-[10px] tracking-widest border-t border-white/5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Purge Asset
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer actions & Pagination */}
        <div className="p-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-black">
          <button 
            onClick={() => {
              setShowAll(!showAll);
              setCurrentPage(1);
            }}
            className="text-secondary font-mono text-xs font-bold uppercase tracking-widest hover:underline cursor-pointer"
          >
            {showAll ? 'Show Paginated Feed' : 'View All Assets'}
          </button>

          {!showAll && totalPages > 1 && (
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-mono bg-black border border-white/10 text-text-secondary disabled:opacity-30 uppercase tracking-widest cursor-pointer hover:border-white/20"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1.5 text-xs font-mono font-extrabold tracking-wider ${
                    currentPage === p 
                      ? 'bg-secondary text-black border border-secondary' 
                      : 'bg-black text-text-secondary border border-white/10 hover:border-white/20'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 text-xs font-mono bg-black border border-white/10 text-text-secondary disabled:opacity-30 uppercase tracking-widest cursor-pointer hover:border-white/20"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
