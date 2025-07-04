const axios = require('axios');
require('dotenv').config();

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY;

async function getFlightStatus(params) {
  const response = await axios.get('http://api.aviationstack.com/v1/flights', {
    params: {
      ...params,
      access_key: AVIATIONSTACK_API_KEY,
    },
  });
  return response.data;
}

module.exports = { getFlightStatus }; 