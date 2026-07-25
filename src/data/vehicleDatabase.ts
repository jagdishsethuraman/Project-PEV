export interface CatalogVehicle {
  id: string;
  name: string;
  brand: string;
  fuelType: 'ev' | 'petrol';
  category: 'Compact' | 'Sedan' | 'SUV' | 'Luxury' | 'Truck';
  purchasePriceUSD: number;
  // Consumption metrics
  consumption: {
    // For Petrol
    kmPerLiter?: number;
    mpg?: number;
    // For EV
    kWhPer100Km?: number;
    kmPerKWh?: number;
  };
  annualMaintenanceUSD: number;
  resaleValuePercentage5Yr: number; // Estimated % of original price retained after 5 years
  batteryCapacityKWh?: number; // EVs only
  bassChassisPriceUSD?: number; // Estimated chassis price without battery
  description: string;
  recommendedCompetitorId?: string;
}

export const EV_VEHICLES: CatalogVehicle[] = [
  {
    id: 'ev_tesla_m3_lr',
    name: 'Tesla Model 3 Long Range',
    brand: 'Tesla',
    fuelType: 'ev',
    category: 'Sedan',
    purchasePriceUSD: 42490,
    bassChassisPriceUSD: 31490,
    consumption: { kWhPer100Km: 14.7, kmPerKWh: 6.8 },
    annualMaintenanceUSD: 350,
    resaleValuePercentage5Yr: 52,
    batteryCapacityKWh: 75,
    description: 'Benchmark EV sedan with industry-leading efficiency and Supercharger network integration.',
    recommendedCompetitorId: 'petrol_bmw_330i'
  },
  {
    id: 'ev_tesla_my',
    name: 'Tesla Model Y Long Range',
    brand: 'Tesla',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 47990,
    bassChassisPriceUSD: 35990,
    consumption: { kWhPer100Km: 16.2, kmPerKWh: 6.2 },
    annualMaintenanceUSD: 380,
    resaleValuePercentage5Yr: 55,
    batteryCapacityKWh: 81,
    description: 'The best-selling crossover SUV worldwide featuring spacious cabin and fast DC charging.',
    recommendedCompetitorId: 'petrol_toyota_rav4'
  },
  {
    id: 'ev_hyundai_ioniq5',
    name: 'Hyundai Ioniq 5 AWD',
    brand: 'Hyundai',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 41800,
    bassChassisPriceUSD: 30800,
    consumption: { kWhPer100Km: 16.8, kmPerKWh: 6.0 },
    annualMaintenanceUSD: 420,
    resaleValuePercentage5Yr: 48,
    batteryCapacityKWh: 77.4,
    description: 'Retro-futuristic crossover with ultra-fast 800V architecture (10-80% charge in 18 minutes).',
    recommendedCompetitorId: 'petrol_honda_crv'
  },
  {
    id: 'ev_kia_ev6',
    name: 'Kia EV6 Wind RWD',
    brand: 'Kia',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 42600,
    bassChassisPriceUSD: 31600,
    consumption: { kWhPer100Km: 15.9, kmPerKWh: 6.3 },
    annualMaintenanceUSD: 410,
    resaleValuePercentage5Yr: 49,
    batteryCapacityKWh: 77.4,
    description: 'Sporty crossover coupe with dynamic handling, long range, and V2L vehicle-to-load power outlet.',
    recommendedCompetitorId: 'petrol_mazda_cx5'
  },
  {
    id: 'ev_ford_mache',
    name: 'Ford Mustang Mach-E Select',
    brand: 'Ford',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 39995,
    bassChassisPriceUSD: 29995,
    consumption: { kWhPer100Km: 17.5, kmPerKWh: 5.7 },
    annualMaintenanceUSD: 450,
    resaleValuePercentage5Yr: 46,
    batteryCapacityKWh: 72,
    description: 'All-electric SUV carrying Mustang legacy styling with responsive SYNC 4A infotainment.',
    recommendedCompetitorId: 'petrol_ford_mustang_gt'
  },
  {
    id: 'ev_nissan_leaf',
    name: 'Nissan Leaf SV Plus',
    brand: 'Nissan',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 36190,
    bassChassisPriceUSD: 25190,
    consumption: { kWhPer100Km: 18.0, kmPerKWh: 5.6 },
    annualMaintenanceUSD: 320,
    resaleValuePercentage5Yr: 38,
    batteryCapacityKWh: 60,
    description: 'Pioneer affordable urban EV hatch with e-Pedal one-pedal driving feature.',
    recommendedCompetitorId: 'petrol_nissan_rogue'
  },
  {
    id: 'ev_chevy_equinox',
    name: 'Chevrolet Equinox EV LT',
    brand: 'Chevrolet',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 34995,
    bassChassisPriceUSD: 24995,
    consumption: { kWhPer100Km: 16.5, kmPerKWh: 6.1 },
    annualMaintenanceUSD: 360,
    resaleValuePercentage5Yr: 47,
    batteryCapacityKWh: 85,
    description: 'Highly accessible mainstream electric SUV built on GM Ultium battery platform with up to 319 mi range.',
    recommendedCompetitorId: 'petrol_chevy_silverado'
  },
  {
    id: 'ev_bmw_i4',
    name: 'BMW i4 eDrive40',
    brand: 'BMW',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 57900,
    bassChassisPriceUSD: 43900,
    consumption: { kWhPer100Km: 16.1, kmPerKWh: 6.2 },
    annualMaintenanceUSD: 520,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 81.5,
    description: 'Luxury electric Gran Coupe delivering traditional BMW dynamics and refined acoustic cabin.',
    recommendedCompetitorId: 'petrol_bmw_330i'
  },
  {
    id: 'ev_vw_id4',
    name: 'Volkswagen ID.4 Pro',
    brand: 'Volkswagen',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 39735,
    bassChassisPriceUSD: 28735,
    consumption: { kWhPer100Km: 17.1, kmPerKWh: 5.8 },
    annualMaintenanceUSD: 400,
    resaleValuePercentage5Yr: 44,
    batteryCapacityKWh: 82,
    description: 'Practical family EV SUV with smooth power delivery and European ride quality.',
    recommendedCompetitorId: 'petrol_vw_golf'
  },
  {
    id: 'ev_porsche_taycan',
    name: 'Porsche Taycan 4S',
    brand: 'Porsche',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 111700,
    bassChassisPriceUSD: 86700,
    consumption: { kWhPer100Km: 20.5, kmPerKWh: 4.9 },
    annualMaintenanceUSD: 850,
    resaleValuePercentage5Yr: 54,
    batteryCapacityKWh: 93.4,
    description: 'High-performance luxury sports EV with 2-speed transmission and lightning launch performance.',
    recommendedCompetitorId: 'petrol_lexus_rx'
  },
  {
    id: 'ev_rivian_r1t',
    name: 'Rivian R1T Adventure',
    brand: 'Rivian',
    fuelType: 'ev',
    category: 'Truck',
    purchasePriceUSD: 69900,
    bassChassisPriceUSD: 52900,
    consumption: { kWhPer100Km: 23.5, kmPerKWh: 4.25 },
    annualMaintenanceUSD: 600,
    resaleValuePercentage5Yr: 56,
    batteryCapacityKWh: 135,
    description: 'All-electric adventure pickup truck with quad-motor AWD, gear tunnel, and 11,000 lbs towing.',
    recommendedCompetitorId: 'petrol_ford_f150'
  },
  {
    id: 'ev_audi_q4',
    name: 'Audi Q4 50 e-tron Quattro',
    brand: 'Audi',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 49800,
    bassChassisPriceUSD: 37800,
    consumption: { kWhPer100Km: 17.8, kmPerKWh: 5.6 },
    annualMaintenanceUSD: 510,
    resaleValuePercentage5Yr: 48,
    batteryCapacityKWh: 82,
    description: 'Compact luxury electric SUV with augmented reality head-up display and Virtual Cockpit.',
    recommendedCompetitorId: 'petrol_audi_a4'
  },
  {
    id: 'ev_volvo_ex30',
    name: 'Volvo EX30 Single Motor Extended',
    brand: 'Volvo',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 34950,
    bassChassisPriceUSD: 24950,
    consumption: { kWhPer100Km: 15.3, kmPerKWh: 6.5 },
    annualMaintenanceUSD: 380,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 69,
    description: 'Minimalist Scandinavian compact SUV with recycled interior materials and high safety tech.',
    recommendedCompetitorId: 'petrol_subaru_forester'
  },
  {
    id: 'ev_mg_zs',
    name: 'MG ZS EV Long Range',
    brand: 'MG',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 31000,
    bassChassisPriceUSD: 21000,
    consumption: { kWhPer100Km: 16.1, kmPerKWh: 6.2 },
    annualMaintenanceUSD: 320,
    resaleValuePercentage5Yr: 42,
    batteryCapacityKWh: 72.6,
    description: 'Popular value EV crossover widely adopted in Europe and Asia for urban family driving.',
    recommendedCompetitorId: 'petrol_kia_sportage'
  },
  {
    id: 'ev_tata_nexon',
    name: 'Tata Nexon EV Long Range',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 18500, // INR equivalent ~₹15.5 Lakhs
    bassChassisPriceUSD: 12500, // ~₹10.5 Lakhs
    consumption: { kWhPer100Km: 13.8, kmPerKWh: 7.2 },
    annualMaintenanceUSD: 150,
    resaleValuePercentage5Yr: 45,
    batteryCapacityKWh: 40.5,
    description: 'India\'s #1 EV SUV featuring BASS battery subscription option, V2L power, and 5-star GNCAP rating.',
    recommendedCompetitorId: 'petrol_hyundai_creta'
  },
  {
    id: 'ev_tata_punch',
    name: 'Tata Punch EV Empowers+',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 13800, // ~₹11.5 Lakhs
    bassChassisPriceUSD: 9200, // ~₹7.7 Lakhs
    consumption: { kWhPer100Km: 12.5, kmPerKWh: 8.0 },
    annualMaintenanceUSD: 120,
    resaleValuePercentage5Yr: 48,
    batteryCapacityKWh: 35,
    description: 'Popular micro-SUV EV built on acti.ev platform with 365km MIDC range and paddle regen controls.',
    recommendedCompetitorId: 'petrol_maruti_brezza'
  },
  {
    id: 'ev_tata_tiago',
    name: 'Tata Tiago EV Tech Lux',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 10200, // ~₹8.5 Lakhs
    bassChassisPriceUSD: 6800, // ~₹5.7 Lakhs
    consumption: { kWhPer100Km: 11.8, kmPerKWh: 8.5 },
    annualMaintenanceUSD: 100,
    resaleValuePercentage5Yr: 46,
    batteryCapacityKWh: 24,
    description: 'India\'s most accessible electric hatchback for daily city commute and low cost per km running.',
    recommendedCompetitorId: 'petrol_maruti_swift'
  },
  {
    id: 'ev_mg_windsor',
    name: 'MG Windsor EV (BaaS Available)',
    brand: 'MG',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 16500, // ~₹13.8 Lakhs
    bassChassisPriceUSD: 11900, // ~₹9.9 Lakhs upfront with ₹3.5/km battery rental
    consumption: { kWhPer100Km: 13.5, kmPerKWh: 7.4 },
    annualMaintenanceUSD: 140,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 38,
    description: 'India\'s pioneering CUV offering BaaS (Battery as a Service) pay-as-you-go program and lounge seats.',
    recommendedCompetitorId: 'petrol_honda_elevate'
  },
  {
    id: 'ev_mg_comet',
    name: 'MG Comet EV Plush',
    brand: 'MG',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 8900, // ~₹7.4 Lakhs
    bassChassisPriceUSD: 5900, // ~₹4.9 Lakhs
    consumption: { kWhPer100Km: 10.5, kmPerKWh: 9.5 },
    annualMaintenanceUSD: 90,
    resaleValuePercentage5Yr: 42,
    batteryCapacityKWh: 17.3,
    description: 'Ultra-compact 2-door urban EV designed specifically for congested Indian city traffic parking.',
    recommendedCompetitorId: 'petrol_maruti_swift'
  },
  {
    id: 'ev_mahindra_xuv400',
    name: 'Mahindra XUV400 EV EL Pro',
    brand: 'Mahindra',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 19800, // ~₹16.5 Lakhs
    bassChassisPriceUSD: 13500,
    consumption: { kWhPer100Km: 14.2, kmPerKWh: 7.0 },
    annualMaintenanceUSD: 160,
    resaleValuePercentage5Yr: 44,
    batteryCapacityKWh: 39.4,
    description: 'Spacious 4.2m EV SUV with 0-100 km/h in 8.3s, dual screen cockpit and copper accents.',
    recommendedCompetitorId: 'petrol_mahindra_xuv700'
  },
  {
    id: 'ev_byd_atto3',
    name: 'BYD Atto 3 Extended Range',
    brand: 'BYD',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 32500,
    bassChassisPriceUSD: 22500,
    consumption: { kWhPer100Km: 15.6, kmPerKWh: 6.4 },
    annualMaintenanceUSD: 340,
    resaleValuePercentage5Yr: 47,
    batteryCapacityKWh: 60.48,
    description: 'Global EV crossover powered by BYD Blade Battery (LFP) technology known for extreme thermal safety.',
    recommendedCompetitorId: 'petrol_toyota_corolla'
  },
  {
    id: 'ev_polestar2',
    name: 'Polestar 2 Long Range Single Motor',
    brand: 'Polestar',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 49900,
    bassChassisPriceUSD: 37900,
    consumption: { kWhPer100Km: 15.8, kmPerKWh: 6.3 },
    annualMaintenanceUSD: 470,
    resaleValuePercentage5Yr: 47,
    batteryCapacityKWh: 82,
    description: 'Avant-garde fastback electric sedan with Android Automotive OS built-in and crisp design.',
    recommendedCompetitorId: 'petrol_mercedes_c300'
  },
  {
    id: 'ev_hyundai_kona',
    name: 'Hyundai Kona Electric Limited',
    brand: 'Hyundai',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 32675,
    bassChassisPriceUSD: 22675,
    consumption: { kWhPer100Km: 15.0, kmPerKWh: 6.6 },
    annualMaintenanceUSD: 330,
    resaleValuePercentage5Yr: 45,
    batteryCapacityKWh: 64.8,
    description: 'Compact EV crossover with dual 12.3-inch panoramic screens and highway driving assist.',
    recommendedCompetitorId: 'petrol_hyundai_elantra'
  },
  {
    id: 'ev_mercedes_eqe',
    name: 'Mercedes-Benz EQE 350+ Sedan',
    brand: 'Mercedes-Benz',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 74900,
    bassChassisPriceUSD: 57900,
    consumption: { kWhPer100Km: 18.2, kmPerKWh: 5.5 },
    annualMaintenanceUSD: 680,
    resaleValuePercentage5Yr: 46,
    batteryCapacityKWh: 90.6,
    description: 'Ultra-quiet aerodynamic luxury sedan with Hyperscreen dashboard option and air suspension.',
    recommendedCompetitorId: 'petrol_mercedes_c300'
  },
  {
    id: 'ev_fiat_500e',
    name: 'Fiat 500e RED Edition',
    brand: 'Fiat',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 32500,
    bassChassisPriceUSD: 22500,
    consumption: { kWhPer100Km: 13.2, kmPerKWh: 7.5 },
    annualMaintenanceUSD: 280,
    resaleValuePercentage5Yr: 41,
    batteryCapacityKWh: 42,
    description: 'Chic Italian electric city car with nimble turning radius, ideal for dense urban parking.',
    recommendedCompetitorId: 'petrol_honda_civic'
  }
];

