import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Users, 
  Package, 
  Clock, 
  TrendingUp,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Layers,
  UserCheck,
  Calendar,
  Shield
} from 'lucide-react';
import { excelService } from '../../services/excelService';
import { dataService } from '../../services/dataService';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({ isOpen, onClose }) => {
  const [previewData, setPreviewData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const data = dataService.getData();
      const preview = excelService.generatePreviewData(data);
      setPreviewData(preview);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleDownloadExcel = () => {
    const data = dataService.getData();
    excelService.exportToExcel(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-dark-800 rounded-3xl border border-peacock-500/20 w-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-peacock-500/10 to-blue-500/10 border-b border-peacock-500/20 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-peacock-500 to-blue-500 rounded-xl shadow-lg">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Professional Excel Report Preview</h2>
                  <p className="text-peacock-300">Comprehensive lab management analytics with 8 detailed sheets</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-peacock-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peacock-500"></div>
              </div>
            ) : previewData ? (
              <div className="space-y-8">
                {/* Executive Summary */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-peacock-400" />
                    Executive Dashboard & Analytics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { 
                        label: 'Total Users', 
                        value: previewData.summary.totalUsers, 
                        icon: Users,
                        color: 'from-blue-500 to-cyan-500',
                        bgColor: 'bg-blue-500/10',
                        change: '+12%'
                      },
                      { 
                        label: 'Active Users', 
                        value: previewData.summary.activeUsers, 
                        icon: UserCheck,
                        color: 'from-green-500 to-emerald-500',
                        bgColor: 'bg-green-500/10',
                        change: '+8%'
                      },
                      { 
                        label: 'Total Requests', 
                        value: previewData.summary.totalRequests, 
                        icon: Package,
                        color: 'from-purple-500 to-pink-500',
                        bgColor: 'bg-purple-500/10',
                        change: '+25%'
                      },
                      { 
                        label: 'Checked Out Items', 
                        value: previewData.summary.checkedOutItems, 
                        icon: Clock,
                        color: 'from-orange-500 to-red-500',
                        bgColor: 'bg-orange-500/10',
                        change: 'Active'
                      }
                    ].map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`${stat.bgColor} backdrop-blur-xl rounded-xl border border-peacock-500/20 p-4`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-2xl font-bold text-white">{stat.value}</p>
                              <p className="text-peacock-300 text-sm">{stat.label}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <TrendingUp className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 font-medium">{stat.change}</span>
                            <span className="text-peacock-400">vs last month</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Component Tracking */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-peacock-400" />
                    Enhanced Component Tracking & Analysis
                  </h3>
                  <div className="bg-dark-700/30 rounded-xl border border-peacock-500/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-dark-700/50">
                          <tr>
                            <th className="text-left p-4 text-peacock-300 font-medium">Component</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Category</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Total Stock</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Available</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">In Use</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Times Requested</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Current Borrowers</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Utilization</th>
                            <th className="text-left p-4 text-peacock-300 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.detailedComponents.slice(0, 8).map((component: any, index: number) => {
                            const utilizationPercent = parseFloat(component.utilization);
                            const getStatusIcon = () => {
                              if (component.available === 0) return <AlertTriangle className="w-4 h-4 text-red-400" />;
                              if (utilizationPercent > 80) return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
                              return <CheckCircle className="w-4 h-4 text-green-400" />;
                            };
                            
                            const getStatusText = () => {
                              if (component.available === 0) return 'Out of Stock';
                              if (utilizationPercent > 80) return 'High Demand';
                              if (utilizationPercent > 50) return 'Moderate Use';
                              return 'Available';
                            };

                            const getStatusColor = () => {
                              if (component.available === 0) return 'text-red-400 bg-red-500/10';
                              if (utilizationPercent > 80) return 'text-yellow-400 bg-yellow-500/10';
                              if (utilizationPercent > 50) return 'text-blue-400 bg-blue-500/10';
                              return 'text-green-400 bg-green-500/10';
                            };

                            return (
                              <tr key={component.id} className="border-t border-dark-600 hover:bg-dark-700/20">
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-peacock-400" />
                                    <span className="text-white font-medium">{component.name}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-peacock-300">{component.category}</td>
                                <td className="p-4 text-white font-semibold">{component.totalQuantity}</td>
                                <td className="p-4 text-white">{component.available}</td>
                                <td className="p-4 text-white">{component.inUse}</td>
                                <td className="p-4 text-white">{component.timesRequested}</td>
                                <td className="p-4 text-peacock-300 text-sm max-w-32 truncate" title={component.currentBorrowers}>
                                  {component.currentBorrowers}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-dark-600 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-peacock-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-white text-sm font-medium">{component.utilization}</span>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                                    {getStatusIcon()}
                                    {getStatusText()}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {previewData.detailedComponents.length > 8 && (
                      <div className="p-3 bg-dark-700/20 border-t border-dark-600 text-center">
                        <p className="text-peacock-300 text-sm">
                          +{previewData.detailedComponents.length - 8} more components with detailed tracking in the full export
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Checked Out Components Summary */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-peacock-400" />
                    Currently Checked Out Components
                  </h3>
                  <div className="bg-dark-700/30 rounded-xl border border-peacock-500/20 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-dark-700/50">
                          <tr>
                            <th className="text-left p-3 text-peacock-300 font-medium">Student</th>
                            <th className="text-left p-3 text-peacock-300 font-medium">Roll No</th>
                            <th className="text-left p-3 text-peacock-300 font-medium">Component</th>
                            <th className="text-left p-3 text-peacock-300 font-medium">Quantity</th>
                            <th className="text-left p-3 text-peacock-300 font-medium">Due Date</th>
                            <th className="text-left p-3 text-peacock-300 font-medium">Days Remaining</th>
                            <th className="text-left p-3 text-peacock-300 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.checkedOutSummary.slice(0, 6).map((item: any, index: number) => {
                            const isOverdue = item.daysRemaining < 0;
                            const isDueSoon = item.daysRemaining <= 3 && item.daysRemaining >= 0;

                            return (
                              <tr key={index} className="border-t border-dark-600">
                                <td className="p-3 text-white">{item.studentName}</td>
                                <td className="p-3 text-white">{item.rollNo}</td>
                                <td className="p-3 text-white">{item.componentName}</td>
                                <td className="p-3 text-white">{item.quantity}</td>
                                <td className="p-3 text-peacock-300 text-sm">
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-white">
                                  {isOverdue ? `${Math.abs(item.daysRemaining)} days overdue` : 
                                   item.daysRemaining === 0 ? 'Due today' :
                                   `${item.daysRemaining} days`}
                                </td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    isOverdue ? 'bg-red-500/20 text-red-400' :
                                    isDueSoon ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-green-500/20 text-green-400'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {previewData.checkedOutSummary.length > 6 && (
                      <div className="p-3 bg-dark-700/20 border-t border-dark-600 text-center">
                        <p className="text-peacock-300 text-sm">
                          +{previewData.checkedOutSummary.length - 6} more checked out items in the full export
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Activity Report */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-peacock-400" />
                    User Activity & Login Analytics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-dark-700/30 rounded-xl border border-peacock-500/20 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">Total Sessions</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{previewData.systemHealth.totalSessions}</p>
                      <p className="text-peacock-300 text-sm">All time login sessions</p>
                    </div>
                    <div className="bg-dark-700/30 rounded-xl border border-peacock-500/20 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-5 h-5 text-green-400" />
                        <span className="text-white font-semibold">Active Sessions</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{previewData.systemHealth.activeSessions}</p>
                      <p className="text-peacock-300 text-sm">Currently online</p>
                    </div>
                    <div className="bg-dark-700/30 rounded-xl border border-peacock-500/20 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-semibold">Avg Duration</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{previewData.systemHealth.avgSessionDuration}</p>
                      <p className="text-peacock-300 text-sm">Per session</p>
                    </div>
                    <div className="bg-dark-700/30 rounded-xl border border-peacock-500/20 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        <span className="text-white font-semibold">Peak Time</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{previewData.systemHealth.peakUsageTime}</p>
                      <p className="text-peacock-300 text-sm">Most active hour</p>
                    </div>
                  </div>
                </div>

                {/* Excel Report Contents */}
                <div className="bg-gradient-to-r from-peacock-500/10 to-blue-500/10 rounded-xl border border-peacock-500/20 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">📊 Complete Excel Report Contents (8 Professional Sheets)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <h4 className="text-peacock-400 font-semibold mb-3">📋 Report Sheets:</h4>
                      <ul className="text-peacock-300 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-peacock-500 rounded-full"></div>
                          Executive Dashboard & Analytics
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Enhanced Component Tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          User Activity Report
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Complete Request Details
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Checked Out Components
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Inventory Status & Management
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                          Login Sessions & Security
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          System Analytics & Performance
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-peacock-400 font-semibold mb-3">✨ Professional Features:</h4>
                      <ul className="text-peacock-300 space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Executive-grade formatting & styling
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Comprehensive component tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Detailed user activity analytics
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Real-time checkout status tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Login session security analysis
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Performance metrics & KPIs
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Strategic recommendations
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          Ready for board presentations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="border-t border-peacock-500/20 p-6 bg-dark-700/30">
            <div className="flex items-center justify-between">
              <div className="text-peacock-300 text-sm">
                <p className="font-semibold">Isaac Asimov Robotics Lab Management System</p>
                <p>Professional Excel Report • Generated on {new Date().toLocaleString()}</p>
                <p className="text-xs mt-1">8 comprehensive sheets with detailed analytics and tracking</p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-6 py-3 bg-dark-600 text-white rounded-xl font-medium hover:bg-dark-500 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 206, 209, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadExcel}
                  className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    Download Professional Excel Report
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportPreviewModal;