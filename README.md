# FlightGenie - Advanced AI-Powered Flight Booking Platform

A comprehensive, production-ready flight booking platform that combines real-time flight search, intelligent pricing, user management, and advanced analytics.

## 🚀 Features

### Core Features
- **Real-time Flight Search**: Integration-ready for Amadeus API with 3% markup logic
- **Smart Booking System**: Complete booking flow with payment integration
- **User Authentication**: Secure registration and login system
- **Multi-currency Support**: Dynamic currency conversion and display
- **Price Alerts**: Automated notifications for price drops
- **Receipt Generation**: Professional booking confirmations

### Advanced Features
- **User Dashboard**: Comprehensive flight management interface
- **Admin Analytics**: Real-time business intelligence and reporting
- **Responsive Design**: Mobile-first approach with seamless UX
- **Natural Language Processing**: AI-powered search capabilities
- **Scalable Architecture**: Built for high-traffic scenarios

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** for form handling
- **Recharts** for analytics visualization
- **Framer Motion** for animations

### Backend Integration Ready
- **Amadeus API** for flight data
- **Paystack** for payment processing
- **Email/SMS** notifications
- **Currency conversion** APIs

### Development Tools
- **Vite** for fast development
- **ESLint** for code quality
- **TypeScript** for type safety
- **Vitest** for testing

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/flightgenie.git
cd flightgenie
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Add your API keys:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_AMADEUS_API_KEY=your_amadeus_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
VITE_CURRENCY_API_KEY=your_currency_api_key
```

4. **Start development server**
```bash
npm run dev
```

## 🏗 Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # User dashboard
│   ├── features/        # Feature-specific components
│   └── admin/           # Admin components
├── store/               # Zustand stores
├── services/            # API services
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## 🔧 API Integration

### Flight Search (Amadeus)
```typescript
// Example flight search with 3% markup
const searchFlights = async (params: SearchParams) => {
  const response = await amadeus.shopping.flightOffersSearch.get(params);
  
  // Apply 3% markup
  const flights = response.data.map(flight => ({
    ...flight,
    price: Math.round(flight.originalPrice * 1.03)
  }));
  
  return flights;
};
```

### Payment Processing (Paystack)
```typescript
// Initialize payment
const initializePayment = async (amount: number, email: string) => {
  const response = await paystack.transaction.initialize({
    amount: amount * 100, // Convert to kobo
    email,
    callback_url: `${window.location.origin}/payment/callback`
  });
  
  return response.data.authorization_url;
};
```

## 📊 Analytics & Monitoring

The platform includes comprehensive analytics:

- **Revenue Tracking**: Real-time revenue monitoring
- **User Analytics**: User growth and engagement metrics
- **Route Performance**: Popular routes and booking patterns
- **Conversion Rates**: Booking funnel analysis

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive form validation
- **Rate Limiting**: API rate limiting protection
- **Data Encryption**: Sensitive data encryption
- **CORS Protection**: Cross-origin request security

## 🌍 Multi-currency Support

Supports major currencies with real-time conversion:
- Nigerian Naira (NGN)
- US Dollar (USD)
- Euro (EUR)
- British Pound (GBP)
- Canadian Dollar (CAD)
- Australian Dollar (AUD)

## 📱 Mobile Optimization

- **Responsive Design**: Works seamlessly on all devices
- **Touch Optimized**: Mobile-friendly interactions
- **Fast Loading**: Optimized for mobile networks
- **Progressive Web App**: PWA capabilities ready

## 🚀 Deployment

### Quick Deploy to GitHub + Netlify

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Deploy Frontend to Netlify**:
   - Connect your GitHub repo to Netlify
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Set environment variable: `VITE_API_URL=https://your-backend-url.com/api`

3. **Deploy Backend to Railway**:
   - Connect your GitHub repo to Railway
   - Set root directory to `server`
   - Add environment variables from `server/env.example`

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete instructions.

### Manual Deployment

#### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

#### Backend (Railway/Render/Heroku)
```bash
cd server
npm install
npm start
# Deploy with environment variables configured
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run linting
npm run lint
```

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading for optimal performance
- **Image Optimization**: Responsive images with lazy loading
- **Caching Strategy**: Intelligent caching for API responses
- **Bundle Optimization**: Minimized bundle sizes

## 🔄 CI/CD Pipeline

Ready for continuous integration:

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: vercel/action@v1
```

## 📞 Support & Documentation

- **API Documentation**: Comprehensive API docs
- **User Guide**: Step-by-step user instructions
- **Admin Manual**: Complete admin functionality guide
- **Developer Docs**: Technical implementation details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Real-time chat support
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Loyalty program integration
- [ ] Multi-language support
- [ ] Advanced reporting dashboard

---

**FlightGenie** - Making flight booking intelligent, simple, and delightful. ✈️# Fri Jul  4 16:36:01 WAT 2025
# Fri Jul  4 17:52:34 WAT 2025
