import './styles/global.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:3000/api';
const app = document.getElementById('app');
const CACHE_TTL_MS = 15000;
const responseCache = new Map();

const state = {
  user: readJson('ifc_user'),
  footballTab: 'clubs',
  message: '',
  authMode: 'login',
};

const routes = {
  '#/': renderHome,
  '#/football': renderFootball,
  '#/community': renderCommunity,
  '#/store': renderStore,
  '#/account': renderAccount,
  '#/auth': renderAuth,
};

window.addEventListener('hashchange', render);
document.addEventListener('submit', handleSubmit);
document.addEventListener('click', handleClick);

if (!location.hash) {
  location.hash = '#/';
} else {
  render();
}

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

async function api(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}) };
  const token = localStorage.getItem('ifc_access_token');
  if (token) headers.Authorization = `Bearer ${token}`;
  const cacheKey = method === 'GET' ? `${path}::${token || 'anon'}` : null;

  if (cacheKey) {
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    method,
    headers,
    body: options.body && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
    throw new Error(message || `Request failed (${response.status})`);
  }

  if (cacheKey) {
    responseCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  } else {
    responseCache.clear();
  }

  return data;
}

function collection(payload) {
  return Array.isArray(payload) ? payload : payload?.data || [];
}

function inr(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[char]);
}

function setSession(payload) {
  const session = payload?.session;
  const user = payload?.user || session?.user || null;

  if (session?.access_token) localStorage.setItem('ifc_access_token', session.access_token);
  else localStorage.removeItem('ifc_access_token');

  if (session?.refresh_token) localStorage.setItem('ifc_refresh_token', session.refresh_token);
  else localStorage.removeItem('ifc_refresh_token');

  if (user) localStorage.setItem('ifc_user', JSON.stringify(user));
  else localStorage.removeItem('ifc_user');

  state.user = user;
  responseCache.clear();
}

function layout(content) {
  const signedIn = Boolean(state.user);
  return `
    <header class="site-header">
      <a class="brand" href="#/"><span>IF</span><div>Indian Football<small>Community</small></div></a>
      <nav>
        ${navLink('#/', 'Home')}
        ${navLink('#/football', 'Football')}
        ${navLink('#/community', 'Community')}
        ${navLink('#/store', 'Store')}
      </nav>
      <a class="account-link" href="${signedIn ? '#/account' : '#/auth'}">${signedIn ? 'My account' : 'Sign in'}</a>
    </header>
    <main>${content}</main>
    <footer>
      <div class="brand footer-brand"><span>IF</span><div>Indian Football<small>Community</small></div></div>
      <p>A community platform for everyone who believes in Indian football.</p>
      <p>Copyright ${new Date().getFullYear()} Indian Football Community</p>
    </footer>
  `;
}

function navLink(hash, label) {
  return `<a class="${location.hash === hash ? 'active' : ''}" href="${hash}">${label}</a>`;
}

function render() {
  const view = routes[location.hash] || renderHome;
  app.innerHTML = layout(view());
  view.after?.();
}

