import { YearlyMetrics, FinancialSummary, ComparisonSettings, PetrolVehicleInput, EVVehicleInput } from '../types';

export function exportToCSV(
  settings: ComparisonSettings,
  petrolInput: PetrolVehicleInput,
  evInput: EVVehicleInput,
  yearlyMetrics: YearlyMetrics[],
  summary: FinancialSummary
) {
  const headers = [
    'Year',
    `Petrol Cumulative Cost (${settings.currencySymbol})`,
    `Standard EV Cumulative Cost (${settings.currencySymbol})`,
    `BASS EV Cumulative Cost (${settings.currencySymbol})`,
    `Petrol Yearly Running (${settings.currencySymbol})`,
    `Standard EV Yearly Running (${settings.currencySymbol})`,
    `BASS EV Yearly Running (${settings.currencySymbol})`,
    'Cumulative Petrol Fuel (Liters)',
    'Cumulative EV Power (kWh)',
    'CO2 Saved (Tonnes)',
    'Std EV Battery Health (%)'
  ];

  const rows = yearlyMetrics.map(m => [
    m.year,
    m.petrolCumulativeCost,
    m.standardEVCumulativeCost,
    m.bassEVCumulativeCost,
    m.petrolYearlyRunning,
    m.standardEVYearlyRunning,
    m.bassEVYearlyRunning,
    m.petrolCumulativeFuel,
    m.evCumulativeKWh,
    m.co2SavedTonnesBass,
    m.batteryCapacityHealthPct
  ]);

  // Summary metadata rows
  const metaRows = [
    ['--- COMPARISON METADATA ---'],
    ['Annual Mileage', `${settings.annualKm} ${settings.distanceUnit}`],
    ['Ownership Duration', `${settings.ownershipYears} Years`],
    ['Location / Region', settings.locationCityRegion],
    ['Petrol Vehicle Model', petrolInput.modelName],
    ['Petrol Upfront Price', `${settings.currencySymbol}${petrolInput.purchasePrice}`],
    ['EV Model', evInput.modelName],
    ['Standard EV Upfront Price', `${settings.currencySymbol}${evInput.standardPurchasePrice}`],
    ['BASS EV Chassis Price', `${settings.currencySymbol}${evInput.bassChassisPrice}`],
    ['BASS Monthly Battery Rental', `${settings.currencySymbol}${evInput.bassMonthlyRental}/month`],
    ['Home Electricity Tariff', `${settings.currencySymbol}${evInput.electricityTariff.baseRatePerKWh}/kWh`],
    ['Effective Home EB Cost/mo for EV', `${settings.currencySymbol}${summary.homeEBImpact.monthlyEVEBCostDifference}`],
    ['Petrol Cost per KM', `${settings.currencySymbol}${summary.costPerKm.petrolFuelCPK}`],
    ['EV Energy Cost per KM (Home Weighted)', `${settings.currencySymbol}${summary.costPerKm.evWeightedEnergyCPK}`],
    ['BASS EV Net 5-Yr Savings vs Petrol', `${settings.currencySymbol}${summary.bassEVSavings}`],
    ['Standard EV Net 5-Yr Savings vs Petrol', `${settings.currencySymbol}${summary.standardEVSavings}`],
    ['BASS Breakeven Timeline', summary.bassEVBreakevenMonth ? `${summary.bassEVBreakevenMonth} Months` : 'N/A'],
    ['Standard EV Breakeven Timeline', summary.standardEVBreakevenMonth ? `${summary.standardEVBreakevenMonth} Months` : 'N/A'],
    ['Lifetime CO2 Emissions Saved', `${summary.co2SavedBassTonnes} Tonnes`],
    ['Equivalent Trees Planted', summary.equivalentTreesBass],
    ['---------------------------']
  ];

  const csvContent = [
    ...metaRows.map(r => r.join(',')),
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `EV_vs_Petrol_TCO_Comparison_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function saveStateToLocalStorage(data: any) {
  try {
    localStorage.setItem('ev_petrol_calculator_state', JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function loadStateFromLocalStorage() {
  try {
    const raw = localStorage.getItem('ev_petrol_calculator_state');
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
  }
  return null;
}
