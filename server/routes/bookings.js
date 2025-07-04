const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { authenticateToken } = require('./auth');
const emailService = require('../services/emailService');
const { parseDate } = require('../services/chronoService');

const router = express.Router();

// Create booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { flight, passengers, totalAmount, currency = 'NGN' } = req.body;
    
    if (!flight || !passengers || !totalAmount) {
      return res.status(400).json({ error: 'Missing required booking data' });
    }

    const bookingId = uuidv4();
    const confirmationCode = `FG${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    await db.run(
      `INSERT INTO bookings (id, user_id, flight_data, passenger_data, total_amount, currency, booking_status, confirmation_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        req.user.userId,
        JSON.stringify(flight),
        JSON.stringify(passengers),
        totalAmount,
        currency,
        'pending',
        confirmationCode
      ]
    );

    // Get user data for email
    const user = await db.get(
      'SELECT email, first_name, last_name FROM users WHERE id = ?',
      [req.user.userId]
    );

    // Send booking confirmation email
    if (user) {
      await emailService.sendBookingConfirmation(user.email, {
        bookingId,
        confirmationCode,
        flight,
        passengers,
        totalAmount,
        currency,
        userName: `${user.first_name} ${user.last_name}`
      });
    }

    res.status(201).json({
      success: true,
      booking: {
        id: bookingId,
        confirmationCode,
        status: 'pending',
        flight,
        passengers,
        totalAmount,
        currency,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user bookings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bookings = await db.all(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.userId]
    );

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      flight: JSON.parse(booking.flight_data),
      passengers: JSON.parse(booking.passenger_data),
      totalAmount: booking.total_amount,
      currency: booking.currency,
      paymentId: booking.payment_id,
      paymentStatus: booking.payment_status,
      status: booking.booking_status,
      confirmationCode: booking.confirmation_code,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }));

    res.json({
      success: true,
      bookings: formattedBookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Get booking by ID
router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await db.get(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, req.user.userId]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      success: true,
      booking: {
        id: booking.id,
        flight: JSON.parse(booking.flight_data),
        passengers: JSON.parse(booking.passenger_data),
        totalAmount: booking.total_amount,
        currency: booking.currency,
        paymentId: booking.payment_id,
        paymentStatus: booking.payment_status,
        status: booking.booking_status,
        confirmationCode: booking.confirmation_code,
        createdAt: booking.created_at,
        updatedAt: booking.updated_at
      }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

// Cancel booking
router.patch('/:bookingId/cancel', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await db.get(
      'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, req.user.userId]
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.booking_status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    await db.run(
      'UPDATE bookings SET booking_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['cancelled', bookingId]
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Admin: Get all bookings
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    // Simple admin check - in production, use proper role-based access
    const user = await db.get('SELECT email FROM users WHERE id = ?', [req.user.userId]);
    if (!user || user.email !== 'admin@flyeasy.com') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const bookings = await db.all(`
      SELECT b.*, u.email, u.first_name, u.last_name 
      FROM bookings b 
      JOIN users u ON b.user_id = u.id 
      ORDER BY b.created_at DESC
    `);

    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      user: {
        email: booking.email,
        name: `${booking.first_name} ${booking.last_name}`
      },
      flight: JSON.parse(booking.flight_data),
      passengers: JSON.parse(booking.passenger_data),
      totalAmount: booking.total_amount,
      currency: booking.currency,
      paymentId: booking.payment_id,
      paymentStatus: booking.payment_status,
      status: booking.booking_status,
      confirmationCode: booking.confirmation_code,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at
    }));

    res.json({
      success: true,
      bookings: formattedBookings
    });

  } catch (error) {
    console.error('Admin get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Parse natural language date
router.post('/parse-date', (req, res) => {
  try {
    const { text } = req.body;
    const date = parseDate(text);
    res.json({ date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;