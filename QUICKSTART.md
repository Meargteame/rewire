# 🚀 Quick Start Guide

Get Rewire running in 3 minutes.

## Step 1: Install Dependencies

```bash
# From the root directory
npm install

# Install frontend deps
cd frontend && npm install

# Install backend deps
cd ../backend && npm install
```

## Step 2: Start Both Servers

### Option A: Two Terminals (Recommended for development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Option B: Single Command (requires concurrently)

```bash
# From root directory
npm install concurrently
npm run dev
```

## Step 3: Open Your Browser

Navigate to: **http://localhost:3000**

## 🎯 Try It Out

1. Click "Get Started" button
2. Sign up with any email (e.g., `test@test.com`)
3. Complete your first 60-second challenge
4. Watch your streak counter in the nav bar!

## 🔧 Troubleshooting

### Port Already in Use
If port 3000 or 3001 is taken:

**Backend:**
```bash
PORT=3002 npm run dev
```

**Frontend:**
Update `vite.config.ts` proxy target to match backend port.

### CORS Errors
Make sure backend is running on port 3001 and frontend on 3000.

### Auth Not Working
1. Clear cookies in browser
2. Restart backend server
3. Try signup again

## 📝 Test Accounts

Since this is in-memory, create your own:
- Email: anything@example.com
- Password: minimum 6 characters
- Name: your name

## 🎨 What to Try

1. **Complete a challenge** - Click "Start Challenge" and watch the timer
2. **Build a streak** - Complete challenges on consecutive days
3. **Try different categories** - Refresh to get new challenges
4. **Check your stats** - See your name and streak in the nav bar

## 🚧 Known Limitations (MVP)

- Data stored in memory (resets on server restart)
- No password reset
- No email verification
- No profile page yet
- No challenge history view yet

These are coming in the next iteration!

## 🆘 Need Help?

Check the main README.md for full documentation.
