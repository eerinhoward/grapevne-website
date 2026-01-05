# Grapevne Dashboard - Quick Start Guide

Get the dashboard running in 15 minutes.

## ⚡ Prerequisites

- Node.js 18+ installed
- Firebase project with Analytics enabled
- Google Cloud Platform account
- Firebase Analytics export to BigQuery enabled

## 🚀 Quick Setup

### 1. Clone and Install (2 minutes)

```bash
cd grapevne-website
git checkout calvin/bigquery-setup
npm install
```

### 2. Configure Environment (5 minutes)

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
# Frontend
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Backend
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

GOOGLE_CLOUD_PROJECT_ID=your-project-id
BIGQUERY_DATASET=analytics_123456789
```

**Where to find these:**
- Firebase Console → Project Settings → General (Web API key, Project ID)
- Firebase Console → Project Settings → Service Accounts → Generate Private Key
- BigQuery Console → Check dataset name (should be `analytics_<project_id>`)

### 3. Set User Campus (3 minutes)

Create `set-campus.js` in the root:

```javascript
require('dotenv').config();
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

async function setCampus(email, campus) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, {
    campus: campus,
    role: 'university'
  });
  console.log(`✅ Set campus for ${email}: ${campus}`);
  process.exit(0);
}

// Change these values
setCampus('your-email@university.edu', 'University of California, Berkeley');
```

Run it:
```bash
node set-campus.js
```

### 4. Run the App (1 minute)

```bash
npm run dev:all
```

This starts:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### 5. Test It (2 minutes)

1. Visit http://localhost:5173/login
2. Sign in with your Firebase user
3. You should see the dashboard at http://localhost:5173/dashboard

## 🎯 Expected Results

You should see:

✅ **Dashboard loads without errors**
✅ **3 metric cards** (may show 0 if no data yet)
✅ **Chart component** (may be empty if no data yet)
✅ **Your campus name** in the header

## 🐛 Common Issues

### "No campus assigned to this account"
→ Run the set-campus.js script above

### "BigQuery query failed"
→ Wait 24-48 hours after enabling Firebase Analytics export
→ Check dataset name in BigQuery Console

### "CORS error"
→ Backend not running. Make sure `npm run dev:all` is running

### Charts show no data
→ Normal if you just set up Firebase Analytics
→ Data exports happen once per day
→ Generate test data in your app to see charts populate

## 📊 Generate Test Data

Add this to your mobile app to generate events:

```javascript
import { logEvent, setUserProperties } from 'firebase/analytics';

// Set campus (once per user)
setUserProperties(analytics, {
  campus: 'University of California, Berkeley'
});

// Log events
logEvent(analytics, 'post_created', {
  post_category: 'free_food',
  post_id: 'test123'
});

logEvent(analytics, 'post_view', {
  post_id: 'test123'
});

logEvent(analytics, 'check_in', {
  post_id: 'test123'
});
```

After 24-48 hours, data will appear in BigQuery and your dashboard.

## 🔐 Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` in `.env`
- [ ] Add your domain to `ALLOWED_ORIGINS`
- [ ] Don't commit `.env` to git
- [ ] Use Firebase App Check
- [ ] Test that users can't see other campuses' data

## 📚 Next Steps

- **Full Setup Guide**: [DASHBOARD_SETUP.md](./DASHBOARD_SETUP.md)
- **BigQuery Queries**: [BIGQUERY_QUERIES.md](./BIGQUERY_QUERIES.md)
- **API Documentation**: Check [server/routes/dashboard.js](./server/routes/dashboard.js)

## 💡 Tips

- **Development**: Use `npm run dev:all` to run both servers
- **Backend only**: Use `npm run server`
- **Frontend only**: Use `npm run dev`
- **Check API**: Visit http://localhost:3001/health

## 🆘 Still Stuck?

1. Check the console logs for errors
2. Verify all `.env` values are correct
3. Make sure Firebase Analytics export is enabled
4. Check [DASHBOARD_SETUP.md](./DASHBOARD_SETUP.md) Troubleshooting section
5. Email: support@grapevne.com

---

**Total Setup Time:** ~15 minutes
**Data Availability:** 24-48 hours after Firebase Analytics export enabled
