import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { FlightProvider } from './context/FlightContext';
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import BookingFlow from './components/BookingFlow';
import AdminDashboard from './components/AdminDashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserDashboard from './components/dashboard/UserDashboard';
import PriceAlerts from './components/features/PriceAlerts';
import TouristCurations from './components/features/TouristCurations';
import FlyeasyClub from './components/features/FlyeasyClub';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import Navbar from './components/Navbar';
import { useAuthStore } from './store/authStore';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.email === 'admin@flyeasy.com'; // Simple admin check
  
  return isAuthenticated && isAdmin ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <FlightProvider>
        <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-champagne-50 to-ivory-100">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/flights" element={<SearchResults />} />
            <Route path="/destinations" element={<TouristCurations />} />
            <Route path="/club" element={<FlyeasyClub />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/booking/:flightId" 
              element={
                <ProtectedRoute>
                  <BookingFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/price-alerts" 
              element={
                <ProtectedRoute>
                  <PriceAlerts />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <AdminRoute>
                  <AnalyticsDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </FlightProvider>
    </Router>
  );
}

export default App;