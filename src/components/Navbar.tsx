import React from 'react';
import { Zap, Moon, Sun, RefreshCw, Globe, WifiOff, FileSpreadsheet, Sparkles, Car } from 'lucide-react';
import { PRESET_PROFILES, PresetProfile } from '../data/presetVehicles';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  selectedPresetId: string;
  onSelectPreset: (preset: PresetProfile) => void;
  onExportCSV: () => void;
  onReset: () => void;
  isOffline: boolean;
  onOpenWizard: () => void;
  onOpenCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  selectedPresetId,
  onSelectPreset,
  onExportCSV,
  onReset,
  isOffline,
  onOpenWizard,
  onOpenCatalog
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-slate-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-900 dark:text-zinc-100 leading-tight">
              EV vs Petrol <span className="text-emerald-500">Decision Maker</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 hidden lg:block">
              Guided Commute Flow • 40 Vehicle Models • BASS Subscription • Home EB Tariff
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Guided Wizard Button */}
          <button
            onClick={onOpenWizard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">Guided Flow</span>
          </button>

          {/* Vehicle Catalog Button */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">40 Cars DB</span>
          </button>

          {/* Preset Selector */}
          <div className="relative hidden xl:flex items-center">
            <Globe className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedPresetId}
              onChange={(e) => {
                const preset = PRESET_PROFILES.find(p => p.id === e.target.value);
                if (preset) onSelectPreset(preset);
              }}
              className="pl-8 pr-6 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {PRESET_PROFILES.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Offline Badge */}
          {isOffline && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <WifiOff className="w-3 h-3" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="Export CSV Financial Data"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Reset to Preset Defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Toggle Dark/Light Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

        </div>
      </div>
    </header>
  );
};

