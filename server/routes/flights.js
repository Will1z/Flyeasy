const express = require('express');
const axios = require('axios');
const chrono = require('chrono-node');
const moment = require('moment');
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const { searchFlights } = require('../services/travelpayoutsService');
const { getFlightStatus } = require('../services/aviationstackService');

const router = express.Router();

// Search flights using Travelpayouts
router.get('/search', async (req, res) => {
  try {
    console.log('Backend: Flight search request with params:', req.query);
    const { from, to, date, adults = 1 } = req.query;
    
    if (!from || !to || !date) {
      return res.status(400).json({ error: 'Missing required parameters: from, to, date' });
    }

    // Generate 20 flight options with different airlines and times
    const airlines = [
      'Air Peace', 'Arik Air', 'Dana Air', 'Max Air', 'Overland Airways',
      'Ibom Air', 'United Nigeria', 'Green Africa', 'ValueJet', 'Rano Air',
      'Aero Contractors', 'Med-View Airlines', 'Azman Air', 'Allied Air',
      'Chanchangi Airlines', 'First Nation Airways', 'Kabo Air', 'Sosoliso Airlines',
      'ADC Airlines', 'Bellview Airlines'
    ];
    const basePrices = [
      65000, 68000, 72000, 75000, 78000, 82000, 85000, 88000, 92000, 95000,
      98000, 102000, 105000, 108000, 112000, 115000, 118000, 122000, 125000, 128000
    ];
    const departureTimes = [
      '06:15', '07:30', '08:45', '09:20', '10:15', '11:00', '12:30', '13:45',
      '14:20', '15:30', '16:15', '17:00', '18:30', '19:45', '20:20', '21:15',
      '22:00', '23:30', '00:15', '01:45'
    ];
    const arrivalTimes = [
      '08:30', '09:45', '11:00', '11:55', '12:50', '13:35', '15:05', '16:20',
      '16:55', '18:05', '18:50', '19:35', '21:05', '22:20', '22:55', '23:50',
      '00:35', '02:05', '02:50', '04:20'
    ];
    const durations = [
      '2h 15m', '2h 15m', '2h 15m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m',
      '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m',
      '2h 35m', '2h 35m', '2h 35m', '2h 35m'
    ];
    const flightNumbers = [
      'P47156', 'W3 123', '9J 456', 'VL 789', 'OJ 234', 'QI 567', 'UN 890', 'GA 123',
      'VJ 456', 'RN 789', 'AC 012', 'MV 345', 'AZ 678', 'AL 901', 'CC 234', 'FN 567',
      'KB 890', 'SO 123', 'AD 456', 'BV 789'
    ];
    
    const flights = airlines.map((airline, index) => {
      const basePrice = basePrices[index];
      const markedUpPrice = Math.round(basePrice * (1 + Math.random() * 0.08)); // 0-8% markup
      return {
        id: `flight-${index + 1}`,
        airline,
        flightNumber: flightNumbers[index],
        from,
        to,
        departure: departureTimes[index],
        arrival: arrivalTimes[index],
        duration: durations[index],
        price: markedUpPrice,
        originalPrice: basePrice,
        currency: 'NGN',
        stops: Math.random() > 0.7 ? 1 : 0, // 30% chance of stops
        aircraft: 'Boeing 737-800',
        class: 'economy',
        amenities: ['WiFi', 'Meals', 'Entertainment'],
        baggage: { cabin: '7kg', checked: '20kg' },
        cancellationPolicy: 'Free cancellation up to 24 hours',
        availableSeats: Math.floor(Math.random() * 50) + 10,
        provider: 'mock',
        deepLink: `https://www.aviasales.com/search/${from}${to}${date.replace(/-/g, '')}`
      };
    });
    // Sort by price (lowest first)
    flights.sort((a, b) => a.price - b.price);

    res.json({
      success: true,
      flights,
      searchParams: {
        from,
        to,
        departure: date,
        passengers: parseInt(adults),
        class: 'economy'
      }
    });
  } catch (error) {
    console.error('Backend: Flight search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Airport codes mapping
const airportCodes = {
  'lagos': 'LOS',
  'abuja': 'ABV',
  'port harcourt': 'PHC',
  'kano': 'KAN',
  'accra': 'ACC',
  'london': 'LON',
  'dubai': 'DXB',
  'new york': 'NYC',
  'paris': 'PAR',
  'amsterdam': 'AMS',
  'istanbul': 'IST',
  'cairo': 'CAI',
  'johannesburg': 'JNB',
  'nairobi': 'NBO'
};

// Get airport code from city name
function getAirportCode(cityName) {
  const city = cityName.toLowerCase().trim();
  return airportCodes[city] || city.toUpperCase();
}

// Parse natural language date
function parseDate(dateString) {
  if (!dateString) return null;
  
  const parsed = chrono.parseDate(dateString);
  if (parsed) {
    return moment(parsed).format('YYYY-MM-DD');
  }
  
  // Handle specific cases
  const today = moment();
  const lower = dateString.toLowerCase();
  
  if (lower.includes('tomorrow')) {
    return today.add(1, 'day').format('YYYY-MM-DD');
  }
  if (lower.includes('next week')) {
    return today.add(1, 'week').format('YYYY-MM-DD');
  }
  if (lower.includes('next friday')) {
    const nextFriday = today.clone().day(5);
    if (nextFriday.isSameOrBefore(today)) {
      nextFriday.add(1, 'week');
    }
    return nextFriday.format('YYYY-MM-DD');
  }
  
  return dateString;
}

// Search flights using Travelpayouts API
router.post('/search', async (req, res) => {
  try {
    const { from, to, departure, returnDate, passengers = 1, class: flightClass = 'economy' } = req.body;
    
    if (!from || !to || !departure) {
      return res.status(400).json({ error: 'Missing required fields: from, to, departure' });
    }

    const originCode = getAirportCode(from);
    const destinationCode = getAirportCode(to);
    const departureDate = parseDate(departure);
    
    // Log search history
    const searchId = uuidv4();
    await db.run(
      `INSERT INTO search_history (id, origin, destination, departure_date, return_date, passengers, class) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [searchId, originCode, destinationCode, departureDate, returnDate || null, passengers, flightClass]
    );

    // Call Travelpayouts API
    let flights = [];
    
    try {
      if (originCode && destinationCode) {
        // Use the correct Travelpayouts API endpoint
        const apiUrl = 'https://api.travelpayouts.com/v2/prices/nearest-places-matrix';
        const params = {
          origin: originCode,
          destination: destinationCode,
          depart_date: departureDate,
          return_date: returnDate || departureDate, // Use same date if no return
          currency: 'ngn',
          show_to_affiliates: 'true',
          limit: 20
        };

        const response = await axios.get(apiUrl, {
          params,
          headers: {
            'Authorization': `Bearer ${process.env.TRAVELPAYOUTS_API_KEY || process.env.TRAVELPAYOUTS_TOKEN}`
          },
          timeout: 15000
        });

        console.log('Travelpayouts API response:', response.status, response.data);

        if (response.data && response.data.data) {
          flights = Object.values(response.data.data).map(flight => {
            const originalPrice = flight.price;
            const markedUpPrice = Math.round(originalPrice * 1.03); // 3% markup
            
            return {
              id: uuidv4(),
              airline: flight.airline || 'Unknown Airline',
              flightNumber: flight.flight_number || 'N/A',
              from: from,
              to: to,
              departure: flight.departure_at ? moment(flight.departure_at).format('HH:mm') : '00:00',
              arrival: flight.return_at ? moment(flight.return_at).format('HH:mm') : '00:00',
              duration: flight.duration ? `${Math.floor(flight.duration / 60)}h ${flight.duration % 60}m` : 'N/A',
              price: markedUpPrice,
              originalPrice,
              currency: 'NGN',
              stops: flight.number_of_changes || 0,
              aircraft: 'Boeing 737',
              class: flightClass,
              amenities: ['WiFi', 'Meals', 'Entertainment'],
              baggage: {
                cabin: '7kg',
                checked: '20kg'
              },
              cancellationPolicy: 'Free cancellation up to 24 hours',
              availableSeats: Math.floor(Math.random() * 50) + 10,
              provider: 'travelpayouts',
              deepLink: flight.link || `https://www.aviasales.com/search/${originCode}${destinationCode}${departureDate.replace(/-/g, '')}`
            };
          });
        }
      }
    } catch (apiError) {
      console.log('Travelpayouts API failed, using mock data:', apiError.message);
      console.log('API Error details:', apiError.response?.data || apiError.response?.status);
    }

    // If no flights from API, return mock data
    if (flights.length === 0) {
      const airlines = [
        'Air Peace', 'Arik Air', 'Dana Air', 'Max Air', 'Overland Airways',
        'Ibom Air', 'United Nigeria', 'Green Africa', 'ValueJet', 'Rano Air',
        'Aero Contractors', 'Med-View Airlines', 'Azman Air', 'Allied Air',
        'Chanchangi Airlines', 'First Nation Airways', 'Kabo Air', 'Sosoliso Airlines',
        'ADC Airlines', 'Bellview Airlines'
      ];
      
      const departureTimes = [
        '06:15', '07:30', '08:45', '09:20', '10:15', '11:00', '12:30', '13:45',
        '14:20', '15:30', '16:15', '17:00', '18:30', '19:45', '20:20', '21:15',
        '22:00', '23:30', '00:15', '01:45'
      ];
      
      const arrivalTimes = [
        '08:30', '09:45', '11:00', '11:55', '12:50', '13:35', '15:05', '16:20',
        '16:55', '18:05', '18:50', '19:35', '21:05', '22:20', '22:55', '23:50',
        '00:35', '02:05', '02:50', '04:20'
      ];
      
      const durations = [
        '2h 15m', '2h 15m', '2h 15m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m',
        '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m', '2h 35m',
        '2h 35m', '2h 35m', '2h 35m', '2h 35m'
      ];
      
      const flightNumbers = [
        'P47156', 'W3 123', '9J 456', 'VL 789', 'OJ 234', 'QI 567', 'UN 890', 'GA 123',
        'VJ 456', 'RN 789', 'AC 012', 'MV 345', 'AZ 678', 'AL 901', 'CC 234', 'FN 567',
        'KB 890', 'SO 123', 'AD 456', 'BV 789'
      ];
      
      // Generate 20 flights with varying prices (cheapest first)
      const basePrices = [
        65000, 68000, 72000, 75000, 78000, 82000, 85000, 88000, 92000, 95000,
        98000, 102000, 105000, 108000, 112000, 115000, 118000, 122000, 125000, 128000
      ];
      
      flights = airlines.map((airline, index) => {
        const basePrice = basePrices[index];
        const markedUpPrice = Math.round(basePrice * (1 + Math.random() * 0.08)); // 0-8% markup
        
        return {
          id: uuidv4(),
          airline,
          flightNumber: flightNumbers[index],
          from: from,
          to: to,
          departure: departureTimes[index],
          arrival: arrivalTimes[index],
          duration: durations[index],
          price: markedUpPrice,
          originalPrice: basePrice,
          currency: 'NGN',
          stops: Math.random() > 0.7 ? 1 : 0, // 30% chance of 1 stop
          aircraft: 'Boeing 737-800',
          class: flightClass,
          amenities: ['WiFi', 'Meals', 'Entertainment'],
          baggage: { cabin: '7kg', checked: '20kg' },
          cancellationPolicy: 'Free cancellation up to 24 hours',
          availableSeats: Math.floor(Math.random() * 50) + 10,
          provider: 'mock',
          deepLink: `https://www.aviasales.com/search/${originCode}${destinationCode}${departureDate.replace(/-/g, '')}`
        };
      });
      
      // Sort flights by price (cheapest first)
      flights.sort((a, b) => a.price - b.price);
    }

    res.json({
      success: true,
      searchId,
      flights,
      searchParams: {
        from: from,
        to: to,
        departure: departureDate,
        returnDate,
        passengers,
        class: flightClass
      }
    });

  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ 
      error: 'Failed to search flights',
      message: error.message 
    });
  }
});



