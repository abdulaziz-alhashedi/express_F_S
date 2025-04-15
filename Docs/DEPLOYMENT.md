# Deployment Guide

This guide provides instructions for deploying the Express Template API to various environments, from simple server setups to containerized and cloud-based deployments.

## Table of Contents

- [Preparation](#preparation)
- [Traditional Server Deployment](#traditional-server-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Provider Deployments](#cloud-provider-deployments)
  - [AWS Deployment](#aws-deployment)
  - [Azure Deployment](#azure-deployment)
  - [Google Cloud Platform](#google-cloud-platform)
- [Serverless Deployment](#serverless-deployment)
- [CI/CD Pipeline Integration](#cicd-pipeline-integration)
- [Post-Deployment Checks](#post-deployment-checks)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

## Preparation

Before deploying, make sure you have:

1. **Built the application**:
   ```bash
   npm run build
   ```

2. **Configured environment variables** for production:
   ```
   NODE_ENV=production
   DATABASE_URL=your_production_db_connection_string
   JWT_SECRET=strong_random_secret
   REFRESH_TOKEN_SECRET=different_strong_random_secret
   PORT=3000
   CORS_ORIGIN=https://your-frontend-app.com
   ```

3. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```

4. **Created a production database** and run migrations:
   ```bash
   NODE_ENV=production npx prisma migrate deploy
   ```

## Traditional Server Deployment

### Prerequisites

- Node.js v14+ installed
- A web server (optional, for reverse proxy)
- PM2 or similar process manager

### Steps

1. **Set up your server** with Node.js:
   ```bash
   # On Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2 globally**:
   ```bash
   npm install -g pm2
   ```

3. **Transfer the application** to your server:
   ```bash
   # Using SCP
   scp -r ./dist .env package.json package-lock.json user@your-server:/path/to/app
   
   # Or using Git
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
   npm ci --production
   ```

4. **Set up environment variables** on the server:
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

5. **Start the application with PM2**:
   ```bash
   pm2 start dist/app.js --name "express-api"
   
   # Configure PM2 to start on boot
   pm2 startup
   pm2 save
   ```

6. **Set up a reverse proxy** (optional but recommended):

   **Nginx example**:
   ```
   server {
       listen 80;
       server_name api.yourdomainname.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   **Configure SSL**:
   ```bash
   # Using Certbot
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomainname.com
   ```

## Docker Deployment

### Prerequisites

- Docker installed
- Docker Compose (optional, for multi-container setup)

### Steps

1. **Build the Docker image**:
   ```bash
   docker build -t express-template-api .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 --env-file .env express-template-api
   ```

3. **Using Docker Compose** (recommended for production):
   
   Create or modify `docker-compose.yml`:
   ```yaml
   version: '3.8'
   
   services:
     api:
       build: .
       restart: always
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=${DATABASE_URL}
         - JWT_SECRET=${JWT_SECRET}
         - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
         - PORT=3000
         - CORS_ORIGIN=${CORS_ORIGIN}
       depends_on:
         - db
     
     db:
       image: postgres:14
       restart: always
       environment:
         - POSTGRES_USER=${DB_USER}
         - POSTGRES_PASSWORD=${DB_PASSWORD}
         - POSTGRES_DB=${DB_NAME}
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```
   
   Start the services:
   ```bash
   docker-compose up -d
   ```

4. **Database migrations in Docker**:
   ```bash
   docker-compose exec api npx prisma migrate deploy
   ```

## Cloud Provider Deployments

### AWS Deployment

#### Elastic Beanstalk

1. **Install the EB CLI**:
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB in your project**:
   ```bash
   eb init
   ```

3. **Create an EB environment**:
   ```bash
   eb create production-environment
   ```

4. **Configure environment variables**:
   ```bash
   eb setenv DATABASE_URL=... JWT_SECRET=... # Add all your env vars
   ```

5. **Deploy the application**:
   ```bash
   eb deploy
   ```

#### ECS (with Docker)

1. **Create an ECR repository**:
   ```bash
   aws ecr create-repository --repository-name express-template-api
   ```

2. **Build, tag, and push your Docker image**:
   ```bash
   docker build -t express-template-api .
   docker tag express-template-api:latest AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/express-template-api:latest
   aws ecr get-login-password | docker login --username AWS --password-stdin AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com
   docker push AWS_ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/express-template-api:latest
   ```

3. **Create an ECS cluster** through the AWS console or CLI

4. **Define a task definition** with your container configuration

5. **Create a service** that runs your task

### Azure Deployment

#### App Service

1. **Login to Azure CLI**:
   ```bash
   az login
   ```

2. **Create a resource group**:
   ```bash
   az group create --name myResourceGroup --location eastus
   ```

3. **Create an App Service Plan**:
   ```bash
   az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku B1 --is-linux
   ```

4. **Create a web app**:
   ```bash
   az webapp create --name express-template-api --resource-group myResourceGroup --plan myAppServicePlan --runtime "NODE|16-lts"
   ```

5. **Configure environment variables**:
   ```bash
   az webapp config appsettings set --name express-template-api --resource-group myResourceGroup --settings DATABASE_URL="..." JWT_SECRET="..."
   ```

6. **Deploy your code**:
   ```bash
   az webapp deploy --name express-template-api --resource-group myResourceGroup --src-path ./dist.zip
   ```

### Google Cloud Platform

#### Google App Engine

1. **Install the Google Cloud SDK** and initialize:
   ```bash
   gcloud init
   ```

2. **Create an app.yaml file**:
   ```yaml
   runtime: nodejs16
   
   env_variables:
     NODE_ENV: "production"
     DATABASE_URL: "your_database_url"
     JWT_SECRET: "your_jwt_secret"
     # Add other environment variables
   ```

3. **Deploy to App Engine**:
   ```bash
   gcloud app deploy
   ```

#### Google Cloud Run (with Docker)

1. **Build and tag your Docker image**:
   ```bash
   docker build -t gcr.io/your-project-id/express-template-api .
   ```

2. **Push to Google Container Registry**:
   ```bash
   gcloud auth configure-docker
   docker push gcr.io/your-project-id/express-template-api
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy express-api --image gcr.io/your-project-id/express-template-api --platform managed --allow-unauthenticated
   ```

## Serverless Deployment

### AWS Lambda with Serverless Framework

1. **Install Serverless Framework**:
   ```bash
   npm install -g serverless
   ```

2. **Create a serverless.yml file**:
   ```yaml
   service: express-template-api
   
   provider:
     name: aws
     runtime: nodejs16.x
     region: us-east-1
     environment:
       NODE_ENV: production
       DATABASE_URL: ${env:DATABASE_URL}
       JWT_SECRET: ${env:JWT_SECRET}
       REFRESH_TOKEN_SECRET: ${env:REFRESH_TOKEN_SECRET}
   
   functions:
     app:
       handler: dist/lambda.handler
       events:
         - http:
             path: /
             method: ANY
         - http:
             path: /{proxy+}
             method: ANY
   ```

3. **Create a lambda.js file** to handle serverless invocation:
   ```javascript
   const serverless = require('serverless-http');
   const app = require('./dist/app');
   
   module.exports.handler = serverless(app);
   ```

4. **Deploy with Serverless**:
   ```bash
   serverless deploy
   ```

## CI/CD Pipeline Integration

### GitHub Actions Example

Create a `.github/workflows/deploy.yml` file:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to production
        uses: easingthemes/ssh-deploy@main
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-rlgoDzvc --delete"
          SOURCE: "dist/"
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: ${{ secrets.REMOTE_TARGET }}
          
      - name: Post-deploy commands
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.REMOTE_HOST }}
          username: ${{ secrets.REMOTE_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd ${{ secrets.REMOTE_TARGET }}
            npm ci --production
            pm2 restart express-api
```

## Post-Deployment Checks

After deploying, verify that:

1. **The API is accessible** at the expected URL:
   ```bash
   curl https://your-api-domain.com/api/v1/health
   ```

2. **Database migrations** have been applied:
   ```bash
   # Check via your database administration tool or
   npx prisma migrate status
   ```

3. **API endpoints are working** as expected:
   ```bash
   # Test authentication endpoint
   curl -X POST https://your-api-domain.com/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

4. **Logs are being captured** correctly:
   ```bash
   # For PM2
   pm2 logs express-api
   
   # For Docker
   docker logs container_id
   
   # For cloud providers, check their specific logging interfaces
   ```

## Monitoring and Maintenance

### Monitoring Tools

Consider setting up:

1. **Application monitoring** with tools like:
   - PM2 Plus
   - New Relic
   - Datadog
   - Prometheus + Grafana

2. **Error tracking** with:
   - Sentry
   - Rollbar

3. **Uptime monitoring** with:
   - UptimeRobot
   - Pingdom
   - AWS CloudWatch

### Database Management

1. **Regular backups**:
   ```bash
   # For PostgreSQL
   pg_dump -U username -d database_name > backup_file.sql
   ```

2. **Performance monitoring** with database-specific tools:
   - pgAdmin for PostgreSQL
   - MySQL Workbench for MySQL

### Updates and Maintenance

1. **Regular dependency updates**:
   ```bash
   npm outdated
   npm update
   ```

2. **Security updates**:
   ```bash
   npm audit
   npm audit fix
   ```

3. **Regular deployment checklist**:
   - Run tests before deploying
   - Check for security vulnerabilities
   - Apply database migrations
   - Verify application health after deployment
