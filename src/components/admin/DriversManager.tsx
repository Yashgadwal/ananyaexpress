'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, User, X, ShieldAlert, Phone } from 'lucide-react';

interface Driver {
  id: string;
  name: string;
  phone: string;
  licenceNumber?: string | null;
  licenceExpiry?: string | null;
  availabilityStatus: string;
  internalNotes?: string | null;
}

interface DriversManagerProps {
  initialDrivers: Driver[];
}

export default function DriversManager({ initialDrivers }: DriversManagerProps) {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLicence, setFormLicence] = useState('');
  const [formExpiry, setFormExpiry] = useState('');
  const [formStatus, setFormStatus] = useState('Available');
  const [formNotes, setFormNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormLicence('');
    setFormExpiry('');
    setFormStatus('Available');
    setFormNotes('');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (d: Driver) => {
    setEditingDriver(d);
    setFormName(d.name);
    setFormPhone(d.phone);
    setFormLicence(d.licenceNumber || '');
    setFormExpiry(d.licenceExpiry || '');
    setFormStatus(d.availabilityStatus);
    setFormNotes(d.internalNotes || '');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;
    setLoading(true);

    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          licenceNumber: formLicence || null,
          licenceExpiry: formExpiry || null,
          availabilityStatus: formStatus,
          internalNotes: formNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to create driver');

      const data = await response.json();
      setDrivers(prev => [data.driver, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert('Error creating driver profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/drivers/${editingDriver.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          phone: formPhone,
          licenceNumber: formLicence || null,
          licenceExpiry: formExpiry || null,
          availabilityStatus: formStatus,
          internalNotes: formNotes,
        }),
      });

      if (!response.ok) throw new Error('Failed to edit driver');

      const data = await response.json();
      setDrivers(prev => prev.map(item => item.id === editingDriver.id ? data.driver : item));
      setEditingDriver(null);
    } catch (err) {
      alert('Error saving driver edits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driverId: string) => {
    if (!confirm('Are you sure you want to delete this driver from the database?')) return;

    try {
      const response = await fetch(`/api/admin/drivers/${driverId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDrivers(prev => prev.filter(item => item.id !== driverId));
      }
    } catch (err) {
      alert('Error deleting driver');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex justify-end bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Driver Profile</span>
        </button>
      </div>

      {/* Grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-primary font-display">{d.name}</h3>
                  <a href={`tel:${d.phone}`} className="text-xs text-slate-500 font-semibold hover:underline flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-secondary" />
                    <span>{d.phone}</span>
                  </a>
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  d.availabilityStatus === 'Available' ? 'bg-green-50 text-green-700 border border-green-100' :
                  d.availabilityStatus === 'Busy' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {d.availabilityStatus}
                </span>
              </div>

              {/* Private Licence details */}
              {(d.licenceNumber || d.internalNotes) && (
                <div className="bg-slate-900/5 p-3 rounded-lg border border-slate-900/10 text-[11px] space-y-1.5">
                  <div className="font-bold text-[9px] text-slate-400 uppercase tracking-wider border-b border-slate-900/10 pb-1 flex items-center">
                    <ShieldAlert className="h-3.5 w-3.5 mr-1 text-secondary" />
                    <span>🔒 Private Credentials</span>
                  </div>
                  {d.licenceNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Licence No:</span>
                      <span className="font-mono font-bold text-slate-800">{d.licenceNumber}</span>
                    </div>
                  )}
                  {d.licenceExpiry && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Licence Exp:</span>
                      <span className="font-medium text-slate-800">{d.licenceExpiry}</span>
                    </div>
                  )}
                  {d.internalNotes && (
                    <div className="pt-1.5 text-gray-500 border-t border-slate-900/5 italic leading-normal">
                      Notes: {d.internalNotes}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* card footer */}
            <div className="bg-slate-50/50 p-6 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => openEditModal(d)}
                className="flex-1 bg-white hover:bg-slate-100 text-charcoal border border-gray-250 font-bold py-2 rounded-lg text-xs transition-colors flex justify-center items-center gap-1 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => handleDelete(d.id)}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-250 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex justify-center items-center cursor-pointer"
                title="Delete driver"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form Modal */}
      {(showAddModal || editingDriver) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-150 overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="text-base font-bold font-display">
                {showAddModal ? 'Add Driver' : `Edit Driver: ${editingDriver?.name}`}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingDriver(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Driver Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Mobile Phone *</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none font-semibold text-charcoal"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Licence Number</label>
                  <input
                    type="text"
                    placeholder="DL-XXXX"
                    value={formLicence}
                    onChange={(e) => setFormLicence(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Licence Expiry</label>
                  <input
                    type="date"
                    value={formExpiry}
                    onChange={(e) => setFormExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Availability Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none font-medium"
                >
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Internal Staff Notes</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="border-t border-gray-100 pt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDriver(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-charcoal font-bold py-2 px-4 rounded-lg text-xs cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-5 rounded-lg text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
