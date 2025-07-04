const express = require('express');
const router = express.Router();

// Get hotel search links
router.post('/search', async (req, res) => {
  try {
    const { city, checkIn, checkOut, guests = 2, rooms = 1 } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const cityName = city.toLowerCase().replace(/\s+/g, '-');
    const affiliateId = process.env.BOOKING_AFFILIATE_ID || 'flyeasy001';
    
    // Booking.com deep link
    const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=${rooms}&aid=${affiliateId}`;
    
    // Trip.com deep link
    const tripUrl = `https://www.trip.com/hotels/?locale=en-ng&curr=ngn&city=${encodeURIComponent(city)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}&rooms=${rooms}`;
    
    // Agoda deep link
    const agodaUrl = `https://www.agoda.com/search?city=${encodeURIComponent(city)}&checkIn=${checkIn}&checkOut=${checkOut}&rooms=${rooms}&adults=${guests}`;

    const hotelOptions = [
      {
        provider: 'Booking.com',
        description: 'World\'s largest selection of hotels',
        url: bookingUrl,
        features: ['Free cancellation', 'No booking fees', 'Best price guarantee'],
        logo: 'https://logos-world.net/wp-content/uploads/2021/08/Booking-Logo.png'
      },
      {
        provider: 'Trip.com',
        description: 'Great deals on hotels worldwide',
        url: tripUrl,
        features: ['Member prices', '24/7 customer service', 'Instant confirmation'],
        logo: 'https://logos-world.net/wp-content/uploads/2022/01/Trip-Logo.png'
      },
      {
        provider: 'Agoda',
        description: 'Best prices for hotels in Asia and beyond',
        url: agodaUrl,
        features: ['Secret deals', 'Loyalty rewards', 'Local expertise'],
        logo: 'https://logos-world.net/wp-content/uploads/2021/02/Agoda-Logo.png'
      }
    ];

    res.json({
      success: true,
      city,
      checkIn,
      checkOut,
      guests,
      rooms,
      hotelOptions
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ error: 'Failed to generate hotel search links' });
  }
});

// Get hotel recommendations for a city
router.get('/recommendations/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // Mock hotel recommendations
    const recommendations = {
      'lagos': [
        {
          name: 'Eko Hotels & Suites',
          rating: 4.5,
          priceRange: '₦25,000 - ₦45,000',
          features: ['Pool', 'Spa', 'Business Center', 'Multiple Restaurants']
        },
        {
          name: 'The Wheatbaker',
          rating: 4.8,
          priceRange: '₦35,000 - ₦65,000',
          features: ['Luxury Suites', 'Fine Dining', 'Concierge Service']
        }
      ],
      'abuja': [
        {
          name: 'Transcorp Hilton Abuja',
          rating: 4.6,
          priceRange: '₦30,000 - ₦55,000',
          features: ['City Views', 'Pool', 'Fitness Center', 'Business Facilities']
        }
      ],
      'dubai': [
        {
          name: 'Burj Al Arab',
          rating: 5.0,
          priceRange: '$500 - $2,000',
          features: ['Iconic Luxury', 'Butler Service', 'Private Beach', 'Helicopter Pad']
        }
      ]
    };

    const cityRecommendations = recommendations[city.toLowerCase()] || [];

    res.json({
      success: true,
      city,
      recommendations: cityRecommendations
    });

  } catch (error) {
    console.error('Hotel recommendations error:', error);
    res.status(500).json({ error: 'Failed to get hotel recommendations' });
  }
});

module.exports = router;