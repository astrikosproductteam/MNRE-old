import { 
  Asset, WorkOrder, Alert, TelemetryData, AdminBoundary, KPIData, 
  RiskAssessment, Recommendation, ForecastData, NetworkTopology,
  GovernanceMetric, PolicyImpactAnalysis, AnalyticsEvidence
} from '../types';

// Enhanced mock data with Indian geography and advanced features
export const mockAssets: Asset[] = [
  {
    id: 'INV001',
    site_id: 'IN-KA-BLR-001',
    type: 'inverter',
    status: 'online',
    oem: 'Tata Power Solar',
    kW: 5.0,
    lat: 12.9716,
    lon: 77.5946,
    elev_m: 920,
    install_dt: '2023-06-15',
    temp_c: 45.2,
    power_kw: 4.2,
    last_comm_ts: '2025-01-27T10:30:00Z',
    risk_score: 0.15,
    efficiency_rating: 'A',
    warranty_expiry: '2028-06-15',
    maintenance_due: '2025-03-15'
  },
  {
    id: 'INV002',
    site_id: 'IN-KA-MYS-002',
    type: 'inverter',
    status: 'degraded',
    oem: 'Adani Solar',
    kW: 3.5,
    lat: 12.2958,
    lon: 76.6394,
    elev_m: 763,
    install_dt: '2023-08-20',
    temp_c: 68.1,
    power_kw: 2.1,
    last_comm_ts: '2025-01-27T10:29:45Z',
    risk_score: 0.65,
    efficiency_rating: 'C',
    warranty_expiry: '2028-08-20',
    maintenance_due: '2025-02-01'
  },
  {
    id: 'BAT001',
    site_id: 'IN-KA-BLR-001',
    type: 'battery',
    status: 'online',
    oem: 'Exide Technologies',
    kW: 10.0,
    lat: 12.9716,
    lon: 77.5946,
    elev_m: 920,
    install_dt: '2023-06-15',
    soc_pct: 78,
    power_kw: -2.5,
    last_comm_ts: '2025-01-27T10:30:00Z',
    risk_score: 0.25,
    efficiency_rating: 'A+',
    warranty_expiry: '2030-06-15'
  },
  {
    id: 'INV003',
    site_id: 'IN-TN-CHE-001',
    type: 'inverter',
    status: 'offline',
    oem: 'Waaree Energies',
    kW: 7.5,
    lat: 13.0827,
    lon: 80.2707,
    elev_m: 6,
    install_dt: '2023-04-10',
    temp_c: 0,
    power_kw: 0,
    last_comm_ts: '2025-01-27T08:15:22Z',
    risk_score: 0.85,
    efficiency_rating: 'D',
    warranty_expiry: '2028-04-10',
    maintenance_due: '2025-01-28'
  },
  {
    id: 'INV004',
    site_id: 'IN-MH-MUM-001',
    type: 'inverter',
    status: 'tamper',
    oem: 'Vikram Solar',
    kW: 4.0,
    lat: 19.0760,
    lon: 72.8777,
    elev_m: 14,
    install_dt: '2023-09-05',
    temp_c: 42.3,
    power_kw: 0,
    last_comm_ts: '2025-01-27T10:25:10Z',
    risk_score: 0.95,
    efficiency_rating: 'D',
    warranty_expiry: '2028-09-05'
  },
  {
    id: 'INV005',
    site_id: 'IN-RJ-JAI-001',
    type: 'inverter',
    status: 'online',
    oem: 'ReNew Power',
    kW: 6.0,
    lat: 26.9124,
    lon: 75.7873,
    elev_m: 431,
    install_dt: '2023-03-20',
    temp_c: 52.1,
    power_kw: 5.8,
    last_comm_ts: '2025-01-27T10:30:00Z',
    risk_score: 0.20,
    efficiency_rating: 'A',
    warranty_expiry: '2028-03-20'
  },
  {
    id: 'INV006',
    site_id: 'IN-GJ-AHM-001',
    type: 'inverter',
    status: 'online',
    oem: 'Suzlon Energy',
    kW: 8.0,
    lat: 23.0225,
    lon: 72.5714,
    elev_m: 53,
    install_dt: '2023-01-15',
    temp_c: 48.5,
    power_kw: 7.2,
    last_comm_ts: '2025-01-27T10:30:00Z',
    risk_score: 0.18,
    efficiency_rating: 'A+',
    warranty_expiry: '2028-01-15'
  }
];