export const PETROL_VEHICLES: CatalogVehicle[] = [
  {
    id: 'petrol_toyota_camry',
    name: 'Toyota Camry LE 2.5L',
    brand: 'Toyota',
    fuelType: 'petrol',
    category: 'Sedan',
    purchasePriceUSD: 26420,
    consumption: { kmPerLiter: 14.8, mpg: 35 },
    annualMaintenanceUSD: 550,
    resaleValuePercentage5Yr: 58,
    description: 'Bulletproof reliability benchmark sedan with low depreciation and widespread service availability.',
    recommendedCompetitorId: 'ev_tesla_m3_lr'
  },
  {
    id: 'petrol_honda_civic',
    name: 'Honda Civic Sport 2.0L',
    brand: 'Honda',
    fuelType: 'petrol',
    category: 'Sedan',
    purchasePriceUSD: 25050,
    consumption: { kmPerLiter: 15.3, mpg: 36 },
    annualMaintenanceUSD: 520,
    resaleValuePercentage5Yr: 60,
    description: 'Fun-to-drive compact sedan with ergonomic cabin and excellent fuel efficiency.',
    recommendedCompetitorId: 'ev_fiat_500e'
  },
  {
    id: 'petrol_toyota_rav4',
    name: 'Toyota RAV4 XLE 2.5L',
    brand: 'Toyota',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 30025,
    consumption: { kmPerLiter: 12.8, mpg: 30 },
    annualMaintenanceUSD: 620,
    resaleValuePercentage5Yr: 62,
    description: 'America\'s top-selling non-pickup vehicle offering rugged styling and solid resale retention.',
    recommendedCompetitorId: 'ev_tesla_my'
  },
  {
    id: 'petrol_ford_f150',
    name: 'Ford F-150 XLT 3.5L V6',
    brand: 'Ford',
    fuelType: 'petrol',
    category: 'Truck',
    purchasePriceUSD: 43620,
    consumption: { kmPerLiter: 8.9, mpg: 21 },
    annualMaintenanceUSD: 950,
    resaleValuePercentage5Yr: 59,
    description: 'Iconic full-size pickup truck with class-leading payload and Pro Power Onboard generator.',
    recommendedCompetitorId: 'ev_rivian_r1t'
  },
  {
    id: 'petrol_honda_crv',
    name: 'Honda CR-V EX 1.5L Turbo',
    brand: 'Honda',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 32010,
    consumption: { kmPerLiter: 13.2, mpg: 31 },
    annualMaintenanceUSD: 580,
    resaleValuePercentage5Yr: 61,
    description: 'Spacious family SUV with refined CVT transmission and Honda Sensing safety suite.',
    recommendedCompetitorId: 'ev_hyundai_ioniq5'
  },
  {
    id: 'petrol_bmw_330i',
    name: 'BMW 330i Sedan 2.0L Turbo',
    brand: 'BMW',
    fuelType: 'petrol',
    category: 'Luxury',
    purchasePriceUSD: 44500,
    consumption: { kmPerLiter: 12.3, mpg: 29 },
    annualMaintenanceUSD: 1100,
    resaleValuePercentage5Yr: 48,
    description: 'Definitive sports sedan with 255 hp TwinPower Turbo engine and sharp chassis dynamics.',
    recommendedCompetitorId: 'ev_bmw_i4'
  },
  {
    id: 'petrol_hyundai_elantra',
    name: 'Hyundai Elantra SEL 2.0L',
    brand: 'Hyundai',
    fuelType: 'petrol',
    category: 'Sedan',
    purchasePriceUSD: 23575,
    consumption: { kmPerLiter: 15.7, mpg: 37 },
    annualMaintenanceUSD: 480,
    resaleValuePercentage5Yr: 51,
    description: 'Feature-packed compact sedan offering 10-year / 100,000-mile powertrain warranty.',
    recommendedCompetitorId: 'ev_hyundai_kona'
  },
  {
    id: 'petrol_mazda_cx5',
    name: 'Mazda CX-5 2.5 S Select',
    brand: 'Mazda',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 29300,
    consumption: { kmPerLiter: 11.9, mpg: 28 },
    annualMaintenanceUSD: 640,
    resaleValuePercentage5Yr: 54,
    description: 'Premium-feeling compact SUV with standard i-Activ AWD and upscale interior trim.',
    recommendedCompetitorId: 'ev_kia_ev6'
  },
  {
    id: 'petrol_vw_golf',
    name: 'Volkswagen Golf TSI 1.5L',
    brand: 'Volkswagen',
    fuelType: 'petrol',
    category: 'Compact',
    purchasePriceUSD: 28200,
    consumption: { kmPerLiter: 16.0, mpg: 38 },
    annualMaintenanceUSD: 680,
    resaleValuePercentage5Yr: 52,
    description: 'European hatchback icon providing solid high-speed stability and flexible cargo space.',
    recommendedCompetitorId: 'ev_vw_id4'
  },
  {
    id: 'petrol_toyota_corolla',
    name: 'Toyota Corolla LE 1.8L',
    brand: 'Toyota',
    fuelType: 'petrol',
    category: 'Compact',
    purchasePriceUSD: 22050,
    consumption: { kmPerLiter: 15.0, mpg: 35 },
    annualMaintenanceUSD: 450,
    resaleValuePercentage5Yr: 63,
    description: 'Economical commuter vehicle renowned for low maintenance requirements and bulletproof engine.',
    recommendedCompetitorId: 'ev_byd_atto3'
  },
  {
    id: 'petrol_mercedes_c300',
    name: 'Mercedes-Benz C300 Sedan',
    brand: 'Mercedes-Benz',
    fuelType: 'petrol',
    category: 'Luxury',
    purchasePriceUSD: 46950,
    consumption: { kmPerLiter: 11.5, mpg: 27 },
    annualMaintenanceUSD: 1250,
    resaleValuePercentage5Yr: 45,
    description: 'Executive luxury sedan featuring 48V mild-hybrid engine boost and ambient lighting cabin.',
    recommendedCompetitorId: 'ev_mercedes_eqe'
  },
  {
    id: 'petrol_ford_mustang_gt',
    name: 'Ford Mustang GT 5.0L V8',
    brand: 'Ford',
    fuelType: 'petrol',
    category: 'Sedan',
    purchasePriceUSD: 42495,
    consumption: { kmPerLiter: 8.1, mpg: 19 },
    annualMaintenanceUSD: 850,
    resaleValuePercentage5Yr: 55,
    description: 'V8 American muscle car delivering 486 horsepower and unmistakable engine rumble.',
    recommendedCompetitorId: 'ev_ford_mache'
  },
  {
    id: 'petrol_chevy_silverado',
    name: 'Chevrolet Silverado 1500 5.3L V8',
    brand: 'Chevrolet',
    fuelType: 'petrol',
    category: 'Truck',
    purchasePriceUSD: 44500,
    consumption: { kmPerLiter: 7.7, mpg: 18 },
    annualMaintenanceUSD: 980,
    resaleValuePercentage5Yr: 57,
    description: 'Heavy-duty full-size pickup truck with Duramax diesel / V8 towing endurance.',
    recommendedCompetitorId: 'ev_chevy_equinox'
  },
  {
    id: 'petrol_subaru_forester',
    name: 'Subaru Forester Premium 2.5L',
    brand: 'Subaru',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 30295,
    consumption: { kmPerLiter: 12.3, mpg: 29 },
    annualMaintenanceUSD: 660,
    resaleValuePercentage5Yr: 58,
    description: 'All-weather AWD crossover with outstanding outward visibility and EyeSight driver assistance.',
    recommendedCompetitorId: 'ev_volvo_ex30'
  },
  {
    id: 'petrol_nissan_rogue',
    name: 'Nissan Rogue SV 1.5L Turbo',
    brand: 'Nissan',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 29800,
    consumption: { kmPerLiter: 13.6, mpg: 32 },
    annualMaintenanceUSD: 610,
    resaleValuePercentage5Yr: 50,
    description: 'Family crossover featuring variable compression turbo engine and Zero Gravity seating.',
    recommendedCompetitorId: 'ev_nissan_leaf'
  },
  {
    id: 'petrol_kia_sportage',
    name: 'Kia Sportage LX 2.5L',
    brand: 'Kia',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 27190,
    consumption: { kmPerLiter: 11.9, mpg: 28 },
    annualMaintenanceUSD: 540,
    resaleValuePercentage5Yr: 52,
    description: 'Modern crossover with boomerang DRL lights and class-leading rear legroom.',
    recommendedCompetitorId: 'ev_mg_zs'
  },
  {
    id: 'petrol_audi_a4',
    name: 'Audi A4 40 TFSI Quattro',
    brand: 'Audi',
    fuelType: 'petrol',
    category: 'Luxury',
    purchasePriceUSD: 41900,
    consumption: { kmPerLiter: 11.9, mpg: 28 },
    annualMaintenanceUSD: 1180,
    resaleValuePercentage5Yr: 46,
    description: 'German luxury sedan with legendary Quattro all-wheel drive stability in all weather.',
    recommendedCompetitorId: 'ev_audi_q4'
  },
  {
    id: 'petrol_jeep_grand_cherokee',
    name: 'Jeep Grand Cherokee Laredo 3.6L',
    brand: 'Jeep',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 36495,
    consumption: { kmPerLiter: 9.8, mpg: 23 },
    annualMaintenanceUSD: 890,
    resaleValuePercentage5Yr: 51,
    description: 'Mid-size SUV with legendary off-road 4x4 capability and comfortable highway cruiser feel.',
    recommendedCompetitorId: 'ev_tesla_my'
  },
  {
    id: 'petrol_lexus_rx',
    name: 'Lexus RX 350 2.4L Turbo',
    brand: 'Lexus',
    fuelType: 'petrol',
    category: 'Luxury',
    purchasePriceUSD: 49950,
    consumption: { kmPerLiter: 10.6, mpg: 25 },
    annualMaintenanceUSD: 720,
    resaleValuePercentage5Yr: 61,
    description: 'Luxury crossover with top-tier reliability ranking and whisper-quiet cabin insulation.',
    recommendedCompetitorId: 'ev_porsche_taycan'
  },
  {
    id: 'petrol_hyundai_creta',
    name: 'Hyundai Creta 1.5L Petrol',
    brand: 'Hyundai',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14200, // INR equivalent ~₹11.8 Lakhs
    consumption: { kmPerLiter: 14.5, mpg: 34 },
    annualMaintenanceUSD: 220,
    resaleValuePercentage5Yr: 52,
    description: 'India\'s top-selling compact SUV featuring panoramic sunroof, ADAS, and smooth 1.5L MPi petrol engine.',
    recommendedCompetitorId: 'ev_tata_nexon'
  },
  {
    id: 'petrol_maruti_brezza',
    name: 'Maruti Suzuki Brezza 1.5L K-Series',
    brand: 'Maruti Suzuki',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 11200, // ~₹9.3 Lakhs
    consumption: { kmPerLiter: 17.4, mpg: 41 },
    annualMaintenanceUSD: 180,
    resaleValuePercentage5Yr: 62,
    description: 'High-mileage urban SUV with Smart Hybrid technology, low upkeep cost and high resale value across India.',
    recommendedCompetitorId: 'ev_tata_punch'
  },
  {
    id: 'petrol_maruti_swift',
    name: 'Maruti Suzuki Swift 1.2L Z-Series',
    brand: 'Maruti Suzuki',
    fuelType: 'petrol',
    category: 'Compact',
    purchasePriceUSD: 8500, // ~₹7.1 Lakhs
    consumption: { kmPerLiter: 22.0, mpg: 51 },
    annualMaintenanceUSD: 140,
    resaleValuePercentage5Yr: 60,
    description: 'India\'s benchmark mileage hatchback delivering over 22 km/L efficiency and cheap spare parts.',
    recommendedCompetitorId: 'ev_tata_tiago'
  },
  {
    id: 'petrol_honda_elevate',
    name: 'Honda Elevate 1.5L i-VTEC',
    brand: 'Honda',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14500, // ~₹12.1 Lakhs
    consumption: { kmPerLiter: 15.3, mpg: 36 },
    annualMaintenanceUSD: 230,
    resaleValuePercentage5Yr: 54,
    description: 'Comfortable family SUV with high 220mm ground clearance, plush suspension and refined naturally aspirated engine.',
    recommendedCompetitorId: 'ev_mg_windsor'
  },
  {
    id: 'petrol_mahindra_xuv700',
    name: 'Mahindra XUV700 2.0L mStallion Turbo',
    brand: 'Mahindra',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 18800, // ~₹15.6 Lakhs
    consumption: { kmPerLiter: 11.2, mpg: 26 },
    annualMaintenanceUSD: 280,
    resaleValuePercentage5Yr: 50,
    description: 'Power-packed 200 PS 7-seater SUV with dual 10.25-inch screens and Level 2 ADAS safety.',
    recommendedCompetitorId: 'ev_mahindra_xuv400'
  }
];

export const ALL_VEHICLES = [...EV_VEHICLES, ...PETROL_VEHICLES];
