import React, { useState } from 'react';
import { YearlyMetrics, FinancialSummary, ComparisonSettings } from '../types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';
import { TrendingUp, BarChart3, Zap, BatteryCharging, Leaf } from 'lucide-react';

interface ChartsSectionProps {
  yearlyMetrics: YearlyMetrics[];
  summary: FinancialSummary;
  settings: ComparisonSettings;
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  yearlyMetrics,
  summary,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<'tco' | 'cpk' | 'eb_impact' | 'battery' | 'co2'>('tco');

  // Prepare chart data formats
  const tcoChartData = yearlyMetrics.map(m => ({
    year: `Year ${m.year}`,
    Petrol: m.petrolCumulativeCost,
    'Standard EV': m.standardEVCumulativeCost,
    'BASS EV': m.bassEVCumulativeCost
  }));

  const cpkChartData = [
    {
      name: 'Petrol Vehicle',
      'Energy / Fuel Cost / km': summary.costPerKm.petrolFuelCPK,
      'Total TCO / km': summary.costPerKm.petrolTotalCPK
    },
    {
      name: 'Standard EV',
      'Energy / Fuel Cost / km': summary.costPerKm.evWeightedEnergyCPK,
      'Total TCO / km': summary.costPerKm.evStandardTotalCPK
    },
    {
      name: 'BASS EV',
      'Energy / Fuel Cost / km': summary.costPerKm.evWeightedEnergyCPK,
      'Total TCO / km': summary.costPerKm.evBassTotalCPK
    }
  ];

  const ebChartData = [
    {
      name: 'Before EV Charging',
      'Monthly Household Bill': summary.homeEBImpact.monthlyHomeCostBeforeEV
    },
    {
      name: 'After EV Charging',
      'Monthly Household Bill': summary.homeEBImpact.monthlyHomeCostAfterEV
    }
  ];

  const batteryDegradationData = yearlyMetrics.map(m => ({
    year: `Year ${m.year}`,
    'Standard EV Battery Health (%)': m.batteryCapacityHealthPct,
    'BASS Battery Guarantee (%)': 100
  }));

  const co2Data = [
    {
      name: 'Petrol Vehicle',
      'CO2 Emissions (Tonnes)': Number(((settings.annualKm * settings.ownershipYears * 0.08 * settings.petrolCarbonGramsPerLiter) / 1000000).toFixed(1)),
      color: '#f43f5e'
    },
    {
      name: 'Electric Vehicle (Grid)',
      'CO2 Emissions (Tonnes)': Number(((summary.co2SavedBassTonnes > 0 ? ((settings.annualKm * settings.ownershipYears * 0.08 * settings.petrolCarbonGramsPerLiter) / 1000000) - summary.co2SavedBassTonnes : 0)).toFixed(1)),
      color: '#10b981'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 space-y-5">
      
      {/* Chart Category Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <span>Interactive Financial & Operational Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare cumulative expenditure trajectories, breakeven crossovers, EB bill impacts, and battery health curves.
          </p>
        </div>

        <div className="flex overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('tco')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'tco' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Cumulative TCO
          </button>
          <button
            onClick={() => setActiveTab('cpk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'cpk' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Cost / KM
          </button>
          <button
            onClick={() => setActiveTab('eb_impact')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'eb_impact' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Home EB Bill
          </button>
          <button
            onClick={() => setActiveTab('battery')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'battery' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Battery Aging
          </button>
          <button
            onClick={() => setActiveTab('co2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              activeTab === 'co2' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            CO2 Savings
          </button>
        </div>
      </div>

      {/* Render Active Chart Container */}
      <div className="h-72 sm:h-80 w-full pt-2">
        
        {/* 1. TCO AREA CHART */}
        {activeTab === 'tco' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tcoChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="petrolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="stdEVGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="bassEVGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${settings.currencySymbol}${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value: any) => [`${settings.currencySymbol}${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="Petrol" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#petrolGrad)" />
              <Area type="monotone" dataKey="Standard EV" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#stdEVGrad)" />
              <Area type="monotone" dataKey="BASS EV" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#bassEVGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* 2. COST PER KM BAR CHART */}
        {activeTab === 'cpk' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cpkChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${settings.currencySymbol}${v}`} />
              <Tooltip
                formatter={(value: any) => [`${settings.currencySymbol}${Number(value).toFixed(2)} / ${settings.distanceUnit}`, '']}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="Energy / Fuel Cost / km" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Total TCO / km" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* 3. HOME EB BILL IMPACT */}
        {activeTab === 'eb_impact' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ebChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${settings.currencySymbol}${v}`} />
              <Tooltip
                formatter={(value: any) => [`${settings.currencySymbol}${Number(value).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
              />
              <Bar dataKey="Monthly Household Bill" fill="#eab308" radius={[8, 8, 0, 0]}>
                <Cell fill="#64748b" />
                <Cell fill="#eab308" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* 4. BATTERY DEGRADATION LINE CHART */}
        {activeTab === 'battery' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={batteryDegradationData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(value: any) => [`${value}% Capacity`, '']}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="Standard EV Battery Health (%)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="BASS Battery Guarantee (%)" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {/* 5. CO2 EMISSIONS CHART */}
        {activeTab === 'co2' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={co2Data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v} T`} />
              <Tooltip
                formatter={(value: any) => [`${value} Tonnes CO2`, '']}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
              />
              <Bar dataKey="CO2 Emissions (Tonnes)" radius={[8, 8, 0, 0]}>
                {co2Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}

      </div>
    </div>
  );
};
