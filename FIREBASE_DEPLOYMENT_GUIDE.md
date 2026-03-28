# Eve Clinic - Firebase Deployment Guide
## Complete Step-by-Step Instructions for ahmadelkholii@gmail.com

---

## Overview
This guide will walk you through deploying the Eve Clinic web application to your Firebase account. The entire process takes about 15-20 minutes.

---

## Step 1: Create a Firebase Project

### 1.1 Go to Firebase Console
1. Open your browser and go to: https://console.firebase.google.com
2. Sign in with your Google account: **ahmadelkholii@gmail.com**

### 1.2 Create New Project
1. Click the **"Create a project"** button (big blue button)
2. **Project name**: Enter `eve-clinic` (or any name you prefer)
   - Note: This name must be unique across all Firebase projects
3. Click **"Continue"**
4. **Google Analytics**: You can enable or disable it (optional)
   - If enabled, select your Google Analytics account
5. Click **"Create project"**
6. Wait for the project to be created (takes about 30 seconds)
7. Click **"Continue"** when ready

---

## Step 2: Enable Firestore Database

### 2.1 Navigate to Firestore
1. In the left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**

### 2.2 Configure Firestore
1. **Start in production mode** (recommended for security)
2. Click **"Next"**
3. **Location**: Choose the closest region to you
   - For Middle East: `europe-west` or `europe-west1`
   - For best performance, select the region closest to your clinic
4. Click **"Enable"**

### 2.3 Update Firestore Rules
1. Go to the **"Rules"** tab in Firestore Database
2. Replace the default rules with these:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

> **Note**: These rules allow anyone to read/write. For production, you should add authentication. This is fine for initial setup and testing.

---

## Step 3: Get Your Firebase Configuration

### 3.1 Find Project Settings
1. Click the **gear icon** (⚙️) next to **"Project Overview"** in the left sidebar
2. Select **"Project settings"**

### 3.2 Get Config Values
1. Scroll down to the **"Your apps"** section
2. Click the **"</>"** icon (Web app)
3. **App nickname**: Enter `eve-clinic-web`
4. Click **"Register app"**
5. You will see your Firebase configuration like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "eve-clinic-12345.firebaseapp.com",
  projectId: "eve-clinic-12345",
  storageBucket: "eve-clinic-12345.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

6. **Copy these values** - you'll need them in the next step

---

## Step 4: Update Project Configuration

### 4.1 Update Firebase Config File
1. Open the file: `/eve-clinic-web/app/lib/firebase.ts`
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
};
```

### 4.2 Alternative: Use Environment Variables (Recommended)
Create a file named `.env.local` in the project root:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-actual-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-actual-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
```

---

## Step 5: Install Firebase CLI

### 5.1 Install Node.js (if not already installed)
1. Download from: https://nodejs.org
2. Install the LTS version
3. Verify installation:
```bash
node --version
npm --version
```

### 5.2 Install Firebase CLI
Open your terminal/command prompt and run:

```bash
npm install -g firebase-tools
```

### 5.3 Verify Installation
```bash
firebase --version
```

You should see a version number like `13.x.x`

---

## Step 6: Login to Firebase

### 6.1 Authenticate
In your terminal, run:

```bash
firebase login
```

### 6.2 Select Account
1. A browser window will open
2. Sign in with: **ahmadelkholii@gmail.com**
3. Click **"Allow"** to grant permissions
4. You should see: "Success! Firebase CLI Login Successful"

### 6.3 Verify Login
```bash
firebase projects:list
```

You should see your `eve-clinic` project in the list.

---

## Step 7: Initialize Firebase in Your Project

### 7.1 Navigate to Project Directory
```bash
cd /path/to/eve-clinic-web
```

### 7.2 Initialize Firebase
```bash
firebase init
```

### 7.3 Answer the Prompts
1. **Are you ready to proceed?** → Type `Y` and press Enter
2. **Which Firebase features?** → Use arrow keys and space to select:
   - [x] Firestore
   - [x] Hosting
   Press Enter when done
3. **Select project** → Choose `eve-clinic` (use arrow keys)
4. **Firestore rules file** → Press Enter (accept default: `firestore.rules`)
5. **Firestore indexes file** → Press Enter (accept default: `firestore.indexes.json`)
6. **Public directory** → Type `dist` and press Enter
7. **Configure as single-page app?** → Type `Y` and press Enter
8. **Set up automatic builds?** → Type `N` and press Enter

---

## Step 8: Build the Project

### 8.1 Install Dependencies
```bash
npm install
```

### 8.2 Build for Production
```bash
npm run build
```

This will create a `dist` folder with all the compiled files.

---

## Step 9: Deploy to Firebase

### 9.1 Deploy Everything
```bash
firebase deploy
```

This will deploy:
- Firestore rules and indexes
- Hosting (your web app)

### 9.2 Wait for Deployment
- The process takes 2-5 minutes
- You'll see progress messages
- At the end, you'll see your hosting URL:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/eve-clinic-12345/overview
Hosting URL: https://eve-clinic-12345.web.app
```

---

## Step 10: Access Your Live App

### 10.1 Open Your Website
1. Copy the Hosting URL from the deployment output
2. Open it in your browser: `https://your-project-id.web.app`

### 10.2 Test the Application
- Add a test patient
- Try the obstetrics calculator
- Add lab results
- Everything should sync in real-time!

---

## Troubleshooting

### Issue: "firebase: command not found"
**Solution**: Restart your terminal or run:
```bash
npm install -g firebase-tools
```

### Issue: "Error: Not authenticated"
**Solution**: Run `firebase login` again

### Issue: "Build fails with module not found"
**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: "Firestore permission denied"
**Solution**: Update Firestore rules to allow read/write (see Step 2.3)

### Issue: "Page not found" after deployment
**Solution**: Make sure `firebase.json` has the rewrites configuration:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## Quick Reference Commands

```bash
# Login to Firebase
firebase login

# Initialize project
firebase init

# Build the app
npm run build

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Check deployment status
firebase hosting:channel:list
```

---

## Your Deployment Checklist

- [ ] Created Firebase project at https://console.firebase.google.com
- [ ] Enabled Firestore Database
- [ ] Updated Firestore rules
- [ ] Copied Firebase config values
- [ ] Updated `firebase.ts` with your config
- [ ] Installed Firebase CLI (`npm install -g firebase-tools`)
- [ ] Logged in to Firebase (`firebase login`)
- [ ] Initialized Firebase in project (`firebase init`)
- [ ] Installed dependencies (`npm install`)
- [ ] Built the project (`npm run build`)
- [ ] Deployed to Firebase (`firebase deploy`)
- [ ] Tested the live website

---

## Need Help?

If you encounter any issues:
1. Check the Firebase documentation: https://firebase.google.com/docs
2. Review the error messages carefully
3. Make sure you're using the correct project ID
4. Verify your Firebase config values are correct

---

## Next Steps After Deployment

1. **Set up custom domain** (optional): Go to Firebase Console → Hosting → Add custom domain
2. **Enable authentication**: Add Firebase Auth for secure access
3. **Set up backups**: Configure Firestore backups for patient data
4. **Test on mobile**: The app is PWA-ready, add it to your home screen

---

**Your app will be live at**: `https://your-project-id.web.app`

Congratulations! Your Eve Clinic web application is now deployed and accessible from anywhere! 🎉
