import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Plus, Trash2, MapPin, DollarSign, Calendar } from 'lucide-react';
import { useFlightStore } from '../../store/flightStore';
import { useAuthStore } from '../../store/authStore';
import { PriceAlert } from '../../types';
import toast from 'react-hot-toast';

interface PriceAlertFormData {
  from: string;
  to: string;
  targetPrice: number;
  currency: string;
}

const PriceAlerts = () => {
  const { user } = useAuthStore();
  const { priceAlerts, addPriceAlert, removePriceAlert } = useFlightStore();
  const [showForm, setShowForm] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PriceAlertFormData>();

  const onSubmit = async (data: PriceAlertFormData) => {
    if (!user) return;

    try {
      await addPriceAlert({
        userId: user.id,
        from: data.from,
        to: data.to,
        targetPrice: data.targetPrice,
        currency: data.currency
      });
      
      toast.success('Price alert created successfully!');
      reset();
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to create price alert');
    }
  };

  const handleRemoveAlert = (alertId: string) => {
    removePriceAlert(alertId);
    toast.success('Price alert removed');
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Price Alerts</h2>
                <p className="text-gray-600">Get notified when flight prices drop</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Alert</span>
            </button>
          </div>
        </div>

        {showForm && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Price Alert</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('from', { required: 'Origin is required' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Lagos, Nigeria"
                    />
                  </div>
                  {errors.from && (
                    <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      {...register('to', { required: 'Destination is required' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Abuja, Nigeria"
                    />
                  </div>
                  {errors.to && (
                    <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      {...register('targetPrice', { 
                        required: 'Target price is required',
                        min: { value: 1000, message: 'Price must be at least ₦1,000' }
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="50000"
                    />
                  </div>
                  {errors.targetPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    {...register('currency', { required: 'Currency is required' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                  {errors.currency && (
                    <p className="mt-1 text-sm text-red-600">{errors.currency.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Create Alert
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-6">
          {priceAlerts.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No price alerts yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first price alert to get notified when flight prices drop
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Create Price Alert
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {priceAlerts.map(alert => (
                <div key={alert.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {alert.from} → {alert.to}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          alert.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Target: {formatPrice(alert.targetPrice, alert.currency)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Bell className="h-4 w-4" />
                          <span>{alert.notifications} notifications sent</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAlert(alert.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceAlerts;