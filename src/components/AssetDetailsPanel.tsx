import React from 'react';
import { 
  X, MapPin, Zap, Thermometer, Battery, Clock, AlertTriangle, Wrench, Phone, Shield,
  Activity, TrendingUp, Calendar, DollarSign, Wifi, WifiOff, CheckCircle2, XCircle,
  Settings, Download, Share2, Eye, BarChart3
} from 'lucide-react';
import { Asset, WorkOrder, Alert } from '../types';
import { format } from 'date-fns';

interface AssetDetailsPanelProps {
  asset: Asset | null;
  workOrders: WorkOrder[];
  alerts: Alert[];
  onClose: () => void;
  onCreateWorkOrder: (siteId: string) => void;
  onDispatchCrew: (siteId: string) => void;
}

const statusColors = {
  online: 'text-green-400 bg-green-500/20 border-green-500/30',
  degraded: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
  offline: 'text-red-400 bg-red-500/20 border-red-500/30',
  maintenance: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
  tamper: 'text-purple-400 bg-purple-500/20 border-purple-500/30'
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online': return <CheckCircle2 className="w-4 h-4" />;
    case 'degraded': return <AlertTriangle className="w-4 h-4" />;
    case 'offline': return <XCircle className="w-4 h-4" />;
    case 'maintenance': return <Settings className="w-4 h-4" />;
    case 'tamper': return <Shield className="w-4 h-4" />;
    default: return <Activity className="w-4 h-4" />;
  }
};

