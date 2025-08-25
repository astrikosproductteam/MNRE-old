import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Battery, AlertTriangle, CheckCircle, Wrench, Users, Lightbulb, MapPin, Calendar, Activity } from 'lucide-react';
import { KPIData, Asset, WorkOrder } from '../types';
import EnhancedKPICard from './EnhancedKPICard';
import FilterDropdown from './FilterDropdown';

// Enhanced realistic data with proper KPI structure
const nationalKPITargets = {
  totalCapacity: 40000, // MW by 2026
  residentialCapacity: 4000, // MW by 2026
  commercialCapacity: 34000, // MW by 2026
  targetHouseholds: 10000000, // 1 crore households by 2027
};

const cityAcceleratorCities = [
  { name: "Chandigarh", state: "Chandigarh", installations: 2850, capacity: 8.5, workingPercent: 96.2 },
  { name: "Nagpur", state: "Maharashtra", installations: 3200, capacity: 12.1, workingPercent: 94.8 },
  { name: "Thiruvananthapuram", state: "Kerala", installations: 2100, capacity: 6.8, workingPercent: 95.5 },
  { name: "Surat", state: "Gujarat", installations: 4500, capacity: 18.2, workingPercent: 97.1 },
  { name: "Pune", state: "Maharashtra", installations: 3800, capacity: 14.5, workingPercent: 93.7 },
  { name: "Jaipur", state: "Rajasthan", installations: 2900, capacity: 11.2, workingPercent: 95.8 },
  { name: "Coimbatore", state: "Tamil Nadu", installations: 2600, capacity: 9.4, workingPercent: 96.4 },
  { name: "Indore", state: "Madhya Pradesh", installations: 2200, capacity: 7.8, workingPercent: 94.2 },
];

const stateWiseData = {
  "Gujarat": {
    installations: 395490,
    capacity: 1100.70,
    workingPercent: 96.8,
    households: 395490,
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    surplusExported: 165.1 // MU
  },
  "Maharashtra": {
    installations: 85000,
    capacity: 285.5,
    workingPercent: 94.2,
    households: 85000,
    cities: ["Mumbai", "Pune", "Nagpur", "Nashik"],
    surplusExported: 42.8
  },
  "Rajasthan": {
    installations: 45000,
    capacity: 158.2,
    workingPercent: 95.5,
    households: 45000,
    cities: ["Jaipur", "Jodhpur", "Kota", "Bikaner"],
    surplusExported: 28.5
  },
  "Tamil Nadu": {
    installations: 38000,
    capacity: 142.8,
    workingPercent: 93.8,
    households: 38000,
    cities: ["Chennai", "Coimbatore", "Madurai", "Salem"],
    surplusExported: 31.2
  },
  "Karnataka": {
    installations: 32000,
    capacity: 118.5,
    workingPercent: 94.6,
    households: 32000,
    cities: ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    surplusExported: 22.4
  },
  "Uttar Pradesh": {
    installations: 28000,
    capacity: 95.2,
    workingPercent: 92.1,
    households: 28000,
    cities: ["Lucknow", "Kanpur", "Agra", "Varanasi"],
    surplusExported: 18.9
  },
  "Haryana": {
    installations: 20906,
    capacity: 59.92,
    workingPercent: 95.2,
    households: 20906,
    cities: ["Gurgaon", "Faridabad", "Panipat", "Ambala"],
    surplusExported: 11.2
  },
  "Andhra Pradesh": {
    installations: 15329,
    capacity: 53.39,
    workingPercent: 91.8,
    households: 15329,
    cities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
    surplusExported: 9.8
  },
  "Kerala": {
    installations: 12500,
    capacity: 45.2,
    workingPercent: 96.1,
    households: 12500,
    cities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
    surplusExported: 8.5
  },
  "Punjab": {
    installations: 11000,
    capacity: 38.5,
    workingPercent: 93.9,
    households: 11000,
    cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    surplusExported: 7.2
  }
};

const systemSizeDistribution = [
  { category: "<3 kW", percentage: 52, installations: 520000, color: "#22c55e" },
  { category: "3-10 kW", percentage: 28, installations: 280000, color: "#3b82f6" },
  { category: ">10 kW", percentage: 20, installations: 200000, color: "#f59e0b" }
];

const sectorProgress = [
  { sector: "Residential", capacity: 3024, target: 4000, percentage: 75.6, color: "#10b981" },
  { sector: "Commercial & Industrial", capacity: 14000, target: 34000, percentage: 41.2, color: "#3b82f6" },
  { sector: "Government", capacity: 2200, target: 2000, percentage: 110, color: "#8b5cf6" }
];

const aiAdvisoryInsights = [
  {
    type: "critical",
    title: "Immediate Action Required",
    message: "2,150 systems showing performance degradation > 15%. Deploy maintenance teams to Gujarat (850), Maharashtra (420), Rajasthan (380).",
    icon: <AlertTriangle className="w-5 h-5" />,
    priority: "High"
  },
  {
    type: "optimization",
    title: "Performance Optimization",
    message: "Weather forecast shows 3 days of high solar irradiance. Expect 12-15% increase in generation. Prepare grid balancing.",
    icon: <TrendingUp className="w-5 h-5" />,
    priority: "Medium"
  },
  {
    type: "maintenance",
    title: "Predictive Maintenance",
    message: "485 inverters approaching replacement cycle. Schedule proactive maintenance to prevent failures.",
    icon: <Wrench className="w-5 h-5" />,
    priority: "Medium"
  }
];

