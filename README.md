Pradhan16 AI Trading — reviewed MVP (v1.0)
A mobile-first HTML/CSS/JavaScript paper-trading journal with an optional server-side OpenAI journal reviewer.
Code review: original project
The original MVP was a useful client-side prototype, but the review found several gaps:
The calculator accepted a stop/target on the wrong side of entry and did not account for direction or lot-size steps.
Journal P&L was typed manually, so it could disagree with entry, exit, side, quantity, and costs.
Analytics mixed closed and open trades and did not include profit factor or drawdown.
Mobile navigation hid the Journal tab on small screens.
The review module was rule-based only; calling a model directly from frontend code would expose a secret key.
There was no export/backup flow, server-side request validation, or API rate limit.
This revision addresses those items for an educational prototype. It is not a broker-connected or production-ready financial application.
Features
Dashboard: closed-trade P&L, wins/losses, win rate, max drawdown, recent trades and equity curve.
Risk calculator: directional BUY/SELL validation, risk budget, lot/quantity-step rounding, planned stop risk, reward estimate and exposure estimate.
Paper journal: localStorage persistence, derived P&L from entry/exit/side/quantity/costs, open vs closed status, setup/emotion tags, JSON export, delete and clear controls.
Strategy checklist: eight pre-trade discipline checks and strategy notes.
Analytics: expectancy, profit factor, average win/loss, average R multiple, max drawdown and P&L by setup.
Trade review: local educational fallback works without an API key. Optional AI review calls /api/review on this server.
Security: API key stays in backend environment; request size cap, input length limits, basic Helmet headers, API rate limit, no raw upstream error or key returned to client.
Run locally
Requires Node.js 18 or newer.
npm install
npm run check
cp .env.example .env
# Edit .env only on your backend machine and set OPENAI_API_KEY
npm start
Open http://localhost:3000. If no key is configured, the AI-review button falls back to local educational review. /api/health reports whether a key is configured, but never returns the key.
Never commit .env. Never put OPENAI_API_KEY in public/app.js, HTML, a mobile app bundle, a public GitHub repo, or frontend build variables. If a key has ever been exposed, revoke it and create a replacement.
Android development steps
Option A — easiest for testing
Download and extract this ZIP on your Android device or computer.
Use a code editor such as Acode or another editor to inspect public/index.html, public/styles.css, and public/app.js.
For the local-only features, opening public/index.html may work in a browser, but some Android file viewers restrict JavaScript/storage. Prefer serving it over HTTP for consistent testing.
To test the secure AI route, run the Node backend on a trusted computer or deploy it to a backend host with HTTPS. Set the environment variable there, not on the phone's frontend.
The frontend currently calls the same-origin relative route /api/review. When the frontend and backend are hosted on different origins, configure a same-origin reverse proxy or deliberately set an approved backend URL and add strict CORS/authentication controls before use.
Option B — Android + cloud backend
Keep the frontend in public/ and deploy server.js to a Node.js host.
Add OPENAI_API_KEY in the host's encrypted environment/secrets settings. Do not upload .env.
Serve the frontend and /api/review from the same HTTPS origin where possible.
Before giving access to other users, add real user authentication, per-user data isolation, stricter quotas, monitoring, and privacy/deletion controls. Rate limiting alone is not authentication.
Test invalid inputs, missing key, upstream rate limits, offline state, large text, and API abuse scenarios.
Local data warning
Trades remain in browser localStorage on that device/browser profile. They are not encrypted, synced, or recoverable if browser storage is cleared. Use Export JSON to back up. Do not enter broker passwords, account numbers, or other sensitive data.
Calculation notes
For a closed trade, gross directional P&L is (exit - entry) × quantity for BUY and (entry - exit) × quantity for SELL. Recorded costs are subtracted to obtain net P&L.
Risk calculator quantity is rounded down to the configured quantity step. It estimates stop risk and excludes fees, taxes, slippage, gaps, liquidity, margin, and contract-specific option behavior.
Profit factor is gross positive P&L divided by the absolute gross negative P&L. If there are no losing trades, it is displayed as infinity/not yet established rather than as a normal finite value.
Maximum drawdown is computed from the ordered sequence of closed trades as stored. For meaningful results, keep journal entries in actual execution order.
This app does not fetch live market data, connect to a broker, place orders, or produce trade signals.