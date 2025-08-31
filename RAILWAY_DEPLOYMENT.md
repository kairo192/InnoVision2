# Railway Deployment Guide

## 🚀 InnoVision School - Railway Deployment

This application has been successfully configured for Railway deployment with enterprise-grade security and professional animations.

### ⚙️ Environment Variables Required

Set these in your Railway project settings:

```bash
# Database (Required)
DATABASE_URL=your_neon_postgresql_url

# Session Security (Required - Generate a strong 32+ character secret)
SESSION_SECRET=your_super_secure_session_secret_here

# Email Configuration (Required for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASS=your_app_password
EMAIL_PASSWORD=your_app_password
ADMIN_EMAIL=admin@yourdomain.com

# Production Settings
NODE_ENV=production
PORT=8080

# Security Settings (Optional - defaults provided)
MAX_REQUESTS_PER_WINDOW=100
RATE_LIMIT_WINDOW_MS=900000
SESSION_MAX_AGE=86400000

# Domain Configuration
PRODUCTION_DOMAIN=https://your-railway-domain.railway.app
```

### 🔧 Deployment Steps

1. **Push to Repository**: Your code is ready for deployment
2. **Connect to Railway**: Link your GitHub repository to Railway
3. **Set Environment Variables**: Add all required variables in Railway dashboard
4. **Deploy**: Railway will automatically build and deploy your application

### 🛡️ Security Features Enabled

✅ **Rate Limiting**: 100 requests per 15 minutes globally  
✅ **Session Security**: Secure cookies with rolling sessions  
✅ **Security Headers**: HSTS, CSP, XSS protection  
✅ **Input Validation**: Comprehensive form validation  
✅ **Login Protection**: Failed login tracking and blocking  
✅ **Environment Validation**: Runtime security checks  

### 🎨 Enhanced Features

✅ **Professional Dashboard**: Beautiful animations with Framer Motion  
✅ **Modern UI**: Glass morphism effects and responsive design  
✅ **Interactive Elements**: Smooth transitions and micro-interactions  
✅ **Loading States**: Sophisticated shimmer effects  
✅ **Chart Visualizations**: Enhanced data display with gradients  

### 📊 Application URLs

- **Landing Page**: `https://your-domain.railway.app/`
- **Admin Dashboard**: `https://your-domain.railway.app/admin`
- **Admin Login**: `https://your-domain.railway.app/admin/login`

### 🔍 Health Checks

The application includes:
- Automatic health check endpoint at `/`
- Database connection validation
- Environment variable verification
- Security configuration checks

### 📝 Post-Deployment Tasks

1. **Create Admin User**: Use the admin creation script
2. **Test Email Service**: Verify SMTP configuration
3. **Database Setup**: Ensure schema is properly pushed
4. **Security Verification**: Run production verification checks

### 🆘 Troubleshooting

If deployment fails:
1. Check environment variables are set correctly
2. Verify DATABASE_URL connection
3. Ensure SESSION_SECRET is not using template value
4. Check Railway build logs for specific errors

Your application is production-ready with enterprise security and stunning animations! 🎉