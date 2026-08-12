// change-password.js
// Forced password-change step for accounts with mustChangePassword: true
// (newly added users, or anyone an admin has just reset). Reached only via
// login.js, which stashes the user's id in sessionStorage but does NOT set
// scmc_auth — so a real session only begins once a new password is saved
// here and verified against Firebase.

import { db } from "./firebase-init.js";
import {
  ref, get, update
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const pendingId = sessionStorage.getItem("scmc_pending_change_id");

// No pending first-login change queued up — nothing to do here.
if (!pendingId) {
  window.location.replace("login.html");
}

// Already fully signed in — no need to be on this page.
if (sessionStorage.getItem("scmc_auth") === "1") {
  window.location.replace("index.html");
}

const form = document.getElementById("changePasswordForm");
const newPasswordInput = document.getElementById("newPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");
const errorBox = document.getElementById("changeError");
const submitBtn = document.getElementById("changeSubmit");
const backToLogin = document.getElementById("backToLogin");

document.getElementById("pwToggle1").addEventListener("click", () => togglePw(newPasswordInput, "pwToggle1"));
document.getElementById("pwToggle2").addEventListener("click", () => togglePw(confirmPasswordInput, "pwToggle2"));
function togglePw(input, btnId){
  const isPw = input.type === "password";
  input.type = isPw ? "text" : "password";
  document.getElementById(btnId).setAttribute("aria-label", isPw ? "Hide password" : "Show password");
}

backToLogin.addEventListener("click", () => {
  sessionStorage.removeItem("scmc_pending_change_id");
});

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  const card = document.querySelector(".login-card");
  card.classList.remove("shake");
  void card.offsetWidth;
  card.classList.add("shake");
}

function setSubmitting(isSubmitting) {
  submitBtn.disabled = isSubmitting;
  submitBtn.textContent = isSubmitting ? "Saving…" : "Set Password & Continue";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!newPassword || !confirmPassword) {
    showError("Please fill in both fields.");
    return;
  }
  if (newPassword.length < 6) {
    showError("Password must be at least 6 characters.");
    return;
  }
  if (newPassword !== confirmPassword) {
    showError("Passwords don't match.");
    confirmPasswordInput.value = "";
    confirmPasswordInput.focus();
    return;
  }

  setSubmitting(true);

  try {
    const userRef = ref(db, `users/${pendingId}`);
    const snap = await get(userRef);
    const user = snap.val();

    if (!user) {
      showError("This account could not be found. Please sign in again.");
      sessionStorage.removeItem("scmc_pending_change_id");
      setSubmitting(false);
      return;
    }
    if (user.status === "inactive") {
      showError("This account has been deactivated. Contact your IT administrator.");
      sessionStorage.removeItem("scmc_pending_change_id");
      setSubmitting(false);
      return;
    }
    if (newPassword === user.password) {
      showError("Please choose a password different from the one you were given.");
      setSubmitting(false);
      return;
    }

    await update(userRef, { password: newPassword, mustChangePassword: false });

    sessionStorage.removeItem("scmc_pending_change_id");
    sessionStorage.setItem("scmc_auth", "1");
    sessionStorage.setItem("scmc_user", user.username);
    sessionStorage.setItem("scmc_current_user", JSON.stringify({
      id: pendingId,
      name: user.name,
      role: user.role || "Staff",
      dept: user.dept || "",
      accountRole: user.accountRole || "user"
    }));
    window.location.replace("index.html");
  } catch (err) {
    console.error("Failed to set new password:", err);
    showError("Couldn't save your new password. Check your connection and try again.");
    setSubmitting(false);
  }
});
