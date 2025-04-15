# Error Codes and Handling

This document provides detailed information about error responses in the Express Template API.

## Error Response Format

All API error responses follow a consistent format:

```json
{
  "message": "A human-readable error message",
  "errorCode": "ERROR_CODE_IDENTIFIER",
  "details": {
    "code": "Optional specific code",
    "field": "Optional field name that caused the error",
    "info": {
      // Optional additional information
    }
  }
}
```

## Common Error Codes

### VALIDATION_ERROR
- **HTTP Status**: 400 Bad Request
- **Meaning**: Request input failed validation rules
- **Example**:
  ```json
  {
    "message": "Validation failed",
    "errorCode": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "code": "invalid_format"
    }
  }
  ```
- **Resolution**: Check the request parameters and ensure they meet the validation requirements.

### AUTH_ERROR
- **HTTP Status**: 401 Unauthorized
- **Meaning**: Authentication credentials are missing or invalid
- **Example**:
  ```json
  {
    "message": "Invalid credentials",
    "errorCode": "AUTH_ERROR"
  }
  ```
- **Resolution**: Ensure proper authentication credentials are provided, or re-authenticate to get a new token.

### FORBIDDEN_ERROR
- **HTTP Status**: 403 Forbidden
- **Meaning**: User is authenticated but doesn't have permission for the requested resource
- **Example**:
  ```json
  {
    "message": "Forbidden - Only admin can access",
    "errorCode": "FORBIDDEN_ERROR"
  }
  ```
- **Resolution**: Request access from an administrator or use an account with appropriate permissions.

### NOT_FOUND_ERROR
- **HTTP Status**: 404 Not Found
- **Meaning**: The requested resource does not exist
- **Example**:
  ```json
  {
    "message": "User not found",
    "errorCode": "NOT_FOUND_ERROR",
    "details": {
      "resource": "user",
      "id": "123"
    }
  }
  ```
- **Resolution**: Verify that the requested resource exists and check the ID or identifier parameters.

### DATABASE_ERROR
- **HTTP Status**: 500 Internal Server Error
- **Meaning**: An error occurred while interacting with the database
- **Example**:
  ```json
  {
    "message": "Database error occurred",
    "errorCode": "DATABASE_ERROR"
  }
  ```
- **Resolution**: Contact API administrators. This is generally a server-side issue.

### RATE_LIMIT_ERROR
- **HTTP Status**: 429 Too Many Requests
- **Meaning**: The client has sent too many requests in a given timeframe
- **Example**:
  ```json
  {
    "message": "Too many login attempts. Please try again after 15 minutes.",
    "errorCode": "RATE_LIMIT_ERROR"
  }
  ```
- **Resolution**: Wait for the specified time period before making additional requests.

### CONFLICT_ERROR
- **HTTP Status**: 409 Conflict
- **Meaning**: The request conflicts with the current state of the server
- **Example**:
  ```json
  {
    "message": "User already exists",
    "errorCode": "CONFLICT_ERROR",
    "details": {
      "field": "email"
    }
  }
  ```
- **Resolution**: Modify the request to resolve the conflict (e.g., use a different email address).

## Validation Error Codes

For validation errors, the `details.code` field provides specific validation failure reasons:

| Code | Description |
|------|-------------|
| `required` | A required field is missing |
| `invalid_format` | The format is incorrect (e.g., email, date) |
| `min_length` | The value is shorter than the minimum length |
| `max_length` | The value is longer than the maximum length |
| `weak_password` | The password doesn't meet strength requirements |
| `invalid_type` | The value type is incorrect |

## Error Handling in Clients

### Best Practices

1. **Always check HTTP status codes** first to determine the general category of error
2. **Parse the error response** to extract the specific `errorCode` and `details`
3. **Implement error-specific handling** for common errors like validation and authentication
4. **Display user-friendly messages** based on the error information
5. **Implement automatic retry** for rate limit errors with exponential backoff

### Example Client Error Handling

```javascript
async function makeApiRequest(endpoint, options) {
  try {
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      
      switch (errorData.errorCode) {
        case 'AUTH_ERROR':
          // Handle authentication error (e.g., redirect to login)
          break;
        case 'VALIDATION_ERROR':
          // Display field-specific validation errors
          break;
        case 'RATE_LIMIT_ERROR':
          // Implement retry with backoff
          break;
        default:
          // Generic error handling
      }
      
      throw new Error(errorData.message);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

## Application-Specific Error Codes

In addition to the common error codes, the API may use custom application-specific error codes in certain endpoints. These are documented in the respective API endpoint documentation.

## Error Logging and Reporting

All server-side errors are logged with unique trace IDs. When reporting issues to API administrators, include:

1. The complete error response
2. The X-Trace-Id header from the response
3. The timestamp of the request
4. The request parameters (excluding sensitive information)

This information will help the API administrators diagnose and fix the issue more quickly. 