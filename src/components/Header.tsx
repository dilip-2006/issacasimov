import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const updateOnlineCount = () => {
      const stats = dataService.getSystemStats();
      setOnlineCount(stats.onlineUsers);
    };
    
    updateOnlineCount();
    const interval = setInterval(updateOnlineCount, 30000); // Update every 30 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-dark-800/95 backdrop-blur-lg border-b border-dark-700/50 sticky top-0 z-40 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-h-[64px]">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-peacock-500 to-blue-500 rounded-lg shadow-lg"
            >
              <Cpu className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-sm sm:text-lg">Isaac Asimov Lab</h1>
              <p className="text-peacock-300 text-xs sm:text-sm">Staff Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Online Users Count */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-3 py-2 rounded-full backdrop-blur-sm"
            >
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                Lab Management
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </motion.div>
            
            {user && (
              <div className="text-right">
                <p className="text-white font-medium text-sm">{user.name}</p>
                <p className="text-peacock-300 text-xs">Staff Member</p>
              </div>
            )}
            
            {!user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Simple login for staff
                  const { login } = useAuth();
                  login('admin@issacasimov.in', 'ralab');
                }}
                className="bg-gradient-to-r from-peacock-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:from-peacock-600 hover:to-blue-600 transition-all duration-200"
              >
                Staff Login
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;