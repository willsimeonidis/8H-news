// --------------------------------------------------
// SUPABASE SETUP
// --------------------------------------------------

const supabaseUrl = "https://zjyqbddvrhkyewmdsilq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeXFiZGR2cmhreWV3bWRzaWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTg3MDAsImV4cCI6MjEwMzE5NDcwMH0.VtZ-vS4Mv7AZDG_4NmQioAv6km93R0BKutpqIQxN5t0";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

supabase.auth.getUser().then(console.log);

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
      password,
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
      password,
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    navSignin.style.display = "none";
    navAccount.style.display = "inline";
    navAccount.text = user.email;
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

    const reviewTitle = document.getElementById("review-title").value;
    const reviewBody = document.getElementById("review-body").value;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be signed in.");
      return;
    }

    const { error } = await supabase.from("review").insert({
      user_id: user.id,
      title: reviewTitle,
      body: reviewBody,
      status: "pending"
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
  "Sources decline to comment.",
  "Absolutely yes",
  "No chance at all",
  "Ask again later",
  "The birds say no",
  "Lucas has not returned, so yes",
  "Probably not",
  "Definitely",
  "Surprisingly yes",
  "Not in this lifetime",
  "Maybe… if you survive recess",
  "The hallway creatures say yes",
  "The NPCs disagree",
  "Try again, skill issue detected",
  "Absolutely yes",
  "Definitely no",
      "Maybe, but only on Tuesdays",
      "Possibly, if the birds allow it",
      "Yes, but with consequences",
      "No chance at all",
      "Probably yes",
      "Probably not",
      "Surprisingly yes",
      "Surprisingly no",
      "Maybe… if you survive recess",
      "Possibly, but don’t count on it",
      "Yes, but barely",
      "No, not in this lifetime",
      "Maybe later",
      "Possibly tomorrow",
      "Yes, according to hallway sources",
      "No, according to the plovers",
      "Maybe… skill issue detected",
      "Possibly, but the NPCs disagree",
      "Yes, but only if Cody stops running",
      "No, Lucas has not returned",
      "Maybe, but the vibe is off",
      "Possibly, but the chaos meter is high",
      "Yes, but it’s a risky yes",
      "No, the birds say no",
      "Maybe, but ask again later",
      "Possibly, but the teachers are watching",
      "Yes, but only if you’re lucky",
      "No, unlucky moment",
      "Maybe, but it’s complicated",
      "Possibly, but the hallway creatures object",
      "Yes, but don’t tell anyone",
      "No, absolutely not",
      "Maybe… depends on the weather",
      "Possibly, but recess drama may interfere",
      "Yes, confirmed by the oval",
      "No, confirmed by the lunch table",
      "Maybe, but the universe is undecided",
      "Possibly, but the plovers are circling",
      "Yes, but only with permission",
      "No, denied by fate",
      "Maybe, but only if you try again",
      "Possibly, but the NPCs are lagging",
      "Yes, but barely holding on",
      "No, not happening today",
      "Maybe… if you believe hard enough",
      "Possibly, but the chaos gods say maybe",
      "Yes, but it’s a weird yes",
      "No, it’s a strong no",
      "Maybe, but the answer is blurry",
      "Possibly, but results are inconclusive",
      "Yes, but don’t rely on it",
      "No, the system rejected your request",
      "Maybe… if Cody stops screaming",
      "Possibly, but the birds disagree",
      "Yes, but only in theory",
      "No, not even close",
      "Maybe, but the hallway echo says no",
      "Possibly, but the vibe check failed",
      "Yes, but only if Lucas attends school",
      "No, because Lucas didn’t attend school",
      "Maybe… but the plovers decide",
      "Possibly, but danger level is high",
      "Yes, but it’s a chaotic yes",
      "No, chaos prevents it",
      "Maybe, but the answer is unstable",
      "Yes, but only if you dodge the birds",
      "No, because Cody didn’t",
      "Maybe… but the NPCs are confused",
      "Possibly, but recess is unpredictable",
      "Yes, but only if you’re fast enough",
      "No, too slow",
      "Maybe, but the hallway spirits whisper no",
      "Possibly, but the lunch table says yes",
      "Yes, but only if the teacher isn’t looking",
      "No, teacher detected",
      "Maybe… but the plovers are watching",
      "Possibly, but the oval is cursed",
      "Yes, but it’s a fragile yes",
      "No, it’s a permanent no",
      "Maybe, but the universe rolled a 3",
      "1 in 100 awa stinks moment",
      "Possibly, but the chaos rolled a 7",
      "Yes, but only if you hydrate",
      "No, dehydration detected",
      "Maybe… but the answer ran away",
      "Possibly, but the birds chased it",
      "Yes, but only if you believe",
      "No, disbelief detected",
      "Maybe, but the hallway temperature is wrong",
      "Possibly, but the wildlife disagrees",
      "Yes, but only if you’re built different",
      "No, you are not built different",
      "Maybe… but the plovers vote no",
      "Possibly, but the NPC council votes yes",
      "Yes, final answer",
      "No, final answer",
      "Maybe… final answer",
      "Possibly… final answer"
];

function eightBallReply() {
  const q = document.getElementById("eight-question").value.trim();

  if (q.length === 0) {
    eightAnswer.textContent = "Ask a question.";
    return;
  }

  const r = responses[Math.floor(Math.random() * responses.length)];
  eightAnswer.textContent = r;
}

if (eightAsk) eightAsk.addEventListener("click", eightBallReply);
if (eightBall) eightBall.addEventListener("click", eightBallReply);
