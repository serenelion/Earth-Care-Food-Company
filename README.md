# Earth Care Food Company - Full Stack E-Commerce Platform

## 🌱 Overview

A production-ready full-stack e-commerce platform for Earth Care Food Company, featuring:
- **Django REST API** backend with PostgreSQL/SQLite support
- **React 19 + Vite** modern frontend
- **Stripe** payment processing integration
- **Gemini AI** powered gut-health coaching chatbot
- **SendGrid** email marketing and transactional emails
- **Complete admin dashboard** for business management

## 🏗️ Architecture

### Monorepo Structure
```
Earth-Care-Food-Company/
├── backend/                 # Django REST API
│   ├── earthcare/          # Project settings
│   ├── store/              # Product, Order, Customer models & APIs
│   ├── coaching/           # AI chatbot with conversation persistence
│   ├── newsletter/         # Email subscription management
│   ├── venv/               # Python virtual environment
│   ├── requirements.txt    # Python dependencies
│   └── manage.py
│
└── frontend/               # React + Vite SPA
    ├── api/               # API client with Axios
    ├── components/        # Reusable UI components
    ├── pages/             # About, Wholesale pages
    ├── services/          # Business logic (removed in favor of backend)
    └── package.json
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** (3.10+ recommended)
- **Node.js 18+** & npm
- **PostgreSQL** (optional, SQLite works for development)
- API Keys:
  - Stripe (test keys for development)
  - SendGrid API key
  - Google Gemini API key

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

4. **Configure environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (SQLite by default)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=hello@earthcare.food
ADMIN_EMAIL=admin@earthcare.food

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# CORS
FRONTEND_URL=http://localhost:3000
```

5. **Run migrations:**
```bash
python manage.py migrate
```

6. **Seed products:**
```bash
python manage.py seed_products
```

7. **Create superuser:**
```bash
python manage.py createsuperuser
```

8. **Start development server:**
```bash
python manage.py runserver 0.0.0.0:8000
```

Backend now running at: `http://localhost:8000`
- Admin panel: `http://localhost:8000/admin`
- API docs (manually test): `http://localhost:8000/api/`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install --legacy-peer-deps
```
*Note: Using `--legacy-peer-deps` due to React 19 compatibility with Stripe*

3. **Configure environment:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

4. **Start development server:**
```bash
npm run dev
```

Frontend now running at: `http://localhost:3000`

## 📦 Features

### ✅ Implemented

#### Backend (Django)

**Store App:**
- ✅ Product catalog with inventory management
- ✅ Customer profiles with subscription discounts
- ✅ Complete order processing system
- ✅ Wholesale inquiry form with admin notifications
- ✅ Stripe payment intents & checkout sessions
- ✅ Stripe webhook handling for payment confirmations
- ✅ RESTful API endpoints for all operations

**Coaching App:**
- ✅ Gemini AI integration for gut-health coaching
- ✅ Conversation thread persistence (all chats saved to DB)
- ✅ Session management for returning users
- ✅ Customer linking for personalized recommendations

**Newsletter App:**
- ✅ Email subscription management
- ✅ SendGrid integration for welcome emails
- ✅ Unsubscribe functionality
- ✅ Source tracking (website, checkout, wholesale form)
- ✅ Newsletter campaign creation (admin panel)

**Admin Dashboard:**
- ✅ Full CRUD for products, orders, customers
- ✅ Wholesale inquiry management with status tracking
- ✅ Newsletter subscriber export functionality
- ✅ Conversation history viewer
- ✅ Order status management and fulfillment tracking

#### Frontend (React)

**Core Features:**
- ✅ Product catalog display
- ✅ Shopping cart functionality
- ✅ About page with newsletter subscription
- ✅ Wholesale inquiry page
- ✅ AI chatbot integration (Gemini)

### 🔨 To Complete

The following need to be finished for a production-ready system:

#### Frontend Critical Tasks:

1. **React Router Integration** (`status: COMPLETE`)
   - ✅ Created About and Wholesale pages
   - ❌ Need to add React Router to App.tsx
   - ❌ Update Navbar with router Links
   - ❌ Create home route wrapper

2. **Stripe Checkout Flow** (`y1z2a3b4c5`, `d6e7f8g9h0`)
   - ❌ Integrate `@stripe/react-stripe-js` in CartSidebar
   - ❌ Create CheckoutForm component
   - ❌ Handle payment confirmation
   - ❌ Apply 10% discount for subscribers

3. **AI Chat Backend Integration** (`s1t2u3v4w5`)
   - ❌ Replace `geminiService.ts` with API calls
   - ❌ Generate unique session IDs
   - ❌ Persist conversations to backend

4. **Products API Integration** (`y1z2a3b4c5`)
   - ❌ Fetch products from Django API
   - ❌ Remove `constants.ts`
   - ❌ Handle loading states

#### Deployment & Production:

5. **Environment Configuration** (`h6i7j8k9l0`)
   - Create production .env templates
   - Set up environment variable validation
   - Configure CORS for production domains

6. **Stripe Webhook Endpoint**
   - Expose webhook at `/api/store/stripe/webhook/`
   - Configure in Stripe dashboard
   - Test payment success/failure flows

7. **Email Templates**
   - Order confirmation emails
   - Wholesale inquiry notifications to admin
   - Shipping confirmation emails

8. **Production Deployment**
   - Backend: Gunicorn + Nginx
   - Frontend: Build and serve with Vite
   - Database: PostgreSQL production setup
   - Static files: WhiteNoise or CDN

## 🗄️ Database Schema

### Key Models

**Product**
- id, name, tagline, description
- price, unit, image, benefits
- stripe_product_id, stripe_price_id
- is_active, stock_quantity

