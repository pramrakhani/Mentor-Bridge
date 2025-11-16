# Troubleshooting Guide - MentorBridge

## Login Issues

### "Invalid email or password" Error

**Problem**: You're trying to log in with an account that doesn't exist.

**Solutions**:
1. **Create a new account** (Recommended):
   - Click "Sign up" on the login page
   - Fill in your details
   - You'll be automatically logged in after signup

2. **Use Google Sign-In**:
   - Click the "Google" button
   - Sign in with your Google account
   - Account will be created automatically

3. **If you want demo users**:
   - First, create any account (or use Google)
   - Go to: `http://localhost:5174/seed`
   - Click "Seed Database"
   - Then log out and log in with demo credentials:
     - Email: `alex.johnson@student.com`
     - Password: `demo123456`

### "Network error" or Connection Issues

**Problem**: Firebase connection is failing.

**Solutions**:
1. **Check Firebase Console**:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project: `mentor-bridge-1e158`
   - Verify the project is active

2. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Look for Firebase-related errors

3. **Verify Firebase Config**:
   - Check `src/config/firebase.js` has correct values
   - Verify `.env` file exists with correct values

### "Permission denied" Error

**Problem**: Firestore security rules are blocking access.

**Solutions**:
1. **Enable Firestore**:
   - Go to Firebase Console → Firestore Database
   - Click "Create database" if not created
   - Start in "Test mode" for development

2. **Set Security Rules** (for development):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

3. **Enable Authentication**:
   - Go to Firebase Console → Authentication
   - Click "Get started"
   - Enable "Email/Password" provider
   - Enable "Google" provider (optional)

### Google Sign-In Not Working

**Problem**: Google authentication popup is blocked or failing.

**Solutions**:
1. **Allow Popups**:
   - Check browser popup blocker settings
   - Allow popups for `localhost:5174`

2. **Enable Google Provider**:
   - Firebase Console → Authentication → Sign-in method
   - Enable "Google" provider
   - Add authorized domains if needed

3. **Check OAuth Consent Screen**:
   - If using Google Cloud Console, verify OAuth setup

## Common Setup Issues

### Firebase Authentication Not Enabled

**Symptoms**: Can't sign up or log in.

**Fix**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Get started**
4. Enable **Email/Password** sign-in method
5. (Optional) Enable **Google** sign-in method

### Firestore Database Not Created

**Symptoms**: App loads but data doesn't save/load.

**Fix**:
1. Go to Firebase Console → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to you)
5. Click **Enable**

### Wrong Firebase Configuration

**Symptoms**: Connection errors, authentication fails.

**Fix**:
1. Check `src/config/firebase.js` has your Firebase config
2. Or create `.env` file with:
   ```
   VITE_FIREBASE_API_KEY=your-key
   VITE_FIREBASE_AUTH_DOMAIN=your-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```
3. Restart dev server after changing `.env`

## Development Server Issues

### Port Already in Use

**Problem**: `Port 5173 is in use`

**Solution**: The server will automatically use the next available port (5174, 5175, etc.). Just use the URL shown in terminal.

### Hot Reload Not Working

**Solution**: 
- Save files properly
- Check browser console for errors
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## Data Issues

### No Data Showing After Seeding

**Problem**: Seeded data not appearing in UI.

**Solutions**:
1. **Check Firestore**:
   - Go to Firebase Console → Firestore Database
   - Verify collections exist: `users`, `sessions`, `conversations`, `reviews`

2. **Check Browser Console**:
   - Look for Firestore permission errors
   - Check network tab for failed requests

3. **Verify Security Rules**:
   - Rules should allow authenticated users to read/write

### Demo Users Not Created

**Problem**: Seed script runs but users don't appear.

**Solutions**:
1. **Check Firebase Authentication**:
   - Go to Authentication → Users
   - See if users were created

2. **Check Console Errors**:
   - Browser console for client-side errors
   - Terminal for server-side errors

3. **Try Browser-Based Seeding**:
   - Login with any account
   - Go to `/seed` page
   - Click "Seed Database"
   - Check progress messages

## Still Having Issues?

1. **Check Browser Console** (F12 → Console tab)
   - Look for red error messages
   - Copy error messages for debugging

2. **Check Firebase Console**:
   - Verify project is active
   - Check Authentication is enabled
   - Verify Firestore is created

3. **Verify Setup**:
   - Node.js version (should be 20.13.1+)
   - Dependencies installed (`npm install`)
   - Firebase project configured correctly

4. **Common First-Time Setup Checklist**:
   - [ ] Firebase project created
   - [ ] Authentication enabled (Email/Password)
   - [ ] Firestore database created
   - [ ] Security rules set (test mode for dev)
   - [ ] Firebase config added to `.env` or `firebase.js`
   - [ ] Dev server running (`npm run dev`)
   - [ ] Browser console shows no errors

---

For more help, check the main README.md or open an issue on the repository.

