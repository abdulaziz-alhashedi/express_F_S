# API Reference

## Authentication

### Register a New User
**POST** `/api/v1/auth/register`

Creates a new user account with the role of `USER`.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Password Requirements:**
- Minimum 10 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

**Response (201 Created):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400 Bad Request: Invalid input or user already exists
- 429 Too Many Requests: Rate limit exceeded
- 500 Internal Server Error: Registration failed

---

### Login
**POST** `/api/v1/auth/login`

Authenticates a user and returns access and refresh tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400 Bad Request: Validation error
- 401 Unauthorized: Invalid credentials
- 429 Too Many Requests: Too many login attempts
- 500 Internal Server Error: Login failed

---

### Refresh Token
**POST** `/api/v1/auth/refresh`

Issues a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400 Bad Request: Refresh token missing
- 403 Forbidden: Invalid refresh token
- 500 Internal Server Error: Token refresh failed

---

### Get User Profile
**GET** `/api/v1/auth/profile`

Retrieves the authenticated user's profile.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 123,
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Error Responses:**
- 401 Unauthorized: Invalid or missing token

---

## User Management (Admin Only)

### Get All Users
**GET** `/api/v1/users`

Retrieves a list of all users. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
[
  {
    "id": 123,
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": 124,
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: User does not have admin privileges

---

### Get User by ID
**GET** `/api/v1/users/:id`

Retrieves a specific user by ID.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "role": "USER",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: User does not have admin privileges
- 404 Not Found: User not found

---

### Create User (Admin Only)
**POST** `/api/v1/users`

Creates a new user. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "StrongPassword123!"
}
```

**Response (201 Created):**
```json
{
  "id": 125,
  "email": "newuser@example.com",
  "role": "USER",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- 400 Bad Request: Invalid input 
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: User does not have admin privileges
- 409 Conflict: User already exists

---

### Update User (Admin Only)
**PUT** `/api/v1/users/:id`

Updates an existing user. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "email": "updated@example.com",
  "password": "NewStrongPassword123!"
}
```

**Response (200 OK):**
```json
{
  "id": 123,
  "email": "updated@example.com",
  "role": "USER",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-02T00:00:00.000Z"
}
```

**Error Responses:**
- 400 Bad Request: Invalid input
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: User does not have admin privileges
- 404 Not Found: User not found

---

### Delete User (Admin Only)
**DELETE** `/api/v1/users/:id`

Deletes a user. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (204 No Content)**

**Error Responses:**
- 401 Unauthorized: Invalid or missing token
- 403 Forbidden: User does not have admin privileges
- 404 Not Found: User not found

---

## Health Check

### Health Status
**GET** `/api/v1/health`

Checks if the API is running properly.

**Response (200 OK):**
```json
{
  "status": "OK",
  "uptime": 12345.67
}
```

## Error Codes

For detailed information on error codes and their meanings, refer to [Error Codes Documentation](./error-codes.md).

## Authentication

For detailed information on the authentication system, refer to [Authentication Documentation](./authentication.md).
