# Eve Clinic - Deployment Guide

## Quick Deploy to Firebase (Recommended)

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Create a project"
3. Enter project name (e.g., "eve-clinic")
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Firestore Database

1. In Firebase Console, click "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Enable"

### Step 3: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Under "Your apps", click the web icon (</>)
3. Register app with nickname "Eve Clinic"
4. Copy the firebaseConfig object

### Step 4: Update Firebase Config

Edit `app/lib/firebase.ts` and replace with your config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 5: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 6: Login and Initialize

```bash
firebase login
firebase init
```

Select:
- Firestore: Yes
- Hosting: Yes
- Use existing project: Select your project
- Public directory: dist
- Configure as single-page app: Yes

### Step 7: Build and Deploy

```bash
npm install
npm run build
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: Using GitHub Integration

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables (Firebase config)
6. Deploy

---

## Environment Variables

Create a `.env.local` file for local development:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Post-Deployment Setup

### 1. Update Firestore Rules

In Firebase Console > Firestore Database > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 1, 1);
    }
  }
}
```

### 2. Create Firestore Indexes

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

Or create manually in Firebase Console:
- patients: isActive (asc), createdAt (desc)
- labResults: patientId (asc), testDate (desc)
- medications: patientId (asc), createdAt (desc)
- imagingRecords: patientId (asc), imagingDate (desc)
- visits: patientId (asc), visitDate (desc)

---

## Custom Domain (Optional)

1. In Firebase Console, go to Hosting
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning

---

## Troubleshooting

### Build Errors

**Error: "Cannot find module"**
- Run `npm install` again
- Clear node_modules: `rm -rf node_modules && npm install`

**Error: "Firebase config invalid"**
- Check your Firebase config values
- Ensure environment variables are set correctly

### Deployment Errors

**Error: "Permission denied"**
- Check Firestore rules allow read/write
- Verify you're logged in: `firebase login`

**Error: "Index not found"**
- Deploy indexes: `firebase deploy --only firestore:indexes`
- Or wait for indexes to build (can take a few minutes)

---

## Live Demo

A live demo is available at:
**https://eve-clinic-demo.web.app**

---

## Support

For deployment issues:
- Firebase Docs: https://firebase.google.com/docs/hosting
- Next.js Docs: https://nextjs.org/docs/deployment
