import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Battery, AlertTriangle, CheckCircle, Wrench, Users, Lightbulb, MapPin, Calendar, Activity, X, Play, Pause, Settings, Download, RefreshCw, Eye, Cpu, Wifi, WifiOff, Filter, Search, Bell } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

// Enhanced styling without animations for KPI cards
const glowPulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const borderRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const StyledWrapper = styled.div`
  .glass-morphism {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }
  
  .interactive-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(59, 130, 246, 0.2);
    }
  }
  
  .alien-progress {
    background: linear-gradient(90deg, 
      rgba(15, 23, 42, 0.8) 0%, 
      rgba(59, 130, 246, 0.3) 50%, 
      rgba(34, 197, 94, 0.3) 100%);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .glow-text {
    text-shadow: 0 0 10px currentColor;
  }
  
  .chart-glow {
    box-shadow: 
      0 0 20px rgba(59, 130, 246, 0.1),
      inset 0 0 20px rgba(59, 130, 246, 0.05);
  }
  
  .compact-spacing {
    gap: 8px;
  }
  
  .ultra-compact {
    gap: 6px;
    margin: 6px 0;
  }
`;

// Enhanced Data Structure with State-based Organization
const stateBasedData = {
  "Gujarat": {
    installations: 395490,
    capacity: 1100.70,
    workingPercent: 96.8,
    nonWorkingCount: 12656,
    todayGeneration: 8805.6,
    liveGeneration: 847.5,
    co2Avoided: 1205.8,
    revenue: 498.3,
    maintenanceAlerts: 8950,
    gridStability: 98.2,
    peakGeneration: 847.5,
    efficiency: 84.2,
    systemSizes: { small: 52, medium: 28, large: 20 },
    sectors: { residential: 18, commercial: 65, government: 17 },
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    alerts: [
      { type: "warning", message: "850 systems need maintenance in Ahmedabad region" },
      { type: "info", message: "High solar irradiance expected for next 3 days" }
    ],
    recommendations: [
      "Deploy maintenance teams to high-alert zones",
      "Optimize cleaning schedules during dust season",
      "Expand grid capacity in Surat industrial area"
    ]
  },
  "Maharashtra": {
    installations: 85000,
    capacity: 285.5,
    workingPercent: 94.2,
    nonWorkingCount: 4930,
    todayGeneration: 2284.0,
    liveGeneration: 218.7,
    co2Avoided: 312.7,
    revenue: 128.5,
    maintenanceAlerts: 4250,
    gridStability: 96.8,
    peakGeneration: 218.7,
    efficiency: 82.1,
    systemSizes: { small: 48, medium: 32, large: 20 },
    sectors: { residential: 22, commercial: 61, government: 17 },
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    alerts: [
      { type: "error", message: "420 systems offline in Mumbai due to grid issues" },
      { type: "warning", message: "Monsoon season maintenance required" }
    ],
    recommendations: [
      "Strengthen grid infrastructure in Mumbai",
      "Implement monsoon protection measures",
      "Increase commercial sector installations"
    ]
  },
  "Rajasthan": {
    installations: 45000,
    capacity: 158.2,
    workingPercent: 95.5,
    nonWorkingCount: 2025,
    todayGeneration: 1265.6,
    liveGeneration: 131.2,
    co2Avoided: 173.4,
    revenue: 71.3,
    maintenanceAlerts: 1800,
    gridStability: 97.5,
    peakGeneration: 131.2,
    efficiency: 86.8,
    systemSizes: { small: 45, medium: 35, large: 20 },
    sectors: { residential: 25, commercial: 58, government: 17 },
    cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner"],
    alerts: [
      { type: "info", message: "Excellent solar conditions - 380 systems performing above target" },
      { type: "warning", message: "Dust accumulation detected in desert regions" }
    ],
    recommendations: [
      "Increase cleaning frequency in desert areas",
      "Leverage high solar irradiance for expansion",
      "Focus on industrial corridors"
    ]
  },
  "Tamil Nadu": {
    installations: 38000,
    capacity: 142.8,
    workingPercent: 93.8,
    nonWorkingCount: 2356,
    todayGeneration: 1142.4,
    liveGeneration: 119.4,
    co2Avoided: 156.6,
    revenue: 64.3,
    maintenanceAlerts: 2280,
    gridStability: 95.3,
    peakGeneration: 119.4,
    efficiency: 81.4,
    systemSizes: { small: 50, medium: 30, large: 20 },
    sectors: { residential: 28, commercial: 55, government: 17 },
    cities: ["Chennai", "Coimbatore", "Madurai", "Salem"],
    alerts: [
      { type: "warning", message: "Coastal humidity affecting 280 installations" },
      { type: "info", message: "Government sector showing strong adoption" }
    ],
    recommendations: [
      "Implement humidity-resistant technologies",
      "Expand in industrial clusters",
      "Promote residential adoption in urban areas"
    ]
  },
  "Karnataka": {
    installations: 32000,
    capacity: 118.5,
    workingPercent: 94.6,
    nonWorkingCount: 1728,
    todayGeneration: 947.5,
    liveGeneration: 97.8,
    co2Avoided: 129.9,
    revenue: 53.4,
    maintenanceAlerts: 1920,
    gridStability: 96.1,
    peakGeneration: 97.8,
    efficiency: 83.6,
    systemSizes: { small: 47, medium: 33, large: 20 },
    sectors: { residential: 30, commercial: 53, government: 17 },
    cities: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    alerts: [
      { type: "info", message: "Tech hub Bangalore leading in smart installations" },
      { type: "warning", message: "Grid integration delays in rural areas" }
    ],
    recommendations: [
      "Accelerate rural grid connectivity",
      "Leverage IT sector for innovation",
      "Promote tech-enabled monitoring"
    ]
  }
};

