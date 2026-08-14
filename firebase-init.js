// firebase-init.js
// Firebase setup for St. Camillus Medical Center Reporting Dashboard.
// Loaded as an ES module (see the <script type="module"> tag in index.html).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBc1qKQf8S-s4BTkIUfoJvwwAMnhw6S7qE",
  authDomain: "mancom-reporting.firebaseapp.com",
  databaseURL: "https://mancom-reporting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mancom-reporting",
  storageBucket: "mancom-reporting.firebasestorage.app",
  messagingSenderId: "112628772852",
  appId: "1:112628772852:web:566b265e95e173f97413a1",
  measurementId: "G-6TSMBD7T42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app, firebaseConfig.databaseURL);
const auth = getAuth(app);

// Anonymous auth quick fix (see database security rules): the DB now
// requires `auth != null` on every read/write, so every page that talks
// to the database has to sign in before making its first call. This is
// a stopgap, not real per-user security — anyone can call
// signInAnonymously() themselves and get the same access. It only stops
// unauthenticated drive-by scanning of the open database.
//
// `authReady` resolves once we have a signed-in (anonymous) user, so
// other modules can `await authReady` before their first `get()`/`update()`
// call and avoid a permission-denied race on page load.
const authReady = signInAnonymously(auth).catch((err) => {
  console.error("Anonymous sign-in failed:", err);
  throw err;
});

// Expose on window in case any non-module code needs them.
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseDb = db;
window.firebaseAuth = auth;

export { app, analytics, db, auth, authReady };
