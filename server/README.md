# Flyeasy Backend API

A comprehensive Node.js backend for the Flyeasy travel booking platform with Express, SQLite, and multiple travel API integrations.

## 🚀 Features

### Core APIs
- **Flight Search** - Travelpayouts/Aviasales API integration with 3% markup
- **Hotels** - Deep links to Booking.com, Trip.com, Agoda
- **Tours & Activities** - Integration with Klook, Expedia, Viator, GetYourGuide
- **Airport Transfers** - Links to 12Go, Welcome Pickups, Kiwitaxi, Jayride
- **Payments** - Paystack integration for Naira payments
- **Email Notifications** - Nodemailer with Gmail/SendGrid support

### Advanced Features
- **AI Travel Assistant** - OpenAI GPT integration with fallback rule-based responses
- **Natural Language Processing** - Chrono-node for date parsing
- **Currency Conversion** - Real-time exchange rates
- **Price Alerts** - Automated price monitoring and notifications
- **User Authentication** - JWT-based auth with bcrypt password hashing
- **Database** - SQLite with comprehensive booking and user management

## 📦 Installation

1. **Clone and setup**
```bash
cd server
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
TRAVELPAYOUTS_TOKEN=your_travelpayouts_token
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OPENAI_API_KEY=sk-your_openai_key
JWT_SECRET=your_jwt_secret
EXCHANGERATE_API_KEY=your_exchangerate_key
```

3. **Initialize Database**
```bash
npm run init-db
```

4. **Start Server**
```bash
# Development
npm run dev

# Production
npm start
```

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PATCH /api/auth/profile` - Update user profile

### Flights
- `POST /api/flights/search` - Search flights (Travelpayouts API)
- `GET /api/flights/:id` - Get flight details
- `POST /api/flights/search/natural` - Natural language flight search

### Hotels
- `POST /api/hotels/search` - Generate hotel booking links
- `GET /api/hotels/recommendations/:city` - Get hotel recommendations

### Tours & Activities
- `POST /api/tours/search` - Generate tour booking links
- `GET /api/tours/popular/:city` - Get popular activities

### Airport Transfers
- `POST /api/transfers/search` - Generate transfer booking links
- `GET /api/transfers/estimates/:city` - Get transfer estimates

### Payments
- `POST /api/payments/initialize` - Initialize Paystack payment
- `GET /api/payments/verify/:reference` - Verify payment
- `POST /api/payments/webhook` - Paystack webhook handler

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/admin/all` - Admin: Get all bookings

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/recommendations/:city` - Get AI recommendations

### Currency
- `GET /api/currency/rates` - Get exchange rates
- `POST /api/currency/convert` - Convert currency
- `GET /api/currency/supported` - Get supported currencies

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  preferred_currency TEXT DEFAULT 'NGN',
  email_notifications BOOLEAN DEFAULT 1,
  sms_notifications BOOLEAN DEFAULT 0,
  price_alerts BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  flight_data TEXT NOT NULL,
  passenger_data TEXT NOT NULL,
  total_amount REAL NOT NULL,
  currency TEXT NOT NULL,
  payment_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  booking_status TEXT DEFAULT 'pending',
  confirmation_code TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Price Alerts Table
```sql
CREATE TABLE price_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  target_price REAL NOT NULL,
  currency TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  notifications_sent INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_checked DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔧 API Integration Details

### Travelpayouts (Aviasales)
```javascript
// Flight search with 3% markup
const response = await axios.get('https://api.travelpayouts.com/v1/prices/cheap', {
  params: { origin: 'LOS', destination: 'ACC', depart_date: '2025-07-10', currency: 'ngn' },
  headers: { 'X-Access-Token': process.env.TRAVELPAYOUTS_TOKEN }
});

// Apply 3% markup
const markedUpPrice = Math.round(originalPrice * 1.03);
```

### Paystack Integration
```javascript
// Initialize payment
const paystackData = {
  amount: amount * 100, // Convert to kobo
  email,
  currency: 'NGN',
  reference: `flyeasy_${uuidv4()}`,
  callback_url: `${process.env.FRONTEND_URL}/payment/callback`
};
```

### Natural Language Processing
```javascript
// Parse travel queries
const parsed = chrono.parseDate("next Friday");
const departure = moment(parsed).format('YYYY-MM-DD');

// Extract cities and preferences
const fromMatch = query.match(/from\s+([a-zA-Z\s]+?)(?:\s+to|\s+$)/);
const toMatch = query.match(/to\s+([a-zA-Z\s]+?)(?:\s+on|\s+$)/);
```

## 📧 Email Templates

The system includes professional HTML email templates for:
- **Booking Confirmations** - Detailed flight information and confirmation codes
- **Price Alerts** - Price drop notifications with savings calculations
- **Welcome Emails** - Onboarding for new users

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Express rate limiter for API protection
- **CORS Configuration** - Proper cross-origin request handling
- **Input Validation** - Comprehensive request validation
- **SQL Injection Protection** - Parameterized queries

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:
- API keys for external services
- Database configuration
- Email service credentials
- JWT secret for authentication

### Database Migration
```bash
npm run init-db
```

### Process Management
Use PM2 or similar for production process management:
```bash
pm2 start index.js --name flyeasy-api
```

## 📊 Monitoring & Logging

- **Email Logs** - All email sends are logged to database
- **Search History** - User search patterns tracked
- **Error Handling** - Comprehensive error logging
- **Health Check** - `/api/health` endpoint for monitoring

## 🔄 Development

### Adding New Features
1. Create route files in `/routes`
2. Add database schema updates in `/database/db.js`
3. Update API documentation
4. Add tests for new endpoints

### Testing
```bash
# Test API endpoints
curl -X POST http://localhost:3001/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{"from":"Lagos","to":"Abuja","departure":"2025-01-15"}'
```

## 📞 Support

For technical support or questions about the API:
- Check the logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure external API keys are valid and have sufficient credits
- Test database connectivity and permissions

---

**Flyeasy Backend** - Powering seamless travel experiences with robust APIs and intelligent features. ✈️