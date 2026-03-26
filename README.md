# Charity Platform

A Next.js-based charity subscription platform that combines golf scoring with charitable donations. Users can subscribe, enter their golf scores, and participate in charity draws while supporting featured charities.

## Features

- User authentication and profiles
- Golf score tracking
- Charity selection and donation allocation
- Subscription management with Stripe
- Random and algorithmic draw systems
- Admin dashboard for managing charities, draws, and winners
- Responsive design with modern UI

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe
- **Styling**: CSS Modules
- **Deployment**: Vercel

## Prerequisites

Before running this project locally, ensure you have:

- Node.js 18+ and npm
- A Supabase account and project
- A Stripe account (for payments)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/1priyayadav/Digital.git
cd charity-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-stripe-webhook-secret
STRIPE_PRICE_ID_MONTHLY=price_your-monthly-price-id
STRIPE_PRICE_ID_YEARLY=price_your-yearly-price-id

# Base Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Database Setup

This project uses Supabase for the database. You'll need to:

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Run the schema file: `supabase/schema.sql`
4. Run the seed file: `supabase/seed.sql`

Alternatively, you can use the Supabase CLI:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Link your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### 5. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the dashboard
3. Create products and prices for monthly/yearly subscriptions
4. Set up webhooks for payment events (point to `/api/webhooks/stripe`)

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
charity-platform/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── admin/          # Admin panel
│   │   └── ...
│   ├── components/         # Reusable components
│   └── lib/               # Utility functions and configs
├── supabase/              # Database schema and seed data
├── public/               # Static assets
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a pull request

## Deployment

This app is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add your environment variables in Vercel dashboard
3. Deploy!

## License

This project is private and proprietary.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
