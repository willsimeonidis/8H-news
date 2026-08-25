/* ------------------------------
   Supabase Client
------------------------------ */

const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-KEY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


/* ------------------------------
   Navbar Elements
------------------------------ */

const navSignin = document.getElementById("nav-signin");
const navAccount = document.getElementById("nav-account");


/* ------------------------------
   Popup Elements
------------------------------ */

const loginPopup = document.getElementById("login-popup");
const loginLater = document.getElementById("login-later");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");


/* ------------------------------
   Popup Controls
------------------------------ */

function openLoginPopup() {
  if (loginPopup) loginPopup.style.display = "flex";
}

function closeLoginPopup() {
  if (loginPopup) loginPopup.style.display = "none";
}


/* ------------------------------
   Auto Popup on Index Page
------------------------------ */

window.addEventListener("DOMContentLoaded", () => {

  const path = window.location.pathname;

  const isIndex =
    path.endsWith("index.html") ||
    path.endsWith("/8H-news/") ||
    path.endsWith("/8H-news");

  if (isIndex && !sessionStorage.getItem("dismissedLoginPopup")) {
    if (loginPopup) loginPopup.style.display = "flex";
  }

  if (loginLater) {
    loginLater.addEventListener("click", () => {
      closeLoginPopup();
      sessionStorage.setItem("dismissedLoginPopup", "true");
    });
  }
});


/* ------------------------------
   Navbar Sign In Button
------------------------------ */

if (navSignin) {
  navSignin.addEventListener("click", (e) => {
    e.preventDefault();
    openLoginPopup();
  });
}


/* ------------------------------
   Refresh User State
------------------------------ */

async function refreshUser() {
  const { data } = await supabaseClient.auth.getUser();
  const user = data?.user;

  if (user) {
    navAccount.style.display = "inline-block";
    navAccount.textContent = user.email;
    navSignin.textContent = "Account";
  } else {
    navAccount.style.display = "none";
    navSignin.textContent = "Sign In";
  }
}


/* ------------------------------
   Login Form
------------------------------ */

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Login failed");
      return;
    }

    await refreshUser();
    closeLoginPopup();
  });
}


/* ------------------------------
   Register Form
------------------------------ */

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const { error } = await supabaseClient.auth.signUp({
      email,
      password
    });

    if (error) {
      alert("Registration failed");
      return;
    }

    alert("Check your email to confirm your account.");
  });
}


/* ------------------------------
   Initialize User State
------------------------------ */

refreshUser();