function renderHome() {
  if (state.user) {
    renderHome.after = async () => {
      loadPanel('[data-home-welcome]', '/fan-profiles/me/profile', renderHomeWelcome);
      loadPanel('[data-home-notes]', '/notifications', renderHomeNotifications);
      loadPanel('[data-home-table]', '/leaderboard?limit=5', renderHomeTable);
      loadPanel('[data-home-clubs]', '/clubs?limit=4', renderHomeClubs);
      loadPanel('[data-home-stories]', '/blogs?limit=3', renderHomeStories);
      loadPanel('[data-home-store]', '/store/products?limit=3', renderHomeStore);
    };

    return `
      <section class="score-strip">
        <div class="score-strip__inner">
          <span class="score-strip__label">Matchday</span>
          <div class="score-strip__items">
            <span>ISL clubs</span>
            <span>I-League scouting</span>
            <span>Community stories</span>
            <span>National team watch</span>
            <span>Supporter store</span>
          </div>
        </div>
      </section>
      <section class="signed-home-hero">
        <div class="signed-home-hero__copy" data-home-welcome>${loadingCompact()}</div>
        <aside class="hero-side-panel">
          <div class="hero-side-panel__top">
            <span class="overline">Today</span>
            <h3>What matters now</h3>
          </div>
          <div class="hero-side-panel__links">
            <a href="#/football">Track clubs and table</a>
            <a href="#/community">Join supporter stories</a>
            <a href="#/store">Pick up new merch</a>
          </div>
        </aside>
      </section>
      <section class="signed-home-grid">
        <div class="content-column">
          <div class="panel">
            <div class="panel-head"><span class="overline">Live table</span><a href="#/football">Open football</a></div>
            <div data-home-table>${loadingCompact()}</div>
          </div>
          <div class="panel">
            <div class="panel-head"><span class="overline">Top clubs</span><a href="#/football">See all clubs</a></div>
            <div data-home-clubs>${loadingCompact()}</div>
          </div>
          <div class="panel">
            <div class="panel-head"><span class="overline">From the stands</span><a href="#/community">Open community</a></div>
            <div data-home-stories>${loadingCompact()}</div>
          </div>
        </div>
        <div class="rail-column">
          <div class="panel">
            <div class="panel-head"><span class="overline">Notifications</span><a href="#/account">My account</a></div>
            <div data-home-notes>${loadingCompact()}</div>
          </div>
          <div class="panel">
            <div class="panel-head"><span class="overline">Store picks</span><a href="#/store">Open store</a></div>
            <div data-home-store>${loadingCompact()}</div>
          </div>
        </div>
      </section>
    `;
  }

  renderHome.after = async () => {
    const target = document.querySelector('[data-home-clubs]');
    try {
      const clubs = collection(await api('/clubs?limit=4'));
      target.innerHTML = clubs.length ? clubs.map(clubCard).join('') : emptyCard('Your club directory is ready', 'Add clubs through the admin API and they will appear here.');
    } catch (error) {
      target.innerHTML = errorState(error.message);
    }
  };

  return `
    <section class="hero">
      <div>
        <span class="pill">One nation. One game.</span>
        <h1>The home of<br><em>Indian football</em></h1>
        <p>Follow clubs and players, share your voice, and support the game from grassroots to the national team.</p>
        <div class="hero-actions">
          <a class="button" href="#/football">Explore football</a>
          <a class="button ghost" href="#/community">Join the community</a>
        </div>
      </div>
      <div class="hero-art"><div class="ball">Football</div><strong>90'</strong><small>THE GAME IS OURS</small></div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div><span class="overline">Discover</span><h2>Clubs across India</h2></div>
        <a href="#/football">View all</a>
      </div>
      <div class="card-grid" data-home-clubs>${loading()}</div>
    </section>
    <section class="community-cta">
      <span>Built by supporters</span>
      <h2>Football is better when<br>we experience it together.</h2>
      <a class="button light" href="#/auth">Create your account</a>
    </section>
  `;
}

function renderFootball() {
  renderFootball.after = async () => {
    const target = document.querySelector('[data-football-list]');
    const endpoint = { clubs: '/clubs', players: '/players', teams: '/national-teams', table: '/leaderboard' }[state.footballTab];
    try {
      const list = collection(await api(endpoint));
      target.innerHTML = list.length ? list.map(directoryItem).join('') : empty(`No ${state.footballTab} have been added yet.`);
    } catch (error) {
      target.innerHTML = errorState(error.message);
    }
  };

  return `
    <div class="page">
      <div class="page-head">
        <span class="overline">The game</span>
        <h1>Indian football</h1>
        <p>Meet the teams, clubs and players shaping football in India.</p>
      </div>
      <div class="tabs">
        ${tabButton('clubs', 'Clubs')}
        ${tabButton('players', 'Players')}
        ${tabButton('teams', 'National teams')}
        ${tabButton('table', 'Leaderboard')}
      </div>
      <div class="directory" data-football-list>${loading()}</div>
    </div>
  `;
}

