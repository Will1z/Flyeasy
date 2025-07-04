const axios = require('axios');
require('dotenv').config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

async function initializeTransaction(data) {
  const response = await paystack.post('/transaction/initialize', data);
  return response.data;
}

async function verifyTransaction(reference) {
  const response = await paystack.get(`/transaction/verify/${reference}`);
  return response.data;
}

module.exports = { initializeTransaction, verifyTransaction }; 