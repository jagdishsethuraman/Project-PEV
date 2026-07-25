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
    id: 'ev_tata_nexon',
    name: 'Tata Nexon EV Long Range',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 18675, // ~₹15.5 Lakhs
    bassChassisPriceUSD: 12650, // ~₹10.5 Lakhs under BaaS
    consumption: { kWhPer100Km: 13.8, kmPerKWh: 7.2 },
    annualMaintenanceUSD: 150,
    resaleValuePercentage5Yr: 45,
    batteryCapacityKWh: 40.5,
    description: 'India\'s #1 EV SUV featuring BaaS battery subscription option, V2L power output, and 5-star GNCAP safety rating.',
    recommendedCompetitorId: 'petrol_hyundai_creta'
  },
  {
    id: 'ev_tata_punch',
    name: 'Tata Punch.ev Empowered+',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 13855, // ~₹11.5 Lakhs
    bassChassisPriceUSD: 9275, // ~₹7.7 Lakhs under BaaS
    consumption: { kWhPer100Km: 12.5, kmPerKWh: 8.0 },
    annualMaintenanceUSD: 120,
    resaleValuePercentage5Yr: 48,
    batteryCapacityKWh: 35,
    description: 'Popular micro-SUV built on acti.ev platform with 365km MIDC range, frunk storage, and 4-step paddle regen.',
    recommendedCompetitorId: 'petrol_maruti_brezza'
  },
  {
    id: 'ev_tata_curvv',
    name: 'Tata Curvv.ev 55 kWh',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 22285, // ~₹18.5 Lakhs
    bassChassisPriceUSD: 15660, // ~₹13.0 Lakhs under BaaS
    consumption: { kWhPer100Km: 13.0, kmPerKWh: 7.7 },
    annualMaintenanceUSD: 160,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 55,
    description: 'Futuristic SUV coupe featuring 502 km real-world range, liquid-cooled battery pack, level 2 ADAS, and fast DC charging.',
    recommendedCompetitorId: 'petrol_tata_curvv'
  },
  {
    id: 'ev_tata_tiago',
    name: 'Tata Tiago.ev Tech Lux',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 10240, // ~₹8.5 Lakhs
    bassChassisPriceUSD: 6865, // ~₹5.7 Lakhs
    consumption: { kWhPer100Km: 11.8, kmPerKWh: 8.5 },
    annualMaintenanceUSD: 100,
    resaleValuePercentage5Yr: 46,
    batteryCapacityKWh: 24,
    description: 'India\'s most accessible electric hatchback for daily city commutes, delivering low cost per km and automatic drive modes.',
    recommendedCompetitorId: 'petrol_maruti_swift'
  },
  {
    id: 'ev_tata_tigor',
    name: 'Tata Tigor.ev XZ+',
    brand: 'Tata',
    fuelType: 'ev',
    category: 'Sedan',
    purchasePriceUSD: 15060, // ~₹12.5 Lakhs
    bassChassisPriceUSD: 10240,
    consumption: { kWhPer100Km: 12.8, kmPerKWh: 7.8 },
    annualMaintenanceUSD: 130,
    resaleValuePercentage5Yr: 44,
    batteryCapacityKWh: 26,
    description: 'Practical electric compact sedan offering 4-star GNCAP rating, 315km range, and spacious boot capacity.',
    recommendedCompetitorId: 'petrol_honda_city'
  },
  {
    id: 'ev_mg_windsor',
    name: 'MG Windsor EV (BaaS Available)',
    brand: 'MG',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 16625, // ~₹13.8 Lakhs
    bassChassisPriceUSD: 11925, // ~₹9.9 Lakhs upfront with ₹3.5/km battery rental
    consumption: { kWhPer100Km: 13.5, kmPerKWh: 7.4 },
    annualMaintenanceUSD: 140,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 38,
    description: 'India\'s pioneering CUV offering BaaS (Battery as a Service) pay-as-you-go program, 135-degree lounge reclining seats, and 15.6-inch screen.',
    recommendedCompetitorId: 'petrol_honda_elevate'
  },
  {
    id: 'ev_mg_comet',
    name: 'MG Comet EV Plush',
    brand: 'MG',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 8915, // ~₹7.4 Lakhs
    bassChassisPriceUSD: 5900, // ~₹4.9 Lakhs
    consumption: { kWhPer100Km: 10.5, kmPerKWh: 9.5 },
    annualMaintenanceUSD: 90,
    resaleValuePercentage5Yr: 42,
    batteryCapacityKWh: 17.3,
    description: 'Ultra-compact 2-door urban EV designed specifically for tight parking and congested Indian city traffic.',
    recommendedCompetitorId: 'petrol_maruti_swift'
  },
  {
    id: 'ev_mg_zs',
    name: 'MG ZS EV Essence',
    brand: 'MG',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 26500, // ~₹22.0 Lakhs
    bassChassisPriceUSD: 18000,
    consumption: { kWhPer100Km: 16.1, kmPerKWh: 6.2 },
    annualMaintenanceUSD: 220,
    resaleValuePercentage5Yr: 47,
    batteryCapacityKWh: 50.3,
    description: 'Refined electric SUV with panoramic sunroof, 461km range, i-SMART connected car suite, and 360-degree camera.',
    recommendedCompetitorId: 'petrol_kia_seltos'
  },
  {
    id: 'ev_mahindra_xuv400',
    name: 'Mahindra XUV400 EV EL Pro',
    brand: 'Mahindra',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 19880, // ~₹16.5 Lakhs
    bassChassisPriceUSD: 13500,
    consumption: { kWhPer100Km: 14.2, kmPerKWh: 7.0 },
    annualMaintenanceUSD: 160,
    resaleValuePercentage5Yr: 44,
    batteryCapacityKWh: 39.4,
    description: 'Spacious 4.2m EV SUV with 0-100 km/h in 8.3s, dual screen cockpit, copper accents, and 456km range.',
    recommendedCompetitorId: 'petrol_mahindra_xuv700'
  },
  {
    id: 'ev_mahindra_be6e',
    name: 'Mahindra BE 6e Pack 1',
    brand: 'Mahindra',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 22770, // ~₹18.9 Lakhs
    bassChassisPriceUSD: 15660,
    consumption: { kWhPer100Km: 13.6, kmPerKWh: 7.35 },
    annualMaintenanceUSD: 170,
    resaleValuePercentage5Yr: 52,
    batteryCapacityKWh: 59,
    description: 'Next-generation INGLO platform electric SUV featuring 175kW ultra-fast DC charging (20-80% in 20 min) and futuristic cockpit.',
    recommendedCompetitorId: 'petrol_mahindra_xuv700'
  },
  {
    id: 'ev_hyundai_creta_ev',
    name: 'Hyundai Creta EV Executive',
    brand: 'Hyundai',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 21080, // ~₹17.5 Lakhs
    bassChassisPriceUSD: 14450,
    consumption: { kWhPer100Km: 13.5, kmPerKWh: 7.4 },
    annualMaintenanceUSD: 160,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 45,
    description: 'Electric avatar of India\'s favorite mid-size SUV featuring V2L discharge capability and panoramic twin displays.',
    recommendedCompetitorId: 'petrol_hyundai_creta'
  },
  {
    id: 'ev_hyundai_ioniq5',
    name: 'Hyundai Ioniq 5 72.6kWh',
    brand: 'Hyundai',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 55420, // ~₹46.0 Lakhs
    bassChassisPriceUSD: 42000,
    consumption: { kWhPer100Km: 16.8, kmPerKWh: 6.0 },
    annualMaintenanceUSD: 350,
    resaleValuePercentage5Yr: 52,
    batteryCapacityKWh: 72.6,
    description: 'Retro-futuristic luxury crossover assembled in India with ultra-fast 800V architecture (10-80% charge in 18 minutes).',
    recommendedCompetitorId: 'petrol_bmw_330li'
  },
  {
    id: 'ev_byd_atto3',
    name: 'BYD Atto 3 Dynamic',
    brand: 'BYD',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 30000, // ~₹24.9 Lakhs
    bassChassisPriceUSD: 21500,
    consumption: { kWhPer100Km: 15.6, kmPerKWh: 6.4 },
    annualMaintenanceUSD: 240,
    resaleValuePercentage5Yr: 48,
    batteryCapacityKWh: 49.92,
    description: 'Premium electric crossover powered by ultra-safe BYD Blade Battery (LFP) technology and rotating touchscreen.',
    recommendedCompetitorId: 'petrol_toyota_hyryder'
  },
  {
    id: 'ev_byd_emax7',
    name: 'BYD eMAX 7 Superior',
    brand: 'BYD',
    fuelType: 'ev',
    category: 'SUV',
    purchasePriceUSD: 32400, // ~₹26.9 Lakhs
    bassChassisPriceUSD: 23500,
    consumption: { kWhPer100Km: 16.2, kmPerKWh: 6.1 },
    annualMaintenanceUSD: 260,
    resaleValuePercentage5Yr: 47,
    batteryCapacityKWh: 71.8,
    description: 'Luxurious 6/7-seater family MPV EV with 530km range, VTOL power bank output, and plush captain seats.',
    recommendedCompetitorId: 'petrol_mahindra_xuv700'
  },
  {
    id: 'ev_citroen_ec3',
    name: 'Citroën eC3 Feel',
    brand: 'Citroën',
    fuelType: 'ev',
    category: 'Compact',
    purchasePriceUSD: 13975, // ~₹11.6 Lakhs
    bassChassisPriceUSD: 9400,
    consumption: { kWhPer100Km: 12.0, kmPerKWh: 8.3 },
    annualMaintenanceUSD: 110,
    resaleValuePercentage5Yr: 42,
    batteryCapacityKWh: 29.2,
    description: 'Comfortable electric hatchback with plush French suspension tuned for Indian potholed roads.',
    recommendedCompetitorId: 'petrol_maruti_fronx'
  },
  {
    id: 'ev_kia_ev6',
    name: 'Kia EV6 GT-Line AWD',
    brand: 'Kia',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 73370, // ~₹60.9 Lakhs
    bassChassisPriceUSD: 56000,
    consumption: { kWhPer100Km: 15.9, kmPerKWh: 6.3 },
    annualMaintenanceUSD: 420,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 77.4,
    description: 'Sporty high-performance electric crossover with 708km MIDC range, dual-motor AWD, and 325 PS power output.',
    recommendedCompetitorId: 'petrol_bmw_330li'
  },
  {
    id: 'ev_bmw_ix1',
    name: 'BMW iX1 xDrive30',
    brand: 'BMW',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 80600, // ~₹66.9 Lakhs
    bassChassisPriceUSD: 62000,
    consumption: { kWhPer100Km: 16.5, kmPerKWh: 6.0 },
    annualMaintenanceUSD: 480,
    resaleValuePercentage5Yr: 52,
    batteryCapacityKWh: 66.4,
    description: 'All-electric luxury SAV with xDrive AWD, Curved Display, and iconic BMW driving dynamics.',
    recommendedCompetitorId: 'petrol_bmw_330li'
  },
  {
    id: 'ev_bmw_i4',
    name: 'BMW i4 eDrive40',
    brand: 'BMW',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 87350, // ~₹72.5 Lakhs
    bassChassisPriceUSD: 67000,
    consumption: { kWhPer100Km: 16.1, kmPerKWh: 6.2 },
    annualMaintenanceUSD: 520,
    resaleValuePercentage5Yr: 54,
    batteryCapacityKWh: 83.9,
    description: 'Luxury electric Gran Coupe with 590km range, air suspension, and classic rear-wheel drive engagement.',
    recommendedCompetitorId: 'petrol_bmw_330li'
  },
  {
    id: 'ev_mercedes_eqb',
    name: 'Mercedes-Benz EQB 350 4MATIC',
    brand: 'Mercedes-Benz',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 93370, // ~₹77.5 Lakhs
    bassChassisPriceUSD: 72000,
    consumption: { kWhPer100Km: 17.5, kmPerKWh: 5.7 },
    annualMaintenanceUSD: 580,
    resaleValuePercentage5Yr: 48,
    batteryCapacityKWh: 66.5,
    description: 'Versatile 7-seater luxury electric SUV featuring 4MATIC all-wheel drive and MBUX hyperscreen cabin.',
    recommendedCompetitorId: 'petrol_mercedes_gla'
  },
  {
    id: 'ev_volvo_xc40_recharge',
    name: 'Volvo XC40 Recharge Plus',
    brand: 'Volvo',
    fuelType: 'ev',
    category: 'Luxury',
    purchasePriceUSD: 66140, // ~₹54.9 Lakhs
    bassChassisPriceUSD: 50000,
    consumption: { kWhPer100Km: 17.0, kmPerKWh: 5.9 },
    annualMaintenanceUSD: 400,
    resaleValuePercentage5Yr: 50,
    batteryCapacityKWh: 69,
    description: 'Safety-focused Scandinavian electric SUV assembled in India with Google Built-in infotainment and Harman Kardon audio.',
    recommendedCompetitorId: 'petrol_mercedes_gla'
  }
];

