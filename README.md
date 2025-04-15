# ExpressPrime

A robust Express-based API template featuring secure authentication, role-based access control, input validation, and automated API module generation.

## 🌟 Features

- **Authentication**: JWT-based authentication with refresh tokens and secure session management
- **Authorization**: Role-based access control (ADMIN and USER roles)
- **Validation**: Strong input validation using express-validator
- **Security**: Comprehensive security measures with Helmet, CORS, rate limiting, and input sanitization
- **API Generation**: Automated scaffolding via a custom generation script
- **Logging**: Detailed request/response logging with winston and trace IDs
- **Database**: Type-safe database access managed by Prisma ORM
- **Configuration**: Strong environment variable management via envalid
- **Documentation**: Extensive documentation for all aspects of the API
- **Testing**: Comprehensive testing setup with Jest
- **Deployment**: Multiple deployment options including Docker support

## 📋 Documentation

This project includes comprehensive documentation to help you get started, understand the architecture, and deploy the API:

- [Getting Started](./Docs/GETTING-STARTED.md) - Setup and first steps
- [API Reference](./Docs/api-reference.md) - Detailed API endpoints documentation
- [Authentication](./Docs/authentication.md) - Authentication system and security
- [Architecture](./Docs/ARCHITECTURE.md) - System design and components
- [Error Codes](./Docs/error-codes.md) - Error handling and response formats
- [Security](./Docs/SECURITY.md) - Security features and best practices
- [Deployment](./Docs/DEPLOYMENT.md) - Deployment instructions for various environments
- [Troubleshooting](./Docs/TROUBLESHOOTING.md) - Common issues and solutions
- [Contributing](./Docs/CONTRIBUTING.md) - Guidelines for contributors

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 14.x)
- PostgreSQL (or your database configured via Prisma)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/abdulaziz-alhashedi/ExpressPrime.git
    cd ExpressPrime
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Configure environment**:
    ```bash
    cp .env.example .env
    # Edit .env with your settings
    ```

4. **Setup database**:
    ```bash
    npx prisma generate
    npx prisma migrate dev
    ```

5. **Start development server**:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

The API will be available at [http://localhost:3000](http://localhost:3000)

## 📚 API Testing

### Swagger Documentation

Access the interactive API documentation at [http://localhost:3000/api/v1/docs](http://localhost:3000/api/v1/docs)

### Postman Collection

Import the provided Postman collection:
```
postman_collection.json
```

## ⚙️ Core Modules

- **Authentication**: User registration, login, token refresh, and profile access
- **User Management**: CRUD operations for users (admin only)
- **External Integrations**: Template for integrating third-party services
- **Health Monitoring**: System health and status endpoint

## 🔧 Utility Scripts

- **Generate API Module**:
  ```bash
  npx ts-node scripts/generateApi.ts
  ```
  Creates a new API module with controller, service, routes, and tests

- **Create Admin User**:
  ```bash
  npx ts-node scripts/createAdmin.ts
  ```
  Creates an admin user with elevated privileges

## 🔐 Security Features

- JWT-based authentication with separate access and refresh tokens
- Strong password policy enforcement with secure hashing
- Protection against common vulnerabilities (XSS, CSRF, injection attacks)
- Rate limiting to prevent brute force attacks
- Request tracing with unique IDs for security auditing

## 🌐 Deployment Options

- Traditional server deployment with PM2
- Docker containerization
- Cloud provider deployments (AWS, Azure, GCP)
- Serverless deployment

For detailed deployment instructions, see the [Deployment Guide](./Docs/DEPLOYMENT.md).

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
# or
pnpm test
```

## 👥 Contributing

Contributions are welcome! Please read the [Contributing Guidelines](./Docs/CONTRIBUTING.md) before submitting a pull request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for modern API development.

