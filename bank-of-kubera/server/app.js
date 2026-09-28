const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const bcrypt = require("bcryptjs");
const express = require("express");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const helmet = require("helmet");
const SQLiteSessionStore = require("./session-store");
const { getProviderStatus } = require("./bank-provider");
const loanProducts = require("./loan-products");
const { createRazorpayGateway } = require("./razorpay");
const { listAccounts, listCards, listLoanApplications, listTransactions, readFixture, toPublicUser } = require("./db");

const SESSION_MAX_AGE = 30 * 60 * 1000;
const allowedFixtures = new Set([
  "demo-billers.json",
  "demo-cards.json",
  "demo-help.json",
  "demo-investments.json",
  "demo-loans.json",
  "demo-login-activity.json",
  "demo-notifications.json",
  "demo-search.json",
  "demo-user.json",
]);

const userById = (database, userId) => database.prepare("SELECT * FROM users WHERE id = ?").get(userId);

function createApp({ database, publicRoot = path.resolve(__dirname, ".."), sessionSecret = process.env.SESSION_SECRET, razorpayGateway = createRazorpayGateway() } = {}) {
  if (!database) throw new Error("A SQLite database connection is required.");
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set in production.");
  }

  const app = express();
  const sessionStore = new SQLiteSessionStore(database, SESSION_MAX_AGE);
  app.disable("x-powered-by");

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com", "https://checkout-static-next.razorpay.com", "https://lumberjack.razorpay.com"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "https://checkout.razorpay.com", "https://cdn.razorpay.com", "https://checkout-static-next.razorpay.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        frameSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
      },
    },
  }));
  app.use(express.json({ limit: "20kb" }));
  app.use(session({
    name: "kubera.sid",
    secret: sessionSecret || "local-development-only-change-this-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
    },
  }));

  app.use((request, response, next) => {
    const origin = request.get("origin");
    if (origin && new URL(origin).host !== request.get("host")) {
      return response.status(403).json({ error: "Cross-origin requests are not allowed." });
    }
    return next();
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many sign-in attempts. Try again in 15 minutes." },
  });
  const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many messages. Try again later." },
  });

  const requireAuthentication = (request, response, next) => {
    if (!request.session.userId) {
      return response.status(401).json({ error: "Sign in to access this resource." });
    }
    const user = userById(database, request.session.userId);
    if (!user) {
      request.session.destroy(() => {});
      return response.status(401).json({ error: "Your session has expired. Sign in again." });
    }
    request.user = user;
    return next();
  };

  const establishSession = (request, userId) => new Promise((resolve, reject) => {
    request.session.regenerate((regenerateError) => {
      if (regenerateError) return reject(regenerateError);
      request.session.userId = userId;
      request.session.save((saveError) => saveError ? reject(saveError) : resolve());
    });
  });

  app.get("/api/health", (_request, response) => response.json({ status: "ok", mode: "demo" }));

  app.post("/api/auth/register", async (request, response, next) => {
    const displayName = String(request.body?.name || "").trim();
    const email = String(request.body?.email || "").trim().toLowerCase();
    const phone = String(request.body?.phone || "").trim();
    const password = String(request.body?.password || "");

    if (displayName.length < 2 || displayName.length > 80 || !/^\S+@\S+\.\S+$/.test(email) || phone.length < 7 || phone.length > 30) {
      return response.status(400).json({ error: "Enter a valid name, email, and phone number." });
    }
    if (password.length < 12 || password.length > 128) {
      return response.status(400).json({ error: "Use a password between 12 and 128 characters." });
    }

    try {
      const userId = randomUUID();
      const customerId = `KUB-${randomUUID().slice(0, 8).toUpperCase()}`;
      const passwordHash = await bcrypt.hash(password, 12);
      const createdAt = new Date().toISOString();
      const createUser = database.transaction(() => {
        database.prepare(`
          INSERT INTO users (id, user_id, display_name, email, phone, password_hash, is_demo, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?)
        `).run(userId, customerId, displayName, email, phone, passwordHash, createdAt);

        const insertAccount = database.prepare(`
          INSERT INTO accounts (id, user_id, type, name, masked_number, balance, available_balance, currency, status)
          VALUES (?, ?, ?, ?, ?, 0, 0, 'INR', 'Active')
        `);
        insertAccount.run(randomUUID(), userId, "Checking", "Checking Account", "**** 0001");
        insertAccount.run(randomUUID(), userId, "Savings", "Savings Account", "**** 0002");
      });
      createUser();
      await establishSession(request, userId);
      return response.status(201).json({ user: toPublicUser(userById(database, userId)) });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return response.status(409).json({ error: "An account with that email already exists." });
      }
      return next(error);
    }
  });

  app.post("/api/auth/login", loginLimiter, async (request, response, next) => {
    const identifier = String(request.body?.identifier || "").trim();
    const password = String(request.body?.password || "");
    if (!identifier || !password) return response.status(400).json({ error: "Enter your email or user ID and password." });

    try {
      const user = database.prepare("SELECT * FROM users WHERE email = ? OR user_id = ?").get(identifier, identifier);
      const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;
      if (!passwordMatches) return response.status(401).json({ error: "Those credentials were not recognized." });
      await establishSession(request, user.id);
      return response.json({ user: toPublicUser(user) });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/auth/me", requireAuthentication, (request, response) => {
    response.json({ user: toPublicUser(request.user) });
  });

  app.post("/api/auth/logout", (request, response, next) => {
    request.session.destroy((error) => {
      if (error) return next(error);
      response.clearCookie("kubera.sid", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
      return response.status(204).end();
    });
  });

  app.get("/api/accounts", requireAuthentication, (request, response) => {
    response.json({ accounts: listAccounts(database, request.user.id) });
  });

  app.get("/api/transactions", requireAuthentication, (request, response) => {
    const requestedLimit = Number.parseInt(request.query.limit, 10);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50;
    response.json({ transactions: listTransactions(database, request.user.id, limit) });
  });

  app.get("/api/billers", requireAuthentication, (request, response) => {
    response.json({ billers: request.user.is_demo ? readFixture("demo-billers.json") : [] });
  });

  app.get("/api/payments/config", requireAuthentication, (_request, response) => {
    response.json(razorpayGateway.getConfig());
  });

  app.post("/api/payments/orders", requireAuthentication, async (request, response, next) => {
    const gatewayConfig = razorpayGateway.getConfig();
    if (!gatewayConfig.available) {
      return response.status(503).json({ error: gatewayConfig.message, code: "RAZORPAY_TEST_KEYS_REQUIRED" });
    }

    const billerId = String(request.body?.billerId || "");
    const billers = request.user.is_demo ? readFixture("demo-billers.json") : [];
    const biller = billers.find((item) => item.id === billerId);
    if (!biller) return response.status(404).json({ error: "That bill is not available for this profile." });

    const amountPaise = Math.round(biller.amount * 100);
    if (!Number.isSafeInteger(amountPaise) || amountPaise < 100) {
      return response.status(400).json({ error: "The bill amount is not valid for checkout." });
    }

    try {
      const providerOrder = await razorpayGateway.createOrder({
        amount: amountPaise,
        currency: biller.currency,
        receipt: `kubera_${randomUUID().replaceAll("-", "").slice(0, 28)}`,
        notes: { biller_id: biller.id },
      });
      if (!providerOrder?.id || providerOrder.amount !== amountPaise || providerOrder.currency !== biller.currency) {
        return response.status(502).json({ error: "Razorpay returned an invalid order." });
      }

      const id = randomUUID();
      const createdAt = new Date().toISOString();
      database.prepare(`
        INSERT INTO payment_orders (id, user_id, biller_id, biller_name, amount_paise, currency, provider_order_id, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'created', ?, ?)
      `).run(id, request.user.id, biller.id, biller.name, amountPaise, biller.currency, providerOrder.id, createdAt, createdAt);

      return response.status(201).json({
        order: {
          id: providerOrder.id,
          amount: amountPaise,
          currency: biller.currency,
          billerName: biller.name,
          keyId: gatewayConfig.keyId,
          mode: "test",
        },
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/payments/verify", requireAuthentication, async (request, response, next) => {
    const orderId = String(request.body?.razorpay_order_id || "");
    const paymentId = String(request.body?.razorpay_payment_id || "");
    const signature = String(request.body?.razorpay_signature || "");
    if (!orderId || !paymentId || !signature) {
      return response.status(400).json({ error: "Razorpay payment verification details are incomplete." });
    }

    const order = database.prepare(`
      SELECT id, biller_name AS billerName, amount_paise AS amountPaise, currency, provider_order_id AS providerOrderId, status
      FROM payment_orders WHERE user_id = ? AND provider_order_id = ?
    `).get(request.user.id, orderId);
    if (!order) return response.status(404).json({ error: "Payment order not found." });
    if (!razorpayGateway.verifyPaymentSignature(order.providerOrderId, paymentId, signature)) {
      return response.status(400).json({ error: "Razorpay payment signature is invalid." });
    }
    if (order.status === "captured") {
      return response.json({ status: "captured", message: "This Razorpay test payment was already verified." });
    }

    try {
      const payment = await razorpayGateway.fetchPayment(paymentId);
      if (payment.order_id !== order.providerOrderId || payment.amount !== order.amountPaise || payment.currency !== order.currency) {
        return response.status(409).json({ error: "Razorpay payment does not match this bill order." });
      }

      const updatedAt = new Date().toISOString();
      if (payment.status === "captured") {
        database.prepare(`
          UPDATE payment_orders SET provider_payment_id = ?, status = 'captured', updated_at = ? WHERE id = ?
        `).run(paymentId, updatedAt, order.id);
        return response.json({
          status: "captured",
          message: `Razorpay captured the test payment for ${order.billerName}. The biller itself has not been paid; bill settlement is not integrated.`,
        });
      }

      const status = payment.status === "failed" ? "failed" : payment.status === "authorized" ? "authorized" : "pending";
      database.prepare(`
        UPDATE payment_orders SET provider_payment_id = ?, status = ?, updated_at = ? WHERE id = ?
      `).run(paymentId, status, updatedAt, order.id);
      if (status === "failed") return response.status(402).json({ status, message: "Razorpay did not capture this test payment." });
      return response.status(202).json({ status, message: "Payment is not captured yet. Do not treat this bill as paid." });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/api/cards", requireAuthentication, (request, response) => {
    const savedCards = listCards(database, request.user.id);
    if (request.user.is_demo) {
      return response.json([
        ...readFixture("demo-cards.json").map((card) => ({ ...card, isDemoCard: true })),
        ...savedCards,
      ]);
    }
    return response.json(savedCards);
  });

  app.post("/api/cards", requireAuthentication, (request, response) => {
    const cardType = String(request.body?.cardType || "");
    const lastFour = String(request.body?.lastFour || "");
    const label = String(request.body?.label || "").trim();
    if (!['Debit', 'Credit'].includes(cardType) || !/^\d{4}$/.test(lastFour) || label.length < 2 || label.length > 40) {
      return response.status(400).json({ error: "Choose a card type, enter a short label, and provide exactly the last four digits." });
    }

    const card = {
      id: randomUUID(),
      userId: request.user.id,
      cardType,
      label,
      lastFour,
      status: "Reference only",
      createdAt: new Date().toISOString(),
    };
    database.prepare(`
      INSERT INTO cards (id, user_id, card_type, label, last_four, status, created_at)
      VALUES (@id, @userId, @cardType, @label, @lastFour, @status, @createdAt)
    `).run(card);
    return response.status(201).json({
      card: {
        id: card.id,
        cardType: card.cardType,
        label: card.label,
        lastFour: card.lastFour,
        status: card.status,
        createdAt: card.createdAt,
      },
    });
  });

  app.get("/api/loan-products", requireAuthentication, (_request, response) => {
    response.json({ products: loanProducts });
  });

  app.get("/api/loan-applications", requireAuthentication, (request, response) => {
    response.json({ applications: listLoanApplications(database, request.user.id) });
  });

  app.post("/api/loan-applications", requireAuthentication, (request, response) => {
    const productId = String(request.body?.productId || "");
    if (!loanProducts.some((product) => product.id === productId)) {
      return response.status(400).json({ error: "Choose one of the available sample loan categories." });
    }

    const application = {
      id: randomUUID(),
      userId: request.user.id,
      productId,
      status: "Information requested",
      createdAt: new Date().toISOString(),
    };
    try {
      database.prepare(`
        INSERT INTO loan_applications (id, user_id, product_id, status, created_at)
        VALUES (@id, @userId, @productId, @status, @createdAt)
      `).run(application);
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return response.status(409).json({ error: "You have already requested information about this sample option." });
      }
      throw error;
    }
    return response.status(201).json({
      application: {
        id: application.id,
        productId: application.productId,
        status: application.status,
        createdAt: application.createdAt,
      },
      message: "Your sample information request has been recorded. This is not a credit application or approval.",
    });
  });

  app.get("/api/bank-connections", requireAuthentication, (_request, response) => {
    response.json(getProviderStatus());
  });

  app.post("/api/bank-connections/link", requireAuthentication, (_request, response) => {
    response.status(503).json({
      error: getProviderStatus().message,
      code: "BANK_PROVIDER_NOT_CONFIGURED",
    });
  });

  app.get("/data/:filename", requireAuthentication, (request, response, next) => {
    const filename = request.params.filename;
    if (!/^demo-[a-z-]+\.json$/.test(filename)) return response.status(404).json({ error: "Dataset not found." });

    try {
      if (filename === "demo-user.json") {
        const fixture = request.user.is_demo ? readFixture(filename) : {};
        return response.json({
          ...fixture,
          id: request.user.id,
          customerId: request.user.user_id,
          displayName: request.user.display_name,
          email: request.user.email,
          phone: request.user.phone,
          customerType: request.user.customer_type,
          isDemo: Boolean(request.user.is_demo),
        });
      }
      if (filename === "demo-accounts.json") return response.json(listAccounts(database, request.user.id));
      if (filename === "demo-transactions.json") return response.json(listTransactions(database, request.user.id));
      if (!allowedFixtures.has(filename)) return response.status(404).json({ error: "Dataset not found." });
      if (!request.user.is_demo && [
        "demo-billers.json",
        "demo-cards.json",
        "demo-investments.json",
        "demo-loans.json",
        "demo-login-activity.json",
        "demo-notifications.json",
      ].includes(filename)) {
        return response.json([]);
      }

      if (!request.user.is_demo && filename === "demo-user.json") {
        return response.json({
          id: request.user.id,
          customerId: request.user.user_id,
          displayName: request.user.display_name,
          email: request.user.email,
          phone: request.user.phone,
          customerType: request.user.customer_type,
          isDemo: false,
        });
      }

      const fixture = readFixture(filename);
      if (filename === "demo-cards.json") {
        if (!request.user.is_demo) return response.json([]);
        return response.json(fixture.map((card) => ({ ...card, holderName: request.user.display_name.toUpperCase() })));
      }
      if (filename === "demo-login-activity.json" && !request.user.is_demo) return response.json([]);
      return response.json(fixture);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/api/contact", contactLimiter, (request, response) => {
    const name = String(request.body?.name || "").trim();
    const email = String(request.body?.email || "").trim().toLowerCase();
    const subject = String(request.body?.subject || "").trim();
    const message = String(request.body?.message || "").trim();
    if (name.length < 2 || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || subject.length < 3 || subject.length > 120 || message.length < 10 || message.length > 4000) {
      return response.status(400).json({ error: "Check the contact details and message, then try again." });
    }
    database.prepare(`
      INSERT INTO contacts (id, name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(randomUUID(), name, email, subject, message, new Date().toISOString());
    return response.status(201).json({ message: "Your message has been received." });
  });

  app.use("/api", (_request, response) => response.status(404).json({ error: "API endpoint not found." }));
  app.get("/", (_request, response) => response.sendFile(path.join(publicRoot, "index.html")));
  app.use("/css", express.static(path.join(publicRoot, "css"), { fallthrough: false }));
  app.use("/js", express.static(path.join(publicRoot, "js"), { fallthrough: false }));
  app.use("/assets", express.static(path.join(publicRoot, "assets"), { fallthrough: false }));
  app.use("/pages", express.static(path.join(publicRoot, "pages"), { fallthrough: false }));
  app.get("/index.html", (_request, response) => response.sendFile(path.join(publicRoot, "index.html")));

  app.use((error, _request, response, _next) => {
    if (response.headersSent) return;
    if (error.status === 404) return response.status(404).json({ error: "Page not found." });
    console.error(error);
    return response.status(500).json({ error: "The request could not be completed." });
  });

  return { app, sessionStore };
}

module.exports = { createApp, SESSION_MAX_AGE };