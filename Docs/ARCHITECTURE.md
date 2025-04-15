# Architecture Overview

This document outlines the architecture of the Express Template API, explaining its design principles, components, and how they interact.

## High-Level Architecture

The Express Template API follows a modular, layered architecture that emphasizes separation of concerns, testability, and scalability. The main architectural layers are:

```
┌─────────────────────────────────────────────────────────────┐
│                          API Layer                          │
│            (Routes, Validation, Rate Limiting)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       Controller Layer                      │
│                   (Request/Response Handling)               │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        Service Layer                        │
│              (Business Logic, Domain Operations)            │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        Data Access                          │
│                    (Prisma ORM, Database)                   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Framework Module

The `ExpressFramework` class (`src/framework/ExpressFramework.ts`) provides a foundation for the Express application, handling core concerns like:

- Server setup and lifecycle management
- Core middleware registration (security, parsing, etc.)
- Route module registration
- Error handling

This abstraction allows for flexibility and ensures consistent application of middleware and concerns.

### 2. Routes

Route modules (`src/routes/`) define API endpoints and connect them to controllers. Each route file:

- Creates an Express Router
- Defines routes with HTTP methods (GET, POST, etc.)
- Applies middleware for authentication, validation, etc.
- Maps routes to controller functions

### 3. Controllers

Controllers (`src/controllers/`) handle HTTP requests and responses. They:

- Extract data from requests
- Call appropriate service functions
- Format responses
- Handle request-specific errors
- Delegate business logic to services

Controllers are kept thin and focused on request/response handling, not business logic.

### 4. Services

Services (`src/services/`) contain the business logic. They:

- Implement domain operations
- Interact with the data access layer
- Apply business rules and validations
- Handle transaction management
- Return domain objects, not HTTP responses

Services are independent of the HTTP layer, making them more reusable and testable.

### 5. Data Access

The data layer uses Prisma ORM to interact with the database:

- Models defined in `prisma/schema.prisma`
- Singleton client pattern for connection management
- Type-safe database access

### 6. Cross-Cutting Concerns

#### Authentication & Authorization

- JWT-based authentication with refresh tokens
- Role-based access control
- Middleware for protecting routes

#### Validation

- Request validation using express-validator
- Schema-based validation rules
- Centralized error handling

#### Error Handling

- Consistent error response format
- Typed error classes
- Global error middleware

#### Logging

- Winston logger with format customization
- Environment-specific logging (dev vs. production)
- Request tracing with unique IDs

#### Configuration

- Environment-based configuration
- Strong typing using envalid
- Centralized configuration management

## Request Flow

A typical request flows through the system as follows:

1. **Client** sends a request to an API endpoint
2. **Express server** receives the request
3. **Global middleware** processes the request (logging, security, etc.)
4. **Route-specific middleware** applies (auth, validation, rate limiting)
5. **Controller** handles the request and calls a service
6. **Service** performs business logic and database operations
7. **Controller** formats the result and sends a response
8. **Error middleware** catches any errors and formats them consistently

## Design Decisions

### 1. Separation of Concerns

The codebase strictly separates:
- HTTP concerns (controllers, routes)
- Business logic (services)
- Data access (Prisma)
- Cross-cutting concerns (middleware)

This makes the code more maintainable and testable.

### 2. Dependency Injection Pattern

Services are "injected" into controllers, promoting:
- Loose coupling
- Testability through mocking
- Separation of concerns

### 3. Singleton Pattern for Shared Resources

Resources like the Prisma client and logger use the singleton pattern to:
- Prevent resource duplication
- Ensure proper lifecycle management
- Share configuration

### 4. Middleware Composition

The API uses middleware composition to:
- Apply cross-cutting concerns
- Keep route definitions clean
- Enable reuse of common functionality

### 5. Type Safety

TypeScript is used throughout the codebase to:
- Catch errors at compile time
- Provide better IDE support
- Document interfaces and contracts

## Scalability Considerations

### Horizontal Scaling

The API is designed for horizontal scaling:
- Stateless authentication (JWT)
- No server-side session state
- Connection pooling for database access

### Modularity

New API modules can be added without modifying existing code:
- Routes are registered dynamically
- Controllers and services are independent
- The API generator script creates consistent new modules

### Rate Limiting

Rate limiting protects the API from overuse:
- Global rate limits for all endpoints
- Specific limits for authentication endpoints
- Customizable limits for sensitive operations

## Security Architecture

Security is built into multiple layers:

1. **Network Level**
   - HTTPS recommended for all environments
   - CORS configuration to limit origins

2. **Application Level**
   - Helmet.js for security headers
   - Input sanitization
   - Rate limiting

3. **Authentication Level**
   - JWT with short expiration
   - Refresh token rotation
   - Strong password requirements

4. **Authorization Level**
   - Role-based access checks
   - Resource-based permission checks

5. **Data Level**
   - Input validation
   - Query parameterization (via Prisma)
   - Data sanitization

## Testing Architecture

The testing approach includes:

1. **Unit Tests**
   - Service logic testing
   - Utility function testing
   - Mocking of dependencies

2. **Integration Tests**
   - API endpoint testing
   - Database operation testing
   - Authentication flow testing

3. **End-to-End Tests**
   - Complete user flows
   - Simulated client requests

Tests are organized in the `tests/` directory with a structure mirroring the `src/` directory.

## Extending the Architecture

To extend the application:

1. **Add new models** to `prisma/schema.prisma`
2. **Create new services** in `src/services/`
3. **Define new controllers** in `src/controllers/`
4. **Add new routes** in `src/routes/`
5. **Register routes** in `src/app.ts`

Or use the API generator script:
```bash
npx ts-node scripts/generateApi.ts
```

## Architecture Evolution

The architecture has evolved to address:

1. **Maintainability**: Clearer separation of concerns
2. **Testability**: More modular components
3. **Security**: Enhanced authentication and authorization
4. **Performance**: Optimized database access
5. **Developer Experience**: Improved scaffolding and type safety

Future evolution may include:
- Microservices decomposition
- Event-driven patterns
- More sophisticated caching strategies
