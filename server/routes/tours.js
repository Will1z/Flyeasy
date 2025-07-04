const express = require('express');
const router = express.Router();

// Get tour and activity links
router.post('/search', async (req, res) => {
  try {
    const { city, date, travelers = 2 } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    const affiliateId = process.env.KLOOK_AFFILIATE_ID || 'flyeasy001';
    const expediaId = process.env.EXPEDIA_AFFILIATE_ID || 'flyeasy001';
    
    // Klook deep link
    const klookUrl = `https://partner.klook.com/en-US/deeplink?city=${encodeURIComponent(city)}&affId=${affiliateId}&date=${date}&travelers=${travelers}`;
    
    // Expedia activities deep link
    const expediaUrl = `https://www.expedia.com/things-to-do/search?location=${encodeURIComponent(city)}&date=${date}&travelers=${travelers}`;
    
    // Viator deep link
    const viatorUrl = `https://www.viator.com/searchResults/all?text=${encodeURIComponent(city)}&pid=P00054063`;
    
    // GetYourGuide deep link
    const getYourGuideUrl = `https://www.getyourguide.com/s/?q=${encodeURIComponent(city)}&partner_id=flyeasy`;

    const tourOptions = [
      {
        provider: 'Klook',
        description: 'Discover amazing activities and attractions',
        url: klookUrl,
        features: ['Instant confirmation', 'Mobile vouchers', 'Best price guarantee'],
        specialties: ['Asian destinations', 'Unique experiences', 'Local insights']
      },
      {
        provider: 'Expedia',
        description: 'Tours, activities, and experiences worldwide',
        url: expediaUrl,
        features: ['Flexible booking', 'Expert guides', 'Small group tours'],
        specialties: ['City tours', 'Cultural experiences', 'Adventure activities']
      },
      {
        provider: 'Viator',
        description: 'A TripAdvisor company offering curated experiences',
        url: viatorUrl,
        features: ['Skip-the-line access', 'Local guides', 'Free cancellation'],
        specialties: ['Historical tours', 'Food experiences', 'Day trips']
      },
      {
        provider: 'GetYourGuide',
        description: 'Book tours, attractions, and activities',
        url: getYourGuideUrl,
        features: ['Instant booking', 'Mobile tickets', '24/7 support'],
        specialties: ['Museum tickets', 'Walking tours', 'Adventure sports']
      }
    ];

    res.json({
      success: true,
      city,
      date,
      travelers,
      tourOptions
    });

  } catch (error) {
    console.error('Tour search error:', error);
    res.status(500).json({ error: 'Failed to generate tour search links' });
  }
});

// Get popular activities for a city
router.get('/popular/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // Mock popular activities
    const activities = {
      'lagos': [
        {
          name: 'Lagos Island City Tour',
          description: 'Explore the historic heart of Lagos',
          duration: '4 hours',
          priceRange: '₦15,000 - ₦25,000',
          rating: 4.5,
          highlights: ['National Museum', 'Lagos Island', 'Tafawa Balewa Square']
        },
        {
          name: 'Lekki Conservation Centre',
          description: 'Nature walk and canopy walkway',
          duration: '3 hours',
          priceRange: '₦5,000 - ₦10,000',
          rating: 4.3,
          highlights: ['Canopy Walkway', 'Wildlife Viewing', 'Nature Trails']
        }
      ],
      'dubai': [
        {
          name: 'Burj Khalifa Observation Deck',
          description: 'Visit the world\'s tallest building',
          duration: '2 hours',
          priceRange: '$30 - $100',
          rating: 4.8,
          highlights: ['124th Floor', '148th Floor', 'Dubai Fountain Views']
        },
        {
          name: 'Desert Safari with BBQ',
          description: 'Adventure in the Arabian Desert',
          duration: '6 hours',
          priceRange: '$50 - $150',
          rating: 4.7,
          highlights: ['Dune Bashing', 'Camel Riding', 'Traditional BBQ']
        }
      ],
      'london': [
        {
          name: 'Tower of London Tour',
          description: 'Historic fortress and Crown Jewels',
          duration: '3 hours',
          priceRange: '£25 - £35',
          rating: 4.6,
          highlights: ['Crown Jewels', 'Beefeater Tours', 'Tower Bridge Views']
        }
      ]
    };

    const cityActivities = activities[city.toLowerCase()] || [];

    res.json({
      success: true,
      city,
      activities: cityActivities
    });

  } catch (error) {
    console.error('Popular activities error:', error);
    res.status(500).json({ error: 'Failed to get popular activities' });
  }
});

module.exports = router;