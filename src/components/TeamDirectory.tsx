import React, { useState } from 'react';
import { Search, Phone, Mail, Award, Star, UserPlus } from 'lucide-react';
import { TeamMember, FleetAsset } from '../types';

interface TeamDirectoryProps {
  team: TeamMember[];
  assets: FleetAsset[];
  onAddTeamMember: (member: Omit<TeamMember, 'id' | 'rating' | 'avatar'>) => void;
}

export const TeamDirectory: React.FC<TeamDirectoryProps> = ({
  team,
  assets,
  onAddTeamMember
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'On Shift' | 'Off Duty' | 'Emergency Standby'>('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // New team member fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('Vaccine Cold-Chain Specialist');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'On Shift' | 'Off Duty' | 'Emergency Standby'>('On Shift');
  const [licenseType, setLicenseType] = useState('Class D (Specimen Cert)');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTeamMember({
      name,
      role,
      email: email || `${name.toLowerCase().replace(' ', '.')}@emidstech.com`,
      phone: phone || '(555) 012-3456',
      status,
      licenseType
    });
    setName('');
    setEmail('');
    setPhone('');
    setShowAddForm(false);
  };

  const filteredTeam = team.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.licenseType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header and top tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] font-mono font-black text-secondary uppercase tracking-[0.3em] mb-2">HUMAN INTELLIGENCE</div>
          <h2 className="font-sans text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            LOGISTICS <span className="text-secondary">TEAM</span>
          </h2>
          <p className="font-mono text-xs text-text-secondary mt-2 tracking-wide uppercase">
            COORDINATE SHIFTS, REGIONAL CREDENTIALS, AND OPERATOR DISPATCH ROUTING.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-secondary text-on-secondary font-mono text-xs font-black py-2.5 px-5 rounded-none hover:bg-black hover:text-secondary border border-secondary transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer"
        >
          <UserPlus className="w-4 h-4 shrink-0" />
          {showAddForm ? 'Hide Form' : 'Register Operator'}
        </button>
      </div>

      {/* Add operator form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="bg-[#0a0a0a] border border-white/15 p-6 rounded-none space-y-4 max-w-xl">
          <h3 className="font-sans text-lg font-black text-white uppercase tracking-wider mb-2">NEW OPERATOR PROVISION</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. John Doe"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-white placeholder-white/30 uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Direct Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-text-secondary cursor-pointer uppercase"
              >
                <option value="Vaccine Cold-Chain Specialist" className="bg-black">Vaccine Cold-Chain Specialist</option>
                <option value="Bio-Logistics Coordinator" className="bg-black">Bio-Logistics Coordinator</option>
                <option value="Paramedic Transport Lead" className="bg-black">Paramedic Transport Lead</option>
                <option value="EV Fleet Operator" className="bg-black">EV Fleet Operator</option>
                <option value="Lead Heavy Transport Specialist" className="bg-black">Lead Heavy Transport Specialist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="j.doe@emidstech.com"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-white placeholder-white/30"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 010-0100"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-white placeholder-white/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-text-secondary cursor-pointer uppercase"
              >
                <option value="On Shift" className="bg-black">On Shift</option>
                <option value="Emergency Standby" className="bg-black">Emergency Standby</option>
                <option value="Off Duty" className="bg-black">Off Duty</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Credentials & Licensing</label>
              <input
                type="text"
                required
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                placeholder="CDL Class B / HazMat Cert"
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-white placeholder-white/30 uppercase"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-black hover:bg-black hover:text-secondary font-mono text-xs font-black py-2.5 px-4 rounded-none border border-secondary transition-all uppercase tracking-widest cursor-pointer"
          >
            Register to Clinical Hub
          </button>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-none flex flex-col md:flex-row gap-4 justify-between shadow-none">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search operator name, license, specialty..."
            className="w-full pl-9 pr-4 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono tracking-wider text-white placeholder-white/30 uppercase"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['All', 'On Shift', 'Emergency Standby', 'Off Duty'] as const).map((status) => (
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

      {/* Team Grid */}
      {filteredTeam.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 p-12 text-center rounded-none font-mono text-xs text-text-secondary uppercase tracking-wider">
          No personnel records matched your filter configuration.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTeam.map((member) => {
            const assignedVehicles = assets.filter(a => a.driverId === member.id).map(a => a.id);

            return (
              <div key={member.id} className="bg-[#0a0a0a] border border-white/10 rounded-none p-5 shadow-none hover:border-secondary transition-all flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <img 
                      src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'} 
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-none object-cover border border-white/20"
                    />
                    <span className={`px-2.5 py-0.5 rounded-none font-mono text-[9px] font-black uppercase tracking-widest border ${
                      member.status === 'On Shift'
                        ? 'border-secondary bg-secondary-container/10 text-secondary'
                        : member.status === 'Emergency Standby'
                        ? 'border-amber-500/50 bg-amber-950/20 text-amber-400'
                        : 'border-white/10 bg-black text-text-secondary'
                    }`}>
                      {member.status}
                    </span>
                  </div>

                  <h3 className="font-sans text-xl font-black text-white uppercase tracking-tight">{member.name}</h3>
                  <div className="text-[10px] font-mono text-secondary font-black uppercase tracking-wider mt-0.5">{member.role}</div>

                  <div className="space-y-2.5 text-xs font-mono text-text-secondary border-t border-white/10 pt-4 mt-4 uppercase">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="truncate text-white normal-case">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-secondary shrink-0" />
                      <span className="truncate">{member.licenseType}</span>
                    </div>
                  </div>
                </div>

                {/* Star rating and vehicles footer */}
                <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-black text-white">{member.rating.toFixed(2)}</span>
                  </div>
                  <div>
                    {assignedVehicles.length === 0 ? (
                      <span className="text-text-secondary uppercase text-[10px] tracking-wider">[UNASSIGNED]</span>
                    ) : (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-secondary border border-secondary/20 bg-secondary/5 px-2 py-0.5 rounded-none uppercase tracking-wider">
                        <span>FLEET: </span>
                        <strong>{assignedVehicles.join(', ')}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
