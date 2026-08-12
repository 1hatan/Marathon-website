# Infinity Run — Modern Marathon Website & Admin Panel

> **Tagline:** Every Step Creates a Better Tomorrow.

A full-stack, mobile-first, production-ready web platform for the **Infinity Run** marathon. Built with React.js, Vite, Tailwind CSS, Node.js, Express.js, and MySQL.

---

## 🌟 Key Features

### 🏃 Public Website
1. **Ultra-Minimal Home Hero**: Focused strictly on logo, tagline, short intro, and primary **REGISTER NOW** & **ABOUT EVENT** CTAs.
2. **Compact Summary Card**: Shows Event Date, Location, and Race Categories (3K, 5K, 10K, 21K).
3. **Consolidated About Page**: Comprehensive single-page hub for event details, reporting/flag-off times, race categories, runner benefits, kit collection expo, parking, and medical safety.
4. **Prizes Page**: Clean breakdown of overall cash purse and trophy awards.
5. **Dynamic Sponsors Showcase**: Categorized sponsor tiers (Title, Gold, Silver, Supporting Partners).
6. **Responsive Photo Gallery**: Mobile-friendly grid with interactive lightbox image viewer.
7. **Interactive FAQ Accordion**: Quick Q&A for runners.
8. **6-Step Registration System**: Stepper workflow with dynamic fee calculations, optional medical notes, and printable digital entry ticket (`INF-2026-XXXX`).

### 🛡️ Admin Panel (`/admin/login`)
- **JWT & bcrypt Protection**: Default credentials (`admin@infinityrun.com` / `admin123`).
- **Executive Analytics Dashboard**: Summary KPI cards and Recharts visualizations (Race category distributions, Gender breakdown, T-shirt matrix).
- **Participant Management**: Live table search, status filters, category filters, size filters, view/edit modals, and **Export to CSV**.
- **T-Shirt Inventory Matrix**: Automated size totals per category (XS to XXL).
- **CRUD Modules**: Race Categories, Sponsors, Gallery, FAQ, Event Settings.

---

## 🚀 Installation & Running

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
*The server runs on `http://localhost:5000` and automatically runs database initialization and default migrations.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend runs on `http://localhost:3000` with API proxy configured.*

---

## 🗄️ Database Structure

- `admins`: Admin login credentials
- `participants`: Runner registration details and status
- `race_categories`: Race distances, fees, and age limits
- `sponsors`: Active event sponsors and tiers
- `gallery`: Photos and captions
- `faq`: FAQ questions and answers
- `contact_messages`: Public contact queries
- `event_settings`: Global event date, venue, and reporting times
