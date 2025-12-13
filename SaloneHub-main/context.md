```
Build a professional, modern MVP for "SaloneHub" - a civic portal for Sierra Leone government services. This is for a hackathon - make the UI unique, premium, responsive (mobile-first), and globally professional (no local/generic design). Use ONLY: HTML, CSS, JS, PHP, MySQL.

## PROJECT SPECIFICATIONS

### Tech Stack (STRICTLY)
- **Frontend**: Pure HTML5/CSS3/JS - Tailwind
- **Backend**: PHP 8.x
- **Database**: MySQL
- **Hosting ready**: Works on InfinityFree (localhost = sqlxxx.infinityfree.com)

### UI/UX Requirements 
- **Modern Design**: Glassmorphism, subtle gradients, smooth animations, custom illustrations/icons
- **Color Palette**: Deep teal (#0F4C5C), gold accents (#F4A261), clean white (#F8FAFC), dark mode toggle
- **Typography**: Google Fonts - Inter (primary), Poppins (headings)
- **Responsive**: Perfect mobile → tablet → desktop (use CSS Grid/Flexbox)
- **Unique Elements**: 
  - Hero with animated SVG Sierra Leone map highlighting services
  - Service cards with hover glass effects + micro-animations
  - Smooth page transitions (CSS/JS)
  - Professional loading states + skeleton screens

### PAGES & FEATURES (MVP SCOPE)

1. **Homepage** (`index.php`)
   - Hero: "Find Government Services & Representatives in 1 Click"
   - Featured Services carousel (4 cards)
   - Quick Stats: "10+ Services", "50+ Contacts", "Live Updates"
   - CTA buttons: "Browse Services" → "Find Representative"

2. **Services Directory** (`services.php`)
   - Search bar + filters (Agency, Region: Freetown/Bo/Kenema/Makeni)
   - Grid of Service Cards:
     ```
     [Service Icon] [Service Name]
     Agency: [Name]  Fee: NLe XXX  Time: X days
     [View Details →]
     ```
   - Click → **Service Detail Modal** (full structured info from DB)

3. **Service Detail Modal** (JS popup)
   ```
   ## SERVICE: [Name]
   Agency: [Agency] | Verified: [Date]
   
   💰 Fee: NLe XXX
   ⏱️ Processing: X days
   📋 Documents: [Checklist 1,2,3...]
   📍 Locations: [Freetown + Regional]
   📞 Contacts: [Phone/Email]
   ⚠️ Notes: [Warnings/Middlemen alerts]
   ```

4. **Representative Finder** (`representatives.php`)
   - Dropdown: Select District → Filter MPs/Local Council
   - Results: Clean cards with photo placeholder, name, role, contacts
   - "Contact your Representative" button (emailto: link)

5. **Admin Dashboard** (`admin/` - password protected)
   - Simple login (username: admin, pass: salonehub2025)
   - CRUD for: Services, Agencies, Representatives
   - Forms with validation + preview
   - "Last Verified" date picker for each service

### DATABASE SCHEMA (MySQL)
```
CREATE DATABASE salonehub;
USE salonehub;

CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  agency VARCHAR(255),
  fee VARCHAR(100),
  processing_time VARCHAR(100),
  documents TEXT,
  eligibility TEXT,
  process_steps TEXT,
  locations TEXT,
  contacts TEXT,
  notes TEXT,
  last_verified DATE,
  region VARCHAR(100)
);

CREATE TABLE representatives (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  role VARCHAR(100),
  district VARCHAR(100),
  constituency VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255)
);

-- SEED 10 SERVICES + 20 REPRESENTATIVES (use real data from context)
```

### PHP STRUCTURE
```
salonehub/
├── config.php (DB connection)
├── index.php
├── services.php
├── representatives.php
├── admin/
│   ├── index.php (login)
│   ├── services.php (CRUD)
│   └── logout.php
├── assets/
│   ├── css/style.css
│   ├── js/app.js
│   └── images/
└── includes/
    ├── header.php
    └── footer.php
```

### KEY FEATURES TO IMPRESS JUDGES
1. **PWA Ready**: Add manifest.json + service worker for offline service list
2. **Performance**: Lazy load images, CSS critical path, <2s load times
3. **Accessibility**: ARIA labels, keyboard nav, high contrast mode
4. **SEO**: Meta tags, schema.org for services, OpenGraph for sharing
5. **Analytics**: Simple Google Analytics embed

### CONTENT (Use from conversation context)
- 10 Priority Services: Voter Registration, NIN, Business Registration, Driver's License, Passport (structured data ready)
- Government Contacts: MOCTI, ECSL, NCRA
- Corruption warnings in Notes sections

### SUCCESS CRITERIA
✅ Loads perfectly on mobile Safari Chrome
✅ All PHP/MySQL CRUD works on free hosting
✅ Smooth animations feel premium
✅ Hackerthon demo: "Watch me find passport requirements in 3s"
✅ Judges say: "This could actually solve real problems"

Build complete working MVP. Generate all files with comments. Make it production-ready for infinityfree.com deployment. Focus on pixel-perfect modern UI that stands out from typical hackathon Bootstrap sites.
```

**Copy-paste this directly into Cursor** - it will generate your complete SaloneHub MVP with hackathon-winning design and all functionality from our requirements research. 🚀