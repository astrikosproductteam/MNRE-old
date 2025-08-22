import React from 'react';
import { 
  Layers, Search, Filter, Settings, MapPin, Zap, Battery, AlertTriangle, Wrench, Shield, Cloud,
  Satellite, Navigation, Ruler, Download, Share2, RefreshCw, Target, Crosshair, Map,
  BarChart3, TrendingUp, Activity, Eye, Maximize2, Minimize2
} from 'lucide-react';
import { LayerConfig } from '../types';

interface MapControlsProps {
  layers: LayerConfig[];
  onLayerToggle: (layerId: string) => void;
  onLayerOpacityChange: (layerId: string, opacity: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  onMapAction?: (action: string) => void;
}

const layerIcons = {
  assets: MapPin,
  boundaries: Layers,
  heatmap: Zap,
  choropleth: Battery,
  workorders: Wrench,
  alerts: AlertTriangle,
  risk_zones: Shield,
  weather: Cloud
};

const metrics = [
  { id: 'power', label: 'Power Output (kW)', color: '#22c55e' },
  { id: 'pr', label: 'Performance Ratio', color: '#3b82f6' },
  { id: 'availability', label: 'Availability %', color: '#f59e0b' },
  { id: 'temperature', label: 'Temperature (°C)', color: '#ef4444' }
];

const mapActions = [
  { id: 'refresh', label: 'Refresh Data', icon: RefreshCw, color: 'text-blue-400' },
  { id: 'center_india', label: 'Center on India', icon: Target, color: 'text-green-400' },
  { id: 'measure_distance', label: 'Measure Distance', icon: Ruler, color: 'text-yellow-400' },
  { id: 'satellite_view', label: 'Satellite View', icon: Satellite, color: 'text-purple-400' },
  { id: 'fullscreen', label: 'Fullscreen', icon: Maximize2, color: 'text-cyan-400' },
  { id: 'export_view', label: 'Export View', icon: Download, color: 'text-orange-400' }
];

export default function MapControls({
  layers,
  onLayerToggle,
  onLayerOpacityChange,
  searchQuery,
  onSearchChange,
  selectedMetric,
  onMetricChange,
  onMapAction = () => {}
}: MapControlsProps) {
  return (
    <div className="absolute top-4 left-4 glass-morphism p-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto shadow-2xl">
      {/* Search */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white mb-2 flex items-center">
          <Search className="w-4 h-4 mr-2 text-blue-400" />
          Search & Filter
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search sites, assets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400"
          />
        </div>
      </div>

      {/* Metric Selection */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white mb-2 flex items-center">
          <Filter className="w-4 h-4 mr-2 text-blue-400" />
          Visualization Metric
        </h3>
        <select
          value={selectedMetric}
          onChange={(e) => onMetricChange(e.target.value)}
          className="w-full p-2 bg-slate-800 border border-slate-600 text-white rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {metrics.map(metric => (
            <option key={metric.id} value={metric.id}>
              {metric.label}
            </option>
          ))}
        </select>
      </div>

      {/* MNRE RTS Actions */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white mb-2 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-blue-400" />
          RTS Operations
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {mapActions.map(action => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onMapAction(action.id)}
                className={`flex items-center space-x-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors text-xs ${action.color}`}
                title={action.label}
              >
                <IconComponent className="w-4 h-4" />
                <span className="truncate">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-4 p-3 bg-slate-800/30 rounded-lg">
        <h3 className="text-sm font-medium text-white mb-2">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-400">Total Assets</div>
            <div className="text-white font-bold text-lg">7</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-400">Online</div>
            <div className="text-green-400 font-bold text-lg">4</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-400">Alerts</div>
            <div className="text-red-400 font-bold text-lg">4</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-400">Work Orders</div>
            <div className="text-yellow-400 font-bold text-lg">3</div>
          </div>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white mb-2 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-blue-400" />
          Map Layers
        </h3>
        <div className="space-y-3">
          {layers.map(layer => {
            const IconComponent = layerIcons[layer.type as keyof typeof layerIcons] || Layers;
            return (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layer.visible}
                      onChange={() => onLayerToggle(layer.id)}
                      className="rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500"
                    />
                    <IconComponent className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-white">{layer.name}</span>
                  </label>
                </div>
                {layer.visible && (
                  <div className="ml-6">
                    <label className="text-xs text-slate-400">Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={layer.opacity}
                      onChange={(e) => onLayerOpacityChange(layer.id, parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-slate-700/50 pt-4">
        <h3 className="text-sm font-medium text-white mb-2">Status Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
            <span className="text-slate-300">Online</span>
            <span className="text-slate-500 ml-auto">Normal Operation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
            <span className="text-slate-300">Degraded</span>
            <span className="text-slate-500 ml-auto">Performance Issues</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
            <span className="text-slate-300">Offline</span>
            <span className="text-slate-500 ml-auto">No Communication</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500 shadow-sm"></div>
            <span className="text-slate-300">Maintenance</span>
            <span className="text-slate-500 ml-auto">Scheduled Work</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></div>
            <span className="text-slate-300">Tamper</span>
            <span className="text-slate-500 ml-auto">Security Alert</span>
          </div>
        </div>
      </div>

      {/* Alert Priority Legend */}
      <div className="border-t border-slate-700/50 pt-4 mt-4">
        <h3 className="text-sm font-medium text-white mb-2">Alert Priority</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm animate-pulse"></div>
            <span className="text-slate-300">Critical</span>
            <span className="text-slate-500 ml-auto">Immediate Action</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
            <span className="text-slate-300">High</span>
            <span className="text-slate-500 ml-auto">Urgent</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
            <span className="text-slate-300">Medium</span>
            <span className="text-slate-500 ml-auto">Monitor</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
            <span className="text-slate-300">Low</span>
            <span className="text-slate-500 ml-auto">Informational</span>
          </div>
        </div>
      </div>
    </div>
  );
}