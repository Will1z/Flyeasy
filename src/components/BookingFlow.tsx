import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, CreditCard, User, Plane, ArrowRight, Shield, Lock } from 'lucide-react';
import { useFlightContext } from '../context/FlightContext';
import { initPaystackPayment } from '../services/api';

const BookingFlow = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { selectedFlight, addBooking } = useFlightContext();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [passengerData, setPassengerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    passportNumber: ''
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  if (!selectedFlight) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Flight not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const paymentPayload = {
        email: passengerData.email,
        amount: selectedFlight.price * 100,
      };
      const paymentInit = await initPaystackPayment(paymentPayload);
      setTimeout(() => {
        const booking = {
          id: Math.random().toString(36).substr(2, 9),
          flight: selectedFlight,
          passenger: {
            name: `${passengerData.firstName} ${passengerData.lastName}`,
            email: passengerData.email,
            phone: passengerData.phone
          },
          status: 'confirmed' as const,
          createdAt: new Date().toISOString(),
          paymentId: (paymentInit as any).data?.reference || 'pay_' + Math.random().toString(36).substr(2, 9)
        };
        addBooking(booking);
        setIsProcessing(false);
        setStep(3);
      }, 2000);
    } catch (error: unknown) {
      setIsProcessing(false);
      alert('Payment failed: ' + ((error as any).response?.data?.error || (error as Error).message));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderPassengerDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-full">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Passenger Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={passengerData.firstName}
            onChange={(e) => setPassengerData({...passengerData, firstName: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={passengerData.lastName}
            onChange={(e) => setPassengerData({...passengerData, lastName: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={passengerData.email}
            onChange={(e) => setPassengerData({...passengerData, email: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={passengerData.phone}
            onChange={(e) => setPassengerData({...passengerData, phone: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!passengerData.firstName || !passengerData.lastName || !passengerData.email || !passengerData.phone}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <span>Continue to Payment</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-green-100 p-2 rounded-full">
          <CreditCard className="h-5 w-5 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Powered by Paystack - Your payment is secure</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={paymentData.cardNumber}
            onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={paymentData.expiryDate}
              onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
            <input
              type="text"
              placeholder="123"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
          <input
            type="text"
            value={paymentData.cardName}
            onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Pay {formatPrice(selectedFlight.price)}</span>
          </>
        )}
      </button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="bg-green-100 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-lg text-gray-600">
          Your flight is booked and ready. Have a wonderful trip with {selectedFlight.airline}!
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <h3 className="font-bold text-gray-900 mb-4">Flight Details</h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Flight:</span>
            <span className="font-medium">{selectedFlight.airline}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">{selectedFlight.from} → {selectedFlight.to}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Departure:</span>
            <span className="font-medium">{selectedFlight.departure}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Passenger:</span>
            <span className="font-medium">{passengerData.firstName} {passengerData.lastName}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Book Another Flight
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="w-full bg-gray-100 text-gray-700 py-3 px-8 rounded-xl font-semibold hover:bg-gray-200 transition-all"
        >
          View All Bookings
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  1
                </div>
                <div className={`h-1 w-12 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  2
                </div>
                <div className={`h-1 w-12 ${step >= 3 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  ✓
                </div>
              </div>
            </div>

            {step === 1 && renderPassengerDetails()}
            {step === 2 && renderPayment()}
            {step === 3 && renderConfirmation()}
          </div>
        </div>

        {/* Flight Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Plane className="h-5 w-5" />
              <span>Flight Summary</span>
            </h3>
            
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                <div className="font-medium text-gray-900">{selectedFlight.airline}</div>
                <div className="text-sm text-gray-600">{selectedFlight.aircraft}</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{selectedFlight.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{selectedFlight.to}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Departure:</span>
                  <span className="font-medium">{selectedFlight.departure}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{selectedFlight.duration}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(selectedFlight.price)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;