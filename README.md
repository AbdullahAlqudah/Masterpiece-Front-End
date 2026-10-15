# Khadra frontend (phase 1)
Open `index.html`, or run `python3 -m http.server` in this folder.
`assets/js/main.js` renders the shared nav/footer (works from file://, easy to move into a Blade layout).
Nested pages (e.g. `ai/chatbot.html`) set `<body data-root="../">` and load scripts via `../assets/...`.
Swap points for Laravel: `mock-data.js` (API data), `storage.js` (persistence), `cart.js` (cart API).
