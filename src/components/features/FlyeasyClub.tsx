import React, { useState } from 'react';
import { 
  Crown, 
  CreditCard, 
  Plane, 
  Shield, 
  Gift, 
  Star, 
  Globe, 
  Phone, 
  Car, 
  Hotel, 
  Utensils, 
  Calendar,
  ArrowRight,
  Check,
  Sparkles,
  Award,
  Users,
  Clock,
  MapPin,
  Zap
} from 'lucide-react';

interface ClubTier {
  name: string;
  color: string;
  bgColor: string;
  price: number;
  benefits: string[];
  cardFeatures: string[];
  exclusive: string[];
}

const FlyeasyClub = () => {
  const [selectedTier, setSelectedTier] = useState('platinum');

  const clubTiers: ClubTier[] = [
    {
      name: 'Silver',
      color: 'text-gray-600',
      bgColor: 'from-gray-100 to-gray-200',
      price: 0,
      benefits: [
        'Priority check-in',
        'Extra baggage allowance (5kg)',
        'Basic travel insurance',
        'Email support',
        'Quarterly travel newsletter'
      ],
      cardFeatures: [
        'No annual fee',
        'Basic cashback on travel',
        'Travel accident insurance'
      ],
      exclusive: [
        'Welcome bonus: 5,000 points',
        'Birthday flight discount'
      ]
    },
    {
      name: 'Gold',
      color: 'text-gold-600',
      bgColor: 'from-gold-100 to-champagne-200',
      price: 150000,
      benefits: [
        'Priority boarding',
        'Lounge access (2 visits/year)',
        'Extra baggage allowance (10kg)',
        'Comprehensive travel insurance',
        'Phone & chat support',
        'Seat selection included',
        'Fast-track security'
      ],
      cardFeatures: [
        'Providus Bank Gold Card',
        '2% cashback on travel',
        '1% cashback on other purchases',
        'Travel insurance up to $50,000',
        'Airport lounge access'
      ],
      exclusive: [
        'Welcome bonus: 15,000 points',
        'Quarterly bonus points',
        'Exclusive member rates'
      ]
    },
    {
      name: 'Platinum',
      color: 'text-navy-600',
      bgColor: 'from-navy-100 to-champagne-200',
      price: 350000,
      benefits: [
        'Priority everything',
        'Unlimited lounge access',
        'Extra baggage allowance (20kg)',
        'Premium travel insurance',
        '24/7 concierge service',
        'Complimentary seat upgrades',
        'Fast-track immigration',
        'Free flight changes',
        'Hotel status matching'
      ],
      cardFeatures: [
        'Providus Bank Platinum Card',
        '3% cashback on travel',
        '1.5% cashback on dining',
        '1% cashback on other purchases',
        'Travel insurance up to $100,000',
        'Global lounge access',
        'No foreign transaction fees'
      ],
      exclusive: [
        'Welcome bonus: 50,000 points',
        'Annual companion ticket',
        'Exclusive member events',
        'Personal travel advisor'
      ]
    },
    {
      name: 'Diamond',
      color: 'text-purple-600',
      bgColor: 'from-purple-100 to-pink-200',
      price: 750000,
      benefits: [
        'White-glove service',
        'Unlimited everything',
        'Private jet access',
        'Luxury travel insurance',
        'Dedicated relationship manager',
        'Guaranteed upgrades',
        'Private terminal access',
        'Unlimited flight changes',
        'Elite hotel partnerships',
        'Michelin restaurant reservations'
      ],
      cardFeatures: [
        'Providus Bank Diamond Card',
        '5% cashback on travel',
        '3% cashback on dining',
        '2% cashback on other purchases',
        'Travel insurance up to $250,000',
        'Global luxury lounge access',
        'Concierge services',
        'No spending limits'
      ],
      exclusive: [
        'Welcome bonus: 100,000 points',
        'Annual private jet hours',
        'Exclusive luxury experiences',
        'Personal lifestyle manager',
        'Invitation-only events'
      ]
    }
  ];

  const providusPartnership = {
    benefits: [
      'Exclusive Flyeasy-Providus co-branded cards',
      'Enhanced cashback rates on travel purchases',
      'Seamless payment integration',
      'Premium banking services',
      'Investment advisory services',
      'Wealth management solutions'
    ],
    features: [
      'Instant card approval for Flyeasy members',
      'No foreign transaction fees',
      'Global ATM access',
      'Premium customer service',
      'Exclusive banking rates',
      'Priority banking services'
    ]
  };

  const additionalPerks = [
    {
      icon: Car,
      title: 'Luxury Ground Transport',
      description: 'Complimentary airport transfers and premium car rentals',
      tiers: ['Gold', 'Platinum', 'Diamond']
    },
    {
      icon: Hotel,
      title: 'Elite Hotel Status',
      description: 'Automatic elite status with luxury hotel chains',
      tiers: ['Platinum', 'Diamond']
    },
    {
      icon: Utensils,
      title: 'Culinary Experiences',
      description: 'Exclusive dining reservations and chef experiences',
      tiers: ['Platinum', 'Diamond']
    },
    {
      icon: Calendar,
      title: 'Event Access',
      description: 'VIP access to exclusive events and experiences',
      tiers: ['Diamond']
    },
    {
      icon: Users,
      title: 'Family Benefits',
      description: 'Extended benefits for family members',
      tiers: ['Gold', 'Platinum', 'Diamond']
    },
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Access to exclusive partner benefits worldwide',
      tiers: ['Platinum', 'Diamond']
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  const selectedTierData = clubTiers.find(tier => tier.name.toLowerCase() === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 to-champagne-50 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-gold-400 to-champagne-400 p-4 rounded-full shadow-lg">
              <Crown className="h-8 w-8 text-navy-900" />
            </div>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 mb-6">
            The Flyeasy Club
          </h1>
          <p className="font-sans text-xl text-charcoal-600 max-w-3xl mx-auto leading-relaxed">
            Elevate your travel experience with exclusive benefits, premium services, 
            and the power of our Providus Bank partnership.
          </p>
        </div>

        {/* Providus Partnership Highlight */}
        <div className="bg-gradient-to-r from-navy-900 to-charcoal-900 rounded-3xl p-12 mb-16 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="bg-gradient-to-r from-gold-400 to-champagne-400 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-navy-900" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-ivory-50">
              Powered by Providus Bank
            </h2>
          </div>
          <p className="font-sans text-xl text-ivory-200 mb-8 max-w-4xl mx-auto leading-relaxed">
            Experience seamless financial services with our exclusive banking partnership. 
            Get premium cards, enhanced benefits, and world-class banking solutions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="font-serif text-xl font-bold text-ivory-50 mb-4">Banking Benefits</h3>
              <ul className="space-y-2">
                {providusPartnership.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-ivory-200">
                    <Check className="h-4 w-4 text-gold-400" />
                    <span className="font-sans text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="font-serif text-xl font-bold text-ivory-50 mb-4">Card Features</h3>
              <ul className="space-y-2">
                {providusPartnership.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-ivory-200">
                    <Check className="h-4 w-4 text-gold-400" />
                    <span className="font-sans text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Membership Tiers */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-bold text-navy-900 text-center mb-12">
            Choose Your Membership
          </h2>
          
          {/* Tier Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {clubTiers.map(tier => (
              <button
                key={tier.name}
                onClick={() => setSelectedTier(tier.name.toLowerCase())}
                className={`px-6 py-3 rounded-xl font-sans font-semibold transition-all ${
                  selectedTier === tier.name.toLowerCase()
                    ? `bg-gradient-to-r ${tier.bgColor} ${tier.color} shadow-lg`
                    : 'bg-white text-charcoal-600 hover:bg-champagne-50 border border-champagne-200'
                }`}
              >
                {tier.name}
              </button>
            ))}
          </div>

          {/* Selected Tier Details */}
          {selectedTierData && (
            <div className={`bg-gradient-to-r ${selectedTierData.bgColor} rounded-3xl p-12 border border-champagne-200 shadow-xl`}>
              <div className="text-center mb-12">
                <h3 className={`font-serif text-4xl font-bold ${selectedTierData.color} mb-4`}>
                  {selectedTierData.name} Membership
                </h3>
                <div className="text-6xl font-bold text-navy-900 mb-2">
                  {selectedTierData.price === 0 ? 'FREE' : formatPrice(selectedTierData.price)}
                </div>
                {selectedTierData.price > 0 && (
                  <p className="font-sans text-charcoal-600">per year</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Travel Benefits */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Plane className="h-5 w-5 text-navy-600" />
                    <h4 className="font-serif text-xl font-bold text-navy-900">Travel Benefits</h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedTierData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="font-sans text-sm text-charcoal-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Features */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <CreditCard className="h-5 w-5 text-navy-600" />
                    <h4 className="font-serif text-xl font-bold text-navy-900">Providus Card</h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedTierData.cardFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="font-sans text-sm text-charcoal-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusive Perks */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-navy-600" />
                    <h4 className="font-serif text-xl font-bold text-navy-900">Exclusive Perks</h4>
                  </div>
                  <ul className="space-y-3">
                    {selectedTierData.exclusive.map((perk, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Star className="h-4 w-4 text-gold-500 mt-0.5 flex-shrink-0" />
                        <span className="font-sans text-sm text-charcoal-700">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-navy-800 to-navy-900 text-ivory-50 px-12 py-4 rounded-xl hover:from-navy-700 hover:to-navy-800 transition-all font-sans font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2 mx-auto">
                  <span>Join {selectedTierData.name} Club</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Perks */}
        <div className="mb-16">
          <h2 className="font-serif text-4xl font-bold text-navy-900 text-center mb-12">
            Additional Member Perks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalPerks.map((perk, index) => {
              const Icon = perk.icon;
              return (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-champagne-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="bg-gradient-to-r from-navy-100 to-champagne-100 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-navy-800" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 mb-3">{perk.title}</h3>
                  <p className="font-sans text-charcoal-600 mb-4 leading-relaxed">{perk.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {perk.tiers.map((tier, tierIndex) => (
                      <span key={tierIndex} className="bg-champagne-100 text-charcoal-700 px-3 py-1 rounded-full text-xs font-medium">
                        {tier}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-gold-400 to-champagne-400 rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl font-bold text-navy-900 mb-6">
            Ready to Elevate Your Travel?
          </h2>
          <p className="font-sans text-xl text-navy-800 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of discerning travelers who have made Flyeasy Club their gateway to extraordinary experiences. 
            Start your journey today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-navy-900 text-ivory-50 px-8 py-4 rounded-xl hover:bg-navy-800 transition-all font-sans font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Compare All Tiers
            </button>
            <button className="bg-white text-navy-900 px-8 py-4 rounded-xl hover:bg-ivory-50 transition-all font-sans font-semibold border border-navy-200">
              Contact Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyeasyClub;