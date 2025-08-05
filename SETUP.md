# FitPlan Setup Guide

## Resolving EADDRINUSE Error

The "EADDRINUSE" error occurs when port 5000 is already in use. Here are several solutions:

### Solution 1: Kill existing processes using port 5000

**On Windows (PowerShell):**
```powershell
# Find processes using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**On macOS/Linux:**
```bash
# Find and kill processes using port 5000
lsof -ti:5000 | xargs kill -9
# OR
fuser -k 5000/tcp
```

### Solution 2: Use a different port

The server has been configured to use port 5001 by default. You can also set a custom port:

```bash
# Set custom port
export PORT=3000
npm run dev
```

Or create/modify `.env` file:
```
PORT=3000
```

## Database Setup

This application requires a PostgreSQL database (Neon). Follow these steps:

### 1. Create a Neon Database

1. Go to [https://console.neon.tech/](https://console.neon.tech/)
2. Sign up/Login
3. Create a new project
4. Copy the connection string

### 2. Configure Environment Variables

Update the `.env` file with your database URL:

```env
# FitPlan Environment Configuration
PORT=5001
SESSION_SECRET=fitplan-dev-secret-key-2024

# Database Configuration
DATABASE_URL=postgresql://username:password@hostname:5432/database_name
```

### 3. Push Database Schema

After setting up the database URL, run:

```bash
npm run db:push
```

### 4. Start the Development Server

```bash
npm install
npm run dev
```

## Troubleshooting

### Common Issues:

1. **Port already in use**: Follow Solution 1 or 2 above
2. **DATABASE_URL not set**: Follow Database Setup steps
3. **Dependencies not installed**: Run `npm install`
4. **Permission errors**: Try running with elevated privileges

### Development URLs:

- Frontend: http://localhost:5001
- API: http://localhost:5001/api

## Alternative: Local PostgreSQL Setup

If you prefer to use a local PostgreSQL database:

1. Install PostgreSQL locally
2. Create a database named `fitplan`
3. Update DATABASE_URL in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/fitplan
   ```
4. Run `npm run db:push`