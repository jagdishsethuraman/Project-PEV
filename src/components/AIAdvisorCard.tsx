import React, { useState, useEffect } from 'react';
import {
  ComparisonSettings,
  PetrolVehicleInput,
  EVVehicleInput,
  FinancialSummary,
  AIRecommendation
} from '../types';
import {
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  ListTodo,
  RefreshCw,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

interface AIAdvisorCardProps {
  settings: ComparisonSettings;
  petrolInput: PetrolVehicleInput;
  evInput: EVVehicleInput;
  summary: FinancialSummary;
}

export const AIAdvisorCard: React.FC<AIAdvisorCardProps> = ({
  settings,
  petrolInput,
  evInput,
  summary
}) => {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAIReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings,
          petrolInput,
          evInput,
          financialSummary: summary
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setRecommendation(json.data);
      } else {
        throw new Error('Could not parse recommendation response');
      }
    } catch (err: any) {
      console.error('AI Recommendation error:', err);
      // Heuristic fallback
      const winner: 'bass_ev' | 'standard_ev' | 'petrol' =
        summary.bassEVTotalTCO < summary.standardEVTotalTCO && summary.bassEVTotalTCO < summary.petrolTotalTCO
          ? 'bass_ev'
          : summary.standardEVTotalTCO < summary.petrolTotalTCO
          ? 'standard_ev'
          : 'petrol';

      setRecommendation({
        winner,
        winnerTitle: winner === 'bass_ev'
          ? 'Battery as a Service (BASS) EV Option Wins'
          : winner === 'standard_ev'
          ? 'Standard Purchase EV Option Wins'
          : 'Petrol Vehicle Retains Lower Initial TCO',
        executiveSummary: `At ${settings.annualKm.toLocaleString()} ${settings.distanceUnit}/year over ${settings.ownershipYears} years, ${winner === 'bass_ev' ? 'BASS EV delivers maximum capital efficiency' : winner === 'standard_ev' ? 'outright EV ownership delivers maximum net savings' : 'petrol retains lower upfront cost'}. Net savings vs petrol: ${settings.currencySymbol}${Math.max(summary.bassEVSavings, summary.standardEVSavings).toLocaleString()}.`,
        paybackPeriodMonths: summary.bassEVBreakevenMonth ? `${summary.bassEVBreakevenMonth} months` : 'N/A',
        keyFinancialBenefits: [
          `Electric energy running cost is ${settings.currencySymbol}${summary.costPerKm.evWeightedEnergyCPK.toFixed(2)}/${settings.distanceUnit} vs ${settings.currencySymbol}${summary.costPerKm.petrolFuelCPK.toFixed(2)}/${settings.distanceUnit} for petrol.`,
          `BASS subscription lowers upfront acquisition cost by ~35% while shielding you from battery replacement liability.`,
          `Home charging adds ~${settings.currencySymbol}${summary.homeEBImpact.monthlyEVEBCostDifference}/month to your EB meter.`
        ],
        batteryStrategyAnalysis: 'BASS subscription eliminates battery aging anxiety by transferring degradation risks to the battery service provider.',
        riskAssessment: [
          'Verify local battery swapping station density along your primary highway corridors.',
          'Confirm home electrical sanctioned load supports 3.3kW to 7.2kW AC charging.'
        ],
        actionPlanChecklist: [
          'Schedule home electrical wallbox audit.',
          'Review BASS monthly mileage tiers against commute patterns.',
          'Apply for state EV road tax exemptions and purchase incentives.'
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIReport();
  }, [settings.annualKm, settings.ownershipYears, petrolInput.purchasePrice, evInput.bassChassisPrice]);

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>AI Purchase Decision Advisor</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Gemini Intelligence
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Personalized financial breakdown, battery degradation risk model, and action checklist.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAIReport}
          disabled={loading}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-slate-400 text-xs space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p>Analyzing driving mileage, home EB tariffs, and BASS battery subscription slabs...</p>
        </div>
      ) : recommendation ? (
        <div className="space-y-5 animate-fade-in text-xs sm:text-sm">
          
          {/* Executive Summary Box */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
            <h4 className="font-bold text-emerald-400 text-sm sm:text-base flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{recommendation.winnerTitle}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed">
              {recommendation.executiveSummary}
            </p>
          </div>

          {/* Key Financial Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Financial Highlights
              </h5>
              <ul className="space-y-1.5 text-slate-300">
                {recommendation.keyFinancialBenefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
              <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-1.5 text-indigo-400">
                <ShieldCheck className="w-4 h-4" /> Battery & Degradation Strategy
              </h5>
              <p className="text-slate-300 leading-relaxed">
                {recommendation.batteryStrategyAnalysis}
              </p>
            </div>

          </div>

          {/* Risk Assessment & Action Plan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-4 h-4" /> Operational Risk Considerations
              </h5>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                {recommendation.riskAssessment.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 space-y-2">
              <h5 className="font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                <ListTodo className="w-4 h-4" /> Action Checklist Before Buying
              </h5>
              <ul className="space-y-1.5 text-slate-300 text-xs">
                {recommendation.actionPlanChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
