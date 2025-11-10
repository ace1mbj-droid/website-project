# Ace#1 Backend API

Backend API for Ace#1 Health & Wellness e-commerce platform.

## Prerequisites

- Node.js 18+ 
- MySQL 8.0 or PostgreSQL 14+
- Redis 7.0+
- npm or yarn

## Installation

### 1. Install Node.js

**macOS (using Homebrew):**
```bash
brew install node@18
```

**Or download from:** https://nodejs.org/

### 2. Install MySQL

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

### 3. Install Redis

**macOS (using Homebrew):**
```bash
brew install redis
brew services start redis
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your configuration:
- Database credentials
- JWT secrets
- Paytm credentials
- SMTP settings

## Database Setup

### Quick Setup (Recommended)

```bash
# Run automated setup script
npm run db:setup

# Test connection
npm run db:test
```

### Manual Setup

See [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md) for detailed instructions.

### Run Migrations

After database is set up:
```bash
npm run migrate:up
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Server will run on: http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `GET /api/admin/orders` - Get all orders (admin)

### Payment
- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/callback` - Payment callback
- `GET /api/payment/status/:id` - Check payment status

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── app.js           # Express app setup
├── migrations/          # Database migrations
├── tests/               # Test files
├── .env.example         # Environment variables template
├── .eslintrc.json       # ESLint configuration
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Environment Variables

See `.env.example` for all available configuration options.

## Security

- All passwords are hashed with bcrypt (12 salt rounds)
- JWT tokens for authentication
- Rate limiting on all endpoints
- Input validation with Joi
- SQL injection prevention with parameterized queries
- XSS protection with helmet
- CORS configured for frontend domain

## License

MIT
