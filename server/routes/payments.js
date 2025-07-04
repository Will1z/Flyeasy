const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const { initializeTransaction, verifyTransaction } = require('../services/paystackService');

const router = express.Router();

// Initialize Paystack payment
router.post('/initialize', async (req, res) => {
  try {
    const { amount, email, currency = 'NGN', bookingData } = req.body;
    
    if (!amount || !email) {
      return res.status(400).json({ error: 'Amount and email are required' });
    }

    const reference = `flyeasy_${uuidv4()}`;
    
    const paystackData = {
      amount: amount * 100, // Paystack expects amount in kobo
      email,
      currency,
      reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      metadata: {
        booking_data: JSON.stringify(bookingData),
        platform: 'flyeasy'
      }
    };

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      paystackData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status) {
      res.json({
        success: true,
        authorization_url: response.data.data.authorization_url,
        access_code: response.data.data.access_code,
        reference
      });
    } else {
      res.status(400).json({ error: 'Failed to initialize payment' });
    }

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize payment',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Verify Paystack payment
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    if (response.data.status && response.data.data.status === 'success') {
      const paymentData = response.data.data;
      
      // Update booking with payment information
      if (paymentData.metadata && paymentData.metadata.booking_data) {
        const bookingData = JSON.parse(paymentData.metadata.booking_data);
        
        // Create booking record
        const bookingId = uuidv4();
        const confirmationCode = `FG${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        await db.run(
          `INSERT INTO bookings (id, user_id, flight_data, passenger_data, total_amount, currency, payment_id, payment_status, booking_status, confirmation_code)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            bookingId,
            bookingData.userId || 'guest',
            JSON.stringify(bookingData.flight),
            JSON.stringify(bookingData.passengers),
            paymentData.amount / 100,
            paymentData.currency,
            reference,
            'completed',
            'confirmed',
            confirmationCode
          ]
        );

        res.json({
          success: true,
          payment: paymentData,
          booking: {
            id: bookingId,
            confirmationCode,
            status: 'confirmed'
          }
        });
      } else {
        res.json({
          success: true,
          payment: paymentData
        });
      }
    } else {
      res.status(400).json({ 
        error: 'Payment verification failed',
        status: response.data.data.status 
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      message: error.response?.data?.message || error.message 
    });
  }
});

// Paystack webhook handler
router.post('/webhook', (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      const event = req.body;
      
      // Handle different event types
      switch (event.event) {
        case 'charge.success':
          console.log('Payment successful:', event.data.reference);
          // Handle successful payment
          break;
        case 'charge.failed':
          console.log('Payment failed:', event.data.reference);
          // Handle failed payment
          break;
        default:
          console.log('Unhandled event:', event.event);
      }
      
      res.status(200).send('OK');
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook error');
  }
});

// Initialize Paystack payment
router.post('/paystack/init', async (req, res) => {
  try {
    const data = await initializeTransaction(req.body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Paystack payment
router.get('/paystack/verify/:reference', async (req, res) => {
  try {
    const data = await verifyTransaction(req.params.reference);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;