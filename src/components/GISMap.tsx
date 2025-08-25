import React, { useRef, useEffect, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Asset, WorkOrder, Alert, KPIData, MapViewState, LayerConfig, RiskAssessment } from '../types';
import { useState } from 'react';
import Modal from './Modal';
import { detailedAssetData } from '../data/enhancedMockData';

interface GISMapProps {
  assets: Asset[];
  workOrders: WorkOrder[];
  alerts: Alert[];
  kpiData: KPIData[];
  riskAssessments: RiskAssessment[];
  layers: LayerConfig[];
  selectedMetric: string;
  onAssetClick: (asset: Asset) => void;
  onMapMove: (viewState: MapViewState) => void;
}

const statusColors = {
  online: '#22c55e',
  degraded: '#f59e0b',
  offline: '#ef4444',
  maintenance: '#6b7280',
  tamper: '#8b5cf6'
};

const priorityColors = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#65a30d'
};

const severityColors = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#3b82f6'
};

export default function GISMap({
  assets,
  workOrders,
  alerts,
  kpiData,
  riskAssessments,
  layers,
  selectedMetric,
  onAssetClick,
  onMapMove
}: GISMapProps) {
  const [selectedAssetModal, setSelectedAssetModal] = useState<any>(null);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [markersAdded, setMarkersAdded] = useState({
    assets: false,
    workOrders: false,
    alerts: false,
    boundaries: false
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Enhanced map style with better visual appeal
      const enhancedStyle = {
        version: 8,
        glyphs: 'https://demotiles.maplibre.org/glyphs/{fontstack}/{range}.pbf',
        sources: {
          'osm': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          },
          'terrain': {
            type: 'raster',
            tiles: [
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            ],
            tileSize: 256
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      };

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: enhancedStyle,
        center: [78.9629, 20.5937], // Center of India
        zoom: 5,
        pitch: 0,
        bearing: 0,
        maxZoom: 18,
        minZoom: 2
      });

      // Add navigation controls
      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e.error || e);
      });

      map.current.on('move', () => {
        if (map.current) {
          const center = map.current.getCenter();
          const zoom = map.current.getZoom();
          const pitch = map.current.getPitch();
          const bearing = map.current.getBearing();
          
          onMapMove({
            longitude: center.lng,
            latitude: center.lat,
            zoom,
            pitch,
            bearing
          });
        }
      });

    } catch (error) {
      console.error('Failed to initialize map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
        setMarkersAdded({
          assets: false,
          workOrders: false,
          alerts: false,
          boundaries: false
        });
      }
    };
  }, [onMapMove]);

  // Helper function to safely remove layer and source
  const safeRemoveLayer = useCallback((layerId: string, sourceId?: string) => {
    if (!map.current) return;
    
    try {
      if (map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
      if (sourceId && map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    } catch (error) {
      console.warn(`Failed to remove layer ${layerId}:`, error);
    }
  }, []);

  // Helper function to safely add or update source
  const safeUpdateSource = useCallback((sourceId: string, data: any) => {
    if (!map.current) return false;
    
    try {
      if (map.current.getSource(sourceId)) {
        (map.current.getSource(sourceId) as maplibregl.GeoJSONSource).setData(data);
        return true;
      } else {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: data
        });
        return true;
      }
    } catch (error) {
      console.error(`Failed to update source ${sourceId}:`, error);
      return false;
    }
  }, []);

  // Update asset markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const assetsLayer = layers.find(l => l.id === 'assets');
    if (!assetsLayer?.visible) {
      safeRemoveLayer('assets-layer', 'assets');
      setMarkersAdded(prev => ({ ...prev, assets: false }));
      return;
    }

    try {
      // Validate assets data
      const validAssets = assets.filter(asset => 
        asset && 
        typeof asset.lat === 'number' && 
        typeof asset.lon === 'number' && 
        !isNaN(asset.lat) && 
        !isNaN(asset.lon) &&
        asset.lat >= -90 && asset.lat <= 90 &&
        asset.lon >= -180 && asset.lon <= 180
      );

      if (validAssets.length === 0) {
        console.warn('No valid assets to display');
        return;
      }

      // Create GeoJSON for assets
      const assetsGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: validAssets.map(asset => {
          const riskAssessment = riskAssessments.find(r => r.site_id === asset.site_id);
          const kpi = kpiData.find(k => k.site_id === asset.site_id);
          
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [asset.lon, asset.lat]
            },
            properties: {
              id: asset.id,
              site_id: asset.site_id,
              type: asset.type,
              status: asset.status,
              oem: asset.oem,
              kW: asset.kW,
              power_kw: asset.power_kw || 0,
              temp_c: asset.temp_c || 0,
              soc_pct: asset.soc_pct || 0,
              color: statusColors[asset.status] || '#6b7280',
              risk_score: riskAssessment?.risk_score || 0,
              risk_level: riskAssessment?.risk_level || 'low',
              pr: kpi?.pr || 0,
              availability: kpi?.availability_pct || 0,
              yield: kpi?.yield_kwh || 0
            }
          };
        })
      };

      // Update source
      if (safeUpdateSource('assets', assetsGeoJSON)) {
        // Add or update layer
        if (!map.current.getLayer('assets-layer')) {
          map.current.addLayer({
            id: 'assets-layer',
            type: 'circle',
            source: 'assets',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 4,
                8, 8,
                12, 12,
                16, 16
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': [
                'case',
                ['>', ['get', 'risk_score'], 0.7], 3,
                ['>', ['get', 'risk_score'], 0.5], 2,
                1
              ],
              'circle-stroke-color': '#ffffff',
              'circle-opacity': assetsLayer.opacity,
              'circle-stroke-opacity': assetsLayer.opacity
            }
          });

          // Add click handler
          map.current.on('click', 'assets-layer', (e) => {
            if (e.features && e.features[0]) {
              const feature = e.features[0];
              const assetId = feature.properties?.id;
              const asset = assets.find(a => a.id === assetId);
              if (asset) {
                onAssetClick(asset);
                // Show enhanced modal with detailed asset information
                const detailedAsset = detailedAssetData.find(d => d.id.includes(asset.site_id.split('-')[2]));
                if (detailedAsset) {
                  setSelectedAssetModal(detailedAsset);
                }
              }
            }
          });

          // Add hover effects
          map.current.on('mouseenter', 'assets-layer', (e) => {
            if (map.current) {
              map.current.getCanvas().style.cursor = 'pointer';
              
              // Show popup on hover
              if (e.features && e.features[0]) {
                const feature = e.features[0];
                const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
                const properties = feature.properties;
                
                new maplibregl.Popup({ offset: 15 })
                  .setLngLat(coordinates)
                  .setHTML(`
                    <div class="p-3 bg-slate-800 text-white rounded-lg shadow-lg min-w-[200px]">
                      <div class="flex items-center space-x-2 mb-2">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${properties?.color}"></div>
                        <h3 class="font-bold text-lg">${properties?.id || 'Unknown'}</h3>
                      </div>
                      <div class="space-y-1 text-sm">
                        <p><span class="text-slate-400">Site:</span> <span class="text-white">${properties?.site_id || 'N/A'}</span></p>
                        <p><span class="text-slate-400">Status:</span> <span class="capitalize text-white">${properties?.status || 'Unknown'}</span></p>
                        <p><span class="text-slate-400">OEM:</span> <span class="text-white">${properties?.oem || 'N/A'}</span></p>
                        <p><span class="text-slate-400">Power:</span> <span class="text-green-400 font-semibold">${(properties?.power_kw || 0).toFixed(1)}kW</span> / <span class="text-slate-300">${properties?.kW || 0}kW</span></p>
                        ${properties?.temp_c ? `<p><span class="text-slate-400">Temperature:</span> <span class="text-orange-400 font-semibold">${properties.temp_c.toFixed(1)}°C</span></p>` : ''}
                        ${properties?.soc_pct !== undefined ? `<p><span class="text-slate-400">Battery SoC:</span> <span class="text-blue-400 font-semibold">${properties.soc_pct}%</span></p>` : ''}
                        <p><span class="text-slate-400">Performance:</span> <span class="text-cyan-400 font-semibold">${((properties?.power_kw || 0) / (properties?.kW || 1) * 100).toFixed(1)}%</span></p>
                        ${properties?.risk_score ? `<p><span class="text-slate-400">Risk Score:</span> <span class="text-red-400 font-semibold">${(properties.risk_score * 100).toFixed(0)}%</span></p>` : ''}
                      </div>
                    </div>
                  `)
                  .addTo(map.current);
              }
            }
          });

          map.current.on('mouseleave', 'assets-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
              // Remove all popups
              const popups = document.getElementsByClassName('maplibregl-popup');
              Array.from(popups).forEach(popup => popup.remove());
            }
          });

          setMarkersAdded(prev => ({ ...prev, assets: true }));
        } else {
          // Update layer opacity
          map.current.setPaintProperty('assets-layer', 'circle-opacity', assetsLayer.opacity);
          map.current.setPaintProperty('assets-layer', 'circle-stroke-opacity', assetsLayer.opacity);
        }
      }
    } catch (error) {
      console.error('Error updating assets layer:', error);
    }
  }, [assets, layers, mapLoaded, onAssetClick, riskAssessments, kpiData, safeUpdateSource, safeRemoveLayer]);

  // Update work orders markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const workOrdersLayer = layers.find(l => l.id === 'workorders');
    if (!workOrdersLayer?.visible) {
      safeRemoveLayer('workorders-layer', 'workorders');
      setMarkersAdded(prev => ({ ...prev, workOrders: false }));
      return;
    }

    try {
      // Validate work orders data
      const validWorkOrders = workOrders.filter(wo => 
        wo && 
        typeof wo.lat === 'number' && 
        typeof wo.lon === 'number' && 
        !isNaN(wo.lat) && 
        !isNaN(wo.lon) &&
        wo.lat >= -90 && wo.lat <= 90 &&
        wo.lon >= -180 && wo.lon <= 180
      );

      if (validWorkOrders.length === 0) {
        console.warn('No valid work orders to display');
        return;
      }

      // Create GeoJSON for work orders
      const workOrdersGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: validWorkOrders.map(wo => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [wo.lon, wo.lat]
          },
          properties: {
            wo_id: wo.wo_id,
            site_id: wo.site_id,
            priority: wo.priority,
            status: wo.status,
            issue: wo.issue,
            color: priorityColors[wo.priority] || '#6b7280',
            assignee: wo.assignee || 'Unassigned',
            sla_hours: wo.sla_hours
          }
        }))
      };

      // Update source
      if (safeUpdateSource('workorders', workOrdersGeoJSON)) {
        // Add or update layer
        if (!map.current.getLayer('workorders-layer')) {
          map.current.addLayer({
            id: 'workorders-layer',
            type: 'circle',
            source: 'workorders',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 5,
                8, 8,
                12, 12,
                16, 16
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': workOrdersLayer.opacity,
              'circle-stroke-opacity': workOrdersLayer.opacity
            }
          });

          // Add hover effects for work orders
          map.current.on('mouseenter', 'workorders-layer', (e) => {
            if (map.current && e.features && e.features[0]) {
              map.current.getCanvas().style.cursor = 'pointer';
              
              const feature = e.features[0];
              const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
              const properties = feature.properties;
              
              new maplibregl.Popup({ offset: 15 })
                .setLngLat(coordinates)
                .setHTML(`
                  <div class="p-3 bg-slate-800 text-white rounded-lg shadow-lg min-w-[220px]">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="w-3 h-3 rounded-full" style="background-color: ${properties?.color}"></div>
                      <h3 class="font-bold text-lg">${properties?.wo_id || 'Unknown'}</h3>
                    </div>
                    <div class="space-y-1 text-sm">
                      <p><span class="text-slate-400">Site:</span> <span class="text-white">${properties?.site_id || 'N/A'}</span></p>
                      <p><span class="text-slate-400">Priority:</span> <span class="capitalize font-semibold" style="color: ${properties?.color}">${properties?.priority || 'Unknown'}</span></p>
                      <p><span class="text-slate-400">Status:</span> <span class="capitalize text-white">${properties?.status || 'Unknown'}</span></p>
                      <p><span class="text-slate-400">SLA:</span> <span class="text-yellow-400 font-semibold">${properties?.sla_hours || 0} hours</span></p>
                      <p><span class="text-slate-400">Assignee:</span> <span class="text-cyan-400">${properties?.assignee || 'Unassigned'}</span></p>
                      <div class="mt-2 p-2 bg-slate-700 rounded text-xs">
                        <p class="text-slate-300">${properties?.issue || 'No description available'}</p>
                      </div>
                    </div>
                  </div>
                `)
                .addTo(map.current);
            }
          });

          map.current.on('mouseleave', 'workorders-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });

          setMarkersAdded(prev => ({ ...prev, workOrders: true }));
        } else {
          // Update layer opacity
          map.current.setPaintProperty('workorders-layer', 'circle-opacity', workOrdersLayer.opacity);
          map.current.setPaintProperty('workorders-layer', 'circle-stroke-opacity', workOrdersLayer.opacity);
        }
      }
    } catch (error) {
      console.error('Error updating work orders layer:', error);
    }
  }, [workOrders, layers, mapLoaded, safeUpdateSource, safeRemoveLayer]);

  // Update alerts markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const alertsLayer = layers.find(l => l.id === 'alerts');
    if (!alertsLayer?.visible) {
      safeRemoveLayer('alerts-layer');
      safeRemoveLayer('alerts-pulse-layer', 'alerts');
      setMarkersAdded(prev => ({ ...prev, alerts: false }));
      return;
    }

    try {
      // Validate alerts data and filter unacknowledged
      const validAlerts = alerts.filter(alert => 
        alert && 
        !alert.acknowledged &&
        typeof alert.lat === 'number' && 
        typeof alert.lon === 'number' && 
        !isNaN(alert.lat) && 
        !isNaN(alert.lon) &&
        alert.lat >= -90 && alert.lat <= 90 &&
        alert.lon >= -180 && alert.lon <= 180
      );

      if (validAlerts.length === 0) {
        console.warn('No valid unacknowledged alerts to display');
        safeRemoveLayer('alerts-layer');
        safeRemoveLayer('alerts-pulse-layer', 'alerts');
        return;
      }

      // Create GeoJSON for alerts
      const alertsGeoJSON: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: validAlerts.map(alert => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [alert.lon, alert.lat]
          },
          properties: {
            id: alert.id,
            site_id: alert.site_id,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
            color: severityColors[alert.severity] || '#6b7280',
            timestamp: new Date(alert.timestamp).getTime()
          }
        }))
      };

      // Update source
      if (safeUpdateSource('alerts', alertsGeoJSON)) {
        // Add main alerts layer
        if (!map.current.getLayer('alerts-layer')) {
          map.current.addLayer({
            id: 'alerts-layer',
            type: 'circle',
            source: 'alerts',
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 6,
                8, 10,
                12, 14,
                16, 18
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
              'circle-opacity': alertsLayer.opacity,
              'circle-stroke-opacity': alertsLayer.opacity
            }
          });

          // Add pulsing animation for critical alerts
          map.current.addLayer({
            id: 'alerts-pulse-layer',
            type: 'circle',
            source: 'alerts',
            filter: ['==', ['get', 'severity'], 'critical'],
            paint: {
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 12,
                8, 20,
                12, 28,
                16, 36
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': [
                'interpolate',
                ['linear'],
                ['%', ['get', 'timestamp'], 2000],
                0, 0.1,
                1000, 0.3,
                2000, 0.1
              ],
              'circle-stroke-width': 0
            }
          });

          // Add hover effects for alerts
          map.current.on('mouseenter', 'alerts-layer', (e) => {
            if (map.current && e.features && e.features[0]) {
              map.current.getCanvas().style.cursor = 'pointer';
              
              const feature = e.features[0];
              const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];
              const properties = feature.properties;
              
              new maplibregl.Popup({ offset: 15 })
                .setLngLat(coordinates)
                .setHTML(`
                  <div class="p-3 bg-slate-800 text-white rounded-lg shadow-lg min-w-[250px] border-l-4" style="border-color: ${properties?.color}">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="w-3 h-3 rounded-full animate-pulse" style="background-color: ${properties?.color}"></div>
                      <h3 class="font-bold text-lg" style="color: ${properties?.color}">${properties?.type?.replace('_', ' ').toUpperCase() || 'ALERT'}</h3>
                    </div>
                    <div class="space-y-1 text-sm">
                      <p><span class="text-slate-400">Site:</span> <span class="text-white">${properties?.site_id || 'N/A'}</span></p>
                      <p><span class="text-slate-400">Severity:</span> <span class="capitalize font-semibold" style="color: ${properties?.color}">${properties?.severity || 'Unknown'}</span></p>
                      <p><span class="text-slate-400">Time:</span> <span class="text-cyan-400">${properties?.timestamp ? new Date(properties.timestamp).toLocaleString() : 'Unknown'}</span></p>
                      <div class="mt-2 p-2 bg-slate-700 rounded text-xs">
                        <p class="text-slate-300">${properties?.message || 'No message available'}</p>
                      </div>
                      <div class="mt-2 flex items-center space-x-2">
                        <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span class="text-red-400 text-xs font-medium">REQUIRES ATTENTION</span>
                      </div>
                    </div>
                  </div>
                `)
                .addTo(map.current);
            }
          });

          map.current.on('mouseleave', 'alerts-layer', () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = '';
            }
          });

          setMarkersAdded(prev => ({ ...prev, alerts: true }));
        } else {
          // Update layer opacity
          map.current.setPaintProperty('alerts-layer', 'circle-opacity', alertsLayer.opacity);
          map.current.setPaintProperty('alerts-layer', 'circle-stroke-opacity', alertsLayer.opacity);
          if (map.current.getLayer('alerts-pulse-layer')) {
            map.current.setPaintProperty('alerts-pulse-layer', 'circle-opacity', alertsLayer.opacity * 0.3);
          }
        }
      }
    } catch (error) {
      console.error('Error updating alerts layer:', error);
    }
  }, [alerts, layers, mapLoaded, safeUpdateSource, safeRemoveLayer]);

  // Add Indian state boundaries
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const boundariesLayer = layers.find(l => l.id === 'boundaries');
    if (!boundariesLayer?.visible) {
      safeRemoveLayer('state-boundaries-layer');
      safeRemoveLayer('state-labels-layer', 'state-boundaries');
      setMarkersAdded(prev => ({ ...prev, boundaries: false }));
      return;
    }

    try {
      // Government of India approved state boundaries (simplified for demo)
      const indiaStates: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Karnataka', code: 'KA' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [74.0, 11.5], [78.5, 11.5], [78.5, 18.5], [74.0, 18.5], [74.0, 11.5]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Tamil Nadu', code: 'TN' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [76.0, 8.0], [80.5, 8.0], [80.5, 13.5], [76.0, 13.5], [76.0, 8.0]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Maharashtra', code: 'MH' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [72.5, 15.5], [80.5, 15.5], [80.5, 22.0], [72.5, 22.0], [72.5, 15.5]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Rajasthan', code: 'RJ' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [69.5, 23.0], [78.5, 23.0], [78.5, 30.5], [69.5, 30.5], [69.5, 23.0]
              ]]
            }
          },
          {
            type: 'Feature',
            properties: { name: 'Gujarat', code: 'GJ' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [68.0, 20.0], [74.5, 20.0], [74.5, 24.5], [68.0, 24.5], [68.0, 20.0]
              ]]
            }
          }
        ]
      };

      if (safeUpdateSource('state-boundaries', indiaStates)) {
        if (!map.current.getLayer('state-boundaries-layer')) {
          map.current.addLayer({
            id: 'state-boundaries-layer',
            type: 'line',
            source: 'state-boundaries',
            paint: {
              'line-color': '#3b82f6',
              'line-width': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 1,
                8, 2,
                12, 3
              ],
              'line-opacity': boundariesLayer.opacity
            }
          });

          // Add state labels
          map.current.addLayer({
            id: 'state-labels-layer',
            type: 'symbol',
            source: 'state-boundaries',
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
              'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                4, 10,
                8, 14,
                12, 18
              ],
              'text-anchor': 'center'
            },
            paint: {
              'text-color': '#1e40af',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
              'text-opacity': boundariesLayer.opacity
            }
          });

          setMarkersAdded(prev => ({ ...prev, boundaries: true }));
        } else {
          map.current.setPaintProperty('state-boundaries-layer', 'line-opacity', boundariesLayer.opacity);
          if (map.current.getLayer('state-labels-layer')) {
            map.current.setPaintProperty('state-labels-layer', 'text-opacity', boundariesLayer.opacity);
          }
        }
      }
    } catch (error) {
      console.error('Error updating boundaries layer:', error);
    }
  }, [layers, mapLoaded, safeUpdateSource, safeRemoveLayer]);

  // Add heatmap layer for performance visualization
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const heatmapLayer = layers.find(l => l.id === 'heatmap');
    if (!heatmapLayer?.visible) {
      safeRemoveLayer('heatmap-layer', 'heatmap-data');
      return;
    }

    try {
      // Create heatmap data based on selected metric
      const validAssets = assets.filter(asset => 
        asset && 
        typeof asset.lat === 'number' && 
        typeof asset.lon === 'number' && 
        !isNaN(asset.lat) && 
        !isNaN(asset.lon)
      );

      const heatmapData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: validAssets.map(asset => {
          const kpi = kpiData.find(k => k.site_id === asset.site_id);
          let weight = 0;
          
          switch (selectedMetric) {
            case 'power':
              weight = (asset.power_kw || 0) / asset.kW;
              break;
            case 'pr':
              weight = kpi?.pr || 0;
              break;
            case 'availability':
              weight = (kpi?.availability_pct || 0) / 100;
              break;
            case 'temperature':
              weight = Math.max(0, 1 - ((asset.temp_c || 25) - 25) / 50);
              break;
            default:
              weight = 0.5;
          }

          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [asset.lon, asset.lat]
            },
            properties: {
              weight: Math.max(0, Math.min(1, weight))
            }
          };
        })
      };

      if (safeUpdateSource('heatmap-data', heatmapData)) {
        if (!map.current.getLayer('heatmap-layer')) {
          map.current.addLayer({
            id: 'heatmap-layer',
            type: 'heatmap',
            source: 'heatmap-data',
            paint: {
              'heatmap-weight': ['get', 'weight'],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 3
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(178,24,43)'
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                9, 20
              ],
              'heatmap-opacity': heatmapLayer.opacity
            }
          });
        } else {
          map.current.setPaintProperty('heatmap-layer', 'heatmap-opacity', heatmapLayer.opacity);
        }
      }
    } catch (error) {
      console.error('Error updating heatmap layer:', error);
    }
  }, [assets, kpiData, layers, selectedMetric, mapLoaded, safeUpdateSource, safeRemoveLayer]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p>Loading GIS Map...</p>
          </div>
        </div>
      )}
      
      {/* Map Attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 text-xs text-gray-600 rounded shadow">
        © OpenStreetMap | Government of India | MNRE National RTS Platform
      </div>

      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
          <div>Map Loaded: {mapLoaded ? '✓' : '✗'}</div>
          <div>Assets: {assets.length}</div>
          <div>Work Orders: {workOrders.length}</div>
          <div>Alerts: {alerts.filter(a => !a.acknowledged).length}</div>
        </div>
      )}
      
      {/* Enhanced Asset Details Modal */}
      {selectedAssetModal && (
        <Modal
          isOpen={!!selectedAssetModal}
          onClose={() => setSelectedAssetModal(null)}
          title={`Asset Details - ${selectedAssetModal.site_id}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Asset Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="text-white">{selectedAssetModal.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Location:</span>
                      <span className="text-white">{selectedAssetModal.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Capacity:</span>
                      <span className="text-white">{selectedAssetModal.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Owner:</span>
                      <span className="text-white">{selectedAssetModal.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Commissioned:</span>
                      <span className="text-white">{selectedAssetModal.commissioned}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Performance Today</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-green-400">{selectedAssetModal.performance.todayGeneration}</div>
                      <div className="text-xs text-slate-400">Today's Generation</div>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-400">{selectedAssetModal.performance.pr}%</div>
                      <div className="text-xs text-slate-400">Performance Ratio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Financial Information */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Financial Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">CAPEX</div>
                  <div className="text-lg font-bold text-white">{selectedAssetModal.financials.capex}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">Current ROI</div>
                  <div className="text-lg font-bold text-green-400">{selectedAssetModal.financials.currentROI}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <div className="text-sm text-slate-400">Tariff Rate</div>
                  <div className="text-lg font-bold text-cyan-400">{selectedAssetModal.financials.tariff}</div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}