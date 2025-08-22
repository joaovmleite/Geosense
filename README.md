# Geosense

A lightweight, client-first web app that displays current weather by city and curated top news headlines.

## Features

- **Weather by City**: Fetches current conditions from OpenWeather. Units in metric and localized strings.
- **Top Headlines**: Retrieves and filters news from NewsAPI with content cleanup and safety checks.
- **Fast and Simple**: Static frontend (`index.html` + assets) with zero build step.
- **Serverless Backend**: `/api/*` routes backed by Netlify Functions.
- **Responsive UI**: Basic styles and JS interactions, with optional GSAP-powered animations hooks.

## Project Structure

- `index.html` — App shell and UI.
- `public/assets/js/main.js` — Client logic (fetch, render, event binding, animations hooks).
- `public/assets/css/` — Styles
- `public/assets/img/` — Images
- `netlify/functions/weather.js` — `/.netlify/functions/weather` handler.
- `netlify/functions/news.js` — `/.netlify/functions/news` handler.

## API Endpoints

The frontend calls these stable routes.

- `GET /api/weather?city=<CityName>`
  - Proxies to `/.netlify/functions/weather`
  - Query params: `city` (default: `Oakland`)
  - Response: raw OpenWeather payload

- `GET /api/news`
  - Proxies to `/.netlify/functions/news`
  - Response: `{ articles: Array<NewsArticle> }` (filtered and cleaned, up to 4)

## Implementation Notes

- `netlify/functions/weather.js`
  - Reads `city` from query string; defaults to `Oakland`.
  - Calls OpenWeather with `units=metric` and `lang=pt_br`.
  - 10s timeout and structured error responses.

- `netlify/functions/news.js`
  - Requests top headlines (US) with `pageSize=30` and 10s timeout.
  - Normalizes fields and removes trailing `[...] chars` markers from `content`.
  - Filters to items with meaningful text and returns up to 4.

- `public/assets/js/main.js`
  - Uses `fetch('/api/weather')` and `fetch('/api/news')`;
  - Provides `escapeHtml` and `escapeAttr` helpers for safe rendering.
  - Hooks `window.GeoAnimations?.animateInitial()` and `animateNewsItems()`.

## Copyright © 2025 Geosense