export const mockWorkOrders: WorkOrder[] = [
  {
    wo_id: 'WO-2025-001',
    site_id: 'IN-KA-MYS-002',
    issue: 'Inverter overtemperature - requires cleaning and inspection',
    priority: 'high',
    status: 'open',
    sla_hours: 24,
    created_at: '2025-01-27T09:15:00Z',
    assignee: 'Karnataka EPC Team Alpha',
    eta: '2025-01-27T14:00:00Z',
    lat: 12.2958,
    lon: 76.6394,
    estimated_cost: 15000,
    resolution_time: 18
  },
  {
    wo_id: 'WO-2025-002',
    site_id: 'IN-TN-CHE-001',
    issue: 'Communication failure - gateway offline',
    priority: 'critical',
    status: 'in_progress',
    sla_hours: 12,
    created_at: '2025-01-27T08:30:00Z',
    assignee: 'Tamil Nadu Network Team Beta',
    lat: 13.0827,
    lon: 80.2707,
    estimated_cost: 25000,
    resolution_time: 8
  },
  {
    wo_id: 'WO-2025-003',
    site_id: 'IN-MH-MUM-001',
    issue: 'Suspected tampering - security investigation required',
    priority: 'critical',
    status: 'acknowledged',
    sla_hours: 6,
    created_at: '2025-01-27T10:20:00Z',
    assignee: 'Maharashtra Security Team Gamma',
    lat: 19.0760,
    lon: 72.8777,
    estimated_cost: 50000
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALT001',
    site_id: 'IN-KA-MYS-002',
    type: 'over_temp',
    severity: 'high',
    message: 'Inverter temperature exceeded 65°C threshold - potential fire risk',
    timestamp: '2025-01-27T09:15:00Z',
    lat: 12.2958,
    lon: 76.6394,
    acknowledged: false,
    risk_impact: 'operational',
    predicted_cascade: ['neighboring_sites', 'grid_instability']
  },
  {
    id: 'ALT002',
    site_id: 'IN-MH-MUM-001',
    type: 'tamper',
    severity: 'critical',
    message: 'Unauthorized access detected - potential theft or sabotage',
    timestamp: '2025-01-27T10:20:00Z',
    lat: 19.0760,
    lon: 72.8777,
    acknowledged: false,
    risk_impact: 'financial',
    predicted_cascade: ['revenue_loss', 'insurance_claim']
  },
  {
    id: 'ALT003',
    site_id: 'IN-TN-CHE-001',
    type: 'fault',
    severity: 'critical',
    message: 'Complete communication blackout - cyber attack suspected',
    timestamp: '2025-01-27T08:30:00Z',
    lat: 13.0827,
    lon: 80.2707,
    acknowledged: true,
    risk_impact: 'network',
    predicted_cascade: ['data_breach', 'system_compromise']
  },
  {
    id: 'ALT004',
    site_id: 'IN-GJ-AHM-001',
    type: 'grid_instability',
    severity: 'medium',
    message: 'Grid frequency deviation detected - load balancing required',
    timestamp: '2025-01-27T10:25:00Z',
    lat: 23.0225,
    lon: 72.5714,
    acknowledged: false,
    risk_impact: 'operational'
  }
];

