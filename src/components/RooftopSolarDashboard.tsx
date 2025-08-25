import React, { useState } from 'react';
import { 
  Sun, Zap, DollarSign, Home, TrendingUp, Clock, Users, 
  BarChart3, PieChart, Activity, Target, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, Download, ChevronDown, ChevronRight, Building2, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import EnhancedKPICard from './EnhancedKPICard';
import FilterDropdown from './FilterDropdown';
import { indianStates, majorCities } from '../data/enhancedMockData';

interface RooftopSolarDashboardProps {}

// Mock data for Rooftop Solar Dashboard
const mockSurplusData = [
  { month: 'Jan 2024', exported: 2.45, value: 1225000, percentage: 15.2 },
  { month: 'Feb 2024', exported: 2.78, value: 1390000, percentage: 16.8 },
  { month: 'Mar 2024', exported: 3.12, value: 1560000, percentage: 18.1 },
  { month: 'Apr 2024', exported: 3.45, value: 1725000, percentage: 19.3 },
  { month: 'May 2024', exported: 3.89, value: 1945000, percentage: 21.2 },
  { month: 'Jun 2024', exported: 3.67, value: 1835000, percentage: 20.5 }
];

const mockSubsidyData = [
  { state: 'Karnataka', disbursed: 45.2, avgPerSystem: 25000, beneficiaries: 18080, processingTime: 28 },
  { state: 'Tamil Nadu', disbursed: 67.8, avgPerSystem: 30000, beneficiaries: 22600, processingTime: 32 },
  { state: 'Maharashtra', disbursed: 89.4, avgPerSystem: 35000, beneficiaries: 25540, processingTime: 25 },
  { state: 'Rajasthan', disbursed: 78.6, avgPerSystem: 28000, beneficiaries: 28070, processingTime: 30 },
  { state: 'Gujarat', disbursed: 56.3, avgPerSystem: 32000, beneficiaries: 17590, processingTime: 26 }
];

const mockConsumerCredits = [
  { segment: 'Residential', billSavings: 3250, paybackPeriod: 5.2, cumulativeSavings: 125.6 },
  { segment: 'Commercial', billSavings: 18500, paybackPeriod: 4.8, cumulativeSavings: 89.4 },
  { segment: 'Industrial', billSavings: 45200, paybackPeriod: 4.2, cumulativeSavings: 67.8 }
];

const mockDiscomData = [
  { parameter: 'Revenue Loss Offset', value: 234.5, unit: '₹ Crores' },
  { parameter: 'Cross-Subsidy Impact', value: -12.3, unit: '%' },
  { parameter: 'Regulatory Credits', value: 45.8, unit: '₹ Crores' },
  { parameter: 'Avoided Power Purchase', value: 567.2, unit: '₹ Crores' }
];

const monthlyTrends = [
  { month: 'Jan', surplus: 2.45, subsidies: 8.2, savings: 15.6, discomOffset: 23.4 },
  { month: 'Feb', surplus: 2.78, subsidies: 9.1, savings: 16.8, discomOffset: 25.1 },
  { month: 'Mar', surplus: 3.12, subsidies: 10.5, savings: 18.2, discomOffset: 27.3 },
  { month: 'Apr', surplus: 3.45, subsidies: 11.8, savings: 19.7, discomOffset: 29.6 },
  { month: 'May', surplus: 3.89, subsidies: 13.2, savings: 21.4, discomOffset: 32.1 },
  { month: 'Jun', surplus: 3.67, subsidies: 12.6, savings: 20.8, discomOffset: 31.2 }
];

const subsidyBreakdown = [
  { category: 'Residential (1-3 kW)', value: 45.2, color: '#22c55e' },
  { category: 'Residential (3-10 kW)', value: 32.8, color: '#3b82f6' },
  { category: 'Commercial (10-100 kW)', value: 28.4, color: '#f59e0b' },
  { category: 'Institutional', value: 15.6, color: '#ef4444' }
];

export default function RooftopSolarDashboard({}: RooftopSolarDashboardProps) {
  const [activeTab, setActiveTab] = useState<'surplus' | 'subsidies' | 'credits' | 'discom'>('surplus');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Filter cities based on selected state
  const availableCities = selectedState === 'all' 
    ? [{ value: 'all', label: 'All Cities', count: 0 }]
    : majorCities[selectedState as keyof typeof majorCities] || [];

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity('all'); // Reset city when state changes
  };

  const renderSurplusTab = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EnhancedKPICard
          title="Total Surplus Exported"
          value="19.36"
          unit="MU"
          trend="up"
          trendValue="+12.5%"
          icon={<ArrowUpRight className="w-6 h-6" style={{ color: '#22c55e' }} />}
          color="#22c55e"
          details={{
            description: 'Total surplus energy exported to grid from rooftop solar installations',
            historicalData: [
              { period: 'Q1 2024', value: 8.35 },
              { period: 'Q2 2024', value: 11.01 },
              { period: 'Q3 2024', value: 15.67 },
              { period: 'Q4 2024', value: 19.36 }
            ],
            comparison: { national: 16.2, target: 25.0, best: 28.4 },
            insights: [
              'Surplus export increased by 32% in last quarter',
              'Peak export hours: 11 AM - 2 PM',
              'Weekend exports 15% higher than weekdays',
              'Monsoon season shows 20% dip in exports'
            ]
          }}
        />

        <EnhancedKPICard
          title="Export Value Realized"
          value="₹9.68"
          unit="Crores"
          trend="up"
          trendValue="+18.3%"
          icon={<DollarSign className="w-6 h-6" style={{ color: '#3b82f6' }} />}
          color="#3b82f6"
          details={{
            description: 'Total value of surplus energy exported at prevailing feed-in tariffs',
            historicalData: [
              { period: 'Q1 2024', value: 4.18 },
              { period: 'Q2 2024', value: 5.51 },
              { period: 'Q3 2024', value: 7.83 },
              { period: 'Q4 2024', value: 9.68 }
            ],
            comparison: { national: 8.1, target: 12.5, best: 14.2 },
            insights: [
              'Average feed-in tariff: ₹5.02/kWh',
              'Commercial segments get highest tariffs',
              'Time-of-day pricing increases value by 8%',
              'Net metering vs gross metering impact analysis'
            ]
          }}
        />

        <EnhancedKPICard
          title="Export Percentage"
          value="18.7"
          unit="%"
          trend="up"
          trendValue="+2.1%"
          icon={<BarChart3 className="w-6 h-6" style={{ color: '#f59e0b' }} />}
          color="#f59e0b"
          details={{
            description: 'Percentage of total generation exported to grid vs self-consumed',
            historicalData: [
              { period: 'Q1 2024', value: 14.2 },
              { period: 'Q2 2024', value: 16.1 },
              { period: 'Q3 2024', value: 17.8 },
              { period: 'Q4 2024', value: 18.7 }
            ],
            comparison: { national: 16.5, target: 20.0, best: 24.3 },
            insights: [
              'Higher export % indicates over-sizing of systems',
              'Weekday exports lower due to higher consumption',
              'Industrial users export only 8% on average',
              'Battery storage can reduce exports by 25%'
            ]
          }}
        />
      </div>

      {/* Surplus Trends Chart */}
      <div className="glass-morphism p-6 interactive-card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Monthly Surplus Export Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockSurplusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '8px',
                color: '#f8fafc'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="exported" 
              stroke="#22c55e" 
              fill="#22c55e" 
              fillOpacity={0.3}
              name="Exported (MU)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Export Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">Export Value by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockSurplusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }} 
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">Export Percentage Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockSurplusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderSubsidiesTab = () => (
    <div className="space-y-6">
      {/* Subsidy KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Total Subsidy Disbursed"
          value="₹337.3"
          unit="Crores"
          trend="up"
          trendValue="+15.2%"
          icon={<DollarSign className="w-6 h-6" style={{ color: '#10b981' }} />}
          color="#10b981"
          details={{
            description: 'Total subsidy amount disbursed under RTS Phase II program',
            historicalData: [
              { period: 'FY 2023', value: 245.8 },
              { period: 'FY 2024', value: 312.4 },
              { period: 'Q1 FY25', value: 337.3 },
              { period: 'Target FY25', value: 450.0 }
            ],
            comparison: { national: 285.0, target: 450.0, best: 520.0 },
            insights: [
              'Karnataka leads with 32% of total disbursals',
              'Processing time improved by 40% this year',
              'Digital disbursement system launched',
              'Average system size increased to 3.2 kW'
            ]
          }}
        />

        <EnhancedKPICard
          title="Average Subsidy/System"
          value="₹29,640"
          unit=""
          trend="stable"
          trendValue="+0.8%"
          icon={<Home className="w-6 h-6" style={{ color: '#3b82f6' }} />}
          color="#3b82f6"
          details={{
            description: 'Average subsidy amount disbursed per rooftop solar system',
            historicalData: [
              { period: 'Q1 2024', value: 28500 },
              { period: 'Q2 2024', value: 29100 },
              { period: 'Q3 2024', value: 29400 },
              { period: 'Q4 2024', value: 29640 }
            ],
            comparison: { national: 28800, target: 32000, best: 35000 },
            insights: [
              'Subsidy rate: ₹14,588/kW for first 3kW',
              'Additional ₹7,294/kW for next 7kW',
              'Higher capacity systems get lower per-kW subsidy',
              'Processing efficiency improved disbursement rates'
            ]
          }}
        />

        <EnhancedKPICard
          title="Total Beneficiaries"
          value="111,880"
          unit="Systems"
          trend="up"
          trendValue="+28.4%"
          icon={<Users className="w-6 h-6" style={{ color: '#8b5cf6' }} />}
          color="#8b5cf6"
          details={{
            description: 'Total number of rooftop solar systems that received subsidy',
            historicalData: [
              { period: 'Q1 2024', value: 78500 },
              { period: 'Q2 2024', value: 89200 },
              { period: 'Q3 2024', value: 103400 },
              { period: 'Q4 2024', value: 111880 }
            ],
            comparison: { national: 95000, target: 150000, best: 180000 },
            insights: [
              'Residential segment accounts for 78% of systems',
              'Average system capacity: 3.8 kW',
              'Rural adoption increased by 45%',
              'Women beneficiaries represent 34% of total'
            ]
          }}
        />

        <EnhancedKPICard
          title="Avg Processing Time"
          value="28.2"
          unit="Days"
          trend="down"
          trendValue="-35.4%"
          icon={<Clock className="w-6 h-6" style={{ color: '#f59e0b' }} />}
          color="#f59e0b"
          details={{
            description: 'Average processing time from application to subsidy disbursement',
            historicalData: [
              { period: 'Q1 2024', value: 45.2 },
              { period: 'Q2 2024', value: 38.7 },
              { period: 'Q3 2024', value: 32.1 },
              { period: 'Q4 2024', value: 28.2 }
            ],
            comparison: { national: 35.5, target: 25.0, best: 18.5 },
            insights: [
              'Digital verification reduced time by 60%',
              'Single window clearance implemented',
              'Automatic disbursement for pre-approved vendors',
              'Target: Reduce to 21 days by end of FY25'
            ]
          }}
        />
      </div>

      {/* State-wise Subsidy Analysis */}
      <div className="glass-morphism p-6 interactive-card">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          State-wise Subsidy Performance
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={mockSubsidyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="state" stroke="#94a3b8" fontSize={12} />
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
            <Bar dataKey="disbursed" fill="#10b981" radius={[4, 4, 0, 0]} name="Disbursed (₹ Cr)" />
            <Bar dataKey="beneficiaries" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Beneficiaries (000s)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subsidy Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">Subsidy by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={subsidyBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {subsidyBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">Processing Time Trends</h3>
          <div className="space-y-4">
            {mockSubsidyData.map((state, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">{state.state}</span>
                  <span className="text-white font-semibold">{state.processingTime} days</span>
                </div>
                <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden alien-progress">
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${(50 - state.processingTime) / 50 * 100}%`,
                      background: `linear-gradient(90deg, ${state.processingTime < 25 ? '#10b981' : state.processingTime < 35 ? '#f59e0b' : '#ef4444'}, ${state.processingTime < 25 ? '#22c55e' : state.processingTime < 35 ? '#fbbf24' : '#f87171'})`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Target: 21 days</span>
                  <span>National Avg: 35 days</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreditsTab = () => (
    <div className="space-y-6">
      {/* Consumer Credits KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EnhancedKPICard
          title="Avg Bill Savings"
          value="₹8,650"
          unit="/month"
          trend="up"
          trendValue="+11.2%"
          icon={<CreditCard className="w-6 h-6" style={{ color: '#22c55e' }} />}
          color="#22c55e"
          details={{
            description: 'Average monthly electricity bill savings per consumer through rooftop solar',
            historicalData: [
              { period: 'Q1 2024', value: 7200 },
              { period: 'Q2 2024', value: 7850 },
              { period: 'Q3 2024', value: 8300 },
              { period: 'Q4 2024', value: 8650 }
            ],
            comparison: { national: 7800, target: 10000, best: 12500 },
            insights: [
              'Commercial users save ₹18,500/month on average',
              'Net metering accounts for 65% of savings',
              'Time-of-day tariff optimization adds 8% savings',
              'Battery integration can increase savings by 15%'
            ]
          }}
        />

        <EnhancedKPICard
          title="Avg Payback Period"
          value="4.8"
          unit="Years"
          trend="down"
          trendValue="-12.7%"
          icon={<TrendingUp className="w-6 h-6" style={{ color: '#3b82f6' }} />}
          color="#3b82f6"
          details={{
            description: 'Average payback period for rooftop solar investment after subsidies',
            historicalData: [
              { period: 'Q1 2024', value: 5.8 },
              { period: 'Q2 2024', value: 5.4 },
              { period: 'Q3 2024', value: 5.0 },
              { period: 'Q4 2024', value: 4.8 }
            ],
            comparison: { national: 5.2, target: 4.0, best: 3.5 },
            insights: [
              'Subsidy reduces payback by 2.2 years',
              'Industrial segment: 3.8 years average',
              'Rising tariffs improve payback timeline',
              'O&M costs account for 8% of lifecycle cost'
            ]
          }}
        />

        <EnhancedKPICard
          title="Cumulative Savings"
          value="₹282.8"
          unit="Crores"
          trend="up"
          trendValue="+24.6%"
          icon={<DollarSign className="w-6 h-6" style={{ color: '#8b5cf6' }} />}
          color="#8b5cf6"
          details={{
            description: 'Total cumulative savings achieved by all rooftop solar consumers',
            historicalData: [
              { period: 'FY 2023', value: 165.4 },
              { period: 'Q1 FY24', value: 198.7 },
              { period: 'Q2 FY24', value: 239.2 },
              { period: 'Q3 FY24', value: 282.8 }
            ],
            comparison: { national: 245.0, target: 400.0, best: 485.0 },
            insights: [
              'Residential savings: ₹156.8 Cr (55%)',
              'Commercial savings: ₹89.4 Cr (32%)',
              'Industrial savings: ₹36.6 Cr (13%)',
              'Annual savings growth rate: 18.5%'
            ]
          }}
        />
      </div>

      {/* Consumer Credits Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">Segment-wise Bill Savings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockConsumerCredits}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="segment" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }} 
              />
              <Bar dataKey="billSavings" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">Payback Period Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockConsumerCredits} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="segment" type="category" stroke="#94a3b8" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }} 
              />
              <Bar dataKey="paybackPeriod" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Consumer Savings Breakdown */}
      <div className="glass-morphism p-6 interactive-card">
        <h3 className="text-lg font-semibold text-white mb-6">Consumer Segment Analysis</h3>
        <div className="space-y-6">
          {mockConsumerCredits.map((segment, index) => (
            <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-white flex items-center">
                  {segment.segment === 'Residential' && <Home className="w-5 h-5 mr-2 text-green-400" />}
                  {segment.segment === 'Commercial' && <Building2 className="w-5 h-5 mr-2 text-blue-400" />}
                  {segment.segment === 'Industrial' && <Activity className="w-5 h-5 mr-2 text-purple-400" />}
                  {segment.segment}
                </h4>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">₹{segment.billSavings.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Monthly Savings</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Payback Period</div>
                  <div className="text-white font-semibold">{segment.paybackPeriod} years</div>
                </div>
                <div>
                  <div className="text-slate-400">Cumulative Savings</div>
                  <div className="text-white font-semibold">₹{segment.cumulativeSavings} Cr</div>
                </div>
                <div>
                  <div className="text-slate-400">ROI</div>
                  <div className="text-green-400 font-semibold">{(100/segment.paybackPeriod).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDiscomTab = () => (
    <div className="space-y-6">
      {/* DISCOM KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockDiscomData.map((item, index) => (
          <EnhancedKPICard
            key={index}
            title={item.parameter}
            value={Math.abs(item.value).toString()}
            unit={item.unit}
            trend={item.value > 0 ? 'up' : item.value < 0 ? 'down' : 'stable'}
            trendValue={`${item.value > 0 ? '+' : ''}${item.value.toFixed(1)}%`}
            icon={
              item.parameter.includes('Revenue') ? <DollarSign className="w-6 h-6" style={{ color: '#22c55e' }} /> :
              item.parameter.includes('Cross-Subsidy') ? <ArrowDownRight className="w-6 h-6" style={{ color: '#ef4444' }} /> :
              item.parameter.includes('Credits') ? <Target className="w-6 h-6" style={{ color: '#3b82f6' }} /> :
              <TrendingUp className="w-6 h-6" style={{ color: '#8b5cf6' }} />
            }
            color={
              item.parameter.includes('Revenue') ? '#22c55e' :
              item.parameter.includes('Cross-Subsidy') ? '#ef4444' :
              item.parameter.includes('Credits') ? '#3b82f6' : '#8b5cf6'
            }
            details={{
              description: `Detailed analysis of ${item.parameter.toLowerCase()} impact on DISCOM operations`,
              historicalData: [
                { period: 'Q1 2024', value: item.value * 0.7 },
                { period: 'Q2 2024', value: item.value * 0.8 },
                { period: 'Q3 2024', value: item.value * 0.9 },
                { period: 'Q4 2024', value: item.value }
              ],
              comparison: { national: item.value * 0.85, target: item.value * 1.2, best: item.value * 1.4 },
              insights: [
                'RTS adoption reducing peak load demand',
                'Grid stability improving with distributed generation',
                'T&D losses reduced by 3.2% in RTS areas',
                'Infrastructure investment needs reassessment'
              ]
            }}
          />
        ))}
      </div>

      {/* DISCOM Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibold text-white mb-4">DISCOM Financial Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
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
              <Area 
                type="monotone" 
                dataKey="discomOffset" 
                stackId="1"
                stroke="#22c55e" 
                fill="#22c55e" 
                fillOpacity={0.6}
                name="Revenue Offset (₹ Cr)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-morphism p-6 interactive-card">
          <h3 className="text-lg font-semibent text-white mb-4">Load Profile Impact</h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Peak Load Reduction</span>
                <span className="text-green-400 font-bold">-8.5%</span>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full w-[85%]" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">T&D Loss Reduction</span>
                <span className="text-blue-400 font-bold">-3.2%</span>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-[32%]" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Grid Stability Score</span>
                <span className="text-purple-400 font-bold">+12.8%</span>
              </div>
              <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-[88%]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Regulatory and Financial Details */}
      <div className="glass-morphism p-6 interactive-card">
        <h3 className="text-lg font-semibold text-white mb-6">Regulatory and Financial Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg border border-green-500/30">
            <div className="text-2xl font-bold text-green-400">₹567.2 Cr</div>
            <div className="text-sm text-green-300">Avoided Power Purchase</div>
            <div className="text-xs text-slate-400 mt-1">Cost saved from not buying power during peak hours</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-400">₹45.8 Cr</div>
            <div className="text-sm text-blue-300">Regulatory Credits</div>
            <div className="text-xs text-slate-400 mt-1">Incentives for meeting RTS Phase II targets</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-lg border border-red-500/30">
            <div className="text-2xl font-bold text-red-400">-12.3%</div>
            <div className="text-sm text-red-300">Cross-Subsidy Impact</div>
            <div className="text-xs text-slate-400 mt-1">Reduction in cross-subsidy collection from C&I</div>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-400">₹234.5 Cr</div>
            <div className="text-sm text-purple-300">Net Revenue Impact</div>
            <div className="text-xs text-slate-400 mt-1">Overall positive impact on DISCOM finances</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center glow-text">
            <Sun className="w-8 h-8 mr-3 text-yellow-400" />
            Rooftop Solar Dashboard
          </h2>
          <p className="text-slate-400">Comprehensive analysis of Surplus, Subsidies & Credits</p>
        </div>
        
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <FilterDropdown
            label="State"
            options={indianStates}
            value={selectedState}
            onChange={handleStateChange}
          />
          <FilterDropdown
            label="City"
            options={availableCities}
            value={selectedCity}
            onChange={setSelectedCity}
          />
          <button className="btn-enhanced flex items-center space-x-2 px-4 py-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
        {[
          { id: 'surplus', label: 'Surplus Energy', icon: Zap },
          { id: 'subsidies', label: 'Subsidies', icon: DollarSign },
          { id: 'credits', label: 'Consumer Credits', icon: CreditCard },
          { id: 'discom', label: 'DISCOM Impact', icon: Building2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg neon-glow' 
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
          {activeTab === 'surplus' && renderSurplusTab()}
          {activeTab === 'subsidies' && renderSubsidiesTab()}
          {activeTab === 'credits' && renderCreditsTab()}
          {activeTab === 'discom' && renderDiscomTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}