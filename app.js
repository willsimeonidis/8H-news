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
  if (loginPopup) loginPopup.style.display = "block";
}

function closeLoginPopup() {
  if (loginPopup) loginPopup.style.display = "none";
}

/* ------------------------------ */
/* Navbar Logic                   */
/* ------------------------------ */

async function refreshUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    if (navSignin) navSignin.style.display = "none";
    if (navAccount) {
      navAccount.style.display = "inline";
      navAccount.textContent = user.email;
    }
  } else {
    if (navSignin) navSignin.style.display = "inline";
    if (navAccount) navAccount.style.display = "none";
  }
}

/* ------------------------------ */
/* Login Form                     */
/* ------------------------------ */

if (loginForm) {
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
}

/* ------------------------------ */
/* Register Form                  */
/* ------------------------------ */

if (registerForm) {
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
}

/* ------------------------------ */
/* Sign In Later                  */
/* ------------------------------ */

if (loginLater) {
  loginLater.addEventListener("click", () => {
    closeLoginPopup();
  });
}

/* ------------------------------ */
/* Require Login for Review Page  */
/* ------------------------------ */

if (window.location.pathname.includes("review.html")) {
  (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) openLoginPopup();
  })();
}

/* ------------------------------ */
/* Magic 8-Ball                   */
/* ------------------------------ */

const eightBall = document.getElementById("eight-ball");
const eightAskBtn = document.getElementById("eight-ask");
const eightAnswer = document.getElementById("eight-answer");

const eightResponses = [
  "Yes.",
  "No.",
  "Maybe.",
  "Ask again later.",
  "Definitely.",
  "Absolutely not.",
  "Probably.",
  "Unclear."
];

function spinEightBall() {
  if (!eightBall) return;
  eightBall.classList.add("spinning");
  setTimeout(() => {
    eightBall.classList.remove("spinning");
    const choice = eightResponses[Math.floor(Math.random() * eightResponses.length)];
    eightAnswer.textContent = choice;
  }, 1000);
}

if (eightAskBtn) {
  eightAskBtn.addEventListener("click", () => {
    const q = document.getElementById("eight-question").value.trim();
    if (!q) {
      alert("Ask a question first.");
      return;
    }
    spinEightBall();
  });
}

if (eightBall) {
  eightBall.addEventListener("click", () => {
    const q = document.getElementById("eight-question").value.trim();
    if (!q) {
      alert("Ask a question first.");
      return;
    }
    spinEightBall();
  });
}

/* ------------------------------ */
/* Weather (your original system) */
/* ------------------------------ */

async function loadWeather() {
  const box = document.getElementById("weather-box");
  const forecastGrid = document.getElementById("forecast-grid");
  if (!box) return;

  const weatherLabels = {
    0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Foggy", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
    75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm"
  };

  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-33.42&longitude=149.58&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Australia/Sydney"
    );
    const data = await res.json();

    const current = data.current;
    const label = weatherLabels[current.weather_code] || "Conditions unclear";

    box.innerHTML = `
      <div class="weather-now">
        <span class="kicker">RIGHT NOW · BATHURST NSW</span>
        <div class="weather-temp">${Math.round(current.temperature_2m)}°C</div>
        <div class="weather-desc">${label}</div>
        <div class="weather-wind">Wind: ${Math.round(current.wind_speed_10m)} km/h</div>
      </div>
    `;

    const daily = data.daily;
    let cards = "";
    for (let i = 0; i < Math.min(4, daily.time.length); i++) {
      const date = new Date(daily.time[i]);
      const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
      const dayName = i === 0 ? "Today" : days[date.getDay()].slice(0,3);
      const dLabel = weatherLabels[daily.weather_code[i]] || "—";
      cards += `
        <article class="story weather-day">
          <span class="kicker">${dayName.toUpperCase()}</span>
          <h3>${dLabel}</h3>
          <p class="dek">High ${Math.round(daily.temperature_2m_max[i])}°C · Low ${Math.round(daily.temperature_2m_min[i])}°C</p>
        </article>
      `;
    }
    forecastGrid.innerHTML = cards;

  } catch (err) {
    box.innerHTML = `<p class="weather-loading">Live feed unavailable right now — check back shortly.</p>`;
  }
}

loadWeather();

/* ------------------------------ */
/* Init                           */
/* ------------------------------ */

refreshUser();
if (navSignin) navSignin.addEventListener("click", openLoginPopup);
