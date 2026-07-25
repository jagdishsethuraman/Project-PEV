import React, { useState } from 'react';
import { CatalogVehicle, EV_VEHICLES, PETROL_VEHICLES, ALL_VEHICLES } from '../data/vehicleDatabase';
import { CurrencyCode } from '../types';
import { Car, Zap, Fuel, Search, Check, Sparkles, TrendingUp, Info, Shield, Wrench } from 'lucide-react';

interface CatalogViewProps {
  currencySymbol: string;
  currency: CurrencyCode;
  onSelectVehicle: (vehicle: CatalogVehicle) => void;
  onOpenWizard: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  currencySymbol,
  currency,
  onSelectVehicle,
  onOpenWizard
}) => {
  const [fuelTab, setFuelTab] = useState<'all' | 'ev' | 'petrol'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mult = currency === 'INR' ? 83 : (currency === 'EUR' ? 0.92 : (currency === 'GBP' ? 0.79 : 1.0));

  const filteredVehicles = ALL_VEHICLES.filter((v) => {
    if (fuelTab !== 'all' && v.fuelType !== fuelTab) return false;
    if (categoryFilter !== 'all' && v.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSelect = (v: CatalogVehicle) => {
    setSelectedId(v.id);
    onSelectVehicle(v);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-100 uppercase tracking-wide flex items-center gap-2">
              40 Indian Vehicle Models Database
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Select any EV or Petrol vehicle to automatically populate efficiency, pricing, and maintenance metrics into your comparison engine.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenWizard}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Guided Flow</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        
        {/* Fuel Type Filters */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 shrink-0">
          <button
            onClick={() => setFuelTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              fuelTab === 'all' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({ALL_VEHICLES.length})
          </button>
          <button
            onClick={() => setFuelTab('ev')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              fuelTab === 'ev' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            EVs ({EV_VEHICLES.length})
          </button>
          <button
            onClick={() => setFuelTab('petrol')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
              fuelTab === 'petrol' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            Petrol ({PETROL_VEHICLES.length})
          </button>
        </div>

        {/* Search Input & Category Dropdown */}
        <div className="flex items-center gap-2 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search car model or brand (e.g. Nexon, Creta, Mahindra, MG)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Body Styles</option>
            <option value="compact">Compact / Hatchback</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV / CUV</option>
            <option value="luxury">Luxury Segment</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((v) => {
          const isSelected = selectedId === v.id;
          const isEV = v.fuelType === 'ev';
          const price = Math.round(v.purchasePriceUSD * mult);
          const bassPrice = v.bassChassisPriceUSD ? Math.round(v.bassChassisPriceUSD * mult) : null;
          const maintPrice = Math.round(v.annualMaintenanceUSD * mult);

          return (
            <div
              key={v.id}
              className={`bg-zinc-900 border rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4 hover:border-zinc-700 shadow-md ${
                isSelected
                  ? 'border-emerald-500/60 ring-1 ring-emerald-500/40 bg-emerald-950/20'
                  : 'border-zinc-800'
              }`}
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border ${
                    isEV
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {isEV ? 'Electric Vehicle' : 'Petrol Vehicle'} • {v.category}
                  </span>
                  <span className="text-xs text-zinc-400 font-bold">{v.brand}</span>
                </div>

                {/* Name & Price */}
                <div>
                  <h3 className="text-base font-bold text-zinc-100">{v.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-black text-emerald-400">
                      {currencySymbol}{price.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-zinc-400">Ex-Showroom / On-Road</span>
                  </div>
                  {isEV && bassPrice && (
                    <div className="text-xs font-semibold text-cyan-300 mt-0.5">
                      BaaS Chassis: {currencySymbol}{bassPrice.toLocaleString()} <span className="text-[10px] text-zinc-400">(Battery Subscribed)</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {v.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Efficiency</span>
                    <span className="font-bold text-zinc-200">
                      {isEV
                        ? `${v.consumption.kmPerKWh || 7.0} km/kWh`
                        : `${v.consumption.kmPerLiter || 15.0} km/L`}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">Annual Maint.</span>
                    <span className="font-bold text-zinc-200">
                      {currencySymbol}{maintPrice.toLocaleString()}/yr
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-bold">5-Yr Resale Retained</span>
                    <span className="font-bold text-zinc-200">{v.resaleValuePercentage5Yr}%</span>
                  </div>
                  {isEV && v.batteryCapacityKWh && (
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold">Battery Pack</span>
                      <span className="font-bold text-cyan-300">{v.batteryCapacityKWh} kWh</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Select Action Button */}
              <button
                onClick={() => handleSelect(v)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                    : isEV
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Selected for Comparison</span>
                  </>
                ) : (
                  <span>Select Model for Comparison</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400 space-y-2">
          <Info className="w-8 h-8 text-zinc-500 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-200">No Vehicle Models Matched</h3>
          <p className="text-xs">Try clearing your search term or selecting a different category filter.</p>
        </div>
      )}
    </div>
  );
};
