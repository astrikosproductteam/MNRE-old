// Enhanced types for MNRE RTS platform with advanced features
export interface Asset {
  id: string;
  site_id: string;
  type: 'inverter' | 'battery' | 'meter' | 'sensor' | 'gateway';
  status: 'online' | 'degraded' | 'offline' | 'maintenance' | 'tamper';
  oem: string;
  kW: number;
  lat: number;
  lon: number;
  elev_m?: number;
  install_dt: string;
  temp_c?: number;
  soc_pct?: number;
  power_kw?: number;
  last_comm_ts: string;
  risk_score?: number;
  efficiency_rating?: 'A+' | 'A' | 'B' | 'C' | 'D';
  warranty_expiry?: string;
  maintenance_due?: string;
}

export interface RooftopArray {
  site_id: string;
  building_id: string;
  geometry: GeoJSON.Polygon;
  tilt_deg: number;
  azimuth_deg: number;
  area_m2: number;
  capacity_kw: number;
}

export interface WorkOrder {
  wo_id: string;
  site_id: string;
  issue: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'acknowledged' | 'in_progress' | 'resolved' | 'sla_breached';
  sla_hours: number;
  created_at: string;
  assignee?: string;
  eta?: string;
  lat: number;
  lon: number;
  estimated_cost?: number;
  actual_cost?: number;
  resolution_time?: number;
}

export interface Alert {
  id: string;
  site_id: string;
  type: 'fault' | 'alarm' | 'tamper' | 'reverse_flow' | 'over_temp' | 'cyber_threat' | 'grid_instability';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  lat: number;
  lon: number;
  acknowledged: boolean;
  risk_impact?: 'network' | 'financial' | 'operational' | 'regulatory';
  predicted_cascade?: string[];
}

export interface TelemetryData {
  ts: string;
  device_id: string;
  site_id: string;
  p_kw: number;
  temp_c: number;
  soc_pct?: number;
  voltage: number;
  current: number;
  lat: number;
  lon: number;
  grid_frequency?: number;
  power_factor?: number;
  harmonics_thd?: number;
}

export interface AdminBoundary {
  id: string;
  name: string;
  type: 'state' | 'district' | 'taluk' | 'ward' | 'discom_zone';
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  properties: Record<string, any>;
}

export interface KPIData {
  site_id: string;
  pr: number; // Performance Ratio
  availability_pct: number;
  yield_kwh: number;
  losses_tech_pct: number;
  losses_commercial_pct: number;
  co2_avoided_tons: number;
  lat: number;
  lon: number;
  revenue_generated?: number;
  subsidy_utilized?: number;
  grid_stability_score?: number;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface LayerConfig {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  type: 'assets' | 'boundaries' | 'heatmap' | 'choropleth' | 'workorders' | 'alerts' | 'risk_zones' | 'weather';
}

export interface RiskAssessment {
  id: string;
  site_id: string;
  risk_type: 'technical' | 'financial' | 'operational' | 'regulatory' | 'cyber' | 'environmental';
  risk_level: 'very_low' | 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  impact_score: number; // 0-100
  risk_score: number; // probability * impact
  description: string;
  mitigation_strategies: string[];
  timeline: string;
  responsible_party: string;
  created_at: string;
  last_updated: string;
}

export interface Recommendation {
  id: string;
  type: 'maintenance' | 'optimization' | 'policy' | 'investment' | 'operational';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  expected_impact: {
    financial: number;
    operational: string;
    timeline: string;
  };
  target_stakeholders: UserRole['role'][];
  target_stakeholders: string[];
  implementation_steps: string[];
  success_metrics: string[];
  created_at: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  evidence: AnalyticsEvidence[];
}

export interface AnalyticsEvidence {
  type: 'trend' | 'correlation' | 'anomaly' | 'benchmark' | 'forecast';
  data_source: string;
  time_period: string;
  confidence_level: number;
  description: string;
  visualization_data: any;
}

export interface ForecastData {
  timestamp: string;
  metric: string;
  predicted_value: number;
  confidence_interval: {
    lower: number;
    upper: number;
  };
  factors: string[];
  accuracy_score?: number;
}

export interface NetworkTopology {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  clusters: NetworkCluster[];
}

export interface NetworkNode {
  id: string;
  type: 'substation' | 'feeder' | 'site' | 'transformer';
  name: string;
  lat: number;
  lon: number;
  capacity_kw: number;
  current_load: number;
  status: 'normal' | 'overloaded' | 'critical' | 'offline';
  risk_score: number;
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'transmission' | 'distribution' | 'connection';
  capacity: number;
  current_flow: number;
  impedance: number;
  status: 'normal' | 'congested' | 'critical';
}

export interface NetworkCluster {
  id: string;
  name: string;
  nodes: string[];
  total_capacity: number;
  utilization: number;
  stability_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export interface GovernanceMetric {
  id: string;
  name: string;
  category: 'compliance' | 'performance' | 'financial' | 'environmental' | 'social';
  value: number;
  target: number;
  unit: string;
  trend: 'improving' | 'stable' | 'declining';
  last_updated: string;
  benchmark_comparison: {
    national_avg: number;
    best_practice: number;
    peer_states: number;
  };
}

export interface PolicyImpactAnalysis {
  policy_id: string;
  policy_name: string;
  implementation_date: string;
  affected_sites: string[];
  impact_metrics: {
    before: Record<string, number>;
    after: Record<string, number>;
    projected: Record<string, number>;
  };
  effectiveness_score: number;
  recommendations: string[];
}