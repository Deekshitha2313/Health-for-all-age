const el = (sel) => document.querySelector(sel);
const tokenKey = 'jwt_token';
const BASE_URL = 'http://localhost:3001'; // <-- your backend URL

function setYear() {
  const y = new Date().getFullYear();
  document.querySelectorAll('#year').forEach(n => n.textContent = y);
}

async function fetchJSON(url, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  const token = localStorage.getItem(tokenKey);
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(BASE_URL + url, { ...opts, headers });
  if (!res.ok) throw new Error((await res.json()).error || 'Request failed');
  return res.json();
}

async function loadArticles() {
  const list = el('#articles');
  if (!list) return;
  try {
    const items = await fetchJSON('/api/articles');
    list.innerHTML = items.map(a => `
      <div class="card">
        <h3>${a.title}</h3>
        <div class="tag">${a.age_group}</div>
        <p>${a.content}</p>
      </div>
    `).join('');
  } catch (e) {
    list.innerHTML = `<div class="card">Failed to load articles: ${e.message}</div>`;
  }
}

function onLoginPage() {
  const loginForm = el('#loginForm');
  const registerForm = el('#registerForm');
  if (!loginForm || !registerForm) return;

  loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(loginForm);
    try {
      const data = await fetchJSON('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(fd))
      });
      localStorage.setItem(tokenKey, data.token);
      window.location.href = '/dashboard.html';
    } catch (e) {
      alert('Login failed: ' + e.message);
    }
  });

  registerForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(registerForm);
    try {
      const data = await fetchJSON('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(fd))
      });
      localStorage.setItem(tokenKey, data.token);
      window.location.href = '/dashboard.html';
    } catch (e) {
      alert('Registration failed: ' + e.message);
    }
  });
}

function onDashboard() {
  const apptForm = el('#apptForm');
  const appts = el('#appts');
  const logoutBtn = el('#logoutBtn');
  const loginLink = el('#loginLink');

  if (!apptForm) return;

  if (localStorage.getItem(tokenKey)) {
    loginLink.style.display = 'none';
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(tokenKey);
    window.location.reload();
  });

  apptForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const fd = new FormData(apptForm);
    try {
      await fetchJSON('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(fd))
      });
      apptForm.reset();
      loadAppointments();
    } catch (e) {
      alert('Booking failed: ' + e.message);
    }
  });

  async function loadAppointments() {
    try {
      const items = await fetchJSON('/api/appointments');
      appts.innerHTML = items.length ? items.map(a => `
        <div class="card">
          <strong>${a.doctor_name}</strong><br/>
          ${a.date} at ${a.time}<br/>
          <span class="tag">${a.status}</span>
          <div>${a.reason || ''}</div>
        </div>
      `).join('') : '<div class="card">No appointments yet.</div>';
    } catch (e) {
      appts.innerHTML = `<div class="card">Failed to load: ${e.message}</div>`;
    }
  }

  loadAppointments();
}

setYear();
loadArticles();
onLoginPage();
onDashboard();
