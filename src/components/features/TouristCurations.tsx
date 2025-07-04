import React, { useState } from 'react';
import { MapPin, Star, Camera, Calendar, Users, ArrowRight, Heart, Share2, Clock, Plane } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  rating: number;
  duration: string;
  bestTime: string;
  highlights: string[];
  experiences: Experience[];
  flightPrice: number;
  packagePrice: number;
  category: 'luxury' | 'adventure' | 'cultural' | 'romantic' | 'family';
}

interface Experience {
  name: string;
  description: string;
  price: number;
  duration: string;
  included: boolean;
}

const TouristCurations = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const destinations: Destination[] = [
    {
      id: '1',
      name: 'Santorini',
      country: 'Greece',
      description: 'Experience the magic of white-washed buildings, crystal-clear waters, and breathtaking sunsets in this iconic Greek island paradise.',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      duration: '5-7 days',
      bestTime: 'April - October',
      highlights: ['Oia Sunset Views', 'Wine Tasting Tours', 'Volcanic Hot Springs', 'Traditional Villages'],
      experiences: [
        {
          name: 'Private Yacht Sunset Cruise',
          description: 'Exclusive sunset cruise with champagne and gourmet dining',
          price: 85000,
          duration: '4 hours',
          included: true
        },
        {
          name: 'Helicopter Island Tour',
          description: 'Aerial views of the caldera and neighboring islands',
          price: 120000,
          duration: '45 minutes',
          included: false
        },
        {
          name: 'Private Wine Tasting',
          description: 'Exclusive access to premium wineries with sommelier',
          price: 45000,
          duration: '3 hours',
          included: true
        }
      ],
      flightPrice: 520000,
      packagePrice: 850000,
      category: 'romantic'
    },
    {
      id: '2',
      name: 'Dubai',
      country: 'UAE',
      description: 'Immerse yourself in luxury and innovation in this dazzling city where traditional Arabian culture meets cutting-edge modernity.',
      image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      duration: '4-6 days',
      bestTime: 'November - March',
      highlights: ['Burj Khalifa', 'Desert Safari', 'Gold Souk', 'Palm Jumeirah'],
      experiences: [
        {
          name: 'Private Desert Safari with Falconry',
          description: 'Exclusive desert experience with traditional falconry demonstration',
          price: 95000,
          duration: '6 hours',
          included: true
        },
        {
          name: 'Burj Al Arab High Tea',
          description: 'Afternoon tea at the world\'s most luxurious hotel',
          price: 65000,
          duration: '2 hours',
          included: true
        },
        {
          name: 'Private Yacht Marina Tour',
          description: 'Luxury yacht tour of Dubai Marina and coastline',
          price: 150000,
          duration: '4 hours',
          included: false
        }
      ],
      flightPrice: 285000,
      packagePrice: 680000,
      category: 'luxury'
    },
    {
      id: '3',
      name: 'Kyoto',
      country: 'Japan',
      description: 'Discover the soul of Japan through ancient temples, traditional gardens, and authentic cultural experiences in this historic imperial city.',
      image: 'https://i0.wp.com/www.touristjapan.com/wp-content/uploads/2023/10/Kiyomizu-dera-temple-in-autumn-on-sunset-sky-at-Kyoto-Japan-1.jpg?resize=2048%2C1365&ssl=1',
      rating: 4.9,
      duration: '6-8 days',
      bestTime: 'March - May, September - November',
      highlights: ['Fushimi Inari Shrine', 'Bamboo Grove', 'Golden Pavilion', 'Geisha Districts'],
      experiences: [
        {
          name: 'Private Tea Ceremony with Master',
          description: 'Authentic tea ceremony experience with tea master',
          price: 35000,
          duration: '2 hours',
          included: true
        },
        {
          name: 'Exclusive Temple Stay',
          description: 'Overnight experience at historic Buddhist temple',
          price: 75000,
          duration: '24 hours',
          included: true
        },
        {
          name: 'Private Kaiseki Dining',
          description: 'Multi-course traditional Japanese cuisine experience',
          price: 85000,
          duration: '3 hours',
          included: false
        }
      ],
      flightPrice: 650000,
      packagePrice: 920000,
      category: 'cultural'
    },
    {
      id: '4',
      name: 'Serengeti',
      country: 'Tanzania',
      description: 'Witness the greatest wildlife spectacle on Earth with luxury safari experiences in one of Africa\'s most pristine wilderness areas.',
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      duration: '7-10 days',
      bestTime: 'June - October',
      highlights: ['Great Migration', 'Big Five Safari', 'Maasai Culture', 'Balloon Safari'],
      experiences: [
        {
          name: 'Hot Air Balloon Safari',
          description: 'Sunrise balloon flight over the Serengeti plains',
          price: 180000,
          duration: '4 hours',
          included: true
        },
        {
          name: 'Private Game Drive with Ranger',
          description: 'Exclusive wildlife viewing with expert guide',
          price: 120000,
          duration: '8 hours',
          included: true
        },
        {
          name: 'Maasai Village Cultural Experience',
          description: 'Authentic cultural immersion with local community',
          price: 45000,
          duration: '4 hours',
          included: true
        }
      ],
      flightPrice: 780000,
      packagePrice: 1250000,
      category: 'adventure'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Destinations', icon: MapPin },
    { id: 'luxury', label: 'Luxury', icon: Star },
    { id: 'romantic', label: 'Romantic', icon: Heart },
    { id: 'cultural', label: 'Cultural', icon: Camera },
    { id: 'adventure', label: 'Adventure', icon: Plane },
    { id: 'family', label: 'Family', icon: Users }
  ];

  const filteredDestinations = selectedCategory === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === selectedCategory);

  const toggleFavorite = (destinationId: string) => {
    setFavorites(prev => 
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-champagne-50 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 mb-6">
            Curated Experiences
          </h1>
          <p className="font-sans text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked destinations and exclusive experiences crafted by our travel experts. 
            Each journey is designed to create unforgettable memories.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-navy-800 text-ivory-50 shadow-lg'
                    : 'bg-white text-charcoal-600 hover:bg-champagne-50 border border-champagne-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-champagne-200 hover:shadow-2xl transition-all duration-500 group">
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent"></div>
                
                {/* Overlay Content */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(destination.id)}
                    className={`p-2 rounded-full backdrop-blur-md transition-all ${
                      favorites.includes(destination.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-serif text-3xl font-bold">{destination.name}</h3>
                  <p className="font-sans text-sm opacity-90">{destination.country}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    <Star className="h-4 w-4 text-gold-400 fill-current" />
                    <span className="font-sans text-sm font-medium">{destination.rating}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="font-sans text-charcoal-600 leading-relaxed mb-6">
                  {destination.description}
                </p>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gold-500" />
                    <span className="font-sans text-sm text-charcoal-600">{destination.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gold-500" />
                    <span className="font-sans text-sm text-charcoal-600">{destination.bestTime}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="font-serif text-lg font-semibold text-navy-900 mb-3">Highlights</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gold-400 rounded-full"></div>
                        <span className="font-sans text-sm text-charcoal-600">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experiences Preview */}
                <div className="mb-6">
                  <h4 className="font-serif text-lg font-semibold text-navy-900 mb-3">Exclusive Experiences</h4>
                  <div className="space-y-2">
                    {destination.experiences.slice(0, 2).map((experience, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-champagne-50 rounded-xl">
                        <div>
                          <h5 className="font-sans font-medium text-charcoal-800">{experience.name}</h5>
                          <p className="font-sans text-xs text-charcoal-600">{experience.duration}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-sans text-sm ${experience.included ? 'text-green-600' : 'text-charcoal-600'}`}>
                            {experience.included ? 'Included' : formatPrice(experience.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-navy-50 to-champagne-50 rounded-xl border border-champagne-200">
                  <div>
                    <p className="font-sans text-sm text-charcoal-600">Complete Package</p>
                    <p className="font-serif text-2xl font-bold text-navy-900">{formatPrice(destination.packagePrice)}</p>
                    <p className="font-sans text-xs text-charcoal-500">Flight + Accommodation + Experiences</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm text-charcoal-600">Flight Only</p>
                    <p className="font-sans text-lg font-semibold text-charcoal-800">{formatPrice(destination.flightPrice)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 py-3 px-6 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all font-sans font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    <span>Book Package</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="px-6 py-3 border border-navy-200 text-navy-800 rounded-xl hover:bg-navy-50 transition-all font-sans font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-r from-navy-900 to-charcoal-900 rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl font-bold text-ivory-50 mb-6">
            Can't Find Your Dream Destination?
          </h2>
          <p className="font-sans text-xl text-ivory-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Our travel experts can create a completely customized itinerary tailored to your preferences, 
            interests, and budget. Let us craft your perfect journey.
          </p>
          <button className="bg-gradient-to-r from-gold-400 to-champagne-400 text-navy-900 px-8 py-4 rounded-xl hover:from-gold-300 hover:to-champagne-300 transition-all font-sans font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Request Custom Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristCurations;