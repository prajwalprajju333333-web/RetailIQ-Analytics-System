import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadData from './pages/UploadData';
import Segmentation from './pages/Segmentation';
import Recommendations from './pages/Recommendations';
import CountryAnalysis from './pages/CountryAnalysis';
import Methodology from './pages/Methodology';
import Profile from './pages/Profile';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { prefetchAllData } = useData();

  // Prefetch all data when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      prefetchAllData();
    }
  }, [isAuthenticated, prefetchAllData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RetailIQ Analytics System...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadData /></ProtectedRoute>} />
          <Route path="/segmentation" element={<ProtectedRoute><Segmentation /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/country-analysis" element={<ProtectedRoute><CountryAnalysis /></ProtectedRoute>} />
          <Route path="/methodology" element={<ProtectedRoute><Methodology /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;