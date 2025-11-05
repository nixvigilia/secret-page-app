# Secret Page App

A secure web application with authentication, secret messaging, and friend management features. Users can create accounts, set secret messages, add friends, and view each other's secret messages.

## Features

- 🔐 **Authentication System**
  - User registration with strong password validation
  - Password strength indicator
  - Login/Logout functionality
  - Account deletion

- 📝 **Secret Messages**
  - View your secret message (Secret Page 1)
  - Add/Edit your secret message (Secret Page 2)
  - Password visibility toggle

- 👥 **Friend System** (Secret Page 3)
  - Browse all users
  - Send friend requests
  - Accept friend requests
  - View friends' secret messages
  - 401 unauthorized protection for non-friends

## Tech Stack

### Frontend

- **Next.js 16.0.1** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library built on Radix UI
  - Alert Dialog
  - Button
  - Card
  - Input
  - Label
  - Textarea
  - Sonner (Toast notifications)

### Backend

- **Next.js Server Actions** - Server-side actions
- **Supabase** - Authentication and database
  - Supabase Auth for user management
  - PostgreSQL database
  - Row Level Security (RLS)

### Database & ORM

- **Prisma 6.18.0** - Type-safe ORM
- **PostgreSQL** - Relational database
- Database triggers for automatic profile creation and user deletion

### UI/UX Libraries

- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Class Variance Authority** - Component variants
- **clsx** & **tailwind-merge** - Conditional styling utilities

### Validation

- **Zod 4.1.12** - Schema validation

### Development Tools

- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **dotenv** - Environment variable management

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- PostgreSQL database (via Supabase)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd secret-page-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Connection (for Prisma)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Get these values from:

- Supabase API settings: https://supabase.com/dashboard/project/_/settings/api
- Database settings: https://supabase.com/dashboard/project/_/settings/database

4. Set up the database:
   - Run the SQL script in `prisma/setup-triggers.sql` in your Supabase SQL Editor
   - This creates triggers for automatic profile creation and user deletion

5. Generate Prisma Client:

```bash
npm run db:generate
```

6. Push the schema to the database:

```bash
npm run db:push
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
secret-page-app/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── error/          # Error page
│   ├── actions/
│   │   ├── auth.ts         # Authentication actions
│   │   ├── friends.ts      # Friend management actions
│   │   └── secret.ts       # Secret message actions
│   ├── api/
│   │   └── friends/        # API routes for friend messages
│   ├── secret-page-1/      # View secret message
│   ├── secret-page-2/      # Edit secret message
│   ├── secret-page-3/      # Friend system
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── add-friend-form.tsx
│   ├── back-button.tsx
│   ├── delete-account-button.tsx
│   ├── friends-list.tsx
│   ├── logout-button.tsx
│   ├── password-input.tsx
│   ├── pending-requests.tsx
│   ├── secret-message-form.tsx
│   └── users-list.tsx
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── setup-triggers.sql  # Database triggers
└── utils/
    └── supabase/           # Supabase client utilities
```

## Database Schema

### Profile

- User profile information
- Links to auth.users via UUID
- Stores secret messages

### Friendship

- Friend relationships
- Status: pending, accepted, rejected
- Bidirectional relationships

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations

## Features Breakdown

### Secret Page 1

- View your secret message
- Sign out
- Delete account

### Secret Page 2

- All features from Secret Page 1
- Add/Edit secret message
- Real-time validation

### Secret Page 3

- All features from Secret Page 1 & 2
- Browse all users
- Send friend requests
- Accept friend requests
- View friends' secret messages
- 401 protection for unauthorized access

## Security

- Password strength validation
- Server-side authentication checks
- Protected API routes
- Row-level security with Supabase
- Prisma query validation

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## License

This project is private.
