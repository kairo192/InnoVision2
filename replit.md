# Overview

InnoVision School is a multi-language (French, Arabic, English) landing page and enrollment web application for a technology institute in Blida, Algeria. The application features a glassmorphism design with micro-interactions, allowing prospective students to browse courses and submit enrollment applications. It includes an admin dashboard for managing applications and viewing analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with **React 18** and **TypeScript**, using **Vite** as the build tool and development server. The application follows a component-based architecture with:

- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom glassmorphism effects and CSS variables for theming
- **Form Handling**: React Hook Form with Zod schema validation
- **Internationalization**: Custom i18n hook supporting French (default), Arabic (RTL), and English

## Backend Architecture
The server-side uses **Express.js** with **TypeScript** and follows a RESTful API design:

- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with configurable security settings
- **API Structure**: Modular route handlers with centralized storage layer
- **File Generation**: PDF generation using PDFKit with QR code integration
- **Email Service**: Nodemailer for sending enrollment confirmations

## Data Storage
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **Schema Management**: Drizzle migrations with shared schema definitions
- **Data Models**: Users (admin accounts) and Applicants (enrollment submissions)
- **Storage Pattern**: Repository pattern with abstracted storage interface

## Authentication & Authorization
- **Admin Authentication**: Email/password-based login with bcrypt password hashing
- **Session Security**: HTTP-only cookies with configurable secure flags
- **Role-based Access**: Admin role verification for protected dashboard routes

## Design System
- **Theme**: Custom brand colors (Deep Blue #0F4C81, Light Blue #35A7FF, Accent Yellow #FFC93C)
- **Visual Effects**: Glassmorphism cards with backdrop-blur, subtle animations, and hover effects
- **Typography**: Inter font for Latin scripts, Cairo font for Arabic text
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

# External Dependencies

## Database & Hosting
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit**: Development and deployment platform with integrated tooling

## UI & Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Consistent icon library for interface elements

## Form & Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: TypeScript-first schema validation for form data and API contracts
- **Hookform Resolvers**: Integration layer between React Hook Form and Zod

## PDF & Email Services
- **PDFKit**: Server-side PDF generation for enrollment confirmations
- **QRCode**: QR code generation for application tracking
- **Nodemailer**: Email service for automated enrollment notifications

## Development Tools
- **TypeScript**: Static type checking across client, server, and shared code
- **Vite Plugins**: Runtime error overlay and development tooling for Replit
- **ESBuild**: Fast bundling for production server builds