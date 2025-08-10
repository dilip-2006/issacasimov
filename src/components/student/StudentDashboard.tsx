import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Clock, Contact } from 'lucide-react';
import BorrowForm from './BorrowForm';
import BorrowedItems from './BorrowedItems';
import DueDates from './DueDates';
import AdminContact from './AdminContact';

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('borrow');

  const tabs = [
    { id: 'borrow', label: 'Submit Request', icon: Plus },
    { id: 'items', label: 'My Items', icon: Package },
    { id: 'due', label: 'Due Dates', icon: Clock },
    { id: 'contact', label: 'Admin Contact', icon: Contact },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'borrow':
        return <BorrowForm />;
      case 'items':
        return <BorrowedItems />;
      case 'due':
        return <DueDates />;
      case 'contact':
        return <AdminContact />;
      default:
        return <BorrowForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-peacock-300 text-sm sm:text-base">Manage your component borrowing and returns</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap gap-1 sm:gap-2 bg-dark-800/50 p-2 rounded-xl backdrop-blur-sm">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-peacock-500 to-blue-500 text-white shadow-lg'
                      : 'text-peacock-300 hover:text-white hover:bg-dark-700/50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDashboard;