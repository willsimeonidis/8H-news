/* ------------------------------ */
/* Supabase Client                */
/* ------------------------------ */

const SUPABASE_URL = "https://zjyqbddvrhkyewmdsilq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeXFiZGR2cmhreWV3bWRzaWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTg3MDAsImV4cCI6MjEwMzE5NDcwMH0.VtZ-vS4Mv7AZDG_4NmQioAv6km93R0BKutpqIQxN5t0";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ------------------------------ */
/* DOM Elements                   */
/* ------------------------------ */

const navSignin   = document.getElementById("nav-signin");
const navAccount  = document.getElementById("nav-account");

const loginPopup  = document.getElementById("login-popup");
const loginLater  = document.getElementById("login-later");
const loginForm   = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

/* ------------------------------ */
/* Popup Controls                 */
/* ------------------------------ */

function openLoginPopup() {
  loginPopup.style.display = "block";
}

function closeLoginPopup() {
  loginPopup.style.display = "none";
}

/* ------------------------------ */
/* Navbar Logic                   */
/* ------------------------------ */

async function refreshUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    navSignin.style.display = "none";
    navAccount.style.display = "inline";
    navAccount.textContent = user.email;
  } else {
    navSignin.style.display = "inline";
    navAccount.style.display = "none";
  }
}

/* ------------------------------ */
/* Login Form                     */
/* ------------------------------ */

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login failed: " + error.message);
  } else {
    closeLoginPopup();
    refreshUser();
  }
});

/* ------------------------------ */
/* Register Form                  */
/* ------------------------------ */

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Registration failed: " + error.message);
  } else {
    alert("Account created! Please log in.");
  }
});

/* ------------------------------ */
/* Sign In Later                  */
/* ------------------------------ */

loginLater.addEventListener("click", () => {
  closeLoginPopup();
});

/* ------------------------------ */
/* Require Login for Review Page  */
/* ------------------------------ */

if (window.location.pathname.includes("review.html")) {
  (async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      openLoginPopup();
    }
  })();
}

/* ------------------------------ */
/* Init                           */
/* ------------------------------ */

refreshUser();
navSignin.addEventListener("click", openLoginPopup);
