'use client';

import { useState } from 'react';
import { Clock, AlertCircle, Calendar, Plus, Trash2, ArrowLeft, ArrowRight, X, ChevronRight, Send, AlertTriangle } from 'lucide-react';

interface FollowUp {
  id: string;
  note: string;
  createdBy: string;
  createdAt: string | Date;
}

interface Lead {
  id: string;
  title: string;
  stage: string;
  customerName: string;
  phone: string;
  notes?: string | null;
  priority: string;
  followUpDate?: string | null;
  assignedTo?: string | null;
  createdAt: string | Date;
  followUps: FollowUp[];
}

interface LeadsCRMProps {
  initialLeads: Lead[];
}

export default function LeadsCRM({ initialLeads }: LeadsCRMProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [newFollowUpNote, setNewFollowUpNote] = useState('');
  
  // Create New Lead form state
  const [showAddLead, setShowAddLead] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  
  // Edit Lead Modal states
  const [editPriority, setEditPriority] = useState('');
  const [editFollowUpDate, setEditFollowUpDate] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const stages = ['New', 'Contacted', 'Interested', 'Quote Sent', 'Follow-up', 'Converted', 'Lost'];

  const handleStageChange = async (leadId: string, newStage: string) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (response.ok) {
        setLeads(prev => prev.map(item => item.id === leadId ? { ...item, stage: newStage } : item));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, stage: newStage } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newName || !newPhone) return;

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          customerName: newName,
          phone: newPhone,
          notes: newNotes,
          priority: newPriority,
          stage: 'New',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const created: Lead = {
          ...data.lead,
          followUps: []
        };
        setLeads(prev => [created, ...prev]);
        setShowAddLead(false);
        // Reset
        setNewTitle('');
        setNewName('');
        setNewPhone('');
        setNewNotes('');
        setNewPriority('Medium');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLeads(prev => prev.filter(item => item.id !== leadId));
        setSelectedLead(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveLeadEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    try {
      const response = await fetch(`/api/admin/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: editPriority,
          followUpDate: editFollowUpDate || null,
          assignedTo: editAssignedTo,
          notes: editNotes,
        }),
      });

      if (response.ok) {
        setLeads(prev => prev.map(item => item.id === selectedLead.id ? { 
          ...item, 
          priority: editPriority, 
          followUpDate: editFollowUpDate || null,
          assignedTo: editAssignedTo,
          notes: editNotes,
        } : item));
        setSelectedLead(prev => prev ? { 
          ...prev, 
          priority: editPriority, 
          followUpDate: editFollowUpDate || null,
          assignedTo: editAssignedTo,
          notes: editNotes,
        } : null);
        alert('Lead details saved!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddFollowUpNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newFollowUpNote) return;

    try {
      const response = await fetch(`/api/admin/leads/${selectedLead.id}/follow-ups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newFollowUpNote }),
      });

      if (response.ok) {
        const data = await response.json();
        setLeads(prev => prev.map(item => {
          if (item.id === selectedLead.id) {
            return {
              ...item,
              followUps: [data.followUp, ...item.followUps]
            };
          }
          return item;
        }));
        setSelectedLead(prev => prev ? {
          ...prev,
          followUps: [data.followUp, ...prev.followUps]
        } : null);
        setNewFollowUpNote('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openLeadModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditPriority(lead.priority);
    setEditFollowUpDate(lead.followUpDate || '');
    setEditAssignedTo(lead.assignedTo || '');
    setEditNotes(lead.notes || '');
  };

  // Overdue check
  const isOverdue = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-100';
      case 'Low': return 'bg-slate-50 text-slate-700 border-slate-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  // Filter list
  const filteredLeads = leads.filter(l => {
    if (filterOverdue) {
      return isOverdue(l.followUpDate) && l.stage !== 'Converted' && l.stage !== 'Lost';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top filters bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-xs font-semibold text-charcoal cursor-pointer">
            <input
              type="checkbox"
              checked={filterOverdue}
              onChange={(e) => setFilterOverdue(e.target.checked)}
              className="rounded text-secondary focus:ring-secondary h-4 w-4"
            />
            <span className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Show Overdue Follow-ups Only
            </span>
          </label>
        </div>

        <button
          onClick={() => setShowAddLead(true)}
          className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lead Manually</span>
        </button>
      </div>

      {/* CRM Columns Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin select-none">
        {stages.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage);
          return (
            <div key={stage} className="bg-slate-100/80 rounded-2xl p-3 w-72 shrink-0 flex flex-col max-h-[70vh] border border-gray-150">
              {/* Column Header */}
              <div className="flex justify-between items-center mb-3 px-1.5">
                <span className="text-xs font-bold text-primary uppercase tracking-wide">{stage}</span>
                <span className="bg-slate-200 text-charcoal py-0.5 px-2 rounded-full text-[10px] font-bold">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards body */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
                {stageLeads.map((l) => (
                  <div
                    key={l.id}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-150 hover:shadow-md hover:border-secondary transition-all cursor-pointer space-y-3 relative ${
                      isOverdue(l.followUpDate) && stage !== 'Converted' && stage !== 'Lost' 
                        ? 'border-l-4 border-l-red-500' 
                        : ''
                    }`}
                    onClick={() => openLeadModal(l)}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-primary leading-tight font-display mb-1 truncate">
                        {l.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold">{l.customerName}</p>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`px-2 py-0.5 rounded-full border ${getPriorityColor(l.priority)} font-bold`}>
                        {l.priority}
                      </span>
                      {l.followUpDate && (
                        <span className={`flex items-center font-bold uppercase tracking-wider ${
                          isOverdue(l.followUpDate) ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          <Clock className="h-3.5 w-3.5 mr-0.5" />
                          {l.followUpDate}
                        </span>
                      )}
                    </div>

                    {/* Column controls - quick arrows for mobile/touch usability */}
                    <div className="flex justify-end gap-1.5 pt-2 border-t border-gray-50 mt-1" onClick={e => e.stopPropagation()}>
                      <button
                        disabled={stages.indexOf(stage) === 0}
                        onClick={() => handleStageChange(l.id, stages[stages.indexOf(stage) - 1])}
                        className="p-1 rounded bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-charcoal disabled:opacity-30"
                      >
                        ←
                      </button>
                      <button
                        disabled={stages.indexOf(stage) === stages.length - 1}
                        onClick={() => handleStageChange(l.id, stages[stages.indexOf(stage) + 1])}
                        className="p-1 rounded bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-charcoal disabled:opacity-30"
                      >
                        →
                      </button>
                    </div>

                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-[10px] border-2 border-dashed border-slate-200 rounded-xl font-medium">
                    Empty Stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Lead Slideover Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-150 overflow-hidden shadow-2xl animate-scale-in">
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="text-base font-bold font-display">Add New CRM Lead</h3>
              <button onClick={() => setShowAddLead(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-1">Lead Title / Inquiry *</label>
                <input
                  type="text"
                  placeholder="e.g. Tempo traveller query for Indore"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-1">Client Name *</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-1">Client Phone *</label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-1">Inquiry Details</label>
                <textarea
                  rows={3}
                  placeholder="Write initial notes..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-secondary focus:bg-white focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="bg-slate-100 text-charcoal font-bold py-2 px-4 rounded-lg text-xs"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-secondary text-white font-bold py-2 px-5 rounded-lg text-xs shadow-sm"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail & Timeline Edit Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl border border-gray-150 overflow-hidden shadow-2xl animate-scale-in grid grid-cols-1 md:grid-cols-12 max-h-[90vh]">
            
            {/* Left half: Details & Parameters Editor */}
            <div className="md:col-span-6 p-6 border-r border-gray-100 overflow-y-auto space-y-6">
              <div className="flex justify-between items-center pb-2 border-b">
                <div>
                  <h3 className="text-base font-bold font-display text-primary">{selectedLead.title}</h3>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lead Profile</span>
                </div>
                <button onClick={() => setSelectedLead(null)} className="md:hidden text-slate-400 hover:text-charcoal p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs font-semibold text-charcoal">
                <div>Client: {selectedLead.customerName}</div>
                <div>Phone: {selectedLead.phone}</div>
                <div>Created: {new Date(selectedLead.createdAt).toLocaleDateString()}</div>
              </div>

              <form onSubmit={handleSaveLeadEdits} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Follow Up Date</label>
                    <input
                      type="date"
                      value={editFollowUpDate}
                      onChange={(e) => setEditFollowUpDate(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Assigned Agent</label>
                  <input
                    type="text"
                    value={editAssignedTo}
                    onChange={(e) => setEditAssignedTo(e.target.value)}
                    placeholder="Staff name"
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">General Notes</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span>Delete Lead</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-primary text-white font-bold py-1.5 px-4 rounded-lg text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Right half: Follow-up logs & Timelines */}
            <div className="md:col-span-6 bg-slate-50/50 p-6 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-4">
                  <h3 className="text-sm font-bold text-primary font-display">Timeline Logs</h3>
                  <button onClick={() => setSelectedLead(null)} className="hidden md:block text-slate-400 hover:text-charcoal p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Follow up history stack */}
                <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                  {selectedLead.followUps.map((log) => (
                    <div key={log.id} className="bg-white rounded-lg p-3 border border-gray-150 text-xs space-y-1">
                      <div className="flex justify-between text-gray-400 font-bold text-[9px] uppercase">
                        <span>By {log.createdBy}</span>
                        <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-charcoal leading-relaxed">{log.note}</p>
                    </div>
                  ))}
                  {selectedLead.followUps.length === 0 && (
                    <p className="text-xs text-gray-400 italic text-center py-8">No follow-up notes logged yet.</p>
                  )}
                </div>
              </div>

              {/* Add Follow-up Note Form */}
              <form onSubmit={handleAddFollowUpNote} className="pt-4 border-t border-gray-200 mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type follow-up note..."
                  value={newFollowUpNote}
                  onChange={(e) => setNewFollowUpNote(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="bg-secondary text-white font-bold p-2.5 rounded-lg text-xs shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
