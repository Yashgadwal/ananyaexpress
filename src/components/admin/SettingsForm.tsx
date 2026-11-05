'use client';

import { useState } from 'react';
import { Save, Info, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface Settings {
  businessName: string;
  phone: string;
  whatsApp: string;
  email: string;
  addressFreeganj: string;
  addressNanakheda: string;
  businessHours: string;
  heroHeading: string;
  heroDescription: string;
  aboutText: string;
  experienceYears: number;
  tripsCompleted: number;
  fleetSize: number;
  socialFacebook?: string | null;
  socialInstagram?: string | null;
  socialTwitter?: string | null;
  googleMapsFreeganj?: string | null;
  googleMapsNanakheda?: string | null;
  justdialLink?: string | null;
  advancePaymentPercent: number;
  upiId: string;
  paymentGatewayActive: boolean;
  privacyPolicy?: string | null;
  termsConditions?: string | null;
  bookingPolicy?: string | null;
  cancellationPolicy?: string | null;
  refundPolicy?: string | null;
  driverDisclaimer?: string | null;
}

interface SettingsFormProps {
  initialSettings: Settings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: any = value;
    if (type === 'number') {
      parsedValue = parseInt(value) || 0;
    } else if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      parsedValue = e.target.checked;
    }

    setSettings(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setMessage('Settings updated successfully!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Business Profile' },
    { id: 'content', label: 'Homepage Content' },
    { id: 'maps', label: 'Addresses & Maps' },
    { id: 'policies', label: 'System Policies' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-4 sm:p-6 lg:p-8">
      {/* Tabs list */}
      <div className="flex border-b border-gray-100 pb-4 mb-6 gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold text-xs sm:text-sm rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-50 text-charcoal hover:bg-gray-150 border border-gray-150'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 text-xs sm:text-sm p-4 rounded-xl mb-6 border border-green-150 font-semibold flex items-center">
          <CheckCircle2 className="h-4.5 w-4.5 mr-2 shrink-0" />
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-4 rounded-xl mb-6 border border-red-150 font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Tab 1: General Profile */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2">Business Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Agency Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={settings.businessName}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Business Hours</label>
                <input
                  type="text"
                  name="businessHours"
                  value={settings.businessHours}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Primary Phone (Call Now)</label>
                <input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">WhatsApp Contact Number</label>
                <input
                  type="text"
                  name="whatsApp"
                  value={settings.whatsApp}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Booking Email</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Justdial Profile URL</label>
                <input
                  type="text"
                  name="justdialLink"
                  value={settings.justdialLink || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2 pt-4">Social Media Handles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Facebook Page</label>
                <input
                  type="text"
                  name="socialFacebook"
                  value={settings.socialFacebook || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Instagram Profile</label>
                <input
                  type="text"
                  name="socialInstagram"
                  value={settings.socialInstagram || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Twitter Profile</label>
                <input
                  type="text"
                  name="socialTwitter"
                  value={settings.socialTwitter || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Homepage Content */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2">Hero Section Texts</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Hero Title</label>
                <input
                  type="text"
                  name="heroHeading"
                  value={settings.heroHeading}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Hero Subtitle / Description</label>
                <textarea
                  name="heroDescription"
                  rows={2}
                  value={settings.heroDescription}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2 pt-4">Company Biography & Counters</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">About Us Description</label>
                <textarea
                  name="aboutText"
                  rows={4}
                  value={settings.aboutText}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Years of Experience</label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={settings.experienceYears}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Completed Trips</label>
                  <input
                    type="number"
                    name="tripsCompleted"
                    value={settings.tripsCompleted}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-charcoal mb-2">Fleet Size</label>
                  <input
                    type="number"
                    name="fleetSize"
                    value={settings.fleetSize}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Maps & Addresses */}
        {activeTab === 'maps' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2">Ujjain Freeganj Office (Head Office)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Freeganj Address</label>
                <input
                  type="text"
                  name="addressFreeganj"
                  value={settings.addressFreeganj}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Google Maps Embed Link (Freeganj)</label>
                <input
                  type="text"
                  name="googleMapsFreeganj"
                  value={settings.googleMapsFreeganj || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2 pt-4">Ujjain Nanakheda Office (Branch Office)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Nanakheda Address</label>
                <input
                  type="text"
                  name="addressNanakheda"
                  value={settings.addressNanakheda}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Google Maps Embed Link (Nanakheda)</label>
                <input
                  type="text"
                  name="googleMapsNanakheda"
                  value={settings.googleMapsNanakheda || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: System Policies & Financials */}
        {activeTab === 'policies' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2">Financials Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Advance Payment Percentage (%)</label>
                <input
                  type="number"
                  name="advancePaymentPercent"
                  value={settings.advancePaymentPercent}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">UPI ID (VPA)</label>
                <input
                  type="text"
                  name="upiId"
                  value={settings.upiId}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  required
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-primary uppercase tracking-wide border-b pb-2 pt-4">Editable Website Policies</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Privacy Policy Text</label>
                <textarea
                  name="privacyPolicy"
                  rows={2}
                  value={settings.privacyPolicy || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Terms & Conditions</label>
                <textarea
                  name="termsConditions"
                  rows={2}
                  value={settings.termsConditions || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Booking Policy</label>
                <textarea
                  name="bookingPolicy"
                  rows={2}
                  value={settings.bookingPolicy || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Cancellation Policy</label>
                <textarea
                  name="cancellationPolicy"
                  rows={2}
                  value={settings.cancellationPolicy || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Refund Policy</label>
                <textarea
                  name="refundPolicy"
                  rows={2}
                  value={settings.refundPolicy || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-charcoal mb-2">Driver & Vehicle Disclaimer</label>
                <textarea
                  name="driverDisclaimer"
                  rows={2}
                  value={settings.driverDisclaimer || ''}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save button footer */}
        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-secondary hover:bg-secondary-light text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center space-x-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{saving ? 'Saving updates...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