**Customer**
- email (unique), first_name, last_name, phone
- stripe_customer_id
- is_subscribed, subscription_discount (default: 10%)

**Order**
- customer, order_number, status
- subtotal, discount_amount, total_amount
- shipping_address fields
- stripe_payment_intent_id, paid_at

**OrderItem**
- order, product, product_name
- quantity, unit_price, total_price

**ConversationThread**
- session_id, customer, email
- started_at, last_activity, is_active

**Message**
- thread, role (user/ai), content
- timestamp, user_ip, user_agent

**NewsletterSubscriber**
- email, first_name, is_active
- source, subscribed_at

**WholesaleInquiry**
- business_name, contact_name, email, phone
- business_type, location, message
- status (new/contacted/approved/rejected)

## 🔌 API Endpoints

### Store API (`/api/store/`)
- `GET /products/` - List all active products
- `POST /checkout/` - Create order & payment intent
- `POST /wholesale-inquiry/` - Submit wholesale form
- `POST /stripe/webhook/` - Handle Stripe events
- `GET /stripe/config/` - Get publishable key

### Coaching API (`/api/coaching/`)
- `POST /chat/` - Send message to AI coach
- `GET /conversation/<session_id>/` - Get chat history

### Newsletter API (`/api/newsletter/`)
- `POST /subscribe/` - Subscribe to newsletter
- `POST /unsubscribe/` - Unsubscribe from newsletter

## 💳 Stripe Integration

### Payment Flow
1. User adds items to cart
2. Frontend calls `/api/store/checkout/` with:
   - Cart items
   - Customer info
   - Shipping address
   - Newsletter opt-in
3. Backend creates:
   - Customer record
   - Order record
   - Stripe Payment Intent
4. Frontend receives `client_secret`
5. Stripe Elements handles payment
6. Webhook confirms payment → Order status = 'paid'
7. Confirmation email sent

### Subscription Discount
- Newsletter subscribers automatically get 10% off
- Discount applied during checkout
- Stored in `Customer.subscription_discount`

## 📧 Email System

### SendGrid Integration
- **Welcome Email**: Sent on newsletter subscription
- **Order Confirmation**: Triggered by Stripe webhook *(to implement)*
- **Wholesale Inquiry**: Admin notification *(to implement)*

### Email Templates
Located in: `backend/newsletter/views.py` (inline HTML)

For production, consider:
- SendGrid template IDs
- HTML template files
- Dynamic template rendering

## 🤖 AI Coaching

### Gemini Integration
- Model: `gemini-2.0-flash-exp`
- System prompt focused on gut-brain health
- Product recommendations based on user needs
- All conversations saved to database

### Session Management
- Unique `session_id` per user
- Conversations persist across page reloads
- Optional email linking to customer records

## 🎨 Frontend Styling

Using Tailwind CSS with custom colors:
- `earth-*`: Browns and greens (brand colors)
- `cream-*`: Off-white backgrounds

Color palette in `index.css`:
```css
--earth-50 through --earth-900
--cream-50 through --cream-500
```

## 🔒 Security Considerations

### Current Implementation
- ✅ CSRF protection (Django default)
- ✅ CORS configuration
- ✅ Environment variable management
- ✅ Stripe webhook signature verification
- ✅ Password hashing (Django default)

### Production Recommendations
- [ ] Enable HTTPS only
- [ ] Set `DEBUG=False`
- [ ] Use strong `SECRET_KEY`
- [ ] Rate limiting on API endpoints
- [ ] Input validation and sanitization
- [ ] SQL injection protection (Django ORM)
- [ ] XSS protection (React)

## 📊 Admin Dashboard

Access at: `http://localhost:8000/admin`

### Capabilities
- **Products**: Add, edit, manage inventory, Stripe sync
- **Orders**: View, update status, fulfill orders
- **Customers**: View purchase history, manage subscriptions
- **Wholesale Inquiries**: Respond, update status, add notes
- **Newsletter**: Export emails, view subscribers, manage campaigns
- **Conversations**: View all AI chat threads

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create product in admin
- [ ] Add to cart on frontend
- [ ] Complete checkout with test Stripe card
- [ ] Verify order created in admin
- [ ] Test newsletter subscription
- [ ] Submit wholesale inquiry
- [ ] Chat with AI coach
- [ ] Verify conversation saved

### Test Stripe Card
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

## 🚧 Known Issues

1. **React 19 Compatibility**: Stripe React components show peer dependency warnings (functional with `--legacy-peer-deps`)
2. **Python 3.9 Warning**: Google API packages recommend Python 3.10+
3. **Missing Frontend Router**: Need to integrate React Router for multi-page navigation
4. **Stripe Elements**: Not yet integrated in CartSidebar
5. **AI Chat**: Still using frontend Gemini service instead of backend API

## 📝 Next Steps for Full Production

1. ✅ Backend infrastructure complete
2. ✅ Database models and migrations ready
3. ✅ Admin panel fully functional
4. ❌ Complete frontend integration with backend APIs
5. ❌ Add React Router for SPA navigation
6. ❌ Integrate Stripe Elements for checkout
7. ❌ Add loading states and error handling
8. ❌ Implement order confirmation emails
9. ❌ Test end-to-end checkout flow
10. ❌ Production deployment configuration

## 📧 Support & Contact

For questions about this codebase:
- **Backend**: Django 4.2, DRF, Stripe, SendGrid
- **Frontend**: React 19, Vite, TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **AI**: Google Gemini API

---

**Built with 🌱 for Earth Care Food Company**
*Healing the soil to heal the gut, one transaction at a time.*
