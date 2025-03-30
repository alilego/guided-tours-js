This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

This project uses environment variables for configuration. To set up your environment:

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your actual values
3. Never commit the `.env` file to version control

### For Developers Cloning This Repository

If you're cloning this repository to use it yourself:

1. Create your own Supabase project at [https://supabase.com](https://supabase.com)
2. Get your own database credentials from your Supabase project
3. Create a `.env` file with your own credentials
4. If you want to use GitHub Actions:
   - Go to your repository's Settings → Secrets and variables → Actions
   - Add your own secrets with the same names as in the workflow file
   - Your secrets will be secure and only accessible to you

## Database Setup

This project uses Prisma with Supabase PostgreSQL database. To set up the database:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Get your database connection string from Project Settings > Database
3. Update your `.env` file with the database connection string:
   ```
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?schema=public"
   ```
4. Run the following commands to set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

Note: If you're on an IPv4 network, use the Session Pooler connection string from Supabase instead of the direct database connection.

## Deployment

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
