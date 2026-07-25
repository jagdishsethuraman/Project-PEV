import {
  ComparisonSettings,
  PetrolVehicleInput,
  EVVehicleInput,
  YearlyMetrics,
  CostPerKmBreakdown,
  HomeEBImpact,
  FinancialSummary
} from '../types';

// Helper: Calculate monthly loan EMI
export function calculateEMI(principal: number, annualRatePercent: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  if (annualRatePercent <= 0) return principal / (tenureYears * 12);
  const monthlyRate = annualRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return emi;
}

// Helper: Calculate Home Electricity Cost per kWh considering Solar & Tariff structures
export function calculateHomeEBRate(evInput: EVVehicleInput, monthlyKWhNeeded: number): HomeEBImpact {
  const { electricityTariff } = evInput;
  const baseRate = electricityTariff.baseRatePerKWh;
  const offPeakUsageFraction = Math.max(0, Math.min(1, electricityTariff.offPeakUsagePercentage / 100));
  const peakUsageFraction = 1 - offPeakUsageFraction;
  
  // Calculate effective rate with time-of-use or off-peak discount
  let baseEffectiveRate = baseRate;
  if (electricityTariff.tariffType === 'time_of_use' && electricityTariff.offPeakRatePerKWh) {
    baseEffectiveRate = (offPeakUsageFraction * electricityTariff.offPeakRatePerKWh) + (peakUsageFraction * (electricityTariff.peakRatePerKWh || baseRate));
  } else if (electricityTariff.offPeakRatePerKWh && offPeakUsageFraction > 0) {
    baseEffectiveRate = (offPeakUsageFraction * electricityTariff.offPeakRatePerKWh) + (peakUsageFraction * baseRate);
  }

  // Baseline household cost without EV
  const baselineUnits = electricityTariff.baselineHouseholdUnitsMonth || 300;
  const monthlyHomeCostBeforeEV = baselineUnits * baseRate;

  // Tiered tariff calculation (if tiered, slab rate increases after 300 or 500 units)
  let unitCostForEV = baseEffectiveRate;
  if (electricityTariff.tariffType === 'tiered') {
    if (baselineUnits + monthlyKWhNeeded > 500) {
      unitCostForEV = baseEffectiveRate * 1.25; // 25% higher slab tier penalty
    } else if (baselineUnits + monthlyKWhNeeded > 300) {
      unitCostForEV = baseEffectiveRate * 1.12; // 12% higher slab tier
    }
  }

  // Solar offset reduction
  const solarFraction = Math.max(0, Math.min(1, electricityTariff.solarOffsetPercentage / 100));
  const payableKWhNeeded = monthlyKWhNeeded * (1 - solarFraction);
  const monthlyEVEBCostDifference = payableKWhNeeded * unitCostForEV;
  const solarSavingsMonthly = (monthlyKWhNeeded * solarFraction) * unitCostForEV;

  const monthlyHomeCostAfterEV = monthlyHomeCostBeforeEV + monthlyEVEBCostDifference;
  const effectiveRatePerKWh = monthlyKWhNeeded > 0 ? monthlyEVEBCostDifference / monthlyKWhNeeded : unitCostForEV;

  return {
    monthlyEVUnitsKWh: Math.round(monthlyKWhNeeded),
    monthlyHomeCostBeforeEV: Math.round(monthlyHomeCostBeforeEV),
    monthlyHomeCostAfterEV: Math.round(monthlyHomeCostAfterEV),
    monthlyEVEBCostDifference: Math.round(monthlyEVEBCostDifference),
    effectiveRatePerKWh: Number(effectiveRatePerKWh.toFixed(3)),
    solarSavingsMonthly: Math.round(solarSavingsMonthly)
  };
}

