// login.js
// Simple client-side gate for the St. Camillus Reporting Dashboard.
//
// NOTE: This is a client-side-only check. The credentials below are visible
// to anyone who views this file's source, and the check can be bypassed by
// navigating to index.html directly or editing sessionStorage. It's a basic
// deterrent, not real access control. For genuine security, replace this
// with Firebase Authentication (email/password or similar), since the
// Firebase Auth SDK can be added alongside the existing Firebase setup.

const VALID_USERNAME = "it_admin";
const VALID_PASSWORD = "p@ssw0rd";

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    showError("Please enter both username and password.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in…";

  // Tiny delay so it doesn't feel instantaneous/fake.
  setTimeout(() => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem("scmc_auth", "1");
      sessionStorage.setItem("scmc_user", username);
      window.location.replace("index.html");
    } else {
      showError("Incorrect username or password.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In";
      passwordInput.value = "";
      passwordInput.focus();
    }
  }, 350);
});
