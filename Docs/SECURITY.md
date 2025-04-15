# Security Documentation

This document outlines the security measures, best practices, and considerations for the Express Template API.

## Security Features Overview

The Express Template API implements multiple layers of security:

1. **HTTP Security Headers** via Helmet.js
2. **CORS Protection** with configurable origin whitelisting
3. **Rate Limiting** to prevent abuse
4. **Input Validation and Sanitization**
5. **Secure Authentication** using JWT with refresh tokens
6. **Role-Based Access Control**
7. **Password Security** with strong hashing and validation
8. **Request Tracing** with unique IDs
9. **Comprehensive Logging** for security events
10. **Environment-specific Configurations**

## HTTP Security

### Security Headers

Helmet.js is configured to set the following security headers:

```typescript
// Content Security Policy
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'"]
    }
  }
});

// HTTP Strict Transport Security
helmet.hsts({ maxAge: 31536000, includeSubDomains: true });

// Referrer Policy
helmet.referrerPolicy({ policy: 'no-referrer' });

// X-Content-Type-Options
helmet.noSniff();
```

### CORS Configuration

The API uses CORS protection with a configurable whitelist:

```typescript
cors({
  origin: appConfig.CORS_ORIGIN.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
});
```

Configure allowed origins in the `.env` file:
```
CORS_ORIGIN=https://your-frontend-app.com,https://admin.your-app.com
```

## Rate Limiting

Rate limiting is applied at multiple levels:

1. **Global Rate Limiting**:
   - Limits all API requests to prevent DoS attacks
   - Default: 100 requests per 15-minute window

2. **Authentication Route Limiting**:
   - Stricter limits on authentication endpoints
   - Prevents brute force attacks

3. **Specific Endpoint Limiting**:
   - Custom limits for sensitive operations

Example configuration:
```typescript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

router.post('/login', authLimiter, /* other middleware */);
```

## Input Validation and Sanitization

### Request Validation

All user input is validated using express-validator:

```typescript
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').custom(value => {
      if (!isStrongPassword(value)) {
        throw new Error(PASSWORD_REQUIREMENT_MESSAGE);
      }
      return true;
    })
  ],
  validationMiddleware,
  register
);
```

### Mongo Sanitization

The API uses express-mongo-sanitize to prevent NoSQL injection:

```typescript
app.use(mongoSanitize());
```

## Authentication Security

### JWT Implementation

- Access tokens expire after 1 hour
- Refresh tokens expire after 7 days
- Separate secret keys for access and refresh tokens

### Password Security

Passwords are:

1. **Validated** for strength:
   - Minimum 10 characters
   - Must contain uppercase, lowercase, number, and special character

2. **Hashed** using bcrypt with a configurable salt rounds (default: 12):
   ```typescript
   const hashedPassword = await bcrypt.hash(password, saltRounds);
   ```

3. **Never** stored or transmitted in plain text

## Role-Based Access Control

The API implements role-based access with two primary roles:
- `USER`: Regular user with limited access
- `ADMIN`: Administrator with full system access

Example controller-level role check:
```typescript
if (user.role !== 'ADMIN') {
  return next(new AppError('Forbidden - Only admin can access', 403));
}
```

## Request Tracing

Each request is assigned a unique trace ID for security auditing:

```typescript
app.use((req, res, next) => {
  const traceId = uuidv4();
  req.headers['x-trace-id'] = traceId;
  res.setHeader('X-Trace-Id', traceId);
  next();
});
```

## Logging Security Events

Security events are logged with trace IDs to facilitate auditing:

```typescript
logger.info(`User ${admin.id} created a new user with id ${newUser.id}.`);
```

In production, logs are structured for easier parsing and analysis.

## Environment-specific Security

The API uses different security configurations based on the environment:

- **Development**: Verbose logging, detailed error messages
- **Production**: Limited information in responses, structured logging

## Security Best Practices

### Secret Management

1. **Never commit secrets** to version control
2. **Use environment variables** for all secrets
3. **Use strong, unique secrets** for each environment
4. **Consider secret rotation** for production environments

Example `.env` configuration:
```
JWT_SECRET=your_strong_random_secret_here
REFRESH_TOKEN_SECRET=different_strong_random_secret_here
ACCESS_TOKEN_SECRET=another_different_strong_random_secret
```

### Dependency Security

1. Regularly run `npm audit` to check for vulnerabilities
2. Keep dependencies updated
3. Consider using dependency scanning tools

### Database Security

1. **Use the principle of least privilege** for database users
2. **Ensure proper indexing** to prevent DoS attacks
3. **Use Prisma ORM** for parameterized queries to prevent SQL injection

### Error Handling

The API implements secure error handling:

1. **Detailed logging** for debugging
2. **Generic error messages** to users (not exposing internals)
3. **Consistent error format** for front-end handling

## Security Checklist for Deployment

Before deploying to production:

- [ ] Set strong, unique secrets in environment variables
- [ ] Enable HTTPS and configure proper certificates
- [ ] Set strict CORS rules for production domains
- [ ] Adjust rate limiting settings for expected traffic
- [ ] Configure proper logging and monitoring
- [ ] Run security vulnerability scans
- [ ] Test authentication and authorization flows

## Additional Security Measures

For enhanced security, consider implementing:

1. **Two-Factor Authentication** for sensitive operations
2. **IP-based access controls** for admin functions
3. **Automated security scanning** in CI/CD pipelines
4. **Intrusion detection systems**
5. **Web Application Firewall** (WAF)

## Security Incident Response

In case of a security incident:

1. **Isolate** the affected systems
2. **Identify** the scope of the breach
3. **Contain** the breach and prevent further damage
4. **Eradicate** the vulnerability
5. **Recover** affected systems
6. **Document** and learn from the incident

## References

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [NodeJS Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
