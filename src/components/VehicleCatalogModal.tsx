import React, { useState } from 'react';
import { 
  Car, 
  Zap, 
  Fuel, 
  X, 
  Search, 
  DollarSign, 
  Wrench, 
  TrendingUp, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { CatalogVehicle, EV_VEHICLES, PETROL_VEHICLES, ALL_VEHICLES } from '../data/vehicleDatabase';
import { CurrencyCode } from '../types';

interface VehicleCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  currency: CurrencyCode;
  onSelectVehicle: (vehicle: CatalogVehicle) => void;
}

export const VehicleCatalogModal: React.FC<VehicleCatalogModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  currency,
  onSelectVehicle
}) => {
  if (!isOpen) return null;

  const [fuelTab, setFuelTab] = useState<'all' | 'ev' | 'petrol'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-zinc-100 w-full max-w-5xl rounded-2xl border border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-zinc-100 flex items-center gap-2">
                40+ Vehicle Models Database
              </h2>
              <p className="text-xs text-zinc-400">
                20 Popular EV Models & 20 Popular Petrol Models with specs, efficiency & 5-year resale data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Fuel Type Tabs */}
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setFuelTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                fuelTab === 'all' ? 'bg-zinc-800 text-white shadow-xs' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({ALL_VEHICLES.length})
            </button>
            <button
              onClick={() => setFuelTab('ev')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                fuelTab === 'ev' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              EVs ({EV_VEHICLES.length})
            </button>
            <button
              onClick={() => setFuelTab('petrol')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                fuelTab === 'petrol' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              Petrol ({PETROL_VEHICLES.length})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search model, brand or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'SUV', 'Sedan', 'Compact', 'Luxury', 'Truck'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                  categoryFilter === cat
                    ? 'bg-zinc-200 text-black'
                    : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Vehicles Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => {
            const priceFormatted = `${currencySymbol}${Math.round(vehicle.purchasePriceUSD * mult).toLocaleString()}`;
            const maintFormatted = `${currencySymbol}${Math.round(vehicle.annualMaintenanceUSD * mult).toLocaleString()}`;

            return (
              <div
                key={vehicle.id}
                className="bg-zinc-950/80 rounded-xl border border-zinc-800 hover:border-zinc-700 p-4 space-y-3 flex flex-col justify-between transition-all hover:shadow-lg group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                        vehicle.fuelType === 'ev' 
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' 
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      }`}>
                        {vehicle.fuelType === 'ev' ? '⚡ EV' : '⛽ Petrol'} • {vehicle.category}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                        {vehicle.name}
                      </h3>
                    </div>
                    <span className="font-mono text-sm font-black text-emerald-400">
                      {priceFormatted}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {vehicle.description}
                  </p>
                </div>

                {/* Specs Grid */}
                <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-[10px]">
                  
                  <div className="bg-zinc-900/60 p-1.5 rounded-lg">
                    <span className="text-zinc-500 block text-[9px] uppercase">Efficiency</span>
                    <span className="font-bold font-mono text-zinc-200">
                      {vehicle.fuelType === 'ev' 
                        ? `${vehicle.consumption.kWhPer100Km} kWh/100km` 
                        : `${vehicle.consumption.mpg || Math.round((vehicle.consumption.kmPerLiter || 14) * 2.35)} MPG`}
                    </span>
                  </div>

                  <div className="bg-zinc-900/60 p-1.5 rounded-lg">
                    <span className="text-zinc-500 block text-[9px] uppercase">Annual Maint.</span>
                    <span className="font-bold font-mono text-zinc-200">
                      {maintFormatted}/yr
                    </span>
                  </div>

                  <div className="bg-zinc-900/60 p-1.5 rounded-lg">
                    <span className="text-zinc-500 block text-[9px] uppercase">5-Yr Resale</span>
                    <span className="font-bold font-mono text-emerald-400">
                      {vehicle.resaleValuePercentage5Yr}%
                    </span>
                  </div>

                </div>

                {/* Select Button */}
                <button
                  onClick={() => {
                    onSelectVehicle(vehicle);
                    onClose();
                  }}
                  className="w-full mt-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Select Model for Comparison</span>
                </button>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
          <span>Showing {filteredVehicles.length} of {ALL_VEHICLES.length} Vehicles</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold uppercase transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
