const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, preferredCurrency = 'NGN' } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    await db.run(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, preferred_currency)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, email, passwordHash, firstName, lastName, phone, preferredCurrency]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Get user data (without password)
    const user = await db.get(
      'SELECT id, email, first_name, last_name, phone, preferred_currency, email_notifications, sms_notifications, price_alerts, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        preferredCurrency: user.preferred_currency,
        notifications: {
          email: Boolean(user.email_notifications),
          sms: Boolean(user.sms_notifications),
          priceAlerts: Boolean(user.price_alerts)
        },
        createdAt: user.created_at
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from database
    const user = await db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.run(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        preferredCurrency: user.preferred_currency,
        notifications: {
          email: Boolean(user.email_notifications),
          sms: Boolean(user.sms_notifications),
          priceAlerts: Boolean(user.price_alerts)
        },
        createdAt: user.created_at,
        lastLogin: new Date().toISOString()
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, email, first_name, last_name, phone, preferred_currency, email_notifications, sms_notifications, price_alerts, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        preferredCurrency: user.preferred_currency,
        notifications: {
          email: Boolean(user.email_notifications),
          sms: Boolean(user.sms_notifications),
          priceAlerts: Boolean(user.price_alerts)
        },
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone, preferredCurrency, notifications } = req.body;
    
    const updates = [];
    const values = [];
    
    if (firstName) {
      updates.push('first_name = ?');
      values.push(firstName);
    }
    if (lastName) {
      updates.push('last_name = ?');
      values.push(lastName);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }
    if (preferredCurrency) {
      updates.push('preferred_currency = ?');
      values.push(preferredCurrency);
    }
    if (notifications) {
      if (notifications.email !== undefined) {
        updates.push('email_notifications = ?');
        values.push(notifications.email ? 1 : 0);
      }
      if (notifications.sms !== undefined) {
        updates.push('sms_notifications = ?');
        values.push(notifications.sms ? 1 : 0);
      }
      if (notifications.priceAlerts !== undefined) {
        updates.push('price_alerts = ?');
        values.push(notifications.priceAlerts ? 1 : 0);
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.user.userId);
    
    await db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user data
    const user = await db.get(
      'SELECT id, email, first_name, last_name, phone, preferred_currency, email_notifications, sms_notifications, price_alerts, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        preferredCurrency: user.preferred_currency,
        notifications: {
          email: Boolean(user.email_notifications),
          sms: Boolean(user.sms_notifications),
          priceAlerts: Boolean(user.price_alerts)
        },
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

module.exports = { router, authenticateToken };