// Enhanced realistic data for Indian renewable energy sector
export const indianStates = [
  { value: 'all', label: 'All States', count: 28 },
  { value: 'KA', label: 'Karnataka', count: 87 },
  { value: 'TN', label: 'Tamil Nadu', count: 124 },
  { value: 'MH', label: 'Maharashtra', count: 156 },
  { value: 'RJ', label: 'Rajasthan', count: 203 },
  { value: 'GJ', label: 'Gujarat', count: 178 },
  { value: 'AP', label: 'Andhra Pradesh', count: 98 },
  { value: 'MP', label: 'Madhya Pradesh', count: 76 },
  { value: 'UP', label: 'Uttar Pradesh', count: 134 },
  { value: 'HP', label: 'Himachal Pradesh', count: 45 },
  { value: 'PB', label: 'Punjab', count: 67 }
];

export const majorCities = {
  all: [{ value: 'all', label: 'All Cities', count: 0 }],
  KA: [
    { value: 'BLR', label: 'Bengaluru', count: 34 },
    { value: 'MYS', label: 'Mysuru', count: 18 },
    { value: 'HUB', label: 'Hubballi', count: 12 },
    { value: 'MGR', label: 'Mangaluru', count: 15 },
    { value: 'BLG', label: 'Belagavi', count: 8 }
  ],
  TN: [
    { value: 'CHE', label: 'Chennai', count: 45 },
    { value: 'COI', label: 'Coimbatore', count: 28 },
    { value: 'MDU', label: 'Madurai', count: 22 },
    { value: 'TIR', label: 'Tiruchirapalli', count: 16 },
    { value: 'SLM', label: 'Salem', count: 13 }
  ],
  MH: [
    { value: 'MUM', label: 'Mumbai', count: 52 },
    { value: 'PUN', label: 'Pune', count: 38 },
    { value: 'NAG', label: 'Nagpur', count: 25 },
    { value: 'NAS', label: 'Nashik', count: 21 },
    { value: 'AUR', label: 'Aurangabad', count: 20 }
  ],
  RJ: [
    { value: 'JAI', label: 'Jaipur', count: 78 },
    { value: 'JOD', label: 'Jodhpur', count: 45 },
    { value: 'UDA', label: 'Udaipur', count: 32 },
    { value: 'BIK', label: 'Bikaner', count: 28 },
    { value: 'KOT', label: 'Kota', count: 20 }
  ],
  GJ: [
    { value: 'AHM', label: 'Ahmedabad', count: 65 },
    { value: 'SUR', label: 'Surat', count: 42 },
    { value: 'VAD', label: 'Vadodara', count: 35 },
    { value: 'RAJ', label: 'Rajkot', count: 23 },
    { value: 'GAN', label: 'Gandhinagar', count: 13 }
  ]
};

export const realisticKPIDetails = {
  onlineAssets: {
    description: 'Percentage of renewable energy assets currently operational and connected to the grid monitoring system.',
    historicalData: [
      { period: 'Q1 2024', value: 89.2 },
      { period: 'Q2 2024', value: 91.5 },
      { period: 'Q3 2024', value: 93.8 },
      { period: 'Q4 2024', value: 94.7 }
    ],
    comparison: { national: 89.3, target: 96.0, best: 98.2 },
    insights: [
      'Steady improvement in asset connectivity over the past year',
      'Karnataka and Gujarat leading in asset availability',
      'Network infrastructure upgrades contributing to better connectivity',
      'Monsoon season typically sees 2-3% dip in availability'
    ]
  },
  totalCapacity: {
    description: 'Cumulative installed capacity of all renewable energy systems monitored through the MNRE National RTS platform.',
    historicalData: [
      { period: 'March 2024', value: 87650 },
      { period: 'June 2024', value: 92340 },
      { period: 'September 2024', value: 98720 },
      { period: 'December 2024', value: 105680 }
    ],
    comparison: { national: 95000, target: 120000, best: 150000 },
    insights: [
      'Consistent capacity addition of 15-20% quarter-over-quarter',
      'Rooftop solar contributing 45% of new installations',
      'Industrial solar parks driving bulk capacity additions',
      'Grid integration challenges limiting some deployments'
    ]
  },
  generation: {
    description: 'Total energy generated today across all monitored renewable energy installations in the network.',
    historicalData: [
      { period: 'Yesterday', value: 245780 },
      { period: '7 days ago', value: 238920 },
      { period: '30 days ago', value: 221340 },
      { period: '90 days ago', value: 198650 }
    ],
    comparison: { national: 235000, target: 280000, best: 320000 },
    insights: [
      'Peak generation typically occurs between 11 AM and 2 PM',
      'Weather conditions affecting 15% variance in daily output',
      'Battery storage systems improving grid stability',
      'Feed-in tariff optimization increasing revenue by 12%'
    ]
  },
  criticalIssues: {
    description: 'Number of high-priority alerts and critical system issues requiring immediate attention across the network.',
    historicalData: [
      { period: 'This Week', value: 23 },
      { period: 'Last Week', value: 31 },
      { period: 'Last Month', value: 127 },
      { period: '3 Months Ago', value: 156 }
    ],
    comparison: { national: 45, target: 15, best: 8 },
    insights: [
      'Predictive maintenance reducing critical failures by 35%',
      'Cyber security incidents increasing, requiring enhanced protocols',
      'Temperature-related issues peak during summer months',
      'Remote monitoring reducing response time by 60%'
    ]
  },
  performanceRatio: {
    description: 'Average performance ratio across all installations, indicating system efficiency relative to theoretical maximum output.',
    historicalData: [
      { period: 'Q1 2024', value: 78.5 },
      { period: 'Q2 2024', value: 82.1 },
      { period: 'Q3 2024', value: 79.8 },
      { period: 'Q4 2024', value: 81.3 }
    ],
    comparison: { national: 76.8, target: 85.0, best: 89.7 },
    insights: [
      'Seasonal variation of 5-8% between summer and winter months',
      'Regular cleaning and maintenance improving PR by 12%',
      'Advanced inverter technology boosting efficiency',
      'Dust accumulation remains primary performance inhibitor'
    ]
  }
};