interface KPIDashboardProps {
  kpiData: KPIData[];
  assets: Asset[];
  workOrders: WorkOrder[];
}

export default function KPIDashboard({ kpiData, assets, workOrders }: KPIDashboardProps) {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [realTimeData, setRealTimeData] = useState({
    totalInstallations: 1009000,
    workingInstallations: 0,
    nonWorkingInstallations: 0,
    todayGeneration: 0,
    cumulativeCapacity: 17020, // MW as per latest data
    livePowerGeneration: 0
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate real-time variations
      const baseWorkingPercent = 94.5;
      const variation = (Math.sin(Date.now() / 60000) * 2); // ±2% variation over time
      const workingPercent = baseWorkingPercent + variation;
      
      const workingInstallations = Math.floor(realTimeData.totalInstallations * (workingPercent / 100));
      const nonWorkingInstallations = realTimeData.totalInstallations - workingInstallations;
      
      // Simulate generation based on time of day (higher during day)
      const hour = new Date().getHours();
      const dayGenerationFactor = Math.max(0, Math.sin((hour - 6) * Math.PI / 12));
      const todayGeneration = Math.floor(12000 + (dayGenerationFactor * 8000)); // MWh
      
      const livePowerGeneration = Math.floor(dayGenerationFactor * realTimeData.cumulativeCapacity * 0.75);
      
      setRealTimeData(prev => ({
        ...prev,
        workingInstallations,
        nonWorkingInstallations,
        todayGeneration,
        livePowerGeneration
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [realTimeData.totalInstallations, realTimeData.cumulativeCapacity]);

  // Filter data based on selections
  const getFilteredData = () => {
    if (selectedState === 'all') return stateWiseData;
    
    const stateData = stateWiseData[selectedState as keyof typeof stateWiseData];
    return stateData ? { [selectedState]: stateData } : {};
  };

  const filteredStateData = getFilteredData();
  const selectedStateData = selectedState !== 'all' ? stateWiseData[selectedState as keyof typeof stateWiseData] : null;

  // Calculate KPI progress colors
  const getKPIColor = (actual: number, target: number) => {
    const percentage = (actual / target) * 100;
    if (percentage >= 80) return "#22c55e"; // Green
    if (percentage >= 50) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  // Generate chart data
  const statePerformanceData = Object.entries(filteredStateData).map(([state, data]) => ({
    state: state.length > 8 ? state.substring(0, 8) + '..' : state,
    capacity: data.capacity,
    installations: Math.floor(data.installations / 1000),
    workingPercent: data.workingPercent,
    surplus: data.surplusExported
  }));

  const performanceTimeData = [
    { time: '06:00', generation: 1200, target: 1000 },
    { time: '08:00', generation: 4500, target: 4000 },
    { time: '10:00', generation: 8900, target: 8500 },
    { time: '12:00', generation: 12500, target: 12000 },
    { time: '14:00', generation: 11800, target: 11500 },
    { time: '16:00', generation: 8200, target: 8000 },
    { time: '18:00', generation: 3400, target: 3500 },
    { time: '20:00', generation: 800, target: 1000 }
  ];

  const indianStates = [
    { value: 'all', label: 'All India' },
    ...Object.keys(stateWiseData).map(state => ({ value: state, label: state }))
  ];

  const majorCities = selectedState !== 'all' && selectedStateData 
    ? [{ value: 'all', label: 'All Cities' }, ...selectedStateData.cities.map(city => ({ value: city.toLowerCase(), label: city }))]
    : [{ value: 'all', label: 'All Cities' }, ...cityAcceleratorCities.map(city => ({ value: city.name.toLowerCase(), label: city.name }))];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 space-y-6">
      {/* Header with Real-time Status */}
      <div className="bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-2">
              MNRE National RTS Dashboard
            </h1>
            <div className="flex items-center space-x-4 text-slate-300">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span>Live Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{currentTime.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">AI Advisory Panel</h2>
          <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm">Live Insights</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiAdvisoryInsights.map((insight, index) => (
            <div key={index} className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${insight.type === 'critical' ? 'bg-red-500/20 text-red-400' : 
                  insight.type === 'optimization' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
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

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <EnhancedKPICard
          title="Total Installations"
          value={realTimeData.totalInstallations.toLocaleString()}
          trend="up"
          trendValue="+70K this month"
          icon={<Users className="w-6 h-6" />}
          color="#06b6d4"
          details={{
            description: "Total rooftop solar installations across India",
            target: "1 Crore by 2027",
            progress: (realTimeData.totalInstallations / nationalKPITargets.targetHouseholds) * 100
          }}
        />
        
        <EnhancedKPICard
          title="Working Systems"
          value={realTimeData.workingInstallations.toLocaleString()}
          unit={`${((realTimeData.workingInstallations/realTimeData.totalInstallations)*100).toFixed(1)}%`}
          trend="stable"
          trendValue="Operational efficiency"
          icon={<CheckCircle className="w-6 h-6" />}
          color="#10b981"
          details={{
            description: "Currently operational solar installations",
            target: ">95% operational",
            progress: (realTimeData.workingInstallations/realTimeData.totalInstallations)*100
          }}
        />
        
        <EnhancedKPICard
          title="Non-Working"
          value={realTimeData.nonWorkingInstallations.toLocaleString()}
          trend="down"
          trendValue="-5% this week"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="#ef4444"
          details={{
            description: "Systems requiring maintenance or repair",
            target: "<5% downtime",
            progress: 100 - ((realTimeData.nonWorkingInstallations/realTimeData.totalInstallations)*100)
          }}
        />

        <EnhancedKPICard
          title="Installed Capacity"
          value={realTimeData.cumulativeCapacity.toFixed(1)}
          unit="MW"
          trend="up"
          trendValue={`${((realTimeData.cumulativeCapacity/nationalKPITargets.totalCapacity)*100).toFixed(1)}% of target`}
          icon={<Battery className="w-6 h-6" />}
          color={getKPIColor(realTimeData.cumulativeCapacity, nationalKPITargets.totalCapacity)}
          details={{
            description: "Total commissioned rooftop solar capacity",
            target: "40,000 MW by 2026",
            progress: (realTimeData.cumulativeCapacity/nationalKPITargets.totalCapacity)*100
          }}
        />

        <EnhancedKPICard
          title="Today's Generation"
          value={realTimeData.todayGeneration.toLocaleString()}
          unit="MWh"
          trend="up"
          trendValue="Peak at 12:30 PM"
          icon={<Zap className="w-6 h-6" />}
          color="#f59e0b"
          details={{
            description: "Daily energy generation from all RTS systems",
            target: "Weather dependent",
            progress: 85
          }}
        />

        <EnhancedKPICard
          title="Live Generation"
          value={realTimeData.livePowerGeneration.toLocaleString()}
          unit="MW"
          trend="up"
          trendValue="Real-time power"
          icon={<Activity className="w-6 h-6" />}
          color="#8b5cf6"
          details={{
            description: "Current power generation from all systems",
            target: "Varies by time",
            progress: (realTimeData.livePowerGeneration / (realTimeData.cumulativeCapacity * 0.8)) * 100
          }}
        />
      </div>

      {/* National Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sector Progress */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Sector Progress (2026 Targets)
          </h3>
          <div className="space-y-4">
            {sectorProgress.map((sector, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 text-sm">{sector.sector}</span>
                  <span className="text-white font-semibold">{sector.capacity} / {sector.target} MW</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.min(100, sector.percentage)}%`,
                      backgroundColor: sector.color
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{sector.percentage.toFixed(1)}% complete</span>
                  <span className={sector.percentage >= 80 ? 'text-green-400' : sector.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                    {sector.percentage >= 80 ? 'On Track' : sector.percentage >= 50 ? 'Needs Attention' : 'Behind Target'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Size Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Size Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={systemSizeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="percentage"
              >
                {systemSizeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {systemSizeDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-300 text-sm">{item.category}</span>
                </div>
                <span className="text-white text-sm">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* City Accelerator Program Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            City Accelerator (Phase 1)
          </h3>
          <div className="space-y-3">
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-blue-400">30 Cities</div>
              <div className="text-slate-400 text-sm">Across 10 States</div>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cityAcceleratorCities.slice(0, 6).map((city, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{city.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white">{city.installations.toLocaleString()}</span>
                    <div className={`w-2 h-2 rounded-full ${city.workingPercent > 95 ? 'bg-green-400' : city.workingPercent > 90 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-700">
              Expanding to 100 cities in Phase 2
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Generation Trend */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Generation Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
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
                fill="url(#colorGeneration)" 
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#10b981" 
                strokeDasharray="5 5"
              />
              <defs>
                <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* State Performance Comparison */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {selectedState !== 'all' ? `${selectedState} Performance` : 'Top Performing States'}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statePerformanceData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="state" stroke="#94a3b8" fontSize={10} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
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

      {/* Surplus Energy Export */}
      {selectedState !== 'all' && selectedStateData && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{selectedState} Detailed Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{selectedStateData.capacity} MW</div>
              <div className="text-slate-400 text-sm">Installed Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{selectedStateData.installations.toLocaleString()}</div>
              <div className="text-slate-400 text-sm">Total Installations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{selectedStateData.surplusExported} MU</div>
              <div className="text-slate-400 text-sm">Surplus Exported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{selectedStateData.workingPercent}%</div>
              <div className="text-slate-400 text-sm">System Availability</div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Status */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-xl p-4">
        <div className="flex justify-between items-center text-sm text-slate-400">
          <div>Last Updated: {currentTime.toLocaleTimeString()}</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time Data Active</span>
            </div>
            <div>Data Source: MNRE, DISCOMs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
