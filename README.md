# 🏃 Infinity Run — Marathon Website & Admin Panel

> **Tagline:** *Every Step Creates a Better Tomorrow.*

![Infinity Run Marathon Banner](https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1200&auto=format&fit=crop)

A full-stack, responsive, high-performance marathon web application built with **React, Vite, Tailwind CSS, Node.js, Express.js, and MongoDB Atlas**.

---

## 📋 Table of Contents

- [✨ Features & Modules](#-features--modules)
- [🛠 Tech Stack](#-tech-stack)
- [⚡ Quick Start & Installation](#-quick-start--installation)
- [📡 API Endpoints Overview](#-api-endpoints-overview)
- [🗄 Database Architecture (MongoDB Atlas)](#-database-architecture-mongodb-atlas)
- [🛡 Environment Variables](#-environment-variables)
- [🚀 Production Deployment Guide](#-production-deployment-guide)
- [📸 Screenshots & Walkthrough](#-screenshots--walkthrough)

---

## ✨ Features & Modules

### 🏃 Public Website
1. **Ultra-Modern Home Page**: Hero section, event countdown, quick stats, key highlight cards, and instant registration call-to-action.
2. **Comprehensive About Page**: Single-page hub detailing event schedule, venue, flag-off times (21K, 10K, 5K, 3K), runner benefits, kit expo info, parking, and medical safety.
3. **Race Events Breakdown**: Interactive card grid displaying distance options, entry fees, age limits, and route details.
4. **Prizes & Awards**: Complete breakdown of overall cash purse and trophy awards across all race categories.
5. **Interactive Gallery**: Responsive image grid with lightbox modal viewer for high-res event photos.
6. **FAQ Accordion**: Categorized collapsible Q&A section with instant search capabilities.
7. **Contact & Query Form**: Contact details, Google Map location, and interactive message form with instant validation.
8. **Participant Registration System**:
   - Real-time form validation (Name, 10-digit Mobile, Email, Age, Blood Group, Emergency Contact, T-Shirt size).
   - Instant ticket pass generation with printable entry pass (`INF-2026-XXXX`).
9. **Dedicated 404 Page**: Custom, user-friendly 404 page for non-existent routes with quick navigation back to key pages.

### 🛡️ Admin Control Panel (`/admin/login`)
- **Secure Authentication**: JWT token authentication with bcrypt password hashing. Default login: `admin@infinityrun.com` / `admin123`.
- **Executive Analytics Dashboard**: Key metrics summary cards, real-time participant counts, revenue totals, and Recharts charts (Category breakdown, Gender ratio, T-shirt matrix).
- **Participant Management**: Search by name/ID/phone, filter by race category or payment status, view detailed info, and **Export to CSV**.
- **T-Shirt Inventory Tracker**: Automated size tally per category (S, M, L, XL, XXL).
- **Content Management Systems (CMS)**: CRUD interfaces for Race Categories, Sponsors, Gallery Photos, FAQs, and Global Event Settings.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, GSAP |
| **Backend API** | Node.js, Express.js, CORS |
| **Database** | MongoDB Atlas, Mongoose ORM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |
| **Deployment** | Render (Unified Node Service) / Vercel (Static + Serverless Functions) |

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas connection string (or local MongoDB)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/1hatan/Marathon-website.git
cd Marathon-website
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5050
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/infinity_run?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
ADMIN_DEFAULT_EMAIL=admin@infinityrun.com
ADMIN_DEFAULT_PASS=admin123
FRONTEND_URL=http://localhost:3000
```

### 3. Run Development Servers

**Run Backend API:**
```bash
cd backend
npm run dev
# Running on http://localhost:5050
```

**Run Frontend UI:**
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | API & MongoDB connection status check | Public |
| `POST` | `/api/auth/login` | Admin login & token generation | Public |
| `GET` | `/api/auth/me` | Verify current admin token | Protected |
| `GET` | `/api/races` | List active race categories | Public |
| `POST` | `/api/participants` | Register a new marathon runner | Public |
| `GET` | `/api/participants` | Fetch participants list with filters | Protected |
| `GET` | `/api/dashboard/stats` | Executive KPI analytics data | Protected |
| `POST` | `/api/contact` | Submit runner contact message | Public |
| `GET` | `/api/sponsors` | Get sponsors list | Public |
| `GET` | `/api/gallery` | Get gallery images | Public |
| `GET` | `/api/faq` | Get FAQ list | Public |

---

## 🗄 Database Architecture (MongoDB Atlas)

- **`participants`**: Stores runner profile, registration ID (`INF-2026-XXXX`), race category, T-shirt size, emergency contact, and status.
- **`racecategories`**: Race distances (3K, 5K, 10K, 21K), fees, descriptions, age limits.
- **`sponsors`**: Partner names, tiers (Title, Gold, Silver), logos, website links.
- **`galleryitems`**: Photo titles, categories, cloud image URLs.
- **`faqs`**: Questions, answers, categories, display order.
- **`contactmessages`**: Public contact form inquiries & status.
- **`eventsettings`**: Global event name, date, venue, reporting time, flag-off times, contact info.
- **`admins`**: Secured admin user accounts with hashed passwords.

---

## 🚀 Production Deployment Guide

### Deployment Option 1: Unified Render Deployment (Recommended)
1. Push repository to GitHub.
2. Create a **Web Service** on [Render](https://render.com).
3. Connect your GitHub repository.
4. Set **Build Command**: `npm run render-build`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<Random secret string>`
   - `ADMIN_DEFAULT_EMAIL`: `admin@infinityrun.com`
   - `ADMIN_DEFAULT_PASS`: `<Your admin password>`

### Deployment Option 2: Vercel + Backend Host
- The repository includes [`vercel.json`](file:///c:/Users/gayat/OneDrive/Desktop/Projects/Marathon%20Website%20-%20Copy/vercel.json) and [`api/index.js`](file:///c:/Users/gayat/OneDrive/Desktop/Projects/Marathon%20Website%20-%20Copy/api/index.js) ready for Vercel deployment.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
