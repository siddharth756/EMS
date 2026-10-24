# Employee Management System (EMS)

A full-stack modern Employee Management System built with React, Node.js, Express, and MongoDB.

## Features
- **Admin Dashboard**: Comprehensive company analytics, employee directory management, department management, leave approvals, salary slips, and company announcements/notices.
- **Employee Portal**: Personal profile management, daily attendance logging, leave request submission, salary slip viewing, and notices board.
- **Role-Based Access Control**: Admin and Employee permissions with secure JWT authentication.
- **Image Uploads**: Employee avatars and profile pictures.

---

## Project Structure
```
EMS/
├── client/          # Frontend React SPA (Vite, Tailwind CSS, React Router)
│   ├── src/
│   ├── vercel.json  # Vercel SPA routing rewrite configuration
│   └── package.json
├── server/          # Backend REST API (Node.js, Express, MongoDB Mongoose)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── package.json
└── README.md
```

---

## Deployment Guide

### 1. Backend on Render
1. Sign up or log in at [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `siddharth756/EMS`.
4. Configure the Web Service settings:
   - **Name**: `ems-backend` (or your preferred name)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URL`: `mongodb+srv://Siddharth:expert@my-first-cluster.xspfx.mongodb.net/EMS`
   - `PORT`: `5000`
   - `JWT_SECRET`: `my_jwt_secret`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` *(update once Vercel URL is generated)*
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Note down your backend URL: e.g. `https://ems-backend-xxxx.onrender.com`.
> **Important Note for MongoDB Atlas**:
> In [MongoDB Atlas](https://cloud.mongodb.com) -> **Network Access**, ensure IP `0.0.0.0/0` (Allow Access from Anywhere) is whitelisted so Render can connect to your database.

---

### 2. Frontend on Vercel
1. Sign up or log in at [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository: `siddharth756/EMS`.
4. In **Project Configuration**:
   - **Root Directory**: Click edit and select `client`.
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com` *(paste your actual Render backend URL without trailing slash)*
6. Click **Deploy**.
7. Copy the final Vercel URL (e.g., `https://ems-frontend.vercel.app`) and paste it as `CLIENT_URL` in your Render backend environment variables.

---

## Seed Accounts / Default Credentials
- **Admin Accounts**:
  - Email: `keyur@gmail.com` | Password: `123456`
  - Email: `siddharth@gmail.com` | Password: `admin`
- **Employee Account**:
  - Email: `parth@gmail.com` | Password: `123456`
