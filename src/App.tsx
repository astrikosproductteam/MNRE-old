import React, { useState, useEffect, useCallback } from 'react';
import { Satellite, BarChart3, Settings, Users, Bell, Shield, Lightbulb, Brain, Network } from 'lucide-react';
import GISMap from './components/GISMap';
import MapControls from './components/MapControls';
import AssetDetailsPanel from './components/AssetDetailsPanel';
import AlertsStream from './components/AlertsStream';
import KPIDashboard from './components/KPIDashboard';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import RecommendationsModule from './components/RecommendationsModule';
import RiskAssessmentModule from './components/RiskAssessmentModule';
import { 
  mockAssets, 
  mockWorkOrders, 
  mockAlerts, 
  mockKPIData, 
  mockRiskAssessments,
  mockRecommendations,
  mockForecastData,
  mockNetworkTopology,
  generateMockTelemetry
} from './data/mockData';
import { 
  Asset, WorkOrder, Alert, KPIData, MapViewState, LayerConfig,
  RiskAssessment, Recommendation
} from './types';

type ViewMode = 'map' | 'dashboard' | 'analytics' | 'recommendations' | 'risk' | 'settings' | 'users';

function App() {
  // State management
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [kpiData, setKpiData] = useState<KPIData[]>(mockKPIData);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>(mockRiskAssessments);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('power');
  const [mapViewState, setMapViewState] = useState<MapViewState>({
    longitude: 77.5946,
    latitude: 12.9716,
    zoom: 6,
    pitch: 0,
    bearing: 0
  });

  // Layer configuration
  const [layers, setLayers] = useState<LayerConfig[]>([
    { id: 'assets', name: 'RTS Assets', visible: true, opacity: 1.0, type: 'assets' },
    { id: 'boundaries', name: 'State Boundaries', visible: true, opacity: 0.7, type: 'boundaries' },
    { id: 'heatmap', name: 'Performance Heatmap', visible: false, opacity: 0.8, type: 'heatmap' },
    { id: 'workorders', name: 'Work Orders', visible: true, opacity: 1.0, type: 'workorders' },
    { id: 'alerts', name: 'Active Alerts', visible: true, opacity: 1.0, type: 'alerts' },
    { id: 'risk_zones', name: 'Risk Zones', visible: false, opacity: 0.6, type: 'risk_zones' },
    { id: 'weather', name: 'Weather Data', visible: false, opacity: 0.5, type: 'weather' }
  ]);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time telemetry updates
      const telemetryData = generateMockTelemetry();
      
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          const telemetry = telemetryData.find(t => t.device_id === asset.id);
          if (telemetry) {
            return {
              ...asset,
              power_kw: telemetry.p_kw,
              temp_c: telemetry.temp_c,
              last_comm_ts: telemetry.ts
            };
          }
          return asset;
        })
      );

      // Occasionally generate new alerts (simulation)
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const alertTypes = ['over_temp', 'fault', 'alarm'];
        const severities = ['high', 'medium', 'low'];
        
        const newAlert: Alert = {
          id: `ALT${Date.now()}`,
          site_id: randomAsset.site_id,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)] as any,
          severity: severities[Math.floor(Math.random() * severities.length)] as any,
          message: `Simulated alert for ${randomAsset.id}`,
          timestamp: new Date().toISOString(),
          lat: randomAsset.lat,
          lon: randomAsset.lon,
          acknowledged: false
        };

        setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [assets]);

  // Event handlers
  const handleLayerToggle = useCallback((layerId: string) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  }, []);

  const handleLayerOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayers(prevLayers =>
      prevLayers.map(layer =>
        layer.id === layerId ? { ...layer, opacity } : layer
      )
    );
  }, []);

  const handleAssetClick = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    console.log('Asset clicked:', asset.id, asset.site_id);
  }, []);

  const handleMapMove = useCallback((viewState: MapViewState) => {
    setMapViewState(viewState);
  }, []);

  const handleCreateWorkOrder = useCallback((siteId: string) => {
    const newWO: WorkOrder = {
      wo_id: `WO-2025-${String(workOrders.length + 1).padStart(3, '0')}`,
      site_id: siteId,
      issue: 'Manual work order created from map interface',
      priority: 'medium',
      status: 'open',
      sla_hours: 24,
      created_at: new Date().toISOString(),
      assignee: 'Available Team',
      lat: selectedAsset?.lat || 0,
      lon: selectedAsset?.lon || 0
    };

    setWorkOrders(prevWOs => [newWO, ...prevWOs]);
    alert(`Work Order ${newWO.wo_id} created successfully!`);
  }, [workOrders.length, selectedAsset]);

  const handleDispatchCrew = useCallback((siteId: string) => {
    alert(`Crew dispatch initiated for site ${siteId}. ETA calculation in progress...`);
  }, []);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  }, []);

  const handleDismissAlert = useCallback((alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
  }, []);

  const handleApproveRecommendation = useCallback((recId: string) => {
    setRecommendations(prevRecs =>
      prevRecs.map(rec =>
        rec.id === recId ? { ...rec, status: 'approved' } : rec
      )
    );
  }, []);

  const handleRejectRecommendation = useCallback((recId: string) => {
    setRecommendations(prevRecs =>
      prevRecs.map(rec =>
        rec.id === recId ? { ...rec, status: 'rejected' } : rec
      )
    );
  }, []);

  const handleImplementRecommendation = useCallback((recId: string) => {
    setRecommendations(prevRecs =>
      prevRecs.map(rec =>
        rec.id === recId ? { ...rec, status: 'in_progress' } : rec
      )
    );
  }, []);

  const handleMapAction = useCallback((action: string) => {
    switch (action) {
      case 'refresh':
        // Simulate data refresh
        const telemetryData = generateMockTelemetry();
        setAssets(prevAssets => 
          prevAssets.map(asset => {
            const telemetry = telemetryData.find(t => t.device_id === asset.id);
            if (telemetry) {
              return {
                ...asset,
                power_kw: telemetry.p_kw,
                temp_c: telemetry.temp_c,
                last_comm_ts: telemetry.ts
              };
            }
            return asset;
          })
        );
        alert('Data refreshed successfully!');
        break;
      case 'center_india':
        setMapViewState({
          longitude: 78.9629,
          latitude: 20.5937,
          zoom: 5,
          pitch: 0,
          bearing: 0
        });
        break;
      case 'measure_distance':
        alert('Distance measurement tool activated. Click on two points to measure distance.');
        break;
      case 'satellite_view':
        alert('Satellite view toggle - Feature coming soon!');
        break;
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
        break;
      case 'export_view':
        alert('Exporting current map view as PNG - Feature coming soon!');
        break;
      default:
        console.log('Unknown map action:', action);
    }
  }, []);

  // Filter assets based on search query
  const filteredAssets = assets.filter(asset =>
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.site_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.oem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unacknowledgedAlertsCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      {/* Header */}
        <header className="glass-morphism border-b border-blue-500/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <div className="relative">
                  <Satellite className="w-8 h-8 text-blue-400 animate-pulse-slow" />
                  <div className="absolute inset-0 w-8 h-8 text-cyan-400 animate-ping opacity-20">
                    <Satellite className="w-8 h-8" />
                  </div>
                </div>
              <div>
                  <h1 className="text-xl font-bold text-white text-glow">MNRE National RTS</h1>
                  <p className="text-sm text-cyan-400">AI Monitoring & Management Platform</p>
              </div>
            </div>
          </div>

            <nav className="flex items-center space-x-1">
            <button
              onClick={() => setViewMode('map')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'map' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Satellite className="w-4 h-4" />
              <span>GIS Map</span>
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'dashboard' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
                onClick={() => setViewMode('analytics')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'analytics' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Brain className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setViewMode('recommendations')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'recommendations' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                <span>Advisories</span>
              </button>
              <button
                onClick={() => setViewMode('risk')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  viewMode === 'risk' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Risk</span>
              </button>
              <button
              onClick={() => setViewMode('users')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'users' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setViewMode('settings')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'settings' 
                    ? 'bg-blue-600/30 text-blue-400 neon-glow' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
                <Bell className="w-6 h-6 text-slate-400 hover:text-white transition-colors cursor-pointer" />
              {unacknowledgedAlertsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unacknowledgedAlertsCount}
                </span>
              )}
            </div>
              <div className="text-sm text-slate-400">
                <p className="font-medium text-white">MNRE Admin</p>
                <p className="text-xs text-cyan-400">IST: {new Date().toLocaleTimeString('en-IN')}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {viewMode === 'map' && (
          <>
            <GISMap
              assets={filteredAssets}
              workOrders={workOrders}
              alerts={alerts}
              kpiData={kpiData}
                riskAssessments={riskAssessments}
              layers={layers}
              selectedMetric={selectedMetric}
              onAssetClick={handleAssetClick}
              onMapMove={handleMapMove}
            />
            
            <MapControls
              layers={layers}
              onLayerToggle={handleLayerToggle}
              onLayerOpacityChange={handleLayerOpacityChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedMetric={selectedMetric}
              onMetricChange={setSelectedMetric}
              onMapAction={handleMapAction}
            />

            {selectedAsset && (
              <AssetDetailsPanel
                asset={selectedAsset}
                workOrders={workOrders}
                alerts={alerts}
                onClose={() => setSelectedAsset(null)}
                onCreateWorkOrder={handleCreateWorkOrder}
                onDispatchCrew={handleDispatchCrew}
              />
            )}

            <AlertsStream
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
              onDismiss={handleDismissAlert}
            />
          </>
        )}

        {viewMode === 'dashboard' && (
            <div className="p-6">
              <KPIDashboard
                kpiData={kpiData}
                assets={assets}
                workOrders={workOrders}
              />
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="p-6">
              <AdvancedAnalytics
                kpiData={kpiData}
                assets={assets}
                forecastData={mockForecastData}
              />
            </div>
          )}

          {viewMode === 'recommendations' && (
            <div className="p-6">
              <RecommendationsModule
                recommendations={recommendations}
                onApprove={handleApproveRecommendation}
                onReject={handleRejectRecommendation}
                onImplement={handleImplementRecommendation}
              />
            </div>
          )}

          {viewMode === 'risk' && (
            <div className="p-6">
              <RiskAssessmentModule
                riskAssessments={riskAssessments}
                networkTopology={mockNetworkTopology}
                assets={assets}
              />
            </div>
        )}

        {viewMode === 'users' && (
            <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
                <div className="glass-morphism p-6">
                  <p className="text-slate-400">User management interface with comprehensive RBAC controls, tenant management, and access permissions.</p>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'settings' && (
            <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
                <div className="glass-morphism p-6">
                  <p className="text-slate-400">System configuration interface with SLA settings, alert thresholds, and integration configurations.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;