# 🧪 Rewire Testing Guide

## Quick Start Testing

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
✅ Should see: `✨ Rewire API running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
✅ Should see: `Local: http://localhost:3000`

### 2. Open Browser
Visit: `http://localhost:3000`

---

## Manual Testing Checklist

### ✅ Authentication Flow
1. **Landing Page**
   - [ ] Click "Get Started" button
   - [ ] Auth modal opens with signup form
   - [ ] Enter name, email, password
   - [ ] Click "Sign Up"
   - [ ] Redirects to `/dashboard`

2. **Login**
   - [ ] Logout from dashboard
   - [ ] Click "Get Started" again
   - [ ] Switch to "Log in" tab
   - [ ] Enter credentials
   - [ ] Successfully logs in

3. **Session Persistence**
   - [ ] Refresh page while logged in
   - [ ] Still logged in (cookie works)
   - [ ] Close browser and reopen
   - [ ] Still logged in (7-day expiry)

---

### ✅ Dashboard Page
1. **Initial Load**
   - [ ] Streak card shows current streak
   - [ ] Stat cards display correctly
   - [ ] Today's challenge loads
   - [ ] Activity calendar renders

2. **Complete Challenge**
   - [ ] Click "Start Challenge" button
   - [ ] Timer counts down from 60s
   - [ ] Click "Complete" button
   - [ ] Confetti animation plays
   - [ ] Stats update (total challenges +1)
   - [ ] "Completed today" counter increases
   - [ ] Weekly progress updates
   - [ ] Activity calendar adds today's date

3. **Refresh Challenge**
   - [ ] Click "Skip" button
   - [ ] New random challenge loads
   - [ ] Different from previous

4. **Achievements**
   - [ ] Complete 7 challenges
   - [ ] "Week Warrior" badge appears
   - [ ] Complete 10 challenges
   - [ ] "Getting Started" badge appears

---

### ✅ Challenges Page
1. **Browse All**
   - [ ] Navigate to Challenges from sidebar
   - [ ] All 24 challenges display
   - [ ] Grid layout works

2. **Search**
   - [ ] Type "sketch" in search
   - [ ] Only sketching challenges show
   - [ ] Clear search shows all again

3. **Filter**
   - [ ] Select "mindfulness" category
   - [ ] Only mindfulness challenges show
   - [ ] Select "All" shows everything

4. **Empty State**
   - [ ] Search for "xyz123"
   - [ ] Empty state message appears
   - [ ] "No challenges found" text

---

### ✅ Progress Page
1. **Stats Cards**
   - [ ] Current streak displays
   - [ ] Total completed shows
   - [ ] Personal best shows
   - [ ] Time invested calculates

2. **Category Breakdown**
   - [ ] Chart shows completed categories
   - [ ] Progress bars animate
   - [ ] Percentages calculate correctly

3. **History Timeline**
   - [ ] Recent challenges listed
   - [ ] Dates and times show
   - [ ] Category badges color-coded
   - [ ] Sorted by most recent first

4. **Empty State**
   - [ ] New user sees "No challenges completed yet"
   - [ ] Message encourages first challenge

---

### ✅ Settings Page
1. **Profile Tab**
   - [ ] Name field pre-filled
   - [ ] Email field pre-filled
   - [ ] Edit name and save
   - [ ] Success message appears

2. **Password Tab**
   - [ ] Enter current password
   - [ ] Enter new password
   - [ ] Confirm new password
   - [ ] Validation works (6+ chars)
   - [ ] Error shows if passwords don't match

3. **Preferences Tab**
   - [ ] Daily goal slider works (1-10)
   - [ ] Notification toggle works
   - [ ] Save preferences
   - [ ] Success message appears

---

### ✅ Navigation
1. **Sidebar**
   - [ ] Dashboard link works
   - [ ] Challenges link works
   - [ ] Progress link works
   - [ ] Settings link works
   - [ ] Active route highlights
   - [ ] Logout button works

2. **Mobile Menu**
   - [ ] Resize to mobile width
   - [ ] Hamburger icon appears
   - [ ] Click opens sidebar
   - [ ] Overlay appears
   - [ ] Click overlay closes menu
   - [ ] Click nav link closes menu

---

### ✅ Responsive Design
1. **Desktop (> 1024px)**
   - [ ] Sidebar always visible
   - [ ] 3-column grid on dashboard
   - [ ] All content readable

2. **Tablet (768px - 1024px)**
   - [ ] Sidebar always visible
   - [ ] 2-column grid on dashboard
   - [ ] Cards stack properly

3. **Mobile (< 768px)**
   - [ ] Hamburger menu works
   - [ ] Single column layout
   - [ ] Text sizes readable
   - [ ] Buttons touch-friendly
   - [ ] No horizontal scroll

---

### ✅ Error Handling
1. **Network Errors**
   - [ ] Stop backend server
   - [ ] Try to complete challenge
   - [ ] Error logged to console
   - [ ] App doesn't crash

2. **Error Boundary**
   - [ ] Throw error in component (dev mode)
   - [ ] Error boundary catches it
   - [ ] Shows error UI
   - [ ] Refresh button works

