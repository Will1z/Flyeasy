const axios = require('axios');
require('dotenv').config();

const TRAVELPAYOUTS_API_KEY = process.env.TRAVELPAYOUTS_API_KEY;

async function searchFlights(params) {
  console.log('Travelpayouts service: Searching with params:', params);
  console.log('Travelpayouts service: Using API key:', TRAVELPAYOUTS_API_KEY ? 'Present' : 'Missing');
  
  const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', {
    params: {
      ...params,
      token: TRAVELPAYOUTS_API_KEY,
    },
  });
  
  console.log('Travelpayouts service: Raw response:', response.data);
  return response.data;
}

module.exports = { searchFlights }; 