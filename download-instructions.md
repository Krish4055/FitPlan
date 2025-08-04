# FitPlan Complete Source Code

## Download Instructions

The complete FitPlan application source code is available in the file: `fitplan-source-code.tar.gz`

## What's Included

- **Frontend**: Complete React application with TypeScript
  - Dark theme UI components
  - Authentication pages (login/register)
  - Dashboard with weight tracking chart
  - Workout and food logging pages
  - Settings page

- **Backend**: Node.js/Express server with TypeScript
  - Session-based authentication
  - PostgreSQL database integration
  - Protected API endpoints
  - User data scoping for privacy

- **Database**: PostgreSQL schema with Drizzle ORM
  - Users table with authentication
  - Workouts table for exercise tracking
  - Food logs table for nutrition tracking
  - Weight entries table for progress tracking

- **Features**:
  - User registration and login
  - Workout logging with exercise details
  - Food logging with nutritional information
  - Interactive weight progress chart using Recharts
  - Real-time data updates
  - Responsive design with dark theme

## Setup Instructions

1. Extract the archive
2. Install dependencies: `npm install`
3. Set up PostgreSQL database
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

## File Size
Compressed: ~50KB (source code only, no node_modules)