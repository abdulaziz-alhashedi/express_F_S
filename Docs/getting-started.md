# Getting Started with Express Template API

This guide will help you set up and run the Express Template API project locally, understand its core components, and start building your own APIs on top of it.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or later)
- **npm**, **yarn**, or **pnpm** (package manager)
- **PostgreSQL** (or another database supported by Prisma)
- **Git** (for version control)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/abdulaziz-alhashedi/express_F_S.git
cd express_F_S
```

### 2. Install Dependencies

Choose one of the following methods:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure it with your settings:

```bash
cp .env.example .env
```

Open the `.env` file in your editor and update the following values:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication
JWT_SECRET="your_jwt_secret_here"
REFRESH_TOKEN_SECRET="your_refresh_token_secret_here"
ACCESS_TOKEN_SECRET="your_access_token_secret_here"

# Application
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:8080

# Security
BCRYPT_SALT_ROUNDS=12
API_KEY="your_api_key_here"
ADMIN_KEY="your_admin_key_here"
```

For production environments, ensure you use strong, unique secrets for all security-sensitive values.

### 4. Set Up the Database

Run Prisma migrations to create your database schema:

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The API should now be running at `http://localhost:3000` (or the port you specified in the `.env` file).

## Project Structure Overview

The project follows a modular architecture with clear separation of concerns:

```
express_F_S/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── routes/         # API route definitions
│   ├── middlewares/    # Express middlewares
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── config/         # Configuration management
│   ├── framework/      # Framework abstractions
│   └── app.ts          # Application entry point
├── prisma/
│   ├── schema.prisma   # Database schema
│   ├── migrations/     # Database migrations
│   └── seed.ts         # Database seeding
├── tests/              # Automated tests
├── scripts/            # Utility scripts
├── Docs/               # Documentation
├── swagger.json        # API documentation
└── package.json        # Project metadata
```

## Core Components

### Authentication System

The authentication system uses JWT for secure user authentication:

- **Registration**: Create new users (`POST /api/v1/auth/register`)
- **Login**: Authenticate users and get tokens (`POST /api/v1/auth/login`)
- **Refresh Token**: Renew access tokens (`POST /api/v1/auth/refresh`)
- **Profile**: Get user profile (`GET /api/v1/auth/profile`)

For more details, see [Authentication Documentation](./authentication.md).

### User Management

Admin users can manage all users in the system:

- **Get All Users**: List all users (`GET /api/v1/users`)
- **Get User**: Get user details (`GET /api/v1/users/:id`)
- **Create User**: Create a new user (`POST /api/v1/users`)
- **Update User**: Update user details (`PUT /api/v1/users/:id`)
- **Delete User**: Remove a user (`DELETE /api/v1/users/:id`)

For more details, see [API Reference](./api-reference.md).

### Database Access

The project uses Prisma ORM for database access:

- Define models in `prisma/schema.prisma`
- Run migrations with `npx prisma migrate dev`
- Access the database through the `prisma` client

For more details, see [Database Documentation](./DATABASE.md).

## Creating Your First API Endpoint

### Using the API Generator Script

The project includes a script to scaffold new API endpoints quickly:

```bash
npx ts-node scripts/generateApi.ts
```

Follow the prompts to create a new API module with routes, controllers, and services.

### Manual Creation

To manually create a new API endpoint:

1. **Create a controller** in `src/controllers/`
2. **Create a service** in `src/services/`
3. **Define routes** in `src/routes/`
4. **Register the routes** in `src/app.ts`

Example route file:

```typescript
import { Router } from 'express';
import { yourController } from '../controllers/your.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

router.get('/', authenticateJWT, yourController.getAllItems);
router.post('/', authenticateJWT, validate('createItem'), yourController.createItem);

export default router;
```

Then register it in `app.ts`:

```typescript
import yourRoutes from '@/routes/your.routes';
// ...
framework.registerModule('/api/v1/your-endpoint', yourRoutes);
```

## Testing Your API

### Using Swagger UI

The API includes a Swagger UI interface for testing endpoints:

1. Start the development server
2. Navigate to `http://localhost:3000/api/v1/docs` in your browser
3. Use the interactive interface to test API endpoints

### Using Postman

Import the provided Postman collection:

1. Open Postman
2. Import `postman_collection.json`
3. Set up an environment with the `base_url` variable pointing to your API

## Next Steps

1. Explore the [API Reference](./api-reference.md) for detailed information about available endpoints
2. Review the [Error Codes](./error-codes.md) documentation to understand error handling
3. Learn about the [Authentication System](./authentication.md) for secure API access
4. Check out [Deployment](./DEPLOYMENT.md) for production deployment instructions

## Troubleshooting

If you encounter issues, refer to the [Troubleshooting Guide](./TROUBLESHOOTING.md) or create an issue on the GitHub repository.

## Contributing

We welcome contributions! See [Contributing Guidelines](./CONTRIBUTING.md) for details.