export const mockKPIData: KPIData[] = [
  {
    site_id: 'IN-KA-BLR-001',
    pr: 0.85,
    availability_pct: 98.5,
    yield_kwh: 1250.5,
    losses_tech_pct: 2.1,
    losses_commercial_pct: 0.3,
    co2_avoided_tons: 0.95,
    lat: 12.9716,
    lon: 77.5946,
    revenue_generated: 125000,
    subsidy_utilized: 45000,
    grid_stability_score: 0.92
  },
  {
    site_id: 'IN-KA-MYS-002',
    pr: 0.72,
    availability_pct: 89.2,
    yield_kwh: 890.3,
    losses_tech_pct: 8.5,
    losses_commercial_pct: 1.2,
    co2_avoided_tons: 0.68,
    lat: 12.2958,
    lon: 76.6394,
    revenue_generated: 89000,
    subsidy_utilized: 35000,
    grid_stability_score: 0.78
  },
  {
    site_id: 'IN-TN-CHE-001',
    pr: 0.45,
    availability_pct: 12.1,
    yield_kwh: 125.8,
    losses_tech_pct: 45.2,
    losses_commercial_pct: 5.8,
    co2_avoided_tons: 0.09,
    lat: 13.0827,
    lon: 80.2707,
    revenue_generated: 12500,
    subsidy_utilized: 75000,
    grid_stability_score: 0.35
  },
  {
    site_id: 'IN-MH-MUM-001',
    pr: 0.0,
    availability_pct: 0.0,
    yield_kwh: 0.0,
    losses_tech_pct: 100.0,
    losses_commercial_pct: 15.2,
    co2_avoided_tons: 0.0,
    lat: 19.0760,
    lon: 72.8777,
    revenue_generated: 0,
    subsidy_utilized: 40000,
    grid_stability_score: 0.0
  },
  {
    site_id: 'IN-RJ-JAI-001',
    pr: 0.88,
    availability_pct: 96.8,
    yield_kwh: 1580.2,
    losses_tech_pct: 1.8,
    losses_commercial_pct: 0.2,
    co2_avoided_tons: 1.2,
    lat: 26.9124,
    lon: 75.7873,
    revenue_generated: 158000,
    subsidy_utilized: 60000,
    grid_stability_score: 0.94
  },
  {
    site_id: 'IN-GJ-AHM-001',
    pr: 0.91,
    availability_pct: 99.2,
    yield_kwh: 2104.8,
    losses_tech_pct: 1.2,
    losses_commercial_pct: 0.1,
    co2_avoided_tons: 1.6,
    lat: 23.0225,
    lon: 72.5714,
    revenue_generated: 210000,
    subsidy_utilized: 80000,
    grid_stability_score: 0.96
  }
];

export const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'RISK001',
    site_id: 'IN-KA-MYS-002',
    risk_type: 'technical',
    risk_level: 'high',
    probability: 0.75,
    impact_score: 85,
    risk_score: 63.75,
    description: 'Inverter overheating pattern indicates imminent failure risk',
    mitigation_strategies: [
      'Immediate cleaning and maintenance',
      'Install additional cooling systems',
      'Upgrade to higher temperature rated components'
    ],
    timeline: '7 days',
    responsible_party: 'Karnataka EPC Team',
    created_at: '2025-01-27T09:00:00Z',
    last_updated: '2025-01-27T10:30:00Z'
  },
  {
    id: 'RISK002',
    site_id: 'IN-MH-MUM-001',
    risk_type: 'cyber',
    risk_level: 'critical',
    probability: 0.85,
    impact_score: 95,
    risk_score: 80.75,
    description: 'Suspected coordinated cyber attack on communication infrastructure',
    mitigation_strategies: [
      'Immediate network isolation',
      'Forensic analysis of compromised systems',
      'Implementation of enhanced cybersecurity protocols'
    ],
    timeline: '24 hours',
    responsible_party: 'National Cyber Security Team',
    created_at: '2025-01-27T10:20:00Z',
    last_updated: '2025-01-27T10:30:00Z'
  },
  {
    id: 'RISK003',
    site_id: 'IN-TN-CHE-001',
    risk_type: 'financial',
    risk_level: 'high',
    probability: 0.70,
    impact_score: 78,
    risk_score: 54.6,
    description: 'Extended downtime leading to significant revenue loss and subsidy implications',
    mitigation_strategies: [
      'Emergency repair deployment',
      'Insurance claim processing',
      'Temporary power arrangement'
    ],
    timeline: '48 hours',
    responsible_party: 'Tamil Nadu State Operator',
    created_at: '2025-01-27T08:30:00Z',
    last_updated: '2025-01-27T10:30:00Z'
  }
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'REC001',
    type: 'maintenance',
    priority: 'critical',
    title: 'Implement Predictive Maintenance for High-Risk Inverters',
    description: 'Deploy AI-powered predictive maintenance system to prevent inverter failures',
    rationale: 'Analysis shows 65% of inverter failures could be prevented with early intervention',
    expected_impact: {
      financial: 2500000,
      operational: '40% reduction in unplanned downtime',
      timeline: '6 months'
    },
    target_stakeholders: ['MNRE_Admin', 'State_Operator', 'EPC_AMC'],
    implementation_steps: [
      'Install IoT sensors on high-risk inverters',
      'Deploy ML models for failure prediction',
      'Train maintenance teams on new protocols',
      'Establish automated alert systems'
    ],
    success_metrics: [
      'Reduction in inverter failure rate by 40%',
      'Decrease in maintenance costs by 25%',
      'Improvement in overall system availability'
    ],
    created_at: '2025-01-27T10:00:00Z',
    status: 'pending',
    evidence: [
      {
        type: 'trend',
        data_source: 'Historical failure data',
        time_period: 'Last 12 months',
        confidence_level: 0.92,
        description: 'Inverter failure rate trending upward with clear seasonal patterns',
        visualization_data: {}
      }
    ]
  },
  {
    id: 'REC002',
    type: 'policy',
    priority: 'high',
    title: 'Enhance Cybersecurity Framework for RTS Infrastructure',
    description: 'Implement comprehensive cybersecurity measures across all RTS installations',
    rationale: 'Recent cyber threats indicate vulnerability in current security posture',
    expected_impact: {
      financial: 5000000,
      operational: 'Elimination of cyber-related downtime',
      timeline: '3 months'
    },
    target_stakeholders: ['MNRE_Admin', 'Policy_Maker', 'DISCOM_Operator'],
    implementation_steps: [
      'Conduct comprehensive security audit',
      'Deploy advanced threat detection systems',
      'Implement zero-trust network architecture',
      'Establish 24/7 security operations center'
    ],
    success_metrics: [
      'Zero successful cyber attacks',
      '100% compliance with security standards',
      'Reduced security incident response time'
    ],
    created_at: '2025-01-27T10:15:00Z',
    status: 'approved',
    evidence: [
      {
        type: 'anomaly',
        data_source: 'Network traffic analysis',
        time_period: 'Last 30 days',
        confidence_level: 0.88,
        description: 'Unusual network patterns indicating potential security threats',
        visualization_data: {}
      }
    ]
  }
];

