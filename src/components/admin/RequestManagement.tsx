import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Package, User, Phone, Calendar, AlertTriangle, Search, Filter } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { BorrowRequest, Component } from '../../types';

interface RequestManagementProps {
  onUpdate: () => void;
}

const RequestManagement: React.FC<RequestManagementProps> = ({ onUpdate }) => {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = dataService.getRequests();
    setRequests(allRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
  };

  const handleApprove = (request: BorrowRequest) => {
    const components = dataService.getComponents();
    const component = components.find(c => c.id === request.componentId);
    
    if (!component || component.availableQuantity < request.quantity) {
      alert('Not enough components available!');
      return;
    }

    // Update component availability
    component.availableQuantity -= request.quantity;
    dataService.updateComponent(component);

    // Update request status
    const updatedRequest = {
      ...request,
      status: 'approved' as const,
      approvedBy: 'Administrator',
      approvedAt: new Date().toISOString(),
    };
    dataService.updateRequest(updatedRequest);

    // Add notification for student
    dataService.addNotification({
      id: `notif-${Date.now()}`,
      userId: request.studentId,
      title: 'Request Approved! 🎉',
      message: `Your request for ${request.componentName} x${request.quantity} has been approved. Come and get it in the Isaac Asimov Robotics Lab.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
    });

    loadRequests();
    onUpdate();
  };

  const handleReject = (request: BorrowRequest, reason: string) => {
    const updatedRequest = {
      ...request,
      status: 'rejected' as const,
      notes: reason,
    };
    dataService.updateRequest(updatedRequest);

    // Add notification for student
    dataService.addNotification({
      id: `notif-${Date.now()}`,
      userId: request.studentId,
      title: 'Request Update',
      message: `Your request for ${request.componentName} has been reviewed. ${reason}`,
      type: 'error',
      read: false,
      createdAt: new Date().toISOString(),
    });

    loadRequests();
    onUpdate();
  };

  const filteredRequests = requests.filter(request => {
    const matchesFilter = filter === 'all' || request.status === filter;
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isOverdue = (dueDate: string, status: string) => {
    if (status === 'returned' || status === 'rejected') return false;
    return new Date(dueDate) < new Date();
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-yellow-500/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Request Management</h2>
            <p className="text-yellow-200">Review and process student component requests</p>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-200 text-sm sm:text-base"
          />
        </div>
        
        <div className="flex flex-wrap gap-1 sm:gap-2 bg-dark-800/30 p-2 rounded-xl">
          {['all', 'pending', 'approved', 'rejected'].map((filterOption) => (
            <motion.button
              key={filterOption}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilter(filterOption as any)}
              className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 capitalize text-xs sm:text-sm ${
                filter === filterOption
                  ? 'bg-peacock-500 text-white shadow-lg'
                  : 'text-peacock-300 hover:text-white hover:bg-dark-700/50'
              }`}
            >
              <span className="hidden sm:inline">{filterOption}</span>
              <span className="sm:hidden">{filterOption.slice(0, 3)}</span>
              <span> ({requests.filter(r => filterOption === 'all' || r.status === filterOption).length})</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Requests List */}
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
              {/* Priority Indicator */}
              {request.status === 'pending' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-peacock-500/20 rounded-lg sm:rounded-xl">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-peacock-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg sm:text-xl">{request.componentName}</h3>
                      <p className="text-peacock-300 text-sm">Quantity: {request.quantity}</p>
                    </div>
                    {isOverdue(request.dueDate, request.status) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 sm:px-3 py-1 rounded-full text-red-400 text-xs sm:text-sm font-medium"
                      >
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Overdue
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                      <div>
                        <p className="text-peacock-300">Student</p>
                        <p className="text-white font-semibold">{request.studentName}</p>
                        <p className="text-peacock-300 text-xs sm:text-xs">Roll: {request.rollNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                      <div>
                        <p className="text-peacock-300">Mobile</p>
                        <p className="text-white">{request.mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                      <div>
                        <p className="text-peacock-300">Request Date</p>
                        <p className="text-white">{new Date(request.requestDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-peacock-400" />
                      <div>
                        <p className="text-peacock-300">Due Date</p>
                        <p className={`font-semibold ${isOverdue(request.dueDate, request.status) ? 'text-red-400' : 'text-white'}`}>
                          {new Date(request.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 sm:gap-3">
                  <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border text-xs sm:text-sm font-semibold ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(request)}
                        className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-300 text-xs sm:text-sm"
                      >
                        <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          Approve
                        </div>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) handleReject(request, reason);
                        }}
                        className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-semibold shadow-lg transition-all duration-300 text-xs sm:text-sm"
                      >
                        <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          Reject
                        </div>
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {request.notes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-red-400 font-medium text-sm sm:text-base">Rejection Reason:</p>
                  <p className="text-red-300 text-xs sm:text-sm mt-1">{request.notes}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRequests.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full mb-6"
          >
            <Package className="w-10 h-10 text-yellow-400" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3">No Requests Found</h3>
          <p className="text-peacock-300 text-lg">
            {searchTerm || filter !== 'all' ? 'No requests match your current filters.' : 'No requests have been submitted yet.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default RequestManagement;