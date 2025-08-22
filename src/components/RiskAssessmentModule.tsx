import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, TrendingUp, Network, Zap, DollarSign,
  Clock, Users, Eye, Brain, Target, Activity, ChevronDown, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import { RiskAssessment, NetworkTopology, Asset } from '../types';

interface RiskAssessmentModuleProps {
  riskAssessments: RiskAssessment[];
  networkTopology: NetworkTopology;
  assets: Asset[];
}

const riskColors = {
  very_low: '#10b981',
  low: '#84cc16', 
  medium: '#f59e0b',
  high: '#f97316',
  critical: '#ef4444'
};

const riskTypeIcons = {
  technical: Zap,
  financial: DollarSign,
  operational: Activity,
  regulatory: Shield,
  cyber: Network,
  environmental: Eye
};

export default function RiskAssessmentModule({ 
  riskAssessments, 
  networkTopology, 
  assets 
}: RiskAssessmentModuleProps) {
  // Calculate risk metrics and trends
  const highRiskSites = riskAssessments.filter(r => r.risk_level === 'high' || r.risk_level === 'critical').length;
  const avgRiskScore = riskAssessments.reduce((sum, r) => sum + r.risk_score, 0) / riskAssessments.length;
  const recentRisks = riskAssessments.filter(r => 
    new Date(r.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
  ).length;
  const mitigationProgress = riskAssessments.filter(r => r.mitigation_strategies.length > 0).length;

  const [selectedRiskType, setSelectedRiskType] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessments' | 'network' | 'mitigation'>('overview');

  // Calculate risk metrics
  const riskMetrics = {
    total: riskAssessments.length,
    critical: riskAssessments.filter(r => r.risk_level === 'critical').length,
    high: riskAssessments.filter(r => r.risk_level === 'high').length,
    medium: riskAssessments.filter(r => r.risk_level === 'medium').length,
    low: riskAssessments.filter(r => r.risk_level === 'low').length,
    very_low: riskAssessments.filter(r => r.risk_level === 'very_low').length
  };

  // Risk distribution by type
  const riskByType = riskAssessments.reduce((acc, risk) => {
    acc[risk.risk_type] = (acc[risk.risk_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskTypeData = Object.entries(riskByType).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
    percentage: (count / riskAssessments.length) * 100
  }));

  // Risk trend data (mock)
  const riskTrendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      critical: Math.floor(Math.random() * 5) + 1,
      high: Math.floor(Math.random() * 8) + 3,
      medium: Math.floor(Math.random() * 12) + 5,
      low: Math.floor(Math.random() * 15) + 8,
      total_score: Math.random() * 100 + 200
    };
  });

  // Network risk analysis
  const networkRiskData = networkTopology.clusters.map(cluster => ({
    name: cluster.name,
    risk_score: (1 - cluster.stability_score) * 100,
    utilization: cluster.utilization * 100,
    capacity: cluster.total_capacity,
    nodes: cluster.nodes.length
  }));

  // Risk radar chart data
  const radarData = [
    { risk: 'Technical', current: 65, target: 30, industry: 45 },
    { risk: 'Financial', current: 40, target: 25, industry: 35 },
    { risk: 'Operational', current: 55, target: 35, industry: 50 },
    { risk: 'Regulatory', current: 25, target: 15, industry: 30 },
    { risk: 'Cyber', current: 70, target: 40, industry: 60 },
    { risk: 'Environmental', current: 35, target: 20, industry: 40 }
  ];

  const filteredRisks = riskAssessments.filter(risk => {
    if (selectedRiskType !== 'all' && risk.risk_type !== selectedRiskType) return false;
    if (selectedRiskLevel !== 'all' && risk.risk_level !== selectedRiskLevel) return false;
    return true;
  });

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Metrics */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-400" />
          Risk Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{riskMetrics.total}</div>
            <div className="text-sm text-slate-400">Total Risks</div>
          </div>
          <div className="text-center p-4 bg-red-500/20 rounded-lg">
            <div className="text-2xl font-bold text-red-400">{riskMetrics.critical}</div>
            <div className="text-sm text-slate-400">Critical</div>
          </div>
          <div className="text-center p-4 bg-orange-500/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-400">{riskMetrics.high}</div>
            <div className="text-sm text-slate-400">High</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{riskMetrics.medium}</div>
            <div className="text-sm text-slate-400">Medium</div>
          </div>
        </div>
        
        {/* Risk Distribution */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={Object.entries(riskMetrics).filter(([key]) => key !== 'total').map(([level, count]) => ({
                name: level.charAt(0).toUpperCase() + level.slice(1),
                value: count,
                color: riskColors[level as keyof typeof riskColors]
              }))}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {Object.entries(riskMetrics).filter(([key]) => key !== 'total').map((entry, index) => (
                <Cell key={`cell-${index}`} fill={riskColors[entry[0] as keyof typeof riskColors]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Trends */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Risk Trends (30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={riskTrendData}>
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
            <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
            <Area type="monotone" dataKey="low" stackId="1" stroke="#84cc16" fill="#84cc16" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Radar */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-purple-400" />
          Risk Profile Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(148, 163, 184, 0.2)" />
            <PolarAngleAxis dataKey="risk" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Industry"
              dataKey="industry"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Network Risk */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Network className="w-5 h-5 mr-2 text-cyan-400" />
          Network Risk Analysis
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart data={networkRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis 
              dataKey="utilization" 
              stroke="#94a3b8" 
              fontSize={12}
              name="Utilization %"
            />
            <YAxis 
              dataKey="risk_score" 
              stroke="#94a3b8" 
              fontSize={12}
              name="Risk Score"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#f8fafc'
              }}
              formatter={(value, name) => [
                typeof value === 'number' ? value.toFixed(1) : value,
                name === 'risk_score' ? 'Risk Score' : 
                name === 'utilization' ? 'Utilization %' : name
              ]}
            />
            <Scatter dataKey="risk_score" fill="#06b6d4" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderAssessments = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="glass-morphism p-4">
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedRiskType}
            onChange={(e) => setSelectedRiskType(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="technical">Technical</option>
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="regulatory">Regulatory</option>
            <option value="cyber">Cyber</option>
            <option value="environmental">Environmental</option>
          </select>

          <select
            value={selectedRiskLevel}
            onChange={(e) => setSelectedRiskLevel(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="very_low">Very Low</option>
          </select>
        </div>
      </div>

      {/* Risk List */}
      {filteredRisks.map((risk) => {
        const IconComponent = riskTypeIcons[risk.risk_type];
        const isExpanded = expandedRisk === risk.id;

        return (
          <motion.div
            key={risk.id}
            className="glass-morphism p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: `${riskColors[risk.risk_level]}20`,
                    borderColor: `${riskColors[risk.risk_level]}50`,
                    color: riskColors[risk.risk_level]
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-semibold text-white">{risk.site_id}</h3>
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium border"
                      style={{ 
                        backgroundColor: `${riskColors[risk.risk_level]}20`,
                        borderColor: `${riskColors[risk.risk_level]}50`,
                        color: riskColors[risk.risk_level]
                      }}
                    >
                      {risk.risk_level.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                      {risk.risk_type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-2">{risk.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-400">Risk Score:</span>
                      <span className="font-semibold text-white">{risk.risk_score.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-400">Probability:</span>
                      <span className="font-semibold text-white">{(risk.probability * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-slate-400">Impact:</span>
                      <span className="font-semibold text-white">{risk.impact_score}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">{risk.timeline}</span>
                {isExpanded ? 
                  <ChevronDown className="w-5 h-5 text-slate-400" /> : 
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                }
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 pt-6 border-t border-slate-700"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-semibold text-white mb-3">Mitigation Strategies</h4>
                      <div className="space-y-2">
                        {risk.mitigation_strategies.map((strategy, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-slate-300">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-white mb-3">Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Responsible Party:</span>
                          <span className="text-white">{risk.responsible_party}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Created:</span>
                          <span className="text-white">{new Date(risk.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Last Updated:</span>
                          <span className="text-white">{new Date(risk.last_updated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-red-400" />
            Risk Assessment & Mitigation
          </h2>
          <p className="text-slate-400">Comprehensive risk analysis and mitigation strategies</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-morphism p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">High Risk Sites</p>
                <p className="text-lg font-bold text-red-400">{highRiskSites}</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
          </div>
          
          <div className="glass-morphism p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">Avg Risk Score</p>
                <p className="text-lg font-bold text-yellow-400">{avgRiskScore.toFixed(1)}</p>
              </div>
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
          
          <div className="glass-morphism p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">New This Week</p>
                <p className="text-lg font-bold text-orange-400">{recentRisks}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          
          <div className="glass-morphism p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-xs">With Mitigation</p>
                <p className="text-lg font-bold text-green-400">{mitigationProgress}</p>
              </div>
              <Shield className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: Eye },
          { id: 'assessments', label: 'Risk Assessments', icon: AlertTriangle },
          { id: 'network', label: 'Network Analysis', icon: Network },
          { id: 'mitigation', label: 'Mitigation Plans', icon: Shield }
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
          {activeTab === 'assessments' && renderAssessments()}
          {activeTab === 'network' && renderOverview()}
          {activeTab === 'mitigation' && renderAssessments()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}