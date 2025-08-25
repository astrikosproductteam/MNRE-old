import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, AlertTriangle, Users, TrendingUp, TrendingDown, 
  Battery, Thermometer, Shield, DollarSign, Target, Clock, Eye, BarChart3,
  Leaf, Car, TreePine
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { KPIData, Asset, WorkOrder } from '../types';
import EnhancedKPICard from './EnhancedKPICard';
import FilterDropdown from './FilterDropdown';
import Modal from './Modal';
import { indianStates, majorCities, realisticKPIDetails } from '../data/enhancedMockData';

interface KPIDashboardProps {
  kpiData: KPIData[];
  assets: Asset[];
  workOrders: WorkOrder[];
}

const generatePerformanceData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: `${i}:00`,
      generation: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 1000 + Math.random() * 200),
      consumption: 300 + Math.random() * 400 + (i >= 18 || i <= 6 ? 200 : 0),
      gridExport: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * 800 - 300 + Math.random() * 100)
    });
  }
  return data;
};

const generateMonthlyTrends = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    generation: 15000 + Math.random() * 5000,
    performance: 80 + Math.random() * 15,
    availability: 90 + Math.random() * 8,
    carbonOffset: 800 + Math.random() * 300
  }));
};

const statePerformanceData = [
  { state: 'RJ', fullName: 'Rajasthan', capacity: 22891, generation: 56234, pr: 88.1, availability: 96.5, carbonOffset: 28.1, revenue: 234.5 },
  { state: 'GJ', fullName: 'Gujarat', capacity: 16543, generation: 38967, pr: 86.4, availability: 94.8, carbonOffset: 19.5, revenue: 162.8 },
  { state: 'KA', fullName: 'Karnataka', capacity: 12458, generation: 28945, pr: 84.7, availability: 97.2, carbonOffset: 14.5, revenue: 120.9 },
  { state: 'TN', fullName: 'Tamil Nadu', capacity: 15672, generation: 35234, pr: 81.9, availability: 95.1, carbonOffset: 17.6, revenue: 147.2 },
  { state: 'MH', fullName: 'Maharashtra', capacity: 18234, generation: 41789, pr: 79.3, availability: 93.7, carbonOffset: 20.9, revenue: 174.6 }
];

const alertDistribution = [
  { name: 'Communication', value: 35, color: '#ef4444', description: 'Network and connectivity issues' },
  { name: 'Performance', value: 28, color: '#f59e0b', description: 'Below expected generation alerts' },
  { name: 'Temperature', value: 22, color: '#f97316', description: 'Overheating and thermal issues' },
  { name: 'Security', value: 15, color: '#8b5cf6', description: 'Unauthorized access and tampering' }
];

const systemHealthMetrics = [
  { name: 'Communication Health', value: 92, color: '#22c55e', description: 'Device connectivity and data transmission' },
  { name: 'Performance Index', value: 87, color: '#3b82f6', description: 'Overall system efficiency rating' },
  { name: 'Security Score', value: 95, color: '#8b5cf6', description: 'Cybersecurity and physical security rating' },
  { name: 'Maintenance Status', value: 78, color: '#f59e0b', description: 'Preventive maintenance completion rate' }
];

const keyMetricsData = [
  { name: 'Average CUF', value: '23.4%', description: 'Capacity Utilization Factor', trend: '+2.1%' },
  { name: 'Grid Stability', value: '96.8%', description: 'Network reliability score', trend: '+1.3%' },
  { name: 'Carbon Offset', value: '1,248 tons', description: 'CO₂ emissions avoided', trend: '+8.7%' },
  { name: 'Revenue Impact', value: '₹2.4 Cr', description: 'Monthly revenue generated', trend: '+5.2%' }
];

