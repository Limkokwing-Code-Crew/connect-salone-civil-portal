# 🚀 SaloneHub React Frontend

**Hackathon-Winning React SPA** with PHP API backend

## 🏗️ Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: PHP API endpoints (RESTful JSON)
- **Database**: MySQL (unchanged)
- **Deployment**: React build → `backend/public/` → PHP hosting

## ⚙️ Prerequisites
- Node.js 18+ and npm
- XAMPP/WAMP with Apache and MySQL
- PHP 8+

## 📁 Project Structure

```
salonehub/
├── backend/              # PHP API
│   ├── api/
│   │   ├── services.php  # CRUD endpoints
│   │   ├── reps.php      # Representatives API
│   │   └── auth.php      # Authentication
│   ├── config.php        # Database config
│   └── public/           # React build output (after npm run build)
├── frontend/             # React App
│   ├── src/
│   │   ├── components/    # Navbar, etc.
│   │   ├── pages/        # Home, Services, Representatives, Admin
│   │   ├── api/          # API client functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── vite.config.js    # Vite configuration
└── seed.sql              # Database schema
```

## 🚀 Quick Start

### 1. Database Setup

**Start XAMPP/WAMP**:
- Ensure Apache and MySQL services are running
- Go to http://localhost/phpmyadmin

**Import Database**:
- Click "Import" tab in phpMyAdmin
- Choose `seed.sql` from project root
- Click "Go"

### 2. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

### 3. API Configuration

- Vite proxies `/api/*` to `http://localhost/salonehub/backend/api`
- No CORS issues in development
- Database credentials in `.env` file

## 🔧 Default Credentials

**Admin Dashboard**:
- Username: `admin`
- Password: `salonehub2025`

### Production Build

```bash
cd frontend
npm run build
```

Build output goes to `backend/public/` automatically (configured in `vite.config.js`)

## 🎨 Tech Stack

- **React 18**: Modern hooks, concurrent features
- **Vite**: Lightning-fast dev server + build
- **React Router**: Client-side routing (no page reloads)
- **TanStack Query**: Data fetching, caching, synchronization
- **Framer Motion**: 60fps animations
- **Tailwind CSS**: Utility-first CSS (glassmorphism)
- **Lucide React**: Beautiful icons

## 🌐 API Endpoints

### Services
- `GET /api/services.php?search=passport&agency=NCRA&region=Freetown`
- `POST /api/services.php` (admin only)
- `PUT /api/services.php?id=1` (admin only)
- `DELETE /api/services.php?id=1` (admin only)

### Representatives
- `GET /api/reps.php?district=Freetown`

### Authentication
- `POST /api/auth.php` - Login
- `GET /api/auth.php` - Check auth status
- `DELETE /api/auth.php` - Logout

## 🎯 Features

✅ **Instant Navigation**: React Router (no page reloads)
✅ **Real-Time Search**: Debounced, instant filtering
✅ **Smooth Animations**: Framer Motion (60fps)
✅ **Glassmorphism UI**: Premium Tailwind design
✅ **Mobile-First**: Perfect responsive (320px → desktop)
✅ **Admin Dashboard**: Full CRUD with React Query
✅ **API Caching**: Automatic data synchronization

## 📦 Deployment (InfinityFree)

1. **Build React App**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to Hosting**:
   - Upload entire `backend/` folder
   - Ensure `.htaccess` is uploaded
   - Import `seed.sql` via phpMyAdmin

3. **Configure**:
   - Update `backend/config.php` with hosting DB credentials
   - React app is served from `backend/public/`

## 🔥 Why React Wins Hackathons

- **SPA Experience**: No page reloads = premium feel
- **Modern Stack**: 2025 tech stack (not 2015 PHP templates)
- **Animations**: Framer Motion = buttery smooth
- **Developer Experience**: Hot reload, TypeScript support
- **Performance**: Code splitting, lazy loading built-in

## 🧪 Testing

```bash
# Development
cd frontend && npm run dev

# Production build test
cd frontend && npm run build
cd ../backend/public && php -S localhost:8000
```

## 🚨 Troubleshooting

**Database Connection Issues**:
- Check XAMPP MySQL service is running
- Verify database name in `.env` file
- Ensure MySQL user has permissions

**API 404 Errors**:
- Check Apache mod_rewrite is enabled
- Verify `.htaccess` file exists in backend/
- Check file permissions

**Frontend Build Issues**:
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall: `npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📝 Notes

- React app runs on `localhost:5173` in dev
- API runs on `localhost/salonehub/backend/api/`
- Vite proxy handles CORS in development
- Production: React build served from same domain as API

---

**Built for hackathon domination** 🏆

