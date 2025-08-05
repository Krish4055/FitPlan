# Overview

FitPlan is a full-stack fitness and nutrition tracking application built with modern web technologies. The app serves as a comprehensive fitness planner that helps users track workouts, log food intake, monitor progress, and achieve their health goals. It features a sleek dark theme with gradient designs and comprehensive user management capabilities.

**Status**: ✅ DEPLOYMENT-READY - Complete backend integration with PostgreSQL database, session-based authentication, and full CRUD operations for users, workouts, and food logs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible UI
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for end-to-end type safety
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Storage Pattern**: Repository pattern with in-memory storage implementation (MemStorage) and interface for easy database integration
- **API Structure**: RESTful endpoints for users, workouts, and food logs with proper HTTP status codes and error handling

## Data Storage Solutions
- **Database**: PostgreSQL configured via Drizzle with connection pooling using Neon serverless adapter
- **Schema Management**: Drizzle migrations with schema definitions in shared directory
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Data Models**: Three main entities - users, workouts, and food logs with proper foreign key relationships

## Authentication and Authorization
- **Session Management**: Express sessions with secure HTTP-only cookies and PostgreSQL backing store
- **User Registration/Login**: Complete authentication system with password hashing using bcryptjs
- **Protected Routes**: All API endpoints protected with authentication middleware
- **Data Access**: User-scoped data access patterns ensuring users can only access their own data
- **Security**: Input validation using Zod schemas, CSRF protection, and proper error handling
- **Frontend Integration**: Seamless authentication flow with login/register forms and automatic session management

## External Dependencies
- **Database Hosting**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI ecosystem for accessible component primitives
- **Icons**: Lucide React for consistent iconography
- **Development**: Replit-specific plugins for development environment integration
- **Styling**: PostCSS with Autoprefixer for CSS processing
- **Image Assets**: Unsplash for fitness-related background imagery

The application follows a monorepo structure with shared TypeScript definitions, enabling type safety across the full stack. The architecture supports easy scaling and maintenance with clear separation of concerns between frontend presentation, backend business logic, and data persistence layers.

## Recent Changes (August 4, 2025)
- ✅ Complete backend integration with PostgreSQL database using Drizzle ORM
- ✅ Session-based authentication system with secure password hashing
- ✅ Protected API endpoints for users, workouts, and food logs
- ✅ Frontend authentication flow with login/register forms
- ✅ User-scoped data access ensuring data privacy and security
- ✅ Database schema pushed and fully operational
- ✅ **Editable weight tracking system with interactive chart**
- ✅ Weight progress visualization using Recharts library
- ✅ Add/edit weight entries with notes functionality
- ✅ Real-time chart updates reflecting user weight changes
- ✅ **Guest sign-in option for exploring without account creation**
- ✅ Guest users get temporary accounts with full app access
- ✅ End-to-end testing confirms all systems working correctly

**Deployment Status**: The application is now fully ready for deployment with complete backend functionality, database integration, user authentication system, guest access option, and interactive weight tracking with progress visualization.