export const mockForecastData: ForecastData[] = [
  {
    timestamp: '2025-01-28T00:00:00Z',
    metric: 'total_generation',
    predicted_value: 15420.5,
    confidence_interval: { lower: 14200.3, upper: 16640.7 },
    factors: ['weather_forecast', 'seasonal_patterns', 'maintenance_schedule'],
    accuracy_score: 0.89
  },
  {
    timestamp: '2025-01-29T00:00:00Z',
    metric: 'total_generation',
    predicted_value: 16890.2,
    confidence_interval: { lower: 15670.1, upper: 18110.3 },
    factors: ['weather_forecast', 'seasonal_patterns', 'maintenance_schedule'],
    accuracy_score: 0.87
  },
  {
    timestamp: '2025-01-30T00:00:00Z',
    metric: 'total_generation',
    predicted_value: 14230.8,
    confidence_interval: { lower: 13010.5, upper: 15451.1 },
    factors: ['weather_forecast', 'seasonal_patterns', 'maintenance_schedule'],
    accuracy_score: 0.91
  }
];

export const mockNetworkTopology: NetworkTopology = {
  nodes: [
    {
      id: 'SUB001',
      type: 'substation',
      name: 'Bangalore Central Substation',
      lat: 12.9716,
      lon: 77.5946,
      capacity_kw: 50000,
      current_load: 42000,
      status: 'normal',
      risk_score: 0.25
    },
    {
      id: 'FEED001',
      type: 'feeder',
      name: 'Electronic City Feeder',
      lat: 12.8456,
      lon: 77.6603,
      capacity_kw: 10000,
      current_load: 8500,
      status: 'normal',
      risk_score: 0.30
    }
  ],
  edges: [
    {
      id: 'EDGE001',
      source: 'SUB001',
      target: 'FEED001',
      type: 'transmission',
      capacity: 15000,
      current_flow: 8500,
      impedance: 0.05,
      status: 'normal'
    }
  ],
  clusters: [
    {
      id: 'CLUSTER001',
      name: 'Karnataka South Cluster',
      nodes: ['SUB001', 'FEED001'],
      total_capacity: 60000,
      utilization: 0.84,
      stability_score: 0.92,
      risk_level: 'low'
    }
  ]
};

