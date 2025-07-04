import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Plane, 
  User, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Search,
  BarChart3,
  MessageCircle,
  MapPin,
  Crown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import CurrencySelector from './features/CurrencySelector';
import AIChat from './chat/AIChat';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isAdmin = user?.email === 'admin@flyeasy.com';

  return (
    <>
      <nav className="bg-white/90 backdrop-blur-md border-b border-champagne-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-3 rounded-xl shadow-lg">
                <Plane className="h-6 w-6 text-ivory-50" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold bg-gradient-to-r from-navy-800 to-navy-900 bg-clip-text text-transparent">
                  Flyeasy
                </span>
                <div className="font-sans text-xs text-charcoal-500 -mt-1">Effortless Luxury Travel</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-sans font-medium transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  location.pathname === '/' 
                    ? 'text-navy-800 bg-champagne-100' 
                    : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                }`}
              >
                <Search className="h-4 w-4" />
                <span>Search Flights</span>
              </Link>

              <Link 
                to="/destinations" 
                className={`font-sans font-medium transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  location.pathname === '/destinations' 
                    ? 'text-navy-800 bg-champagne-100' 
                    : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Destinations</span>
              </Link>

              <Link 
                to="/club" 
                className={`font-sans font-medium transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  location.pathname === '/club' 
                    ? 'text-navy-800 bg-champagne-100' 
                    : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                }`}
              >
                <Crown className="h-4 w-4" />
                <span>Flyeasy Club</span>
              </Link>

              <button 
                onClick={() => setShowAIChat(true)}
                className={`font-sans font-medium transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  showAIChat 
                    ? 'text-navy-800 bg-champagne-100' 
                    : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Assistant</span>
              </button>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`font-sans font-medium transition-colors px-4 py-2 rounded-lg ${
                      location.pathname === '/dashboard' 
                        ? 'text-navy-800 bg-champagne-100' 
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/price-alerts" 
                    className={`font-sans font-medium transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      location.pathname === '/price-alerts' 
                        ? 'text-navy-800 bg-champagne-100' 
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    <span>Price Alerts</span>
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link 
                    to="/admin" 
                    className={`font-sans font-medium transition-colors px-4 py-2 rounded-lg ${
                      location.pathname === '/admin' 
                        ? 'text-navy-800 bg-champagne-100' 
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                    }`}
                  >
                    Admin
                  </Link>
                  <Link 
                    to="/admin/analytics" 
                    className={`font-sans font-medium transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      location.pathname === '/admin/analytics' 
                        ? 'text-navy-800 bg-champagne-100' 
                        : 'text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50'
                    }`}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </>
              )}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-6">
              <CurrencySelector 
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                className="bg-champagne-50 rounded-lg"
              />
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-sans text-sm font-medium text-navy-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="font-sans text-xs text-charcoal-500">{user?.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-charcoal-600 hover:text-navy-800 hover:bg-champagne-50 rounded-lg transition-colors">
                      <Settings className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-charcoal-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login"
                    className="font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-champagne-50"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 px-6 py-3 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all font-sans font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Join Flyeasy
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-charcoal-600 hover:text-navy-800 transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-champagne-200 py-6 bg-white/95 backdrop-blur-md">
              <div className="space-y-4">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                >
                  Search Flights
                </Link>

                <Link 
                  to="/destinations" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                >
                  Destinations
                </Link>

                <Link 
                  to="/club" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                >
                  Flyeasy Club
                </Link>

                <button 
                  onClick={() => {
                    setShowAIChat(true);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                >
                  AI Assistant
                </button>
                
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/price-alerts" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                    >
                      Price Alerts
                    </Link>
                    {isAdmin && (
                      <>
                        <Link 
                          to="/admin" 
                          onClick={() => setIsMenuOpen(false)}
                          className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                        >
                          Admin
                        </Link>
                        <Link 
                          to="/admin/analytics" 
                          onClick={() => setIsMenuOpen(false)}
                          className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                        >
                          Analytics
                        </Link>
                      </>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left font-sans text-red-600 hover:text-red-700 font-medium transition-colors py-2"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block font-sans text-charcoal-600 hover:text-navy-800 font-medium transition-colors py-2"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 px-6 py-3 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all text-center font-sans font-medium"
                    >
                      Join Flyeasy
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* AI Chat Modal */}
      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setShowAIChat(false)}
              className="absolute top-4 right-4 z-10 bg-navy-800 hover:bg-navy-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <AIChat />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;