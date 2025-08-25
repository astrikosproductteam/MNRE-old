import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, AlertTriangle, Users, TrendingUp, TrendingDown, 
  Battery, Thermometer, Shield, DollarSign, Target, Clock, Eye, BarChart3,
  MapPin, Download, Share2, RefreshCw, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { KPIData, Asset, WorkOrder } from '../types';
import EnhancedKPICard from './EnhancedKPICard';
import FilterDropdown from './FilterDropdown';
import Modal from './Modal';
import { indianStates, majorCities, realisticKPIDetails, stateWisePerformance } from '../data/enhancedMockData';

interface KPIDashboardProps {
  kpiData: KPIData[];
  assets: Asset[];
  workOrders: WorkOrder[];
}

// Mock data generators
const generatePerformanceData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const solarFactor = Math.max(0, Math.sin((i - 6) * Math.PI / 12));
    data.push({
      hour: `${i.toString().padStart(2, '0')}:00`,
      generation: Math.round(solarFactor * 1200 + Math.random() * 200),
      consumption: Math.round(400 + Math.random() * 300 + (i >= 18 || i <= 6 ? 200 : 0)),
      gridExport: Math.round(Math.max(0, solarFactor * 800 - 300 + Math.random() * 100)),
      temperature: Math.round(25 + solarFactor * 20 + Math.random() * 5),
      efficiency: Math.round((85 + Math.random() * 10) * 100) / 100
    });
  }
  return data;
};

const statePerformanceData = [
  { 
    state: 'Rajasthan', 
    code: 'RJ',
    capacity: 22891, 
    generation: 56234, 
    pr: 88.1,
    availability: 96.8,
    sites: 4123,
    revenue: 284.5,
    carbonOffset: 44987
  },
  { 
    state: 'Gujarat', 
    code: 'GJ',
    capacity: 16543, 
    generation: 38967, 
    pr: 86.4,
    availability: 94.5,
    sites: 3456,
    revenue: 197.2,
    carbonOffset: 31174
  },
  { 
    state: 'Maharashtra', 
    code: 'MH',
    capacity: 18234, 
    generation: 41789, 
    pr: 79.3,
    availability: 92.1,
    sites: 3867,
    revenue: 211.8,
    carbonOffset: 33431
  },
  { 
    state: 'Karnataka', 
    code: 'KA',
    capacity: 12458, 
    generation: 28945, 
    pr: 84.7,
    availability: 95.2,
    sites: 2847,
    revenue: 146.8,
    carbonOffset: 23156
  },
  { 
    state: 'Tamil Nadu', 
    code: 'TN',
    capacity: 15672, 
    generation: 35234, 
    pr: 81.9,
    availability: 93.7,
    sites: 3124,
    revenue: 178.6,
    carbonOffset: 28187
  }
];

const alertDistribution = [
  { name: 'Communication Failure', value: 35, color: '#ef4444', description: 'Network connectivity issues' },
  { name: 'Performance Degradation', value: 28, color: '#f59e0b', description: 'Below expected output' },
  { name: 'Temperature Alerts', value: 22, color: '#f97316', description: 'Overheating conditions' },
  { name: 'Security Incidents', value: 15, color: '#8b5cf6', description: 'Unauthorized access attempts' }
];

const monthlyTrends = [
  { month: 'Jan 2024', generation: 125.4, availability: 94.2, pr: 82.1, alerts: 45 },
  { month: 'Feb 2024', generation: 134.7, availability: 95.1, pr: 83.8, alerts: 38 },
  { month: 'Mar 2024', generation: 156.2, availability: 96.8, pr: 85.2, alerts: 29 },
  { month: 'Apr 2024', generation: 178.9, availability: 97.2, pr: 86.1, alerts: 25 },
  { month: 'May 2024', generation: 189.5, availability: 96.4, pr: 84.9, alerts: 31 },
  { month: 'Jun 2024', generation: 167.8, availability: 95.7, pr: 83.6, alerts: 42 }
];

