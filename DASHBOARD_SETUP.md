# Grapevne University Dashboard - Setup Guide

## 📋 Overview

This is Phase 1 of the Grapevne University Analytics Dashboard - a secure portal where universities can view analytics about their campus's app usage.

**What's Included:**
- ✅ BigQuery integration for Firebase Analytics data
- ✅ Multi-tenant access control (universities only see their campus data)
- ✅ Firebase Authentication
- ✅ Express API backend with row-level security
- ✅ React dashboard with real-time metrics and charts
- ✅ Secure API endpoints with JWT verification

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Login Page   │  │  Dashboard   │  │   Charts     │      │
│  │ (Firebase)   │  │              │  │  (Recharts)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                           │                                  │
│                           ↓ (Firebase ID Token)              │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ↓
┌───────────────────────────┼──────────────────────────────────┐
│                  Express API Server (Node.js)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication Middleware (Firebase Admin SDK)      │   │
│  │  Verifies JWT & Extracts Campus from Custom Claims   │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard API Routes                                │   │
│  │  /api/dashboard/overview                             │   │
│  │  /api/dashboard/posts                                │   │
│  │  /api/dashboard/users/trend                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           ↓ (campus parameter)               │
└───────────────────────────┼──────────────────────────────────┘
                            │
                            ↓
┌───────────────────────────┼──────────────────────────────────┐
│                  Google BigQuery                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Firebase Analytics Data (Exported)                  │   │
│  │  Dataset: analytics_YOUR_PROJECT_ID                  │   │
│  │  Tables: events_YYYYMMDD                             │   │
│  │                                                       │   │
│  │  WHERE campus = @campus ← SECURITY CRITICAL!         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

## 🔐 Security Model

### Multi-Tenant Data Isolation

Every university can **ONLY** see their own campus data through three layers of security:

1. **Frontend Authentication**: Firebase Authentication requires login
2. **API Token Verification**: Express middleware verifies Firebase ID tokens
3. **Row-Level Filtering**: ALL BigQuery queries include `WHERE campus = @campus`

**Example Query:**
```sql
SELECT COUNT(*) FROM events
WHERE campus = @campus  -- ← User's campus from JWT custom claim
```

### Firebase Custom Claims

Each university user must have a `campus` custom claim set:

```javascript
// Admin SDK (you'll set this manually)
admin.auth().setCustomUserClaims(uid, {
  campus: 'University of California, Berkeley',
  role: 'university'
});
```

## 📦 Installation

### 1. Install Dependencies

```bash
# Root dependencies (Frontend + Backend)
npm install

# Server dependencies (if needed)
cd server && npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the **root directory**:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# ==========================================
# Frontend (React/Vite) - VITE_ prefix required
# ==========================================
VITE_FIREBASE_API_KEY=your_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

VITE_API_URL=http://localhost:3001

# ==========================================
# Backend (Express API)
# ==========================================
PORT=3001
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Google Cloud BigQuery
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
BIGQUERY_DATASET=analytics_123456789  # Your Firebase Analytics dataset
BIGQUERY_TABLE=events_*

# Option 1: Service Account File (Recommended for local dev)
GOOGLE_APPLICATION_CREDENTIALS=./server/config/service-account.json

# Option 2: Use same Firebase credentials for BigQuery
# (If you omit GOOGLE_APPLICATION_CREDENTIALS, it will use FIREBASE_PRIVATE_KEY)

# JWT Secret
JWT_SECRET=your-random-secret-key-here

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Get Firebase Service Account Credentials

#### Option A: Download Service Account JSON (Easiest)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `server/config/service-account.json`
6. Set in `.env`: `GOOGLE_APPLICATION_CREDENTIALS=./server/config/service-account.json`

#### Option B: Use Environment Variables

Extract from the JSON file:

```json
{
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
}
```

Add to `.env`:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
```

### 4. Enable Firebase Analytics Export to BigQuery

1. Go to **Firebase Console** → **Analytics** → **Data Streams**
2. Click **BigQuery Links**
3. Click **Link to BigQuery**
4. Select your GCP project
5. Choose dataset location (US recommended)
6. Enable **Daily export**
7. Wait 24-48 hours for first data export

Your dataset will be named: `analytics_<firebase_project_id>`

### 5. Set Up Firebase Custom Claims

You need to assign campuses to users. Create a script or use Firebase Console:

**Script (Node.js):**
```javascript
const admin = require('firebase-admin');
admin.initializeApp();

async function setCampusClaim(email, campus) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, {
    campus: campus,
    role: 'university'
  });
  console.log(`✅ Set campus claim for ${email}: ${campus}`);
}

// Usage
setCampusClaim('berkeley@university.edu', 'UC Berkeley');
```

## 🚀 Running the Application

### Development Mode (Frontend + Backend)

Run both servers simultaneously:

```bash
npm run dev:all
```

This starts:
- **Frontend (Vite)**: http://localhost:5173
- **Backend (Express)**: http://localhost:3001