export function calculateFullComparison(
  settings: ComparisonSettings,
  petrolInput: PetrolVehicleInput,
  evInput: EVVehicleInput
): {
  yearlyMetrics: YearlyMetrics[];
  summary: FinancialSummary;
} {
  const { annualKm, ownershipYears, gridCarbonIntensityGramsPerKWh, petrolCarbonGramsPerLiter } = settings;
  const monthlyKm = annualKm / 12;

  // 1. Petrol Calculation
  const petrolLoanPrincipal = Math.max(0, petrolInput.purchasePrice - petrolInput.downPayment);
  const petrolMonthlyEMI = calculateEMI(petrolLoanPrincipal, petrolInput.loanInterestRate, petrolInput.loanTenureYears);
  const petrolTotalLoanPayable = petrolMonthlyEMI * petrolInput.loanTenureYears * 12;
  const petrolUpfrontCost = petrolInput.downPayment; // or purchase price if no loan

  // 2. Standard EV Calculation
  const stdEVNetPrice = Math.max(0, evInput.standardPurchasePrice - evInput.governmentSubsidies + evInput.homeChargerCost);
  const stdEVLoanPrincipal = Math.max(0, stdEVNetPrice - evInput.downPayment);
  const stdEVMonthlyEMI = calculateEMI(stdEVLoanPrincipal, evInput.loanInterestRate, evInput.loanTenureYears);
  const stdEVTotalLoanPayable = stdEVMonthlyEMI * evInput.loanTenureYears * 12;
  const stdEVUpfrontCost = evInput.downPayment + evInput.homeChargerCost;

  // 3. BASS EV Calculation (Lower Chassis Price, Battery Subscription)
  const bassEVNetPrice = Math.max(0, evInput.bassChassisPrice - evInput.governmentSubsidies + evInput.homeChargerCost);
  const bassEVLoanPrincipal = Math.max(0, bassEVNetPrice - evInput.downPayment);
  const bassEVMonthlyEMI = calculateEMI(bassEVLoanPrincipal, evInput.loanInterestRate, evInput.loanTenureYears);
  const bassEVTotalLoanPayable = bassEVMonthlyEMI * evInput.loanTenureYears * 12;
  const bassEVUpfrontCost = evInput.downPayment + evInput.homeChargerCost;

  // EV Energy Demand
  const evEfficiency = evInput.evEfficiencyKmPerKWh > 0 ? evInput.evEfficiencyKmPerKWh : 6.5;
  const monthlyKWhNeeded = monthlyKm / evEfficiency;
  const homeKmFraction = Math.max(0, Math.min(1, evInput.homeChargingPercentage / 100));
  const publicKmFraction = 1 - homeKmFraction;

  const monthlyHomeKWh = monthlyKWhNeeded * homeKmFraction;
  const monthlyPublicKWh = monthlyKWhNeeded * publicKmFraction;

  // Home EB impact
  const homeEBImpact = calculateHomeEBRate(evInput, monthlyHomeKWh);
  const monthlyPublicChargingCost = monthlyPublicKWh * evInput.publicChargerRatePerKWh;
  const monthlyEVEnergyTotal = homeEBImpact.monthlyEVEBCostDifference + monthlyPublicChargingCost;

  // BASS Rental monthly fee
  let bassMonthlyBatteryFee = evInput.bassMonthlyRental;
  if (monthlyKm > evInput.bassIncludedKmPerMonth) {
    const excessKm = monthlyKm - evInput.bassIncludedKmPerMonth;
    bassMonthlyBatteryFee += excessKm * evInput.bassExtraChargePerKm;
  }

  // Cost per KM Breakdown
  const petrolLitersPerKm = petrolInput.fuelEfficiencyKmPerLiter > 0 ? 1 / petrolInput.fuelEfficiencyKmPerLiter : 0.08;
  const petrolFuelCPK = petrolLitersPerKm * petrolInput.petrolPricePerLiter;
  
  const evEnergyCPKHome = (1 / evEfficiency) * homeEBImpact.effectiveRatePerKWh;
  const evEnergyCPKPublic = (1 / evEfficiency) * evInput.publicChargerRatePerKWh;
  const evWeightedEnergyCPK = (homeKmFraction * evEnergyCPKHome) + (publicKmFraction * evEnergyCPKPublic);

  // Yearly Metrics Simulation (1 to 10 years)
  const yearlyMetrics: YearlyMetrics[] = [];

  let petrolCumulative = petrolUpfrontCost;
  let standardEVCumulative = stdEVUpfrontCost;
  let bassEVCumulative = bassEVUpfrontCost;

  let petrolFuelCumLiters = 0;
  let evCumKWh = 0;

  // Breakeven tracking
  let standardEVBreakevenMonth: number | null = null;
  let bassEVBreakevenMonth: number | null = null;

  // Simulation step month by month up to max(10, ownershipYears)
  const totalSimMonths = Math.max(10, ownershipYears) * 12;

  let simPetrolCum = petrolUpfrontCost;
  let simStdEVCum = stdEVUpfrontCost;
  let simBassEVCum = bassEVUpfrontCost;

  for (let m = 1; m <= totalSimMonths; m++) {
    const yearIndex = Math.floor((m - 1) / 12);

    // Inflated petrol price
    const currentPetrolPrice = petrolInput.petrolPricePerLiter * Math.pow(1 + petrolInput.petrolInflationRate / 100, yearIndex);
    const mPetrolFuelCost = monthlyKm * petrolLitersPerKm * currentPetrolPrice;

    // Maintenance & Insurance monthly shares (with inflation)
    const mPetrolMaint = (petrolInput.annualMaintenance / 12) * Math.pow(1 + petrolInput.maintenanceInflationRate / 100, yearIndex);
    const mPetrolIns = petrolInput.annualInsurance / 12;

    const mEVMaint = (evInput.annualMaintenance / 12) * Math.pow(1 + petrolInput.maintenanceInflationRate / 100, yearIndex);
    const mEVIns = evInput.annualInsurance / 12;

    // Loan EMI payments
    const mPetrolEMI = m <= petrolInput.loanTenureYears * 12 ? petrolMonthlyEMI : 0;
    const mStdEVEMI = m <= evInput.loanTenureYears * 12 ? stdEVMonthlyEMI : 0;
    const mBassEVEMI = m <= evInput.loanTenureYears * 12 ? bassEVMonthlyEMI : 0;

    // Add monthly totals
    simPetrolCum += mPetrolEMI + mPetrolFuelCost + mPetrolMaint + mPetrolIns;
    simStdEVCum += mStdEVEMI + monthlyEVEnergyTotal + mEVMaint + mEVIns;
    simBassEVCum += mBassEVEMI + monthlyEVEnergyTotal + bassMonthlyBatteryFee + mEVMaint + mEVIns;

    // Check Breakevens
    if (standardEVBreakevenMonth === null && simStdEVCum < simPetrolCum && m > 3) {
      standardEVBreakevenMonth = m;
    }
    if (bassEVBreakevenMonth === null && simBassEVCum < simPetrolCum && m > 3) {
      bassEVBreakevenMonth = m;
    }

    // Capture Year-End snapshot
    if (m % 12 === 0) {
      const yearNum = m / 12;

      // Battery Degradation (Standard EV)
      const degMultiplier = evInput.fastChargeFrequencyFactor === 'high' ? 1.3 : evInput.fastChargeFrequencyFactor === 'medium' ? 1.1 : 1.0;
      const annualDegPct = evInput.annualDegradationPercentage * degMultiplier;
      const currentHealthPct = Math.max(50, 100 - (yearNum * annualDegPct));
      const capacityLossPct = 100 - currentHealthPct;

      // Cumulative fuel/energy
      petrolFuelCumLiters += (annualKm * petrolLitersPerKm);
      evCumKWh += (annualKm / evEfficiency);

      // CO2 Calculations
      const petrolCO2Kg = (petrolFuelCumLiters * petrolCarbonGramsPerLiter) / 1000;
      const evCO2Kg = (evCumKWh * gridCarbonIntensityGramsPerKWh) / 1000;
      
      const co2SavedKg = Math.max(0, petrolCO2Kg - evCO2Kg);
      const co2SavedTonnes = co2SavedKg / 1000;

      yearlyMetrics.push({
        year: yearNum,
        petrolCumulativeCost: Math.round(simPetrolCum),
        standardEVCumulativeCost: Math.round(simStdEVCum),
        bassEVCumulativeCost: Math.round(simBassEVCum),
        
        petrolYearlyRunning: Math.round((mPetrolFuelCost + mPetrolMaint + mPetrolIns) * 12),
        standardEVYearlyRunning: Math.round((monthlyEVEnergyTotal + mEVMaint + mEVIns) * 12),
        bassEVYearlyRunning: Math.round((monthlyEVEnergyTotal + bassMonthlyBatteryFee + mEVMaint + mEVIns) * 12),
        
        petrolCumulativeFuel: Math.round(petrolFuelCumLiters),
        evCumulativeKWh: Math.round(evCumKWh),
        
        co2SavedTonnesStandard: Number(co2SavedTonnes.toFixed(2)),
        co2SavedTonnesBass: Number(co2SavedTonnes.toFixed(2)),
        
        batteryCapacityHealthPct: Number(currentHealthPct.toFixed(1)),
        batteryCapacityLossPct: Number(capacityLossPct.toFixed(1))
      });
    }
  }

  // TCO after ownershipYears (accounting for resale value offset)
  const simYearIndex = Math.min(ownershipYears, yearlyMetrics.length) - 1;
  const finalMetric = yearlyMetrics[simYearIndex] || yearlyMetrics[yearlyMetrics.length - 1];

  const petrolResale = petrolInput.purchasePrice * (petrolInput.resaleValuePercentage / 100);
  const stdEVResale = evInput.standardPurchasePrice * (evInput.resaleValuePercentageStandard / 100);
  const bassEVResale = evInput.bassChassisPrice * (evInput.resaleValuePercentageBass / 100);

  const petrolTotalTCO = finalMetric.petrolCumulativeCost - petrolResale;
  const standardEVTotalTCO = finalMetric.standardEVCumulativeCost - stdEVResale;
  const bassEVTotalTCO = finalMetric.bassEVCumulativeCost - bassEVResale;

  const totalKmTravelled = annualKm * ownershipYears;
  const petrolTotalCPK = totalKmTravelled > 0 ? petrolTotalTCO / totalKmTravelled : 0;
  const evStandardTotalCPK = totalKmTravelled > 0 ? standardEVTotalTCO / totalKmTravelled : 0;
  const evBassTotalCPK = totalKmTravelled > 0 ? bassEVTotalTCO / totalKmTravelled : 0;

  const costPerKm: CostPerKmBreakdown = {
    petrolFuelCPK: Number(petrolFuelCPK.toFixed(2)),
    petrolTotalCPK: Number(petrolTotalCPK.toFixed(2)),
    evEnergyCPKHome: Number(evEnergyCPKHome.toFixed(2)),
    evEnergyCPKPublic: Number(evEnergyCPKPublic.toFixed(2)),
    evWeightedEnergyCPK: Number(evWeightedEnergyCPK.toFixed(2)),
    evStandardTotalCPK: Number(evStandardTotalCPK.toFixed(2)),
    evBassTotalCPK: Number(evBassTotalCPK.toFixed(2))
  };

  const co2SavedTonnes = finalMetric.co2SavedTonnesBass;
  const equivalentTrees = Math.round(co2SavedTonnes * 45); // ~45 trees absorbing 1 tonne CO2 per yr

  const summary: FinancialSummary = {
    petrolUpfrontCost: Math.round(petrolUpfrontCost),
    petrolTotalTCO: Math.round(petrolTotalTCO),
    
    standardEVUpfrontCost: Math.round(stdEVUpfrontCost),
    standardEVTotalTCO: Math.round(standardEVTotalTCO),
    
    bassEVUpfrontCost: Math.round(bassEVUpfrontCost),
    bassEVTotalTCO: Math.round(bassEVTotalTCO),
    
    standardEVSavings: Math.round(petrolTotalTCO - standardEVTotalTCO),
    bassEVSavings: Math.round(petrolTotalTCO - bassEVTotalTCO),
    
    standardEVBreakevenMonth,
    bassEVBreakevenMonth,
    
    costPerKm,
    homeEBImpact,
    
    co2SavedStandardTonnes: co2SavedTonnes,
    co2SavedBassTonnes: co2SavedTonnes,
    equivalentTreesStandard: equivalentTrees,
    equivalentTreesBass: equivalentTrees
  };

  return {
    yearlyMetrics: yearlyMetrics.slice(0, ownershipYears),
    summary
  };
}
