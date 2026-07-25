import React from 'react';
import { YearlyMetrics, ComparisonSettings, FinancialSummary } from '../types';
import { Table, Download, FileSpreadsheet } from 'lucide-react';

interface CashFlowTableProps {
  yearlyMetrics: YearlyMetrics[];
  settings: ComparisonSettings;
  summary: FinancialSummary;
  onExportCSV: () => void;
}

export const CashFlowTable: React.FC<CashFlowTableProps> = ({
  yearlyMetrics,
  settings,
  summary,
  onExportCSV
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sm:p-6 space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-100 uppercase tracking-tight flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-500" />
            <span>Year-by-Year Financial Cashflow Breakdown</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Compare cumulative expenses, yearly running costs, fuel consumption, and battery health retention.
          </p>
        </div>

        <button
          onClick={onExportCSV}
          className="px-3.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>EXPORT DATA</span>
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800">
        <table className="w-full text-left text-xs font-mono">
          
          <thead className="bg-slate-100 dark:bg-zinc-950 text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-zinc-800">
            <tr>
              <th className="py-3 px-4">Year</th>
              <th className="py-3 px-4 text-right">Petrol Cumulative ({settings.currencySymbol})</th>
              <th className="py-3 px-4 text-right">Std EV Cumulative ({settings.currencySymbol})</th>
              <th className="py-3 px-4 text-right text-indigo-400">BASS EV Cumulative ({settings.currencySymbol})</th>
              <th className="py-3 px-4 text-right text-emerald-400">BASS Savings vs Petrol</th>
              <th className="py-3 px-4 text-right">Fuel (L)</th>
              <th className="py-3 px-4 text-right">EV Power (kWh)</th>
              <th className="py-3 px-4 text-right">CO2 Saved (T)</th>
              <th className="py-3 px-4 text-right">Std EV Health %</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/60 text-zinc-300">
            {yearlyMetrics.map((m) => {
              const bassSavings = m.petrolCumulativeCost - m.bassEVCumulativeCost;
              return (
                <tr key={m.year} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-zinc-100 uppercase">Year {m.year}</td>
                  <td className="py-2.5 px-4 text-right text-zinc-400">{m.petrolCumulativeCost.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right text-zinc-300">{m.standardEVCumulativeCost.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-indigo-400">{m.bassEVCumulativeCost.toLocaleString()}</td>
                  <td className={`py-2.5 px-4 text-right font-bold ${
                    bassSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {bassSavings >= 0 ? '+' : ''}{settings.currencySymbol}{bassSavings.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right text-zinc-400">{m.petrolCumulativeFuel.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right text-zinc-400">{m.evCumulativeKWh.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-emerald-400">{m.co2SavedTonnesBass}</td>
                  <td className="py-2.5 px-4 text-right">{m.batteryCapacityHealthPct}%</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
};
