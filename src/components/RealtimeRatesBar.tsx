import React, { useState } from 'react';
import { Search, Sparkles, RefreshCw, Fuel, Zap, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { ComparisonSettings, PetrolVehicleInput, EVVehicleInput } from '../types';

interface RealtimeRatesBarProps {
  settings: ComparisonSettings;
  setSettings: React.Dispatch<React.SetStateAction<ComparisonSettings>>;
  petrolInput: PetrolVehicleInput;
  setPetrolInput: React.Dispatch<React.SetStateAction<PetrolVehicleInput>>;
  evInput: EVVehicleInput;
  setEVInput: React.Dispatch<React.SetStateAction<EVVehicleInput>>;
}

export const RealtimeRatesBar: React.FC<RealtimeRatesBarProps> = ({
  settings,
  setSettings,
  petrolInput,
  setPetrolInput,
  evInput,
  setEVInput
}) => {
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSyncRates = async () => {
    setLoading(true);
    setError(null);
    setSyncStatus(null);

    try {
      const res = await fetch('/api/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationCityRegion: settings.locationCityRegion,
          currency: settings.currency
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        
        // Update petrol input
        setPetrolInput(prev => ({
          ...prev,
          petrolPricePerLiter: d.petrolPricePerLiter
        }));

        // Update EV inputs
        setEVInput(prev => ({
          ...prev,
          publicChargerRatePerKWh: d.publicChargerRatePerKWh,
          electricityTariff: {
            ...prev.electricityTariff,
            baseRatePerKWh: d.electricityRatePerKWh
          }
        }));

        // Update settings carbon intensity
        if (d.gridCarbonIntensity) {
          setSettings(prev => ({
            ...prev,
            gridCarbonIntensityGramsPerKWh: d.gridCarbonIntensity
          }));
        }

        setSyncStatus(`Updated rates for ${d.cityRegion}! Petrol: ${settings.currencySymbol}${d.petrolPricePerLiter}/L | Home EB: ${settings.currencySymbol}${d.electricityRatePerKWh}/kWh`);
      } else {
        setError('Unable to fetch live rates. Using default benchmarks.');
      }
    } catch (err: any) {
      console.error('Rates sync error:', err);
      setError('Network offline or error fetching live rates.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-800">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left Info & Location Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <Fuel className="w-5 h-5" />
          </div>

          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Real-Time Energy & Gas Monitor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            
            <div className="mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={settings.locationCityRegion}
                onChange={(e) => setSettings(prev => ({ ...prev, locationCityRegion: e.target.value }))}
                placeholder="Enter city or country (e.g. Delhi, California, London)"
                className="bg-slate-800 border border-slate-700 text-white text-xs sm:text-sm font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Live Metrics Display */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 w-full lg:w-auto text-xs sm:text-sm border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Fuel className="w-3 h-3 text-amber-400" /> Petrol Price
            </div>
            <div className="font-bold text-slate-100 text-sm sm:text-base mt-0.5">
              {settings.currencySymbol}{petrolInput.petrolPricePerLiter} <span className="text-[10px] font-normal text-slate-400">/ Liter</span>
            </div>
          </div>

          <div>
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" /> Home EB Tariff
            </div>
            <div className="font-bold text-slate-100 text-sm sm:text-base mt-0.5">
              {settings.currencySymbol}{evInput.electricityTariff.baseRatePerKWh} <span className="text-[10px] font-normal text-slate-400">/ kWh</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <div className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Public Fast Charger
            </div>
            <div className="font-bold text-slate-100 text-sm sm:text-base mt-0.5">
              {settings.currencySymbol}{evInput.publicChargerRatePerKWh} <span className="text-[10px] font-normal text-slate-400">/ kWh</span>
            </div>
          </div>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleSyncRates}
          disabled={loading}
          className="w-full lg:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Fetching Live Rates...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Sync Live Regional Rates</span>
            </>
          )}
        </button>

      </div>

      {/* Sync Notification Banner */}
      {syncStatus && (
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {error && (
        <div className="mt-3 py-1.5 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
