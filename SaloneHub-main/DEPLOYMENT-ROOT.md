# 🚀 SaloneHub Root-Level Deployment Guide

## 📁 Project Structure (Root-Level Hosting)

```
salonehub/
├── index.php              ⭐ Main entry point (serves React SPA)
├── .htaccess              ⭐ Apache routing configuration
├── dist/                  ⭐ React build output
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   └── index-*.js
│   └── vite.svg
├── backend/               ⭐ PHP Backend API
│   ├── config.php
│   ├── api/
│   │   ├── auth.php
│   │   ├── services.php
│   │   └── reps.php
│   └── admin/
└── seed.sql               ⭐ Database schema + data
```

## 🎯 How It Works

### index.php - Main Router
```php
// Handles all incoming requests:
// 1. /backend/* → Pass to PHP backend
// 2. /assets/* → Serve static files
// 3. Everything else → Serve React SPA (dist/index.html)
```

### .htaccess - Apache Configuration
```apache
# Enables React Router + PHP Backend
# - Routes /backend/* to PHP
# - Routes /assets/* to static files  
# - Routes everything else to index.php
# - Security headers + compression
```

## 🚀 Deployment Steps

### 1. Build React App
```bash
cd frontend
npm run build
# → Outputs to ../dist/
```

### 2. Upload Files
Upload these folders to your web root:
- ✅ `index.php`
- ✅ `.htaccess`
- ✅ `dist/` (React build)
- ✅ `backend/` (PHP API)
- ✅ `seed.sql` (Database)

### 3. Configure Database
```php
// Edit backend/config.php
$db_host = 'localhost';          // Your database host
$db_name = 'salonehub';          // Your database name
$db_user = 'your_username';      // Your database user
$db_pass = 'your_password';      // Your database password
```

### 4. Import Database
```sql
-- Via phpMyAdmin or MySQL CLI:
CREATE DATABASE salonehub;
USE salonehub;
SOURCE seed.sql;
```

### 5. Test URLs
```bash
# React App (Root)
http://yourdomain.com/

# Backend APIs
http://yourdomain.com/backend/api/services.php
http://yourdomain.com/backend/api/reps.php

# Admin Panel
http://yourdomain.com/backend/admin/
```

## 🌐 URL Structure

| URL | Purpose | Handler |
|-----|---------|---------|
| `/` | React App (Home) | index.php → dist/index.html |
| `/services` | React App (Services) | index.php → React Router |
| `/representatives` | React App (Representatives) | index.php → React Router |
| `/admin` | React App (Admin) | index.php → React Router |
| `/backend/api/services.php` | PHP API | backend/api/services.php |
| `/backend/api/reps.php` | PHP API | backend/api/reps.php |
| `/assets/*` | Static Files | dist/assets/* |

## 🔧 InfinityFree Deployment

### Step 1: Upload Files
```bash
# Upload to InfinityFree via FTP or File Manager:
- index.php
- .htaccess  
- dist/ (entire folder)
- backend/ (entire folder)
```

### Step 2: Update Database Config
```php
// backend/config.php
$db_host = 'sqlXXX.infinityfree.com';  // Your InfinityFree MySQL host
$db_name = 'epizXXX_salonehub';        // Your database name
$db_user = 'epizXXX_admin';            // Your database user
$db_pass = 'your_password';            // Your database password
```

### Step 3: Create Database
1. Login to InfinityFree control panel
2. Go to MySQL Database
3. Create database `salonehub`
4. Import `seed.sql` via phpMyAdmin

### Step 4: Test
```bash
# Your InfinityFree domain:
https://yourdomain.infinityfreeapp.com/

# Should show React app with full functionality
```

## ✅ Verification Checklist

### Local Testing
- [ ] `cd frontend && npm run build` → No errors
- [ ] `http://localhost/salonehub/` → React app loads
- [ ] `http://localhost/salonehub/services` → Services page
- [ ] `http://localhost/salonehub/backend/api/services.php` → JSON response
- [ ] Search "passport" → Results appear
- [ ] Click service → Modal opens
- [ ] Footer visible on all pages

### Production Testing
- [ ] All files uploaded
- [ ] Database imported
- [ ] Configuration updated
- [ ] Domain loads React app
- [ ] API endpoints work
- [ ] Search and filters work
- [ ] Mobile responsive

## 🔍 Troubleshooting

### 404 Errors
```apache
# Ensure .htaccess is uploaded and readable
# Check Apache allows .htaccess overrides:
# AllowOverride All
```

### API Not Working
```php
# Check backend/config.php credentials
# Test API directly:
http://yourdomain.com/backend/api/services.php
```

### React App Not Loading
```php
# Check index.php can read dist/index.html
# Verify asset paths are correct
# Check browser console for errors
```

### Database Connection
```php
# Test database connection:
php backend/config.php
# Should not output errors
```

## 📱 Testing Different Environments

### Local Development (XAMPP)
```bash
# URL: http://localhost/salonehub/
# Build: cd frontend && npm run build
# Database: MySQL via phpMyAdmin
```

### Production (InfinityFree)
```bash
# URL: https://yourdomain.infinityfreeapp.com/
# Build: Same as local
# Database: InfinityFree MySQL panel
```

### Custom Domain
```bash
# URL: https://yourdomain.com/
# Build: Same as local
# Database: Your hosting provider's MySQL
```

## 🎯 Benefits of This Structure

1. **Single Domain**: Both React and PHP on same domain
2. **SEO Friendly**: Server-side routing with proper URLs
3. **API Security**: Backend isolated from public access
4. **Static Assets**: Efficient caching and compression
5. **Mobile Ready**: Perfect responsive design
6. **Easy Deployment**: Upload and configure database

## 📊 Performance Optimizations

### .htaccess Includes:
- ✅ **Gzip Compression**: Reduces file sizes
- ✅ **Browser Caching**: 1-year cache for static assets
- ✅ **Security Headers**: X-Content-Type, X-Frame-Options
- ✅ **CORS Headers**: For API requests
- ✅ **URL Rewriting**: Clean URLs for React Router

### React Build Optimizations:
- ✅ **Code Splitting**: Separate JS and CSS bundles
- ✅ **Minification**: All files compressed
- ✅ **Tree Shaking**: Unused code removed
- ✅ **Asset Optimization**: Images and fonts optimized

---

## 🎉 Ready for Production!

This root-level structure provides:
- **Professional URL structure** (no subdirectories)
- **SEO-optimized routing** 
- **Secure API separation**
- **High performance**
- **Easy deployment**

**Perfect for InfinityFree, Vercel, Netlify, or any PHP hosting!**

---

**Built with ❤️ for Sierra Leone citizens**