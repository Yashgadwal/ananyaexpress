'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Car, CheckCircle2, MessageCircle, ArrowRight, Info } from 'lucide-react';

interface VehicleOption {
  id: string;
  name: string;
  category: string;
}

interface BookingFormProps {
  vehicles: VehicleOption[];
  settings: {
    whatsApp: string;
    phone: string;
  };
}

export default function BookingForm({ vehicles, settings }: BookingFormProps) {
  const [tripType, setTripType] = useState('Local');
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengerCount, setPassengerCount] = useState('1');
  const [vehicleId, setVehicleId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent, isWhatsAppSubmit = false) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (!pickupLocation || !destination || !pickupDate || !pickupTime || !customerName || !customerPhone) {
      setError('Please fill in all required fields.');
      return;
    }

    const phoneClean = customerPhone.replace(/\s+/g, '');
    const phoneRegex = /^(\+91)?([6-9]\d{9})$/;
    if (!phoneRegex.test(phoneClean)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);

    const bookingPayload = {
      tripType,
      pickupLocation,
      destination,
      pickupDate,
      pickupTime,
      returnDate: tripType === 'Round Trip' ? returnDate : null,
      passengerCount: parseInt(passengerCount),
      vehicleId: vehicleId || null,
      customerName,
      customerPhone: phoneClean,
      customerEmail,
      specialRequest,
      bookingSource: isWhatsAppSubmit ? 'WhatsApp' : 'Website',
      estimatedFare: 0, // Admin calculates final fare
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setBookingRef(data.bookingRef);
      setSuccess(true);

      if (isWhatsAppSubmit) {
        // Prefilled message format
        const selectedVehicle = vehicles.find(v => v.id === vehicleId)?.name || 'Any Car';
        const returnText = tripType === 'Round Trip' ? `\nReturn Date: ${returnDate}` : '';
        const waMsg = `Hello Ananya Express, I want to book a taxi.

Trip Type: ${tripType}
Pickup: ${pickupLocation}
Destination: ${destination}
Date: ${pickupDate}
Time: ${pickupTime}${returnText}
Passengers: ${passengerCount}
Vehicle: ${selectedVehicle}

Please share availability and final price.`;

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

  const tripTypes = ['Local', 'One Way', 'Round Trip', 'Airport Transfer', 'Tour Package'];

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100 text-center max-w-2xl mx-auto animate-scale-in">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-primary font-display mb-2">Booking Submitted Successfully!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for choosing Ananya Express. Your enquiry has been received.
        </p>
        
        <div className="bg-cream rounded-xl p-5 mb-6 border border-amber-200 inline-block">
          <span className="text-xs uppercase font-semibold text-gray-500 block">Your Booking Reference Number</span>
          <span className="text-2xl font-mono font-bold text-primary tracking-wider">{bookingRef}</span>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Our team is checking vehicle availability and will contact you within 15 minutes with the best quotation.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={`tel:${settings.phone}`}
            className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
          >
            <span>Call for Quick Support</span>
          </a>
          <button
            onClick={() => {
              setSuccess(false);
              // Reset form
              setPickupLocation('');
              setDestination('');
              setPickupDate('');
              setPickupTime('');
              setReturnDate('');
              setCustomerName('');
              setCustomerPhone('');
              setCustomerEmail('');
              setSpecialRequest('');
            }}
            className="bg-gray-100 hover:bg-gray-200 text-charcoal font-bold py-3 px-6 rounded-lg transition-colors text-sm"
          >
            Book Another Taxi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="booking-form" className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 max-w-4xl mx-auto scroll-mt-24">
      <h3 className="text-lg sm:text-xl font-bold text-primary font-display mb-4 text-center sm:text-left flex items-center justify-center sm:justify-start">
        <Car className="h-5 w-5 text-secondary mr-2" />
        Quick Taxi Booking & Quotation
      </h3>

      {/* Trip Type Tabs */}
      <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start border-b border-gray-100 pb-4 mb-6">
        {tripTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
              tripType === type
                ? 'bg-primary text-white shadow-md'
                : 'bg-light-bg text-charcoal hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-4 rounded-lg mb-6 border border-red-100 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Row 1: Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
              <MapPin className="h-3.5 w-3.5 text-secondary mr-1" />
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ujjain Railway Station, Freeganj"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
              <MapPin className="h-3.5 w-3.5 text-secondary mr-1" />
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mahakaleshwar Temple, Indore Airport"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Row 2: Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
              <Calendar className="h-3.5 w-3.5 text-secondary mr-1" />
              Pickup Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
              <Clock className="h-3.5 w-3.5 text-secondary mr-1" />
              Pickup Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              required
            />
          </div>
          {tripType === 'Round Trip' ? (
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
                <Calendar className="h-3.5 w-3.5 text-secondary mr-1" />
                Return Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                min={pickupDate || new Date().toISOString().split('T')[0]}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
                required={tripType === 'Round Trip'}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
                <Users className="h-3.5 w-3.5 text-secondary mr-1" />
                Passengers
              </label>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} Passenger{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Row 3: Vehicle Preference & Passengers (if round trip) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
              <Car className="h-3.5 w-3.5 text-secondary mr-1" />
              Vehicle Preference
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
            >
              <option value="">Any Vehicle (Recommended for Best Rates)</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>
          {tripType === 'Round Trip' && (
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2 flex items-center">
                <Users className="h-3.5 w-3.5 text-secondary mr-1" />
                Passengers
              </label>
              <select
                value={passengerCount}
                onChange={(e) => setPassengerCount(e.target.value)}
                className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <option key={num} value={num}>
                    {num} Passenger{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* User Contact Details */}
        <div className="border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-4">Customer Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-500 font-bold text-sm">+91</span>
                <input
                  type="tel"
                  placeholder="98765 XXXXX"
                  maxLength={10}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-light-bg border border-transparent rounded-lg pl-12 pr-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all font-semibold"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2">
                Email Address <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-xs uppercase font-bold text-charcoal mb-2">
            Special Requests / Instructions <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="Add any specific request like 'AC should work all time', 'Need clean carrier for luggage', etc."
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            className="w-full bg-light-bg border border-transparent rounded-lg px-4 py-3 text-sm focus:border-secondary focus:bg-white focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Form Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e, true)}
            className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{loading ? 'Please wait...' : 'Book on WhatsApp'}</span>
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-secondary hover:bg-secondary-light text-white font-bold py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm shadow-md cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Submitting...' : 'Check Availability & Get Quote'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="bg-amber-50 rounded-lg p-3.5 border border-amber-100 flex items-start space-x-2.5 mt-6">
        <Info className="h-4.5 w-4.5 text-secondary shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-normal">
          <strong>Important Note:</strong> The prices generated or discussed are initial estimates. The final fare depends on the exact route, actual toll charges, parking, and driver allowances which will be confirmed via phone or WhatsApp.
        </p>
      </div>
    </div>
  );
}
