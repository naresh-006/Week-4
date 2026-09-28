# Bank of Kubera

Bank of Kubera is an educational banking prototype with a static HTML/CSS/JavaScript frontend and a local Express/SQLite API.

## Local Setup

Requirements: Node.js 20.11 or newer and npm.

In PowerShell, from the `bank-of-kubera` folder:

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://127.0.0.1:3000`. The SQLite database is created at `server/data/bank-of-kubera.sqlite` on first start.

Demo sign-in:

- User ID: `demo-user`
- Password: `KuberaDemo123`

Change `SESSION_SECRET` and `DEMO_PASSWORD` in `.env` before sharing the local server. Use `npm test` to run the API tests.

To enable Razorpay's **test checkout**, add your Razorpay test-mode Key ID and Key Secret to `.env` as `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Keep `RAZORPAY_MODE=test`; live keys are intentionally rejected. Never paste payment credentials into chat or commit `.env`.

## Backend

- `server/app.js` — API routes, validation, rate limits, and static frontend serving
- `server/db.js` — SQLite schema, demo seed, and account/transaction queries
- `server/session-store.js` — SQLite-backed HTTP session store
- `server/bank-provider.js` — OneMoney India Account Aggregator status and gated integration boundary
- `server/index.js` — local server entry point

Sign-in uses an HTTP-only, same-site cookie. Passwords are bcrypt-hashed. Account fixtures are only served after authentication; registrations receive empty demo accounts. Contact messages are validated and stored locally. Users may save a local card reference containing only its type, label, and last four digits; full card numbers and CVVs are never accepted. Sample loan categories support saved information requests only and do not run credit checks or approve loans.

Bill checkout creates Razorpay test orders using the server's fixed sample-bill amount. Card entry and any bank verification happen only in Razorpay Checkout; the app does not receive or store PAN, CVV, or OTP. The server verifies Razorpay's payment signature and capture status. A captured test payment is not a bill settlement: the biller/BBPS settlement integration is not configured, and the UI does not mark the utility bill as paid.

## Safety Boundary

This is still a fictional, local educational demo. It is not production-ready, does not move money, and must not be used for real customer data or real credentials. OneMoney India is the selected Account Aggregator; live linking stays disabled pending FIU onboarding and official API/SDK documentation. OneMoney's [public product page](https://www.onemoney.in/) describes an OTP-verified, explicit-consent flow, but does not publish the integration API. Do not collect bank login credentials or OTPs in this app. Production use would require a security review, deployment hardening, privacy/compliance work, and provider approval.

## Project Structure

- `index.html` — public homepage
- `css/` — shared styles
- `js/` — frontend behavior and API client calls
- `pages/` — public and authenticated page templates
- `data/` — fictional demo fixtures, gated by the API when served
- `server/` — Express API and SQLite persistence
