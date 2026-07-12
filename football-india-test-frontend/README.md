# Football India Web

Basic Vite frontend for the Indian Football Community. It is intentionally a lean starter that can be redesigned and expanded as the product evolves.

```powershell
npm install
npm run dev
```

The UI normally opens at `http://localhost:5173` or the next free port. It calls `http://127.0.0.1:3000/api`; the backend accepts localhost development origins on any port. Set `VITE_API_URL` for a deployed backend.

## Structure

- `src/main.jsx` contains the active single-page app logic and dashboard rendering.
- `src/styles/global.css` contains the shared visual system and responsive layout styles.

Start the backend first from `football-india-backend` with `npm run dev`.
