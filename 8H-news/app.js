// ---------- Supabase client ----------
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR-ANON-KEY";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ---------- Elements ----------
const navSignin = document.getElementById("nav-signin");
const navAccount = document.getElementById("nav-account");
const loginPopup = document.getElementById("login-popup");
const loginLater = document.getElementById("login-later");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");

// ---------- Popup control ----------
function openLoginPopup() {
  if (loginPopup) loginPopup.style.display = "flex";
}
function closeLoginPopup() {
  if (loginPopup) loginPopup.style.display = "none";
}

// ---------- Auto popup ONLY on first visit to index ----------
window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  const isIndex =
    path.endsWith("index.html") ||
    path === "/" ||
    path.endsWith("/8H-news/") ||
    path.endsWith("/8H-news/index.html");

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

// ---------- Navbar Sign In ----------
if (navSignin) {
  navSignin.addEventListener("click", (e) => {
    e.preventDefault();
    openLoginPopup();
  });
}

// ---------- Refresh user ----------
async function refreshUser() {
  const { data } = await supabaseClient.auth.getUser();
  const user = data?.user;

  if (user) {
    if (navAccount) {
      navAccount.style.display = "inline-block";
      navAccount.textContent = user.email;
    }
    if (navSignin) navSignin.textContent = "Account";
  } else {
    if (navAccount) navAccount.style.display = "none";
    if (navSignin) navSignin.textContent = "Sign In";
  }
}

// ---------- Login ----------
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

// ---------- Register ----------
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

// ---------- Logout ----------
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    await refreshUser();
  });
}

// ---------- On load ----------
refreshUser();

// ---------- Magic 8-Ball ----------
const eightballQuestion = document.getElementById("eightball-question");
const eightballAnswer = document.getElementById("eightball-answer");
const eightballAsk = document.getElementById("eightball-ask");

const eightballResponses = [
  "Absolutely yes.",
  "Absolutely not.",
  "Ask again later.",
  "The vibes say no.",
  "The vibes say yes.",
  "Unclear. Try snacks first.",
  "You already know the answer.",
  "This will be chaotic.",
  "Probably fine.",
  "This is a terrible idea."
];

if (eightballAsk && eightballQuestion && eightballAnswer) {
  eightballAsk.addEventListener("click", () => {
    const q = eightballQuestion.value.trim();
    if (!q) {
      eightballAnswer.textContent = "You have to actually ask something.";
      return;
    }
    const idx = Math.floor(Math.random() * eightballResponses.length);
    eightballAnswer.textContent = eightballResponses[idx];
  });
}

// ---------- Review submissions ----------
const submitReviewBtn = document.getElementById("submit-review-btn");
const reviewTitle = document.getElementById("review-title");
const reviewBody = document.getElementById("review-body");
const userSubmissions = document.getElementById("user-submissions");
const adminSubmissions = document.getElementById("admin-submissions");

if (submitReviewBtn && reviewTitle && reviewBody) {
  submitReviewBtn.addEventListener("click", async () => {
    const title = reviewTitle.value.trim();
    const body = reviewBody.value.trim();

    if (!title || !body) {
      alert("Fill in both fields.");
      return;
    }

    // Example insert (replace with your real table)
    /*
    const { error } = await supabaseClient
      .from("submissions")
      .insert({ title, body });

    if (error) {
      alert("Failed to submit.");
      return;
    }
    */

    const div = document.createElement("div");
    div.className = "story";
    div.innerHTML = `<h3>${title}</h3><p class="dek">${body}</p>`;
    if (userSubmissions) userSubmissions.appendChild(div);

    reviewTitle.value = "";
    reviewBody.value = "";
  });
}
