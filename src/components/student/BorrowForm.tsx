import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Package, User, Phone, Calendar, Hash, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Component, BorrowRequest } from '../../types';

const BorrowForm: React.FC = () => {
  const { user } = useAuth();
  const [components, setComponents] = useState<Component[]>([]);
  const [formData, setFormData] = useState({
    rollNo: user?.rollNo || '',
    mobile: '',
    componentId: '',
    quantity: 1,
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setComponents(dataService.getComponents());
    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        rollNo: user.rollNo || '',
        mobile: user.mobile || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const selectedComponent = components.find(c => c.id === formData.componentId);
      if (!selectedComponent) {
        throw new Error('Component not found');
      }

      if (formData.quantity > selectedComponent.availableQuantity) {
        throw new Error('Not enough components available');
      }

      const request: BorrowRequest = {
        id: `req-${Date.now()}`,
        studentId: user.id,
        studentName: user.name,
        rollNo: formData.rollNo,
        mobile: formData.mobile,
        componentId: selectedComponent.id,
        componentName: selectedComponent.name,
        quantity: formData.quantity,
        requestDate: new Date().toISOString(),
        dueDate: formData.dueDate,
        status: 'pending',
      };

      dataService.addRequest(request);

      // Add notification for admin
      dataService.addNotification({
        id: `notif-${Date.now()}`,
        userId: 'admin-1',
        title: 'New Component Request',
        message: `${user.name} has requested ${formData.quantity} ${selectedComponent.name}. Review and approve in the admin panel.`,
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });

      setNotification({
        type: 'success',
        message: 'Request submitted successfully! You will be notified once the admin reviews your request.',
      });

      // Reset form
      setFormData({
        rollNo: '',
        mobile: '',
        componentId: '',
        quantity: 1,
        dueDate: '',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit request',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedComponent = components.find(c => c.id === formData.componentId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-0"
    >
      <div className="relative overflow-hidden bg-dark-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-peacock-500/20 p-4 sm:p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-peacock-500/5 to-blue-500/5"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-peacock-500 to-blue-500 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg animate-glow"
            >
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-peacock-200 bg-clip-text text-transparent mb-2 sm:mb-3">
              Submit Component Request
            </h2>
            <p className="text-peacock-300 text-sm sm:text-lg">Request lab components for your robotics projects</p>
          </motion.div>

          {/* Notification */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl border backdrop-blur-sm ${
                notification.type === 'success'
                  ? 'bg-green-500/10 border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
                <span className="font-medium text-sm sm:text-base">{notification.message}</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs sm:text-sm font-semibold mb-2">
                  Roll Number
                </label>
                <div className="relative group">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm sm:text-base"
                    placeholder="Enter your roll number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs sm:text-sm font-semibold mb-2">
                  Mobile Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm sm:text-base"
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Component Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <label className="block text-peacock-300 text-xs sm:text-sm font-semibold mb-2">
                Component
              </label>
              <select
                value={formData.componentId}
                onChange={(e) => setFormData(prev => ({ ...prev, componentId: e.target.value }))}
                className="w-full px-4 py-3 sm:py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500 text-sm sm:text-base"
                required
              >
                <option value="">Select a component</option>
                {components.map(component => (
                  <option key={component.id} value={component.id}>
                    {component.name} (Available: {component.availableQuantity})
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Component Details */}
            {selectedComponent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-r from-peacock-500/10 to-blue-500/10 p-4 sm:p-6 rounded-xl border border-peacock-500/20"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-peacock-500/20 rounded-xl">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-peacock-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base sm:text-lg">{selectedComponent.name}</h4>
                    <p className="text-peacock-300 text-sm">{selectedComponent.category}</p>
                  </div>
                </div>
                <p className="text-peacock-200 text-xs sm:text-sm mb-3">{selectedComponent.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <span className="text-green-400 font-semibold">
                    ✅ Available: {selectedComponent.availableQuantity} units
                  </span>
                  <span className="text-peacock-300">
                    Total: {selectedComponent.totalQuantity} units
                  </span>
                </div>
              </motion.div>
            )}

            {/* Quantity and Due Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
            >
              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs sm:text-sm font-semibold mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedComponent?.availableQuantity || 1}
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 sm:py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 hover:border-dark-500 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-peacock-300 text-xs sm:text-sm font-semibold mb-2">
                  Due Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-4 h-4 sm:w-5 sm:h-5 group-focus-within:text-peacock-300 transition-colors" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 sm:py-4 bg-dark-700/50 border border-dark-600 rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300 group-hover:border-dark-500 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0, 206, 209, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting || !formData.componentId}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-peacock-500 to-blue-500 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-peacock-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <Send className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
                {isSubmitting ? 'Submitting Request...' : 'Submit Request'}
              </div>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default BorrowForm;