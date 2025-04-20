# Developer Guide

## Getting Started

1. Clone the repository:
   `git clone https://github.com/salutethegenius/lemonistas-know-your-lemons.git`

2. Install dependencies:
   `npm install`

3. Set up the database:
   `npm run db:push`

3. Start the development server:
   `npm run dev`

## Key Files

- `server/auth.ts`: Authentication logic and middleware
- `server/routes.ts`: API endpoints
- `client/src/context/AuthContext.tsx`: Client-side auth management
- `client/src/pages/AdminDashboard.tsx`: Admin interface
- `shared/schema.ts`: Database schemas and types

## Authentication

The application uses an express-session based authentication system with memorystore for session storage.

Admin credentials:
- Username: `admin`
- Password: `watsonfpo`

## Database Schema

The database schema includes:
- Users: Admin users
- Team Members: Lemonistas team members
- Applicants: Potential team members
- Selfies: User selfies with team members

## Deployment

The application is designed to be deployed on Replit with the following considerations:
- Automatic PostgreSQL database provisioning
- No additional environment variables needed

## Troubleshooting

1. If the server doesn't start:
   `npm run dev:reset`

2. If the database connection fails:
   `npm run db:push`

3. To reset the database (CAUTION - destructive):
   `npm run db:reset`

---

*Developed for the "Know Your Lemons" initiative in the Bahamas*