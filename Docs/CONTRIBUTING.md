# Contributing to Express Template API

We love your input! We want to make contributing to Express Template API as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

### Issues

We use GitHub issues to track bugs and feature requests. When creating an issue please provide:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Environment information (OS, Node.js version, etc.)

## Coding Style Guidelines

### General Guidelines

- Use TypeScript for all code
- Follow the existing code style
- Use meaningful variable and function names
- Keep functions small and focused
- Use async/await for asynchronous code
- Add comments for complex logic

### TypeScript Style

- Use proper TypeScript types for all variables, parameters, and return values
- Avoid using `any` type when possible
- Use interfaces for defining object structures
- Use enums for fixed sets of values

### Code Structure

- Keep files small and focused on a single responsibility
- Place related functionality in the same directory
- Follow the established project structure:
  - `controllers/` - Request handlers
  - `services/` - Business logic
  - `routes/` - Route definitions
  - `middlewares/` - Express middlewares
  - `utils/` - Utility functions
  - `types/` - TypeScript type definitions
  - `config/` - Configuration management

## Setting Up Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/express-template-api.git
   cd express-template-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your development settings
   ```

4. **Set up the database**:
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

1. Place test files in the `tests/` directory
2. Follow the naming convention: `*.test.ts` or `*.spec.ts`
3. Write tests for all new features and bug fixes
4. Use Jest's mocking capabilities to isolate units under test

Example test:
```typescript
describe('AuthService', () => {
  it('should register a new user', async () => {
    // Arrange
    const email = 'test@example.com';
    const password = 'StrongPassword123!';
    
    // Act
    const result = await authService.registerUser(email, password);
    
    // Assert
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });
});
```

## Documentation

### API Documentation

Update the following files when changing or adding API endpoints:

1. `Docs/api-reference.md` - API endpoint documentation
2. `swagger.json` - OpenAPI specification

### Documentation Requirements

All code contributions should include:

1. Updated or new documentation for any user-facing changes
2. Code comments for complex logic
3. Updated typings for any modified interfaces

## Submitting Changes

### Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect the meaning of the code
- `refactor:` - A code change that neither fixes a bug nor adds a feature
- `perf:` - A code change that improves performance
- `test:` - Adding missing tests or correcting existing tests
- `chore:` - Changes to the build process or auxiliary tools

Example:
```
feat: add user profile endpoint
```

### Pull Request Process

1. Update the README.md or documentation with details of changes if appropriate
2. Update the CHANGELOG.md with details of changes
3. The PR must pass all tests and CI checks
4. The PR must be reviewed by at least one maintainer
5. Squash commits when merging

## Adding New Features

### Using the Generator Script

For new API modules, use the generator script:

```bash
npx ts-node scripts/generateApi.ts
```

This will scaffold:
- Controller
- Service
- Routes
- Validation schemas
- Basic tests

### Manual Creation

If adding features manually:

1. Add the feature in the appropriate directory
2. Follow the existing patterns and architectural guidelines
3. Add tests for the new feature
4. Update documentation

## Security Vulnerability Reporting

Please do **NOT** create a public GitHub issue for security vulnerabilities. Instead, send an email to [security@example.com](mailto:security@example.com).

## License

By contributing, you agree that your contributions will be licensed under the project's license (MIT License).

## Questions?

Feel free to contact the project maintainers if you have any questions about contributing.

Thank you for your contributions!
