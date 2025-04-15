# Troubleshooting Guide

This document provides solutions for common issues you might encounter when working with the Express Template API.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Database Connection Problems](#database-connection-problems)
- [Authentication Issues](#authentication-issues)
- [Deployment Problems](#deployment-problems)
- [Performance Issues](#performance-issues)
- [Common Error Messages](#common-error-messages)
- [Debugging Techniques](#debugging-techniques)

## Installation Issues

### npm/yarn/pnpm Install Fails

**Issue**: Package installation fails with dependency errors.

**Solutions**:

1. **Clear cache and try again**:
   ```bash
   # For npm
   npm cache clean --force
   npm install
   
   # For yarn
   yarn cache clean
   yarn install
   
   # For pnpm
   pnpm store prune
   pnpm install
   ```

2. **Check Node.js version**:
   ```bash
   node -v
   ```
   Ensure you're using Node.js v14 or higher.

3. **Delete node_modules and reinstall**:
   ```bash
   rm -rf node_modules
   rm package-lock.json # or yarn.lock/pnpm-lock.yaml
   npm install
   ```

4. **Check for conflicting dependencies**:
   ```bash
   npm ls
   ```
   Look for packages with peer dependency issues.

### TypeScript Compilation Errors

**Issue**: Build fails with TypeScript errors.

**Solutions**:

1. **Check TypeScript version**:
   ```bash
   npx tsc --version
   ```
   Update if needed:
   ```bash
   npm install -D typescript@latest
   ```

2. **Clear TypeScript cache**:
   ```bash
   rm -rf dist
   rm tsconfig.tsbuildinfo
   ```

3. **Run TypeScript with verbose output**:
   ```bash
   npx tsc --listEmittedFiles
   ```

## Database Connection Problems

### Prisma Connection Fails

**Issue**: Application fails to connect to the database with Prisma.

**Solutions**:

1. **Verify connection string**:
   Check your `.env` file for the correct `DATABASE_URL` format:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   ```

2. **Check database credentials**:
   Ensure username, password, and database name are correct.

3. **Test connection manually**:
   ```bash
   # For PostgreSQL
   psql -h localhost -U username -d database_name
   ```

4. **Run Prisma diagnostics**:
   ```bash
   npx prisma db diagnose
   ```

5. **Verify that the database exists**:
   ```bash
   # For PostgreSQL
   sudo -u postgres createdb database_name
   ```

6. **Regenerate Prisma client**:
   ```bash
   npx prisma generate
   ```

### Migration Errors

**Issue**: Prisma migrations fail to apply.

**Solutions**:

1. **Check migration history**:
   ```bash
   npx prisma migrate status
   ```

2. **Reset the database (development only)**:
   ```bash
   npx prisma migrate reset
   ```

3. **Apply migrations manually**:
   ```bash
   npx prisma db push
   ```

4. **Resolve conflicts in schema**:
   Compare your `schema.prisma` with the database schema and resolve differences.

## Authentication Issues

### JWT Token Issues

**Issue**: JWT authentication fails or tokens are not working.

**Solutions**:

1. **Check JWT secret**:
   Ensure `JWT_SECRET` and `REFRESH_TOKEN_SECRET` are set in your `.env` file.

2. **Verify token expiration**:
   Check the JWT payload for proper expiration time:
   ```bash
   # Decode a JWT token (replace with your token)
   echo 'your_token_here' | cut -d '.' -f 2 | base64 -d | json_pp
   ```

3. **Clear browser storage**:
   If testing with a browser, clear localStorage and cookies.

4. **Check token format**:
   Ensure Authorization header follows the format:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Password Reset Issues

**Issue**: Password reset functionality doesn't work.

**Solutions**:

1. **Verify password strength**:
   Ensure the password meets the strength requirements:
   - Minimum 10 characters
   - Contains uppercase and lowercase letters
   - Contains at least one digit
   - Contains at least one special character

2. **Check email service** (if using email for password reset):
   Verify email service credentials and connectivity.

## Deployment Problems

### Application Won't Start

**Issue**: The application fails to start after deployment.

**Solutions**:

1. **Check logs**:
   ```bash
   # For PM2
   pm2 logs express-api
   
   # For Docker
   docker logs container_id
   ```

2. **Verify environment variables**:
   Ensure all required environment variables are set in the production environment.

3. **Check for port conflicts**:
   Ensure the port is not in use by another service:
   ```bash
   lsof -i :<PORT>
   ```

4. **Verify file permissions**:
   ```bash
   chmod -R 755 <your_project_directory>
   ```

### Docker Deployment Issues

**Issue**: Docker container exits or fails to start.

**Solutions**:

1. **Check Docker logs**:
   ```bash
   docker logs container_id
   ```

2. **Verify Docker environment**:
   Ensure environment variables are passed to the container.

3. **Check Docker image**:
   ```bash
   docker image inspect image_id
   ```

4. **Run container with interactive shell**:
   ```bash
   docker run -it --entrypoint /bin/sh your_image_name
   ```

### Database Migration Issues in Production

**Issue**: Database migrations fail in production.

**Solutions**:

1. **Run migrations in development mode first**:
   ```bash
   NODE_ENV=development npx prisma migrate dev
   ```

2. **Deploy migration script separately**:
   ```bash
   NODE_ENV=production npx prisma migrate deploy
   ```

3. **Backup database before migrations**:
   ```bash
   pg_dump -U username -d database_name > backup.sql
   ```

## Performance Issues

### Slow Response Times

**Issue**: API endpoints respond slowly.

**Solutions**:

1. **Enable compression**:
   Add compression middleware:
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Optimize database queries**:
   - Add proper indexes to your Prisma schema
   - Use `select` to limit returned fields
   - Use pagination for large datasets

3. **Implement caching**:
   Add Redis or in-memory caching for frequently accessed data.

4. **Monitor performance**:
   Use tools like New Relic or Prometheus to identify bottlenecks.

### Memory Leaks

**Issue**: Node.js process memory usage grows over time.

**Solutions**:

1. **Monitor memory usage**:
   ```bash
   # For PM2
   pm2 monit
   ```

2. **Take heap snapshots** (in development):
   Use Chrome DevTools to analyze memory leaks.

3. **Check for event listener leaks**:
   Ensure all event listeners are properly removed.

4. **Implement process restart strategy**:
   Configure PM2 to restart the process periodically:
   ```
   pm2 start app.js --max-memory-restart 500M
   ```

## Common Error Messages

### "Error: EACCES: permission denied"

**Issue**: Permission denied when accessing files or directories.

**Solutions**:
1. Change file ownership:
   ```bash
   sudo chown -R $USER:$USER <directory>
   ```
2. Change file permissions:
   ```bash
   chmod -R 755 <directory>
   ```

### "Error: listen EADDRINUSE: address already in use"

**Issue**: Port is already in use by another process.

**Solutions**:
1. Find the process using the port:
   ```bash
   lsof -i :<PORT>
   ```
2. Kill the process:
   ```bash
   kill -9 <PID>
   ```
3. Use a different port in your application.

### "Error: Cannot find module..."

**Issue**: Node.js can't find a required module.

**Solutions**:
1. Install the missing module:
   ```bash
   npm install <module_name>
   ```
2. Check package.json for the dependency.
3. Check import/require paths for typos.
4. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

### "PrismaClientInitializationError"

**Issue**: Prisma client fails to initialize.

**Solutions**:
1. Check database connection string in `.env`.
2. Ensure the database server is running.
3. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Check Prisma schema for errors:
   ```bash
   npx prisma validate
   ```

### "JsonWebTokenError: invalid signature"

**Issue**: JWT token validation fails.

**Solutions**:
1. Ensure the same JWT_SECRET is used for signing and verification.
2. Check if token has been tampered with.
3. Verify that the token is correctly passed in the request.

## Debugging Techniques

### Enable Debug Logging

Enhance logging by setting the log level to debug:

```typescript
// In your environment variables
DEBUG=express:*,prisma:*

// In your code
logger.level = 'debug';
```

### Use Postman Effectively

1. **Create environment variables** for different environments (dev, prod).
2. **Set up pre-request scripts** to automatically handle authentication.
3. **Write tests** for responses to catch regressions.

### Inspect Network Requests

Use browser DevTools (Network tab) or tools like Wireshark to inspect API requests and responses.

### Debug Database Queries

1. Enable Prisma query logging:
   ```
   // In .env
   DEBUG=prisma:query
   ```

2. Add logging to your Prisma queries:
   ```typescript
   console.log('Query params:', params);
   const result = await prisma.user.findMany({
     // query params
   });
   console.log('Query result:', result);
   ```

### Use Process Manager Monitoring

If using PM2:
```bash
pm2 monit
```

This provides real-time metrics for CPU, memory, and request handling.

## Getting Additional Help

If you're still experiencing issues:

1. **Check GitHub Issues**: Look for similar issues in the project repository.
2. **Consult Documentation**: Review the other documentation files for specific components.
3. **Get Community Help**: Ask questions on Stack Overflow with the appropriate tags.
4. **Report Bugs**: If you believe you've found a bug, create a detailed GitHub issue.
