const normalizeCity = (name = '') => name.trim().toLowerCase().replace(/\s+/g, '+');

const messageForTemp = (t) => {
  if (t <= -5) return 'Bitterly cold outside';
  if (t <= 5) return 'Very cold today';
  if (t <= 12) return 'Pleasantly cool day';
  if (t <= 20) return 'Mild and comfortable';
  if (t <= 28) return 'Nice warm day';
  if (t <= 35) return 'Hot day—keep cool';
  return 'Scorching heat—extreme temps';
};

const updateUI = (tempC) => {
  const tempEl = document.querySelector('.geosense-location-temperature');
  const msgEl = document.querySelector('.geosense-phrases-status');
  if (typeof tempC === 'number' && !Number.isNaN(tempC)) {
    tempEl && (tempEl.textContent = `${Math.round(tempC)} °C`);
    msgEl && (msgEl.textContent = messageForTemp(tempC));
  }
};

const loadWeather = async (cityName = 'Oakland') => {
  try {
    const res = await fetch(`/.netlify/functions/weather?city=${normalizeCity(cityName)}`);
    if (!res.ok) return; // Silent fail
    const data = await res.json();
    const temp = data?.main?.temp;
    if (typeof temp === 'number') updateUI(temp);
  } catch (_) {
  }
};

// ===== News rendering =====
const formatDateDMY = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const renderNews = (articles) => {
  const container = document.querySelector('.geosense-main-component');
  if (!container || !Array.isArray(articles)) return;

  const list = articles
    .filter((a) => a && (a.title || a.description || a.content))
    .slice(0, 4);

  const html = list
    .map((a) => {
      const { title, author, source, publishedAt, description, content, url } = a || {};
      const safeTitle = title || 'Untitled';
      const by = author || source || 'Unknown';
      const published = formatDateDMY(publishedAt);
      const desc = description || content || '';
      const safeUrl = url || '';
      return `
      <section class="geosense-article" data-url="${escapeAttr(safeUrl)}" tabindex="0" role="link" aria-label="Open article: ${escapeAttr(safeTitle)}">
        <h1 class="geosense-article-title">${escapeHtml(safeTitle)}</h1>
        <span class="geosense-article-extrainfo">
          <span class="geosense-article-author">${escapeHtml(by)}</span>
          ${published ? `, <span class=\"geosense-article-publishedAt\">Published on ${published}</span>` : ''}
        </span>
        <p class="geosense-article-paragraph">${escapeHtml(desc)}</p>
      </section>
    `;
    })
    .join('');

  container.innerHTML = html;

  const items = container.querySelectorAll('.geosense-article');

  // Animations and hover/focus affordances
  window.GeoAnimations?.animateNewsItems?.(items);
  window.GeoAnimations?.attachHoverAffordances?.(items);

  // Event delegation for click/keyboard activation
  if (!container.dataset.eventsBound) {
    const openArticle = (el) => {
      const { url } = el.dataset;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    };

    container.addEventListener('click', (e) => {
      const article = e.target.closest?.('.geosense-article');
      if (article) openArticle(article);
    });

    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const article = e.target.closest?.('.geosense-article');
      if (article) {
        e.preventDefault();
        openArticle(article);
      }
    });

    container.dataset.eventsBound = '1';
  }
};

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const escapeAttr = (str) => String(str).replace(/["']/g, '');

const loadNews = async () => {
  try {
    const res = await fetch('/.netlify/functions/news');
    if (!res.ok) return; // Silent fail
    const data = await res.json();
    if (Array.isArray(data?.articles)) renderNews(data.articles);
  } catch (_) {
  }
};

// ===== GSAP Animations =====
const animateInitial = () => window.GeoAnimations?.animateInitial?.();
const animateNewsItems = (nodeList) => window.GeoAnimations?.animateNewsItems?.(nodeList);

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('geosense-location-select');
  loadWeather(select?.value);
  select?.addEventListener('change', ({ target: { value } }) => loadWeather(value));
  window.GeoAnimations?.animateInitial?.();
  loadNews();

  // ===== Terms Modal Wiring =====
  const trigger = document.getElementById('terms-of-usage');
  const modal = document.getElementById('terms-modal');
  const dialog = modal?.querySelector('.gs-modal__dialog');
  const closeBtn = modal?.querySelector('[data-close]');
  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    (closeBtn || dialog)?.focus?.();
    document.addEventListener('keydown', onKeydown);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    lastFocus?.focus?.();
    document.removeEventListener('keydown', onKeydown);
  };

  const onKeydown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  trigger?.addEventListener('click', openModal);
  modal?.addEventListener('click', (e) => {
    const target = e.target;
    if (target?.dataset?.close || target === modal) closeModal();
  });
});