import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, Send, Clock } from 'lucide-react';
import { SupportTicket } from '../types';

interface SupportDeskProps {
  tickets: SupportTicket[];
  onSubmitTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'messages' | 'status'>) => void;
  onSendChatMessage: (ticketId: string, text: string) => void;
}

export const SupportDesk: React.FC<SupportDeskProps> = ({
  tickets,
  onSubmitTicket,
  onSendChatMessage
}) => {
  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<any>('Cold Chain Alert');
  const [priority, setPriority] = useState<any>('Medium');
  const [description, setDescription] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTicket({
      subject,
      category,
      priority,
      description
    });
    setSubject('');
    setDescription('');
    setShowNewTicketForm(false);
    if (tickets.length > 0) {
      setActiveTicketId(tickets[tickets.length - 1].id);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicketId) return;
    onSendChatMessage(activeTicketId, chatInput);
    setChatInput('');
  };

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  return (
    <div className="space-y-8">
      {/* Header and tools */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="text-[10px] font-mono font-black text-secondary uppercase tracking-[0.3em] mb-2">OPERATIONAL BACKSTOP</div>
          <h2 className="font-sans text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">
            SUPPORT <span className="text-secondary">DESK</span>
          </h2>
          <p className="font-mono text-xs text-text-secondary mt-2 tracking-wide uppercase">
            REPORT BIOLOGICAL ANOMALIES, CORRIDOR EXCEPTIONS, AND DISPATCH FAILURE MODES.
          </p>
        </div>
        <button
          onClick={() => setShowNewTicketForm(!showNewTicketForm)}
          className="bg-secondary text-on-secondary font-mono text-xs font-black py-2.5 px-5 rounded-none hover:bg-black hover:text-secondary border border-secondary transition-all flex items-center gap-2 uppercase tracking-widest cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          {showNewTicketForm ? 'View Active Tickets' : 'File Logistics Incident'}
        </button>
      </div>

      {/* Grid: Forms, Ticket List and Active Chat */}
      {showNewTicketForm ? (
        <form onSubmit={handleTicketSubmit} className="bg-[#0a0a0a] border border-white/15 p-6 rounded-none space-y-4 max-w-xl">
          <h3 className="font-sans text-lg font-black text-white uppercase tracking-wider mb-2">FILE LOGISTICS INCIDENT</h3>
          
          <div>
            <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Incident Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Compressor failure on V-3304"
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-white placeholder-white/30 uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-text-secondary cursor-pointer uppercase"
              >
                <option value="Cold Chain Alert" className="bg-black">Cold Chain Alert</option>
                <option value="Vehicle Mechanical" className="bg-black">Vehicle Mechanical</option>
                <option value="Route Delay" className="bg-black">Route Delay</option>
                <option value="Software Glitch" className="bg-black">Software Glitch</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Severity / Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-text-secondary cursor-pointer uppercase"
              >
                <option value="High" className="bg-black">🔴 High Priority (Shut down risk)</option>
                <option value="Medium" className="bg-black">🟡 Medium Priority (Correction needed)</option>
                <option value="Low" className="bg-black">🟢 Low Priority (General query)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider mb-1">Incident Report Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specify precise markers, vehicle IDs, cargo types, and temperatures..."
              rows={4}
              className="w-full px-3 py-2 bg-black border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono text-white placeholder-white/30 resize-none uppercase leading-relaxed"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-secondary text-black hover:bg-black hover:text-secondary font-mono text-xs font-black py-2.5 px-4 rounded-none border border-secondary transition-all uppercase tracking-widest cursor-pointer"
          >
            Dispatch to Logistics Core
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Ticket List (Left sidebar) */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono font-black text-text-secondary uppercase tracking-widest">OPERATIONAL INCIDENTS</h3>
            {tickets.length === 0 ? (
              <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-none text-center font-mono text-xs text-text-secondary uppercase">
                No active incidents reported.
              </div>
            ) : (
              tickets.map((t) => {
                const isSelected = t.id === activeTicketId;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className={`p-4 rounded-none border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-secondary-container/10 border-secondary' 
                        : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[9px] font-black bg-black border border-white/10 px-2 py-0.5 rounded-none text-secondary uppercase tracking-wider">{t.id}</span>
                      <span className={`px-2 py-0.5 rounded-none text-[8px] font-mono font-black uppercase tracking-widest border ${
                        t.priority === 'High' ? 'border-red-500 bg-red-950/20 text-red-400' : 'border-white/10 bg-black text-text-secondary'
                      }`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="font-sans text-sm font-black text-white uppercase tracking-tight mb-1 truncate">{t.subject}</div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-text-secondary uppercase tracking-wider">
                      <span>{t.category}</span>
                      <span className="font-bold text-white">{t.status}</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Helpline quick-link */}
            <div className="p-4 bg-[#0a0a0a] border border-white/10 rounded-none space-y-3 uppercase font-mono">
              <h4 className="font-bold text-[10px] text-white tracking-widest">TELEPHONIC DISPATCH</h4>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>+1 (800) 555-EMIDS</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span className="lowercase">dispatch@emidstech.com</span>
              </div>
            </div>
          </div>

          {/* Active Chat / Regulation consultation (Right) */}
          <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-none flex flex-col h-[520px] overflow-hidden">
            {activeTicket ? (
              <div className="flex-1 flex flex-col h-full justify-between">
                {/* Chat header */}
                <div className="p-4 border-b border-white/10 bg-black flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans text-sm font-black text-white uppercase tracking-wider truncate max-w-sm">{activeTicket.subject}</h4>
                      <span className="text-[9px] font-mono bg-neutral-900 border border-white/15 px-2 py-0.5 text-secondary uppercase tracking-wider font-extrabold">{activeTicket.status}</span>
                    </div>
                    <p className="text-[10px] font-mono text-text-secondary truncate mt-1 uppercase tracking-wide">{activeTicket.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-text-secondary bg-black px-2.5 py-1 border border-white/15">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    <span>AVG RESPONSE: 1M</span>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono">
                  {/* Original issue description as a message */}
                  <div className="flex gap-3 max-w-xl items-start">
                    <div className="w-8 h-8 rounded-none border border-white/20 bg-black text-white text-xs font-black flex items-center justify-center">
                      US
                    </div>
                    <div className="p-3 bg-black border border-white/5 rounded-none text-xs leading-relaxed">
                      <div className="font-black text-[9px] text-secondary uppercase tracking-widest mb-1">ORIGINAL REPORT</div>
                      <div className="text-white uppercase">{activeTicket.description}</div>
                      <div className="text-[9px] text-white/30 mt-2">{activeTicket.createdAt}</div>
                    </div>
                  </div>

                  {activeTicket.messages.map((m, idx) => {
                    const isUser = m.sender === 'user';
                    return (
                      <div key={idx} className={`flex gap-3 max-w-xl items-start ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-none border text-xs font-black flex items-center justify-center ${
                          isUser ? 'border-secondary bg-secondary text-black' : 'border-white/20 bg-black text-white'
                        }`}>
                          {isUser ? 'US' : 'AI'}
                        </div>
                        <div className={`p-3 rounded-none text-xs leading-relaxed ${
                          isUser ? 'bg-secondary-container/10 border border-secondary/20 text-white' : 'bg-black border border-white/5 text-white'
                        }`}>
                          <div className="font-black text-[9px] text-secondary uppercase tracking-widest mb-1">
                            {isUser ? 'COORDINATOR DISPATCH' : 'EMIDS LOGISTICS AI'}
                          </div>
                          <div className="uppercase">{m.text}</div>
                          <div className="text-[9px] text-white/30 mt-2">{m.timestamp}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Input form */}
                <form onSubmit={handleSendChat} className="p-3 border-t border-white/10 bg-black flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI or coordinate with dispatch coordinator..."
                    className="flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-none focus:border-secondary outline-none text-xs font-mono tracking-wider text-white placeholder-white/20 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2.5 bg-secondary text-black border border-secondary rounded-none hover:bg-black hover:text-secondary disabled:opacity-40 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-secondary font-mono text-xs uppercase tracking-wider space-y-2">
                <HelpCircle className="w-10 h-10 text-secondary mb-2" />
                <span>Select active ticket to initiate clinical tele-communications.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