export const PETROL_VEHICLES: CatalogVehicle[] = [
  {
    id: 'petrol_hyundai_creta',
    name: 'Hyundai Creta 1.5L Petrol',
    brand: 'Hyundai',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14215, // ~₹11.8 Lakhs
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
    purchasePriceUSD: 8550, // ~₹7.1 Lakhs
    consumption: { kmPerLiter: 22.0, mpg: 51 },
    annualMaintenanceUSD: 140,
    resaleValuePercentage5Yr: 60,
    description: 'India\'s benchmark mileage hatchback delivering over 22 km/L efficiency and low-cost spare parts network.',
    recommendedCompetitorId: 'ev_tata_tiago'
  },
  {
    id: 'petrol_maruti_fronx',
    name: 'Maruti Suzuki Fronx 1.2L DualJet',
    brand: 'Maruti Suzuki',
    fuelType: 'petrol',
    category: 'Compact',
    purchasePriceUSD: 10120, // ~₹8.4 Lakhs
    consumption: { kmPerLiter: 20.1, mpg: 47 },
    annualMaintenanceUSD: 160,
    resaleValuePercentage5Yr: 58,
    description: 'Sporty crossover coupe with high ground clearance, 360 camera, head-up display, and peppy engine.',
    recommendedCompetitorId: 'ev_citroen_ec3'
  },
  {
    id: 'petrol_maruti_baleno',
    name: 'Maruti Suzuki Baleno 1.2L Alpha',
    brand: 'Maruti Suzuki',
    fuelType: 'petrol',
    category: 'Compact',
    purchasePriceUSD: 10600, // ~₹8.8 Lakhs
    consumption: { kmPerLiter: 22.3, mpg: 52 },
    annualMaintenanceUSD: 150,
    resaleValuePercentage5Yr: 59,
    description: 'Premium hatchback offering spacious rear legroom, 9-inch SmartPlay Pro+ infotainment, and strong resale value.',
    recommendedCompetitorId: 'ev_tata_tiago'
  },
  {
    id: 'petrol_tata_nexon',
    name: 'Tata Nexon 1.2L Revotron Turbo',
    brand: 'Tata',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 12650, // ~₹10.5 Lakhs
    consumption: { kmPerLiter: 17.0, mpg: 40 },
    annualMaintenanceUSD: 200,
    resaleValuePercentage5Yr: 50,
    description: '5-star GNCAP rated compact SUV featuring 120 PS turbo petrol engine, sequential LED DRLs, and JBL sound.',
    recommendedCompetitorId: 'ev_tata_nexon'
  },
  {
    id: 'petrol_tata_punch',
    name: 'Tata Punch 1.2L Revotron',
    brand: 'Tata',
    fuelType: 'petrol',
    category: 'Compact',
    purchasePriceUSD: 9035, // ~₹7.5 Lakhs
    consumption: { kmPerLiter: 18.8, mpg: 44 },
    annualMaintenanceUSD: 150,
    resaleValuePercentage5Yr: 54,
    description: 'Robust 5-star GNCAP micro-SUV with 187mm ground clearance, 90-degree door openings, and command seating position.',
    recommendedCompetitorId: 'ev_tata_punch'
  },
  {
    id: 'petrol_tata_curvv',
    name: 'Tata Curvv 1.2L Hyperion GDi',
    brand: 'Tata',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 13855, // ~₹11.5 Lakhs
    consumption: { kmPerLiter: 15.5, mpg: 36 },
    annualMaintenanceUSD: 220,
    resaleValuePercentage5Yr: 50,
    description: 'Sleek petrol SUV coupe powered by direct injection turbo engine, panoramic glass roof, and powered tailgate.',
    recommendedCompetitorId: 'ev_tata_curvv'
  },
  {
    id: 'petrol_mahindra_xuv700',
    name: 'Mahindra XUV700 2.0L mStallion Turbo',
    brand: 'Mahindra',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 18795, // ~₹15.6 Lakhs
    consumption: { kmPerLiter: 11.2, mpg: 26 },
    annualMaintenanceUSD: 280,
    resaleValuePercentage5Yr: 50,
    description: 'Power-packed 200 PS 7-seater SUV with dual 10.25-inch screens, flush door handles, and Level 2 ADAS safety.',
    recommendedCompetitorId: 'ev_mahindra_be6e'
  },
  {
    id: 'petrol_mahindra_thar',
    name: 'Mahindra Thar 1.5L / 2.0L Petrol',
    brand: 'Mahindra',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 13615, // ~₹11.3 Lakhs
    consumption: { kmPerLiter: 11.5, mpg: 27 },
    annualMaintenanceUSD: 260,
    resaleValuePercentage5Yr: 64,
    description: 'Iconic 4x4 & RWD lifestyle off-road SUV with removable hard top, high resale retention, and rugged appeal.',
    recommendedCompetitorId: 'ev_mahindra_xuv400'
  },
  {
    id: 'petrol_mahindra_3xo',
    name: 'Mahindra XUV 3XO 1.2L Turbo',
    brand: 'Mahindra',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 11800, // ~₹9.8 Lakhs
    consumption: { kmPerLiter: 18.2, mpg: 43 },
    annualMaintenanceUSD: 190,
    resaleValuePercentage5Yr: 52,
    description: 'Sub-4m SUV with panoramic Skyroof, 130 PS mStallion TGDi engine, 6 airbags standard, and electronic parking brake.',
    recommendedCompetitorId: 'ev_tata_punch'
  },
  {
    id: 'petrol_honda_elevate',
    name: 'Honda Elevate 1.5L i-VTEC',
    brand: 'Honda',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14580, // ~₹12.1 Lakhs
    consumption: { kmPerLiter: 15.3, mpg: 36 },
    annualMaintenanceUSD: 230,
    resaleValuePercentage5Yr: 54,
    description: 'Comfortable family SUV with high 220mm ground clearance, plush suspension, and refined naturally aspirated engine.',
    recommendedCompetitorId: 'ev_mg_windsor'
  },
  {
    id: 'petrol_honda_city',
    name: 'Honda City 1.5L i-VTEC ZX',
    brand: 'Honda',
    fuelType: 'petrol',
    category: 'Sedan',
    purchasePriceUSD: 17470, // ~₹14.5 Lakhs
    consumption: { kmPerLiter: 17.8, mpg: 42 },
    annualMaintenanceUSD: 240,
    resaleValuePercentage5Yr: 55,
    description: 'Benchmark executive sedan in India featuring Honda Sensing ADAS, lane watch camera, and smooth 121 PS engine.',
    recommendedCompetitorId: 'ev_tata_tigor'
  },
  {
    id: 'petrol_kia_seltos',
    name: 'Kia Seltos 1.5L Smartstream',
    brand: 'Kia',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14940, // ~₹12.4 Lakhs
    consumption: { kmPerLiter: 17.0, mpg: 40 },
    annualMaintenanceUSD: 230,
    resaleValuePercentage5Yr: 53,
    description: 'Feature-rich compact SUV with dual 10.25-inch panoramic display unit, dual-zone climate control, and Bose audio.',
    recommendedCompetitorId: 'ev_mg_zs'
  },
  {
    id: 'petrol_kia_sonet',
    name: 'Kia Sonet 1.2L Petrol',
    brand: 'Kia',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 10720, // ~₹8.9 Lakhs
    consumption: { kmPerLiter: 18.4, mpg: 43 },
    annualMaintenanceUSD: 180,
    resaleValuePercentage5Yr: 56,
    description: 'Compact urban SUV featuring LED crown jewel headlamps, ventilated front seats, and 360-degree camera.',
    recommendedCompetitorId: 'ev_tata_punch'
  },
  {
    id: 'petrol_toyota_hyryder',
    name: 'Toyota Urban Cruiser Hyryder 1.5L',
    brand: 'Toyota',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 15900, // ~₹13.2 Lakhs
    consumption: { kmPerLiter: 21.1, mpg: 50 },
    annualMaintenanceUSD: 200,
    resaleValuePercentage5Yr: 60,
    description: 'Toyota efficiency benchmark with NeoDrive hybrid engine, All-Grip AWD option, and low cost of ownership.',
    recommendedCompetitorId: 'ev_byd_atto3'
  },
  {
    id: 'petrol_skoda_kushaq',
    name: 'Skoda Kushaq 1.0L TSI Active',
    brand: 'Skoda',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14335, // ~₹11.9 Lakhs
    consumption: { kmPerLiter: 19.7, mpg: 46 },
    annualMaintenanceUSD: 260,
    resaleValuePercentage5Yr: 48,
    description: 'German-engineered compact SUV built on MQB-A0-IN platform with 5-star GNCAP safety and punchy TSI turbo engine.',
    recommendedCompetitorId: 'ev_mg_zs'
  },
  {
    id: 'petrol_vw_taigun',
    name: 'Volkswagen Taigun 1.0L TSI Comfortline',
    brand: 'Volkswagen',
    fuelType: 'petrol',
    category: 'SUV',
    purchasePriceUSD: 14100, // ~₹11.7 Lakhs
    consumption: { kmPerLiter: 19.8, mpg: 46 },
    annualMaintenanceUSD: 250,
    resaleValuePercentage5Yr: 49,
    description: 'Solid high-speed European dynamics, 5-star GNCAP rating, digital cockpit, and electronic differential lock.',
    recommendedCompetitorId: 'ev_hyundai_creta_ev'
  },
  {
    id: 'petrol_bmw_330li',
    name: 'BMW 3 Series Gran Limousine 330Li',
    brand: 'BMW',
    fuelType: 'petrol',
    category: 'Luxury',
    purchasePriceUSD: 73000, // ~₹60.6 Lakhs
    consumption: { kmPerLiter: 13.0, mpg: 31 },
    annualMaintenanceUSD: 850,
    resaleValuePercentage5Yr: 48,
    description: 'Long-wheelbase luxury sedan providing executive rear seat comfort, 258 hp TwinPower Turbo engine, and Curved Display.',
    recommendedCompetitorId: 'ev_bmw_i4'
  },
  {
    id: 'petrol_mercedes_gla',
    name: 'Mercedes-Benz GLA 200 1.3L Turbo',
    brand: 'Mercedes-Benz',
    fuelType: 'petrol',
    category: 'Luxury',
    purchasePriceUSD: 62050, // ~₹51.5 Lakhs
    consumption: { kmPerLiter: 14.8, mpg: 35 },
    annualMaintenanceUSD: 750,
    resaleValuePercentage5Yr: 48,
    description: 'Compact luxury SUV with MBUX infotainment, ambient lighting, panoramic sunroof, and dynamic select driving modes.',
    recommendedCompetitorId: 'ev_mercedes_eqb'
  }
];

export const ALL_VEHICLES = [...EV_VEHICLES, ...PETROL_VEHICLES];
