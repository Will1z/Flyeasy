import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Users, Sparkles, ArrowRight, Globe, Star, MessageCircle } from 'lucide-react';
import { useFlightContext } from '../context/FlightContext';
import AIChat from './chat/AIChat';

const HomePage = () => {
  const navigate = useNavigate();
  const { setSearchParams, setFlights } = useFlightContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    returnDate: '',
    passengers: 1,
    class: 'business'
  });

  const handleSearch = async () => {
    if (!searchData.from || !searchData.to || !searchData.departure) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockFlights = [
        {
          id: '1',
          airline: 'Emirates',
          from: searchData.from,
          to: searchData.to,
          departure: '08:30',
          arrival: '10:45',
          duration: '2h 15m',
          price: 285000,
          stops: 0,
          aircraft: 'Boeing 777-300ER',
          class: searchData.class
        },
        {
          id: '2',
          airline: 'Qatar Airways',
          from: searchData.from,
          to: searchData.to,
          departure: '14:20',
          arrival: '16:35',
          duration: '2h 15m',
          price: 320000,
          stops: 0,
          aircraft: 'Airbus A350',
          class: searchData.class
        },
        {
          id: '3',
          airline: 'British Airways',
          from: searchData.from,
          to: searchData.to,
          departure: '18:45',
          arrival: '21:00',
          duration: '2h 15m',
          price: 298000,
          stops: 0,
          aircraft: 'Boeing 787 Dreamliner',
          class: searchData.class
        }
      ];

      setSearchParams(searchData);
      setFlights(mockFlights);
      setIsLoading(false);
      navigate('/flights');
    }, 1500);
  };

  const luxuryDestinations = [
    { 
      city: 'Dubai', 
      country: 'UAE', 
      price: '₦285,000',
      image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
      city: 'London', 
      country: 'UK', 
      price: '₦520,000',
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
      city: 'Paris', 
      country: 'France', 
      price: '₦485,000',
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    { 
      city: 'New York', 
      country: 'USA', 
      price: '₦650,000',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-champagne-50 to-ivory-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Luxury Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-900/60 via-charcoal-800/40 to-navy-800/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center animate-fade-in">
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-gold-400 to-champagne-400 p-4 rounded-full shadow-2xl">
                <Plane className="h-8 w-8 text-navy-900" />
              </div>
            </div>
            
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-ivory-50 mb-6 leading-tight">
              Experience the world
              <span className="block bg-gradient-to-r from-gold-300 to-champagne-300 bg-clip-text text-transparent">
                with ease
              </span>
            </h1>
            
            <p className="font-sans text-xl md:text-2xl text-ivory-200 max-w-3xl mx-auto leading-relaxed font-light mb-8">
              Discover extraordinary destinations through our curated selection of premium flights. 
              Where luxury meets simplicity.
            </p>

            {/* AI Chat Toggle */}
            <div className="flex justify-center space-x-4 mb-12">
              <button
                onClick={() => setShowAIChat(false)}
                className={`px-6 py-3 rounded-xl font-sans font-medium transition-all ${
                  !showAIChat 
                    ? 'bg-white text-navy-900 shadow-lg' 
                    : 'bg-white/20 text-ivory-200 hover:bg-white/30'
                }`}
              >
                Traditional Search
              </button>
              <button
                onClick={() => setShowAIChat(true)}
                className={`px-6 py-3 rounded-xl font-sans font-medium transition-all flex items-center space-x-2 ${
                  showAIChat 
                    ? 'bg-white text-navy-900 shadow-lg' 
                    : 'bg-white/20 text-ivory-200 hover:bg-white/30'
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                <span>AI Assistant</span>
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search Interface */}
          <div className="mt-16 max-w-5xl mx-auto animate-slide-up">
            {showAIChat ? (
              <AIChat />
            ) : (
              <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Search Header */}
                <div className="bg-gradient-to-r from-navy-50 to-champagne-50 px-8 py-6 border-b border-champagne-200/50">
                  <h3 className="font-serif text-2xl font-semibold text-navy-900 text-center">
                    Where would you like to escape to?
                  </h3>
                </div>

                {/* Search Form */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="lg:col-span-1 space-y-3">
                      <label className="font-sans text-sm font-medium text-charcoal-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gold-500" />
                        Departing from
                      </label>
                      <input
                        type="text"
                        placeholder="Lagos, Nigeria"
                        value={searchData.from}
                        onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                        className="w-full px-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                      />
                    </div>

                    <div className="lg:col-span-1 space-y-3">
                      <label className="font-sans text-sm font-medium text-charcoal-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gold-500" />
                        Flying to
                      </label>
                      <input
                        type="text"
                        placeholder="Dubai, UAE"
                        value={searchData.to}
                        onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                        className="w-full px-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                      />
                    </div>

                    <div className="lg:col-span-1 space-y-3">
                      <label className="font-sans text-sm font-medium text-charcoal-700 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gold-500" />
                        Departure
                      </label>
                      <input
                        type="date"
                        value={searchData.departure}
                        onChange={(e) => setSearchData({...searchData, departure: e.target.value})}
                        className="w-full px-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                      />
                    </div>

                    <div className="lg:col-span-1 space-y-3">
                      <label className="font-sans text-sm font-medium text-charcoal-700 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-gold-500" />
                        Travelers
                      </label>
                      <select
                        value={searchData.passengers}
                        onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                        className="w-full px-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="lg:col-span-1 space-y-3">
                      <label className="font-sans text-sm font-medium text-charcoal-700 flex items-center">
                        <Star className="h-4 w-4 mr-2 text-gold-500" />
                        Class
                      </label>
                      <select
                        value={searchData.class}
                        onChange={(e) => setSearchData({...searchData, class: e.target.value})}
                        className="w-full px-4 py-4 border border-champagne-200 rounded-xl focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all font-sans text-charcoal-800 bg-ivory-50/50"
                      >
                        <option value="economy">Economy</option>
                        <option value="premium">Premium Economy</option>
                        <option value="business">Business Class</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    disabled={isLoading || !searchData.from || !searchData.to || !searchData.departure}
                    className="w-full bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 py-5 px-8 rounded-xl font-sans font-semibold text-lg hover:from-navy-700 hover:to-navy-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-ivory-50"></div>
                        <span>Curating your perfect journey...</span>
                      </div>
                    ) : (
                      <>
                        <span>Find My Flight</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Luxury Destinations Section */}
      <div className="py-24 bg-gradient-to-b from-ivory-50 to-champagne-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900 mb-6">
              Curated Destinations
            </h2>
            <p className="font-sans text-xl text-charcoal-600 max-w-3xl mx-auto font-light">
              Handpicked luxury destinations that define extraordinary travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {luxuryDestinations.map((destination, index) => (
              <div
                key={index}
                className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-500"
                onClick={() => setSearchData({
                  ...searchData,
                  to: destination.city
                })}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-champagne-100 hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.city}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-serif text-2xl font-bold">{destination.city}</h3>
                      <p className="font-sans text-sm opacity-90">{destination.country}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-sm text-charcoal-600">From</span>
                      <span className="font-serif text-xl font-bold text-navy-900">{destination.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="py-24 bg-gradient-to-r from-navy-900 to-charcoal-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-ivory-50 mb-6">
              The Flyeasy Difference
            </h2>
            <p className="font-sans text-xl text-ivory-200 max-w-3xl mx-auto font-light">
              Elevating every aspect of your travel experience with unparalleled service and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-gold-400 to-champagne-400 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-8 w-8 text-navy-900 mx-auto mt-2" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ivory-50 mb-4">Global Network</h3>
              <p className="font-sans text-ivory-200 leading-relaxed">
                Access to premium airlines and exclusive routes worldwide, ensuring you travel in style to any destination.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-gold-400 to-champagne-400 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-8 w-8 text-navy-900 mx-auto mt-2" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ivory-50 mb-4">AI Concierge</h3>
              <p className="font-sans text-ivory-200 leading-relaxed">
                Our intelligent assistant understands natural language and can book your entire journey through simple conversation.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-gold-400 to-champagne-400 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="h-8 w-8 text-navy-900 mx-auto mt-2" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ivory-50 mb-4">Effortless Experience</h3>
              <p className="font-sans text-ivory-200 leading-relaxed">
                Seamless booking process, priority boarding, and exclusive amenities that make every journey extraordinary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;