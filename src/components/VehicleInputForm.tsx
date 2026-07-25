import React, { useState } from 'react';
import {
  ComparisonSettings,
  PetrolVehicleInput,
  EVVehicleInput,
  CurrencyCode,
  DistanceUnit
} from '../types';
import {
  Car,
  Zap,
  Fuel,
  Sliders,
  Battery,
  Sun,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface VehicleInputFormProps {
  settings: ComparisonSettings;
  setSettings: React.Dispatch<React.SetStateAction<ComparisonSettings>>;
  petrolInput: PetrolVehicleInput;
  setPetrolInput: React.Dispatch<React.SetStateAction<PetrolVehicleInput>>;
  evInput: EVVehicleInput;
  setEVInput: React.Dispatch<React.SetStateAction<EVVehicleInput>>;
}

export const VehicleInputForm: React.FC<VehicleInputFormProps> = ({
  settings,
  setSettings,
  petrolInput,
  setPetrolInput,
  evInput,
  setEVInput
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'petrol' | 'ev' | 'eb_bill' | 'bass' | 'battery'>('general');
  const [fetchingPetrol, setFetchingPetrol] = useState(false);
  const [fetchingEV, setFetchingEV] = useState(false);
  const [fetchingEBSlabs, setFetchingEBSlabs] = useState(false);
  const [apiStatusNote, setApiStatusNote] = useState<string | null>(null);

  const handleCurrencyChange = (curr: CurrencyCode) => {
    const symbol = curr === 'INR' ? '₹' : curr === 'EUR' ? '€' : curr === 'GBP' ? '£' : '$';
    setSettings(prev => ({ ...prev, currency: curr, currencySymbol: symbol }));
  };

  const handleFetchPetrolPrice = async () => {
    setFetchingPetrol(true);
    setApiStatusNote(null);
    try {
      const res = await fetch('/api/vehicle-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: petrolInput.modelName,
          cityRegion: settings.locationCityRegion,
          fuelType: 'petrol',
          currency: settings.currency
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setPetrolInput(prev => ({
          ...prev,
          purchasePrice: d.totalOnRoadPrice || d.exShowroomPrice,
          annualInsurance: d.estimatedInsurance || prev.annualInsurance
        }));
        setApiStatusNote(`Live On-Road Price fetched for ${d.modelName} in ${d.cityRegion}: ${settings.currencySymbol}${d.totalOnRoadPrice?.toLocaleString() || d.exShowroomPrice?.toLocaleString()}`);
      }
    } catch (err) {
      console.error(err);
      setApiStatusNote('Failed to fetch live vehicle pricing.');
    } finally {
      setFetchingPetrol(false);
    }
  };

  const handleFetchEVPrice = async () => {
    setFetchingEV(true);
    setApiStatusNote(null);
    try {
      const res = await fetch('/api/vehicle-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: evInput.modelName,
          cityRegion: settings.locationCityRegion,
          fuelType: 'ev',
          currency: settings.currency
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setEVInput(prev => ({
          ...prev,
          standardPurchasePrice: d.totalOnRoadPrice || d.exShowroomPrice,
          bassChassisPrice: d.bassChassisPrice || Math.round((d.totalOnRoadPrice || d.exShowroomPrice) * 0.7),
          governmentSubsidies: d.stateEVSubsidy || prev.governmentSubsidies,
          annualInsurance: d.estimatedInsurance || prev.annualInsurance
        }));
        setApiStatusNote(`Live EV Pricing & Subsidies synced for ${d.modelName} in ${d.cityRegion}! Standard: ${settings.currencySymbol}${d.totalOnRoadPrice?.toLocaleString()} | BaaS Chassis: ${settings.currencySymbol}${d.bassChassisPrice?.toLocaleString()}`);
      }
    } catch (err) {
      console.error(err);
      setApiStatusNote('Failed to fetch live EV pricing.');
    } finally {
      setFetchingEV(false);
    }
  };

  const handleFetchEBSlabs = async () => {
    setFetchingEBSlabs(true);
    setApiStatusNote(null);
    try {
      const res = await fetch('/api/eb-slabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityRegion: settings.locationCityRegion,
          currency: settings.currency
        })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setEVInput(prev => ({
          ...prev,
          electricityTariff: {
            ...prev.electricityTariff,
            baseRatePerKWh: d.baseRatePerKWh,
            offPeakRatePerKWh: d.offPeakRatePerKWh || prev.electricityTariff.offPeakRatePerKWh
          }
        }));
        setApiStatusNote(`Live ${d.discomName} DISCOM tariff slabs loaded for ${d.cityRegion}! Base: ${settings.currencySymbol}${d.baseRatePerKWh}/kWh | Night Off-peak: ${settings.currencySymbol}${d.offPeakRatePerKWh}/kWh`);
      }
    } catch (err) {
      console.error(err);
      setApiStatusNote('Failed to fetch state DISCOM electricity tariffs.');
    } finally {
      setFetchingEBSlabs(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 p-1.5 gap-1 scrollbar-none">
        
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-zinc-700 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-emerald-500" />
          <span>General & Driving</span>
        </button>

        <button
          onClick={() => setActiveTab('petrol')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'petrol'
              ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-zinc-700 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Fuel className="w-3.5 h-3.5 text-amber-500" />
          <span>Petrol Vehicle</span>
        </button>

        <button
          onClick={() => setActiveTab('ev')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'ev'
              ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-zinc-700 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span>EV Purchase</span>
        </button>

        <button
          onClick={() => setActiveTab('eb_bill')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'eb_bill'
              ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-zinc-700 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-yellow-500" />
          <span>Home EB Tariff</span>
        </button>

        <button
          onClick={() => setActiveTab('bass')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'bass'
              ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-zinc-700 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>BASS Rental Slabs</span>
        </button>

        <button
          onClick={() => setActiveTab('battery')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'battery'
              ? 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-zinc-700 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          <Battery className="w-3.5 h-3.5 text-rose-500" />
          <span>Battery Aging</span>
        </button>

      </div>

      {/* Status Note Banner */}
      {apiStatusNote && (
        <div className="mx-5 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{apiStatusNote}</span>
          </div>
          <button
            onClick={() => setApiStatusNote(null)}
            className="text-[10px] text-zinc-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Content Panel */}
      <div className="p-5 sm:p-6">

        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Currency */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Currency Code
                </label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleCurrencyChange(c)}
                      className={`py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        settings.currency === c
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Unit */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Distance Unit
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  {(['km', 'miles'] as DistanceUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, distanceUnit: u }))}
                      className={`py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer capitalize ${
                        settings.distanceUnit === u
                          ? 'bg-slate-800 text-white dark:bg-slate-700 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Distance */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Annual Driving Distance
                  </label>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {settings.annualKm.toLocaleString()} {settings.distanceUnit} / year
                  </span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="50000"
                  step="1000"
                  value={settings.annualKm}
                  onChange={(e) => setSettings(prev => ({ ...prev, annualKm: Number(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>3,000</span>
                  <span>15,000 (Avg)</span>
                  <span>50,000</span>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              
              {/* Ownership Duration */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Ownership Horizon (Years)
                </label>
                <select
                  value={settings.ownershipYears}
                  onChange={(e) => setSettings(prev => ({ ...prev, ownershipYears: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(y => (
                    <option key={y} value={y}>{y} Years Comparison</option>
                  ))}
                </select>
              </div>

              {/* Grid Carbon Intensity */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Grid Carbon Intensity (g CO2 / kWh)
                </label>
                <input
                  type="number"
                  value={settings.gridCarbonIntensityGramsPerKWh}
                  onChange={(e) => setSettings(prev => ({ ...prev, gridCarbonIntensityGramsPerKWh: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">Average: 400-600 g/kWh for thermal grid, ~150 g/kWh for clean solar/hydro mix.</p>
              </div>

            </div>
          </div>
        )}

        {/* 2. PETROL TAB */}
        {activeTab === 'petrol' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl gap-2">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                Fetch live on-road price & RTO taxes for <span className="font-bold underline">{settings.locationCityRegion}</span>
              </div>
              <button
                type="button"
                onClick={handleFetchPetrolPrice}
                disabled={fetchingPetrol}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs"
              >
                {fetchingPetrol ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-200" />}
                <span>{fetchingPetrol ? "Fetching Live..." : `Fetch Live On-Road Price`}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Vehicle Model Name
                </label>
                <input
                  type="text"
                  value={petrolInput.modelName}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, modelName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  On-Road Purchase Price ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={petrolInput.purchasePrice}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Down Payment ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={petrolInput.downPayment}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Fuel Economy ({settings.distanceUnit}/Liter)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={petrolInput.fuelEfficiencyKmPerLiter}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, fuelEfficiencyKmPerLiter: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Petrol Price ({settings.currencySymbol} / Liter)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={petrolInput.petrolPricePerLiter}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, petrolPricePerLiter: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Annual Petrol Price Inflation (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={petrolInput.petrolInflationRate}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, petrolInflationRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Annual Insurance ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={petrolInput.annualInsurance}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, annualInsurance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Annual Maintenance ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={petrolInput.annualMaintenance}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, annualMaintenance: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Resale Value % After {settings.ownershipYears} Yrs
                </label>
                <input
                  type="number"
                  value={petrolInput.resaleValuePercentage}
                  onChange={(e) => setPetrolInput(prev => ({ ...prev, resaleValuePercentage: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

            </div>
          </div>
        )}

        {/* 3. EV PURCHASE TAB */}
        {activeTab === 'ev' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl gap-2">
              <div className="text-xs text-cyan-800 dark:text-cyan-300">
                <span className="font-bold">Standard vs BASS (Battery as a Service):</span> Standard EV includes battery. BASS buys vehicle chassis upfront & rents battery.
              </div>
              <button
                type="button"
                onClick={handleFetchEVPrice}
                disabled={fetchingEV}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs self-start sm:self-auto"
              >
                {fetchingEV ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-200" />}
                <span>{fetchingEV ? "Searching Live..." : `Fetch Live EV Pricing & Subsidies`}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  EV Model Name
                </label>
                <input
                  type="text"
                  value={evInput.modelName}
                  onChange={(e) => setEVInput(prev => ({ ...prev, modelName: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Standard Full Price w/ Battery ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={evInput.standardPurchasePrice}
                  onChange={(e) => setEVInput(prev => ({ ...prev, standardPurchasePrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1 font-bold">
                  BASS Chassis Price w/o Battery ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={evInput.bassChassisPrice}
                  onChange={(e) => setEVInput(prev => ({ ...prev, bassChassisPrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Govt Subsidy / Rebate ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={evInput.governmentSubsidies}
                  onChange={(e) => setEVInput(prev => ({ ...prev, governmentSubsidies: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Home Charger Installation Cost ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={evInput.homeChargerCost}
                  onChange={(e) => setEVInput(prev => ({ ...prev, homeChargerCost: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  EV Efficiency ({settings.distanceUnit} / kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={evInput.evEfficiencyKmPerKWh}
                  onChange={(e) => setEVInput(prev => ({ ...prev, evEfficiencyKmPerKWh: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  % Home AC Charging vs Public Fast Charging
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={evInput.homeChargingPercentage}
                    onChange={(e) => setEVInput(prev => ({ ...prev, homeChargingPercentage: Number(e.target.value) }))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 w-12 text-right">
                    {evInput.homeChargingPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Public Fast Charger Rate ({settings.currencySymbol} / kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={evInput.publicChargerRatePerKWh}
                  onChange={(e) => setEVInput(prev => ({ ...prev, publicChargerRatePerKWh: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

            </div>
          </div>
        )}

        {/* 4. HOME EB TARIFF TAB */}
        {activeTab === 'eb_bill' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl gap-2">
              <div className="text-xs text-yellow-800 dark:text-yellow-300">
                <span className="font-bold">Electricity Bill Impact Calculator:</span> Tiered slab jumps, night off-peak discounts & solar offsets.
              </div>
              <button
                type="button"
                onClick={handleFetchEBSlabs}
                disabled={fetchingEBSlabs}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-xs self-start sm:self-auto"
              >
                {fetchingEBSlabs ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-100" />}
                <span>{fetchingEBSlabs ? "Searching DISCOM..." : `Fetch Live DISCOM Slabs`}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Base Electricity Tariff ({settings.currencySymbol} / kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={evInput.electricityTariff.baseRatePerKWh}
                  onChange={(e) => setEVInput(prev => ({
                    ...prev,
                    electricityTariff: { ...prev.electricityTariff, baseRatePerKWh: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Tariff Structure
                </label>
                <select
                  value={evInput.electricityTariff.tariffType}
                  onChange={(e) => setEVInput(prev => ({
                    ...prev,
                    electricityTariff: { ...prev.electricityTariff, tariffType: e.target.value as any }
                  }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <option value="flat">Flat Rate per kWh</option>
                  <option value="tiered">Tiered / Slab Rate (Higher units = higher rate)</option>
                  <option value="time_of_use">Time of Use / Off-Peak Night Discount</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Off-Peak Night Tariff Rate ({settings.currencySymbol} / kWh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={evInput.electricityTariff.offPeakRatePerKWh || 0}
                  onChange={(e) => setEVInput(prev => ({
                    ...prev,
                    electricityTariff: { ...prev.electricityTariff, offPeakRatePerKWh: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  % Night / Off-Peak Charging Done
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={evInput.electricityTariff.offPeakUsagePercentage}
                    onChange={(e) => setEVInput(prev => ({
                      ...prev,
                      electricityTariff: { ...prev.electricityTariff, offPeakUsagePercentage: Number(e.target.value) }
                    }))}
                    className="w-full accent-yellow-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 w-12 text-right">
                    {evInput.electricityTariff.offPeakUsagePercentage}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Home Solar PV Offset %
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={evInput.electricityTariff.solarOffsetPercentage}
                    onChange={(e) => setEVInput(prev => ({
                      ...prev,
                      electricityTariff: { ...prev.electricityTariff, solarOffsetPercentage: Number(e.target.value) }
                    }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 w-12 text-right">
                    {evInput.electricityTariff.solarOffsetPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Household Baseline Monthly Units (kWh)
                </label>
                <input
                  type="number"
                  value={evInput.electricityTariff.baselineHouseholdUnitsMonth}
                  onChange={(e) => setEVInput(prev => ({
                    ...prev,
                    electricityTariff: { ...prev.electricityTariff, baselineHouseholdUnitsMonth: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

            </div>
          </div>
        )}

        {/* 5. BASS RENTAL SLABS TAB */}
        {activeTab === 'bass' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-800 dark:text-indigo-300">
              <span className="font-bold">Battery as a Service (BASS) Subscription Parameters:</span> BASS replaces heavy upfront battery capital with a monthly battery rental plan. Includes free battery replacements & upgrades whenever capacity drops!
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1 font-bold">
                  Base Monthly Battery Subscription ({settings.currencySymbol} / mo)
                </label>
                <input
                  type="number"
                  value={evInput.bassMonthlyRental}
                  onChange={(e) => setEVInput(prev => ({ ...prev, bassMonthlyRental: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Included Free Mileage / Month ({settings.distanceUnit})
                </label>
                <input
                  type="number"
                  value={evInput.bassIncludedKmPerMonth}
                  onChange={(e) => setEVInput(prev => ({ ...prev, bassIncludedKmPerMonth: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Extra Charge Above Limit ({settings.currencySymbol} / {settings.distanceUnit})
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={evInput.bassExtraChargePerKm}
                  onChange={(e) => setEVInput(prev => ({ ...prev, bassExtraChargePerKm: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

            </div>
          </div>
        )}

        {/* 6. BATTERY AGING TAB */}
        {activeTab === 'battery' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-800 dark:text-rose-300">
              <span className="font-bold">Battery Degradation Estimator:</span> Standard EV batteries lose ~1.5% to 2.5% capacity per year depending on fast charging frequency. BASS models suffer 0% financial degradation because the battery is owned & replaced by the provider.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Battery Capacity (kWh)
                </label>
                <input
                  type="number"
                  value={evInput.batteryCapacityKWh}
                  onChange={(e) => setEVInput(prev => ({ ...prev, batteryCapacityKWh: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Annual Capacity Loss Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={evInput.annualDegradationPercentage}
                  onChange={(e) => setEVInput(prev => ({ ...prev, annualDegradationPercentage: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Fast Charging Frequency
                </label>
                <select
                  value={evInput.fastChargeFrequencyFactor}
                  onChange={(e) => setEVInput(prev => ({ ...prev, fastChargeFrequencyFactor: e.target.value as any }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <option value="low">Low (Mostly slow AC charging at home)</option>
                  <option value="medium">Medium (Occasional DC fast charging)</option>
                  <option value="high">High (Frequent DC fast charging - +30% aging)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Battery Replacement Cost ({settings.currencySymbol})
                </label>
                <input
                  type="number"
                  value={evInput.batteryReplacementCost}
                  onChange={(e) => setEVInput(prev => ({ ...prev, batteryReplacementCost: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
