# Lemonistas - Know Your Lemons Bahamas

A dynamic, user-centric platform for the Lemonistas team that delivers an immersive showcase of educator profiles through cutting-edge interactive design and innovative user experience technologies.

## Project Overview

This platform serves the "Know Your Lemons" breast health awareness initiative in the Bahamas, achieving high performance standards, mobile-readiness, and SEO optimization. The platform features team member management, applicant processing, and social interaction capabilities.

## Features

- **Team Member Profiles**: Display detailed information about team members with their photos and focus areas
- **Join Applications**: Allow visitors to apply to join the Lemonistas team
- **Selfie Uploads**: Enable visitors to upload selfies with team members
- **Admin Dashboard**: Secure admin interface to manage team members and applications
- **Authentication System**: Protected routes and session management for admin access

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Routing**: Wouter for simple client-side routing
- **Data Management**: React Query for efficient data fetching and caching
- **Animations**: Framer Motion for smooth UI transitions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database interactions
- **Backend**: Express.js server with secure API endpoints
- **Authentication**: Session-based authentication with express-session

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Database migrations:
   ```
   npm run db:push
   ```

## Admin Access

Access the admin dashboard at `/admin` with the following credentials:
- Username: admin
- Password: watsonfpo

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express API
- `/shared`: Shared types and schemas
- `/assets`: Static assets like images

## License

© 2025 Lemonistas - Know Your Lemons Bahamas