export const detailedAssetData = [
  {
    id: 'SOL-KA-BLR-001',
    site_id: 'MNRE-SOL-KA-BLR-001',
    type: 'Solar PV System',
    location: 'Electronic City, Bengaluru, Karnataka',
    capacity: '5.2 MW',
    status: 'online',
    performance: 87.3,
    lastMaintenance: '2024-12-15',
    nextMaintenance: '2025-03-15',
    owner: 'Tata Power Solar Systems Ltd.',
    commissioned: '2023-08-20',
    details: {
      moduleType: 'Monocrystalline Silicon',
      inverterBrand: 'ABB String Inverters',
      mountingSystem: 'Ground Mounted Fixed Tilt',
      tiltAngle: '15°',
      azimuthAngle: '180° (Due South)',
      expectedLife: '25 years',
      warrantyStatus: 'Active - 22 years remaining',
      gridConnection: '11 kV Feeder Line',
      meteringType: 'Bi-directional Smart Meter'
    },
    financials: {
      capex: '₹2.8 Crores',
      opex: '₹15.2 Lakhs/year',
      tariff: '₹2.85/kWh',
      subsidyReceived: '₹84 Lakhs (30%)',
      roiPeriod: '6.2 years',
      currentROI: '12.8%'
    },
    performance: {
      todayGeneration: '28,450 kWh',
      monthlyGeneration: '845,200 kWh',
      yearlyGeneration: '9,234,500 kWh',
      cuf: '21.2%',
      pr: '87.3%',
      availability: '98.7%'
    }
  },
  {
    id: 'WIND-RJ-JAI-002',
    site_id: 'MNRE-WIND-RJ-JAI-002',
    type: 'Wind Power System',
    location: 'Jaisalmer Wind Park, Rajasthan',
    capacity: '15.8 MW',
    status: 'online',
    performance: 91.2,
    lastMaintenance: '2024-11-28',
    nextMaintenance: '2025-05-28',
    owner: 'Suzlon Energy Ltd.',
    commissioned: '2022-11-10',
    details: {
      turbineModel: 'S144-3.15MW',
      hubHeight: '140 meters',
      rotorDiameter: '144 meters',
      cutInSpeed: '3 m/s',
      ratedSpeed: '12 m/s',
      cutOutSpeed: '25 m/s',
      turbineCount: '5 Units',
      gridConnection: '33 kV Transmission Line'
    },
    financials: {
      capex: '₹12.5 Crores',
      opex: '₹68.5 Lakhs/year',
      tariff: '₹3.12/kWh',
      subsidyReceived: '₹1.25 Crores (10%)',
      roiPeriod: '5.8 years',
      currentROI: '15.3%'
    },
    performance: {
      todayGeneration: '156,780 kWh',
      monthlyGeneration: '4,234,600 kWh',
      yearlyGeneration: '48,567,800 kWh',
      cuf: '35.1%',
      pr: '91.2%',
      availability: '96.4%'
    }
  }
];

export const stateWisePerformance = {
  KA: {
    totalCapacity: '12,458 MW',
    totalSites: 2847,
    avgPerformance: 84.7,
    totalGeneration: '28,945 GWh',
    carbonOffset: '23,156 tons CO2',
    topPerformer: 'Bengaluru Solar Park - 94.2% PR'
  },
  TN: {
    totalCapacity: '15,672 MW', 
    totalSites: 3124,
    avgPerformance: 81.9,
    totalGeneration: '35,234 GWh',
    carbonOffset: '28,187 tons CO2',
    topPerformer: 'Coimbatore Wind Farm - 92.8% PR'
  },
  MH: {
    totalCapacity: '18,234 MW',
    totalSites: 3867,
    avgPerformance: 79.3,
    totalGeneration: '41,789 GWh',
    carbonOffset: '33,431 tons CO2',
    topPerformer: 'Pune Industrial Solar - 89.7% PR'
  },
  RJ: {
    totalCapacity: '22,891 MW',
    totalSites: 4123,
    avgPerformance: 88.1,
    totalGeneration: '56,234 GWh',
    carbonOffset: '44,987 tons CO2',
    topPerformer: 'Bhadla Solar Park - 95.3% PR'
  },
  GJ: {
    totalCapacity: '16,543 MW',
    totalSites: 3456,
    avgPerformance: 86.4,
    totalGeneration: '38,967 GWh',
    carbonOffset: '31,174 tons CO2',
    topPerformer: 'Charanka Solar Park - 93.1% PR'
  }
};