# Guided Tours Platform

A Next.js-based platform for discovering and booking guided tours. Built with modern web technologies and best practices.

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn
- Git
- A Supabase account
- A Vercel account

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/alilego/guided-tours-js.git
   cd guided-tours-js
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your own values.

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

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
│   └── components/       # React components
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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
