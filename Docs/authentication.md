# Authentication System

This document explains the authentication system used in the Express Template API.

## Overview

The API uses a secure JWT (JSON Web Token) based authentication system with refresh tokens, offering a balance between security and user experience. The system includes:

- Token-based authentication using JWT
- Refresh token mechanism for extending sessions
- Role-based access control (RBAC)
- Secure password storage with bcrypt
- Strong password policy enforcement

## Authentication Flow

1. **Registration**:
   - User submits email and password
   - System validates password strength
   - Password is hashed using bcrypt
   - User account is created with default 'USER' role
   - Access token and refresh token are generated and returned

2. **Login**:
   - User submits email and password
   - System verifies credentials
   - Access token and refresh token are generated and returned
   - Rate limiting is applied to prevent brute force attacks

3. **Accessing Protected Resources**:
   - Client includes access token in the Authorization header
   - Server validates the token
   - If valid, the request proceeds
   - If invalid or expired, 401 Unauthorized is returned

4. **Token Renewal**:
   - When access token expires, client uses refresh token
   - If refresh token is valid, a new access token is issued
   - If refresh token is invalid or expired, user must log in again

## Token Details

### Access Token

- **Purpose**: Authenticate requests to protected resources
- **Expiration**: 1 hour (configurable in `.env` file)
- **Format**: JWT signed with a secret key
- **Contains**: User ID and other non-sensitive user information
- **Usage**: Sent in the Authorization header as a Bearer token

### Refresh Token

- **Purpose**: Obtain new access tokens without re-authentication
- **Expiration**: 7 days (configurable in `.env` file)
- **Format**: JWT signed with a separate secret key
- **Contains**: User ID
- **Usage**: Sent to the `/api/v1/auth/refresh` endpoint

## Implementation Details

### Token Generation

Access and refresh tokens are generated using the `jsonwebtoken` library:

```typescript
// Access token generation
const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, { expiresIn: '1h' });

// Refresh token generation
const refreshToken = jwt.sign(
  { userId: user.id },
  config.REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' }
);
```

### Authentication Middleware

Protected routes use the `authenticateJWT` middleware:

```typescript
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next(new AppError('Token not provided', 401));
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, config.JWT_SECRET) as { userId: number };
    const dbUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!dbUser) return next(new AppError('User not found', 401));
    (req as any).user = dbUser;
    next();
  } catch (err) {
    return next(new AppError('Invalid token', 403));
  }
};
```

## Role-Based Access Control

The system supports two roles:
- **USER**: Regular user with limited access
- **ADMIN**: Administrator with full access

Role checks are implemented at the controller level:

```typescript
if (user.role !== 'ADMIN') {
  return next(new AppError('Forbidden - Only admin can access', 403));
}
```

## Password Security

Passwords are:
1. Validated for strength before acceptance
2. Hashed using bcrypt with a configurable salt round (default: 12)
3. Never stored or transmitted in plain text

Password strength requirements:
- Minimum 10 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

## Security Considerations

### Best Practices for Clients

1. **Store tokens securely**:
   - Store access tokens in memory (not localStorage or cookies)
   - If necessary, store refresh tokens in HttpOnly cookies
   
2. **Implement token management**:
   - Renew access tokens before they expire
   - Implement proper logout by discarding tokens
   
3. **Secure headers**:
   - Always use HTTPS
   - Set appropriate security headers

### Server Security Measures

1. **Token protection**:
   - Different secrets for access and refresh tokens
   - Short expiration for access tokens
   
2. **Rate limiting**:
   - Login and registration endpoints are rate-limited
   
3. **CORS restrictions**:
   - API is configured with strict CORS policies

### Secure Communication

Always use HTTPS in production environments to prevent token interception through man-in-the-middle attacks.

## Configuration

Authentication settings are configured through environment variables:

```
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
BCRYPT_SALT_ROUNDS=12
```

For secure production deployment:
1. Use strong, unique secrets for JWT tokens
2. Consider rotating secrets periodically
3. Adjust token expiration times as needed for your application

## API Endpoints

For detailed API endpoints related to authentication, refer to the [API Reference](./api-reference.md#authentication) documentation. 