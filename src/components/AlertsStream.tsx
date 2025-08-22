import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Check, Clock } from 'lucide-react';
import { Alert } from '../types';
import { format } from 'date-fns';

interface AlertsStreamProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
}

const severityColors = {
  critical: 'bg-red-100 border-red-500 text-red-800',
  high: 'bg-orange-100 border-orange-500 text-orange-800',
  medium: 'bg-yellow-100 border-yellow-500 text-yellow-800',
  low: 'bg-blue-100 border-blue-500 text-blue-800'
};

const severityIcons = {
  critical: '🚨',
  high: '⚠️',
  medium: '⚡',
  low: 'ℹ️'
};

export default function AlertsStream({ alerts, onAcknowledge, onDismiss }: AlertsStreamProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<Alert[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show only unacknowledged alerts, sorted by severity and timestamp
    const unacknowledged = alerts
      .filter(alert => !alert.acknowledged)
      .sort((a, b) => {
        const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const severityDiff = (severityOrder[a.severity as keyof typeof severityOrder] || 4) - (severityOrder[b.severity as keyof typeof severityOrder] || 4);
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    
    setVisibleAlerts(unacknowledged);
  }, [alerts]);

  if (visibleAlerts.length === 0) return null;

  const criticalCount = visibleAlerts.filter(a => a.severity === 'critical').length;
  const highCount = visibleAlerts.filter(a => a.severity === 'high').length;

  return (
    <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)]">
      {/* Alert Summary Bar */}
      <div 
        className="bg-white rounded-t-lg shadow-lg border-l-4 border-red-500 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-medium text-gray-900">
              {visibleAlerts.length} Active Alert{visibleAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            {criticalCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                {criticalCount} Critical
              </span>
            )}
            {highCount > 0 && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                {highCount} High
              </span>
            )}
            <button className="text-gray-400 hover:text-gray-600">
              {isExpanded ? '▼' : '▲'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Alert List */}
      {isExpanded && (
        <div className="bg-white rounded-b-lg shadow-lg border-t border-gray-200 max-h-96 overflow-y-auto">
          {visibleAlerts.slice(0, 10).map(alert => (
            <div
              key={alert.id}
              className={`p-3 border-l-4 border-b border-gray-100 last:border-b-0 ${severityColors[alert.severity]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm">{severityIcons[alert.severity]}</span>
                    <span className="font-medium text-sm">
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs opacity-75">
                      {alert.site_id}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-2 text-xs opacity-75">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(alert.timestamp), 'MMM dd, HH:mm')}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAcknowledge(alert.id);
                    }}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title="Acknowledge"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDismiss(alert.id);
                    }}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {visibleAlerts.length > 10 && (
            <div className="p-3 text-center text-sm text-gray-500 bg-gray-50">
              +{visibleAlerts.length - 10} more alerts
            </div>
          )}
        </div>
      )}
    </div>
  );
}