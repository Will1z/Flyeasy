import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Bell, 
  CreditCard, 
  User, 
  Calendar, 
  MapPin, 
  Clock,
  AlertCircle,
  Plus,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useFlightStore } from '../../store/flightStore';
import { format } from 'date-fns';

const UserDashboard = () => {
  const { user } = useAuthStore();
  const { bookings, priceAlerts } = useFlightStore();
  const [activeTab, setActiveTab] = useState('overview');

  const formatPrice = (price: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const upcomingFlights = bookings.filter(booking => 
    booking.status === 'confirmed' && 
    new Date(booking.flight.departure) > new Date()
  );

  const recentBookings = bookings.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}! ✈️
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your flights, track prices, and plan your next adventure
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Plane className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Flights</p>
              <p className="text-3xl font-bold text-green-600">{upcomingFlights.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Price Alerts</p>
              <p className="text-3xl font-bold text-purple-600">{priceAlerts.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Bell className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatPrice(bookings.reduce((sum, b) => sum + b.totalAmount, 0))}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-8 border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Plane },
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'alerts', label: 'Price Alerts', icon: Bell },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Upcoming Flights */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Upcoming Flights</h3>
                  <Link
                    to="/"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Book Flight</span>
                  </Link>
                </div>

                {upcomingFlights.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Plane className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No upcoming flights</h4>
                    <p className="text-gray-600 mb-4">Ready for your next adventure?</p>
                    <Link
                      to="/"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Search Flights</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {upcomingFlights.map(booking => (
                      <div key={booking.id} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Plane className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{booking.flight.airline}</h4>
                              <p className="text-sm text-gray-600">{booking.confirmationCode}</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Confirmed
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{booking.flight.from} → {booking.flight.to}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{booking.flight.departure}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-900">{booking.flight.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Bookings */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h3>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map(booking => (
                      <div key={booking.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{booking.flight.airline}</h4>
                            <p className="text-sm text-gray-600">
                              {booking.flight.from} → {booking.flight.to}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatPrice(booking.totalAmount)}</p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">All Bookings</h3>
              {/* Booking history content */}
            </div>
          )}

          {activeTab === 'alerts' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Price Alerts</h3>
              {/* Price alerts content */}
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
              {/* Profile settings content */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;