function renderCommunity() {
  renderCommunity.after = async () => {
    const target = document.querySelector('[data-blogs]');
    try {
      const blogs = collection(await api('/blogs'));
      target.innerHTML = blogs.length ? blogs.map(blogCard).join('') : empty('No published stories yet. Be the first supporter to contribute.');
    } catch (error) {
      target.innerHTML = errorState(error.message);
    }
  };

  return `
    <div class="page">
      <div class="page-head split">
        <div><span class="overline">From the stands</span><h1>Community stories</h1><p>Opinions, memories and ideas from Indian football supporters.</p></div>
        ${state.user ? '<button data-action="toggle-composer">Write a story</button>' : '<a class="button" href="#/auth">Sign in to write</a>'}
      </div>
      <form class="composer hidden" data-composer data-form="blog">
        <h2>New story</h2>
        <label>Title<input name="title" required></label>
        <label>Your story<textarea name="content" required></textarea></label>
        <button>Save draft</button>
      </form>
      <div class="blog-grid" data-blogs>${loading()}</div>
    </div>
  `;
}

function renderStore() {
  renderStore.after = async () => {
    const target = document.querySelector('[data-products]');
    try {
      const products = collection(await api('/store/products'));
      target.innerHTML = products.length ? products.map(productCard).join('') : empty('The store is ready. Add your first products from the admin API.');
    } catch (error) {
      target.innerHTML = errorState(error.message);
    }
  };

  return `
    <div class="page">
      <div class="page-head"><span class="overline">Wear your passion</span><h1>Supporter store</h1><p>Official community merchandise and Indian football essentials.</p></div>
      ${state.message ? `<div class="notice">${escapeHtml(state.message)}</div>` : ''}
      <div class="products" data-products>${loading()}</div>
    </div>
  `;
}

function renderAuth() {
  if (state.user) {
    location.hash = '#/account';
    return '';
  }

  const submitLabel = state.authMode === 'login' ? 'Sign in' : 'Create account';

  return `
    <div class="auth-page">
      <div class="auth-copy">
        <span class="pill">Welcome to the community</span>
        <h1>Indian football<br>belongs to everyone.</h1>
        <p>Create your supporter profile, join conversations and follow the game you love.</p>
      </div>
      <form class="auth-form" data-form="auth">
        <div class="auth-switch">
          <button type="button" class="${state.authMode === 'login' ? 'active' : ''}" data-auth-mode="login">Sign in</button>
          <button type="button" class="${state.authMode === 'register' ? 'active' : ''}" data-auth-mode="register">Register</button>
        </div>
        <label>Email<input name="email" type="email" required></label>
        <label>Password<input name="password" type="password" minlength="8" required></label>
        <p class="form-error" data-form-error></p>
        <p class="form-info" data-form-info></p>
        <button class="wide-button" data-auth-submit>${submitLabel}</button>
      </form>
    </div>
  `;
}

function renderAccount() {
  if (!state.user) {
    location.hash = '#/auth';
    return '';
  }

  renderAccount.after = async () => {
    loadPanel('[data-profile]', '/fan-profiles/me/profile', renderProfile);
    loadPanel('[data-cart]', '/cart', items => renderLines(collection(items), 'Your cart is empty.', item => `${escapeHtml(item.product?.name || 'Product')}<b>${item.quantity} x ${inr(item.product?.price)}</b>`));
    loadPanel('[data-orders]', '/orders', items => renderLines(collection(items), 'No orders yet.', item => `#${escapeHtml(item.order_number || item.id)}<b>${escapeHtml(item.status || 'pending')}</b>`));
    loadPanel('[data-notifications]', '/notifications', items => renderLines(collection(items).slice(0, 5), 'You are all caught up.', item => `${escapeHtml(item.title || 'Notification')}<small>${escapeHtml(item.message || '')}</small>`));
  };

  return `
    <div class="page">
      <div class="account-head" data-profile>${loading()}</div>
      <div class="dashboard-grid">
        <section class="dashboard-card"><h2>My cart <span data-cart-count>0</span></h2><div data-cart>${loading()}</div></section>
        <section class="dashboard-card"><h2>Orders</h2><div data-orders>${loading()}</div></section>
        <section class="dashboard-card"><h2>Notifications</h2><div data-notifications>${loading()}</div></section>
      </div>
    </div>
  `;
}

async function loadPanel(selector, path, renderer) {
  const target = document.querySelector(selector);
  try {
    target.innerHTML = renderer(await api(path));
  } catch (error) {
    target.innerHTML = errorState(error.message);
  }
}

