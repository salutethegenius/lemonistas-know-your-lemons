# Architecture Documentation

## Overview

This application is a full-stack web platform for the "Know Your Lemons" breast health awareness initiative in the Bahamas. It features:

- A team member directory showcasing educators
- An applicant system for new team members
- An admin dashboard for managing applicants and team members
- A selfie sharing capability for team interactions

The architecture follows a modern client-server model with a React frontend and Express.js backend, using PostgreSQL for data persistence.

## System Architecture

The system uses a clear separation between client and server:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │──────│    Backend   │──────│   Database   │
│    (React)   │      │  (Express.js)│      │ (PostgreSQL) │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Key Architectural Decisions

1. **Full-Stack TypeScript**: Both frontend and backend use TypeScript, providing type safety across the entire application and enabling shared types between client and server through the `shared` directory.

2. **Client-Server Architecture**: Clear separation between client and server with a JSON-based REST API as the communication layer.

3. **ORM-Based Data Access**: Uses Drizzle ORM for database interactions, providing type safety and simplified query building.

4. **Component-Based UI**: Utilizes shadcn/ui (built on Radix UI) for consistent, accessible UI components.

## Key Components

### Frontend 

- **Framework**: React with TypeScript
- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query for server state management
- **UI Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS for utility-first styling approach

### Backend

- **Framework**: Express.js with TypeScript
- **API**: RESTful endpoints for CRUD operations on team members, applicants, and selfies
- **Middleware**: JSON body parsing with extended size limits for image uploads

### Database

- **Type**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM for type-safe database access
- **Schema**:
  - `users`: For authentication
  - `team_members`: Stores information about team educators
  - `applicants`: Manages people applying to join the team
  - `selfies`: Stores shared selfie images

### Shared Code

- **Schema Definitions**: Drizzle schema and Zod validators in `shared/schema.ts` 
- **Type Definitions**: Shared TypeScript interfaces between client and server

## Data Flow

### Team Member Display Flow

1. Client requests team members via React Query
2. Server receives request at `/api/team-members` endpoint
3. Server retrieves team members from the database via Drizzle ORM
4. Server responds with JSON data
5. Client renders team members with their details and images

### Application Submission Flow

1. User completes application form on frontend
2. Form is validated using Zod schema
3. Data is sent to server at `/api/applicants` endpoint
4. Server validates data again and stores in the database
5. Success confirmation is displayed to the user

### Admin Review Flow

1. Admin accesses the dashboard at `/admin`
2. Frontend requests pending applications
3. Server retrieves and returns applications
4. Admin can approve/reject applications
5. Status updates are sent to the server and stored in the database

## External Dependencies

### Frontend Dependencies

- **@radix-ui/\***: UI primitive components
- **@tanstack/react-query**: Data fetching and cache management
- **wouter**: Lightweight routing
- **tailwindcss**: Utility-first CSS framework
- **@hookform/resolvers**: Form validation with Zod
- **canvas-confetti**: Visual effects for success states

### Backend Dependencies

- **drizzle-orm**: TypeScript ORM for database access
- **@neondatabase/serverless**: Connection to Neon PostgreSQL database
- **express**: Web server framework
- **zod**: Schema validation

## Deployment Strategy

The application is configured for deployment on Replit:

- **Development**: Uses `tsx` to run the server in development mode
- **Build Process**: 
  1. Vite builds the frontend into static assets
  2. esbuild bundles the server code
- **Production**: Serves built assets from the `dist` directory
- **Database**: Uses Neon's serverless PostgreSQL offering via environment variables
- **Environment Variables**:
  - `DATABASE_URL`: Connection string for the PostgreSQL database
  - `NODE_ENV`: Used to determine runtime environment

The deployment configuration includes:

- Port mapping for HTTP traffic (port 5000 internally mapped to 80 externally)
- Automatic restart on file changes during development
- PostgreSQL available via Replit's nix configuration

## Security Considerations

- Password storage in the database (not hashed in the current implementation, which should be addressed)
- Image upload validation to prevent malicious content
- No explicit CORS configuration, relying on default same-origin policy
- Session-based authentication (partially implemented)

## Future Architectural Considerations

- Implement proper password hashing with bcrypt
- Add comprehensive authentication middleware
- Consider moving image storage to a dedicated service (S3, etc.)
- Implement caching strategies for improved performance
- Add comprehensive error handling and logging