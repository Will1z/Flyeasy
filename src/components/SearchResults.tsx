import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Clock, MapPin, ArrowRight, Wifi, Coffee, Star, Shield } from 'lucide-react';
import { useFlightContext, Flight } from '../context/FlightContext';
import { flightAPI } from '../services/api';

const SearchResults = () => {
  const navigate = useNavigate();
  const { flights, searchParams, setSelectedFlight, setFlights } = useFlightContext();

  useEffect(() => {
    const fetchFlights = async () => {
      if (!searchParams) return;
      try {
        console.log('Searching flights with params:', {
          origin: searchParams.from,
          destination: searchParams.to,
          depart_date: searchParams.departure,
        });
        
        // Use the real Travelpayouts API via POST
        const flights = await flightAPI.searchFlights({
          from: searchParams.from,
          to: searchParams.to,
          departure: searchParams.departure,
          passengers: searchParams.passengers,
          class: searchParams.class as 'economy' | 'premium' | 'business' | 'first',
          currency: 'NGN'
        });
        setFlights(flights || []);
      } catch (error: unknown) {
        console.error('Flight search error:', error);
        setFlights([]);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert('Failed to fetch flights: ' + errorMessage);
      }
    };
    fetchFlights();
  }, [searchParams, setFlights]);

  if (!searchParams || flights.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-champagne-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-2xl border border-champagne-200">
          <div className="bg-gradient-to-br from-champagne-100 to-gold-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <Plane className="h-12 w-12 text-navy-800" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">No flights found</h2>
          <p className="font-sans text-lg text-charcoal-600 mb-8 leading-relaxed">
            We couldn't find any flights matching your criteria. Let's explore other options for your journey.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 px-8 py-4 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all font-sans font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Search Again
          </button>
        </div>
      </div>
    );
  }

  const handleBookFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    navigate(`/booking/${flight.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getClassBadge = (flightClass: string) => {
    const badges = {
      economy: { bg: 'bg-champagne-100', text: 'text-champagne-800', label: 'Economy' },
      premium: { bg: 'bg-gold-100', text: 'text-gold-800', label: 'Premium Economy' },
      business: { bg: 'bg-navy-100', text: 'text-navy-800', label: 'Business Class' },
      first: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'First Class' }
    };
    return badges[flightClass as keyof typeof badges] || badges.economy;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-champagne-50 py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 mb-12 border border-champagne-200">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-6">
              <div className="bg-gradient-to-r from-navy-800 to-navy-900 p-4 rounded-2xl shadow-lg">
                <Plane className="h-8 w-8 text-ivory-50" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-navy-900 mb-2">
                  {searchParams.from} → {searchParams.to}
                </h1>
                <p className="font-sans text-lg text-charcoal-600">
                  {new Date(searchParams.departure).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • {searchParams.passengers} {searchParams.passengers === 1 ? 'guest' : 'guests'} • {getClassBadge(searchParams.class).label}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="font-sans text-navy-800 hover:text-navy-900 font-medium transition-colors px-6 py-3 rounded-xl border border-navy-200 hover:bg-navy-50"
            >
              Modify Search
            </button>
          </div>
        </div>

        {/* Premium Message */}
        <div className="bg-gradient-to-r from-gold-50 to-champagne-50 rounded-2xl p-8 mb-12 border border-gold-200">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-r from-gold-400 to-champagne-400 p-3 rounded-full flex-shrink-0">
              <Star className="h-6 w-6 text-navy-900" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-navy-900 mb-2">Curated for Excellence</h3>
              <p className="font-sans text-charcoal-700 leading-relaxed">
                We've selected {flights.length} premium flights for your journey. Each option offers exceptional service, 
                comfort, and reliability. Prices start from {formatPrice(Math.min(...flights.map(f => f.price)))}.
              </p>
            </div>
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-8">
          {flights.map((flight) => {
            const classBadge = getClassBadge(flight.class);
            return (
              <div key={flight.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-champagne-200 overflow-hidden group hover:-translate-y-1">
                <div className="p-8">
                  {/* Flight Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-navy-100 to-champagne-100 p-4 rounded-2xl">
                        <Plane className="h-8 w-8 text-navy-800" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-navy-900">{flight.airline}</h3>
                        <p className="font-sans text-sm text-charcoal-600">{flight.aircraft}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${classBadge.bg} ${classBadge.text}`}>
                          {classBadge.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-4xl font-bold text-navy-900">{formatPrice(flight.price)}</div>
                      <div className="font-sans text-sm text-charcoal-500">per guest</div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Departure */}
                    <div className="flex items-center space-x-4">
                      <MapPin className="h-6 w-6 text-gold-500" />
                      <div>
                        <div className="font-serif text-3xl font-bold text-navy-900">{flight.departure}</div>
                        <div className="font-sans text-sm text-charcoal-600">{flight.from}</div>
                        <div className="font-sans text-xs text-charcoal-500">Departure</div>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="h-6 w-6 text-gold-500 mx-auto mb-2" />
                        <div className="font-serif text-xl font-bold text-navy-900">{flight.duration}</div>
                        <div className="font-sans text-sm text-charcoal-600">
                          {flight.stops === 0 ? 'Direct Flight' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                        </div>
                        <div className="w-24 h-0.5 bg-gradient-to-r from-gold-300 to-champagne-300 mx-auto mt-2"></div>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="flex items-center justify-end space-x-4">
                      <div className="text-right">
                        <div className="font-serif text-3xl font-bold text-navy-900">{flight.arrival}</div>
                        <div className="font-sans text-sm text-charcoal-600">{flight.to}</div>
                        <div className="font-sans text-xs text-charcoal-500">Arrival</div>
                      </div>
                      <MapPin className="h-6 w-6 text-gold-500" />
                    </div>
                  </div>

                  {/* Amenities & Book Button */}
                  <div className="flex items-center justify-between border-t border-champagne-100 pt-6">
                    <div className="flex items-center space-x-8">
                      <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                        <Wifi className="h-5 w-5 text-gold-500" />
                        <span className="font-sans">Complimentary WiFi</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                        <Coffee className="h-5 w-5 text-gold-500" />
                        <span className="font-sans">Premium Dining</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-charcoal-600">
                        <Shield className="h-5 w-5 text-gold-500" />
                        <span className="font-sans">Flexible Booking</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookFlight(flight)}
                      className="bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 px-10 py-4 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all duration-300 font-sans font-semibold flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <span>Reserve Now</span>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Concierge Help Section */}
        <div className="mt-16 bg-gradient-to-r from-navy-900 to-charcoal-900 rounded-3xl p-12 text-center">
          <h3 className="font-serif text-3xl font-bold text-ivory-50 mb-4">Need Assistance?</h3>
          <p className="font-sans text-xl text-ivory-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our travel concierge team is available 24/7 to help you select the perfect flight, 
            arrange special accommodations, or answer any questions about your journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white/10 backdrop-blur-md text-ivory-50 px-6 py-3 rounded-xl font-sans font-medium hover:bg-white/20 transition-all border border-white/20">
              Compare by Price
            </button>
            <button className="bg-white/10 backdrop-blur-md text-ivory-50 px-6 py-3 rounded-xl font-sans font-medium hover:bg-white/20 transition-all border border-white/20">
              Morning Departures
            </button>
            <button className="bg-white/10 backdrop-blur-md text-ivory-50 px-6 py-3 rounded-xl font-sans font-medium hover:bg-white/20 transition-all border border-white/20">
              Direct Flights Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;