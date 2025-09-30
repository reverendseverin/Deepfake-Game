# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name your project (e.g., "deepfake-detective")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Set up Realtime Database

1. In the Firebase console, click "Realtime Database" from the left menu
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location (closest to your users)
5. Click "Done"

## 3. Get Firebase Configuration

1. In the Firebase console, click the gear icon and select "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Give your app a name (e.g., "Deepfake Game")
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the configuration object

## 4. Update Firebase Configuration

Replace the configuration in `script.js` (around line 2) with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

## 5. Database Security Rules (Optional)

For a production kiosk, you might want to set these rules in the Firebase console under "Realtime Database" > "Rules":

```json
{
  "rules": {
    "scores": {
      ".write": true,
      ".read": true,
      "$scoreId": {
        "name": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length <= 20"
        },
        "score": {
          ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 1000"
        },
        "timestamp": {
          ".validate": "newData.val() == now"
        }
      }
    }
  }
}
```

## 6. Testing

1. Open `index.html` in a web browser
2. Play the game and submit a score
3. Check the Firebase console to see if the score was saved
4. The game includes fallback to localStorage if Firebase is not configured

## 7. Deployment Options

### Option A: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option B: Static File Server
Just serve the files from any web server (nginx, Apache, etc.)

### Option C: Local Development
Open `index.html` directly in a browser (some features may be limited)

## Offline Functionality

The game includes localStorage fallback, so it will work even without Firebase configuration. Scores will be stored locally on the device.

## Security Considerations for Kiosk

1. Set Firebase rules to prevent abuse
2. Consider implementing rate limiting
3. Sanitize user input (already implemented)
4. Regular database cleanup of old scores
5. Monitor usage and costs