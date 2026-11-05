'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Car, X, Shield, Calendar, Sparkles } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  category: string;
  passengerCapacity: number;
  luggageCapacity: number;
  hasAc: boolean;
  fuelType: string;
  localFare: number;
  outstationPerKm: number;
  driverAllowance: number;
  minKmRule: number;
  isActive: boolean;
  isAvailable: boolean;
  regNumber?: string | null;
  insuranceExpiry?: string | null;
  serviceDate?: string | null;
  permitExpiry?: string | null;
}

interface VehiclesManagerProps {
  initialVehicles: Vehicle[];
}

export default function VehiclesManager({ initialVehicles }: VehiclesManagerProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form Fields State (shared between add and edit)
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Sedan');
  const [formSeats, setFormSeats] = useState('4');
  const [formLuggage, setFormLuggage] = useState('2');
  const [formAc, setFormAc] = useState(true);
  const [formFuel, setFormFuel] = useState('CNG/Petrol');
  const [formLocalFare, setFormLocalFare] = useState('');
  const [formOutstationRate, setFormOutstationRate] = useState('');
  const [formAllowance, setFormAllowance] = useState('');
  const [formMinKm, setFormMinKm] = useState('250');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formIsAvailable, setFormIsAvailable] = useState(true);
  
  // Private Admin details
  const [formReg, setFormReg] = useState('');
  const [formInsurance, setFormInsurance] = useState('');
  const [formPermit, setFormPermit] = useState('');
  const [formService, setFormService] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Sedan', 'SUV', 'Premium SUV', 'Tempo Traveller'];

  const resetForm = () => {
    setFormName('');
    setFormCategory('Sedan');
    setFormSeats('4');
    setFormLuggage('2');
    setFormAc(true);
    setFormFuel('CNG/Petrol');
    setFormLocalFare('');
    setFormOutstationRate('');
    setFormAllowance('');
    setFormMinKm('250');
    setFormIsActive(true);
    setFormIsAvailable(true);
    setFormReg('');
    setFormInsurance('');
    setFormPermit('');
    setFormService('');
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormName(v.name);
    setFormCategory(v.category);
    setFormSeats(v.passengerCapacity.toString());
    setFormLuggage(v.luggageCapacity.toString());
    setFormAc(v.hasAc);
    setFormFuel(v.fuelType);
    setFormLocalFare(v.localFare.toString());
    setFormOutstationRate(v.outstationPerKm.toString());
    setFormAllowance(v.driverAllowance.toString());
    setFormMinKm(v.minKmRule.toString());
    setFormIsActive(v.isActive);
    setFormIsAvailable(v.isAvailable);
    setFormReg(v.regNumber || '');
    setFormInsurance(v.insuranceExpiry || '');
    setFormPermit(v.permitExpiry || '');
    setFormService(v.serviceDate || '');
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          category: formCategory,
          passengerCapacity: parseInt(formSeats),
          luggageCapacity: parseInt(formLuggage),
          hasAc: formAc,
          fuelType: formFuel,
          localFare: parseFloat(formLocalFare),
          outstationPerKm: parseFloat(formOutstationRate),
          driverAllowance: parseFloat(formAllowance),
          minKmRule: parseInt(formMinKm),
          isActive: formIsActive,
          isAvailable: formIsAvailable,
          regNumber: formReg || null,
          insuranceExpiry: formInsurance || null,
          permitExpiry: formPermit || null,
          serviceDate: formService || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to create vehicle');

      const data = await response.json();
      setVehicles(prev => [data.vehicle, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      alert('Error creating vehicle');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/vehicles/${editingVehicle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          category: formCategory,
          passengerCapacity: parseInt(formSeats),
          luggageCapacity: parseInt(formLuggage),
          hasAc: formAc,
          fuelType: formFuel,
          localFare: parseFloat(formLocalFare),
          outstationPerKm: parseFloat(formOutstationRate),
          driverAllowance: parseFloat(formAllowance),
          minKmRule: parseInt(formMinKm),
          isActive: formIsActive,
          isAvailable: formIsAvailable,
          regNumber: formReg || null,
          insuranceExpiry: formInsurance || null,
          permitExpiry: formPermit || null,
          serviceDate: formService || null,
        }),
      });

      if (!response.ok) throw new Error('Failed to edit vehicle');

      const data = await response.json();
      setVehicles(prev => prev.map(item => item.id === editingVehicle.id ? data.vehicle : item));
      setEditingVehicle(null);
    } catch (err) {
      alert('Error saving vehicle edits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle from the database?')) return;

    try {
      const response = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVehicles(prev => prev.filter(item => item.id !== vehicleId));
      }
    } catch (err) {
      alert('Error deleting vehicle');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action bar */}
      <div className="flex justify-end bg-white p-4 rounded-xl border border-gray-150 shadow-sm">
        <button
          onClick={openAddModal}
          className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4">
              
              {/* Category tag & name */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block bg-primary/10 text-primary text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full mb-1">
                    {v.category}
                  </span>
                  <h3 className="text-base font-bold text-primary font-display">{v.name}</h3>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg text-secondary">
                  <Car className="h-5 w-5" />
                </div>
              </div>

              {/* public pricing specs */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
                <div className="bg-slate-50 p-2 rounded border border-gray-100">
                  <span className="text-[9px] text-gray-400 block uppercase">Local (8h/80k)</span>
                  <span className="text-sm font-bold text-primary">Rs {v.localFare}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-gray-100">
                  <span className="text-[9px] text-gray-400 block uppercase">Outstation</span>
                  <span className="text-sm font-bold text-secondary">Rs {v.outstationPerKm}/km</span>
                </div>
              </div>

              {/* Private compliance specs */}
              {v.regNumber && (
                <div className="bg-slate-900/5 p-3 rounded-lg border border-slate-900/10 text-[11px] space-y-1.5">
                  <div className="font-bold text-[9px] text-slate-400 uppercase tracking-wider border-b border-slate-900/10 pb-1">
                    🔒 Private Admin Records
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Reg Number:</span>
                    <span className="font-mono font-bold text-slate-800">{v.regNumber}</span>
                  </div>
                  {v.insuranceExpiry && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Insurance Exp:</span>
                      <span className="font-medium text-slate-800">{v.insuranceExpiry}</span>
                    </div>
                  )}
                  {v.permitExpiry && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-semibold">Permit Exp:</span>
                      <span className="font-medium text-slate-800">{v.permitExpiry}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* card footer */}
            <div className="bg-slate-50/50 p-6 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => openEditModal(v)}
                className="flex-1 bg-white hover:bg-slate-100 text-charcoal border border-gray-250 font-bold py-2 rounded-lg text-xs transition-colors flex justify-center items-center gap-1 cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(v.id)}
                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex justify-center items-center cursor-pointer"
                title="Delete vehicle"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form Modal */}
      {(showAddModal || editingVehicle) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-150 overflow-hidden shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <h3 className="text-base font-bold font-display">
                {showAddModal ? 'Add Vehicle' : `Edit Vehicle: ${editingVehicle?.name}`}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingVehicle(null);
                }}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="p-6 space-y-6">
              
              {/* Form Section 1: Public details */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-gray-400 border-b pb-1">Public Display Details</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Vehicle Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Swift Dzire or Similar"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Seats *</label>
                    <input
                      type="number"
                      value={formSeats}
                      onChange={(e) => setFormSeats(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Luggage (Bags) *</label>
                    <input
                      type="number"
                      value={formLuggage}
                      onChange={(e) => setFormLuggage(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">AC Status *</label>
                    <select
                      value={formAc ? 'AC' : 'Non-AC'}
                      onChange={(e) => setFormAc(e.target.value === 'AC')}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="AC">AC Enabled</option>
                      <option value="Non-AC">Non AC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Fuel Type *</label>
                    <input
                      type="text"
                      placeholder="Diesel / CNG / Petrol"
                      value={formFuel}
                      onChange={(e) => setFormFuel(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 2: Pricing configuration */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-bold text-gray-400 border-b pb-1">Fares & Rates Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Local Fare Package *</label>
                    <input
                      type="number"
                      placeholder="e.g. 1800"
                      value={formLocalFare}
                      onChange={(e) => setFormLocalFare(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Outstation / KM rate *</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 11.0"
                      value={formOutstationRate}
                      onChange={(e) => setFormOutstationRate(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Driver Allowance / Day *</label>
                    <input
                      type="number"
                      placeholder="e.g. 300"
                      value={formAllowance}
                      onChange={(e) => setFormAllowance(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Section 3: Private Records */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border">
                <h4 className="text-xs uppercase font-bold text-primary border-b pb-1 flex items-center">
                  <Shield className="h-4 w-4 mr-1 text-secondary" />
                  Private Compliance & Admin details
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Registration Number</label>
                    <input
                      type="text"
                      placeholder="e.g. MP-13-CA-1234"
                      value={formReg}
                      onChange={(e) => setFormReg(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Insurance Expiry Date</label>
                    <input
                      type="date"
                      value={formInsurance}
                      onChange={(e) => setFormInsurance(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">State Permit Expiry Date</label>
                    <input
                      type="date"
                      value={formPermit}
                      onChange={(e) => setFormPermit(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-charcoal mb-2">Next Service Date</label>
                    <input
                      type="date"
                      value={formService}
                      onChange={(e) => setFormService(e.target.value)}
                      className="w-full bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="border-t border-gray-100 pt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingVehicle(null);
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
                  {loading ? 'Saving...' : 'Save Vehicle'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
