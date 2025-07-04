const nodemailer = require('nodemailer');
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html, emailType = 'general') {
    try {
      const mailOptions = {
        from: `"Flyeasy Travel" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log email
      await this.logEmail(to, emailType, subject, 'sent');
      
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      
      // Log failed email
      await this.logEmail(to, emailType, subject, 'failed', error.message);
      
      throw error;
    }
  }

  async logEmail(email, type, subject, status, errorMessage = null) {
    try {
      await db.run(
        `INSERT INTO email_logs (id, email_type, recipient_email, subject, status, error_message)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [uuidv4(), type, email, subject, status, errorMessage]
      );
    } catch (error) {
      console.error('Email logging error:', error);
    }
  }

  async sendBookingConfirmation(email, bookingData) {
    const { bookingId, confirmationCode, flight, passengers, totalAmount, currency, userName } = bookingData;
    
    const subject = `Booking Confirmation - ${confirmationCode}`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1e3a8a, #374151); color: white; padding: 30px; text-align: center; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; }
            .confirmation-box { background-color: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .confirmation-code { font-size: 24px; font-weight: bold; color: #0ea5e9; margin: 10px 0; }
            .flight-details { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
            .detail-label { font-weight: 600; color: #475569; }
            .detail-value { color: #1e293b; }
            .total-amount { background-color: #1e3a8a; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✈️ Flyeasy</div>
                <p>Your booking is confirmed!</p>
            </div>
            
            <div class="content">
                <h2>Hello ${userName},</h2>
                <p>Thank you for choosing Flyeasy! Your flight booking has been confirmed and we're excited to be part of your journey.</p>
                
                <div class="confirmation-box">
                    <h3>Booking Confirmation</h3>
                    <div class="confirmation-code">${confirmationCode}</div>
                    <p>Please save this confirmation code for your records</p>
                </div>
                
                <div class="flight-details">
                    <h3>Flight Details</h3>
                    <div class="detail-row">
                        <span class="detail-label">Airline:</span>
                        <span class="detail-value">${flight.airline}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Route:</span>
                        <span class="detail-value">${flight.from} → ${flight.to}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Departure:</span>
                        <span class="detail-value">${flight.departure}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">${flight.duration}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Class:</span>
                        <span class="detail-value">${flight.class}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Passengers:</span>
                        <span class="detail-value">${passengers.length}</span>
                    </div>
                </div>
                
                <div class="total-amount">
                    <h3 style="margin: 0;">Total Amount Paid</h3>
                    <div style="font-size: 24px; font-weight: bold; margin-top: 10px;">
                        ${currency === 'NGN' ? '₦' : '$'}${totalAmount.toLocaleString()}
                    </div>
                </div>
                
                <h3>What's Next?</h3>
                <ul>
                    <li>Check-in online 24 hours before departure</li>
                    <li>Arrive at the airport at least 2 hours early for domestic flights</li>
                    <li>Bring a valid ID and your confirmation code</li>
                    <li>Check baggage allowances with your airline</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View Booking Details</a>
                </div>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our customer support team.</p>
                
                <p>Safe travels!<br>The Flyeasy Team</p>
            </div>
            
            <div class="footer">
                <p>© 2024 Flyeasy. All rights reserved.</p>
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    return await this.sendEmail(email, subject, html, 'booking_confirmation');
  }

  async sendPriceAlert(email, alertData) {
    const { route, currentPrice, targetPrice, currency, userName } = alertData;
    
    const subject = `Price Alert: ${route} - Price Drop Detected!`;
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Price Alert</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .alert-box { background-color: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .price-comparison { display: flex; justify-content: space-around; margin: 20px 0; }
            .price-box { text-align: center; padding: 15px; border-radius: 8px; }
            .old-price { background-color: #fee2e2; color: #dc2626; }
            .new-price { background-color: #dcfce7; color: #059669; }
            .savings { background-color: #1e3a8a; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Price Alert!</h1>
                <p>Great news! The price for your watched route has dropped.</p>
            </div>
            
            <div class="content">
                <h2>Hello ${userName || 'Traveler'},</h2>
                
                <div class="alert-box">
                    <h3>Price Drop Detected for ${route}</h3>
                    <p>The flight price has dropped below your target price!</p>
                </div>
                
                <div class="price-comparison">
                    <div class="price-box old-price">
                        <h4>Your Target</h4>
                        <div style="font-size: 20px; font-weight: bold;">
                            ${currency === 'NGN' ? '₦' : '$'}${targetPrice.toLocaleString()}
                        </div>
                    </div>
                    <div class="price-box new-price">
                        <h4>Current Price</h4>
                        <div style="font-size: 20px; font-weight: bold;">
                            ${currency === 'NGN' ? '₦' : '$'}${currentPrice.toLocaleString()}
                        </div>
                    </div>
                </div>
                
                <div class="savings">
                    <h3 style="margin: 0;">You're saving</h3>
                    <div style="font-size: 24px; font-weight: bold; margin-top: 10px;">
                        ${currency === 'NGN' ? '₦' : '$'}${(targetPrice - currentPrice).toLocaleString()}
                    </div>
                </div>
                
                <p>This is a great opportunity to book your flight! Prices can change quickly, so we recommend booking soon to secure this deal.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/?from=${route.split(' → ')[0]}&to=${route.split(' → ')[1]}" class="button">Book Now</a>
                </div>
                
                <p>Happy travels!<br>The Flyeasy Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    return await this.sendEmail(email, subject, html, 'price_alert');
  }

  async sendWelcomeEmail(email, userData) {
    const { firstName, lastName } = userData;
    const userName = `${firstName} ${lastName}`;
    
    const subject = 'Welcome to Flyeasy - Your Journey Begins Here!';
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Flyeasy</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1e3a8a, #374151); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .feature-box { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .button { display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✈️ Welcome to Flyeasy!</h1>
                <p>Your premium travel experience starts here</p>
            </div>
            
            <div class="content">
                <h2>Hello ${userName},</h2>
                <p>Welcome to Flyeasy! We're thrilled to have you join our community of discerning travelers who value quality, convenience, and exceptional service.</p>
                
                <h3>What makes Flyeasy special?</h3>
                
                <div class="feature-box">
                    <h4>🔍 Smart Flight Search</h4>
                    <p>Our AI-powered search finds the best flights from multiple airlines with transparent pricing.</p>
                </div>
                
                <div class="feature-box">
                    <h4>💰 Price Alerts</h4>
                    <p>Set up price alerts and we'll notify you when flight prices drop for your favorite routes.</p>
                </div>
                
                <div class="feature-box">
                    <h4>🏨 Complete Travel Solutions</h4>
                    <p>Beyond flights, we help you find hotels, tours, and airport transfers for a seamless journey.</p>
                </div>
                
                <div class="feature-box">
                    <h4>🤖 AI Travel Assistant</h4>
                    <p>Chat with our intelligent assistant using natural language to plan your perfect trip.</p>
                </div>
                
                <h3>Ready to start exploring?</h3>
                <p>Your account is all set up and ready to use. Start by searching for your next adventure!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}" class="button">Start Exploring</a>
                </div>
                
                <p>If you have any questions, our support team is here to help. Welcome aboard!</p>
                
                <p>Safe travels,<br>The Flyeasy Team</p>
            </div>
        </div>
    </body>
    </html>
    `;
    
    return await this.sendEmail(email, subject, html, 'welcome');
  }
}

module.exports = new EmailService();