3. **Loading States**
   - [ ] Dashboard shows spinner on load
   - [ ] Challenges page shows spinner
   - [ ] Progress page shows spinner
   - [ ] Challenge card shows loading

---

## API Testing with curl

### Health Check
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok"}
```

### Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \
  -c cookies.txt
# Expected: {"success":true,"user":{...},"token":"..."}
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
# Expected: {"success":true,"user":{...},"token":"..."}
```

### Get Current User
```bash
curl http://localhost:3001/api/auth/me -b cookies.txt
# Expected: {"success":true,"user":{...}}
```

### Get Random Challenge
```bash
curl http://localhost:3001/api/challenge
# Expected: {"success":true,"challenge":{...}}
```

### Get All Challenges
```bash
curl http://localhost:3001/api/challenges/all
# Expected: {"success":true,"challenges":[...]} (24 items)
```

### Complete Challenge
```bash
curl -X POST http://localhost:3001/api/challenge/complete \
  -H "Content-Type: application/json" \
  -d '{"challengeTitle":"Sketch your morning coffee","category":"creative sketching","durationSeconds":60}' \
  -b cookies.txt
# Expected: {"success":true,"user":{...}}
```

### Get History
```bash
curl http://localhost:3001/api/history -b cookies.txt
# Expected: {"success":true,"history":[...]}
```

### Get Stats
```bash
curl http://localhost:3001/api/stats -b cookies.txt
# Expected: {"success":true,"stats":{...}}
```

---

## Troubleshooting

### Auth Modal Not Opening
1. **Check frontend is running** - Terminal 2 should show Vite output
2. **Check browser console** - F12 → Console tab for errors
3. **Hard refresh** - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. **Check Network tab** - Should see `/api/auth/me` request

### Backend Not Responding
1. **Check backend is running** - Terminal 1 should show "Rewire API running"
2. **Test health endpoint** - `curl http://localhost:3001/api/health`
3. **Check port conflict** - `lsof -i :3001` (kill if needed)

### Streak Not Updating
1. **Check backend logs** - Should see POST to `/api/challenge/complete`
2. **Check response** - Network tab should show 200 status
3. **Refresh user data** - Dashboard should call `/api/auth/me` after completion

### Activity Calendar Not Showing Dates
1. **Complete at least one challenge**
2. **Check `/api/history` returns data** - Use curl command above
3. **Refresh dashboard** - Should fetch history on mount

### Mobile Menu Not Working
1. **Resize browser** - Must be < 768px width
2. **Check hamburger icon appears** - Top left corner
3. **Click icon** - Sidebar should slide in from left
4. **Check overlay** - Dark overlay should appear behind sidebar

---

## Performance Testing

### Page Load Times
```bash
# Use Chrome DevTools → Network tab
# Disable cache, reload page
# Check "Load" time at bottom
# Should be < 2 seconds
```

### API Response Times
```bash
# Use curl with timing
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/challenge

# Create curl-format.txt:
echo "time_total: %{time_total}s\n" > curl-format.txt
# Should be < 0.2 seconds
```

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Security Testing

1. **XSS Protection**
   - [ ] Try `<script>alert('xss')</script>` in name field
   - [ ] Should be escaped/sanitized

2. **CSRF Protection**
   - [ ] Check cookies are httpOnly
   - [ ] Check sameSite=lax

3. **Password Strength**
   - [ ] Try password < 6 chars
   - [ ] Should show error

4. **Session Expiry**
   - [ ] Wait 7 days (or change JWT expiry to 1 min for testing)
   - [ ] Should require re-login

---

## Known Issues (MVP)

1. **Data persistence** - In-memory DB, data lost on server restart
2. **Settings API** - Profile/password updates not connected to backend
3. **No email verification** - Can signup with any email
4. **No password reset** - Can't recover forgotten password
5. **No rate limiting** - API can be spammed
6. **No data validation** - Minimal input sanitization

---

## Next Steps

After manual testing passes:
1. **Write unit tests** - Jest for auth functions, DB methods
2. **Write integration tests** - Supertest for API endpoints
3. **Write E2E tests** - Playwright for full user flows
4. **Set up CI/CD** - GitHub Actions for automated testing
5. **Deploy to staging** - Test in production-like environment
6. **Load testing** - Apache Bench or k6
7. **Security audit** - OWASP Top 10 checklist

---

## Test Data

Use these test accounts:

| Email | Password | Name | Purpose |
|-------|----------|------|---------|
| test@test.com | password123 | Test User | Basic testing |
| streak@test.com | password123 | Streak Tester | Streak testing |
| admin@test.com | password123 | Admin User | Admin features |

---

## Success Criteria

✅ All manual tests pass
✅ No console errors
✅ No TypeScript errors
✅ Responsive on all screen sizes
✅ Works in all major browsers
✅ API responds < 200ms
✅ Page loads < 2s
✅ No memory leaks after 10 min use

---

## Report Issues

If you find bugs:
1. Check browser console for errors
2. Check backend terminal for errors
3. Note steps to reproduce
4. Note expected vs actual behavior
5. Include screenshots if UI issue
6. Create GitHub issue with details
