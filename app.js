// --------------------------------------------------
// SUPABASE SETUP
// --------------------------------------------------

const supabaseUrl = "https://zjyqbddvrhkyewmdsilq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeXFiZGR2cmhreWV3bWRzaWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTg3MDAsImV4cCI6MjEwMzE5NDcwMH0.VtZ-vS4Mv7AZDG_4NmQioAv6km93R0BKutpqIQxN5t0
";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --------------------------------------------------
// LOGIN POPUP
// --------------------------------------------------

const loginPopup = document.getElementById("login-popup");
const navSignin = document.getElementById("nav-signin");
const navAccount = document.getElementById("nav-account");
const loginLater = document.getElementById("login-later");

if (navSignin) {
  navSignin.addEventListener("click", () => {
    loginPopup.style.display = "flex";
  });
}

if (loginLater) {
  loginLater.addEventListener("click", () => {
    loginPopup.style.display = "none";
  });
}

// --------------------------------------------------
// LOGIN FORM
// --------------------------------------------------

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      loginPopup.style.display = "none";
      updateAccountDisplay();
      unlockReviewIfNeeded();
    }
  });
}

// --------------------------------------------------
// REGISTER FORM
// --------------------------------------------------

const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      alert("Registration failed: " + error.message);
    } else {
      alert("Account created! Please sign in.");
    }
  });
}

// --------------------------------------------------
// ACCOUNT DISPLAY
// --------------------------------------------------

async function updateAccountDisplay() {
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

updateAccountDisplay();

// --------------------------------------------------
// REVIEW PAGE LOCK / UNLOCK
// --------------------------------------------------

function unlockReviewIfNeeded() {
  const reviewLocked = document.getElementById("review-locked");
  const reviewForm = document.getElementById("review-form");

  if (!reviewLocked || !reviewForm) return;

  supabase.auth.getUser().then(({ data: { user } }) => {
    if (user) {
      reviewLocked.style.display = "none";
      reviewForm.style.display = "block";
    }
  });
}

unlockReviewIfNeeded();

// Sign-in button inside review page
const reviewSigninBtn = document.getElementById("review-signin-btn");
if (reviewSigninBtn) {
  reviewSigninBtn.addEventListener("click", () => {
    loginPopup.style.display = "flex";
  });
}

// --------------------------------------------------
// REVIEW SUBMISSION
// --------------------------------------------------

const reviewForm = document.getElementById("review-form");

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("review-title").value;
    const body = document.getElementById("review-body").value;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be signed in.");
      return;
    }

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      title,
      body
    });

    if (error) {
      alert("Error submitting review: " + error.message);
    } else {
      alert("Review submitted!");
      reviewForm.reset();
    }
  });
}

// --------------------------------------------------
// WEATHER FETCH
// --------------------------------------------------

async function loadWeather() {
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const windEl = document.getElementById("weather-wind");
  const loadingEl = document.getElementById("weather-loading");

  if (!tempEl) return;

  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&current_weather=true"
    );
    const data = await response.json();

    const w = data.current_weather;

    tempEl.textContent = w.temperature + "°C";
    descEl.textContent = "Conditions: " + w.weathercode;
    windEl.textContent = "Wind: " + w.windspeed + " km/h";

    loadingEl.style.display = "none";
  } catch (err) {
    tempEl.textContent = "--°C";
    descEl.textContent = "Unable to load weather";
    windEl.textContent = "Wind: -- km/h";
  }
}

loadWeather();

// --------------------------------------------------
// 8-BALL
// --------------------------------------------------

const eightBall = document.getElementById("eight-ball");
const eightAnswer = document.getElementById("eight-answer");
const eightAsk = document.getElementById("eight-ask");

const responses = [
  "Yes.",
  "No.",
  "Absolutely.",
  "Ask again later.",
  "Probably not.",
  "Definitely.",
  "Uncertain.",
  "The hallway spirits say yes.",
  "The Chromebook gods say no.",
  "Signs point to chaos.",
  "Maybe.",
  "Without a doubt.",
  "I wouldn't count on it.",
  "Sources decline to comment."
];

if (eightAsk) {
  eightAsk.addEventListener("click", () => {
    const q = document.getElementById("eight-question").value.trim();

    if (q.length === 0) {
      eightAnswer.textContent = "Ask a question.";
      return;
    }

    const r = responses[Math.floor(Math.random() * responses.length)];
    eightAnswer.textContent = r;
  });
}

if (eightBall) {
  eightBall.addEventListener("click", () => {
    const q = document.getElementById("eight-question").value.trim();

    if (q.length === 0) {
      eightAnswer.textContent = "Ask a question.";
      return;
    }

    const r = responses[Math.floor(Math.random() * responses.length)];
    eightAnswer.textContent = r;
  });
}
