// ---------- Supabase Setup ----------
const SUPABASE_URL = "https://zjyqbddvrhkyewmdsilq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqeXFiZGR2cmhreWV3bWRzaWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTg3MDAsImV4cCI6MjEwMzE5NDcwMH0.VtZ-vS4Mv7AZDG_4NmQioAv6km93R0BKutpqIQxN5t0";

const ADMIN_EMAIL = "will.simeonidis@gmail.com";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- DOM Helper ----------
function $(id) {
  return document.getElementById(id);
}

// ---------- Popup ----------
function openLoginPopup() {
  const popup = $("login-popup");
  if (popup) popup.style.display = "flex";
}
function closeLoginPopup() {
  const popup = $("login-popup");
  if (popup) popup.style.display = "none";
}

// ---------- Auth ----------
async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) throw error;
  return data;
}

async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

async function logoutUser() {
  await supabase.auth.signOut();
}

// ---------- Submissions ----------
async function submitReview(title, body) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) {
    alert("You must be signed in.");
    return;
  }

  const { error } = await supabase
    .from("submissions")
    .insert({
      user_id: user.user.id,
      title,
      body,
      status: "pending"
    });

  if (error) {
    alert("Error submitting: " + error.message);
    return;
  }

  alert("Submitted!");
  loadUserSubmissions();
}

// ---------- Load user submissions ----------
async function loadUserSubmissions() {
  const list = $("user-submissions");
  if (!list) return;

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });

  list.innerHTML = "";

  if (error || !data.length) {
    list.innerHTML = "<p class='dek'>No submissions yet.</p>";
    return;
  }

  data.forEach(sub => {
    const div = document.createElement("div");
    div.className = "submission-card";
    div.innerHTML = `
      <span class="kicker">${sub.status.toUpperCase()}</span>
      <h3>${sub.title}</h3>
      <p class="dek">${sub.body}</p>
    `;
    list.appendChild(div);
  });
}

// ---------- Admin: load ALL submissions ----------
async function loadAdminSubmissions() {
  const list = $("admin-submissions");
  if (!list) return;

  const { data: user } = await supabase.auth.getUser();
  if (!user.user || user.user.email !== ADMIN_EMAIL) {
    list.innerHTML = "<p class='dek'>Admin only.</p>";
    return;
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false });

  list.innerHTML = "";

  if (error || !data.length) {
    list.innerHTML = "<p class='dek'>No submissions yet.</p>";
    return;
  }

  data.forEach(sub => {
    const div = document.createElement("div");
    div.className = "submission-card admin";
    div.innerHTML = `
      <span class="kicker">${sub.status.toUpperCase()}</span>
      <h3>${sub.title}</h3>
      <p class="dek">${sub.body}</p>
    `;
    list.appendChild(div);
  });
}

// ---------- Auth State Listener ----------
supabase.auth.onAuthStateChange(async (event, session) => {
  const navSignIn = $("nav-signin");
  const navAccount = $("nav-account");
  const profileEmail = $("profile-email");

  if (session && session.user) {
    if (navSignIn) navSignIn.style.display = "none";
    if (navAccount) {
      navAccount.style.display = "inline-block";
      navAccount.textContent = session.user.email;
    }
    if (profileEmail) profileEmail.textContent = session.user.email;

    loadUserSubmissions();
    loadAdminSubmissions();
  } else {
    if (navSignIn) navSignIn.style.display = "inline-block";
    if (navAccount) navAccount.style.display = "none";
  }
});

// ---------- Event Listeners ----------
window.addEventListener("DOMContentLoaded", () => {
  if ($("login-popup")) openLoginPopup();

  const loginForm = $("login-form");
  const registerForm = $("register-form");
  const loginLater = $("login-later");
  const logoutBtn = $("logout-btn");
  const submitBtn = $("submit-review-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await loginUser($("login-email").value, $("login-password").value);
        closeLoginPopup();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await registerUser($("register-email").value, $("register-password").value);
        alert("Registered! Check your email for confirmation.");
        closeLoginPopup();
      } catch (err) {
        alert(err.message);
      }
    });
  }

  if (loginLater) {
    loginLater.addEventListener("click", () => closeLoginPopup());
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await logoutUser();
      alert("Signed out.");
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const title = $("review-title").value;
      const body = $("review-body").value;
      if (!title || !body) {
        alert("Fill in both fields.");
        return;
      }
      await submitReview(title, body);
    });
  }
});