// Get flight details
router.get('/:flightId', async (req, res) => {
  try {
    const { flightId } = req.params;
    
    // In a real implementation, you'd fetch from database or API
    // For now, return mock data
    const flight = {
      id: flightId,
      airline: 'Air Peace',
      flightNumber: 'P47156',
      from: 'LOS',
      to: 'ABV',
      departure: '08:30',
      arrival: '10:45',
      duration: '2h 15m',
      price: 85000,
      currency: 'NGN',
      stops: 0,
      aircraft: 'Boeing 737-800',
      class: 'economy',
      amenities: ['WiFi', 'Meals', 'Entertainment'],
      baggage: { cabin: '7kg', checked: '20kg' },
      cancellationPolicy: 'Free cancellation up to 24 hours',
      availableSeats: 45
    };

    res.json({ success: true, flight });
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({ error: 'Failed to get flight details' });
  }
});

// Natural language search
router.post('/search/natural', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Parse natural language query
    const queryLower = query.toLowerCase();
    
    // Extract origin and destination
    let from = '', to = '';
    const fromMatch = queryLower.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/);
    const toMatch = queryLower.match(/to\s+([a-zA-Z\s]+?)(?:\s+on|\s+in|\s+$)/);
    
    if (fromMatch) from = fromMatch[1].trim();
    if (toMatch) to = toMatch[1].trim();
    
    // Extract date
    const dateMatch = chrono.parse(query);
    let departure = '';
    if (dateMatch.length > 0) {
      departure = moment(dateMatch[0].start.date()).format('YYYY-MM-DD');
    }
    
    // Extract passenger count
    let passengers = 1;
    const passengerMatch = queryLower.match(/(\d+)\s+(?:passenger|person|people|traveler)/);
    if (passengerMatch) {
      passengers = parseInt(passengerMatch[1]);
    }
    
    // Extract class
    let flightClass = 'economy';
    if (queryLower.includes('business')) flightClass = 'business';
    if (queryLower.includes('first')) flightClass = 'first';
    if (queryLower.includes('premium')) flightClass = 'premium';

    res.json({
      success: true,
      parsed: {
        from,
        to,
        departure,
        passengers,
        class: flightClass,
        originalQuery: query
      }
    });

  } catch (error) {
    console.error('Natural language search error:', error);
    res.status(500).json({ error: 'Failed to parse search query' });
  }
});

// Get real-time flight status using Aviationstack
router.get('/status', async (req, res) => {
  try {
    const data = await getFlightStatus(req.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;