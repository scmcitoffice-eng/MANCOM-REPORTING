// login.js
// Client-side sign-in for the St. Camillus Reporting Dashboard.
// Checks the username/password against the "users" list in Firebase
// Realtime Database (the same list managed on the Users page), rather
// than a single hardcoded account.
//
// NOTE: This still performs the check in the browser, so it's a basic
// access gate rather than hardened security — anyone who opens dev tools
// can read the fetched user records for the moment they're on this page,
// and index.html can still be reached directly by anyone who guesses/sets
// sessionStorage. For genuine security, replace this with Firebase
// Authentication (email/password or similar) plus Realtime Database
// security rules that require an authenticated request.

import { db } from "./firebase-init.js";
import {
  ref, get
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const usersRef = ref(db, "users");

const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("loginUsername");
const passwordInput = document.getElementById("loginPassword");
const errorBox = document.getElementById("loginError");
const submitBtn = document.getElementById("loginSubmit");
const pwToggle = document.getElementById("pwToggle");

// If already signed in this session, skip straight to the dashboard.
if (sessionStorage.getItem("scmc_auth") === "1") {
  window.location.replace("index.html");
}

pwToggle.addEventListener("click", () => {
  const isPw = passwordInput.type === "password";
  passwordInput.type = isPw ? "text" : "password";
  pwToggle.setAttribute("aria-label", isPw ? "Hide password" : "Show password");
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  const card = document.querySelector(".login-card");
  card.classList.remove("shake");
  // Force reflow so the animation can re-trigger on repeated errors.
  void card.offsetWidth;
  card.classList.add("shake");
}

function setSubmitting(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  submitBtn.textContent = isSubmitting ? "Signing in…" : "Sign In";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError("Please enter both username and password.");
    return;
  }

  setSubmitting(true);

  try {
    const snap = await get(usersRef);
    const usersVal = snap.val() || {};
    const entry = Object.entries(usersVal).find(([, u]) =>
      (u.username || "").toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (!entry) {
      showError("Incorrect username or password.");
      setSubmitting(false);
      passwordInput.value = "";
      passwordInput.focus();
      return;
    }

    const [id, user] = entry;

    if (user.status === "inactive") {
      showError("This account has been deactivated. Contact your IT administrator.");
      setSubmitting(false);
      passwordInput.value = "";
      return;
    }

    if (user.mustChangePassword) {
      // Don't grant a full session yet — stash just enough to get to the
      // change-password step, which will re-verify against Firebase before
      // ever setting scmc_auth.
      sessionStorage.setItem("scmc_pending_change_id", id);
      window.location.replace("change-password.html");
      return;
    }

    sessionStorage.setItem("scmc_auth", "1");
    sessionStorage.setItem("scmc_user", user.username);
    sessionStorage.setItem("scmc_current_user", JSON.stringify({
      id,
      name: user.name,
      role: user.role || "Staff",
      dept: user.dept || "",
      accountRole: user.accountRole || "user"
    }));
    window.location.replace("index.html");
  } catch (err) {
    console.error("Login failed:", err);
    showError("Couldn't reach the sign-in service. Check your connection and try again.");
    setSubmitting(false);
  }
});
