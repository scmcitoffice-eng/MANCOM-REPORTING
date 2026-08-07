// firebase-init.js
// Firebase setup for St. Camillus Medical Center Reporting Dashboard.
// Loaded as an ES module (see the <script type="module"> tag in index.html).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
// If you add more Firebase products later (Auth, Storage, etc.),
// import them the same way, e.g.:
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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

// Expose on window in case any non-module code needs them.
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseDb = db;

export { app, analytics, db };
