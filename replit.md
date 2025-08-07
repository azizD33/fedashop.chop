# Overview

This is a full-stack e-commerce application for natural and organic products called "فيدا شوب" (Vida Shop) in Arabic. The application features a modern React frontend with a Node.js/Express backend, built for selling skincare products, herbal remedies, organic foods, and essential oils. The entire UI is designed with right-to-left (RTL) text direction to properly support Arabic content.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with **React 18** using **TypeScript** and **Vite** as the build tool. The UI framework is **shadcn/ui** with **Tailwind CSS** for styling, configured for RTL support. Client-side routing is handled by **wouter** (a lightweight React router), and state management uses **React Context API** for cart functionality combined with **TanStack Query** for server state management.

Key frontend architectural decisions:
- **Component-based architecture**: Modular UI components following shadcn/ui patterns
- **Context providers**: Cart state managed globally through React Context
- **Query client pattern**: Centralized API calls with caching and error handling
- **Mobile-first responsive design**: Adaptive layouts with mobile breakpoints

## Backend Architecture
The backend uses **Express.js** with **TypeScript** for type safety. It follows a simple REST API pattern with separate concerns for routing, storage, and server setup. The current implementation uses **in-memory storage** for development, but is structured to easily swap to database persistence.

Key backend architectural decisions:
- **Layered architecture**: Clear separation between routes, storage interface, and business logic
- **Interface-based storage**: `IStorage` interface allows easy switching between storage implementations
- **Express middleware pattern**: Request logging, error handling, and JSON parsing
- **Development-focused setup**: Vite integration for hot reloading in development

## Database Design
The application uses **Drizzle ORM** with **PostgreSQL** dialect, though currently running with in-memory storage. The schema defines two main entities:

**Products table**: Core product information including pricing, inventory, ratings, and categorization
**Orders table**: Customer orders with embedded JSON for order items, supporting the checkout flow

The database is configured for **Neon Database** (serverless PostgreSQL) but can work with any PostgreSQL-compatible database.

## Authentication & Authorization
Currently, the application does not implement user authentication. The cart functionality is client-side only, and orders are created without user accounts. This appears to be a simplified e-commerce flow suitable for guest checkout scenarios.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting (configured but not actively used)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

## UI Framework
- **Radix UI**: Headless UI components for accessibility and behavior
- **shadcn/ui**: Pre-built component library built on top of Radix UI
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

## Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Static type checking across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

## Utility Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API responses
- **date-fns**: Date manipulation utilities

## Deployment Platform
- **Replit**: Configured for Replit deployment with specific plugins and development banner integration