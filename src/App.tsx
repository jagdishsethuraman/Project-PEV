import React, { useState, useEffect, useMemo } from 'react';
import { PRESET_PROFILES, PresetProfile } from './data/presetVehicles';
import { ComparisonSettings, PetrolVehicleInput, EVVehicleInput } from './types';
import { calculateFullComparison } from './utils/calculator';
import { exportToCSV, saveStateToLocalStorage, loadStateFromLocalStorage } from './utils/exportUtils';
import { CatalogVehicle } from './data/vehicleDatabase';

import { Sidebar, NavTab } from './components/Sidebar';
import { RealtimeRatesBar } from './components/RealtimeRatesBar';
import { SummaryCards } from './components/SummaryCards';
import { VehicleInputForm } from './components/VehicleInputForm';
import { ChartsSection } from './components/ChartsSection';
import { AIAdvisorCard } from './components/AIAdvisorCard';
import { CashFlowTable } from './components/CashFlowTable';
import { GuidedInputWizard } from './components/GuidedInputWizard';
import { VehicleCatalogModal } from './components/VehicleCatalogModal';
import { SettingsView } from './components/SettingsView';
import { CatalogView } from './components/CatalogView';

import { Sparkles, Car, CheckCircle2, ArrowRight, Menu, Zap, Download } from 'lucide-react';

