# 🚀 InnoVision School - Deployment Guide

This guide will help you deploy the InnoVision School application to various free hosting platforms with enterprise-grade security.

## 📋 Pre-deployment Security Checklist

### 1. Environment Variables Setup
Use the `.env.production.template` file to create your production environment:

```bash
# Copy the template
cp .env.production.template .env.production

# Edit with your production values
# CRITICAL: Change SESSION_SECRET from default!
```

**Required Variables:**
```bash
DATABASE_URL=your_neon_database_url_here
SESSION_SECRET=your_32_character_secret_key
NODE_ENV=production
PRODUCTION_DOMAIN=https://yourdomain.com

# Optional but recommended for email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin@yourdomain.com
```

### 2. Security Validation
```bash
# Run comprehensive security check
npm run verify-production

# Secure build with all checks
npm run secure-build

# Final deployment check
npm run deploy-check
```

### 3. Generate Strong Session Secret
```bash
# Generate cryptographically secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Setup
1. Create a free Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy the connection string to `DATABASE_URL`
3. Run database migration: `npm run db:push`
4. Create admin user: `npm run create-admin`

## 🌐 Free Hosting Platforms

### Option 1: Railway (Recommended)

Railway provides excellent PostgreSQL integration and automatic deployments.

**Steps:**
1. Fork this repository to your GitHub
2. Visit [railway.app](https://railway.app) and sign up
3. Click "Deploy from GitHub repo" and select your fork
4. Add environment variables in Railway dashboard
5. Deploy automatically

**Environment Variables in Railway:**
```
NODE_ENV=production
DATABASE_URL=your_neon_database_url
SESSION_SECRET=your_generated_secret
```

### Option 2: Render

**Steps:**
1. Visit [render.com](https://render.com) and sign up
2. Create new "Web Service" from your GitHub repo
3. Configure build settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Node Version:** 18 or higher
4. Add environment variables in Render dashboard

### Option 3: Vercel (with external database)

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Add environment variables via Vercel dashboard
4. Configure in `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

### Option 4: Heroku

**Steps:**
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add environment variables: `heroku config:set NODE_ENV=production`
4. Deploy: `git push heroku main`

## 🔧 Build and Deploy Commands

### Local Testing
```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run create-admin

# Development server
npm run dev

# Production build and test
npm run build
npm run start
```

### Production Deploy
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Enhanced Security Features

### Built-in Security Measures:
- **✅ Rate Limiting**: Multiple tiers (enrollment, admin, PDF, login)
- **✅ Brute Force Protection**: Failed login tracking and temporary blocking  
- **✅ Security Headers**: HSTS, CSP, XSS protection, frame options
- **✅ Input Validation**: Zod schema validation and sanitization
- **✅ Session Security**: Secure cookies, session regeneration, rolling sessions
- **✅ CORS Protection**: Domain-restricted in production
- **✅ SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **✅ File Security**: PDF generation with validation
- **✅ Environment Validation**: Runtime checks for required variables

### Production Security Updates:

1. **Update Production Domain** in your environment:
```bash
PRODUCTION_DOMAIN=https://yourdomain.com
```

2. **Configure Strong Session Settings**:
   - Session cookies are automatically secure in production
   - HTTPS is enforced with HSTS headers
   - Sessions expire after 24 hours with rolling renewal

3. **Rate Limiting Configuration**:
   - Enrollment: 5 requests per 15 minutes
   - Admin endpoints: 20 requests per 15 minutes
   - Login attempts: Progressive blocking (3-5 failed attempts)
   - PDF downloads: 10 requests per 5 minutes

### Security Validation Commands:
```bash
# Comprehensive security check
npm run verify-production

# Full security build
npm run secure-build

# Pre-deployment validation
npm run deploy-check
```

## 📊 Performance Optimization

The app includes:
- ✅ Minified production builds
- ✅ Compressed assets
- ✅ Rate limiting
- ✅ Security headers
- ✅ Database connection pooling
- ✅ Optimized images

## 🔍 Monitoring and Logs

### Health Check Endpoint
The app responds to health checks at: `GET /api/health`

### Logging
Production logs are available through your hosting platform's dashboard.

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Verify DATABASE_URL is correct
   - Check Neon database is active
   - Run `npm run db:push` to create tables

2. **Session Errors:**
   - Ensure SESSION_SECRET is set
   - Check cookie settings for HTTPS

3. **Build Failures:**
   - Verify Node.js version (18+)
   - Clear node_modules and reinstall
   - Check environment variables

4. **Admin Login Issues:**
   - Run `npm run create-admin` to create admin user
   - Check database connection
   - Verify bcrypt is working properly

## 📞 Support

For deployment issues, check:
1. Platform-specific documentation
2. Application logs
3. Database connectivity
4. Environment variable configuration

---

**Ready to deploy? Choose your platform and follow the steps above!** 🎉