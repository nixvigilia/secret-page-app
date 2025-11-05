# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Connection (for Prisma)
# Get this from: https://supabase.com/dashboard/project/_/settings/database
# Use the "Connection string" -> "URI" option
# Replace [YOUR-PASSWORD] with your database password
# Replace [YOUR-PROJECT-REF] with your project reference

DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## Getting Your Database Connection String

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string**
4. Select **URI** from the dropdown
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password
7. Add it to your `.env.local` file as `DATABASE_URL` and `DIRECT_URL`

## Database Setup

1. Run the SQL script in `prisma/setup-triggers.sql` in your Supabase SQL Editor
2. This will create the necessary triggers for profile creation and user deletion

## Generate Prisma Client

After setting up your environment variables, run:

```bash
npm run db:generate
```

Or:

```bash
npx prisma generate
```

## Push Schema to Database

```bash
npm run db:push
```

Or:

```bash
npx prisma db push
```