function renderProfile(profile) {
  const name = profile?.full_name || state.user?.email || 'Supporter';
  return `
    <div class="profile-mark">${escapeHtml(name.slice(0, 1))}</div>
    <div><span class="overline">Supporter profile</span><h1>${escapeHtml(name)}</h1><p>@${escapeHtml(profile?.username || 'football_supporter')}</p></div>
    <button class="outline" data-action="logout">Sign out</button>
  `;
}

function renderLines(items, emptyText, row) {
  return items.length ? items.map(item => `<div class="line">${row(item)}</div>`).join('') : `<p>${escapeHtml(emptyText)}</p>`;
}

function tabButton(id, label) {
  return `<button class="${state.footballTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`;
}

function clubCard(club) {
  const initials = club.short_name?.slice(0, 2) || club.name?.slice(0, 2) || 'IF';
  return `<article class="club-card"><div class="crest">${club.logo_url ? `<img src="${escapeHtml(club.logo_url)}" alt="">` : escapeHtml(initials)}</div><h3>${escapeHtml(club.name)}</h3><p>${escapeHtml(club.city || club.state || 'India')}</p></article>`;
}

function renderHomeWelcome(profile) {
  const name = profile?.full_name || state.user?.email?.split('@')[0] || 'supporter';
  return `
    <span class="pill">Supporter dashboard</span>
    <h1>Welcome back, ${escapeHtml(name)}.</h1>
    <p>Your Indian football feed is now focused on standings, clubs, stories, and community activity instead of signup prompts.</p>
    <div class="hero-actions">
      <a class="button" href="#/football">View table</a>
      <a class="button ghost" href="#/community">Read stories</a>
    </div>
  `;
}

function renderHomeNotifications(items) {
  const notifications = collection(items).slice(0, 4);
  if (!notifications.length) return emptyCompact('You are all caught up.');
  return notifications.map(item => `<div class="news-row"><strong>${escapeHtml(item.title || 'Update')}</strong><p>${escapeHtml(item.message || '')}</p></div>`).join('');
}

function renderHomeTable(payload) {
  const rows = collection(payload).slice(0, 5);
  if (!rows.length) return emptyCompact('Leaderboard entries will appear here.');
  return rows.map((row, index) => `<div class="table-row"><span>${index + 1}</span><strong>${escapeHtml(row.name || row.club?.name || 'Club')}</strong><b>${escapeHtml(String(row.points || 0))} pts</b></div>`).join('');
}

function renderHomeClubs(payload) {
  const clubs = collection(payload).slice(0, 4);
  if (!clubs.length) return emptyCompact('Add clubs to start building the directory.');
  return `<div class="mini-club-grid">${clubs.map(club => `<article class="mini-club-card"><div class="crest">${club.logo_url ? `<img src="${escapeHtml(club.logo_url)}" alt="">` : escapeHtml((club.short_name || club.name || 'IF').slice(0, 2))}</div><h3>${escapeHtml(club.name || 'Club')}</h3><p>${escapeHtml(club.city || club.state || 'India')}</p></article>`).join('')}</div>`;
}

function renderHomeStories(payload) {
  const stories = collection(payload).slice(0, 3);
  if (!stories.length) return emptyCompact('No published stories yet.');
  return stories.map(story => `<article class="story-row"><span class="overline">Community</span><h3>${escapeHtml(story.title || 'Story')}</h3><p>${escapeHtml(story.excerpt || story.content?.slice(0, 140) || '')}</p></article>`).join('');
}

function renderHomeStore(payload) {
  const items = collection(payload).slice(0, 3);
  if (!items.length) return emptyCompact('Store products will show up here.');
  return items.map(item => `<div class="store-row"><div><strong>${escapeHtml(item.name || 'Product')}</strong><p>${escapeHtml(item.description || 'Supporter merchandise')}</p></div><b>${inr(item.price)}</b></div>`).join('');
}