export default function App() {
  const defaultPreset = PRESET_PROFILES[0];

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [personalizedNote, setPersonalizedNote] = useState<string | null>(null);

  // Core state
  const [settings, setSettings] = useState<ComparisonSettings>(defaultPreset.settings);
  const [petrolInput, setPetrolInput] = useState<PetrolVehicleInput>(defaultPreset.petrolInput);
  const [evInput, setEVInput] = useState<EVVehicleInput>(defaultPreset.evInput);

  // Monitor offline online state
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial localStorage restore
    const saved = loadStateFromLocalStorage();
    if (saved) {
      if (saved.settings) setSettings(saved.settings);
      if (saved.petrolInput) setPetrolInput(saved.petrolInput);
      if (saved.evInput) setEVInput(saved.evInput);
      if (saved.selectedPresetId) setSelectedPresetId(saved.selectedPresetId);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save state on change
  useEffect(() => {
    saveStateToLocalStorage({
      settings,
      petrolInput,
      evInput,
      selectedPresetId
    });
  }, [settings, petrolInput, evInput, selectedPresetId]);

  // Recalculate comparisons dynamically
  const { yearlyMetrics, summary } = useMemo(() => {
    return calculateFullComparison(settings, petrolInput, evInput);
  }, [settings, petrolInput, evInput]);

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_PROFILES.find(p => p.id === presetId) || defaultPreset;
    setSelectedPresetId(preset.id);
    setSettings(preset.settings);
    setPetrolInput(preset.petrolInput);
    setEVInput(preset.evInput);
    setPersonalizedNote(null);
  };

  const handleReset = () => {
    const preset = PRESET_PROFILES.find(p => p.id === selectedPresetId) || defaultPreset;
    setSettings(preset.settings);
    setPetrolInput(preset.petrolInput);
    setEVInput(preset.evInput);
    setPersonalizedNote(null);
  };

  const handleExportCSV = () => {
    exportToCSV(settings, petrolInput, evInput, yearlyMetrics, summary);
  };

  const handleApplyPersonalizedProfile = (
    newSettings: ComparisonSettings,
    newPetrol: PetrolVehicleInput,
    newEV: EVVehicleInput,
    summaryNote: string
  ) => {
    setSettings(newSettings);
    setPetrolInput(newPetrol);
    setEVInput(newEV);
    setPersonalizedNote(summaryNote);
  };

  const handleSelectVehicleFromCatalog = (v: CatalogVehicle) => {
    const mult = settings.currency === 'INR' ? 83 : (settings.currency === 'EUR' ? 0.92 : (settings.currency === 'GBP' ? 0.79 : 1.0));
    if (v.fuelType === 'ev') {
      setEVInput(prev => ({
        ...prev,
        modelName: v.name,
        standardPurchasePrice: Math.round(v.purchasePriceUSD * mult),
        bassChassisPrice: Math.round((v.bassChassisPriceUSD || v.purchasePriceUSD * 0.7) * mult),
        batteryCapacityKWh: v.batteryCapacityKWh || prev.batteryCapacityKWh,
        evEfficiencyKmPerKWh: v.consumption.kmPerKWh || prev.evEfficiencyKmPerKWh,
        annualMaintenance: Math.round(v.annualMaintenanceUSD * mult),
        resaleValuePercentageStandard: v.resaleValuePercentage5Yr
      }));
    } else {
      setPetrolInput(prev => ({
        ...prev,
        modelName: v.name,
        purchasePrice: Math.round(v.purchasePriceUSD * mult),
        fuelEfficiencyKmPerLiter: v.consumption.kmPerLiter || prev.fuelEfficiencyKmPerLiter,
        annualMaintenance: Math.round(v.annualMaintenanceUSD * mult),
        resaleValuePercentage: v.resaleValuePercentage5Yr
      }));
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-zinc-950 text-zinc-100 font-sans' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Mobile Header Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm tracking-wider uppercase text-zinc-100">PROJECT PEV</span>
          </div>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs uppercase"
        >
          Flow
        </button>
      </div>

      {/* Left Sidebar Navigation */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setMobileMenuOpen(false);
          }}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          currencySymbol={settings.currencySymbol}
          currency={settings.currency}
          isOffline={isOffline}
          onOpenWizard={() => setIsWizardOpen(true)}
          onExportCSV={handleExportCSV}
          onReset={handleReset}
        />
      </div>

      {/* Main Workspace Area */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        
        {/* Top Preset Header */}
        <header className="border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-400 font-medium">Preset Scenario:</div>
            <select
              value={selectedPresetId}
              onChange={(e) => handleSelectPreset(e.target.value)}
              className="bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-emerald-500 max-w-xs sm:max-w-md truncate"
            >
              {PRESET_PROFILES.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('catalog')}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
            >
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>40 Indian Cars</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </header>

        {/* Tab Specific Content (Zero Duplication) */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Personalized Active Note Banner */}
          {personalizedNote && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{personalizedNote}</span>
              </div>
              <button
                onClick={() => setPersonalizedNote(null)}
                className="text-[11px] underline text-emerald-400 hover:text-emerald-300 ml-3"
              >
                Clear Note
              </button>
            </div>
          )}

          {/* TAB 1: DASHBOARD / HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Guided Flow Banner */}
              <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-cyan-950/80 rounded-2xl border border-emerald-500/20 p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Guided Decision Flow</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">40 Indian Cars DB</span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-zinc-100 mt-0.5">
                      Personalize Your Indian Driving Commute, Traffic Mix & Home EB Charging
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Tailor daily mileage, stop-and-go city traffic, home overnight charging tariffs & rooftop solar offsets.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={() => setIsWizardOpen(true)}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Start Guided Flow</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span>Browse 40 Cars</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary Cards */}
              <SummaryCards
                summary={summary}
                settings={settings}
              />

              {/* AI Decision Recommendation Report */}
              <AIAdvisorCard
                settings={settings}
                petrolInput={petrolInput}
                evInput={evInput}
                summary={summary}
              />

              {/* Interactive Charts & Visualizations */}
              <ChartsSection
                yearlyMetrics={yearlyMetrics}
                summary={summary}
                settings={settings}
              />

            </div>
          )}

          {/* TAB 2: COMPARE & INPUTS */}
          {activeTab === 'compare' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <RealtimeRatesBar
                settings={settings}
                setSettings={setSettings}
                petrolInput={petrolInput}
                setPetrolInput={setPetrolInput}
                evInput={evInput}
                setEVInput={setEVInput}
              />

              <VehicleInputForm
                settings={settings}
                setSettings={setSettings}
                petrolInput={petrolInput}
                setPetrolInput={setPetrolInput}
                evInput={evInput}
                setEVInput={setEVInput}
              />
            </div>
          )}

          {/* TAB 3: VEHICLE CATALOG */}
          {activeTab === 'catalog' && (
            <CatalogView
              currencySymbol={settings.currencySymbol}
              currency={settings.currency}
              onSelectVehicle={handleSelectVehicleFromCatalog}
              onOpenWizard={() => setIsWizardOpen(true)}
            />
          )}

          {/* TAB 4: CASH FLOW & EXPORT */}
          {activeTab === 'cashflow' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <CashFlowTable
                yearlyMetrics={yearlyMetrics}
                settings={settings}
                summary={summary}
                onExportCSV={handleExportCSV}
              />
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-200">
              <SettingsView
                settings={settings}
                setSettings={setSettings}
                onReset={handleReset}
              />
            </div>
          )}

        </main>

        {/* Clean Footer */}
        <footer className="border-t border-zinc-800 py-6 mt-12 bg-zinc-900/80 text-center text-xs text-zinc-500">
          <p className="max-w-7xl mx-auto px-4 uppercase tracking-widest text-[10px] font-semibold">
            PROJECT PEV • 40 Indian Vehicle Models Database • BASS Subscription Analytics • Home EB Tariff Slab Calculators
          </p>
        </footer>

      </div>

      {/* Guided Input Wizard Modal */}
      <GuidedInputWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        currentSettings={settings}
        currentPetrol={petrolInput}
        currentEV={evInput}
        onApplyPersonalizedProfile={handleApplyPersonalizedProfile}
      />

      {/* Vehicle Catalog Modal */}
      <VehicleCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        currencySymbol={settings.currencySymbol}
        currency={settings.currency}
        onSelectVehicle={handleSelectVehicleFromCatalog}
      />

    </div>
  );
}
