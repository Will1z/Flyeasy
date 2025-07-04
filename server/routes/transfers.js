const express = require('express');
const router = express.Router();

// Get airport transfer options
router.post('/search', async (req, res) => {
  try {
    const { city, airport, transferType = 'airport', passengers = 1 } = req.body;
    
    if (!city || !airport) {
      return res.status(400).json({ error: 'City and airport are required' });
    }

    const affiliateId = process.env.TRANSFER_AFFILIATE_ID || 'flyeasy001';
    
    // 12Go Asia deep link
    const twelveGoUrl = `https://12go.asia/en/travel/${airport}/${city}?passengers=${passengers}&affiliate=${affiliateId}`;
    
    // Welcome Pickups deep link
    const welcomePickupsUrl = `https://welcomepickups.com/search?from=${airport}&to=${city}&passengers=${passengers}&partner=flyeasy`;
    
    // Kiwitaxi deep link
    const kiwitaxiUrl = `https://kiwitaxi.com/search?from=${airport}&to=${city}&passengers=${passengers}`;
    
    // Jayride deep link
    const jayrideUrl = `https://www.jayride.com/search?pickup=${airport}&destination=${city}&passengers=${passengers}`;

    const transferOptions = [
      {
        provider: '12Go',
        description: 'Multi-modal transport booking platform',
        url: twelveGoUrl,
        features: ['Multiple transport options', 'Instant confirmation', 'Local operators'],
        vehicleTypes: ['Taxi', 'Bus', 'Train', 'Ferry'],
        coverage: 'Strong in Asia and emerging markets'
      },
      {
        provider: 'Welcome Pickups',
        description: 'Premium airport transfer service',
        url: welcomePickupsUrl,
        features: ['Professional drivers', 'Meet & greet', 'Flight monitoring'],
        vehicleTypes: ['Economy Car', 'Premium Car', 'Van', 'Luxury Vehicle'],
        coverage: 'Global coverage with local expertise'
      },
      {
        provider: 'Kiwitaxi',
        description: 'International transfer booking service',
        url: kiwitaxiUrl,
        features: ['Fixed prices', 'No hidden fees', 'Free cancellation'],
        vehicleTypes: ['Economy', 'Comfort', 'Business', 'Minibus'],
        coverage: 'Worldwide service in 70+ countries'
      },
      {
        provider: 'Jayride',
        description: 'Compare and book airport transfers',
        url: jayrideUrl,
        features: ['Price comparison', 'Verified operators', 'Customer reviews'],
        vehicleTypes: ['Shuttle', 'Private Car', 'Luxury Car', 'Group Transfer'],
        coverage: 'Global platform with local providers'
      }
    ];

    res.json({
      success: true,
      city,
      airport,
      transferType,
      passengers,
      transferOptions
    });

  } catch (error) {
    console.error('Transfer search error:', error);
    res.status(500).json({ error: 'Failed to generate transfer search links' });
  }
});

// Get transfer estimates for popular routes
router.get('/estimates/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // Mock transfer estimates
    const estimates = {
      'lagos': {
        airport: 'LOS',
        routes: [
          {
            from: 'Murtala Muhammed Airport',
            to: 'Victoria Island',
            distance: '25 km',
            duration: '45-90 minutes',
            priceRange: '₦3,000 - ₦15,000',
            options: ['Taxi', 'Uber', 'Private Car']
          },
          {
            from: 'Murtala Muhammed Airport',
            to: 'Ikeja',
            distance: '15 km',
            duration: '30-60 minutes',
            priceRange: '₦2,000 - ₦8,000',
            options: ['Taxi', 'Bus', 'Uber']
          }
        ]
      },
      'dubai': {
        airport: 'DXB',
        routes: [
          {
            from: 'Dubai International Airport',
            to: 'Downtown Dubai',
            distance: '15 km',
            duration: '20-40 minutes',
            priceRange: 'AED 50 - AED 200',
            options: ['Metro', 'Taxi', 'Uber', 'Private Car']
          },
          {
            from: 'Dubai International Airport',
            to: 'Dubai Marina',
            distance: '35 km',
            duration: '40-70 minutes',
            priceRange: 'AED 80 - AED 300',
            options: ['Taxi', 'Uber', 'Private Car']
          }
        ]
      }
    };

    const cityEstimates = estimates[city.toLowerCase()] || { routes: [] };

    res.json({
      success: true,
      city,
      estimates: cityEstimates
    });

  } catch (error) {
    console.error('Transfer estimates error:', error);
    res.status(500).json({ error: 'Failed to get transfer estimates' });
  }
});

module.exports = router;