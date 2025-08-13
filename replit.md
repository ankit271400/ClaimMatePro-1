# Overview

ClaimMate is a comprehensive insurance policy analysis and claim management platform designed to help users understand their insurance policies through AI-powered analysis and manage claims efficiently. The application provides OCR text extraction from policy documents, natural language processing for risk assessment, plain-language summaries of complex insurance terms, and a complete claim preparation and tracking system.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture:

- **Framework**: React 18 with TypeScript for type safety and developer experience
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Build Tool**: Vite for fast development and optimized production builds

The frontend follows a modular structure with reusable components, custom hooks, and a centralized query client for API communication.

## Backend Architecture
The backend uses Node.js with Express in a RESTful API design:

- **Runtime**: Node.js with TypeScript and ES modules
- **Framework**: Express.js for HTTP server and middleware
- **Authentication**: Replit-based OIDC authentication with session management
- **File Processing**: Multer for file uploads, Tesseract.js for OCR text extraction
- **AI Integration**: OpenAI GPT-4o for policy analysis and natural language processing
- **API Design**: RESTful endpoints with consistent error handling and request/response patterns

The server implements middleware for authentication, file upload handling, and comprehensive logging of API requests.

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM:

- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle for type-safe database operations and migrations
- **Schema Design**: Relational structure with tables for users, policies, analyses, claims, checklist items, and claim updates
- **Session Storage**: PostgreSQL-based session store for authentication persistence
- **File Storage**: In-memory processing for uploaded files with metadata stored in database

The database schema supports the complete claim lifecycle from policy upload through analysis to claim completion.

## Authentication and Authorization
Authentication is implemented using Replit's OIDC provider:

- **Provider**: Replit OIDC for secure user authentication
- **Session Management**: Express sessions stored in PostgreSQL with configurable TTL
- **Authorization**: Route-level protection using middleware to verify authenticated sessions
- **User Management**: Automatic user creation and profile management through OIDC claims

The authentication system provides secure access control while maintaining user session persistence across requests.

# External Dependencies

## Third-Party Services
- **OpenAI API**: GPT-4o model for intelligent policy analysis, risk assessment, and natural language summaries
- **Replit OIDC**: Authentication provider for secure user login and identity management
- **Neon Database**: Serverless PostgreSQL hosting for scalable data storage

## Key Libraries and Frameworks
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **File Processing**: Tesseract.js for client-side OCR text extraction from images and PDFs
- **Cloud Storage**: Google Cloud Storage integration for file upload capabilities (configured but not actively used)
- **Development Tools**: Replit-specific plugins for development environment integration and error handling

## Infrastructure Dependencies
- **Database**: PostgreSQL with connection pooling for reliable data persistence
- **Session Store**: PostgreSQL-based session storage for authentication state
- **File Upload**: Uppy.js components for enhanced file upload user experience with drag-and-drop support

The application is designed to be cloud-native and scalable, with external dependencies chosen for reliability and developer experience in the Replit environment.