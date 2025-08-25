import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Battery, AlertTriangle, CheckCircle } from 'lucide-react';
import { KPIData, Asset, WorkOrder } from '../types';
import EnhancedKPICard from './EnhancedKPICard';
import FilterDropdown from './FilterDropdown';
import { indianStates, majorCities, realisticKPIDetails, stateWisePerformance } from '../data/enhancedMockData';
import { useState } from 'react';

interface KPIDashboardProps {
  kpiData: KPIData[];
  assets: Asset[];
  workOrders: WorkOrder[];
}

export default function KPIDashboard({ kpiData, assets, workOrders }: KPIDashboardProps) {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  // Real-time metrics calculation
  const onlineAssets = assets.filter(a => a.status === 'online').length;
  const criticalAlerts = assets.filter(a => a.status === 'tamper' || a.status === 'offline').length;
  const activeWorkOrders = workOrders.filter(wo => wo.status === 'open' || wo.status === 'in_progress').length;
  
  // Calculate aggregate metrics
  const totalCapacity = assets.reduce((sum, asset) => sum + asset.kW, 0);
  const totalGeneration = kpiData.reduce((sum, kpi) => sum + kpi.yield_kwh, 0);
  const avgPR = kpiData.length > 0 ? kpiData.reduce((sum, kpi) => sum + kpi.pr, 0) / kpiData.length : 0;
  const avgAvailability = kpiData.length > 0 ? kpiData.reduce((sum, kpi) => sum + kpi.availability_pct, 0) / kpiData.length : 0;
  const totalCO2Avoided = kpiData.reduce((sum, kpi) => sum + kpi.co2_avoided_tons, 0);

  // Status distribution
  const statusCounts = assets.reduce((acc, asset) => {
    acc[asset.status] = (acc[asset.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: {
      online: '#22c55e',
      degraded: '#f59e0b',
      offline: '#ef4444',
      maintenance: '#6b7280',
      tamper: '#8b5cf6'
    }[status] || '#6b7280'
  }));

  // Work order priority distribution
  const woPriorityCounts = workOrders.reduce((acc: Record<string, number>, wo) => {
    acc[wo.priority] = (acc[wo.priority] || 0) + 1;
    return acc;
  }, {});

  const woData = Object.entries(woPriorityCounts).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
    color: {
      critical: '#dc2626',
      high: '#ea580c',
      medium: '#d97706',
      low: '#65a30d'
    }[priority] || '#6b7280'
  }));

  // Performance by state (mock data based on site_id prefixes)
  const statePerformance = kpiData.reduce((acc, kpi) => {
    const state = kpi.site_id.split('-')[1] || 'Unknown';
    if (!acc[state]) {
      acc[state] = { state, totalYield: 0, avgPR: 0, count: 0 };
    }
    acc[state].totalYield += kpi.yield_kwh;
    acc[state].avgPR += kpi.pr;
    acc[state].count += 1;
    return acc;
  }, {} as Record<string, any>);

  const stateData = Object.values(statePerformance).map((data: any) => ({
    state: data.state,
    yield: Math.round(data.totalYield),
    pr: data.count > 0 ? Math.round((data.avgPR / data.count) * 100) : 0
  }));

  return (
    <div className="w-full h-full space-y-0">
      {/* Header with Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 glow-text">MNRE National RTS Dashboard</h2>
            <p className="text-slate-400">Real-time monitoring and analytics for renewable energy systems</p>
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
              options={majorCities[selectedState as keyof typeof majorCities] || majorCities.all}
              value={selectedCity}
              onChange={setSelectedCity}
            />
          </div>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 mb-0">
        <EnhancedKPICard
          title="Online Assets"
          value={`${onlineAssets}/${assets.length}`}
          trend="up"
          trendValue="+2.3% vs last week"
          icon={<CheckCircle className="w-6 h-6" />}
          color="#06b6d4"
          details={realisticKPIDetails.onlineAssets}
        />
        
        <EnhancedKPICard
          title="Total Capacity"
          value={totalCapacity.toFixed(1)}
          unit="MW"
          trend="up"
          trendValue="+5.7% this month"
          icon={<Zap className="w-6 h-6" />}
          color="#3b82f6"
          details={realisticKPIDetails.totalCapacity}
        />
        
        <EnhancedKPICard
          title="Generation Today"
          value={(totalGeneration / 1000).toFixed(1)}
          unit="MWh"
          trend="up"
          trendValue="+8.2% vs yesterday"
          icon={<TrendingUp className="w-6 h-6" />}
          color="#10b981"
          details={realisticKPIDetails.generation}
        />
        
        <EnhancedKPICard
          title="Critical Issues"
          value={criticalAlerts}
          trend="down"
          trendValue="-15% this week"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="#ef4444"
          details={realisticKPIDetails.criticalIssues}
        />

        <EnhancedKPICard
          title="Performance Ratio"
          value={(avgPR * 100).toFixed(1)}
          unit="%"
          trend="stable"
          trendValue="Target: 85%"
          icon={<Battery className="w-6 h-6" />}
          color="#8b5cf6"
          details={realisticKPIDetails.performanceRatio}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-0 bg-gradient-to-r from-slate-900/50 to-slate-800/50 p-6 angular-gradient-1">
        <div className="glass-morphism p-4 interactive-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">System Availability</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{avgAvailability.toFixed(1)}%</div>
          <div className="w-full alien-progress h-3">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ width: `${avgAvailability}%` }}
            ></div>
          </div>
          <p className="text-slate-400 text-xs mt-1">Last 30 days average</p>
        </div>

        <div className="glass-morphism p-4 interactive-card angular-gradient-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">CO₂ Impact</h3>
              <div className="text-2xl font-bold text-teal-400 glow-text">{totalCO2Avoided.toFixed(1)} tons</div>
              <p className="text-slate-400 text-xs">Carbon avoided today</p>
            </div>
            <TrendingDown className="w-8 h-8 text-teal-400" />
          </div>
        </div>

        <div className="glass-morphism p-4 interactive-card angular-gradient-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Revenue Impact</h3>
              <div className="text-2xl font-bold text-yellow-400 glow-text">₹{(totalGeneration * 4.5 / 1000).toFixed(1)}K</div>
              <p className="text-slate-400 text-xs">Today's generation value</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* State Performance Summary */}
      {selectedState !== 'all' && stateWisePerformance[selectedState as keyof typeof stateWisePerformance] && (
        <div className="glass-morphism p-6 mb-0 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4 glow-text">
            {indianStates.find(s => s.value === selectedState)?.label} Performance Summary
          </h3>
          {/* Add state-specific performance data here */}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-0 bg-gradient-to-br from-slate-900/30 to-slate-800/30 p-6">
        {/* Asset Status Distribution */}
        <div className="glass-morphism p-6 interactive-card chart-glow">
          <h3 className="text-lg font-semibold text-white mb-4">Asset Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-sm">
            {statusData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1 text-slate-300">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Work Order Priority */}
        <div className="glass-morphism p-6 interactive-card chart-glow angular-gradient-1">
          <h3 className="text-lg font-semibold text-white mb-4">Work Order Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={woData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {woData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-sm">
            {woData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1 text-slate-300">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span>{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Performance */}
      <div className="glass-morphism p-6 interactive-card chart-glow angular-gradient-2">
        <h3 className="text-lg font-semibold text-white mb-4">Performance by State</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="state" stroke="#94a3b8" fontSize={12} />
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
            <Bar yAxisId="left" dataKey="yield" fill="#3b82f6" name="Yield (kWh)" />
            <Bar yAxisId="right" dataKey="pr" fill="#10b981" name="Performance Ratio (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}