import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Battery, AlertTriangle, CheckCircle } from 'lucide-react';
import { KPIData, Asset, WorkOrder } from '../types';

interface KPIDashboardProps {
  kpiData: KPIData[];
  assets: Asset[];
  workOrders: WorkOrder[];
}

export default function KPIDashboard({ kpiData, assets, workOrders }: KPIDashboardProps) {
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
    <div className="w-full h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">MNRE National RTS Dashboard</h2>
        <p className="text-slate-400">Real-time monitoring and analytics for renewable energy systems</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Online Assets</p>
              <p className="text-2xl font-bold">{onlineAssets}/{assets.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-cyan-200" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-cyan-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(onlineAssets / assets.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Capacity</p>
              <p className="text-2xl font-bold">{totalCapacity.toFixed(1)} kW</p>
            </div>
            <Zap className="w-8 h-8 text-blue-200" />
          </div>
          <p className="text-blue-100 text-xs mt-1">Across {assets.length} installations</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Generation Today</p>
              <p className="text-2xl font-bold">{totalGeneration.toFixed(0)} kWh</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
          <p className="text-green-100 text-xs mt-1">₹{(totalGeneration * 4.5).toLocaleString()} revenue</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Critical Issues</p>
              <p className="text-2xl font-bold">{criticalAlerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-200" />
          </div>
          <p className="text-red-100 text-xs mt-1">{activeWorkOrders} active work orders</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Performance Ratio</p>
              <p className="text-2xl font-bold">{(avgPR * 100).toFixed(1)}%</p>
            </div>
            <Battery className="w-8 h-8 text-purple-200" />
          </div>
          <p className="text-purple-100 text-xs mt-1">Target: 85%</p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">System Availability</h3>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{avgAvailability.toFixed(1)}%</div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${avgAvailability}%` }}
            ></div>
          </div>
          <p className="text-slate-400 text-xs mt-1">Last 30 days average</p>
        </div>

        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">CO₂ Impact</h3>
              <div className="text-2xl font-bold text-teal-400">{totalCO2Avoided.toFixed(1)} tons</div>
              <p className="text-slate-400 text-xs">Carbon avoided today</p>
            </div>
            <TrendingDown className="w-8 h-8 text-teal-400" />
          </div>
        </div>

        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Revenue Impact</h3>
              <div className="text-2xl font-bold text-yellow-400">₹{(totalGeneration * 4.5 / 1000).toFixed(1)}K</div>
              <p className="text-slate-400 text-xs">Today's generation value</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Asset Status Distribution */}
        <div className="glass-morphism p-6">
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
        <div className="glass-morphism p-6">
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
      <div className="glass-morphism p-6">
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