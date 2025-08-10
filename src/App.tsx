import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AdminDashboard from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-peacock-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-peacock-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950">
      {user && <Header />}
      <AdminDashboard />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;