import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Cpu, Users, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dataService } from '../services/dataService';
import NotificationBell from './NotificationBell';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [onlineCount, setOnlineCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineCount = () => {
      const stats = dataService.getSystemStats();
      setOnlineCount(stats.onlineUsers);
    };
    
    updateOnlineCount();
    const interval = setInterval(updateOnlineCount, 30000); // Update every 30 seconds
    
    // Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!user) return null;

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
              <div className="flex items-center gap-2">
                <p className="text-peacock-300 text-xs sm:text-sm">
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Student Portal'}
                </p>
                {/* Network Status Indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    isOnline 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {isOnline ? <Wifi className="w-2 h-2 sm:w-3 sm:h-3" /> : <WifiOff className="w-2 h-2 sm:w-3 sm:h-3" />}
                  <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Online Users Count */}
            {user.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-3 py-2 rounded-full backdrop-blur-sm"
              >
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">
                  {onlineCount} online
                </span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </motion.div>
            )}

            <NotificationBell />
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium text-sm">{user.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-peacock-300 text-xs">{user.email}</p>
                  {user.isActive && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    ></motion.div>
                  )}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-1.5 sm:p-2 text-peacock-300 hover:text-peacock-200 hover:bg-dark-700/70 rounded-lg transition-all duration-200 group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-pulse" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;