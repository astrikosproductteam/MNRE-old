import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Battery, AlertTriangle, CheckCircle, Wrench, Users, Lightbulb, MapPin, Calendar, Activity, X, Play, Pause, Settings, Download, RefreshCw, Eye, Tool, Cpu, Wifi, WifiOff } from 'lucide-react';
import styled, { keyframes, css } from 'styled-components';

// Enhanced styling with alien-pixel theme
const glowAnimation = keyframes`
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
`;

const borderRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const floatingParticles = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(120deg); }
  66% { transform: translateY(5px) rotate(240deg); }
`;

const StyledWrapper = styled.div`
  .alien-glow {
    box-shadow: 
      0 0 20px rgba(34, 197, 94, 0.3),
      inset 0 0 20px rgba(34, 197, 94, 0.1);
    border: 1px solid rgba(34, 197, 94, 0.2);
  }
  
  .alien-progress {
    background: linear-gradient(90deg, 
      rgba(15, 23, 42, 0.8) 0%, 
      rgba(59, 130, 246, 0.3) 50%, 
      rgba(34, 197, 94, 0.3) 100%);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%);
      animation: ${glowAnimation} 2s ease-in-out infinite;
    }
  }
  
  .floating-particle {
    animation: ${floatingParticles} 4s ease-in-out infinite;
    position: absolute;
    width: 4px;
    height: 4px;
    background: radial-gradient(circle, #22c55e, transparent);
    border-radius: 50%;
  }
  
  .interactive-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(59, 130, 246, 0.2);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.1) 50%, 
        transparent 100%);
      transition: left 0.5s;
    }
    
    &:hover::before {
      left: 100%;
    }
  }
  
  .glass-morphism {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .angular-gradient-1 {
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.1) 0%, 
      rgba(139, 92, 246, 0.1) 100%);
  }
  
  .angular-gradient-2 {
    background: linear-gradient(135deg, 
      rgba(34, 197, 94, 0.1) 0%, 
      rgba(6, 182, 212, 0.1) 100%);
  }
  
  .angular-gradient-3 {
    background: linear-gradient(135deg, 
      rgba(245, 158, 11, 0.1) 0%, 
      rgba(239, 68, 68, 0.1) 100%);
  }
  
  .glow-text {
    text-shadow: 0 0 10px currentColor;
  }
  
  .chart-glow {
    box-shadow: 
      0 0 20px rgba(59, 130, 246, 0.1),
      inset 0 0 20px rgba(59, 130, 246, 0.05);
  }
  
  .rotating-border {
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border-radius: inherit;
      background: conic-gradient(from 0deg, #3b82f6, #22c55e, #f59e0b, #ef4444, #3b82f6);
      animation: ${borderRotate} 4s linear infinite;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      inset: 2px;
      border-radius: inherit;
      background: inherit;
      z-index: -1;
    }
  }
  
  .compact-spacing {
    gap: 8px;
  }
  
  .ultra-compact {
    gap: 4px;
    margin: 4px 0;
  }
