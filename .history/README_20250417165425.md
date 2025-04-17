# TradeStorm - AI-Powered Trading Signals App

TradeStorm is a next-generation AI-powered mobile trading signals application that provides real-time market analysis, trading signals, and copy trading capabilities.

## Features

- Real-time trading signals powered by AI
- Market analysis and filtering by asset class
- Copy trading functionality
- User authentication and profile management
- Push notifications for alerts
- Subscription management with Stripe

## Tech Stack

### Frontend
- React Native (Expo)
- TypeScript
- React Navigation
- React Native Paper
- Axios
- React Native Chart Kit
- Expo Notifications

### Backend
- FastAPI (Python)
- Supabase
- Stripe API
- JWT Authentication
- Python Binance API
- CCXT Library

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- Expo CLI
- Supabase account
- Stripe account
- Binance API credentials (optional)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/tradestorm.git
   cd tradestorm
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Fill in the required environment variables

## Development

### Frontend Development

1. Start the Expo development server:
   ```bash
   cd frontend
   npm start
   ```

2. Run on iOS simulator:
   ```bash
   npm run ios
   ```

3. Run on Android emulator:
   ```bash
   npm run android
   ```

### Backend Development

1. Start the FastAPI server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Access the API documentation:
   - Open http://localhost:8000/docs in your browser

## Deployment

### Frontend Deployment

1. Build the Expo app:
   ```bash
   cd frontend
   expo build:android  # For Android
   expo build:ios      # For iOS
   ```

2. Submit to app stores:
   - Follow Expo's deployment guide for Android and iOS

### Backend Deployment

1. Deploy to AWS:
   - Set up an EC2 instance
   - Configure Nginx as a reverse proxy
   - Set up SSL with Let's Encrypt
   - Deploy using Docker or directly

## Environment Variables

### Frontend (.env)
```
API_URL=http://localhost:8000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Backend (.env)
```
DATABASE_URL=your_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@tradestorm.com or join our Slack channel. 