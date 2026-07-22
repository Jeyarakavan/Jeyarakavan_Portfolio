# Jeyarakavan Portfolio - Deployment & Admin Setup Guide

## 1. Frontend Deployment (Vercel)
- Connect this repository to **Vercel**.
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: `Vite`

## 2. Cloud Database Setup (Neon PostgreSQL / PlanetScale / MySQL)
- Create a free cloud database on **[Neon.tech](https://neon.tech)** (PostgreSQL) or **PlanetScale / Aiven**.
- Execute the SQL script inside `public/admin/schema.sql` on your cloud database to set up tables.

## 3. Admin Backend Deployment (Railway / Render / Any PHP Host)
- Host the `admin/` PHP folder on **[Railway.app](https://railway.app)**, **Render**, or any PHP web hosting provider (cPanel, Hostinger, etc.).
- Set environment variables on your PHP server:
  - `DB_DRIVER` = `pgsql` (or `mysql`)
  - `DB_HOST` = `<your-cloud-db-host>`
  - `DB_PORT` = `5432`
  - `DB_NAME` = `<your-db-name>`
  - `DB_USER` = `<your-db-user>`
  - `DB_PASS` = `<your-db-password>`
  - `ADMIN_PASSWORD_HASH` = (optional hash for custom admin password)

## 4. Vercel Environment Variable
- On Vercel, set `VITE_API_BASE` to your hosted PHP API URL (e.g. `https://portfolio-backend.up.railway.app/admin`).

## 5. Contact Form Email Forwarding
- Messages submitted through the contact form are stored in the Admin Inbox (`/admin/dashboard.php?tab=messages`).
- PHP automatically forwards copy to **jeyagandan74@gmail.com**.
