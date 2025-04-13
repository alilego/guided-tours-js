# Steps & Stories - Guided Tours Platform

A modern web application for creating, managing, and booking guided tours. Built with Next.js, Supabase, and NextAuth.js.

## Features

- **User Authentication**: Google Sign-In integration with NextAuth.js
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Tour Management**: Create, edit, and delete tours with detailed information
- **Booking System**: Users can book tours and manage their bookings
- **Responsive Design**: Mobile-friendly interface with a clean, modern UI
- **Social Media Integration**: Optimized for sharing on platforms like WhatsApp and Facebook

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Authentication**: NextAuth.js with Google provider
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Deployment**: Vercel with GitHub Actions
- **Styling**: Tailwind CSS with emerald color scheme

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google OAuth credentials
- Git
- A Supabase account
- A Vercel account

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DATABASE_URL=your_supabase_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### Installation

1. Clone the repository
```bash
   git clone https://github.com/alilego/guided-tours-js.git
   cd guided-tours-js
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your database connection string from Project Settings > Database
3. Update your `.env` file with the database connection string:
   ```
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?schema=public"
   ```
4. Initialize the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

Note: If you're on an IPv4 network, use the Session Pooler connection string from Supabase instead of the direct database connection.

### Deployment

This project uses GitHub Actions for continuous integration and deployment:

1. Every push to the `master` branch will:
   - Build the project
   - Run tests
   - Deploy to Vercel automatically

2. To enable automatic deployment:
   - Create a Vercel project
   - Get your Vercel credentials (token, org ID, project ID)
   - Add them as secrets in your GitHub repository:
     ```
     VERCEL_TOKEN
     VERCEL_ORG_ID
     VERCEL_PROJECT_ID
     ```
   - Add your Supabase credentials as secrets:
     ```
     DATABASE_URL
     SUPABASE_PROJECT_REF
     SUPABASE_DB_PASSWORD
     ```

## Project Structure

```
guided-tours-js/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   └── lib/              # Utility functions and database helpers
├── prisma/
│   └── schema.prisma     # Database schema
├── public/              # Static assets
└── .github/
    └── workflows/       # GitHub Actions workflows
```

## Development Guidelines

1. **Code Style**
   - Use TypeScript for type safety
   - Follow Next.js best practices
   - Use Tailwind CSS for styling
   - Use Next.js `Link` component for navigation

2. **Git Workflow**
   - Create feature branches from `master`
   - Use meaningful commit messages
   - Push changes to trigger automatic deployment

3. **Database Changes**
   - Update `schema.prisma` for database changes
   - Run `npx prisma generate` after schema changes
   - Test migrations locally before pushing

4. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` as a template
   - Add new variables to both local and Vercel environments
   - Store sensitive data in GitHub Secrets for deployment

## Key Features Implementation

### Authentication

- Google Sign-In integration with NextAuth.js
- Role-based access control (admin vs regular users)
- Protected routes for admin dashboard

### Tour Management

- CRUD operations for tours
- Image upload functionality
- Tour details including title, description, date, duration, price, and max participants

### Booking System

- Users can book available tours
- Booking management for users
- Booking overview for admins

### UI/UX

- Responsive design with Tailwind CSS
- Emerald color scheme for a fresh, modern look
- Intuitive navigation and user flows

### Social Media Sharing

- Open Graph meta tags for optimized sharing on social media
- Custom featured image for social media previews
- Environment-based configuration for development and production

## Deployment

The application is configured for deployment on Vercel with GitHub Actions:

1. Push changes to the main branch
2. GitHub Actions automatically builds and deploys to Vercel
3. Environment variables are securely managed in Vercel

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js team for the amazing framework
- Supabase for the backend infrastructure
- NextAuth.js for authentication
- Tailwind CSS for styling
