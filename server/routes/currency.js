const express = require('express');
const axios = require('axios');

const router = express.Router();

// Get current exchange rates
router.get('/rates', async (req, res) => {
  try {
    const baseCurrency = req.query.base || 'NGN';
    
    // Try to get rates from exchangerate-api.com
    if (process.env.EXCHANGERATE_API_KEY) {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGERATE_API_KEY}/latest/${baseCurrency}`
        );
        
        if (response.data.result === 'success') {
          res.json({
            success: true,
            base: baseCurrency,
            rates: response.data.conversion_rates,
            lastUpdated: response.data.time_last_update_utc
          });
          return;
        }
      } catch (apiError) {
        console.error('Exchange rate API error:', apiError);
      }
    }
    
    // Fallback to mock rates
    const mockRates = {
      'NGN': 1,
      'USD': 0.0013,
      'EUR': 0.0012,
      'GBP': 0.0010,
      'CAD': 0.0018,
      'AUD': 0.0020,
      'ZAR': 0.024,
      'GHS': 0.0078,
      'KES': 0.17,
      'AED': 0.0048
    };
    
    res.json({
      success: true,
      base: baseCurrency,
      rates: mockRates,
      lastUpdated: new Date().toISOString(),
      source: 'mock'
    });
    
  } catch (error) {
    console.error('Currency rates error:', error);
    res.status(500).json({ error: 'Failed to get exchange rates' });
  }
});

// Convert currency
router.post('/convert', async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    
    if (!amount || !from || !to) {
      return res.status(400).json({ error: 'Amount, from, and to currencies are required' });
    }
    
    // Get current rates
    const ratesResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/currency/rates?base=${from}`);
    
    if (ratesResponse.data.success) {
      const rate = ratesResponse.data.rates[to];
      if (rate) {
        const convertedAmount = amount * rate;
        
        res.json({
          success: true,
          amount,
          from,
          to,
          rate,
          convertedAmount,
          formatted: {
            original: formatCurrency(amount, from),
            converted: formatCurrency(convertedAmount, to)
          }
        });
      } else {
        res.status(400).json({ error: `Conversion rate not available for ${to}` });
      }
    } else {
      res.status(500).json({ error: 'Failed to get exchange rates' });
    }
    
  } catch (error) {
    console.error('Currency conversion error:', error);
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

// Format currency helper function
function formatCurrency(amount, currency) {
  const currencySymbols = {
    'NGN': '₦',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CAD': 'C$',
    'AUD': 'A$',
    'ZAR': 'R',
    'GHS': 'GH₵',
    'KES': 'KSh',
    'AED': 'د.إ'
  };
  
  const symbol = currencySymbols[currency] || currency;
  const decimals = currency === 'NGN' ? 0 : 2;
  
  return `${symbol}${amount.toLocaleString('en-US', { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  })}`;
}

// Get supported currencies
router.get('/supported', (req, res) => {
  const currencies = [
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', flag: '🇬🇭' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' }
  ];
  
  res.json({
    success: true,
    currencies
  });
});

module.exports = router;