// Interface Definitions
interface DetailedKPIInfo {
  description: string;
  target: string;
  progress: number;
  breakdown: Array<{ label: string; value: string; color?: string }>;
  actions: Array<{ label: string; type: 'primary' | 'secondary' | 'danger'; action: string; icon?: React.ReactNode }>;
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
  selectedState?: string;
}

// Enhanced Detail Panel Component
const DetailPanel: React.FC<PanelProps> = ({ isOpen, onClose, title, data, value, unit, color, icon, selectedState }) => {
  if (!isOpen) return null;

  return (
    <StyledWrapper>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-morphism rounded-2xl p-6 max-w-6xl w-full max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20`, color }}>
                {icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white glow-text">{title}</h2>
                {selectedState && selectedState !== 'all' && (
                  <div className="text-sm text-slate-400">State: {selectedState}</div>
                )}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress & Details */}
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Progress Details
              </h3>
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
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                {data.actions.map((action, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2 ${
                      action.type === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                      action.type === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white' :
                      'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                    onClick={() => {
                      console.log(`Executing: ${action.action} for ${selectedState || 'All India'}`);
                      // Add actual action logic here
                    }}
                  >
                    {action.icon && action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts & Recommendations */}
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Insights & Alerts
              </h3>
              
              <div className="space-y-3 mb-4">
                {data.alerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded-lg text-sm ${
                    alert.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {alert.message}
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-semibold text-white text-sm mb-3">AI Recommendations</h4>
                <ul className="space-y-2">
                  {data.recommendations.map((rec, index) => (
                    <li key={index} className="text-slate-300 text-sm flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Trends Section */}
          <div className="mt-6 glass-morphism p-4 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Trends
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.trends.map((trend, index) => (
                <div key={index} className="text-center p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">{trend.period}</div>
                  <div className="text-white font-bold text-lg">{trend.value.toLocaleString()}</div>
                  <div className={`flex items-center justify-center space-x-1 text-sm ${
                    trend.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trend.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{Math.abs(trend.change)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// Enhanced KPI Card without animations
interface EnhancedKPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
  details: DetailedKPIInfo;
  selectedState?: string;
}

const EnhancedKPICard: React.FC<EnhancedKPICardProps> = ({
  title, value, unit = '', trend = 'stable', trendValue = '', icon, color, details, selectedState
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
        className="glass-morphism interactive-card p-4 rounded-xl cursor-pointer border border-slate-600/30"
        onClick={() => setIsDetailOpen(true)}
        style={{ borderColor: `${color}30` }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
              {icon}
            </div>
            <div>
              <h3 className="text-xs font-medium text-slate-300">{title}</h3>
              {selectedState && selectedState !== 'all' && (
                <div className="text-xs text-slate-500">({selectedState})</div>
              )}
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-white">{value}</span>
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

        <div className="alien-progress h-1 mb-2">
          <div 
            className="h-full rounded-full"
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
        selectedState={selectedState}
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

// AI Advisory Panel Component
interface AIAdvisoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedState: string;
  stateData: any;
}

const AIAdvisoryPanel: React.FC<AIAdvisoryPanelProps> = ({ isOpen, onClose, selectedState, stateData }) => {
  if (!isOpen) return null;

  const insights = selectedState !== 'all' && stateData ? stateData.alerts : [
    { type: "error", message: "2,150 systems showing performance degradation > 15% across multiple states" },
    { type: "warning", message: "Weather forecast shows 3 days of high solar irradiance - prepare for increased generation" }
  ];

  const recommendations = selectedState !== 'all' && stateData ? stateData.recommendations : [
    "Deploy maintenance teams to critical zones",
    "Optimize grid balancing for peak generation periods",
    "Implement predictive maintenance protocols"
  ];

  return (
    <StyledWrapper>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="glass-morphism rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white glow-text">
                AI Advisory Panel - {selectedState !== 'all' ? selectedState : 'National'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">Current Alerts</h3>
              <div className="space-y-3">
                {insights.map((insight: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg text-sm ${
                    insight.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    insight.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {insight.message}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-morphism p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
              <div className="space-y-2">
                {recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-slate-300">
                    <span className="text-green-400 mr-2">•</span>
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Generate Report
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Execute Actions
            </button>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors">
              Schedule Review
            </button>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

// Main Dashboard Component
export default function KPIDashboard() {
  const [selectedState, setSelectedState] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

  // Data filtering logic
  const getFilteredData = useCallback(() => {
    if (selectedState === 'all') {
      // Aggregate all state data
      const allStates = Object.values(stateBasedData);
      return {
        totalInstallations: allStates.reduce((sum, state) => sum + state.installations, 0),
        totalCapacity: allStates.reduce((sum, state) => sum + state.capacity, 0),
        avgWorkingPercent: allStates.reduce((sum, state) => sum + state.workingPercent, 0) / allStates.length,
        totalNonWorking: allStates.reduce((sum, state) => sum + state.nonWorkingCount, 0),
        totalTodayGeneration: allStates.reduce((sum, state) => sum + state.todayGeneration, 0),
        totalLiveGeneration: allStates.reduce((sum, state) => sum + state.liveGeneration, 0),
        totalCo2Avoided: allStates.reduce((sum, state) => sum + state.co2Avoided, 0),
        totalRevenue: allStates.reduce((sum, state) => sum + state.revenue, 0),
        totalMaintenanceAlerts: allStates.reduce((sum, state) => sum + state.maintenanceAlerts, 0),
        avgGridStability: allStates.reduce((sum, state) => sum + state.gridStability, 0) / allStates.length,
        avgEfficiency: allStates.reduce((sum, state) => sum + state.efficiency, 0) / allStates.length,
        stateData: stateBasedData
      };
    } else {
      // Single state data
      const stateData = stateBasedData[selectedState as keyof typeof stateBasedData];
      if (!stateData) return null;

      const workingInstallations = Math.floor(stateData.installations * (stateData.workingPercent / 100));
      
      return {
        totalInstallations: stateData.installations,
        totalCapacity: stateData.capacity,
        avgWorkingPercent: stateData.workingPercent,
        workingInstallations,
        totalNonWorking: stateData.nonWorkingCount,
        totalTodayGeneration: stateData.todayGeneration,
        totalLiveGeneration: stateData.liveGeneration,
        totalCo2Avoided: stateData.co2Avoided,
        totalRevenue: stateData.revenue,
        totalMaintenanceAlerts: stateData.maintenanceAlerts,
        avgGridStability: stateData.gridStability,
        avgEfficiency: stateData.efficiency,
        stateData: { [selectedState]: stateData },
        selectedStateData: stateData
      };
    }
  }, [selectedState]);

  const filteredData = getFilteredData();

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // KPI Details Generator
  const getKPIDetails = (type: string): DetailedKPIInfo => {
    const locationName = selectedState !== 'all' ? selectedState : 'All India';
    
    const kpiDetailsMap = {
      installations: {
        description: `Total rooftop solar installations in ${locationName} under PM Surya Ghar scheme`,
        target: selectedState === 'all' ? "1 Crore households by 2027" : "State-wise expansion target",
        progress: selectedState === 'all' ? 
          ((filteredData?.totalInstallations || 0) / 10000000) * 100 :
          85.0,
        breakdown: [
          { label: "Residential", value: `${Math.floor((filteredData?.totalInstallations || 0) * 0.52)}` },
          { label: "Commercial", value: `${Math.floor((filteredData?.totalInstallations || 0) * 0.28)}` },
          { label: "Industrial", value: `${Math.floor((filteredData?.totalInstallations || 0) * 0.20)}` }
        ],
        actions: [
          { label: "Download Report", type: "primary" as const, action: "download_installations", icon: <Download className="w-4 h-4" /> },
          { label: "Schedule Inspection", type: "secondary" as const, action: "schedule_inspection", icon: <Eye className="w-4 h-4" /> },
          { label: "Deploy Teams", type: "danger" as const, action: "deploy_teams", icon: <Users className="w-4 h-4" /> }
        ],
        trends: [
          { period: "This Month", value: filteredData?.totalInstallations || 0, change: 12.5 },
          { period: "Last Month", value: Math.floor((filteredData?.totalInstallations || 0) * 0.89), change: 8.2 },
          { period: "Last Quarter", value: Math.floor((filteredData?.totalInstallations || 0) * 0.75), change: 15.3 }
        ],
        alerts: selectedState !== 'all' && filteredData?.selectedStateData ? 
          filteredData.selectedStateData.alerts : 
          [
            { type: "info" as const, message: "Installation rate trending upward" },
            { type: "warning" as const, message: "Some regions below target pace" }
          ],
        recommendations: selectedState !== 'all' && filteredData?.selectedStateData ? 
          filteredData.selectedStateData.recommendations : 
          [
            "Focus on high-potential regions",
            "Streamline approval processes",
            "Increase installer network"
          ]
      },
      workingSystems: {
        description: `Currently operational solar installations in ${locationName}`,
        target: ">95% operational efficiency",
        progress: filteredData?.avgWorkingPercent || 94.5,
        breakdown: [
          { label: "Excellent (>90%)", value: `${Math.floor((filteredData?.workingInstallations || 0) * 0.75)}` },
          { label: "Good (80-90%)", value: `${Math.floor((filteredData?.workingInstallations || 0) * 0.20)}` },
          { label: "Fair (<80%)", value: `${Math.floor((filteredData?.workingInstallations || 0) * 0.05)}` }
        ],
        actions: [
          { label: "Performance Monitor", type: "primary" as const, action: "monitor_performance", icon: <Activity className="w-4 h-4" /> },
          { label: "Optimize Systems", type: "primary" as const, action: "optimize_systems", icon: <Settings className="w-4 h-4" /> },
          { label: "Maintenance Alert", type: "danger" as const, action: "maintenance_alert", icon: <AlertTriangle className="w-4 h-4" /> }
        ],
        trends: [
          { period: "Today", value: filteredData?.workingInstallations || 0, change: 2.1 },
          { period: "Yesterday", value: Math.floor((filteredData?.workingInstallations || 0) * 0.98), change: 1.8 },
          { period: "Last Week", value: Math.floor((filteredData?.workingInstallations || 0) * 0.94), change: 3.2 }
        ],
        alerts: selectedState !== 'all' && filteredData?.selectedStateData ? 
          filteredData.selectedStateData.alerts : 
          [
            { type: "info" as const, message: "System performance within acceptable range" },
            { type: "warning" as const, message: "Some systems require attention" }
          ],
        recommendations: selectedState !== 'all' && filteredData?.selectedStateData ? 
          filteredData.selectedStateData.recommendations : 
          [
            "Implement predictive maintenance",
            "Upgrade monitoring systems",
            "Regular performance audits"
          ]
      }
    };

    return kpiDetailsMap[type as keyof typeof kpiDetailsMap] || kpiDetailsMap.installations;
  };

  // Options for dropdown
  const stateOptions = [
    { value: 'all', label: 'All India' },
    ...Object.keys(stateBasedData).map(state => ({ value: state, label: state }))
  ];

  if (!filteredData) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>;
  }

  const workingInstallations = selectedState === 'all' ? 
    Math.floor(filteredData.totalInstallations * (filteredData.avgWorkingPercent / 100)) :
    filteredData.workingInstallations || 0;

  return (
    <StyledWrapper>
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-3 compact-spacing">
        {/* Header */}
        <div className="glass-morphism rounded-2xl p-4 mb-4">
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
                {selectedState !== 'all' && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{selectedState}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center compact-spacing">
              <FilterDropdown
                label="State"
                options={stateOptions}
                value={selectedState}
                onChange={setSelectedState}
              />
            </div>
          </div>
        </div>

        {/* AI Advisory Panel Trigger */}
        <div 
          className="glass-morphism rounded-2xl p-4 mb-4 cursor-pointer interactive-card"
          onClick={() => setIsAIPanelOpen(true)}
        >
          <div className="flex items-center compact-spacing">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white glow-text">
              AI Advisory Panel - {selectedState !== 'all' ? selectedState : 'National'}
            </h2>
            <div className="px-2 py-1 bg-green-500/20 rounded-full text-green-400 text-xs">Live Insights</div>
            <div className="ml-auto text-xs text-slate-400">Click to expand</div>
          </div>
          <div className="text-sm text-slate-300 mt-2">
            {filteredData.totalMaintenanceAlerts} systems need attention • 
            Performance trending {filteredData.avgEfficiency > 85 ? 'up' : 'stable'} • 
            Grid stability at {filteredData.avgGridStability.toFixed(1)}%
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 compact-spacing mb-4">
          <EnhancedKPICard
            title="Total Installations"
            value={filteredData.totalInstallations.toLocaleString()}
            trend="up"
            trendValue="+12.5% this month"
            icon={<Users className="w-5 h-5" />}
            color="#06b6d4"
            details={getKPIDetails('installations')}
            selectedState={selectedState}
          />
          
          <EnhancedKPICard
            title="Working Systems"
            value={workingInstallations.toLocaleString()}
            unit={`${filteredData.avgWorkingPercent.toFixed(1)}%`}
            trend="stable"
            trendValue="Operational efficiency"
            icon={<CheckCircle className="w-5 h-5" />}
            color="#10b981"
            details={getKPIDetails('workingSystems')}
            selectedState={selectedState}
          />
          
          <EnhancedKPICard
            title="Non-Working"
            value={filteredData.totalNonWorking.toLocaleString()}
            trend="down"
            trendValue="-5% this week"
            icon={<AlertTriangle className="w-5 h-5" />}
            color="#ef4444"
            details={{
              description: `Systems requiring maintenance in ${selectedState !== 'all' ? selectedState : 'All India'}`,
              target: "<5% downtime",
              progress: 100 - ((filteredData.totalNonWorking / filteredData.totalInstallations) * 100),
              breakdown: [
                { label: "Maintenance", value: `${Math.floor(filteredData.totalNonWorking * 0.45)}` },
                { label: "Technical Issues", value: `${Math.floor(filteredData.totalNonWorking * 0.35)}` },
                { label: "Grid Issues", value: `${Math.floor(filteredData.totalNonWorking * 0.20)}` }
              ],
              actions: [
                { label: "Deploy Technicians", type: "danger" as const, action: "deploy_tech", icon: <Tool className="w-4 h-4" /> },
                { label: "Schedule Repairs", type: "primary" as const, action: "schedule_repairs", icon: <Wrench className="w-4 h-4" /> },
                { label: "Generate Work Orders", type: "secondary" as const, action: "generate_wo", icon: <Settings className="w-4 h-4" /> }
              ],
              trends: [
                { period: "Today", value: filteredData.totalNonWorking, change: -5.2 },
                { period: "Yesterday", value: Math.floor(filteredData.totalNonWorking * 1.05), change: -3.1 },
                { period: "Last Week", value: Math.floor(filteredData.totalNonWorking * 1.12), change: -8.4 }
              ],
              alerts: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.alerts : 
                [
                  { type: "warning" as const, message: "Critical systems need immediate attention" },
                  { type: "info" as const, message: "Preventive maintenance scheduled" }
                ],
              recommendations: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.recommendations : 
                [
                  "Prioritize high-capacity repairs",
                  "Implement remote diagnostics",
                  "Train local technicians"
                ]
            }}
            selectedState={selectedState}
          />

          <EnhancedKPICard
            title="Installed Capacity"
            value={filteredData.totalCapacity.toFixed(1)}
            unit="MW"
            trend="up"
            trendValue={`${((filteredData.totalCapacity / 40000) * 100).toFixed(1)}% of target`}
            icon={<Battery className="w-5 h-5" />}
            color={filteredData.totalCapacity / 40000 >= 0.8 ? "#22c55e" : filteredData.totalCapacity / 40000 >= 0.5 ? "#f59e0b" : "#ef4444"}
            details={{
              description: `Total commissioned capacity in ${selectedState !== 'all' ? selectedState : 'All India'}`,
              target: selectedState === 'all' ? "40,000 MW by 2026" : "State capacity target",
              progress: selectedState === 'all' ? (filteredData.totalCapacity / 40000) * 100 : 75.5,
              breakdown: [
                { label: "Residential", value: `${(filteredData.totalCapacity * 0.18).toFixed(1)} MW` },
                { label: "Commercial", value: `${(filteredData.totalCapacity * 0.65).toFixed(1)} MW` },
                { label: "Government", value: `${(filteredData.totalCapacity * 0.17).toFixed(1)} MW` }
              ],
              actions: [
                { label: "Capacity Planning", type: "primary" as const, action: "capacity_plan", icon: <Battery className="w-4 h-4" /> },
                { label: "Grid Integration", type: "primary" as const, action: "grid_integrate", icon: <Wifi className="w-4 h-4" /> },
                { label: "Download Report", type: "secondary" as const, action: "download_report", icon: <Download className="w-4 h-4" /> }
              ],
              trends: [
                { period: "This Month", value: Math.floor(filteredData.totalCapacity), change: 8.7 },
                { period: "Last Month", value: Math.floor(filteredData.totalCapacity * 0.92), change: 6.2 },
                { period: "Last Quarter", value: Math.floor(filteredData.totalCapacity * 0.79), change: 12.8 }
              ],
              alerts: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.alerts : 
                [
                  { type: "info" as const, message: "On track to meet targets" },
                  { type: "warning" as const, message: "Grid upgrades needed in some areas" }
                ],
              recommendations: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.recommendations : 
                [
                  "Accelerate high-potential installations",
                  "Strengthen grid infrastructure", 
                  "Focus on commercial segment"
                ]
            }}
            selectedState={selectedState}
          />

          <EnhancedKPICard
            title="Today's Generation"
            value={filteredData.totalTodayGeneration.toFixed(0)}
            unit="MWh"
            trend="up"
            trendValue="Peak at 12:30 PM"
            icon={<Zap className="w-5 h-5" />}
            color="#f59e0b"
            details={{
              description: `Daily energy generation in ${selectedState !== 'all' ? selectedState : 'All India'}`,
              target: "Weather dependent",
              progress: 85,
              breakdown: [
                { label: "Morning (6-12)", value: `${Math.floor(filteredData.totalTodayGeneration * 0.35)} MWh` },
                { label: "Afternoon (12-18)", value: `${Math.floor(filteredData.totalTodayGeneration * 0.45)} MWh` },
                { label: "Evening (18-20)", value: `${Math.floor(filteredData.totalTodayGeneration * 0.20)} MWh` }
              ],
              actions: [
                { label: "Optimize Generation", type: "primary" as const, action: "optimize_gen", icon: <Zap className="w-4 h-4" /> },
                { label: "Weather Monitor", type: "secondary" as const, action: "weather_monitor", icon: <Eye className="w-4 h-4" /> },
                { label: "Export Data", type: "secondary" as const, action: "export_data", icon: <Download className="w-4 h-4" /> }
              ],
              trends: [
                { period: "Today", value: Math.floor(filteredData.totalTodayGeneration), change: 12.3 },
                { period: "Yesterday", value: Math.floor(filteredData.totalTodayGeneration * 0.89), change: 8.7 },
                { period: "Last Week Avg", value: Math.floor(filteredData.totalTodayGeneration * 0.94), change: 15.2 }
              ],
              alerts: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.alerts : 
                [
                  { type: "info" as const, message: "Generation above forecast" },
                  { type: "warning" as const, message: "Weather impacts in some regions" }
                ],
              recommendations: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.recommendations : 
                [
                  "Monitor weather patterns",
                  "Optimize cleaning schedules",
                  "Consider energy storage"
                ]
            }}
            selectedState={selectedState}
          />

          <EnhancedKPICard
            title="Live Generation"
            value={filteredData.totalLiveGeneration.toFixed(0)}
            unit="MW"
            trend="up"
            trendValue="Real-time power"
            icon={<Activity className="w-5 h-5" />}
            color="#8b5cf6"
            details={{
              description: `Current power generation in ${selectedState !== 'all' ? selectedState : 'All India'}`,
              target: "Time and weather dependent",
              progress: Math.min(100, (filteredData.totalLiveGeneration / (filteredData.totalCapacity * 0.8)) * 100),
              breakdown: [
                { label: "Current", value: `${filteredData.totalLiveGeneration.toFixed(0)} MW` },
                { label: "Peak Today", value: `${Math.floor(filteredData.totalCapacity * 0.78)} MW` },
                { label: "Utilization", value: `${Math.min(100, (filteredData.totalLiveGeneration / (filteredData.totalCapacity * 0.8)) * 100).toFixed(1)}%` }
              ],
              actions: [
                { label: "Real-time Monitor", type: "primary" as const, action: "realtime_monitor", icon: <Activity className="w-4 h-4" /> },
                { label: "Load Balancing", type: "primary" as const, action: "load_balance", icon: <Cpu className="w-4 h-4" /> },
                { label: "System Status", type: "secondary" as const, action: "system_status", icon: <CheckCircle className="w-4 h-4" /> }
              ],
              trends: [
                { period: "Current Hour", value: Math.floor(filteredData.totalLiveGeneration), change: 5.8 },
                { period: "Last Hour", value: Math.floor(filteredData.totalLiveGeneration * 0.94), change: 3.2 },
                { period: "Peak Hour", value: Math.floor(filteredData.totalCapacity * 0.78), change: 0 }
              ],
              alerts: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.alerts : 
                [
                  { type: "info" as const, message: "Systems generating within parameters" },
                  { type: "info" as const, message: "Grid integration stable" }
                ],
              recommendations: selectedState !== 'all' && filteredData.selectedStateData ? 
                filteredData.selectedStateData.recommendations : 
                [
                  "Monitor grid stability continuously",
                  "Prepare for peak hours",
                  "Optimize power factor"
                ]
            }}
            selectedState={selectedState}
          />
        </div>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 compact-spacing mb-4">
          {/* Generation Pattern */}
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

          {/* State/Location Performance */}
          <div className="glass-morphism chart-glow rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3 glow-text">
              {selectedState !== 'all' ? `${selectedState} Metrics` : 'State Performance Comparison'}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={
                selectedState === 'all' ?
                  Object.entries(filteredData.stateData).map(([state, data]) => ({
                    name: state.length > 8 ? state.substring(0, 8) + '..' : state,
                    capacity: data.capacity,
                    installations: Math.floor(data.installations / 1000),
                    efficiency: data.efficiency
                  })) :
                  [{
                    name: selectedState,
                    capacity: filteredData.totalCapacity,
                    installations: Math.floor(filteredData.totalInstallations / 1000),
                    efficiency: filteredData.avgEfficiency
                  }]
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
            </ResponsiveContainer>
          </div>
        </div>

        {/* State Summary (only shown when state is selected) */}
        {selectedState !== 'all' && filteredData.selectedStateData && (
          <div className="glass-morphism rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-white mb-3 glow-text">
              {selectedState} Summary Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 compact-spacing">
              {[
                { label: "Efficiency", value: `${filteredData.avgEfficiency.toFixed(1)}%`, color: "#22c55e" },
                { label: "Grid Stability", value: `${filteredData.avgGridStability.toFixed(1)}%`, color: "#3b82f6" },
                { label: "CO₂ Avoided", value: `${filteredData.totalCo2Avoided.toFixed(1)} tons`, color: "#10b981" },
                { label: "Revenue", value: `₹${filteredData.totalRevenue.toFixed(1)}K`, color: "#f59e0b" },
                { label: "Maintenance Alerts", value: filteredData.totalMaintenanceAlerts.toLocaleString(), color: "#ef4444" },
                { label: "Cities Covered", value: filteredData.selectedStateData.cities.length.toString(), color: "#8b5cf6" }
              ].map((metric, index) => (
                <div key={index} className="text-center glass-morphism p-3 rounded-lg">
                  <div className="text-xl font-bold glow-text" style={{ color: metric.color }}>
                    {metric.value}
                  </div>
                  <div className="text-slate-400 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="glass-morphism rounded-xl p-3">
          <div className="flex justify-between items-center text-sm text-slate-400">
            <div>Last Updated: {currentTime.toLocaleTimeString()}</div>
            <div className="flex items-center compact-spacing">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Real-time Data Active</span>
              </div>
              <div>Data Source: MNRE, DISCOMs</div>
              <div>Viewing: {selectedState !== 'all' ? selectedState : 'All India'}</div>
            </div>
          </div>
        </div>

        {/* AI Advisory Panel */}
        <AIAdvisoryPanel
          isOpen={isAIPanelOpen}
          onClose={() => setIsAIPanelOpen(false)}
          selectedState={selectedState}
          stateData={filteredData.selectedStateData}
        />
      </div>
    </StyledWrapper>
  );
}
