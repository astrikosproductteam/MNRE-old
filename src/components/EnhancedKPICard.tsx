import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Info, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from './Modal';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  details?: {
    description: string;
    historicalData: Array<{ period: string; value: number }>;
    comparison: { national: number; target: number; best: number };
    insights: string[];
  };
}

export default function EnhancedKPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color,
  details
}: KPICardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsModalOpen(true)}
        className={`relative overflow-hidden rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl`}
        style={{
          background: `linear-gradient(135deg, ${color}15 0%, ${color}25 50%, ${color}10 100%)`,
          border: `1px solid ${color}40`,
          boxShadow: `0 0 20px ${color}20, inset 0 0 20px ${color}10`
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-transparent via-current to-transparent animate-pulse"
            style={{ color }}
          />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div 
                className="p-2 rounded-lg backdrop-blur-sm"
                style={{ backgroundColor: `${color}20` }}
              >
                {icon}
              </div>
              <h3 className="text-sm font-medium text-slate-300">{title}</h3>
            </div>
            <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
              <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-white glow-text">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </span>
                {unit && <span className="text-sm text-slate-400">{unit}</span>}
              </div>
              
              {trend && trendValue && (
                <div className="flex items-center space-x-1 mt-2">
                  {getTrendIcon()}
                  <span className={`text-xs ${getTrendColor()}`}>{trendValue}</span>
                </div>
              )}
            </div>

            {details && (
              <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                <Info className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {details && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${title} - Detailed Analysis`}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
              <p className="text-slate-300">{details.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Historical Trend</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {details.historicalData.map((item, index) => (
                  <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                    <div className="text-sm text-slate-400">{item.period}</div>
                    <div className="text-lg font-bold text-white">{item.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Benchmarking</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="text-sm text-slate-400">National Average</div>
                  <div className="text-lg font-bold text-cyan-400">{details.comparison.national}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="text-sm text-slate-400">Target</div>
                  <div className="text-lg font-bold text-green-400">{details.comparison.target}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50">
                  <div className="text-sm text-slate-400">Best Practice</div>
                  <div className="text-lg font-bold text-purple-400">{details.comparison.best}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Key Insights</h4>
              <div className="space-y-2">
                {details.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}