`;

// Enhanced TypeScript interfaces
interface StateData {
  installations: number;
  capacity: number;
  workingPercent: number;
  households: number;
  cities: string[];
  surplusExported: number;
  avgSystemSize: number;
  co2Avoided: number;
  revenue: number;
  maintenanceAlerts: number;
  gridStability: number;
  peakGeneration: number;
  weatherImpact: number;
  efficiency: number;
  subsidyUtilization: number;
}

interface CityData {
  name: string;
  state: string;
  installations: number;
  capacity: number;
  workingPercent: number;
  peakPower: number;
  avgSystemSize: number;
  co2Avoided: number;
  gridExport: number;
  maintenanceNeeded: number;
}

interface DetailedKPIInfo {
  description: string;
  target: string;
  progress: number;
  breakdown: Array<{ label: string; value: string; color?: string }>;
  actions: Array<{ label: string; type: 'primary' | 'secondary' | 'danger'; action: string }>;
  trends: Array<{ period: string; value: number; change: number }>;
  alerts: Array<{ type: 'warning' | 'error' | 'info'; message: string }>;
  recommendations: string[];
}

interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: DetailedKPIInfo;
  value: string | number;
  unit?: string;
  color: string;
  icon: React.ReactNode;
}

// Enhanced Panel Component
const DetailPanel: React.FC<PanelProps> = ({ isOpen, onClose, title, data, value, unit, color, icon }) => {
  if (!isOpen) return null;

  return (
    <StyledWrapper>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto interactive-card">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20`, color }}>
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white glow-text">{title}</h2>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-white">{value}</span>
                  {unit && <span className="text-lg text-slate-400">{unit}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ultra-compact">
            {/* Progress & Details */}
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Progress Details</h3>
              <p className="text-slate-300 text-sm mb-4">{data.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                  <span>Progress to Target</span>
                  <span>{data.progress.toFixed(1)}%</span>
                </div>
                <div className="alien-progress h-3">
                  <div 
                    className="h-full rounded-lg transition-all duration-1000"
                    style={{ 
                      width: `${Math.min(100, data.progress)}%`,
                      background: `linear-gradient(90deg, ${color}40, ${color})`
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-sm text-slate-500 mb-4">Target: {data.target}</div>

              {/* Breakdown */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white text-sm">Breakdown</h4>
                {data.breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3 ultra-compact">
                {data.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 rounded-lg font-medium transition-all hover:scale-105 ${
                      action.type === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                      action.type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                    onClick={() => console.log(`Executing: ${action.action}`)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trends */}
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Trends</h3>
              <div className="space-y-3">
                {data.trends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{trend.period}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{trend.value.toLocaleString()}</span>
                      <div className={`flex items-center space-x-1 ${trend.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="text-sm">{Math.abs(trend.change)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts & Recommendations */}
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Alerts & Recommendations</h3>
              
              {/* Alerts */}
              <div className="space-y-2 mb-4">
                {data.alerts.map((alert, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    alert.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {alert.message}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {data.recommendations.map((rec, index) => (
                    <li key={index} className="text-slate-300 text-sm">• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// Enhanced KPI Card with Panel Integration
interface EnhancedKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
  details: DetailedKPIInfo;
  selectedLocation?: string;
}

const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({
  title, value, unit = '', trend = 'stable', trendValue = '', icon, color, details, selectedLocation
}) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <StyledWrapper>
      <div 
        className="glass-morphism interactive-card rotating-border p-4 rounded-xl cursor-pointer"
        onClick={() => setIsDetailOpen(true)}
      >
        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="floating-particle"
            style={{
              top: `${20 + i * 30}%`,
              right: `${10 + i * 15}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg alien-glow" style={{ backgroundColor: `${color}20`, color }}>
              {icon}
            </div>
            <div>
              <h3 className="text-xs font-medium text-slate-300">{title}</h3>
              {selectedLocation && selectedLocation !== 'all' && (
                <div className="text-xs text-slate-500">({selectedLocation})</div>
              )}
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-white glow-text">{value}</span>
                {unit && <span className="text-xs text-slate-400">{unit}</span>}
              </div>
            </div>
          </div>
          {trendValue && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Mini progress bar */}
        <div className="alien-progress h-1 mb-2">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ 
              width: `${Math.min(100, details.progress)}%`,
              backgroundColor: color
            }}
          ></div>
        </div>

        <div className="text-xs text-slate-500">Click for details</div>
      </div>

      <DetailPanel
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={title}
        data={details}
        value={value}
        unit={unit}
        color={color}
        icon={icon}
      />
    </StyledWrapper>
  );
};

// Enhanced Filter Dropdown
interface FilterDropdownProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, value, onChange }) => (
  <StyledWrapper>
    <div className="relative">
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="glass-morphism border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </StyledWrapper>
);

// Enhanced state-wise data with detailed information
const enhancedStateWiseData: Record<string, StateData> = {
  "Gujarat": {
    installations: 395490, capacity: 1100.70, workingPercent: 96.8, households: 395490,
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"], surplusExported: 165.1,
    avgSystemSize: 2.8, co2Avoided: 1205.8, revenue: 498.3, maintenanceAlerts: 8950,
    gridStability: 98.2, peakGeneration: 847.5, weatherImpact: 12.3, efficiency: 84.2,
    subsidyUtilization: 89.5
  },
  "Maharashtra": {
    installations: 85000, capacity: 285.5, workingPercent: 94.2, households: 85000,
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik"], surplusExported: 42.8,
    avgSystemSize: 3.4, co2Avoided: 312.7, revenue: 128.5, maintenanceAlerts: 4250,
    gridStability: 96.8, peakGeneration: 218.7, weatherImpact: 8.7, efficiency: 82.1,
    subsidyUtilization: 87.2
  },
  "Rajasthan": {
    installations: 45000, capacity: 158.2, workingPercent: 95.5, households: 45000,
    cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner"], surplusExported: 28.5,
    avgSystemSize: 3.5, co2Avoided: 173.4, revenue: 71.3, maintenanceAlerts: 1800,
    gridStability: 97.5, peakGeneration: 131.2, weatherImpact: 5.2, efficiency: 86.8,
    subsidyUtilization: 91.3
  },
  "Tamil Nadu": {
    installations: 38000, capacity: 142.8, workingPercent: 93.8, households: 38000,
    cities: ["Chennai", "Coimbatore", "Madurai", "Salem"], surplusExported: 31.2,
    avgSystemSize: 3.8, co2Avoided: 156.6, revenue: 64.3, maintenanceAlerts: 2280,
    gridStability: 95.3, peakGeneration: 119.4, weatherImpact: 14.5, efficiency: 81.4,
    subsidyUtilization: 85.7
  },
  "Karnataka": {
    installations: 32000, capacity: 118.5, workingPercent: 94.6, households: 32000,
    cities: ["Bangalore", "Mysore", "Hubli", "Mangalore"], surplusExported: 22.4,
    avgSystemSize: 3.7, co2Avoided: 129.9, revenue: 53.4, maintenanceAlerts: 1920,
    gridStability: 96.1, peakGeneration: 97.8, weatherImpact: 11.2, efficiency: 83.6,
    subsidyUtilization: 88.4
  },
  "Uttar Pradesh": {
    installations: 28000, capacity: 95.2, workingPercent: 92.1, households: 28000,
    cities: ["Lucknow", "Kanpur", "Agra", "Varanasi"], surplusExported: 18.9,
    avgSystemSize: 3.4, co2Avoided: 104.4, revenue: 42.9, maintenanceAlerts: 2240,
    gridStability: 94.7, peakGeneration: 78.1, weatherImpact: 9.8, efficiency: 79.3,
    subsidyUtilization: 83.1
  },
  "Haryana": {
    installations: 20906, capacity: 59.92, workingPercent: 95.2, households: 20906,
    cities: ["Gurgaon", "Faridabad", "Panipat", "Ambala"], surplusExported: 11.2,
    avgSystemSize: 2.9, co2Avoided: 65.7, revenue: 27.0, maintenanceAlerts: 1045,
    gridStability: 97.8, peakGeneration: 48.3, weatherImpact: 6.7, efficiency: 85.9,
    subsidyUtilization: 90.8
  },
  "Andhra Pradesh": {
    installations: 15329, capacity: 53.39, workingPercent: 91.8, households: 15329,
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"], surplusExported: 9.8,
    avgSystemSize: 3.5, co2Avoided: 58.5, revenue: 24.1, maintenanceAlerts: 1226,
    gridStability: 93.2, peakGeneration: 43.4, weatherImpact: 13.1, efficiency: 80.7,
    subsidyUtilization: 84.9
  },
  "Kerala": {
    installations: 12500, capacity: 45.2, workingPercent: 96.1, households: 12500,
    cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"], surplusExported: 8.5,
    avgSystemSize: 3.6, co2Avoided: 49.5, revenue: 20.4, maintenanceAlerts: 488,
    gridStability: 98.5, peakGeneration: 37.8, weatherImpact: 18.2, efficiency: 87.3,
    subsidyUtilization: 92.6
  },
  "Punjab": {
    installations: 11000, capacity: 38.5, workingPercent: 93.9, households: 11000,
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"], surplusExported: 7.2,
    avgSystemSize: 3.5, co2Avoided: 42.2, revenue: 17.4, maintenanceAlerts: 737,
    gridStability: 96.4, peakGeneration: 31.2, weatherImpact: 7.9, efficiency: 84.6,
    subsidyUtilization: 89.7
  }
};

// Enhanced city data
const enhancedCityData: Record<string, CityData[]> = {
  "Gujarat": [
    { name: "Ahmedabad", state: "Gujarat", installations: 145000, capacity: 405.6, workingPercent: 97.2, peakPower: 312.3, avgSystemSize: 2.8, co2Avoided: 444.5, gridExport: 60.8, maintenanceNeeded: 2900 },
    { name: "Surat", state: "Gujarat", installations: 98000, capacity: 274.4, workingPercent: 96.8, peakPower: 211.2, avgSystemSize: 2.8, co2Avoided: 300.8, gridExport: 41.2, maintenanceNeeded: 1960 },
    { name: "Vadodara", state: "Gujarat", installations: 87000, capacity: 243.6, workingPercent: 96.1, peakPower: 187.5, avgSystemSize: 2.8, co2Avoided: 267.2, gridExport: 36.6, maintenanceNeeded: 2175 },
    { name: "Rajkot", state: "Gujarat", installations: 65490, capacity: 183.4, workingPercent: 97.0, peakPower: 141.2, avgSystemSize: 2.8, co2Avoided: 201.1, gridExport: 27.5, maintenanceNeeded: 1308 }
  ],
  "Maharashtra": [
    { name: "Mumbai", state: "Maharashtra", installations: 28000, capacity: 95.2, workingPercent: 92.8, peakPower: 73.1, avgSystemSize: 3.4, co2Avoided: 104.4, gridExport: 14.3, maintenanceNeeded: 2016 },
    { name: "Pune", state: "Maharashtra", installations: 25000, capacity: 85.0, workingPercent: 94.5, peakPower: 65.3, avgSystemSize: 3.4, co2Avoided: 93.2, gridExport: 12.8, maintenanceNeeded: 1375 },
    { name: "Nagpur", state: "Maharashtra", installations: 18000, capacity: 61.2, workingPercent: 95.8, peakPower: 47.0, avgSystemSize: 3.4, co2Avoided: 67.1, gridExport: 9.2, maintenanceNeeded: 576 },
    { name: "Nashik", state: "Maharashtra", installations: 14000, capacity: 47.6, workingPercent: 94.1, peakPower: 36.6, avgSystemSize: 3.4, co2Avoided: 52.2, gridExport: 7.1, maintenanceNeeded: 700 }
  ]
};

// Enhanced Dashboard Props
interface KPIDashboardProps {
  kpiData?: Array<{
    site_id: string;
    yield_kwh: number;
    pr: number;
    availability_pct: number;
    co2_avoided_tons: number;
  }>;
  assets?: Array<{
    id: string;
    status: 'online' | 'offline' | 'degraded' | 'maintenance' | 'tamper';
    kW: number;
  }>;
  workOrders?: Array<{
    id: string;
    status: 'open' | 'in_progress' | 'completed';
    priority: 'critical' | 'high' | 'medium' | 'low';
  }>;
}

// Main Dashboard Component
export default function KPIDashboard({ kpiData = [], assets = [], workOrders = [] }: KPIDashboardProps) {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState({
    totalInstallations: 1009000,
    workingInstallations: 0,
    nonWorkingInstallations: 0,
    todayGeneration: 0,
    cumulativeCapacity: 17020,
    livePowerGeneration: 0
  });

  // Get filtered data based on selection
  const getFilteredData = useCallback(() => {
    if (selectedState === 'all') {
      return {
        stateData: enhancedStateWiseData,
        totalInstallations: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.installations, 0),
        totalCapacity: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.capacity, 0),
        avgWorkingPercent: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.workingPercent, 0) / Object.values(enhancedStateWiseData).length,
        totalCo2Avoided: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.co2Avoided, 0),
        totalRevenue: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.revenue, 0),
        totalMaintenanceAlerts: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.maintenanceAlerts, 0),
        avgGridStability: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.gridStability, 0) / Object.values(enhancedStateWiseData).length,
        totalPeakGeneration: Object.values(enhancedStateWiseData).reduce((sum, state) => sum + state.peakGeneration, 0)
      };
    }
    
    const stateData = enhancedStateWiseData[selectedState];
    if (!stateData) return null;

    if (selectedCity === 'all') {
      return {
        stateData: { [selectedState]: stateData },
        totalInstallations: stateData.installations,
        totalCapacity: stateData.capacity,
        avgWorkingPercent: stateData.workingPercent,
        totalCo2Avoided: stateData.co2Avoided,
        totalRevenue: stateData.revenue,
        totalMaintenanceAlerts: stateData.maintenanceAlerts,
        avgGridStability: stateData.gridStability,
        totalPeakGeneration: stateData.peakGeneration
      };
    }

    // City-specific data
    const cityData = enhancedCityData[selectedState]?.find(city => 
      city.name.toLowerCase() === selectedCity.toLowerCase()
    );
    
    if (!cityData) return null;

    return {
      cityData,
      totalInstallations: cityData.installations,
      totalCapacity: cityData.capacity,
      avgWorkingPercent: cityData.workingPercent,
      totalCo2Avoided: cityData.co2Avoided,
      totalRevenue: (cityData.capacity * 4.5), // Calculated revenue
      totalMaintenanceAlerts: cityData.maintenanceNeeded,
      avgGridStability: 95.0, // Default for cities
      totalPeakGeneration: cityData.peakPower
    };
  }, [selectedState, selectedCity]);

  const filteredData = getFilteredData();

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      if (!filteredData) return;
      
      const baseWorkingPercent = filteredData.avgWorkingPercent || 94.5;
      const variation = (Math.sin(Date.now() / 60000) * 2);
      const workingPercent = baseWorkingPercent + variation;
      
      const workingInstallations = Math.floor(filteredData.totalInstallations * (workingPercent / 100));
      const nonWorkingInstallations = filteredData.totalInstallations - workingInstallations;
      
      const hour = new Date().getHours();
      const dayGenerationFactor = Math.max(0, Math.sin((hour - 6) * Math.PI / 12));
      const todayGeneration = Math.floor((filteredData.totalCapacity * 5.5) + (dayGenerationFactor * filteredData.totalCapacity * 2));
      
      const livePowerGeneration = Math.floor(dayGenerationFactor * filteredData.totalCapacity * 0.75);
      
      setRealTimeData(prev => ({
        ...prev,
        totalInstallations: filteredData.totalInstallations,
        workingInstallations,
        nonWorkingInstallations,
        todayGeneration,
        cumulativeCapacity: filteredData.totalCapacity,
        livePowerGeneration
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredData]);

  // Enhanced KPI details with location-specific data
  const getKPIDetails = (type: string): DetailedKPIInfo => {
    const locationName = selectedState !== 'all' ? 
      (selectedCity !== 'all' ? selectedCity : selectedState) : 'India';

    const baseDetails = {
      totalInstallations: {
        description: `Total rooftop solar installations in ${locationName} under PM Surya Ghar scheme`,
        target: selectedState === 'all' ? "1 Crore households by 2027" : `State-wise target based on potential`,
        progress: selectedState === 'all' ? 
          (realTimeData.totalInstallations / 10000000) * 100 :
          (filteredData?.totalInstallations || 0) / (filteredData?.totalInstallations || 1) * 85,
        breakdown: [
          { label: "Residential", value: `${Math.floor((filteredData?.totalInstallations || 0) * 0.78).toLocaleString()}` },
          { label: "Commercial", value: `${Math.floor((filteredData?.totalInstallations || 0) * 0.15).toLocaleString()}` },
          { label: "Industrial", value: `${Math.floor((filteredData?.totalInstallations || 0) * 0.07).toLocaleString()}` },
          { label: "Avg. System Size", value: `${filteredData?.cityData?.avgSystemSize || 3.2} kW` }
        ],
        actions: [
          { label: "Download Report", type: "primary" as const, action: "download_installations_report" },
          { label: "Schedule Inspection", type: "secondary" as const, action: "schedule_inspection" },
          { label: "Export Data", type: "secondary" as const, action: "export_installations_data" }
        ],
        trends: [
          { period: "This Month", value: filteredData?.totalInstallations || 0, change: 12.5 },
          { period: "Last Month", value: Math.floor((filteredData?.totalInstallations || 0) * 0.89), change: 8.2 },
          { period: "Last Quarter", value: Math.floor((filteredData?.totalInstallations || 0) * 0.75), change: 15.3 }
        ],
        alerts: [
          { type: "info" as const, message: `Installation rate: +${Math.floor(Math.random() * 500) + 200}/day` },
          { type: "warning" as const, message: "Subsidy utilization at 89.5%" }
        ],
        recommendations: [
          "Focus on rural areas for next phase expansion",
          "Increase awareness campaigns in low-penetration zones",
          "Partner with local installers for faster deployment"
        ]
      },
      workingSystems: {
        description: `Currently operational solar installations in ${locationName}`,
        target: ">95% operational efficiency",
        progress: (realTimeData.workingInstallations / realTimeData.totalInstallations) * 100,
        breakdown: [
          { label: "Online", value: realTimeData.workingInstallations.toLocaleString() },
          { label: "Peak Performance", value: `${Math.floor((realTimeData.workingInstallations * 0.87))}` },
          { label: "Good Performance", value: `${Math.floor((realTimeData.workingInstallations * 0.13))}` },
          { label: "Grid Connected", value: `${Math.floor((realTimeData.workingInstallations * 0.95))}` }
        ],
        actions: [
          { label: "Monitor Performance", type: "primary" as const, action: "monitor_performance" },
          { label: "Optimize Systems", type: "primary" as const, action: "optimize_systems" },
          { label: "Generate Report", type: "secondary" as const, action: "generate_performance_report" }
        ],
        trends: [
          { period: "Today", value: realTimeData.workingInstallations, change: 2.1 },
          { period: "Yesterday", value: Math.floor(realTimeData.workingInstallations * 0.98), change: 1.8 },
          { period: "Last Week", value: Math.floor(realTimeData.workingInstallations * 0.94), change: 3.2 }
        ],
        alerts: [
          { type: "info" as const, message: `System availability: ${((realTimeData.workingInstallations / realTimeData.totalInstallations) * 100).toFixed(1)}%` },
          { type: "warning" as const, message: `${filteredData?.totalMaintenanceAlerts || 0} systems need attention` }
        ],
        recommendations: [
          "Implement predictive maintenance schedules",
          "Upgrade older inverters for better performance",
          "Install remote monitoring on all systems"
        ]
      }
    };

    return baseDetails[type as keyof typeof baseDetails] || baseDetails.totalInstallations;
  };

  // Options for dropdowns
  const indianStates = [
    { value: 'all', label: 'All India' },
    ...Object.keys(enhancedStateWiseData).map(state => ({ value: state, label: state }))
  ];

  const majorCities = selectedState !== 'all' && enhancedStateWiseData[selectedState] 
    ? [
        { value: 'all', label: 'All Cities' }, 
        ...enhancedStateWiseData[selectedState].cities.map(city => ({ 
          value: city.toLowerCase(), 
          label: city 
        }))
      ]
    : [{ value: 'all', label: 'All Cities' }];

  if (!filteredData) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  return (
    <StyledWrapper>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 compact-spacing">
        {/* Header */}
        <div className="glass-morphism angular-gradient-1 rounded-2xl p-4 mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center compact-spacing">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2 glow-text">
                MNRE National RTS Dashboard
              </h1>
              <div className="flex items-center compact-spacing text-slate-300">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Live Monitoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">{currentTime.toLocaleString()}</span>
                </div>
                {(selectedState !== 'all' || selectedCity !== 'all') && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">
                      {selectedCity !== 'all' ? selectedCity : selectedState}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center compact-spacing">
              <FilterDropdown
                label="State"
                options={indianStates}
                value={selectedState}
                onChange={setSelectedState}
              />
              <FilterDropdown
                label="City"
                options={majorCities}
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>
          </div>
        </div>

        {/* AI Advisory Panel */}
        <div className="glass-morphism angular-gradient-2 rounded-2xl p-4 mb-4">
          <div className="flex items-center compact-spacing mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white glow-text">AI Advisory Panel - {selectedState !== 'all' ? selectedState : 'National'}</h2>
            <div className="px-2 py-1 bg-green-500/20 rounded-full text-green-400 text-xs">Live Insights</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 compact-spacing">
            {[
              {
                type: "critical",
                title: "Immediate Action Required",
                message: selectedState !== 'all' 
                  ? `${filteredData.totalMaintenanceAlerts} systems in ${selectedState} need immediate attention. Deploy maintenance teams urgently.`
                  : "2,150 systems showing performance degradation > 15%. Deploy maintenance teams to Gujarat (850), Maharashtra (420), Rajasthan (380).",
                icon: <AlertTriangle className="w-4 h-4" />,
                priority: "High"
              },
              {
                type: "optimization",
                title: "Performance Optimization",
                message: selectedState !== 'all'
                  ? `Weather conditions favorable for ${selectedState}. Expected 15-20% generation increase. Optimize grid balancing.`
                  : "Weather forecast shows 3 days of high solar irradiance. Expect 12-15% increase in generation. Prepare grid balancing.",
                icon: <TrendingUp className="w-4 h-4" />,
                priority: "Medium"
              },
              {
                type: "maintenance",
                title: "Predictive Maintenance",
                message: selectedState !== 'all'
                  ? `${Math.floor((filteredData.totalInstallations || 0) * 0.048)} inverters in ${selectedState} approaching replacement cycle.`
                  : "485 inverters approaching replacement cycle. Schedule proactive maintenance to prevent failures.",
                icon: <Wrench className="w-4 h-4" />,
                priority: "Medium"
              }
            ].map((insight, index) => (
              <div key={index} className="glass-morphism border border-slate-600/30 rounded-lg p-3">
                <div className="flex items-start compact-spacing">
                  <div className={`p-2 rounded-lg ${insight.type === 'critical' ? 'bg-red-500/20 text-red-400' : 
                    insight.type === 'optimization' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white text-sm">{insight.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${insight.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 compact-spacing mb-4">
          <EnhancedKPICard
            title="Total Installations"
            value={realTimeData.totalInstallations.toLocaleString()}
            trend="up"
            trendValue="+70K this month"
            icon={<Users className="w-5 h-5" />}
            color="#06b6d4"
            details={getKPIDetails('totalInstallations')}
            selectedLocation={selectedState !== 'all' ? (selectedCity !== 'all' ? selectedCity : selectedState) : undefined}
          />
          
          <EnhancedKPICard
            title="Working Systems"
            value={realTimeData.workingInstallations.toLocaleString()}
            unit={`${((realTimeData.workingInstallations/realTimeData.totalInstallations)*100).toFixed(1)}%`}
            trend="stable"
            trendValue="Operational efficiency"
            icon={<CheckCircle className="w-5 h-5" />}
            color="#10b981"
            details={getKPIDetails('workingSystems')}
            selectedLocation={selectedState !== 'all' ? (selectedCity !== 'all' ? selectedCity : selectedState) : undefined}
          />
          
          <EnhancedKPICard
            title="Non-Working"
            value={realTimeData.nonWorkingInstallations.toLocaleString()}
            trend="down"
            trendValue="-5% this week"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="#ef4444"
            details={{
              description: `Systems requiring maintenance or repair in ${selectedState !== 'all' ? selectedState : 'India'}`,
              target: "<5% downtime across network",
              progress: 100 - ((realTimeData.nonWorkingInstallations/realTimeData.totalInstallations)*100),
              breakdown: [
                { label: "Maintenance", value: "45%" },
                { label: "Technical Issues", value: "35%" },
                { label: "Grid Issues", value: "20%" }
              ],
              actions: [
                { label: "Deploy Technicians", type: "danger" as const, action: "deploy_technicians" },
                { label: "Schedule Repairs", type: "primary" as const, action: "schedule_repairs" },
                { label: "Generate Work Orders", type: "secondary" as const, action: "generate_work_orders" }
              ],
              trends: [
                { period: "Today", value: realTimeData.nonWorkingInstallations, change: -5.2 },
                { period: "Yesterday", value: Math.floor(realTimeData.nonWorkingInstallations * 1.05), change: -3.1 },
                { period: "Last Week", value: Math.floor(realTimeData.nonWorkingInstallations * 1.12), change: -8.4 }
              ],
              alerts: [
                { type: "warning" as const, message: "Critical systems need immediate attention" },
                { type: "info" as const, message: "Preventive maintenance scheduled for next week" }
              ],
              recommendations: [
                "Prioritize high-capacity system repairs",
                "Implement remote diagnostics",
                "Train more local technicians"
              ]
            }}
            selectedLocation={selectedState !== 'all' ? (selectedCity !== 'all' ? selectedCity : selectedState) : undefined}
          />

          <EnhancedKPICard
            title="Installed Capacity"
            value={realTimeData.cumulativeCapacity.toFixed(1)}
            unit="MW"
            trend="up"
            trendValue={`${((realTimeData.cumulativeCapacity/40000)*100).toFixed(1)}% of target`}
            icon={<Battery className="w-5 h-5" />}
            color={realTimeData.cumulativeCapacity/40000 >= 0.8 ? "#22c55e" : realTimeData.cumulativeCapacity/40000 >= 0.5 ? "#f59e0b" : "#ef4444"}
            details={{
              description: `Total commissioned rooftop solar capacity in ${selectedState !== 'all' ? selectedState : 'India'}`,
              target: selectedState === 'all' ? "40,000 MW by 2026 (National Solar Mission)" : "State allocation based on potential",
              progress: selectedState === 'all' ? (realTimeData.cumulativeCapacity/40000)*100 : 75.5,
              breakdown: [
                { label: "Residential", value: `${(filteredData.totalCapacity * 0.18).toFixed(1)} MW` },
                { label: "Commercial", value: `${(filteredData.totalCapacity * 0.65).toFixed(1)} MW` },
                { label: "Government", value: `${(filteredData.totalCapacity * 0.17).toFixed(1)} MW` }
              ],
              actions: [
                { label: "Capacity Planning", type: "primary" as const, action: "capacity_planning" },
                { label: "Grid Integration", type: "primary" as const, action: "grid_integration" },
                { label: "Download Capacity Report", type: "secondary" as const, action: "download_capacity_report" }
              ],
              trends: [
                { period: "This Month", value: Math.floor(filteredData.totalCapacity), change: 8.7 },
                { period: "Last Month", value: Math.floor(filteredData.totalCapacity * 0.92), change: 6.2 },
                { period: "Last Quarter", value: Math.floor(filteredData.totalCapacity * 0.79), change: 12.8 }
              ],
              alerts: [
                { type: "info" as const, message: "On track to meet 2026 targets" },
                { type: "warning" as const, message: "Grid infrastructure needs upgrade in some areas" }
              ],
              recommendations: [
                "Accelerate installation in high-potential areas",
                "Strengthen grid infrastructure",
                "Focus on commercial segment growth"
              ]
            }}
            selectedLocation={selectedState !== 'all' ? (selectedCity !== 'all' ? selectedCity : selectedState) : undefined}
          />

          <EnhancedKPICard
            title="Today's Generation"
            value={realTimeData.todayGeneration.toLocaleString()}
            unit="MWh"
            trend="up"
            trendValue="Peak at 12:30 PM"
            icon={<Zap className="w-5 h-5" />}
            color="#f59e0b"
            details={{
              description: `Daily energy generation from all RTS systems in ${selectedState !== 'all' ? selectedState : 'India'}`,
              target: "Weather and seasonal dependent",
              progress: 85,
              breakdown: [
                { label: "Morning (6-12)", value: `${Math.floor(realTimeData.todayGeneration * 0.35)} MWh` },
                { label: "Afternoon (12-18)", value: `${Math.floor(realTimeData.todayGeneration * 0.45)} MWh` },
                { label: "Evening (18-20)", value: `${Math.floor(realTimeData.todayGeneration * 0.20)} MWh` }
              ],
              actions: [
                { label: "Optimize Generation", type: "primary" as const, action: "optimize_generation" },
                { label: "Weather Monitoring", type: "secondary" as const, action: "weather_monitoring" },
                { label: "Export Generation Data", type: "secondary" as const, action: "export_generation_data" }
              ],
              trends: [
                { period: "Today", value: realTimeData.todayGeneration, change: 12.3 },
                { period: "Yesterday", value: Math.floor(realTimeData.todayGeneration * 0.89), change: 8.7 },
                { period: "Last Week Avg", value: Math.floor(realTimeData.todayGeneration * 0.94), change: 15.2 }
              ],
              alerts: [
                { type: "info" as const, message: "Generation above forecast" },
                { type: "warning" as const, message: "Some areas experiencing cloud cover" }
              ],
              recommendations: [
                "Continue monitoring weather patterns",
                "Optimize panel cleaning schedules",
                "Consider energy storage solutions"
              ]
            }}
            selectedLocation={selectedState !== 'all' ? (selectedCity !== 'all' ? selectedCity : selectedState) : undefined}
          />

          <EnhancedKPICard
            title="Live Generation"
            value={realTimeData.livePowerGeneration.toLocaleString()}
            unit="MW"
            trend="up"
            trendValue="Real-time power"
            icon={<Activity className="w-5 h-5" />}
            color="#8b5cf6"
            details={{
              description: `Real-time power generation from all operational systems in ${selectedState !== 'all' ? selectedState : 'India'}`,
              target: "Varies by time of day and weather",
              progress: Math.min(100, (realTimeData.livePowerGeneration / (realTimeData.cumulativeCapacity * 0.8)) * 100),
              breakdown: [
                { label: "Current", value: `${realTimeData.livePowerGeneration} MW` },
                { label: "Peak Today", value: `${Math.floor(realTimeData.cumulativeCapacity * 0.78)} MW` },
                { label: "Utilization", value: `${Math.min(100, (realTimeData.livePowerGeneration / (realTimeData.cumulativeCapacity * 0.8)) * 100).toFixed(1)}%` }
              ],
              actions: [
                { label: "Real-time Monitor", type: "primary" as const, action: "realtime_monitor" },
                { label: "Load Balancing", type: "primary" as const, action: "load_balancing" },
                { label: "System Status", type: "secondary" as const, action: "system_status" }
              ],
              trends: [
                { period: "Current Hour", value: realTimeData.livePowerGeneration, change: 5.8 },
                { period: "Last Hour", value: Math.floor(realTimeData.livePowerGeneration * 0.94), change: 3.2 },
                { period: "Peak Hour", value: Math.floor(realTimeData.cumulativeCapacity * 0.78), change: 0 }
              ],
              alerts: [
                { type: "info" as const, message: "All systems generating within normal parameters" },
                { type: "info" as const, message: "Grid integration stable" }
              ],
              recommendations: [
                "Monitor grid stability continuously",
                "Prepare for peak generation hours",
                "Optimize power factor correction"
              ]
            }}
            selectedLocation={selectedState !== 'all' ? (selectedCity !== 'all' ? selectedCity : selectedState) : undefined}
          />
        </div>

        {/* Performance Analytics - Synchronized with Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 compact-spacing mb-4">
          {/* Real-time Generation Trend */}
          <div className="glass-morphism chart-glow rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 glow-text">
              {selectedState !== 'all' ? `${selectedState} ` : ''}Generation Pattern
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={[
                { time: '06:00', generation: Math.floor(filteredData.totalCapacity * 0.1), target: Math.floor(filteredData.totalCapacity * 0.08) },
                { time: '08:00', generation: Math.floor(filteredData.totalCapacity * 0.35), target: Math.floor(filteredData.totalCapacity * 0.32) },
                { time: '10:00', generation: Math.floor(filteredData.totalCapacity * 0.62), target: Math.floor(filteredData.totalCapacity * 0.60) },
                { time: '12:00', generation: Math.floor(filteredData.totalCapacity * 0.82), target: Math.floor(filteredData.totalCapacity * 0.80) },
                { time: '14:00', generation: Math.floor(filteredData.totalCapacity * 0.78), target: Math.floor(filteredData.totalCapacity * 0.76) },
                { time: '16:00', generation: Math.floor(filteredData.totalCapacity * 0.54), target: Math.floor(filteredData.totalCapacity * 0.52) },
                { time: '18:00', generation: Math.floor(filteredData.totalCapacity * 0.22), target: Math.floor(filteredData.totalCapacity * 0.24) },
                { time: '20:00', generation: Math.floor(filteredData.totalCapacity * 0.05), target: Math.floor(filteredData.totalCapacity * 0.06) }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="generation" 
                  stroke="#3b82f6" 
                  fillOpacity={0.3}
                  fill="#3b82f6"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#10b981" 
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Location Performance */}
          <div className="glass-morphism chart-glow rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 glow-text">
              {selectedState !== 'all' ? 
                (selectedCity !== 'all' ? `${selectedCity} Metrics` : `${selectedState} Cities`) :
                'Top Performing States'
              }
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              {selectedState !== 'all' && selectedCity !== 'all' ? (
                // City-specific radial chart
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={[
                  { name: 'Capacity', value: (filteredData.cityData?.capacity || 0), fill: '#3b82f6' },
                  { name: 'Working %', value: (filteredData.cityData?.workingPercent || 0), fill: '#10b981' },
                  { name: 'Peak Power', value: (filteredData.cityData?.peakPower || 0), fill: '#f59e0b' }
                ]}>
                  <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise dataKey="value" />
                  <Tooltip />
                </RadialBarChart>
              ) : (
                // Bar chart for states/cities
                <BarChart data={
                  selectedState !== 'all' && selectedCity === 'all' ?
                    // Cities in selected state
                    (enhancedCityData[selectedState] || []).slice(0, 6).map(city => ({
                      name: city.name.length > 8 ? city.name.substring(0, 8) + '..' : city.name,
                      capacity: city.capacity,
                      installations: Math.floor(city.installations / 1000),
                      workingPercent: city.workingPercent
                    })) :
                    // All states
                    Object.entries(filteredData.stateData || {}).map(([state, data]) => ({
                      name: state.length > 8 ? state.substring(0, 8) + '..' : state,
                      capacity: data.capacity,
                      installations: Math.floor(data.installations / 1000),
                      workingPercent: data.workingPercent
                    }))
                }>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }} 
                  />
                  <Bar yAxisId="left" dataKey="capacity" fill="#3b82f6" name="Capacity (MW)" radius={[2, 2, 0, 0]} />
                  <Bar yAxisId="right" dataKey="installations" fill="#10b981" name="Installations (K)" radius={[2, 2, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics for Selected Location */}
        {(selectedState !== 'all' || selectedCity !== 'all') && filteredData && (
          <div className="glass-morphism rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-3 glow-text">
              {selectedCity !== 'all' ? selectedCity : selectedState} Detailed Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 compact-spacing">
              {[
                { label: "Capacity", value: `${filteredData.totalCapacity.toFixed(1)} MW`, color: "#3b82f6" },
                { label: "Installations", value: filteredData.totalInstallations.toLocaleString(), color: "#10b981" },
                { label: "CO₂ Avoided", value: `${filteredData.totalCo2Avoided.toFixed(1)} tons`, color: "#22c55e" },
                { label: "Revenue Impact", value: `₹${filteredData.totalRevenue.toFixed(1)}K`, color: "#f59e0b" },
                { label: "Grid Stability", value: `${filteredData.avgGridStability.toFixed(1)}%`, color: "#8b5cf6" },
                { label: "Peak Generation", value: `${filteredData.totalPeakGeneration.toFixed(1)} MW`, color: "#06b6d4" }
              ].map((metric, index) => (
                <div key={index} className="text-center glass-morphism p-3 rounded-lg interactive-card">
                  <div className="text-xl font-bold glow-text" style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="text-slate-400 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Status */}
        <div className="glass-morphism rounded-xl p-3">
          <div className="flex justify-between items-center text-sm text-slate-400">
            <div>Last Updated: {currentTime.toLocaleTimeString()}</div>
            <div className="flex items-center compact-spacing">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time Data Active</span>
              </div>
              <div>Data Source: MNRE, DISCOMs</div>
              <div>
                Viewing: {selectedCity !== 'all' ? selectedCity : selectedState !== 'all' ? selectedState : 'All India'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}
