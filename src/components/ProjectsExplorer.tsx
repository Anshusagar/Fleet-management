import React, { useState } from 'react';
import { Calendar, User, Search, Plus, Trash2, ArrowUpRight, AlertCircle } from 'lucide-react';
import { ClinicalProject, FleetAsset } from '../types';

interface ProjectsExplorerProps {
  projects: ClinicalProject[];
  assets: FleetAsset[];
  onOpenCreateModal: () => void;
  onDeleteProject: (id: string) => void;
  onAllocateAsset: (projectId: string, assetId: string) => void;
}

export const ProjectsExplorer: React.FC<ProjectsExplorerProps> = ({
  projects,
  assets,
  onOpenCreateModal,
  onDeleteProject,
  onAllocateAsset
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'In Progress' | 'Planning' | 'Completed'>('All');
  const [allocatingProjectId, setAllocatingProjectId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header and top tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] font-mono font-black text-secondary uppercase tracking-[0.3em] mb-2">OPERATIONAL STRATEGY</div>
          <h2 className="font-sans text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            CLINICAL <span className="text-secondary">CAMPAIGNS</span>
          </h2>
          <p className="font-mono text-xs text-text-secondary mt-2 tracking-wide uppercase">
            TRACK HEALTHCARE DIRECTIVES, REGIONAL LOGISTICS INITIATIVES, AND TARGET DEPOT MILESTONES.
          </p>
        </div>
        <button
          onClick={onOpenCreateModal}
          className="bg-secondary text-on-secondary font-mono text-xs font-black py-2.5 px-5 rounded-none hover:bg-black hover:text-secondary border border-secondary transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          Initialize Campaign
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-none flex flex-col md:flex-row gap-4 justify-between shadow-none">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search campaigns, directors, descriptions..."
            className="w-full pl-9 pr-4 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono tracking-wider text-white placeholder-white/30 uppercase"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['All', 'In Progress', 'Planning', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-mono font-extrabold tracking-widest uppercase rounded-none border transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-secondary text-black border-secondary'
                  : 'bg-black text-text-secondary border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clinical Campaigns */}
      {filteredProjects.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 p-12 text-center rounded-none font-mono text-xs text-text-secondary uppercase tracking-wider">
          No matching healthcare initiatives found in records.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const isHigh = project.priority === 'High';
            const isCompleted = project.status === 'Completed';

            return (
              <div 
                key={project.id} 
                className="bg-[#0a0a0a] border border-white/10 rounded-none p-6 shadow-none hover:border-secondary transition-all flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="font-mono text-[9px] font-black bg-black border border-white/10 px-2 py-0.5 rounded-none text-secondary uppercase tracking-wider">
                      {project.id}
                    </span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-black uppercase tracking-wider border ${
                        isHigh ? 'border-red-500/50 bg-red-950/20 text-red-400' : 'border-white/10 bg-black text-text-secondary'
                      }`}>
                        {project.priority} PRIORITY
                      </span>
                      <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-black uppercase tracking-wider border ${
                        project.status === 'Completed' 
                          ? 'border-secondary bg-secondary-container/10 text-secondary' 
                          : project.status === 'Delayed'
                          ? 'border-red-500 bg-red-950/30 text-red-400'
                          : 'border-white/20 bg-black text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-sans text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-2">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs text-text-secondary leading-relaxed uppercase tracking-wide">
                    {project.description}
                  </p>

                  {/* Progress Meter */}
                  <div className="space-y-1.5 mt-6">
                    <div className="flex justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
                      <span className="text-text-secondary">DIRECTIVE PROGRESS</span>
                      <span className="text-secondary">{project.progress}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-black rounded-none overflow-hidden border border-white/10 p-[2px]">
                      <div 
                        className={`h-full transition-all duration-500 rounded-none ${isCompleted ? 'bg-secondary' : 'bg-secondary'}`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Allocation and assigned fleet list */}
                  <div className="border-t border-white/10 pt-4 mt-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">
                        ALLOCATED COLD-CHAIN CARRIERS
                      </span>
                      <button
                        onClick={() => setAllocatingProjectId(allocatingProjectId === project.id ? null : project.id)}
                        className="text-secondary hover:underline font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        {allocatingProjectId === project.id ? '[CANCEL]' : '[ALLOCATE ASSET]'}
                        <ArrowUpRight className="w-3 h-3 text-secondary" />
                      </button>
                    </div>

                    {/* Inline Asset Allocation dropdown */}
                    {allocatingProjectId === project.id && (
                      <div className="p-3 bg-black border border-white/20 rounded-none space-y-2">
                        <div className="text-[9px] font-mono font-bold text-text-secondary uppercase tracking-wider">
                          Select Fleet Carrier Registry
                        </div>
                        <div className="flex gap-2">
                          <select
                            id={`asset-select-${project.id}`}
                            className="flex-1 px-2 py-1.5 text-xs font-mono bg-neutral-900 border border-white/10 text-white rounded-none outline-none focus:border-secondary uppercase"
                          >
                            <option value="" className="bg-black">-- Select Asset --</option>
                            {assets
                              .filter(a => !project.assignedAssets.includes(a.id))
                              .map(a => (
                                <option key={a.id} value={a.id} className="bg-black">
                                  {a.id} - {a.type}
                                </option>
                              ))
                            }
                          </select>
                          <button
                            onClick={() => {
                              const selectEl = document.getElementById(`asset-select-${project.id}`) as HTMLSelectElement;
                              if (selectEl && selectEl.value) {
                                onAllocateAsset(project.id, selectEl.value);
                                setAllocatingProjectId(null);
                              }
                            }}
                            className="px-3 py-1.5 bg-secondary text-black font-mono text-[10px] font-black uppercase tracking-widest rounded-none border border-secondary hover:bg-black hover:text-secondary transition-all cursor-pointer"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    )}

                    {project.assignedAssets.length === 0 ? (
                      <div className="text-[11px] font-mono text-text-secondary uppercase tracking-wider flex items-center gap-2 py-1">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                        No assets allocated. Biological delivery chain offline.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {project.assignedAssets.map((assetId) => {
                          const assetData = assets.find(a => a.id === assetId);
                          const isCritical = assetData?.status.startsWith('Critical');

                          return (
                            <span 
                              key={assetId} 
                              className={`px-2.5 py-1 rounded-none border font-mono text-[9px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
                                isCritical 
                                  ? 'border-red-500 bg-red-950/20 text-red-400' 
                                  : 'border-white/10 bg-black text-white'
                              }`}
                            >
                              🚚 {assetId}
                              {isCritical && <span className="w-1.5 h-1.5 rounded-none bg-red-500 animate-pulse" />}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Director and Target Date Footer */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[10px] font-mono text-text-secondary uppercase">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{project.manager}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{project.targetDate}</span>
                  </span>
                  <button 
                    onClick={() => onDeleteProject(project.id)}
                    className="p-1.5 text-white/30 hover:text-red-500 rounded-none hover:bg-white/5 transition-colors cursor-pointer"
                    title="Terminate campaign record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