export const mockGovernanceMetrics: GovernanceMetric[] = [
  {
    id: 'GOV001',
    name: 'Renewable Energy Target Achievement',
    category: 'performance',
    value: 78.5,
    target: 85.0,
    unit: '%',
    trend: 'improving',
    last_updated: '2025-01-27T10:30:00Z',
    benchmark_comparison: {
      national_avg: 72.3,
      best_practice: 92.1,
      peer_states: 75.8
    }
  },
  {
    id: 'GOV002',
    name: 'Subsidy Utilization Efficiency',
    category: 'financial',
    value: 89.2,
    target: 95.0,
    unit: '%',
    trend: 'stable',
    last_updated: '2025-01-27T10:30:00Z',
    benchmark_comparison: {
      national_avg: 82.1,
      best_practice: 97.5,
      peer_states: 86.4
    }
  },
  {
    id: 'GOV003',
    name: 'Carbon Emission Reduction',
    category: 'environmental',
    value: 2.4,
    target: 3.0,
    unit: 'Million Tons CO2',
    trend: 'improving',
    last_updated: '2025-01-27T10:30:00Z',
    benchmark_comparison: {
      national_avg: 2.1,
      best_practice: 3.8,
      peer_states: 2.2
    }
  }
];

// Generate real-time telemetry data
export const generateMockTelemetry = (): TelemetryData[] => {
  const now = new Date();
  return mockAssets
    .filter(asset => asset.status === 'online' || asset.status === 'degraded')
    .map(asset => ({
    ts: now.toISOString(),
    device_id: asset.id,
    site_id: asset.site_id,
    p_kw: asset.power_kw || 0,
    temp_c: asset.temp_c || 25,
    soc_pct: asset.soc_pct || 0,
    voltage: 230 + Math.random() * 20 - 10,
    current: (asset.power_kw || 0) / 230,
    lat: asset.lat,
    lon: asset.lon,
    grid_frequency: 50 + Math.random() * 0.5 - 0.25,
    power_factor: 0.85 + Math.random() * 0.1,
    harmonics_thd: Math.random() * 5
  }));
};

// Indian state boundaries (simplified for demo)
export const mockStateBoundaries: AdminBoundary[] = [
  {
    id: 'KA',
    name: 'Karnataka',
    type: 'state',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [74.0, 11.5], [78.5, 11.5], [78.5, 18.5], [74.0, 18.5], [74.0, 11.5]
      ]]
    },
    properties: { code: 'KA', population: 61095297, capital: 'Bengaluru' }
  },
  {
    id: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [76.0, 8.0], [80.5, 8.0], [80.5, 13.5], [76.0, 13.5], [76.0, 8.0]
      ]]
    },
    properties: { code: 'TN', population: 72147030, capital: 'Chennai' }
  },
  {
    id: 'MH',
    name: 'Maharashtra',
    type: 'state',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [72.5, 15.5], [80.5, 15.5], [80.5, 22.0], [72.5, 22.0], [72.5, 15.5]
      ]]
    },
    properties: { code: 'MH', population: 112374333, capital: 'Mumbai' }
  },
  {
    id: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [69.5, 23.0], [78.5, 23.0], [78.5, 30.5], [69.5, 30.5], [69.5, 23.0]
      ]]
    },
    properties: { code: 'RJ', population: 68548437, capital: 'Jaipur' }
  },
  {
    id: 'GJ',
    name: 'Gujarat',
    type: 'state',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68.0, 20.0], [74.5, 20.0], [74.5, 24.5], [68.0, 24.5], [68.0, 20.0]
      ]]
    },
    properties: { code: 'GJ', population: 60439692, capital: 'Gandhinagar' }
  }
];

export const mockPolicyImpactAnalysis: PolicyImpactAnalysis[] = [
  {
    policy_name: 'National Solar Mission Phase III',
    policy_id: 'POLICY001',
    implementation_date: '2024-04-01',
    affected_sites: ['IN-KA-BLR-001', 'IN-TN-CHE-001', 'IN-MH-MUM-001'],
    impact_metrics: {
      before: { capacity_mw: 5000, generation_gwh: 8500 },
      after: { capacity_mw: 20000, generation_gwh: 34000 },
      projected: { capacity_mw: 35000, generation_gwh: 59500 }
    },
    effectiveness_score: 0.78,
    recommendations: [
      'Accelerate deployment in high-potential states',
      'Strengthen grid integration capabilities',
      'Enhance monitoring and maintenance protocols'
    ]
  }
];

// Export all mock data for easy access
export const mockData = {
  assets: mockAssets,
  workOrders: mockWorkOrders,
  alerts: mockAlerts,
  kpiData: mockKPIData,
  riskAssessments: mockRiskAssessments,
  recommendations: mockRecommendations,
  forecastData: mockForecastData,
  networkTopology: mockNetworkTopology,
  governanceMetrics: mockGovernanceMetrics,
  stateBoundaries: mockStateBoundaries,
  policyImpactAnalysis: mockPolicyImpactAnalysis
};