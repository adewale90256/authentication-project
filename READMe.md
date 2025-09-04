# Firebase Authentication Project

## 📌 Overview

This is a simple authentication project built with Firebase.  
It includes:

- **Sign Up Page** → Create new accounts (stores user profile in Firestore).
- **Sign In Page (index.html)** → Log in with email & password.
- **Forgot Password Page** → Reset password via email.
- **Landing Page** → Redirected after successful login.
- **Responsive Design** with TailwindCSS.
- Password visibility toggle with **Lucide Icons**.

---

## 🚀 Setup Instructions

1. Download or clone this project.
2. Open the `script.js` file and update the Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID",
   };
   ```
