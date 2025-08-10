import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  Clock, 
  CheckSquare, 
  AlertTriangle,
  RotateCcw,
  TrendingUp,
  Activity,
  FileSpreadsheet,
  Eye
} from 'lucide-react';
import { dataService } from '../../services/dataService';
import { BorrowRequest, Component, SystemStats } from '../../types';
import RequestManagement from './RequestManagement';
import InventoryManagement from './InventoryManagement';
import BorrowHistory from './BorrowHistory';
import ReturnManagement from './ReturnManagement';
import UserAnalytics from './UserAnalytics';
import ExportPreviewModal from './ExportPreviewModal';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalLogins: 0,
    onlineUsers: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalComponents: 0,
    overdueItems: 0
  });

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = () => {
    setStats(dataService.getSystemStats());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
    { id: 'requests', label: 'Requests', icon: CheckSquare, color: 'from-yellow-500 to-orange-500' },
    { id: 'returns', label: 'Returns', icon: RotateCcw, color: 'from-green-500 to-emerald-500' },
    { id: 'inventory', label: 'Inventory', icon: Package, color: 'from-purple-500 to-pink-500' },
    { id: 'analytics', label: 'User Analytics', icon: Activity, color: 'from-indigo-500 to-purple-500' },
    { id: 'history', label: 'History', icon: Clock, color: 'from-indigo-500 to-blue-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'requests':
        return <RequestManagement onUpdate={loadStats} />;
      case 'returns':
        return <ReturnManagement onUpdate={loadStats} />;
      case 'inventory':
        return <InventoryManagement />;
      case 'analytics':
        return <UserAnalytics />;
      case 'history':
        return <BorrowHistory />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-peacock-600/20 via-blue-600/20 to-purple-600/20 rounded-3xl p-8 border border-peacock-500/30"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-peacock-500/10 to-blue-500/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="p-4 bg-gradient-to-br from-peacock-500 to-blue-500 rounded-2xl shadow-lg animate-glow">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Lab Analytics Dashboard</h2>
              <p className="text-peacock-200">Real-time insights into component usage and student activity</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { 
            title: 'Total Users', 
            value: stats.totalUsers, 
            icon: Users, 
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/30',
            subtitle: `${stats.activeUsers} active`
          },
          { 
            title: 'Total Logins', 
            value: stats.totalLogins, 
            icon: Activity, 
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            subtitle: `${stats.onlineUsers} online now`
          },
          { 
            title: 'Pending Requests', 
            value: stats.pendingRequests, 
            icon: Clock, 
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            subtitle: `${stats.totalRequests} total`
          },
          { 
            title: 'Total Components', 
            value: stats.totalComponents, 
            icon: Package, 
            color: 'from-peacock-500 to-blue-500',
            bgColor: 'bg-peacock-500/10',
            borderColor: 'border-peacock-500/30',
            subtitle: `${stats.overdueItems} overdue`
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative overflow-hidden ${stat.bgColor} backdrop-blur-xl rounded-xl sm:rounded-2xl border ${stat.borderColor} p-3 sm:p-6 group hover:shadow-2xl transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div className={`p-2 sm:p-3 bg-gradient-to-br ${stat.color} rounded-lg sm:rounded-xl shadow-lg group-hover:animate-pulse`}>
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-right"
                  >
                    <p className="text-lg sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-peacock-300 text-xs sm:text-sm">{stat.subtitle}</p>
                  </motion.div>
                </div>
                <h3 className="text-peacock-200 font-medium text-xs sm:text-base">{stat.title}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Export Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-dark-800/50 to-dark-700/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">📊 Professional Excel Reports</h3>
            <p className="text-peacock-300 text-sm sm:text-base">Generate comprehensive Excel reports with detailed analytics and professional formatting</p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 206, 209, 0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExportPreview(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-peacock-500 to-blue-500 text-white p-4 sm:p-6 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-peacock-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
                <span className="text-sm sm:text-lg">Preview & Export Professional Excel Report</span>
              </div>
              <p className="text-peacock-100 text-xs sm:text-sm opacity-90">
                Comprehensive Excel workbook with multiple sheets, professional formatting, charts, and detailed component analysis
              </p>
            </div>
          </motion.button>
        </div>

        <div className="mt-4 p-3 sm:p-4 bg-dark-700/30 rounded-xl border border-dark-600">
          <h4 className="text-peacock-400 font-semibold mb-2 text-sm sm:text-base">📋 Professional Excel Report Features:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-peacock-300">
            <ul className="space-y-1">
              <li>• Executive Summary Dashboard with KPIs</li>
              <li>• Detailed Component Inventory Analysis</li>
              <li>• Complete Request History with Status Tracking</li>
              <li>• User Activity and Login Analytics</li>
            </ul>
            <ul className="space-y-1">
              <li>• Professional formatting with branded headers</li>
              <li>• Conditional formatting for status indicators</li>
              <li>• Statistical summaries and trend analysis</li>
              <li>• Ready for presentations and board meetings</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900/50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-peacock-300 text-sm sm:text-lg">Manage lab components and monitor student activity with precision</p>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-2 sm:gap-3 bg-dark-800/50 p-2 sm:p-3 rounded-2xl backdrop-blur-xl border border-dark-700">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative overflow-hidden flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : 'text-peacock-300 hover:text-white hover:bg-dark-700/70'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                  <span className="hidden sm:inline relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content with Enhanced Transitions */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Export Preview Modal */}
      <ExportPreviewModal 
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
      />
    </div>
  );
};

export default AdminDashboard;