export default function KPIDashboard({ kpiData, assets, workOrders }: KPIDashboardProps) {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [performanceData] = useState(generatePerformanceData());
  const [monthlyTrends] = useState(generateMonthlyTrends());
  
  // Modal states with proper z-index handling
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  
  // Calculate KPI metrics
  const onlineAssets = assets.filter(asset => asset.status === 'online').length;
  const totalCapacity = assets.reduce((sum, asset) => sum + asset.kW, 0);
  const totalGeneration = Math.round(kpiData.reduce((sum, kpi) => sum + kpi.yield_kwh, 0) / 1000); // Convert to MWh
  const criticalIssues = workOrders.filter(wo => wo.priority === 'critical').length;
  const avgPerformanceRatio = (kpiData.reduce((sum, kpi) => sum + kpi.pr, 0) / kpiData.length) * 100;

  // Filter cities based on selected state
  const availableCities = selectedState === 'all' 
    ? [{ value: 'all', label: 'All Cities', count: 0 }]
    : majorCities[selectedState as keyof typeof majorCities] || [];

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity('all'); // Reset city when state changes
  };

  // Modal handlers with proper z-index management
  const openModal = (modalType: string, data?: any) => {
    setActiveModal(modalType);
    setModalData(data);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalData(null);
  };

  // Click handlers for different components
  const handleAlertDistributionClick = () => {
    openModal('alertDistribution', {
      title: 'Alert Distribution Analysis',
      data: alertDistribution,
      totalAlerts: alertDistribution.reduce((sum, alert) => sum + alert.value, 0)
    });
  };

  const handleSystemHealthClick = () => {
    openModal('systemHealth', {
      title: 'System Health Monitoring',
      data: systemHealthMetrics,
      overallHealth: Math.round(systemHealthMetrics.reduce((sum, metric) => sum + metric.value, 0) / systemHealthMetrics.length)
    });
  };

  const handleStateRowClick = (state: any) => {
    openModal('stateDetails', {
      title: `${state.fullName} - Detailed Performance`,
      state: state,
      environmentalImpact: {
        carsOffRoad: Math.round(state.carbonOffset * 1000 / 4.6), // Average car CO2 per year
        treesPlanted: Math.round(state.carbonOffset * 1000 / 0.022), // CO2 absorbed per tree per year
        householdsPowered: Math.round(state.generation * 1000000 / 3000) // Average household consumption
      }
    });
  };

  const handleKeyMetricClick = (metric: any) => {
    openModal('keyMetric', {
      title: `${metric.name} - Detailed Analysis`,
      metric: metric,
      benchmarks: {
        current: metric.value,
        target: '98.5%',
        industry: '89.2%',
        best: '99.1%'
      }
    });
  };

  const renderAlertDistributionModal = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-morphism p-4 angular-gradient-1">
          <div className="text-2xl font-bold text-white">{modalData?.totalAlerts}</div>
          <div className="text-sm text-slate-400">Total Active Alerts</div>
        </div>
        <div className="glass-morphism p-4 angular-gradient-2">
          <div className="text-2xl font-bold text-red-400">{modalData?.data?.filter((a: any) => a.name === 'Communication')[0]?.value || 0}</div>
          <div className="text-sm text-slate-400">Critical Priority</div>
        </div>
      </div>
      
      <div className="space-y-4">
        {modalData?.data?.map((alert: any, index: number) => (
          <div key={index} className="p-4 bg-slate-800/50 rounded-lg border-l-4" style={{ borderColor: alert.color }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-white">{alert.name}</h4>
              <span className="text-2xl font-bold" style={{ color: alert.color }}>{alert.value}</span>
            </div>
            <p className="text-slate-300 text-sm">{alert.description}</p>
            <div className="mt-3 flex items-center space-x-4 text-xs text-slate-400">
              <span>Avg Resolution: 18 hrs</span>
              <span>SLA Compliance: 92%</span>
              <span>Trend: -12% from last month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemHealthModal = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">{modalData?.overallHealth}%</div>
        <div className="text-slate-400">Overall System Health</div>
        <div className="w-full bg-slate-700 rounded-full h-3 mt-4">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 alien-progress"
            style={{ width: `${modalData?.overallHealth}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modalData?.data?.map((metric: any, index: number) => (
          <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold text-white">{metric.name}</h4>
              <span className="text-xl font-bold" style={{ color: metric.color }}>{metric.value}%</span>
            </div>
            <p className="text-slate-300 text-sm mb-3">{metric.description}</p>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full alien-progress"
                style={{ 
                  width: `${metric.value}%`,
                  background: `linear-gradient(90deg, ${metric.color}, ${metric.color}CC)`
                }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStateDetailsModal = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-morphism p-4 angular-gradient-1">
          <div className="text-2xl font-bold text-white">{modalData?.state?.capacity?.toLocaleString()} MW</div>
          <div className="text-sm text-slate-400">Installed Capacity</div>
        </div>
        <div className="glass-morphism p-4 angular-gradient-2">
          <div className="text-2xl font-bold text-green-400">{modalData?.state?.generation?.toLocaleString()} GWh</div>
          <div className="text-sm text-slate-400">Annual Generation</div>
        </div>
        <div className="glass-morphism p-4 angular-gradient-3">
          <div className="text-2xl font-bold text-blue-400">₹{modalData?.state?.revenue} Cr</div>
          <div className="text-sm text-slate-400">Revenue Generated</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Performance Ratio</span>
              <span className="text-green-400 font-bold">{modalData?.state?.pr}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Availability</span>
              <span className="text-blue-400 font-bold">{modalData?.state?.availability}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">Carbon Offset</span>
              <span className="text-purple-400 font-bold">{modalData?.state?.carbonOffset} MT</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Environmental Impact</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Car className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-white font-semibold">{modalData?.environmentalImpact?.carsOffRoad?.toLocaleString()} cars</div>
                <div className="text-xs text-slate-400">Equivalent cars off road</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <TreePine className="w-6 h-6 text-green-400" />
              <div>
                <div className="text-white font-semibold">{modalData?.environmentalImpact?.treesPlanted?.toLocaleString()} trees</div>
                <div className="text-xs text-slate-400">Equivalent trees planted</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-white font-semibold">{modalData?.environmentalImpact?.householdsPowered?.toLocaleString()} homes</div>
                <div className="text-xs text-slate-400">Households powered annually</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKeyMetricModal = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-2">{modalData?.metric?.value}</div>
        <div className="text-slate-400">{modalData?.metric?.description}</div>
        <div className="text-green-400 font-semibold mt-2">{modalData?.metric?.trend} from last month</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-bold text-white">{modalData?.benchmarks?.current}</div>
          <div className="text-xs text-slate-400">Current</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-bold text-green-400">{modalData?.benchmarks?.target}</div>
          <div className="text-xs text-slate-400">Target</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-bold text-yellow-400">{modalData?.benchmarks?.industry}</div>
          <div className="text-xs text-slate-400">Industry Avg</div>
        </div>
        <div className="p-4 bg-slate-800/50 rounded-lg text-center">
          <div className="text-lg font-bold text-purple-400">{modalData?.benchmarks?.best}</div>
          <div className="text-xs text-slate-400">Best Practice</div>
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-3">Trend Analysis</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">30-day trend:</span>
            <span className="text-green-400">+2.1% improvement</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">90-day trend:</span>
            <span className="text-blue-400">+5.7% improvement</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">YoY trend:</span>
            <span className="text-purple-400">+12.3% improvement</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-0 relative">
      {/* Header with Filters */}
      <div className="flex items-center justify-between p-6 glass-morphism angular-gradient-1">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 glow-text">Performance Dashboard</h2>
          <p className="text-slate-400">Real-time monitoring and analytics for renewable energy assets</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <FilterDropdown
            label="State"
            options={indianStates}
            value={selectedState}
            onChange={handleStateChange}
            icon={<Target className="w-4 h-4 text-cyan-400" />}
          />
          <FilterDropdown
            label="City"
            options={availableCities}
            value={selectedCity}
            onChange={setSelectedCity}
            icon={<Users className="w-4 h-4 text-purple-400" />}
          />
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0">
        <div className="p-4">
          <EnhancedKPICard
            title="Online Assets"
            value={((onlineAssets / assets.length) * 100).toFixed(1)}
            unit="%"
            trend="up"
            trendValue="+2.3%"
            icon={<Activity className="w-6 h-6" style={{ color: '#22c55e' }} />}
            color="#22c55e"
            details={realisticKPIDetails.onlineAssets}
          />
        </div>

        <div className="p-4">
          <EnhancedKPICard
            title="Total Capacity"
            value={(totalCapacity / 1000).toFixed(1)}
            unit="MW"
            trend="up"
            trendValue="+8.7%"
            icon={<Zap className="w-6 h-6" style={{ color: '#3b82f6' }} />}
            color="#3b82f6"
            details={realisticKPIDetails.totalCapacity}
          />
        </div>

        <div className="p-4">
          <EnhancedKPICard
            title="Generation Today"
            value={totalGeneration.toLocaleString()}
            unit="MWh"
            trend="up"
            trendValue="+5.2%"
            icon={<Battery className="w-6 h-6" style={{ color: '#f59e0b' }} />}
            color="#f59e0b"
            details={realisticKPIDetails.generation}
          />
        </div>

        <div className="p-4">
          <EnhancedKPICard
            title="Critical Issues"
            value={criticalIssues.toString()}
            unit=""
            trend="down"
            trendValue="-12.5%"
            icon={<AlertTriangle className="w-6 h-6" style={{ color: '#ef4444' }} />}
            color="#ef4444"
            details={realisticKPIDetails.criticalIssues}
          />
        </div>

        <div className="p-4">
          <EnhancedKPICard
            title="Performance Ratio"
            value={avgPerformanceRatio.toFixed(1)}
            unit="%"
            trend="up"
            trendValue="+1.8%"
            icon={<Target className="w-6 h-6" style={{ color: '#8b5cf6' }} />}
            color="#8b5cf6"
            details={realisticKPIDetails.performanceRatio}
          />
        </div>
      </div>

      {/* Real-time Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Generation vs Consumption */}
        <div className="p-6 glass-morphism interactive-card angular-gradient-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center glow-text">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              24-Hour Generation Profile
            </h3>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }} 
              />
              <Legend />
              <Area type="monotone" dataKey="generation" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Generation (kW)" />
              <Area type="monotone" dataKey="consumption" stackId="2" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} name="Consumption (kW)" />
              <Area type="monotone" dataKey="gridExport" stackId="3" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Grid Export (kW)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance Trends */}
        <div className="p-6 glass-morphism interactive-card angular-gradient-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center glow-text">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Monthly Performance Trends
            </h3>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="generation" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }} name="Generation (MWh)" />
              <Line type="monotone" dataKey="performance" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }} name="Performance (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Alert Distribution */}
        <div 
          className="p-6 glass-morphism interactive-card angular-gradient-1 cursor-pointer hover:shadow-2xl transition-all duration-300"
          onClick={handleAlertDistributionClick}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center glow-text">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
              Alert Distribution
            </h3>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={alertDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {alertDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* System Health Metrics */}
        <div 
          className="p-6 glass-morphism interactive-card angular-gradient-2 cursor-pointer hover:shadow-2xl transition-all duration-300"
          onClick={handleSystemHealthClick}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center glow-text">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              System Health
            </h3>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          <div className="space-y-4">
            {systemHealthMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors">
                <span className="text-slate-300">{metric.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full alien-progress transition-all duration-1000"
                      style={{ 
                        width: `${metric.value}%`,
                        background: `linear-gradient(90deg, ${metric.color}, ${metric.color}CC)`
                      }}
                    />
                  </div>
                  <span className="font-semibold" style={{ color: metric.color }}>{metric.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="p-6 glass-morphism interactive-card angular-gradient-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center glow-text">
              <Target className="w-5 h-5 mr-2 text-cyan-400" />
              Key Metrics
            </h3>
            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>
          <div className="space-y-4">
            {keyMetricsData.map((metric, index) => (
              <div 
                key={index} 
                className="p-3 bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg"
                onClick={() => handleKeyMetricClick(metric)}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">{metric.name}</span>
                  <span className="text-white font-bold">{metric.value}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-slate-400">{metric.description}</div>
                  <div className="text-xs text-green-400 font-medium">{metric.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed State Performance Table */}
      <div className="p-6 glass-morphism interactive-card angular-gradient-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center glow-text">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            State-wise Detailed Performance
          </h3>
          <button className="btn-enhanced flex items-center space-x-2 px-4 py-2">
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-300 font-medium">State</th>
                <th className="text-right py-3 px-4 text-slate-300 font-medium">Capacity (MW)</th>
                <th className="text-right py-3 px-4 text-slate-300 font-medium">Generation (GWh)</th>
                <th className="text-right py-3 px-4 text-slate-300 font-medium">PR (%)</th>
                <th className="text-right py-3 px-4 text-slate-300 font-medium">Availability</th>
                <th className="text-right py-3 px-4 text-slate-300 font-medium">Revenue</th>
                <th className="text-center py-3 px-4 text-slate-300 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {statePerformanceData.map((state, index) => (
                <motion.tr
                  key={state.state}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer hover:shadow-lg"
                  onClick={() => handleStateRowClick(state)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{state.state}</span>
                      </div>
                      <span className="text-white font-medium">{state.fullName}</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 text-white font-semibold">{state.capacity.toLocaleString()}</td>
                  <td className="text-right py-4 px-4 text-white font-semibold">{state.generation.toLocaleString()}</td>
                  <td className="text-right py-4 px-4">
                    <span className={`font-semibold ${
                      state.pr > 85 ? 'text-green-400' :
                      state.pr > 80 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {state.pr.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full alien-progress"
                          style={{ width: `${state.availability}%` }}
                        />
                      </div>
                      <span className="text-green-400 font-semibold text-sm">{state.availability}%</span>
                    </div>
                  </td>
                  <td className="text-right py-4 px-4 text-green-400 font-semibold">₹{state.revenue} Cr</td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                      Active
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Render with Proper Z-Index */}
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={closeModal}
          title={modalData?.title || 'Details'}
          size="xl"
        >
          {activeModal === 'alertDistribution' && renderAlertDistributionModal()}
          {activeModal === 'systemHealth' && renderSystemHealthModal()}
          {activeModal === 'stateDetails' && renderStateDetailsModal()}
          {activeModal === 'keyMetric' && renderKeyMetricModal()}
        </Modal>
      )}
    </div>
  );
}