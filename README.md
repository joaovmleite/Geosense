# Geosense

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![GSAP](https://img.shields.io/badge/gsap-88CE02?style=for-the-badge&logo=greensock&logoColor=white) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![Google Chrome](https://img.shields.io/badge/Google%20Chrome-4285F4?style=for-the-badge&logo=GoogleChrome&logoColor=white)


A lightweight, client-first web app that displays current weather by city and curated top news headlines.

## Features

- **Weather by City**: Fetches current conditions from OpenWeather. Units in metric and localized strings.
- **Top Headlines**: Retrieves and filters news from NewsAPI with content cleanup and safety checks.
- **Fast and Simple**: Static frontend (`index.html` + assets) with zero build step.
- **Serverless Backend**: Netlify Functions for weather and news.
- **Responsive UI**: Basic styles and JS interactions, with optional GSAP-powered animations hooks.
- **Keyboard Shortcut for News**: Press `Ctrl + →` to request fresh, unseen news items. `Ctrl + ←` animates in the opposite direction.

## Project Structure

- `index.html` — App shell and UI.
- `public/assets/js/main.js` — Client logic (fetch, render, event binding, animations hooks).
- `public/assets/css/` — Styles
- `public/assets/img/` — Images
- `netlify/functions/weather.js` — `/.netlify/functions/weather` handler.
- `netlify/functions/news.js` — `/.netlify/functions/news` handler.

## API Endpoints

The frontend calls these stable routes (Netlify Functions):

- `GET /.netlify/functions/weather?city=<CityName>`
  - Query params: `city` (default: `Oakland`)
  - Response: raw OpenWeather payload

- `GET /.netlify/functions/news?exclude=["Title1","Title2",...]`
  - Query params:
    - `exclude` (optional): JSON-encoded array of article titles to exclude (case-insensitive)
  - Response: `{ articles: Array<NewsArticle> }` (filtered, cleaned)

Notes:
- If you run the Express server (`index.js`) locally, equivalent proxy routes also exist at `/api/weather` and `/api/news`.

## Implementation Notes

- `netlify/functions/weather.js`
  - Reads `city` from query string; defaults to `Oakland`.
  - Calls OpenWeather with `units=metric` and `lang=pt_br`.
  - 10s timeout and structured error responses.

- `netlify/functions/news.js`
  - Requests top headlines (US) with `pageSize=30` and 10s timeout.
  - Normalizes fields and removes trailing `[...] chars` markers from `content`.
  - Filters to items with meaningful text and excludes any whose titles match `exclude` (case-insensitive).

- `public/assets/js/main.js`
  - Uses `fetch('/.netlify/functions/weather')` and `fetch('/.netlify/functions/news')`.
  - Implements `Ctrl + Arrow` shortcuts to request new, unseen news. Maintains a cache of seen titles in `localStorage` and sends it as `exclude` when requesting fresh items.
  - Provides `escapeHtml` and `escapeAttr` helpers for safe rendering and hooks `window.GeoAnimations?.animateInitial()` / `animateNewsItems()`.

## Copyright © 2025 Geosense