import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Zap, 
  Fuel, 
  Sliders, 
  Sun, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles,
  ShieldCheck,
  Building2,
  Home,
  Car,
  BatteryCharging
} from 'lucide-react';
import { CatalogVehicle, EV_VEHICLES, PETROL_VEHICLES } from '../data/vehicleDatabase';
import { ComparisonSettings, PetrolVehicleInput, EVVehicleInput } from '../types';

interface GuidedInputWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: ComparisonSettings;
  currentPetrol: PetrolVehicleInput;
  currentEV: EVVehicleInput;
  onApplyPersonalizedProfile: (
    newSettings: ComparisonSettings,
    newPetrol: PetrolVehicleInput,
    newEV: EVVehicleInput,
    summaryNote: string
  ) => void;
}

export const GuidedInputWizard: React.FC<GuidedInputWizardProps> = ({
  isOpen,
  onClose,
  currentSettings,
  currentPetrol,
  currentEV,
  onApplyPersonalizedProfile
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);

  // Step 1: Commute & Travel
  const [dailyCommute, setDailyCommute] = useState<number>(35); // km or miles
  const [commuteDaysPerWeek, setCommuteDaysPerWeek] = useState<number>(5);
  const [weekendDistancePerWeek, setWeekendDistancePerWeek] = useState<number>(50);
  const [annualLongTrips, setAnnualLongTrips] = useState<number>(1500);

  // Step 2: Travel Patterns & Traffic
  const [cityPercentage, setCityPercentage] = useState<number>(65); // 65% city, 35% highway
  const [trafficDensity, setTrafficDensity] = useState<'light' | 'moderate' | 'heavy'>('moderate');

  // Step 3: Preferred Charging Scenario
  const [chargingPrimary, setChargingPrimary] = useState<'home' | 'work' | 'public' | 'mixed'>('home');
  const [offPeakChargingPct, setOffPeakChargingPct] = useState<number>(85);
  const [solarOffsetPct, setSolarOffsetPct] = useState<number>(20);

  // Step 4: Model Selection from Database (20 EVs + 20 Petrol)
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEvId, setSelectedEvId] = useState<string>('ev_tesla_m3_lr');
  const [selectedPetrolId, setSelectedPetrolId] = useState<string>('petrol_toyota_camry');

  // Calculate annual distance from inputs
  const calculatedAnnualKm = Math.round(
    (dailyCommute * commuteDaysPerWeek * 52) +
    (weekendDistancePerWeek * 52) +
    annualLongTrips
  );

  const selectedEv = EV_VEHICLES.find(v => v.id === selectedEvId) || EV_VEHICLES[0];
  const selectedPetrol = PETROL_VEHICLES.find(v => v.id === selectedPetrolId) || PETROL_VEHICLES[0];

  // Helper calculation for travel pattern adjustment
  // Stop-and-go city traffic degrades petrol MPG by ~15-25% but improves/preserves EV efficiency via regen braking
  const trafficFactorPetrol = trafficDensity === 'heavy' ? 0.82 : (trafficDensity === 'moderate' ? 0.92 : 1.0);
  const cityRegenBonusEV = cityPercentage > 60 ? 1.08 : 1.0;

  const effectivePetrolKmPerL = Math.max(
    5,
    Math.round(((selectedPetrol.consumption.kmPerLiter || 14) * (1 - (cityPercentage/100) * 0.15) * trafficFactorPetrol) * 10) / 10
  );

  const effectiveEvKmPerKWh = Math.round(
    ((selectedEv.consumption.kmPerKWh || 6.5) * cityRegenBonusEV) * 10
  ) / 10;

  // Home charging vs Public Charging breakdown based on charging primary selection
  const homeChargingRatio = chargingPrimary === 'home' ? 90 : (chargingPrimary === 'work' ? 70 : (chargingPrimary === 'public' ? 20 : 60));

  const handleFinish = () => {
    const isUSD = currentSettings.currency === 'USD';
    const isINR = currentSettings.currency === 'INR';
    const isEUR = currentSettings.currency === 'EUR';
    const isGBP = currentSettings.currency === 'GBP';
    const mult = isINR ? 83 : (isEUR ? 0.92 : (isGBP ? 0.79 : 1.0));

    const updatedSettings: ComparisonSettings = {
      ...currentSettings,
      annualKm: calculatedAnnualKm,
      ownershipYears: currentSettings.ownershipYears || 5,
    };

    const updatedPetrol: PetrolVehicleInput = {
      ...currentPetrol,
      modelName: selectedPetrol.name,
      purchasePrice: Math.round(selectedPetrol.purchasePriceUSD * mult),
      fuelEfficiencyKmPerLiter: effectivePetrolKmPerL,
      annualMaintenance: Math.round(selectedPetrol.annualMaintenanceUSD * mult),
      resaleValuePercentage: selectedPetrol.resaleValuePercentage5Yr
    };

    const updatedEV: EVVehicleInput = {
      ...currentEV,
      modelName: selectedEv.name,
      standardPurchasePrice: Math.round(selectedEv.purchasePriceUSD * mult),
      bassChassisPrice: Math.round((selectedEv.bassChassisPriceUSD || selectedEv.purchasePriceUSD * 0.7) * mult),
      batteryCapacityKWh: selectedEv.batteryCapacityKWh || 60,
      evEfficiencyKmPerKWh: effectiveEvKmPerKWh,
      homeChargingPercentage: homeChargingRatio,
      annualMaintenance: Math.round(selectedEv.annualMaintenanceUSD * mult),
      resaleValuePercentageStandard: selectedEv.resaleValuePercentage5Yr,
      electricityTariff: {
        ...currentEV.electricityTariff,
        offPeakUsagePercentage: offPeakChargingPct,
        solarOffsetPercentage: solarOffsetPct
      }
    };

    const note = `Personalized Profile: ${calculatedAnnualKm.toLocaleString()} ${currentSettings.distanceUnit}/yr, ${cityPercentage}% City driving (${trafficDensity} traffic), ${homeChargingRatio}% ${chargingPrimary} charging (${solarOffsetPct}% Solar).`;

    onApplyPersonalizedProfile(updatedSettings, updatedPetrol, updatedEV, note);
    onClose();
  };

  const wizardCurrencyMult = currentSettings.currency === 'INR' ? 83 : (currentSettings.currency === 'EUR' ? 0.92 : (currentSettings.currency === 'GBP' ? 0.79 : 1.0));
  const wizardSymbol = currentSettings.currencySymbol || '$';

  const filteredEVs = categoryFilter === 'all' 
    ? EV_VEHICLES 
    : EV_VEHICLES.filter(v => v.category.toLowerCase() === categoryFilter.toLowerCase());

  const filteredPetrols = categoryFilter === 'all' 
    ? PETROL_VEHICLES 
    : PETROL_VEHICLES.filter(v => v.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 text-zinc-100 w-full max-w-3xl rounded-2xl border border-zinc-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-zinc-100 flex items-center gap-2">
                Personalized Commute & Charging Wizard
              </h2>
              <p className="text-xs text-zinc-400">
                Step {step} of 4 • Tailor mileage, travel patterns, charging habits & compare 40 models
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

        {/* Step Progress Bar */}
        <div className="w-full bg-zinc-800 h-1.5 flex">
          <div 
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: Commute & Daily Mileage */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-start gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300">
                <Navigation className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Daily Distance & Commute Profile</span>
                  <p className="text-emerald-300/80 mt-0.5">
                    We'll calculate your exact annual driving distance to measure fuel/electricity savings precisely.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Daily Round Trip Commute */}
                <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span>Daily Round-Trip Commute</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{dailyCommute} {currentSettings.distanceUnit}</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={150}
                    step={5}
                    value={dailyCommute}
                    onChange={(e) => setDailyCommute(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>5 {currentSettings.distanceUnit} (Short)</span>
                    <span>150 {currentSettings.distanceUnit} (Long)</span>
                  </div>
                </div>

                {/* Commute Days Per Week */}
                <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span>Commute Days / Week</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">{commuteDaysPerWeek} Days</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <button
                        key={day}
                        onClick={() => setCommuteDaysPerWeek(day)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                          commuteDaysPerWeek === day
                            ? 'bg-emerald-500 text-black'
                            : 'bg-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekend Driving */}
                <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span>Weekend Driving / Week</span>
                    <span className="text-cyan-400 font-mono font-bold text-sm">{weekendDistancePerWeek} {currentSettings.distanceUnit}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={300}
                    step={10}
                    value={weekendDistancePerWeek}
                    onChange={(e) => setWeekendDistancePerWeek(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>0 {currentSettings.distanceUnit}</span>
                    <span>300 {currentSettings.distanceUnit}</span>
                  </div>
                </div>

                {/* Annual Vacation & Long Trips */}
                <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                    <span>Annual Highway Road Trips</span>
                    <span className="text-amber-400 font-mono font-bold text-sm">{annualLongTrips} {currentSettings.distanceUnit}/yr</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={250}
                    value={annualLongTrips}
                    onChange={(e) => setAnnualLongTrips(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>0 {currentSettings.distanceUnit}</span>
                    <span>5,000 {currentSettings.distanceUnit}</span>
                  </div>
                </div>

              </div>

              {/* Annual Mileage Result Banner */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">Calculated Annual Driving</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {calculatedAnnualKm.toLocaleString()} <span className="text-xs text-zinc-400 font-sans">{currentSettings.distanceUnit} / year</span>
                  </div>
                </div>
                <div className="text-right text-xs text-zinc-400">
                  <span>~{Math.round(calculatedAnnualKm / 12).toLocaleString()} {currentSettings.distanceUnit} / month</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Travel Patterns & Traffic Conditions */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-start gap-3 p-3.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-300">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Travel Patterns & Driving Environment</span>
                  <p className="text-cyan-300/80 mt-0.5">
                    City stop-and-go driving reduces petrol efficiency but improves EV efficiency through regenerative braking.
                  </p>
                </div>
              </div>

              {/* City vs Highway Slider */}
              <div className="bg-zinc-950/60 p-5 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-200">
                  <span className="text-emerald-400">City Driving: {cityPercentage}%</span>
                  <span className="text-cyan-400">Highway Driving: {100 - cityPercentage}%</span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={cityPercentage}
                  onChange={(e) => setCityPercentage(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-zinc-800 rounded-lg"
                />

                <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
                  <span>Urban / Suburban City</span>
                  <span>Interstate / Highway</span>
                </div>
              </div>

              {/* Traffic Density Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Traffic Density & Stop-and-Go Frequency</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  <button
                    onClick={() => setTrafficDensity('light')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      trafficDensity === 'light'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-400">Light Traffic</div>
                    <p className="text-[11px] mt-1 text-zinc-400">Smooth speed, minimal idling or braking stops.</p>
                  </button>

                  <button
                    onClick={() => setTrafficDensity('moderate')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      trafficDensity === 'moderate'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-400">Moderate Traffic</div>
                    <p className="text-[11px] mt-1 text-zinc-400">Occasional traffic lights and rush-hour slow downs.</p>
                  </button>

                  <button
                    onClick={() => setTrafficDensity('heavy')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      trafficDensity === 'heavy'
                        ? 'bg-rose-500/10 border-rose-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-rose-400">Heavy Stop-and-Go</div>
                    <p className="text-[11px] mt-1 text-zinc-400">Frequent bumper-to-bumper city jams and long idling.</p>
                  </button>

                </div>
              </div>

              {/* Dynamic Impact Explanation Card */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" /> Petrol Adjustment
                  </span>
                  <p className="text-zinc-400 mt-1">
                    Effective Fuel Efficiency: <span className="text-amber-300 font-mono font-bold">{effectivePetrolKmPerL} {currentSettings.distanceUnit === 'miles' ? 'MPG' : 'km/L'}</span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">(Reflects {cityPercentage}% city traffic penalty)</span>
                  </p>
                </div>
                <div>
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> EV Regenerative Adjustment
                  </span>
                  <p className="text-zinc-400 mt-1">
                    Effective EV Efficiency: <span className="text-cyan-300 font-mono font-bold">{effectiveEvKmPerKWh} {currentSettings.distanceUnit}/kWh</span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">(Includes brake regen energy recovery bonus)</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preferred Charging Scenario */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-start gap-3 p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-300">
                <BatteryCharging className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Preferred Charging Scenario & Solar Setup</span>
                  <p className="text-yellow-300/80 mt-0.5">
                    Where and when you charge determines whether your EV fuel cost drops by 70% to 90% vs petrol.
                  </p>
                </div>
              </div>

              {/* Primary Charging Method */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Primary Charging Location</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  <button
                    onClick={() => { setChargingPrimary('home'); setOffPeakChargingPct(85); }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      chargingPrimary === 'home'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Home className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
                    <div className="text-xs font-bold">Home Overnight</div>
                    <span className="text-[10px] text-zinc-500">90% Home / 10% Public</span>
                  </button>

                  <button
                    onClick={() => { setChargingPrimary('work'); setOffPeakChargingPct(50); }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      chargingPrimary === 'work'
                        ? 'bg-cyan-500/10 border-cyan-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
                    <div className="text-xs font-bold">Workplace / Office</div>
                    <span className="text-[10px] text-zinc-500">70% Work / 30% Public</span>
                  </button>

                  <button
                    onClick={() => { setChargingPrimary('public'); setOffPeakChargingPct(20); }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      chargingPrimary === 'public'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Zap className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                    <div className="text-xs font-bold">Public Fast Chargers</div>
                    <span className="text-[10px] text-zinc-500">20% Home / 80% Fast DC</span>
                  </button>

                  <button
                    onClick={() => { setChargingPrimary('mixed'); setOffPeakChargingPct(60); }}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      chargingPrimary === 'mixed'
                        ? 'bg-indigo-500/10 border-indigo-500 text-white'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Sliders className="w-5 h-5 mx-auto text-indigo-400 mb-1" />
                    <div className="text-xs font-bold">Balanced Mix</div>
                    <span className="text-[10px] text-zinc-500">60% Home / 40% Public</span>
                  </button>

                </div>
              </div>

              {/* Off-Peak Night Charging Percentage */}
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>Night / Off-Peak Rate Charging</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">{offPeakChargingPct}% Off-Peak</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={offPeakChargingPct}
                  onChange={(e) => setOffPeakChargingPct(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[11px] text-zinc-400">
                  Higher off-peak percentage takes advantage of cheaper night electric tariffs (e.g., $0.11/kWh vs $0.28/kWh).
                </p>
              </div>

              {/* Solar Panel Offset */}
              <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-400" /> Rooftop Solar PV Offset
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-sm">{solarOffsetPct}% Free Solar Power</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={10}
                  value={solarOffsetPct}
                  onChange={(e) => setSolarOffsetPct(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <p className="text-[11px] text-zinc-400">
                  Free solar energy generated at home directly reduces your EV charging bill to near zero.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Select Model Comparison from 20 EV + 20 Petrol Database */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                    Select Vehicles to Compare (40 Models Database)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Choose 1 EV model and 1 Petrol model from our expanded catalog.
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {['all', 'SUV', 'Sedan', 'Compact', 'Luxury', 'Truck'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all ${
                        categoryFilter === cat
                          ? 'bg-zinc-200 text-black'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* EV Selection Column */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Electric Vehicles ({filteredEVs.length})</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1 border border-zinc-800 rounded-xl p-2 bg-zinc-950/60 scrollbar-thin">
                    {filteredEVs.map((ev) => {
                      const priceFormatted = `${wizardSymbol}${Math.round(ev.purchasePriceUSD * wizardCurrencyMult).toLocaleString()}`;
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvId(ev.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedEvId === ev.id
                              ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-sm'
                              : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{ev.name}</span>
                            <span className="text-cyan-400 font-mono">{priceFormatted}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                            <span>{ev.category} • {ev.consumption.kWhPer100Km} kWh/100km</span>
                            <span>5-Yr Resale: {ev.resaleValuePercentage5Yr}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Petrol Selection Column */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Fuel className="w-4 h-4" /> Petrol / ICE Vehicles ({filteredPetrols.length})</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1 border border-zinc-800 rounded-xl p-2 bg-zinc-950/60 scrollbar-thin">
                    {filteredPetrols.map((petrol) => {
                      const priceFormatted = `${wizardSymbol}${Math.round(petrol.purchasePriceUSD * wizardCurrencyMult).toLocaleString()}`;
                      return (
                        <div
                          key={petrol.id}
                          onClick={() => setSelectedPetrolId(petrol.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            selectedPetrolId === petrol.id
                              ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                              : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span>{petrol.name}</span>
                            <span className="text-amber-400 font-mono">{priceFormatted}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                            <span>{petrol.category} • {petrol.consumption.mpg || Math.round((petrol.consumption.kmPerLiter || 14) * 2.35)} MPG</span>
                            <span>5-Yr Resale: {petrol.resaleValuePercentage5Yr}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Selected Pair Preview Card */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400">Selected EV</div>
                    <div className="text-xs font-bold text-cyan-300">{selectedEv.name}</div>
                    <div className="text-[10px] text-zinc-500">
                      {wizardSymbol}{Math.round(selectedEv.purchasePriceUSD * wizardCurrencyMult).toLocaleString()} • {wizardSymbol}{Math.round(selectedEv.annualMaintenanceUSD * wizardCurrencyMult).toLocaleString()}/yr Maint.
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block text-zinc-600 font-bold">VS</div>

                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-400">Selected Petrol</div>
                    <div className="text-xs font-bold text-amber-300">{selectedPetrol.name}</div>
                    <div className="text-[10px] text-zinc-500">
                      {wizardSymbol}{Math.round(selectedPetrol.purchasePriceUSD * wizardCurrencyMult).toLocaleString()} • {wizardSymbol}{Math.round(selectedPetrol.annualMaintenanceUSD * wizardCurrencyMult).toLocaleString()}/yr Maint.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Personalized Comparison</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