const getPerformanceColor = (value: number, max: number) => {
  const percentage = (value / max) * 100;
  if (percentage >= 80) return 'text-green-400';
  if (percentage >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

export default function AssetDetailsPanel({
  asset,
  workOrders,
  alerts,
  onClose,
  onCreateWorkOrder,
  onDispatchCrew
}: AssetDetailsPanelProps) {
  if (!asset) return null;

  console.log('Rendering AssetDetailsPanel for:', asset.id);

  const relatedWorkOrders = workOrders.filter(wo => wo.site_id === asset.site_id);
  const relatedAlerts = alerts.filter(alert => alert.site_id === asset.site_id && !alert.acknowledged);

  // Calculate performance metrics
  const performanceRatio = asset.power_kw && asset.kW ? (asset.power_kw / asset.kW) * 100 : 0;
  const isOnline = asset.status === 'online';
  const lastCommTime = new Date(asset.last_comm_ts);
  const timeSinceLastComm = Date.now() - lastCommTime.getTime();
  const commStatus = timeSinceLastComm < 300000 ? 'Connected' : 'Delayed'; // 5 minutes

  return (
    <div className="absolute top-4 right-4 glass-morphism w-96 max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">{asset.id}</h2>
            </div>
            <p className="text-sm text-slate-300 mb-2">{asset.site_id}</p>
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <MapPin className="w-3 h-3" />
              <span>{asset.lat.toFixed(4)}, {asset.lon.toFixed(4)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-600/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>
        
        {/* Status Badge */}
        <div className="mt-4">
          <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium border ${statusColors[asset.status]}`}>
            {getStatusIcon(asset.status)}
            <span>{asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-slate-800/30">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className={`text-lg font-bold ${getPerformanceColor(asset.power_kw || 0, asset.kW)}`}>
              {performanceRatio.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400">Performance</div>
          </div>
          <div className="text-center p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              {isOnline ? <Wifi className="w-4 h-4 text-green-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
              <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                {commStatus}
              </span>
            </div>
            <div className="text-xs text-slate-400">Communication</div>
          </div>
        </div>
      </div>

      {/* Asset Information */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-blue-400" />
            Real-time Data
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center text-sm text-slate-400 mb-1">
                <Zap className="w-4 h-4 mr-2 text-green-400" />
                <span>Power Output</span>
              </div>
              <p className="text-lg font-bold text-white">
                {asset.power_kw?.toFixed(2) || '0.00'} kW
              </p>
              <p className="text-xs text-slate-500">of {asset.kW} kW capacity</p>
            </div>
            
            {asset.temp_c && (
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center text-sm text-slate-400 mb-1">
                  <Thermometer className="w-4 h-4 mr-2 text-orange-400" />
                  <span>Temperature</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {asset.temp_c.toFixed(1)}°C
                </p>
                <p className={`text-xs ${asset.temp_c > 60 ? 'text-red-400' : asset.temp_c > 45 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {asset.temp_c > 60 ? 'Critical' : asset.temp_c > 45 ? 'High' : 'Normal'}
                </p>
              </div>
            )}
            
            {asset.soc_pct !== undefined && (
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center text-sm text-slate-400 mb-1">
                  <Battery className="w-4 h-4 mr-2 text-blue-400" />
                  <span>Battery SoC</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {asset.soc_pct}%
                </p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${asset.soc_pct}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Asset Details */}
        <div className="border-t border-slate-700/50 pt-4">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Settings className="w-4 h-4 mr-2 text-slate-400" />
            Asset Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">OEM:</span>
              <span className="text-white font-medium">{asset.oem}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Type:</span>
              <span className="text-white capitalize">{asset.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Installed:</span>
              <span className="text-white">{format(new Date(asset.install_dt), 'MMM dd, yyyy')}</span>
            </div>
            {asset.efficiency_rating && (
              <div className="flex justify-between">
                <span className="text-slate-400">Efficiency:</span>
                <span className={`font-medium ${
                  asset.efficiency_rating === 'A+' ? 'text-green-400' :
                  asset.efficiency_rating === 'A' ? 'text-green-400' :
                  asset.efficiency_rating === 'B' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{asset.efficiency_rating}</span>
              </div>
            )}
            {asset.warranty_expiry && (
              <div className="flex justify-between">
                <span className="text-slate-400">Warranty:</span>
                <span className="text-white">{format(new Date(asset.warranty_expiry), 'MMM dd, yyyy')}</span>
              </div>
            )}
            {asset.elev_m && (
              <div className="flex justify-between">
                <span className="text-slate-400">Elevation:</span>
                <span className="text-white">{asset.elev_m}m</span>
              </div>
            )}
          </div>
        </div>

        {/* Communication Status */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center text-sm text-slate-400 mb-2">
            <Clock className="w-4 h-4 mr-2" />
            <span>Last Communication</span>
          </div>
          <p className="text-sm text-white mb-1">
            {format(lastCommTime, 'MMM dd, yyyy HH:mm:ss')}
          </p>
          <p className={`text-xs ${timeSinceLastComm < 300000 ? 'text-green-400' : 'text-yellow-400'}`}>
            {timeSinceLastComm < 60000 ? 'Just now' : 
             timeSinceLastComm < 300000 ? `${Math.floor(timeSinceLastComm / 60000)} min ago` :
             `${Math.floor(timeSinceLastComm / 60000)} min ago (delayed)`}
          </p>
        </div>

        {/* Risk Assessment */}
        {asset.risk_score !== undefined && (
          <div className="border-t border-slate-700/50 pt-4">
            <div className="flex items-center text-sm text-slate-400 mb-2">
              <Shield className="w-4 h-4 mr-2" />
              <span>Risk Assessment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    asset.risk_score > 0.7 ? 'bg-red-400' :
                    asset.risk_score > 0.5 ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`}
                  style={{ width: `${asset.risk_score * 100}%` }}
                ></div>
              </div>
              <span className={`text-sm font-medium ${
                asset.risk_score > 0.7 ? 'text-red-400' :
                asset.risk_score > 0.5 ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {(asset.risk_score * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {asset.risk_score > 0.7 ? 'High Risk - Immediate attention required' :
               asset.risk_score > 0.5 ? 'Medium Risk - Monitor closely' :
               'Low Risk - Normal operation'}
            </p>
          </div>
        )}

        {/* Maintenance Schedule */}
        {asset.maintenance_due && (
          <div className="border-t border-slate-700/50 pt-4">
            <div className="flex items-center text-sm text-slate-400 mb-2">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Next Maintenance</span>
            </div>
            <p className="text-sm text-white">
              {format(new Date(asset.maintenance_due), 'MMM dd, yyyy')}
            </p>
            <p className={`text-xs mt-1 ${
              new Date(asset.maintenance_due) < new Date() ? 'text-red-400' :
              new Date(asset.maintenance_due).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {new Date(asset.maintenance_due) < new Date() ? 'Overdue' :
               new Date(asset.maintenance_due).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 ? 'Due soon' :
               'Scheduled'}
            </p>
          </div>
        )}
      </div>

      {/* Active Alerts */}
      {relatedAlerts.length > 0 && (
        <div className="p-4 border-t border-slate-700/50 bg-red-500/5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
            Active Alerts ({relatedAlerts.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {relatedAlerts.map(alert => (
              <div key={alert.id} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-red-400">
                    {alert.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    alert.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                    alert.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-red-300 mb-2">{alert.message}</p>
                <p className="text-xs text-red-400">
                  {format(new Date(alert.timestamp), 'MMM dd, HH:mm')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Work Orders */}
      {relatedWorkOrders.length > 0 && (
        <div className="p-4 border-t border-slate-700/50 bg-blue-500/5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
            <Wrench className="w-4 h-4 mr-2 text-blue-400" />
            Work Orders ({relatedWorkOrders.length})
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {relatedWorkOrders.map(wo => (
              <div key={wo.wo_id} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-blue-400">{wo.wo_id}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    wo.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                    wo.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    wo.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {wo.priority}
                  </span>
                </div>
                <p className="text-xs text-blue-300 mb-2">{wo.issue}</p>
                <div className="flex justify-between text-xs text-blue-400">
                  <span>Status: {wo.status}</span>
                  <span>SLA: {wo.sla_hours}h</span>
                </div>
                {wo.assignee && (
                  <p className="text-xs text-blue-400 mt-1">Assigned: {wo.assignee}</p>
                )}
                {wo.estimated_cost && (
                  <div className="flex items-center mt-1">
                    <DollarSign className="w-3 h-3 mr-1 text-green-400" />
                    <span className="text-xs text-green-400">
                      Est. Cost: ₹{wo.estimated_cost.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onCreateWorkOrder(asset.site_id)}
            className="flex items-center justify-center px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm"
          >
            <Wrench className="w-4 h-4 mr-2" />
            Work Order
          </button>
          <button
            onClick={() => onDispatchCrew(asset.site_id)}
            className="flex items-center justify-center px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-sm"
          >
            <Phone className="w-4 h-4 mr-2" />
            Dispatch
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors text-sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button className="flex items-center justify-center px-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg transition-colors text-sm">
            <Eye className="w-4 h-4 mr-2" />
            Monitor
          </button>
        </div>
      </div>

      {/* Export Actions */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex space-x-2">
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
          <button className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors text-sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}