function directoryItem(item) {
  const name = item.name || item.club?.name || 'Unnamed';
  const meta = item.position || item.city || item.team_type || `${item.points || 0} points`;
  const image = item.logo_url || item.photo_url;
  return `<article><div class="avatar">${image ? `<img src="${escapeHtml(image)}" alt="">` : escapeHtml(name.slice(0, 2))}</div><div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(meta)}</p></div></article>`;
}

function blogCard(blog) {
  const date = new Date(blog.published_at || blog.created_at || Date.now()).toLocaleDateString('en-IN');
  return `<article>${blog.cover_image_url ? `<img src="${escapeHtml(blog.cover_image_url)}" alt="">` : ''}<span class="overline">Community</span><h2>${escapeHtml(blog.title)}</h2><p>${escapeHtml(blog.excerpt || blog.content?.slice(0, 150) || '')}</p><small>${date}</small></article>`;
}

function productCard(product) {
  return `<article><div class="product-image">${product.image_url ? `<img src="${escapeHtml(product.image_url)}" alt="">` : '<span>IF</span>'}</div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || 'Indian Football Community merchandise')}</p><div><b>${inr(product.price)}</b><button data-add-cart="${escapeHtml(product.id)}">Add to cart</button></div></article>`;
}

function loading() {
  return '<div class="state">Loading...</div>';
}

function loadingCompact() {
  return '<div class="compact-state">Loading...</div>';
}

function empty(message) {
  return `<div class="state">${escapeHtml(message)}</div>`;
}

function emptyCard(title, message) {
  return `<div class="empty-card"><b>${escapeHtml(title)}</b><p>${escapeHtml(message)}</p></div>`;
}

function errorState(message) {
  return `<div class="state error">${escapeHtml(message)}</div>`;
}

function emptyCompact(message) {
  return `<div class="compact-state">${escapeHtml(message)}</div>`;
}

async function handleSubmit(event) {
  const form = event.target.closest('form');
  if (!form) return;
  event.preventDefault();

  if (form.dataset.form === 'auth') {
    await submitAuth(form);
  }
  if (form.dataset.form === 'blog') {
    await submitBlog(form);
  }
}

async function submitAuth(form) {
  const mode = state.authMode || 'login';
  const error = form.querySelector('[data-form-error]');
  const info = form.querySelector('[data-form-info]');
  error.textContent = '';
  info.textContent = '';

  const body = Object.fromEntries(new FormData(form));
  body.email = normalizeEmail(body.email);

  delete body.fullName;
  delete body.username;

  try {
    const result = await api(mode === 'login' ? '/auth/login' : '/auth/register', { method: 'POST', body });
    setSession(result);
    location.hash = '#/account';
  } catch (err) {
    error.textContent = formatAuthError(err.message, mode);
  }
}

async function submitBlog(form) {
  try {
    await api('/blogs', { method: 'POST', body: Object.fromEntries(new FormData(form)) });
    form.reset();
    render();
  } catch (error) {
    alert(error.message);
  }
}

async function handleClick(event) {
  const action = event.target.dataset.action;
  if (action === 'logout') {
    try {
      await api('/auth/logout', { method: 'POST' });
    } finally {
      setSession(null);
      location.hash = '#/auth';
    }
  }

  if (action === 'toggle-composer') {
    document.querySelector('[data-composer]')?.classList.toggle('hidden');
  }

  if (event.target.dataset.tab) {
    state.footballTab = event.target.dataset.tab;
    render();
  }

  if (event.target.dataset.authMode) {
    const mode = event.target.dataset.authMode;
    state.authMode = mode;
    render();
  }

  if (event.target.dataset.addCart) {
    if (!state.user) {
      state.message = 'Sign in to add products to your cart.';
      render();
      return;
    }

    try {
      await api('/cart', { method: 'POST', body: { productId: event.target.dataset.addCart, quantity: 1 } });
      state.message = 'Added to your cart.';
    } catch (error) {
      state.message = error.message;
    }
    render();
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function formatAuthError(message, mode) {
  const normalized = String(message || '').toLowerCase();

  if (normalized.includes('email rate limit exceeded')) {
    return mode === 'register'
      ? 'Too many signup attempts were made. Please wait a few minutes before trying again.'
      : 'Too many login attempts were made. Please wait a few minutes and try again.';
  }

  return message;
}
