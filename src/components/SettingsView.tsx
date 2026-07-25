import React from 'react';
import { ComparisonSettings, CurrencyCode, DistanceUnit } from '../types';
import { Settings, Globe, Shield, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { clearLocalStorage } from '../utils/exportUtils';

interface SettingsViewProps {
  settings: ComparisonSettings;
  setSettings: React.Dispatch<React.SetStateAction<ComparisonSettings>>;
  onReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  onReset
}) => {
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  const handleCurrencyChange = (currency: CurrencyCode) => {
    const symbols: Record<CurrencyCode, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };
    setSettings(prev => ({
      ...prev,
      currency,
      currencySymbol: symbols[currency]
    }));
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear stored settings and reset to defaults?')) {
      clearLocalStorage();
      onReset();
      triggerSaveToast();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wide">
              Application Settings & Preferences
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Configure currency units, driving distance standards, carbon grid mix, and local storage cache.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Currency & Market Config */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-3">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Currency & Regional Market</span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-zinc-400">Active Currency</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { code: 'INR', label: 'Indian Rupee (₹)' },
                { code: 'USD', label: 'US Dollar ($)' },
                { code: 'EUR', label: 'Euro (€)' },
                { code: 'GBP', label: 'British Pound (£)' },
              ].map(c => (
                <button
                  key={c.code}
                  onClick={() => handleCurrencyChange(c.code as CurrencyCode)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    settings.currency === c.code
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>{c.label}</span>
                  {settings.currency === c.code && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-medium text-zinc-400">Distance Unit</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { code: 'km', label: 'Kilometers (km)' },
                { code: 'miles', label: 'Miles (mi)' },
              ].map(d => (
                <button
                  key={d.code}
                  onClick={() => {
                    setSettings(prev => ({ ...prev, distanceUnit: d.code as DistanceUnit }));
                    triggerSaveToast();
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                    settings.distanceUnit === d.code
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span>{d.label}</span>
                  {settings.distanceUnit === d.code && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Driving & Grid Carbon Parameters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Commute & Grid Defaults</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Default Annual Mileage ({settings.distanceUnit})</span>
              <span className="font-bold text-emerald-400">{settings.annualKm.toLocaleString()} {settings.distanceUnit}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={settings.annualKm}
              onChange={(e) => setSettings(prev => ({ ...prev, annualKm: Number(e.target.value) }))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-400">Ownership Evaluation Tenure</span>
              <span className="font-bold text-cyan-400">{settings.ownershipYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={settings.ownershipYears}
              onChange={(e) => setSettings(prev => ({ ...prev, ownershipYears: Number(e.target.value) }))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-zinc-400">Grid Carbon Intensity Preset (g CO2/kWh)</label>
            <select
              value={settings.gridCarbonIntensityGramsPerKWh}
              onChange={(e) => setSettings(prev => ({ ...prev, gridCarbonIntensityGramsPerKWh: Number(e.target.value) }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 font-bold focus:outline-none focus:border-emerald-500"
            >
              <option value="550">India Average Grid (550 g CO2/kWh - Thermal Mix)</option>
              <option value="400">Moderate Green Grid (400 g CO2/kWh)</option>
              <option value="150">High Renewable Mix (150 g CO2/kWh - Solar/Wind/Hydro)</option>
              <option value="50">Nuclear / Hydro Pure Mix (50 g CO2/kWh)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Storage & Data Management Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>Local Storage & Cache Management</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Project PEV automatically persists your customized inputs, vehicle choices, and regional tariff configurations in your browser's local storage.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-zinc-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Inputs to Preset</span>
          </button>
          <button
            onClick={handleClearCache}
            className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer border border-rose-500/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear LocalStorage Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
};
