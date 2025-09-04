// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBxOKYTOkTl51Vg95St5GvuSX7NRItZYCg",
  authDomain: "vinovibe-auth.firebaseapp.com",
  projectId: "vinovibe-auth",
  storageBucket: "vinovibe-auth.firebasestorage.app",
  messagingSenderId: "130262838792",
  appId: "1:130262838792:web:38d0916beec040f3d66bbd",
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ---------------- SIGN UP ---------------- */
const signupForm = document.getElementById("signupForm");

// Password validation function
function validatePassword(password) {
  // Minimum 8 chars, at least one uppercase, one lowercase, one number, one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
}

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const messageEl = document.getElementById("signupMessage");

    // Reset previous message
    messageEl.classList.add("hidden");
    messageEl.textContent = "";

    // Check if passwords match
    if (password !== confirmPassword) {
      messageEl.textContent = "Passwords do not match!";
      messageEl.classList.remove("hidden");
      messageEl.classList.remove("text-green-600");
      messageEl.classList.add("text-red-500");
      return; // stop execution
    }

    // Check password rules
    if (!validatePassword(password)) {
      messageEl.textContent =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character!";
      messageEl.classList.remove("hidden");
      messageEl.classList.remove("text-green-600");
      messageEl.classList.add("text-red-500");
      return; // stop execution, **account will NOT be created**
    }

    try {
      // Only runs if password is valid
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: fullName });

      // Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName: fullName,
        email: email,
        createdAt: new Date(),
      });

      // Show success message
      messageEl.textContent = "Account created successfully!";
      messageEl.classList.remove("hidden");
      messageEl.classList.remove("text-red-500");
      messageEl.classList.add("text-green-600");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      messageEl.textContent = error.message;
      messageEl.classList.remove("hidden");
      messageEl.classList.remove("text-green-600");
      messageEl.classList.add("text-red-500");
    }
  });
}

/* ---------------- PASSWORD TOGGLES ---------------- */
function setupPasswordToggle(inputId, toggleBtnId, eyeOpenId, eyeClosedId) {
  const input = document.getElementById(inputId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const eyeOpen = document.getElementById(eyeOpenId);
  const eyeClosed = document.getElementById(eyeClosedId);

  if (toggleBtn && input) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      eyeOpen.classList.toggle("hidden", !isPassword);
      eyeClosed.classList.toggle("hidden", isPassword);
    });
  }
}

// Apply toggle to both fields
setupPasswordToggle(
  "password",
  "togglePassword",
  "eyeOpenPass",
  "eyeClosedPass"
);
setupPasswordToggle(
  "confirmPassword",
  "toggleConfirmPassword",
  "eyeOpenConfirm",
  "eyeClosedConfirm"
);

/* ---------------- SIGN IN ---------------- */
const signinForm = document.getElementById("signinForm");
if (signinForm) {
  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signinEmail").value;
    const password = document.getElementById("signinPassword").value;
    const errorMsg = document.getElementById("signinError");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Show success message in green
      errorMsg.textContent = "Login successful!";
      errorMsg.classList.remove("hidden");
      errorMsg.classList.remove("text-red-500");
      errorMsg.classList.add("text-green-600");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "landing.html";
      }, 1500);
    } catch (error) {
      // Show error inline in red
      errorMsg.textContent = "Incorrect email or password!";
      errorMsg.classList.remove("hidden");
      errorMsg.classList.remove("text-green-600");
      errorMsg.classList.add("text-red-500");
    }
  });
}

/* ---------------- PASSWORD TOGGLE ---------------- */
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("signinPassword");
const eyeOpen = document.getElementById("eyeOpen");
const eyeClosed = document.getElementById("eyeClosed");

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // Switch icons
    eyeOpen.classList.toggle("hidden", !isPassword);
    eyeClosed.classList.toggle("hidden", isPassword);
  });
}

/* ---------------- FORGOT PASSWORD ---------------- */
const resetForm = document.getElementById("resetForm");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value;
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  });
}

/* ---------------- LANDING PAGE ---------------- */
const welcomeMessage = document.getElementById("welcomeMessage");
const logoutBtn = document.getElementById("logoutBtn");

if (welcomeMessage && logoutBtn) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      welcomeMessage.textContent = `Welcome, ${
        user.displayName || user.email
      }!`;
      logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "index.html";
      });
    } else {
      window.location.href = "index.html";
    }
  });
}
