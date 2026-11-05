'use client';

import { useState } from 'react';
import { Search, Download, Edit2, CheckCircle2, AlertTriangle, Printer, MessageCircle, X } from 'lucide-react';

interface Customer {
  name: string;
  phone: string;
  email?: string | null;
}

interface Vehicle {
  id: string;
  name: string;
  category: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string;
}

interface Booking {
  id: string;
  bookingRef: string;
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  returnDate?: string | null;
  tripType: string;
  passengerCount: number;
  luggageDetails?: string | null;
  specialRequest?: string | null;
  estimatedFare: number;
  finalFare?: number | null;
  paymentStatus: string;
  bookingStatus: string;
  assignedVehicleId?: string | null;
  assignedDriverId?: string | null;
  internalNotes?: string | null;
  bookingSource: string;
  createdAt: Date | string;
  customer: Customer;
  vehicle?: Vehicle | null;
  assignedDriver?: Driver | null;
}

interface BookingsManagerProps {
  initialBookings: Booking[];
  vehicles: { id: string; name: string; category: string }[];
  drivers: { id: string; name: string; phone: string }[];
}

export default function BookingsManager({ initialBookings, vehicles, drivers }: BookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Modal Edit states
  const [modalStatus, setModalStatus] = useState('');
  const [modalPayment, setModalPayment] = useState('');
  const [modalFare, setModalFare] = useState('');
  const [modalVehicle, setModalVehicle] = useState('');
  const [modalDriver, setModalDriver] = useState('');
  const [modalNotes, setModalNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Status Filter options
  const statusOptions = [
    'All',
    'New Enquiry',
    'Contacted',
    'Quote Sent',
    'Confirmed',
    'Driver Assigned',
    'Trip Started',
    'Trip Completed',
    'Cancelled'
  ];

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.bookingRef.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      b.customer.phone.includes(search) ||
      b.destination.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openEditModal = (b: Booking) => {
    setSelectedBooking(b);
    setModalStatus(b.bookingStatus);
    setModalPayment(b.paymentStatus);
    setModalFare(b.finalFare?.toString() || b.estimatedFare.toString() || '0');
    setModalVehicle(b.assignedVehicleId || '');
    setModalDriver(b.assignedDriverId || '');
    setModalNotes(b.internalNotes || '');
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setSaving(true);

    try {
      const response = await fetch(`/api/admin/bookings/${selectedBooking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingStatus: modalStatus,
          paymentStatus: modalPayment,
          finalFare: parseFloat(modalFare) || 0,
          assignedVehicleId: modalVehicle || null,
          assignedDriverId: modalDriver || null,
          internalNotes: modalNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking.');
      }

      // Update in local state
      setBookings(prev => prev.map(item => {
        if (item.id === selectedBooking.id) {
          return {
            ...item,
            bookingStatus: modalStatus,
            paymentStatus: modalPayment,
            finalFare: parseFloat(modalFare) || 0,
            assignedVehicleId: modalVehicle || null,
            assignedDriverId: modalDriver || null,
            internalNotes: modalNotes,
            // Re-map nested items for list updates
            vehicle: vehicles.find(v => v.id === modalVehicle),
            assignedDriver: drivers.find(d => d.id === modalDriver)
          } as any;
        }
        return item;
      }));

      setSelectedBooking(null);
    } catch (err) {
      alert('Error updating booking');
    } finally {
      setSaving(false);
    }
  };

  const handleSendWhatsApp = (b: Booking) => {
    const text = `Hello ${b.customer.name}, your taxi booking (${b.bookingRef}) with Ananya Express is ${b.bookingStatus}.
Route: ${b.pickupLocation} to ${b.destination}
Date: ${b.pickupDate} @ ${b.pickupTime}
Fare: Rs ${b.finalFare || b.estimatedFare}
${b.assignedDriver ? `Driver: ${b.assignedDriver.name} (${b.assignedDriver.phone})` : ''}
Thank you for traveling with us!`;

    const waUrl = `https://wa.me/${b.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handlePrintReceipt = (b: Booking) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Booking Invoice - ${b.bookingRef}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #0F294A; padding-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0F294A; margin-bottom: 5px; }
            .subtitle { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            .details-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            .details-table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
            .details-table td.label { font-weight: bold; color: #555; width: 40%; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/images/logo.png" alt="Ananya Express" style="height: 60px; object-fit: contain; margin-bottom: 8px;" />
            <div class="title">ANANYA EXPRESS</div>
            <div class="subtitle">Taxi Services & Tour Operators Ujjain</div>
            <p style="font-size: 12px; margin-top: 5px;">Contact: +91 94250 82701 | Email: booking@ananyaexpress.com</p>
          </div>
          <h3 style="text-align: center; margin-top: 20px; color: #E65C00;">BOOKING INVOICE / RECEIPT</h3>
          <table class="details-table">
            <tr><td class="label">Booking Reference:</td><td style="font-family: monospace; font-weight: bold;">${b.bookingRef}</td></tr>
            <tr><td class="label">Customer Name:</td><td>${b.customer.name}</td></tr>
            <tr><td class="label">Customer Phone:</td><td>${b.customer.phone}</td></tr>
            <tr><td class="label">Trip Type:</td><td>${b.tripType}</td></tr>
            <tr><td class="label">Route:</td><td>${b.pickupLocation} to ${b.destination}</td></tr>
            <tr><td class="label">Pickup Schedule:</td><td>${b.pickupDate} at ${b.pickupTime}</td></tr>
            <tr><td class="label">Passenger Count:</td><td>${b.passengerCount} Persons</td></tr>
            <tr><td class="label">Assigned Vehicle:</td><td>${b.vehicle ? `${b.vehicle.name} (${b.vehicle.category})` : 'Pending Assignment'}</td></tr>
            <tr><td class="label">Assigned Driver:</td><td>${b.assignedDriver ? `${b.assignedDriver.name} (${b.assignedDriver.phone})` : 'Pending Assignment'}</td></tr>
            <tr><td class="label">Booking Status:</td><td style="font-weight: bold;">${b.bookingStatus}</td></tr>
            <tr><td class="label">Payment Status:</td><td style="font-weight: bold;">${b.paymentStatus}</td></tr>
            <tr style="background: #FAF8F5; font-size: 16px;"><td class="label" style="color: #0F294A;">Total Billable Fare:</td><td style="font-weight: bold; color: #E65C00;">Rs ${b.finalFare || b.estimatedFare}</td></tr>
          </table>
          <div class="footer">
            <p>Thank you for choosing Ananya Express. Have a safe journey!</p>
            <p>Freeganj • Nanakheda • Ujjain • Madhya Pradesh</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportToCSV = () => {
    const headers = ['Ref', 'Customer Name', 'Phone', 'Trip Type', 'Pickup', 'Destination', 'Date', 'Time', 'Status', 'Payment', 'Estimated Fare', 'Final Fare'];
    const rows = filteredBookings.map(b => [
      b.bookingRef,
      b.customer.name,
      b.customer.phone,
      b.tripType,
      b.pickupLocation,
      b.destination,
      b.pickupDate,
      b.pickupTime,
      b.bookingStatus,
      b.paymentStatus,
      b.estimatedFare,
      b.finalFare || ''
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookings_ananya_express_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-150 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search ref, customer, destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:border-secondary focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-250 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none flex-1 sm:flex-initial"
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <button
            onClick={exportToCSV}
            className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Bookings List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-gray-400 uppercase font-bold border-b border-gray-150">
                <th className="py-4 px-4">Booking Ref</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Trip Details</th>
                <th className="py-4 px-4">Vehicle Pref</th>
                <th className="py-4 px-4">Booking Status</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4 text-right">Fare</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-charcoal font-semibold">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50">
                  <td className="py-4 px-4 font-mono text-secondary text-sm">
                    {b.bookingRef}
                  </td>
                  <td className="py-4 px-4">
                    <div>{b.customer.name}</div>
                    <div className="text-[10px] text-gray-400 font-semibold">{b.customer.phone}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-primary font-bold">{b.tripType}</div>
                    <div className="text-[10px] text-gray-400 font-semibold">{b.pickupLocation} → {b.destination}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{b.pickupDate} at {b.pickupTime}</div>
                  </td>
                  <td className="py-4 px-4 text-[11px]">
                    {b.vehicle ? (
                      <div>{b.vehicle.name}</div>
                    ) : (
                      <span className="text-gray-400 italic">None Selected</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.bookingStatus === 'New Enquiry' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      b.bookingStatus === 'Confirmed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      b.bookingStatus === 'Trip Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border border-green-100' :
                      'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-bold text-primary">
                    Rs {b.finalFare || b.estimatedFare}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1 text-slate-500 hover:text-primary hover:bg-slate-100 rounded"
                        title="Edit Booking"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendWhatsApp(b)}
                        className="p-1 text-whatsapp hover:text-whatsapp-dark hover:bg-green-50 rounded"
                        title="WhatsApp Customer"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePrintReceipt(b)}
                        className="p-1 text-slate-500 hover:text-secondary hover:bg-slate-100 rounded"
                        title="Print Receipt"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 italic">
                    No bookings match your current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Booking Dialog Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-gray-150 overflow-hidden shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="bg-primary text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold font-display">Manage Booking: {selectedBooking.bookingRef}</h3>
                <span className="text-[10px] text-accent uppercase font-bold tracking-wider">Source: {selectedBooking.bookingSource}</span>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBooking} className="p-6 space-y-6">
              {/* Customer summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-gray-150 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-charcoal">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Client Name</span>
                  <span>{selectedBooking.customer.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Client Phone</span>
                  <span>{selectedBooking.customer.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Trip Type</span>
                  <span className="text-secondary">{selectedBooking.tripType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase block font-bold">Route Schedule</span>
                  <span className="truncate block">{selectedBooking.pickupLocation} to {selectedBooking.destination}</span>
                </div>
              </div>

              {/* Status & Payment dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Booking Status</label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none"
                  >
                    {statusOptions.slice(1).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Payment Status</label>
                  <select
                    value={modalPayment}
                    onChange={(e) => setModalPayment(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Final Fare (Rs)</label>
                  <input
                    type="number"
                    value={modalFare}
                    onChange={(e) => setModalFare(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Vehicle & Driver Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Assign Vehicle</label>
                  <select
                    value={modalVehicle}
                    onChange={(e) => setModalVehicle(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none"
                  >
                    <option value="">Pending Assignment</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Assign Driver</label>
                  <select
                    value={modalDriver}
                    onChange={(e) => setModalDriver(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-250 rounded-lg px-3 py-2 text-xs font-semibold text-charcoal focus:outline-none"
                  >
                    <option value="">Pending Assignment</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Internal Notes</label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none resize-none"
                />
              </div>

              {/* Modal footer actions */}
              <div className="border-t border-gray-100 pt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-charcoal font-bold py-2 px-4 rounded-lg text-xs transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-secondary hover:bg-secondary-light text-white font-bold py-2 px-5 rounded-lg text-xs shadow transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
