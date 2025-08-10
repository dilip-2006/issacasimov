import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Clock, CheckCircle, XCircle, AlertCircle, Calendar, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { BorrowRequest } from '../../types';

const BorrowedItems: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'returned'>('all');

  useEffect(() => {
    if (user) {
      const userRequests = dataService.getUserRequests(user.id);
      setRequests(userRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'returned':
        return <Package className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'returned':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      default:
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'returned' || status === 'rejected') return false;
    return new Date(dueDate) < new Date();
  };

  const filteredRequests = requests.filter(request => 
    filter === 'all' || request.status === filter
  );

  if (requests.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-peacock-500/20 to-blue-500/20 rounded-full mb-6"
        >
          <Package className="w-10 h-10 text-peacock-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-3">No Items Yet</h3>
        <p className="text-peacock-300 text-lg">You haven't borrowed any components yet. Submit a request to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-1 sm:gap-2 bg-dark-800/30 p-2 sm:p-3 rounded-xl backdrop-blur-sm"
      >
        {[
          { key: 'all', label: 'All Items', count: requests.length },
          { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
          { key: 'approved', label: 'Approved', count: requests.filter(r => r.status === 'approved').length },
          { key: 'returned', label: 'Returned', count: requests.filter(r => r.status === 'returned').length },
          { key: 'rejected', label: 'Rejected', count: requests.filter(r => r.status === 'rejected').length },
        ].map((filterOption, index) => (
          <motion.button
            key={filterOption.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
              filter === filterOption.key
                ? 'bg-gradient-to-r from-peacock-500 to-blue-500 text-white shadow-lg'
                : 'text-peacock-300 hover:text-white hover:bg-dark-700/50'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="hidden sm:inline">{filterOption.label}</span>
            <span className="sm:hidden">{filterOption.label.split(' ')[0]}</span>
            <span> ({filterOption.count})</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Items Grid */}
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence>
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className="relative overflow-hidden bg-dark-800/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-peacock-500/20 p-4 sm:p-6 hover:border-peacock-500/40 transition-all duration-300"
            >
              {/* Status Indicator Bar */}
              <div className={`absolute top-0 left-0 w-full h-1 ${
                request.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                request.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                request.status === 'returned' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}></div>

              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-peacock-500/20 rounded-lg sm:rounded-xl">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-peacock-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg sm:text-xl">{request.componentName}</h3>
                    <p className="text-peacock-300 text-sm">Quantity: {request.quantity}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {isOverdue(request.dueDate, request.status) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 sm:px-3 py-1 rounded-full text-red-400 text-xs sm:text-sm font-medium"
                    >
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      Overdue
                    </motion.div>
                  )}
                  <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-full border font-semibold text-xs sm:text-sm ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                  <div>
                    <p className="text-peacock-300">Request Date</p>
                    <p className="text-white font-medium">{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                  <div>
                    <p className="text-peacock-300">Due Date</p>
                    <p className={`font-medium ${isOverdue(request.dueDate, request.status) ? 'text-red-400' : 'text-white'}`}>
                      {new Date(request.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                  <div>
                    <p className="text-peacock-300">Roll Number</p>
                    <p className="text-white font-medium">{request.rollNo}</p>
                  </div>
                </div>
              </div>

              {/* Status Messages */}
              {request.status === 'approved' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 sm:mt-4 p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <div>
                      <p className="text-green-400 font-semibold text-sm sm:text-base">Request Approved!</p>
                      <p className="text-green-300 text-xs sm:text-sm mt-1">Come and get it in the Isaac Asimov Robotics Lab</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {request.status === 'rejected' && request.notes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <div>
                      <p className="text-red-400 font-semibold text-sm sm:text-base">Request Rejected</p>
                      <p className="text-red-300 text-xs sm:text-sm mt-1">{request.notes}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {request.status === 'returned' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <div>
                      <p className="text-blue-400 font-semibold text-sm sm:text-base">Item Returned</p>
                      <p className="text-blue-300 text-xs sm:text-sm mt-1">
                        Returned on {request.returnedAt && new Date(request.returnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRequests.length === 0 && filter !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-peacock-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No {filter} Items</h3>
          <p className="text-peacock-300">You don't have any {filter} requests at the moment.</p>
        </motion.div>
      )}
    </div>
  );
};

export default BorrowedItems;