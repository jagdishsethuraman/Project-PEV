import { PetrolVehicleInput, EVVehicleInput, ComparisonSettings } from '../types';

export interface PresetProfile {
  id: string;
  label: string;
  market: 'India' | 'USA' | 'Europe' | 'Global';
  settings: ComparisonSettings;
  petrolInput: PetrolVehicleInput;
  evInput: EVVehicleInput;
}

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'india_compact_suv',
    label: 'Tata Nexon EV LR (BaaS/Standard) vs Nexon Petrol / Creta',
    market: 'India',
    settings: {
      currency: 'INR',
      currencySymbol: '₹',
      distanceUnit: 'km',
      annualKm: 15000,
      ownershipYears: 5,
      gridCarbonIntensityGramsPerKWh: 550, // India power mix
      petrolCarbonGramsPerLiter: 2310,
      locationCityRegion: 'Delhi NCR'
    },
    petrolInput: {
      modelName: 'Hyundai Creta / Nexon 1.2 Petrol',
      purchasePrice: 1180000,
      downPayment: 200000,
      loanTenureYears: 5,
      loanInterestRate: 9.0,
      fuelEfficiencyKmPerLiter: 14.5,
      petrolPricePerLiter: 102.50,
      petrolInflationRate: 4.0,
      annualInsurance: 28000,
      annualMaintenance: 12000,
      maintenanceInflationRate: 5.0,
      resaleValuePercentage: 50
    },
    evInput: {
      modelName: 'Tata Nexon EV LR (BaaS Available)',
      ownershipModel: 'bass',
      standardPurchasePrice: 1550000,
      bassChassisPrice: 1050000, // ₹5 Lakhs upfront discount under BaaS
      governmentSubsidies: 50000,
      homeChargerCost: 25000,
      downPayment: 200000,
      loanTenureYears: 5,
      loanInterestRate: 8.5,
      batteryCapacityKWh: 40.5,
      evEfficiencyKmPerKWh: 7.2, // ~13.8 kWh/100km
      homeChargingPercentage: 85,
      publicChargerRatePerKWh: 18.0,
      electricityTariff: {
        baseRatePerKWh: 7.50,
        tariffType: 'tiered',
        offPeakRatePerKWh: 5.50,
        peakRatePerKWh: 9.00,
        offPeakUsagePercentage: 80,
        solarOffsetPercentage: 0,
        baselineHouseholdUnitsMonth: 300
      },
      bassMonthlyRental: 3500, // ₹3,500/mo subscription
      bassIncludedKmPerMonth: 1200,
      bassExtraChargePerKm: 3.5,
      annualDegradationPercentage: 2.0,
      fastChargeFrequencyFactor: 'low',
      batteryReplacementCost: 350000,
      batteryWarrantyYears: 8,
      annualInsurance: 32000,
      annualMaintenance: 6000, // ~50% lower maintenance
      resaleValuePercentageStandard: 45,
      resaleValuePercentageBass: 55
    }
  },
  {
    id: 'india_mg_windsor_baas',
    label: 'MG Windsor EV (BaaS ₹3.5/km) vs Honda Elevate 1.5L',
    market: 'India',
    settings: {
      currency: 'INR',
      currencySymbol: '₹',
      distanceUnit: 'km',
      annualKm: 18000,
      ownershipYears: 5,
      gridCarbonIntensityGramsPerKWh: 550,
      petrolCarbonGramsPerLiter: 2310,
      locationCityRegion: 'Bengaluru / Mumbai'
    },
    petrolInput: {
      modelName: 'Honda Elevate 1.5L i-VTEC',
      purchasePrice: 1380000,
      downPayment: 250000,
      loanTenureYears: 5,
      loanInterestRate: 8.9,
      fuelEfficiencyKmPerLiter: 15.0,
      petrolPricePerLiter: 103.00,
      petrolInflationRate: 4.0,
      annualInsurance: 32000,
      annualMaintenance: 14000,
      maintenanceInflationRate: 5.0,
      resaleValuePercentage: 52
    },
    evInput: {
      modelName: 'MG Windsor EV CUV (BaaS)',
      ownershipModel: 'bass',
      standardPurchasePrice: 1380000,
      bassChassisPrice: 999000, // ₹9.99 Lakhs BaaS chassis price
      governmentSubsidies: 0,
      homeChargerCost: 20000,
      downPayment: 200000,
      loanTenureYears: 5,
      loanInterestRate: 8.5,
      batteryCapacityKWh: 38.0,
      evEfficiencyKmPerKWh: 7.4,
      homeChargingPercentage: 90,
      publicChargerRatePerKWh: 20.0,
      electricityTariff: {
        baseRatePerKWh: 7.00,
        tariffType: 'tiered',
        offPeakRatePerKWh: 5.00,
        peakRatePerKWh: 8.50,
        offPeakUsagePercentage: 85,
        solarOffsetPercentage: 20, // rooftop solar discount
        baselineHouseholdUnitsMonth: 350
      },
      bassMonthlyRental: 3200,
      bassIncludedKmPerMonth: 1000,
      bassExtraChargePerKm: 3.50, // MG official BaaS rental rate ₹3.5/km
      annualDegradationPercentage: 1.8,
      fastChargeFrequencyFactor: 'low',
      batteryReplacementCost: 320000,
      batteryWarrantyYears: 8,
      annualInsurance: 30000,
      annualMaintenance: 5500,
      resaleValuePercentageStandard: 48,
      resaleValuePercentageBass: 58
    }
  },
  {
    id: 'india_tata_punch_brezza',
    label: 'Tata Punch EV vs Maruti Suzuki Brezza Hybrid',
    market: 'India',
    settings: {
      currency: 'INR',
      currencySymbol: '₹',
      distanceUnit: 'km',
      annualKm: 12000,
      ownershipYears: 5,
      gridCarbonIntensityGramsPerKWh: 550,
      petrolCarbonGramsPerLiter: 2310,
      locationCityRegion: 'Chennai / Hyderabad'
    },
    petrolInput: {
      modelName: 'Maruti Suzuki Brezza 1.5L',
      purchasePrice: 950000,
      downPayment: 150000,
      loanTenureYears: 5,
      loanInterestRate: 9.2,
      fuelEfficiencyKmPerLiter: 17.5,
      petrolPricePerLiter: 101.80,
      petrolInflationRate: 4.0,
      annualInsurance: 24000,
      annualMaintenance: 10000,
      maintenanceInflationRate: 4.5,
      resaleValuePercentage: 62
    },
    evInput: {
      modelName: 'Tata Punch EV Empowers+',
      ownershipModel: 'standard',
      standardPurchasePrice: 1150000,
      bassChassisPrice: 770000,
      governmentSubsidies: 30000,
      homeChargerCost: 20000,
      downPayment: 150000,
      loanTenureYears: 5,
      loanInterestRate: 8.5,
      batteryCapacityKWh: 35.0,
      evEfficiencyKmPerKWh: 8.0,
      homeChargingPercentage: 92,
      publicChargerRatePerKWh: 18.0,
      electricityTariff: {
        baseRatePerKWh: 6.80,
        tariffType: 'tiered',
        offPeakRatePerKWh: 4.80,
        peakRatePerKWh: 8.00,
        offPeakUsagePercentage: 90,
        solarOffsetPercentage: 0,
        baselineHouseholdUnitsMonth: 250
      },
      bassMonthlyRental: 2800,
      bassIncludedKmPerMonth: 1000,
      bassExtraChargePerKm: 3.20,
      annualDegradationPercentage: 2.0,
      fastChargeFrequencyFactor: 'low',
      batteryReplacementCost: 280000,
      batteryWarrantyYears: 8,
      annualInsurance: 26000,
      annualMaintenance: 5000,
      resaleValuePercentageStandard: 48,
      resaleValuePercentageBass: 56
    }
  },
  {
    id: 'india_tata_tiago_swift',
    label: 'Tata Tiago EV / MG Comet vs Maruti Swift Petrol',
    market: 'India',
    settings: {
      currency: 'INR',
      currencySymbol: '₹',
      distanceUnit: 'km',
      annualKm: 10000,
      ownershipYears: 5,
      gridCarbonIntensityGramsPerKWh: 550,
      petrolCarbonGramsPerLiter: 2310,
      locationCityRegion: 'Kolkata / Pune'
    },
    petrolInput: {
      modelName: 'Maruti Suzuki Swift 1.2L Petrol',
      purchasePrice: 720000,
      downPayment: 100000,
      loanTenureYears: 5,
      loanInterestRate: 9.0,
      fuelEfficiencyKmPerLiter: 22.0,
      petrolPricePerLiter: 102.00,
      petrolInflationRate: 4.0,
      annualInsurance: 18000,
      annualMaintenance: 8000,
      maintenanceInflationRate: 4.5,
      resaleValuePercentage: 60
    },
    evInput: {
      modelName: 'Tata Tiago EV / MG Comet EV',
      ownershipModel: 'standard',
      standardPurchasePrice: 850000,
      bassChassisPrice: 570000,
      governmentSubsidies: 25000,
      homeChargerCost: 15000,
      downPayment: 100000,
      loanTenureYears: 5,
      loanInterestRate: 8.5,
      batteryCapacityKWh: 24.0,
      evEfficiencyKmPerKWh: 8.5,
      homeChargingPercentage: 95,
      publicChargerRatePerKWh: 16.0,
      electricityTariff: {
        baseRatePerKWh: 6.50,
        tariffType: 'flat',
        offPeakRatePerKWh: 5.00,
        peakRatePerKWh: 7.50,
        offPeakUsagePercentage: 85,
        solarOffsetPercentage: 0,
        baselineHouseholdUnitsMonth: 200
      },
      bassMonthlyRental: 2200,
      bassIncludedKmPerMonth: 800,
      bassExtraChargePerKm: 2.80,
      annualDegradationPercentage: 2.0,
      fastChargeFrequencyFactor: 'low',
      batteryReplacementCost: 210000,
      batteryWarrantyYears: 8,
      annualInsurance: 20000,
      annualMaintenance: 4000,
      resaleValuePercentageStandard: 46,
      resaleValuePercentageBass: 54
    }
  },
  {
    id: 'india_mahindra_xuv400',
    label: 'Mahindra XUV400 EV vs Mahindra XUV700 Petrol',
    market: 'India',
    settings: {
      currency: 'INR',
      currencySymbol: '₹',
      distanceUnit: 'km',
      annualKm: 20000,
      ownershipYears: 5,
      gridCarbonIntensityGramsPerKWh: 550,
      petrolCarbonGramsPerLiter: 2310,
      locationCityRegion: 'Ahmedabad / Jaipur'
    },
    petrolInput: {
      modelName: 'Mahindra XUV700 2.0 Turbo Petrol',
      purchasePrice: 1650000,
      downPayment: 300000,
      loanTenureYears: 5,
      loanInterestRate: 9.0,
      fuelEfficiencyKmPerLiter: 11.2,
      petrolPricePerLiter: 102.50,
      petrolInflationRate: 4.0,
      annualInsurance: 42000,
      annualMaintenance: 18000,
      maintenanceInflationRate: 5.0,
      resaleValuePercentage: 50
    },
    evInput: {
      modelName: 'Mahindra XUV400 EV EL Pro',
      ownershipModel: 'standard',
      standardPurchasePrice: 1650000,
      bassChassisPrice: 1150000,
      governmentSubsidies: 0,
      homeChargerCost: 25000,
      downPayment: 300000,
      loanTenureYears: 5,
      loanInterestRate: 8.5,
      batteryCapacityKWh: 39.4,
      evEfficiencyKmPerKWh: 7.0,
      homeChargingPercentage: 80,
      publicChargerRatePerKWh: 21.0,
      electricityTariff: {
        baseRatePerKWh: 7.80,
        tariffType: 'tiered',
        offPeakRatePerKWh: 5.80,
        peakRatePerKWh: 9.50,
        offPeakUsagePercentage: 80,
        solarOffsetPercentage: 10,
        baselineHouseholdUnitsMonth: 400
      },
      bassMonthlyRental: 4000,
      bassIncludedKmPerMonth: 1500,
      bassExtraChargePerKm: 3.80,
      annualDegradationPercentage: 2.0,
      fastChargeFrequencyFactor: 'medium',
      batteryReplacementCost: 380000,
      batteryWarrantyYears: 8,
      annualInsurance: 38000,
      annualMaintenance: 7000,
      resaleValuePercentageStandard: 44,
      resaleValuePercentageBass: 54
    }
  }
];
