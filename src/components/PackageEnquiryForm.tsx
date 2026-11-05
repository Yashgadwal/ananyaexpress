'use client';

import { useState } from 'react';
import { Compass, Calendar, Users, Info, MessageCircle, Send } from 'lucide-react';

interface PackageEnquiryFormProps {
  packageId: string;
  packageName: string;
  packageDuration: string;
  settings: {
    whatsApp: string;
    phone: string;
  };
}

export default function PackageEnquiryForm({
  packageId,
  packageName,
  packageDuration,
  settings,
}: PackageEnquiryFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [travelDate, setTravelDate] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent, isWhatsAppSubmit = false) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !travelDate || !passengers) {
      setError('Please fill in all required fields.');
      return;
    }

    const phoneClean = phone.replace(/\s+/g, '');
    const phoneRegex = /^(\+91)?([6-9]\d{9})$/;
    if (!phoneRegex.test(phoneClean)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/package-enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: phoneClean,
          email,
          packageId,
          passengers: parseInt(passengers),
          travelDate,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setSuccess(true);

      if (isWhatsAppSubmit) {
        const waMsg = `Hello Ananya Express, I want to book the following tour package:

Package: ${packageName}
Duration: ${packageDuration}
Travel Date: ${travelDate}
Passengers: ${passengers}
Customer Name: ${name}
Special Requests: ${notes || 'None'}

Please share package quote and availability.`;

        const waNumber = settings.whatsApp.replace(/[^0-9]/g, '');
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;
        window.open(waUrl, '_blank');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50/50 border border-green-200 rounded-xl p-6 text-center space-y-4">
        <h3 className="text-lg font-bold text-primary font-display">Enquiry Submitted!</h3>
        <p className="text-xs text-gray-600">
          Thank you for your interest in the <strong>{packageName}</strong> package. Our travel experts will get in touch with you shortly.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              setSuccess(false);
              setName('');
              setPhone('');
              setEmail('');
              setPassengers('1');
              setTravelDate('');
              setNotes('');
            }}
            className="text-xs font-bold text-secondary hover:underline"
          >
            Submit Another Query
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg border border-red-100 font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[11px] uppercase font-bold text-charcoal mb-1">Your Name *</label>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
          required
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase font-bold text-charcoal mb-1">Mobile Number *</label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-500 font-bold text-sm">+91</span>
          <input
            type="tel"
            maxLength={10}
            placeholder="98765 XXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-slate-50 border border-gray-200 rounded-lg pl-11 pr-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all font-semibold"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] uppercase font-bold text-charcoal mb-1">Travel Date *</label>
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-[11px] uppercase font-bold text-charcoal mb-1">Passengers *</label>
          <select
            value={passengers}
            onChange={(e) => setPassengers(e.target.value)}
            className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num}>
                {num} Person{num > 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase font-bold text-charcoal mb-1">
          Email Address <span className="text-gray-400">(Optional)</span>
        </label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase font-bold text-charcoal mb-1">
          Custom Requirements <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Need hotel stay, special guide, specific food choices, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          type="button"
          disabled={loading}
          onClick={(e) => handleSubmit(e, true)}
          className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Query</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-secondary hover:bg-secondary-light text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Submit Request</span>
        </button>
      </div>
    </form>
  );
}