### Run Separately

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

### Production Mode

**Backend:**
```bash
npm run server:prod
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 📊 BigQuery Data Schema

Your Firebase Analytics data in BigQuery should have this structure:

### Dataset
- Name: `analytics_<your_firebase_project_id>`
- Tables: `events_YYYYMMDD` (one table per day)

### Required Events

The dashboard expects these Firebase Analytics events:

#### 1. `post_created` - Free Food Posts
```javascript
logEvent(analytics, 'post_created', {
  post_category: 'free_food',  // Required for filtering
  post_id: 'abc123',
  campus: 'UC Berkeley'         // Will be in user_properties
});
```

#### 2. `post_view` - Post Views
```javascript
logEvent(analytics, 'post_view', {
  post_id: 'abc123'
});
```

#### 3. `check_in` - Check-ins
```javascript
logEvent(analytics, 'check_in', {
  post_id: 'abc123'
});
```

### User Properties

All events need a `campus` user property:

```javascript
setUserProperties(analytics, {
  campus: 'UC Berkeley'
});
```

## 🧪 Testing

### 1. Test Backend Connection

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-04T12:00:00.000Z",
  "service": "Grapevne Dashboard API"
}
```

### 2. Test Authentication

1. Visit http://localhost:5173/login
2. Sign in with a Firebase user
3. Check browser console for auth status
4. You should be redirected to `/dashboard`

### 3. Test API Endpoints

**Get user info:**
```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  http://localhost:3001/api/dashboard/me
```

**Get overview:**
```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  http://localhost:3001/api/dashboard/overview
```

## 🐛 Troubleshooting

### "No campus assigned to this account"

**Solution:** Set Firebase custom claim:
```javascript
admin.auth().setCustomUserClaims(uid, {
  campus: 'Your University Name',
  role: 'university'
});
```

### "BigQuery query failed"

**Common causes:**
1. Service account doesn't have BigQuery permissions
2. Dataset name is wrong (check `.env`)
3. No data exported yet (wait 24-48 hours after enabling export)

**Grant permissions:**
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT_EMAIL" \
  --role="roles/bigquery.dataViewer"
```

### "CORS error" when calling API

**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` in `.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com
```

### "Token verification failed"

**Possible causes:**
1. Frontend and backend Firebase projects don't match
2. Token expired (tokens are valid for 1 hour)
3. Firebase Admin SDK not initialized correctly

**Debug:**
```javascript
// Frontend: Get token
import { getIdToken } from './services/firebase';
const token = await getIdToken();
console.log('Token:', token);
```

## 📈 Dashboard Metrics Explained

### Daily Active Users (DAU)
- **Definition**: Unique users who triggered any event today
- **Calculation**: `COUNT(DISTINCT user_pseudo_id)` filtered by campus
- **Updates**: Real-time (based on BigQuery data freshness)

### Free Food Posts This Week
- **Definition**: Total `post_created` events with `post_category='free_food'` in last 7 days
- **Use Case**: Track sustainability program engagement

### Check-in Rate
- **Definition**: Percentage of users who viewed a post and then checked in within 1 hour
- **Formula**: `(check_ins / post_views) × 100`
- **Use Case**: Measure engagement effectiveness

### Posts Over Time Chart
- **Data**: Daily aggregation of post_created events
- **Shows**: Total posts and unique posters per day
- **Period**: Last 30 days

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Use environment variables, not hardcoded credentials
- [ ] Restrict CORS to your actual domain
- [ ] Enable Firebase App Check
- [ ] Set up Firebase Security Rules
- [ ] Use HTTPS in production
- [ ] Verify all users have correct campus claims
- [ ] Test that users can't access other campuses' data
- [ ] Enable audit logging in BigQuery
- [ ] Rotate service account keys regularly

## 🚢 Deployment

### Backend (Express API)

**Options:**
- Google Cloud Run
- AWS Elastic Beanstalk
- Heroku
- Railway
- Render

**Environment variables:** Upload your `.env` to the hosting platform

### Frontend (React)

**Options:**
- Vercel (recommended for Vite)
- Netlify
- Firebase Hosting
- Cloudflare Pages

**Build command:**
```bash
npm run build
```

**Output directory:**
```
dist/
```

## 📞 Support

For issues or questions:
- Email: support@grapevne.com
- Check Firebase Analytics data export status
- Verify service account permissions in GCP Console
- Review server logs: `npm run server` shows detailed logs

## 🔄 Next Steps (Phase 2+)

Future enhancements to build:
- [ ] Admin panel for managing university accounts
- [ ] More detailed engagement metrics
- [ ] Brand campaign analytics
- [ ] Export data to CSV/PDF reports
- [ ] Real-time notifications
- [ ] Custom date range selectors
- [ ] Comparative analytics (benchmark against other campuses)
- [ ] Webhook integrations

---

**Built by:** Grapevne Engineering Team
**Last Updated:** January 2024
