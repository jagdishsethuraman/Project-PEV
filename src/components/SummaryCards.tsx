import React from 'react';
import { FinancialSummary, ComparisonSettings } from '../types';
import { TrendingDown, Zap, Clock, ShieldCheck, BatteryCharging, Leaf, ArrowRight, Award } from 'lucide-react';

interface SummaryCardsProps {
  summary: FinancialSummary;
  settings: ComparisonSettings;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, settings }) => {
  const {
    petrolTotalTCO,
    standardEVTotalTCO,
    bassEVTotalTCO,
    bassEVSavings,
    standardEVSavings,
    bassEVBreakevenMonth,
    standardEVBreakevenMonth,
    costPerKm,
    homeEBImpact,
    co2SavedBassTonnes,
    equivalentTreesBass
  } = summary;

  // Determine winner
  const bestEVOption = bassEVTotalTCO <= standardEVTotalTCO ? 'bass' : 'standard';
  const bestEVTCO = Math.min(bassEVTotalTCO, standardEVTotalTCO);
  const bestEVSavings = Math.max(bassEVSavings, standardEVSavings);
  const bestBreakeven = bestEVOption === 'bass' ? bassEVBreakevenMonth : standardEVBreakevenMonth;

  const isEVWinning = bestEVTCO < petrolTotalTCO;

  return (
    <div className="space-y-4">
      {/* Primary Banner: Recommendation Winner */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all shadow-md ${
        isEVWinning
          ? 'bg-gradient-to-r from-emerald-950/90 via-teal-900/80 to-slate-900 text-white border-emerald-500/30'
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-xl shrink-0 ${
              isEVWinning ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-amber-400'
            }`}>
              <Award className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Recommended Purchase Decision</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {settings.ownershipYears}-Year TCO Analysis
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">
                {isEVWinning ? (
                  bestEVOption === 'bass' 
                    ? 'Battery as a Service (BASS) EV Option is the Winner!' 
                    : 'Standard Purchase EV Option is the Winner!'
                ) : (
                  'Petrol Car Has Lower Initial TCO for this Mileage'
                )}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {isEVWinning ? (
                  bestEVOption === 'bass'
                    ? `Choosing BASS EV lowers upfront vehicle acquisition by 35%+ and saves you ${settings.currencySymbol}${bassEVSavings.toLocaleString()} over ${settings.ownershipYears} years while shielding you from battery degradation risk!`
                    : `Outright EV purchase delivers maximum long-term savings of ${settings.currencySymbol}${standardEVSavings.toLocaleString()} over ${settings.ownershipYears} years with full battery ownership.`
                ) : (
                  `At ${settings.annualKm.toLocaleString()} ${settings.distanceUnit}/yr, petrol retains lower total initial expense. Increase annual mileage to see EV breakeven threshold.`
                )}
              </p>
            </div>
          </div>

          {/* Quick Payback Metric Badge */}
          {isEVWinning && (
            <div className="bg-slate-800/90 border border-emerald-500/30 p-3.5 rounded-xl text-center shrink-0 w-full sm:w-auto">
              <div className="text-[11px] font-medium text-slate-400">EV Savings Payback</div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">
                {settings.currencySymbol}{bestEVSavings.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Breakeven in {bestBreakeven ? `${bestBreakeven} months` : 'N/A'}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Grid of Key Financial & Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Cost Per Kilometre Comparison */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Energy Cost / {settings.distanceUnit}</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {settings.currencySymbol}{costPerKm.evWeightedEnergyCPK.toFixed(2)}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / {settings.distanceUnit} (EV)</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Petrol Fuel CPK:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{settings.currencySymbol}{costPerKm.petrolFuelCPK.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
            <span>Energy Cost Reduction:</span>
            <span>{costPerKm.petrolFuelCPK > 0 ? Math.round(((costPerKm.petrolFuelCPK - costPerKm.evWeightedEnergyCPK) / costPerKm.petrolFuelCPK) * 100) : 0}% Cheaper</span>
          </div>
        </div>

        {/* Card 2: Home EB Bill Monthly Impact */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Home EB Bill Impact</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              +{settings.currencySymbol}{homeEBImpact.monthlyEVEBCostDifference.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / month</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Added Power Usage:</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{homeEBImpact.monthlyEVUnitsKWh} kWh/mo</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Effective Rate w/ Tariff:</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{settings.currencySymbol}{homeEBImpact.effectiveRatePerKWh}/kWh</span>
          </div>
        </div>

        {/* Card 3: BASS Battery Rental Advantage */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">BASS Subscription</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {settings.currencySymbol}{summary.bassEVUpfrontCost.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> Upfront Chassis</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Std EV Upfront:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{settings.currencySymbol}{summary.standardEVUpfrontCost.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-indigo-600 dark:text-indigo-300 font-semibold flex items-center justify-between">
            <span>Battery Degradation Risk:</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">0% Risk (Subscribed)</span>
          </div>
        </div>

        {/* Card 4: Environmental Impact */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">CO2 Impact Saved</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {co2SavedBassTonnes.toFixed(1)} <span className="text-sm font-bold">Tonnes CO2</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
              <span>Tree Offset Equivalent:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">~{equivalentTreesBass} Trees</span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Tailpipe Emissions:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero Direct Smog</span>
          </div>
        </div>

      </div>
    </div>
  );
};
