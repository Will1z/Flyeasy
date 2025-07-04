const express = require('express');
const axios = require('axios');
const chrono = require('chrono-node');
const moment = require('moment');
// const { chatWithAI } = require('../services/openaiService');

const router = express.Router();

// AI-powered travel assistant
router.post('/chat', (req, res) => {
  res.status(503).json({ error: 'AI chat is currently unavailable. Please try again later.' });
});

// Parse travel intent from message
function parseTravelIntent(message) {
  const messageLower = message.toLowerCase();
  
  // Extract cities
  const fromMatch = messageLower.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/);
  const toMatch = messageLower.match(/to\s+([a-zA-Z\s]+?)(?:\s+on|\s+in|\s+$)/);
  
  // Extract dates
  const dateMatches = chrono.parse(message);
  let departure = '';
  if (dateMatches.length > 0) {
    departure = moment(dateMatches[0].start.date()).format('YYYY-MM-DD');
  }
  
  // Extract passenger count
  let passengers = 1;
  const passengerMatch = messageLower.match(/(\d+)\s+(?:passenger|person|people|traveler)/);
  if (passengerMatch) {
    passengers = parseInt(passengerMatch[1]);
  }
  
  // Extract class
  let flightClass = 'economy';
  if (messageLower.includes('business')) flightClass = 'business';
  if (messageLower.includes('first')) flightClass = 'first';
  if (messageLower.includes('premium')) flightClass = 'premium';
  
  // Determine intent type
  let intentType = 'general';
  if (messageLower.includes('flight') || messageLower.includes('fly')) {
    intentType = 'flight_search';
  } else if (messageLower.includes('hotel') || messageLower.includes('accommodation')) {
    intentType = 'hotel_search';
  } else if (messageLower.includes('tour') || messageLower.includes('activity')) {
    intentType = 'tour_search';
  } else if (messageLower.includes('transfer') || messageLower.includes('taxi')) {
    intentType = 'transfer_search';
  }
  
  return {
    type: intentType,
    from: fromMatch ? fromMatch[1].trim() : '',
    to: toMatch ? toMatch[1].trim() : '',
    departure,
    passengers,
    class: flightClass,
    originalMessage: message
  };
}

// Generate rule-based response
function generateRuleBasedResponse(message) {
  const intent = parseTravelIntent(message);
  const messageLower = message.toLowerCase();
  
  let response = '';
  let suggestions = [];
  
  if (intent.type === 'flight_search') {
    if (!intent.from || !intent.to) {
      response = "I'd love to help you find flights! Could you tell me where you'd like to fly from and to? For example: 'I want to fly from Lagos to Dubai next Friday'";
      suggestions = [
        "Search flights from Lagos to Abuja",
        "Find business class flights to London",
        "Show me flights for next weekend"
      ];
    } else if (!intent.departure) {
      response = `Great! I see you want to fly from ${intent.from} to ${intent.to}. When would you like to travel?`;
      suggestions = [
        "Tomorrow",
        "Next Friday",
        "Next week"
      ];
    } else {
      response = `Perfect! I found your travel details:
      
✈️ **Route:** ${intent.from} → ${intent.to}
📅 **Date:** ${intent.departure}
👥 **Passengers:** ${intent.passengers}
⭐ **Class:** ${intent.class}

Let me search for the best flights for you!`;
      suggestions = [
        "Search these flights",
        "Modify search criteria",
        "Add return date"
      ];
    }
  } else if (intent.type === 'hotel_search') {
    response = `I can help you find great hotels! ${intent.to ? `Looking for accommodation in ${intent.to}?` : 'Which city are you looking for hotels in?'} I can connect you with top booking platforms for the best deals.`;
    suggestions = [
      "Find hotels in Lagos",
      "Search luxury accommodations",
      "Budget-friendly options"
    ];
  } else if (intent.type === 'tour_search') {
    response = `Exciting! ${intent.to ? `There are amazing tours and activities in ${intent.to}.` : 'Which destination are you interested in exploring?'} I can help you discover the best experiences and book tours through our partner platforms.`;
    suggestions = [
      "Popular tours in Dubai",
      "Cultural experiences",
      "Adventure activities"
    ];
  } else {
    // General travel assistance
    if (messageLower.includes('help') || messageLower.includes('assist')) {
      response = `I'm here to help with all your travel needs! I can assist you with:

🛫 **Flight Search** - Find and book flights worldwide
🏨 **Hotels** - Discover great accommodations  
🗺️ **Tours & Activities** - Explore amazing experiences
🚗 **Airport Transfers** - Arrange ground transportation
💳 **Payments** - Secure booking with Paystack

What would you like to explore today?`;
    } else if (messageLower.includes('price') || messageLower.includes('cost')) {
      response = `I can help you find the best prices for your travel needs! Our platform searches multiple sources and applies smart pricing to ensure you get great value. What type of travel are you planning?`;
    } else {
      response = `Hello! I'm your Flyeasy travel assistant. I can help you search for flights, find hotels, discover tours, and plan your perfect trip. Just tell me where you'd like to go and when!`;
    }
    
    suggestions = [
      "Search for flights",
      "Find hotels",
      "Explore destinations",
      "Plan a trip"
    ];
  }
  
  return {
    success: true,
    response,
    intent,
    suggestions
  };
}

// Generate contextual suggestions
function generateSuggestions(intent) {
  const suggestions = [];
  
  switch (intent.type) {
    case 'flight_search':
      suggestions.push(
        "Search flights",
        "Compare prices",
        "Set price alert",
        "Find return flights"
      );
      break;
    case 'hotel_search':
      suggestions.push(
        "Find hotels",
        "Luxury accommodations",
        "Budget options",
        "Hotel deals"
      );
      break;
    case 'tour_search':
      suggestions.push(
        "Popular tours",
        "Cultural experiences",
        "Adventure activities",
        "Day trips"
      );
      break;
    default:
      suggestions.push(
        "Search flights",
        "Find hotels",
        "Explore tours",
        "Plan trip"
      );
  }
  
  return suggestions;
}

// Travel recommendations
router.get('/recommendations/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // Mock recommendations - in production, this could use AI/ML
    const recommendations = {
      'lagos': {
        flights: ['Abuja', 'Port Harcourt', 'Kano', 'Accra', 'London'],
        hotels: ['Eko Hotels & Suites', 'The Wheatbaker', 'Lagos Continental'],
        tours: ['Lagos Island Tour', 'Lekki Conservation Centre', 'National Museum'],
        tips: [
          'Best time to visit: November to March',
          'Traffic can be heavy, plan extra time',
          'Try local cuisine at Victoria Island'
        ]
      },
      'dubai': {
        flights: ['Lagos', 'London', 'New York', 'Mumbai', 'Cairo'],
        hotels: ['Burj Al Arab', 'Atlantis The Palm', 'Armani Hotel'],
        tours: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Palm Jumeirah'],
        tips: [
          'Best time to visit: November to March',
          'Dress modestly in public areas',
          'Friday is the weekend, plan accordingly'
        ]
      }
    };
    
    const cityRecs = recommendations[city.toLowerCase()] || {
      flights: [],
      hotels: [],
      tours: [],
      tips: ['Contact our travel experts for personalized recommendations']
    };
    
    res.json({
      success: true,
      city,
      recommendations: cityRecs
    });
    
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

module.exports = router;