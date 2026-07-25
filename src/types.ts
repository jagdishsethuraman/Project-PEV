export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';
export type DistanceUnit = 'km' | 'miles';

export interface VehicleDefaults {
  name: string;
  price: number;
}

export interface ElectricityTariff {
  baseRatePerKWh: number; // e.g. $0.15 or ₹7.50
  tariffType: 'flat' | 'tiered' | 'time_of_use';
  offPeakRatePerKWh?: number; // e.g. off peak night rate
  peakRatePerKWh?: number;
  offPeakUsagePercentage: number; // e.g. 70% of charging done off-peak at night
  solarOffsetPercentage: number; // 0 to 100%
  baselineHouseholdUnitsMonth: number; // e.g. 300 kWh household base usage before EV
}

export interface PetrolVehicleInput {
  modelName: string;
  purchasePrice: number;
  downPayment: number;
  loanTenureYears: number;
  loanInterestRate: number; // % annual
  fuelEfficiencyKmPerLiter: number; // km/l or mpg
  petrolPricePerLiter: number; // $ or ₹ per liter
  petrolInflationRate: number; // % annual
  annualInsurance: number;
  annualMaintenance: number;
  maintenanceInflationRate: number; // %
  resaleValuePercentage: number; // % of original price after N years
}

export interface EVVehicleInput {
  modelName: string;
  ownershipModel: 'standard' | 'bass'; // Standard EV vs Battery as a Service
  
  // Upfront costs
  standardPurchasePrice: number; // Full EV price
  bassChassisPrice: number; // Price without battery (BASS model)
  governmentSubsidies: number;
  homeChargerCost: number;
  downPayment: number;
  loanTenureYears: number;
  loanInterestRate: number; // %
  
  // Efficiency & Charging
  batteryCapacityKWh: number; // e.g. 40 or 60 kWh
  evEfficiencyKmPerKWh: number; // e.g. 7 km/kWh or ~14 kWh/100km
  homeChargingPercentage: number; // e.g. 80% home, 20% public fast charger
  publicChargerRatePerKWh: number; // $ or ₹ per kWh
  
  // Home EB Bill Setup
  electricityTariff: ElectricityTariff;
  
  // BASS Subscription details
  bassMonthlyRental: number; // Base monthly subscription fee
  bassIncludedKmPerMonth: number; // e.g. 1000 km included
  bassExtraChargePerKm: number; // Charge per km above limit
  
  // Battery Degradation details (Standard EV)
  annualDegradationPercentage: number; // default ~2%
  fastChargeFrequencyFactor: 'low' | 'medium' | 'high'; // low=1x, high=1.3x degradation rate
  batteryReplacementCost: number; // cost if replacement needed
  batteryWarrantyYears: number; // e.g. 8 years
  
  // Running & Resale
  annualInsurance: number;
  annualMaintenance: number;
  resaleValuePercentageStandard: number; // % for standard EV
  resaleValuePercentageBass: number; // % for BASS chassis
}

export interface ComparisonSettings {
  currency: CurrencyCode;
  currencySymbol: string;
  distanceUnit: DistanceUnit;
  annualKm: number; // Annual driving distance
  ownershipYears: number; // 1 to 10 years
  gridCarbonIntensityGramsPerKWh: number; // g CO2 / kWh (e.g. 500 for coal mix, 150 for green mix)
  petrolCarbonGramsPerLiter: number; // approx 2310 g CO2 / L
  locationCityRegion: string; // for rate lookup
}

export interface YearlyMetrics {
  year: number;
  petrolCumulativeCost: number;
  standardEVCumulativeCost: number;
  bassEVCumulativeCost: number;
  
  petrolYearlyRunning: number;
  standardEVYearlyRunning: number;
  bassEVYearlyRunning: number;
  
  petrolCumulativeFuel: number;
  evCumulativeKWh: number;
  
  co2SavedTonnesStandard: number;
  co2SavedTonnesBass: number;
  
  batteryCapacityHealthPct: number; // standard EV battery health %
  batteryCapacityLossPct: number;
}

export interface CostPerKmBreakdown {
  petrolFuelCPK: number;
  petrolTotalCPK: number;
  
  evEnergyCPKHome: number;
  evEnergyCPKPublic: number;
  evWeightedEnergyCPK: number;
  
  evStandardTotalCPK: number;
  evBassTotalCPK: number;
}

export interface HomeEBImpact {
  monthlyEVUnitsKWh: number;
  monthlyHomeCostBeforeEV: number;
  monthlyHomeCostAfterEV: number;
  monthlyEVEBCostDifference: number;
  effectiveRatePerKWh: number;
  solarSavingsMonthly: number;
}

export interface FinancialSummary {
  petrolUpfrontCost: number;
  petrolTotalTCO: number;
  
  standardEVUpfrontCost: number;
  standardEVTotalTCO: number;
  
  bassEVUpfrontCost: number;
  bassEVTotalTCO: number;
  
  // Net savings vs Petrol over ownership tenure
  standardEVSavings: number;
  bassEVSavings: number;
  
  // Breakeven Months vs Petrol
  standardEVBreakevenMonth: number | null; // null if never breaks even
  bassEVBreakevenMonth: number | null;
  
  costPerKm: CostPerKmBreakdown;
  homeEBImpact: HomeEBImpact;
  
  // Environmental
  co2SavedStandardTonnes: number;
  co2SavedBassTonnes: number;
  equivalentTreesStandard: number;
  equivalentTreesBass: number;
}

export interface LocalEnergyRateResult {
  cityRegion: string;
  currency: CurrencyCode;
  currencySymbol: string;
  petrolPricePerLiter: number;
  electricityRatePerKWh: number;
  publicChargerRatePerKWh: number;
  gridCarbonIntensity: number;
  lastUpdated: string;
  notes: string;
}

export interface AIRecommendation {
  winner: 'bass_ev' | 'standard_ev' | 'petrol';
  winnerTitle: string;
  executiveSummary: string;
  paybackPeriodMonths: number | string;
  keyFinancialBenefits: string[];
  batteryStrategyAnalysis: string;
  riskAssessment: string[];
  actionPlanChecklist: string[];
}