export default function KPIDashboard({ kpiData, assets, workOrders }: KPIDashboardProps) {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [performanceData] = useState(generatePerformanceData());
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [selectedStateDetails, setSelectedStateDetails] = useState<any>(null);
  
  // Calculate filtered KPI metrics based on selected filters
  const getFilteredData = () => {
    if (selectedState === 'all') {
      return { assets, kpiData, workOrders };
    }
    
    const stateCode = selectedState.toUpperCase();
    const filteredAssets = assets.filter(asset => 
      asset.site_id.includes(`-${stateCode}-`)
    );
    
    const filteredKPIData = kpiData.filter(kpi => 
      kpi.site_id.includes(`-${stateCode}-`)
    );
    
    const filteredWorkOrders = workOrders.filter(wo => 
      wo.site_id.includes(`-${stateCode}-`)
    );
    
    return { 
      assets: filteredAssets, 
      kpiData: filteredKPIData, 
      workOrders: filteredWorkOrders 
    };
  };

  const { assets: filteredAssets, kpiData: filteredKPIData, workOrders: filteredWorkOrders } = getFilteredData();
  
  // Calculate KPI metrics
  const onlineAssets = filteredAssets.filter(asset => asset.status === 'online').length;
  const totalCapacity = filteredAssets.reduce((sum, asset) => sum + asset.kW, 0);
  const totalGeneration = Math.round(filteredKPIData.reduce((sum, kpi) => sum + kpi.yield_kwh, 0) / 1000);
  const criticalIssues = filteredWorkOrders.filter(wo => wo.priority === 'critical').length;
  const avgPerformanceRatio = filteredKPIData.length > 0 
    ? (filteredKPIData.reduce((sum, kpi) => sum + kpi.pr, 0) / filteredKPIData.length) * 100 
    : 0;

  // Filter cities based on selected state
  const availableCities = selectedState === 'all' 
    ? [{ value: 'all', label: 'All Cities', count: 0 }]
    : majorCities[selectedState as keyof typeof majorCities] || [];

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity('all');
  };

  const handleStateClick = (stateData: any) => {
    setSelectedStateDetails(stateData);
    setSelectedModal('stateDetails');
  };

  const renderAlertModal = () => (
    <Modal
      isOpen={selectedModal === 'alerts'}
      onClose={() => setSelectedModal(null)}
      title="Alert Distribution Analysis"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Alert Categories</h4>
            {alertDistribution.map((alert, index) => (
              <div key={index} className="p-4 mb-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: alert.color }}
                    />
                    <span className="text-white font-medium">{alert.name}</span>
                  </div>
                  <span className="text-white font-bold text-lg">{alert.value}</span>
                </div>
                <p className="text-slate-400 text-sm">{alert.description}</p>
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Trend Analysis</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#f8fafc'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="alerts" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Modal>
  );

  const renderSystemHealthModal = () => (
    <Modal
      isOpen={selectedModal === 'systemHealth'}
      onClose={() => setSelectedModal(null)}
      title="System Health Monitoring"
      size="xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-xl border border-green-500/30">
            <h4 className="text-lg font-semibold text-green-400 mb-4">Communication Health</h4>
            <div className="text-3xl font-bold text-white mb-2">92.4%</div>
            <div className="text-green-300 text-sm mb-4">Excellent connectivity</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Online Assets:</span>
                <span className="text-white">8,547</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Last Check:</span>
                <span className="text-white">2 min ago</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-xl border border-blue-500/30">
            <h4 className="text-lg font-semibold text-blue-400 mb-4">Performance Index</h4>
            <div className="text-3xl font-bold text-white mb-2">87.6%</div>
            <div className="text-blue-300 text-sm mb-4">Above target</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Avg PR:</span>
                <span className="text-white">85.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Target PR:</span>
                <span className="text-white">82.0%</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-xl border border-purple-500/30">
            <h4 className="text-lg font-semibold text-purple-400 mb-4">Security Score</h4>
            <div className="text-3xl font-bold text-white mb-2">95.1%</div>
            <div className="text-purple-300 text-sm mb-4">Highly secure</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Threats Blocked:</span>
                <span className="text-white">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Last Scan:</span>
                <span className="text-white">15 min ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed metrics */}
        <div className="bg-slate-800/50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Detailed Health Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-md font-medium text-slate-300 mb-3">Network Status</h5>
              <div className="space-y-3">
                {[
                  { metric: 'Latency', value: '12ms', status: 'good' },
                  { metric: 'Packet Loss', value: '0.02%', status: 'excellent' },
                  { metric: 'Bandwidth Utilization', value: '45%', status: 'good' },
                  { metric: 'Connection Stability', value: '99.8%', status: 'excellent' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-400">{item.metric}:</span>
                    <span className={`font-medium ${
                      item.status === 'excellent' ? 'text-green-400' :
                      item.status === 'good' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-slate-300 mb-3">Performance Metrics</h5>
              <div className="space-y-3">
                {[
                  { metric: 'Generation Efficiency', value: '94.2%', status: 'excellent' },
                  { metric: 'Inverter Health', value: '96.8%', status: 'excellent' },
                  { metric: 'Module Degradation', value: '0.4%/year', status: 'good' },
                  { metric: 'System Availability', value: '99.1%', status: 'excellent' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-slate-400">{item.metric}:</span>
                    <span className={`font-medium ${
                      item.status === 'excellent' ? 'text-green-400' :
                      item.status === 'good' ? 'text-blue-400' : 'text-yellow-400'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  const renderStateDetailsModal = () => (
    <Modal
      isOpen={selectedModal === 'stateDetails' && selectedStateDetails}
      onClose={() => setSelectedModal(null)}
      title={`${selectedStateDetails?.state} - Detailed Performance Analysis`}
      size="xl"
    >
      {selectedStateDetails && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg border border-blue-500/30">
              <div className="text-2xl font-bold text-blue-400">{selectedStateDetails.capacity.toLocaleString()}</div>
              <div className="text-sm text-blue-300">MW Capacity</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{selectedStateDetails.generation.toLocaleString()}</div>
              <div className="text-sm text-green-300">GWh Generated</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">₹{selectedStateDetails.revenue}</div>
              <div className="text-sm text-purple-300">Revenue (Crores)</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-600/30 rounded-lg border border-cyan-500/30">
              <div className="text-2xl font-bold text-cyan-400">{selectedStateDetails.carbonOffset.toLocaleString()}</div>
              <div className="text-sm text-cyan-300">Tons CO₂ Offset</div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Performance Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-md font-medium text-slate-300 mb-3">Key Metrics</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Performance Ratio:</span>
                    <span className="text-white font-semibold">{selectedStateDetails.pr}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Availability:</span>
                    <span className="text-white font-semibold">{selectedStateDetails.availability}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total Sites:</span>
                    <span className="text-white font-semibold">{selectedStateDetails.sites.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Avg Site Size:</span>
                    <span className="text-white font-semibold">{(selectedStateDetails.capacity / selectedStateDetails.sites * 1000).toFixed(0)} kW</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-md font-medium text-slate-300 mb-3">Environmental Impact</h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">CO₂ Reduction:</span>
                    <span className="text-green-400 font-semibold">{selectedStateDetails.carbonOffset.toLocaleString()} tons</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Equivalent Cars:</span>
                    <span className="text-green-400 font-semibold">{Math.round(selectedStateDetails.carbonOffset / 4.6).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Trees Planted:</span>
                    <span className="text-green-400 font-semibold">{Math.round(selectedStateDetails.carbonOffset * 16).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Coal Avoided:</span>
                    <span className="text-green-400 font-semibold">{Math.round(selectedStateDetails.generation * 0.82).toLocaleString()} tons</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="space-y-0">
      {/* Header with Filters */}
      <div className="glass-morphism p-6 angular-gradient-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 glow-text flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
              Performance Dashboard
            </h2>
            <p className="text-slate-400">Real-time monitoring and analytics for renewable energy assets</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <FilterDropdown
              label="State"
              options={indianStates}
              value={selectedState}
              onChange={handleStateChange}
              icon={<MapPin className="w-4 h-4 text-cyan-400" />}
            />
            <FilterDropdown
              label="City"
              options={availableCities}
              value={selectedCity}
              onChange={setSelectedCity}
              icon={<Users className="w-4 h-4 text-purple-400" />}
            />
            <button className="btn-enhanced flex items-center space-x-2 px-4 py-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="btn-enhanced flex items-center space-x-2 px-4 py-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="glass-morphism p-6 angular-gradient-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <EnhancedKPICard
            title="Online Assets"
            value={filteredAssets.length > 0 ? ((onlineAssets / filteredAssets.length) * 100).toFixed(1) : '0.0'}
            unit="%"
            trend="up"
            trendValue="+2.3%"
            icon={<Activity className="w-6 h-6" style={{ color: '#22c55e' }} />}
            color="#22c55e"
            details={realisticKPIDetails.onlineAssets}
          />

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
      <div className="glass-morphism p-6 angular-gradient-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generation vs Consumption */}
          <div className="glass-morphism p-6 interactive-card chart-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center glow-text">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                24-Hour Generation Profile
              </h3>
              <button 
                onClick={() => setSelectedModal('generationProfile')}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors neon-glow"
              >
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

          {/* Monthly Trends */}
          <div className="glass-morphism p-6 interactive-card chart-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center glow-text">
                <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                Monthly Performance Trends
              </h3>
              <button 
                onClick={() => setSelectedModal('monthlyTrends')}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors neon-glow"
              >
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
                <Line type="monotone" dataKey="generation" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', strokeWidth: 2, r: 5 }} name="Generation (GWh)" />
                <Line type="monotone" dataKey="pr" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }} name="Performance Ratio (%)" />
                <Line type="monotone" dataKey="availability" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }} name="Availability (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="glass-morphism p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert Distribution */}
          <div className="glass-morphism p-6 interactive-card hover:shadow-2xl transition-all duration-300"
               onClick={() => setSelectedModal('alerts')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center glow-text">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                Alert Distribution
              </h3>
              <Eye className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
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
          <div className="glass-morphism p-6 interactive-card hover:shadow-2xl transition-all duration-300"
               onClick={() => setSelectedModal('systemHealth')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center glow-text">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                System Health
              </h3>
              <Eye className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/20 to-green-600/30 rounded-lg border border-green-500/30">
                <span className="text-slate-300">Communication Health</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden alien-progress">
                    <div className="w-[92%] h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                  </div>
                  <span className="text-green-400 font-semibold">92%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500/20 to-blue-600/30 rounded-lg border border-blue-500/30">
                <span className="text-slate-300">Performance Index</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden alien-progress">
                    <div className="w-[87%] h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-blue-400 font-semibold">87%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-purple-600/30 rounded-lg border border-purple-500/30">
                <span className="text-slate-300">Security Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden alien-progress">
                    <div className="w-[95%] h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-purple-400 font-semibold">95%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/30 rounded-lg border border-yellow-500/30">
                <span className="text-slate-300">Maintenance Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden alien-progress">
                    <div className="w-[78%] h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                  </div>
                  <span className="text-yellow-400 font-semibold">78%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="glass-morphism p-6 interactive-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center glow-text">
                <Target className="w-5 h-5 mr-2 text-cyan-400" />
                Key Metrics
              </h3>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors neon-glow">
                <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Average CUF</span>
                  <span className="text-white font-bold">23.4%</span>
                </div>
                <div className="text-xs text-slate-400">Capacity Utilization Factor</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full w-[23.4%] alien-progress"></div>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Grid Stability</span>
                  <span className="text-green-400 font-bold">96.8%</span>
                </div>
                <div className="text-xs text-slate-400">Network reliability score</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full w-[96.8%] alien-progress"></div>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Carbon Offset</span>
                  <span className="text-cyan-400 font-bold">1,248 tons</span>
                </div>
                <div className="text-xs text-slate-400">CO₂ emissions avoided</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full w-[85%] alien-progress"></div>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg border border-slate-600/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 text-sm">Revenue Impact</span>
                  <span className="text-purple-400 font-bold">₹2.4 Cr</span>
                </div>
                <div className="text-xs text-slate-400">Monthly revenue generated</div>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-[78%] alien-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed State Performance Table */}
      <div className="glass-morphism p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center glow-text">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            State-wise Detailed Performance
          </h3>
          <div className="flex space-x-3">
            <button className="btn-enhanced flex items-center space-x-2 px-4 py-2">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
            <button className="btn-enhanced flex items-center space-x-2 px-4 py-2">
              <Share2 className="w-4 h-4" />
              <span>Share Report</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-4 px-4 text-slate-300 font-medium">State</th>
                <th className="text-right py-4 px-4 text-slate-300 font-medium">Capacity (MW)</th>
                <th className="text-right py-4 px-4 text-slate-300 font-medium">Generation (GWh)</th>
                <th className="text-right py-4 px-4 text-slate-300 font-medium">PR (%)</th>
                <th className="text-right py-4 px-4 text-slate-300 font-medium">Availability (%)</th>
                <th className="text-right py-4 px-4 text-slate-300 font-medium">Sites</th>
                <th className="text-center py-4 px-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {statePerformanceData.map((state, index) => (
                <motion.tr
                  key={state.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer interactive-card"
                  onClick={() => handleStateClick(state)}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center neon-glow">
                        <span className="text-white font-semibold text-sm">{state.code}</span>
                      </div>
                      <span className="text-white font-medium">{state.state}</span>
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
                    <span className={`font-semibold ${
                      state.availability > 95 ? 'text-green-400' :
                      state.availability > 90 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {state.availability.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right py-4 px-4 text-white font-semibold">{state.sites.toLocaleString()}</td>
                  <td className="text-center py-4 px-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStateClick(state);
                      }}
                      className="btn-enhanced px-3 py-1 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {renderAlertModal()}
      {renderSystemHealthModal()}
      {renderStateDetailsModal()}
    </div>
  );
}