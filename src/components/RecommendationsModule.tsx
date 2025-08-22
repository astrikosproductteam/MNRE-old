import React, { useState } from 'react';
import { 
  Lightbulb, CheckCircle, Clock, AlertTriangle, TrendingUp, 
  DollarSign, Users, Settings, Wrench, Shield, Zap, Target,
  ThumbsUp, ThumbsDown, MessageSquare, Calendar, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '../types';

interface RecommendationsModuleProps {
  recommendations: Recommendation[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onImplement: (id: string) => void;
}

const priorityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const typeIcons = {
  maintenance: Wrench,
  optimization: TrendingUp,
  policy: Shield,
  investment: DollarSign,
  operational: Settings
};

const statusColors = {
  pending: 'bg-gray-500/20 text-gray-400',
  approved: 'bg-green-500/20 text-green-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
  rejected: 'bg-red-500/20 text-red-400'
};

export default function RecommendationsModule({ 
  recommendations, 
  onApprove, 
  onReject, 
  onImplement 
}: RecommendationsModuleProps) {
  // Calculate recommendation metrics
  const pendingCount = recommendations.filter(r => r.status === 'pending').length;
  const approvedCount = recommendations.filter(r => r.status === 'approved').length;
  const totalImpact = recommendations.reduce((sum, r) => sum + r.expected_impact.financial, 0);
  const criticalCount = recommendations.filter(r => r.priority === 'critical').length;

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedRec, setExpandedRec] = useState<string | null>(null);

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedType !== 'all' && rec.type !== selectedType) return false;
    if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && rec.status !== selectedStatus) return false;
    return true; // Simplified filtering for now
  });

  const getImpactColor = (impact: number) => {
    if (impact > 1000000) return 'text-green-400';
    if (impact > 500000) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
            <Lightbulb className="w-8 h-8 mr-3 text-yellow-400" />
            Recommendations & Advisories
          </h2>
          <p className="text-slate-400">AI-powered recommendations for stakeholders</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">
            {filteredRecommendations.length} recommendations available
          </span>
          <div className="flex items-center space-x-4 text-xs">
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
              {pendingCount} Pending
            </span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
              {approvedCount} Approved
            </span>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
              {criticalCount} Critical
            </span>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Impact</p>
              <p className="text-xl font-bold text-green-400">₹{(totalImpact / 1000000).toFixed(1)}M</p>
            </div>
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
        </div>
        
        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Review</p>
              <p className="text-xl font-bold text-yellow-400">{pendingCount}</p>
            </div>
            <Clock className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
        
        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Ready to Implement</p>
              <p className="text-xl font-bold text-blue-400">{approvedCount}</p>
            </div>
            <CheckCircle className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        
        <div className="glass-morphism p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Critical Priority</p>
              <p className="text-xl font-bold text-red-400">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-morphism p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Filters:</span>
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="maintenance">Maintenance</option>
            <option value="optimization">Optimization</option>
            <option value="policy">Policy</option>
            <option value="investment">Investment</option>
            <option value="operational">Operational</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.map((rec) => {
          const IconComponent = typeIcons[rec.type];
          const isExpanded = expandedRec === rec.id;

          return (
            <motion.div
              key={rec.id}
              className="glass-morphism p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${priorityColors[rec.priority]} border`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[rec.priority]}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[rec.status]}`}>
                        {rec.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3">{rec.description}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-slate-400">Impact:</span>
                        <span className={`font-semibold ${getImpactColor(rec.expected_impact.financial)}`}>
                          {formatCurrency(rec.expected_impact.financial)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-400">Timeline:</span>
                        <span className="text-white">{rec.expected_impact.timeline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-400">Stakeholders:</span>
                        <span className="text-white">{rec.target_stakeholders.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setExpandedRec(isExpanded ? null : rec.id)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
                  >
                    {isExpanded ? 'Less' : 'More'}
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-slate-700 pt-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Rationale & Evidence */}
                      <div>
                        <h4 className="text-md font-semibold text-white mb-3">Rationale & Evidence</h4>
                        <p className="text-slate-300 mb-4">{rec.rationale}</p>
                        <div className="space-y-3">
                          {rec.evidence.map((evidence, index) => (
                            <div key={index} className="p-3 bg-slate-800/50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-medium text-slate-300">{evidence.data_source}</span>
                                <span className="text-xs text-slate-400">{evidence.time_period}</span>
                              </div>
                              <p className="text-sm text-slate-400 mb-2">{evidence.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">
                                  Confidence: {(evidence.confidence_level * 100).toFixed(0)}%
                                </span>
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

                      {/* Implementation Details */}
                      <div>
                        <h4 className="text-md font-semibold text-white mb-3">Implementation Plan</h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-slate-300 mb-2">Steps:</h5>
                            <div className="space-y-2">
                              {rec.implementation_steps.map((step, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm text-slate-300">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-slate-300 mb-2">Success Metrics:</h5>
                            <div className="space-y-1">
                              {rec.success_metrics.map((metric, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Target className="w-3 h-3 text-green-400" />
                                  <span className="text-sm text-slate-400">{metric}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-800/50 p-3 rounded-lg">
                            <h5 className="text-sm font-medium text-slate-300 mb-2">Expected Impact:</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Financial:</span>
                                <span className={`font-semibold ${getImpactColor(rec.expected_impact.financial)}`}>
                                  {formatCurrency(rec.expected_impact.financial)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Operational:</span>
                                <span className="text-white">{rec.expected_impact.operational}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Timeline:</span>
                                <span className="text-white">{rec.expected_impact.timeline}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
                      <div className="flex items-center space-x-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {new Date(rec.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                          {rec.status === 'pending' && (
                            <>
                              <button
                                onClick={() => onReject(rec.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>Reject</span>
                              </button>
                              <button
                                onClick={() => onApprove(rec.id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Approve</span>
                              </button>
                            </>
                          )}
                        
                          {rec.status === 'approved' && (
                            <button
                              onClick={() => onImplement(rec.id)}
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Implement</span>
                            </button>
                          )}

                        <button className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="glass-morphism p-12 text-center">
          <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No Recommendations</h3>
          <p className="text-slate-500">No recommendations available for your current filters and role.</p>
        </div>
      )}
    </div>
  );
}