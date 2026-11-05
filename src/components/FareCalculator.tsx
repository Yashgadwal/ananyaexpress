'use client';

import { useState, useEffect } from 'react';
import { Calculator, Info, Phone, MessageCircle } from 'lucide-react';

interface VehicleRate {
  id: string;
  name: string;
  category: string;
  localFare: number;
  outstationPerKm: number;
  driverAllowance: number;
  minKmRule: number;
}

interface FareCalculatorProps {
  vehicles: VehicleRate[];
  settings: {
    phone: string;
    whatsApp: string;
  };
}

export default function FareCalculator({ vehicles, settings }: FareCalculatorProps) {
  const [tripType, setTripType] = useState('Outstation'); // Outstation (Round Trip / One Way) or Local
  const [outstationType, setOutstationType] = useState('Round Trip');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  const [distance, setDistance] = useState(150); // initial 150 km
  const [days, setDays] = useState(1);
  const [includeTollParking, setIncludeTollParking] = useState(false);
  const [includeNightCharge, setIncludeNightCharge] = useState(false);

  const [calculation, setCalculation] = useState({
    baseFare: 0,
    driverAllowance: 0,
    tollParking: 0,
    nightCharge: 0,
    totalFare: 0,
    chargedKms: 0,
  });

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  useEffect(() => {
    if (!selectedVehicle) return;

    let baseFare = 0;
    let driverAllowance = 0;
    let tollParking = 0;
    let nightCharge = 0;
    let chargedKms = distance;

    if (tripType === 'Local') {
      // Local package e.g. 8 Hours / 80 Kms flat rate
      baseFare = selectedVehicle.localFare;
      driverAllowance = 0; // included in local package
      tollParking = includeTollParking ? 150 : 0;
      nightCharge = includeNightCharge ? 250 : 0;
    } else {
      // Outstation travel
      const rate = selectedVehicle.outstationPerKm;
      const minKmPerDay = selectedVehicle.minKmRule;
      const driverRate = selectedVehicle.driverAllowance;

      if (outstationType === 'Round Trip') {
        const minKmsTotal = minKmPerDay * days;
        chargedKms = Math.max(distance, minKmsTotal);
        baseFare = chargedKms * rate;
        driverAllowance = driverRate * days;
        tollParking = includeTollParking ? 300 * days : 0;
        nightCharge = includeNightCharge ? 250 * days : 0;
      } else {
        // One Way trip
        chargedKms = distance;
        baseFare = chargedKms * rate;
        driverAllowance = driverRate; // 1 day driver allowance
        tollParking = includeTollParking ? 300 : 0;
        nightCharge = includeNightCharge ? 250 : 0;
      }
    }

    const totalFare = baseFare + driverAllowance + tollParking + nightCharge;

    setCalculation({
      baseFare,
      driverAllowance,
      tollParking,
      nightCharge,
      totalFare,
      chargedKms,
    });
  }, [
    tripType,
    outstationType,
    selectedVehicleId,
    distance,
    days,
    includeTollParking,
    includeNightCharge,
    selectedVehicle,
  ]);

  const whatsappUrl = `https://wa.me/${settings.whatsApp.replace(/[^0-9]/g, '')}?text=Hello%20Ananya%20Express,%20I%20used%20your%20website%20calculator.%20I%20want%20to%20book%20a%20${selectedVehicle?.name || 'cab'}%20for%20a%20${tripType === 'Local' ? 'Local' : outstationType}%20trip.%20Distance:%20${distance}km,%20Days:%20${days}.%20Estimated%20fare:%20Rs%20${calculation.totalFare}.%20Please%20confirm.`;

  return (
    <div className="bg-cream rounded-2xl border border-amber-200 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto shadow-lg">
      <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-amber-200/50">
        <Calculator className="h-6 w-6 text-secondary" />
        <h3 className="text-xl font-bold text-primary font-display">Fare Estimate Calculator</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Fields */}
        <div className="space-y-5">
          {/* Trip Category */}
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2">Service Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTripType('Outstation')}
                className={`py-2.5 px-4 font-semibold text-xs sm:text-sm rounded-lg border transition-all ${
                  tripType === 'Outstation'
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
                }`}
              >
                Outstation Cab
              </button>
              <button
                type="button"
                onClick={() => setTripType('Local')}
                className={`py-2.5 px-4 font-semibold text-xs sm:text-sm rounded-lg border transition-all ${
                  tripType === 'Local'
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
                }`}
              >
                Ujjain Local Taxi
              </button>
            </div>
          </div>

          {/* Outstation Type (Conditional) */}
          {tripType === 'Outstation' && (
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2">Trip Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOutstationType('One Way')}
                  className={`py-2 px-3 font-semibold text-xs sm:text-sm rounded-lg border transition-all ${
                    outstationType === 'One Way'
                      ? 'bg-secondary text-white border-secondary shadow-sm'
                      : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  One Way Taxi
                </button>
                <button
                  type="button"
                  onClick={() => setOutstationType('Round Trip')}
                  className={`py-2 px-3 font-semibold text-xs sm:text-sm rounded-lg border transition-all ${
                    outstationType === 'Round Trip'
                      ? 'bg-secondary text-white border-secondary shadow-sm'
                      : 'bg-white text-charcoal border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Round Trip Taxi
                </button>
              </div>
            </div>
          )}

          {/* Vehicle Selection */}
          <div>
            <label className="block text-xs uppercase font-bold text-charcoal mb-2">Select Vehicle</label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-secondary focus:outline-none transition-all font-medium text-charcoal"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.category})
                </option>
              ))}
            </select>
          </div>

          {/* Distance Slider (for Outstation) */}
          {tripType === 'Outstation' && (
            <div>
              <div className="flex justify-between text-xs font-bold text-charcoal mb-2">
                <span className="uppercase">Approx. Distance</span>
                <span className="text-secondary">{distance} KMs</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="10"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>50 KMs</span>
                <span>500 KMs</span>
                <span>1000 KMs</span>
              </div>
            </div>
          )}

          {/* Number of Days (for Round Trip Outstation) */}
          {tripType === 'Outstation' && outstationType === 'Round Trip' && (
            <div>
              <label className="block text-xs uppercase font-bold text-charcoal mb-2">Number of Days</label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-secondary focus:outline-none transition-all font-medium text-charcoal"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                  <option key={day} value={day}>
                    {day} Day{day > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Checkbox Options */}
          <div className="space-y-2 pt-2">
            <label className="flex items-center space-x-2.5 text-sm font-semibold text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={includeTollParking}
                onChange={(e) => setIncludeTollParking(e.target.checked)}
                className="rounded border-gray-300 text-secondary focus:ring-secondary h-4 w-4"
              />
              <span>Include estimated Toll & Parking</span>
            </label>
            <label className="flex items-center space-x-2.5 text-sm font-semibold text-charcoal cursor-pointer">
              <input
                type="checkbox"
                checked={includeNightCharge}
                onChange={(e) => setIncludeNightCharge(e.target.checked)}
                className="rounded border-gray-300 text-secondary focus:ring-secondary h-4 w-4"
              />
              <span>Include Driver Night Charge (After 10 PM)</span>
            </label>
          </div>
        </div>

        {/* Calculation Result */}
        <div className="bg-white rounded-xl border border-amber-100 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
              Fare Summary
            </h4>

            {selectedVehicle && (
              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Vehicle Category:</span>
                  <span className="font-semibold text-charcoal">{selectedVehicle.category}</span>
                </div>
                {tripType === 'Outstation' ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rate per KM:</span>
                      <span className="font-semibold text-charcoal">Rs {selectedVehicle.outstationPerKm}/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Charged KMs:</span>
                      <span className="font-semibold text-charcoal">
                        {calculation.chargedKms} KMs
                        {outstationType === 'Round Trip' && (
                          <span className="text-xs text-gray-400 block text-right font-normal">
                            (Min. {selectedVehicle.minKmRule} km/day applied)
                          </span>
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Local package (8hr/80km):</span>
                    <span className="font-semibold text-charcoal">Rs {selectedVehicle.localFare}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-gray-50 pt-3">
                  <span className="text-gray-500">Base Running Charge:</span>
                  <span className="font-semibold text-charcoal">Rs {calculation.baseFare}</span>
                </div>

                {calculation.driverAllowance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Driver Allowance:</span>
                    <span className="font-semibold text-charcoal">Rs {calculation.driverAllowance}</span>
                  </div>
                )}

                {calculation.tollParking > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Est. Toll & Parking:</span>
                    <span className="font-semibold text-charcoal">Rs {calculation.tollParking}</span>
                  </div>
                )}

                {calculation.nightCharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Night Charges:</span>
                    <span className="font-semibold text-charcoal">Rs {calculation.nightCharge}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-5">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-bold text-primary">Estimated Total:</span>
              <span className="text-2xl font-bold text-secondary font-display">
                Rs {calculation.totalFare}
              </span>
            </div>

            <div className="bg-amber-50 rounded-lg p-3 flex items-start space-x-2 border border-amber-100 mb-5">
              <Info className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-normal">
                Estimated fare only. Tolls, state tax, and parking are estimates. Final fare will be confirmed by Ananya Express.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-whatsapp hover:bg-whatsapp-dark text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-1.5 text-xs shadow transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Book on WhatsApp</span>
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="bg-primary hover:bg-primary-light text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-1.5 text-xs shadow transition-colors animate-pulse"
                title="Calculator Call"
              >
                <Phone className="h-4 w-4" />
                <span>Call to Book</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
