import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { BorrowRequest } from '../../types';

const DueDates: React.FC = () => {
  const { user } = useAuth();
  const [upcomingItems, setUpcomingItems] = useState<BorrowRequest[]>([]);

  useEffect(() => {
    if (user) {
      const userRequests = dataService.getUserRequests(user.id);
      const approved = userRequests.filter(r => r.status === 'approved');
      const sorted = approved.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setUpcomingItems(sorted);
    }
  }, [user]);

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const getDueDateStatus = (dueDate: string) => {
    const days = getDaysRemaining(dueDate);
    if (days < 0) return { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', text: 'Overdue', icon: AlertTriangle };
    if (days === 0) return { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'Due Today', icon: AlertTriangle };
    if (days <= 3) return { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', text: 'Due Soon', icon: Clock };
    return { color: 'text-peacock-400', bg: 'bg-peacock-500/10 border-peacock-500/20', text: 'Upcoming', icon: Calendar };
  };

  if (upcomingItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Calendar className="w-16 h-16 text-peacock-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Due Dates</h3>
        <p className="text-peacock-300">You don't have any approved items with upcoming due dates.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {upcomingItems.map((item, index) => {
          const status = getDueDateStatus(item.dueDate);
          const daysRemaining = getDaysRemaining(item.dueDate);
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border ${status.bg} hover:border-opacity-60 transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${status.color}`} />
                  <div>
                    <h3 className="text-white font-semibold">{item.componentName}</h3>
                    <p className="text-peacock-300 text-sm">Quantity: {item.quantity}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${status.color}`}>{status.text}</p>
                  <p className="text-sm text-peacock-300">
                    {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
                     daysRemaining === 0 ? 'Today' :
                     `${daysRemaining} days remaining`}
                  </p>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-dark-600">
                <div className="flex justify-between text-sm">
                  <span className="text-peacock-300">Due Date:</span>
                  <span className="text-white">{new Date(item.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-peacock-300">Roll No:</span>
                  <span className="text-white">{item.rollNo}</span>
                </div>
              </div>

              {daysRemaining <= 1 && daysRemaining >= 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                >
                  <p className="text-yellow-400 text-sm font-medium">⚠️ Reminder: Please return this item soon!</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DueDates;