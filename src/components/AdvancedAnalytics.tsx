import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, AlertTriangle, Target, Brain, 
  Zap, Battery, Thermometer, Activity, Eye, Search, Filter,
  Calendar, Download, Share, Bookmark, ChevronDown, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KPIData, Asset, ForecastData, AnalyticsEvidence } from '../types';

interface AdvancedAnalyticsProps {
  kpiData: KPIData[];
  assets: Asset[];
  forecastData: ForecastData[];
}

interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'forecast' | 'benchmark';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  evidence: AnalyticsEvidence[];
  recommendations: string[];
}

const mockInsights: AnalyticsInsight[] = [
  {
    id: 'INS001',
    type: 'trend',
    title: 'Declining Performance in Karnataka Region',
    description: 'Performance Ratio has decreased by 12% over the last 30 days in Karnataka installations',
    confidence: 0.89,
    impact: 'high',
    evidence: [
      {
        type: 'trend',
        data_source: 'Telemetry aggregation',
        time_period: 'Last 30 days',
        confidence_level: 0.89,
        description: 'Consistent downward trend in PR across 15 sites',
        visualization_data: {}
      }
    ],
    recommendations: [
      'Immediate inspection of Karnataka installations',
      'Check for dust accumulation or shading issues',
      'Review maintenance schedules for affected sites'
    ]
  },
  {
    id: 'INS002',
    type: 'anomaly',
    title: 'Unusual Temperature Patterns Detected',
    description: 'AI models detected temperature anomalies that precede 78% of inverter failures',
    confidence: 0.94,
    impact: 'high',
    evidence: [
      {
        type: 'anomaly',
        data_source: 'ML anomaly detection',
        time_period: 'Real-time',
        confidence_level: 0.94,
        description: 'Temperature spikes 2-3 days before failure events',
        visualization_data: {}
      }
    ],
    recommendations: [
      'Implement predictive maintenance alerts',
      'Install additional temperature monitoring',
      'Develop early warning system for inverter health'
    ]
  },
  {
    id: 'INS003',
    type: 'correlation',
    title: 'Weather Impact on Generation Efficiency',
    description: 'Strong correlation (r=0.87) between humidity levels and generation efficiency',
    confidence: 0.87,
    impact: 'medium',
    evidence: [
      {
        type: 'correlation',
        data_source: 'Weather and generation data',
        time_period: 'Last 6 months',
        confidence_level: 0.87,
        description: 'Higher humidity correlates with reduced efficiency',
        visualization_data: {}
      }
    ],
    recommendations: [
      'Factor humidity into generation forecasts',
      'Consider dehumidification systems for critical installations',
      'Adjust maintenance schedules based on weather patterns'
    ]
  }
];

export default function AdvancedAnalytics({ kpiData, assets, forecastData }: AdvancedAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('pr');
  const [insights, setInsights] = useState<AnalyticsInsight[]>(mockInsights);
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'forecasts' | 'insights' | 'benchmarks'>('overview');

  // Generate trend data
  const generateTrendData = () => {
    const days = 30;
    const data = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      data.push({
        date: date.toISOString().split('T')[0],
        pr: 0.75 + Math.random() * 0.2 + Math.sin(i / 7) * 0.05,
        availability: 85 + Math.random() * 10 + Math.cos(i / 5) * 3,
        yield: 1000 + Math.random() * 500 + Math.sin(i / 3) * 200,
        temperature: 25 + Math.random() * 15 + Math.sin(i / 2) * 5
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  // Performance distribution data
  const performanceDistribution = assets.reduce((acc: Record<number, number>, asset) => {
    const kpi = kpiData.find(k => k.site_id === asset.site_id);
    if (kpi) {
      const prRange = Math.floor(kpi.pr * 10) / 10;
      acc[prRange] = (acc[prRange] || 0) + 1;
    }
    return acc;
  }, {});

  const distributionData = Object.entries(performanceDistribution).map(([pr, count]) => ({
    pr: parseFloat(pr),
    count,
    percentage: (count / assets.length) * 100
  }));

  // Correlation matrix data
  const correlationData = [
    { metric: 'Temperature', pr: -0.65, availability: -0.72, yield: -0.58 },
    { metric: 'Humidity', pr: -0.43, availability: -0.38, yield: -0.41 },
    { metric: 'Irradiance', pr: 0.89, availability: 0.23, yield: 0.91 },
    { metric: 'Wind Speed', pr: 0.34, availability: 0.12, yield: 0.28 }
  ];

  // Benchmark comparison data
  const benchmarkData = [
    { category: 'Performance Ratio', current: 0.82, target: 0.85, industry: 0.78, best: 0.92 },
    { category: 'Availability', current: 94.2, target: 96.0, industry: 91.5, best: 98.7 },
    { category: 'MTTR (hours)', current: 18.5, target: 12.0, industry: 24.3, best: 8.2 },
    { category: 'Cost per kWh', current: 2.8, target: 2.5, industry: 3.2, best: 2.1 }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Trends */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Performance Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
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
            <Line 
              type="monotone" 
              dataKey="pr" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Performance Ratio"
            />
            <Line 
              type="monotone" 
              dataKey="availability" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name="Availability %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Distribution */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-cyan-400" />
          Performance Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="pr" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#f8fafc'
              }} 
            />
            <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Correlation Matrix */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-400" />
          Factor Correlation Analysis
        </h3>
        <div className="space-y-3">
          {correlationData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300 font-medium">{item.metric}</span>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="text-xs text-slate-400">PR</div>
                  <div className={`font-semibold ${item.pr > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.pr.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Availability</div>
                  <div className={`font-semibold ${item.availability > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.availability.toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">Yield</div>
                  <div className={`font-semibold ${item.yield > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.yield.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-yellow-400" />
          Benchmark Comparison
        </h3>
        <div className="space-y-4">
          {benchmarkData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">{item.category}</span>
                <span className="text-white font-semibold">{item.current}</span>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  style={{ width: `${(item.current / item.best) * 100}%` }}
                />
                <div 
                  className="absolute top-0 h-full w-1 bg-yellow-400"
                  style={{ left: `${(item.target / item.best) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Industry: {item.industry}</span>
                <span>Target: {item.target}</span>
                <span>Best: {item.best}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Extended Performance Trends */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Extended Performance Analysis</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
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
            <Area type="monotone" dataKey="yield" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Yield (kWh)" />
            <Area type="monotone" dataKey="temperature" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} name="Temperature (°C)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Analysis */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Seasonal Performance Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-md font-medium text-white mb-2">Summer Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Generation:</span>
                <span className="text-green-400 font-semibold">1,450 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Peak Temperature:</span>
                <span className="text-red-400 font-semibold">52°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Efficiency Drop:</span>
                <span className="text-yellow-400 font-semibold">-8%</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg">
            <h4 className="text-md font-medium text-white mb-2">Winter Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Generation:</span>
                <span className="text-green-400 font-semibold">1,120 kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Optimal Temperature:</span>
                <span className="text-green-400 font-semibold">28°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Efficiency Gain:</span>
                <span className="text-green-400 font-semibold">+5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForecasts = () => (
    <div className="space-y-6">
      {/* Generation Forecast */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">7-Day Generation Forecast</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#f8fafc'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="predicted_value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              name="Predicted Generation (kWh)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Accuracy */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Forecast Accuracy Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecastData.map((forecast, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">
                {new Date(forecast.timestamp).toLocaleDateString()}
              </div>
              <div className="text-lg font-bold text-white mb-2">
                {forecast.predicted_value.toLocaleString()} kWh
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Confidence:</span>
                <span className={`font-semibold ${
                  (forecast.accuracy_score || 0) > 0.8 ? 'text-green-400' : 
                  (forecast.accuracy_score || 0) > 0.6 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {((forecast.accuracy_score || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBenchmarks = () => (
    <div className="space-y-6">
      {/* Detailed Benchmark Analysis */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Performance Benchmarks</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={benchmarkData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} />
            <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={12} width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#f8fafc'
              }} 
            />
            <Legend />
            <Bar dataKey="current" fill="#3b82f6" name="Current" />
            <Bar dataKey="target" fill="#10b981" name="Target" />
            <Bar dataKey="industry" fill="#f59e0b" name="Industry Avg" />
            <Bar dataKey="best" fill="#8b5cf6" name="Best Practice" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Gaps */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Gap Analysis</h3>
        <div className="space-y-4">
          {benchmarkData.map((item, index) => {
            const gapToTarget = ((item.target - item.current) / item.current * 100);
            const gapToBest = ((item.best - item.current) / item.current * 100);
            
            return (
              <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{item.category}</span>
                  <span className="text-slate-400 text-sm">Current: {item.current}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Gap to Target:</span>
                    <span className={`ml-2 font-semibold ${gapToTarget > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {gapToTarget > 0 ? '+' : ''}{gapToTarget.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Gap to Best:</span>
                    <span className={`ml-2 font-semibold ${gapToBest > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {gapToBest > 0 ? '+' : ''}{gapToBest.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {insights.map((insight) => (
        <motion.div
          key={insight.id}
          className="glass-morphism p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedInsight(expandedInsight === insight.id ? null : insight.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                insight.type === 'trend' ? 'bg-blue-500/20 text-blue-400' :
                insight.type === 'anomaly' ? 'bg-red-500/20 text-red-400' :
                insight.type === 'correlation' ? 'bg-purple-500/20 text-purple-400' :
                insight.type === 'forecast' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {insight.type === 'trend' && <TrendingUp className="w-5 h-5" />}
                {insight.type === 'anomaly' && <AlertTriangle className="w-5 h-5" />}
                {insight.type === 'correlation' && <Brain className="w-5 h-5" />}
                {insight.type === 'forecast' && <Eye className="w-5 h-5" />}
                {insight.type === 'benchmark' && <Target className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                <p className="text-slate-300">{insight.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-slate-400">Confidence</div>
                <div className="font-semibold text-white">{(insight.confidence * 100).toFixed(0)}%</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                insight.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                insight.impact === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {insight.impact.toUpperCase()}
              </div>
              {expandedInsight === insight.id ? 
                <ChevronDown className="w-5 h-5 text-slate-400" /> : 
                <ChevronRight className="w-5 h-5 text-slate-400" />
              }
            </div>
          </div>

          <AnimatePresence>
            {expandedInsight === insight.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-slate-700"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold text-white mb-3">Evidence</h4>
                    <div className="space-y-3">
                      {insight.evidence.map((evidence, index) => (
                        <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-slate-300">{evidence.data_source}</span>
                            <span className="text-xs text-slate-400">{evidence.time_period}</span>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">{evidence.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-slate-500">Confidence: {(evidence.confidence_level * 100).toFixed(0)}%</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              evidence.type === 'trend' ? 'bg-blue-500/20 text-blue-400' :
                              evidence.type === 'anomaly' ? 'bg-red-500/20 text-red-400' :
                              evidence.type === 'correlation' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {evidence.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-white mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {insight.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-slate-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h2>
          <p className="text-slate-400">AI-powered insights and deep analysis</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'trends', label: 'Trends', icon: TrendingUp },
          { id: 'forecasts', label: 'Forecasts', icon: Eye },
          { id: 'insights', label: 'AI Insights', icon: Brain },
          { id: 'benchmarks', label: 'Benchmarks', icon: Target }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'trends' && renderTrends()}
          {activeTab === 'forecasts' && renderForecasts()}
          {activeTab === 'benchmarks' && renderBenchmarks()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}