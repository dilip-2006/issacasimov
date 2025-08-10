import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Phone, Hash, Calendar, Package, Save } from 'lucide-react';
import { dataService } from '../../services/dataService';
import { Component, BorrowRequest } from '../../types';

interface AddBorrowingRecordProps {
  onUpdate: () => void;
}

const AddBorrowingRecord: React.FC<AddBorrowingRecordProps> = ({ onUpdate }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [formData, setFormData] = useState({
    studentName: '',
    rollNo: '',
    mobile: '',
    componentId: '',
    quantity: 1,
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setComponents(dataService.getComponents());
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedComponent = components.find(c => c.id === formData.componentId);
      if (!selectedComponent) {
        throw new Error('Component not found');
      }

      if (formData.quantity > selectedComponent.availableQuantity) {
        throw new Error('Not enough components available');
      }

      // Update component availability
      selectedComponent.availableQuantity -= formData.quantity;
      dataService.updateComponent(selectedComponent);

      // Create borrowing record
      const request: BorrowRequest = {
        id: `req-${Date.now()}`,
        studentId: `student-${Date.now()}`,
        studentName: formData.studentName,
        rollNo: formData.rollNo,
        mobile: formData.mobile,
        componentId: selectedComponent.id,
        componentName: selectedComponent.name,
        quantity: formData.quantity,
        requestDate: new Date().toISOString(),
        dueDate: formData.dueDate,
        status: 'approved',
        approvedBy: 'Staff',
        approvedAt: new Date().toISOString(),
      };

      dataService.addRequest(request);

      setNotification({
        type: 'success',
        message: `Successfully recorded borrowing for ${formData.studentName}`,
      });

      // Reset form
      setFormData({
        studentName: '',
        rollNo: '',
        mobile: '',
        componentId: '',
        quantity: 1,
        dueDate: '',
      });

      onUpdate();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to record borrowing',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedComponent = components.find(c => c.id === formData.componentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-green-500/20 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Add Borrowing Record</h2>
            <p className="text-green-200">Record when a student borrows components</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-800/50 backdrop-blur-xl rounded-2xl border border-peacock-500/20 p-6"
      >
        {/* Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
              notification.type === 'success'
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            <span className="font-medium">{notification.message}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Student Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300"
                  placeholder="Enter student name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Roll Number
              </label>
              <div className="relative group">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, rollNo: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300"
                  placeholder="Enter roll number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300"
                  placeholder="Enter mobile number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Component Selection */}
          <div>
            <label className="block text-peacock-300 text-sm font-semibold mb-2">
              Component
            </label>
            <select
              value={formData.componentId}
              onChange={(e) => setFormData(prev => ({ ...prev, componentId: e.target.value }))}
              className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300"
              required
            >
              <option value="">Select a component</option>
              {components.map(component => (
                <option key={component.id} value={component.id}>
                  {component.name} (Available: {component.availableQuantity})
                </option>
              ))}
            </select>
          </div>

          {/* Component Details */}
          {selectedComponent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-r from-peacock-500/10 to-blue-500/10 p-6 rounded-xl border border-peacock-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-peacock-500/20 rounded-xl">
                  <Package className="w-6 h-6 text-peacock-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{selectedComponent.name}</h4>
                  <p className="text-peacock-300">{selectedComponent.category}</p>
                </div>
              </div>
              <p className="text-peacock-200 mb-3">{selectedComponent.description}</p>
              <div className="flex items-center gap-4 text-sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={selectedComponent?.availableQuantity || 1}
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-peacock-300 text-sm font-semibold mb-2">
                Due Date
              </label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-peacock-400 w-5 h-5 group-focus-within:text-peacock-300 transition-colors" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-xl text-white focus:border-peacock-500 focus:ring-2 focus:ring-peacock-500/20 transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting || !formData.componentId}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
              <Save className="w-6 h-6" />
              {isSubmitting ? 'Recording...' : 'Record Borrowing'}
            </div>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddBorrowingRecord;