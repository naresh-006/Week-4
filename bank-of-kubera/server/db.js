const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");

const dataDirectory = path.resolve(__dirname, "../data");

const readFixture = (name) =>
  JSON.parse(fs.readFileSync(path.join(dataDirectory, name), "utf8"));

function initializeDatabase(database) {
  database.pragma("foreign_keys = ON");
  if (database.name !== ":memory:") database.pragma("journal_mode = WAL");

  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      phone TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      customer_type TEXT NOT NULL DEFAULT 'Customer',
      is_demo INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      masked_number TEXT NOT NULL,
      balance INTEGER NOT NULL DEFAULT 0,
      available_balance INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      date TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      card_type TEXT NOT NULL CHECK (card_type IN ('Debit', 'Credit')),
      label TEXT NOT NULL,
      last_four TEXT NOT NULL CHECK (length(last_four) = 4 AND last_four GLOB '[0-9][0-9][0-9][0-9]'),
      status TEXT NOT NULL DEFAULT 'Reference only',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS loan_applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Information requested',
      created_at TEXT NOT NULL,
      UNIQUE (user_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS payment_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      biller_id TEXT NOT NULL,
      biller_name TEXT NOT NULL,
      amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
      currency TEXT NOT NULL,
      provider_order_id TEXT NOT NULL UNIQUE,
      provider_payment_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'created',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);
    CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions(user_id, date DESC);
    CREATE INDEX IF NOT EXISTS cards_user_id_idx ON cards(user_id);
    CREATE INDEX IF NOT EXISTS loan_applications_user_id_idx ON loan_applications(user_id);
    CREATE INDEX IF NOT EXISTS payment_orders_user_id_idx ON payment_orders(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);
  `);

  const demoUser = database.prepare("SELECT id FROM users WHERE user_id = ?").get("demo-user");
  if (demoUser) return;

  const customer = readFixture("demo-user.json");
  const accounts = readFixture("demo-accounts.json");
  const transactions = readFixture("demo-transactions.json");
  const userId = customer.id;
  const createdAt = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(process.env.DEMO_PASSWORD || "KuberaDemo123", 12);

  const seed = database.transaction(() => {
    database.prepare(`
      INSERT INTO users (id, user_id, display_name, email, phone, password_hash, customer_type, is_demo, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      userId,
      "demo-user",
      customer.displayName,
      customer.email,
      customer.phone,
      passwordHash,
      customer.customerType,
      createdAt
    );

    const insertAccount = database.prepare(`
      INSERT INTO accounts (id, user_id, type, name, masked_number, balance, available_balance, currency, status)
      VALUES (@id, @userId, @type, @name, @maskedNumber, @balance, @availableBalance, @currency, @status)
    `);
    accounts.forEach((account) => insertAccount.run({ ...account, userId }));

    const insertTransaction = database.prepare(`
      INSERT INTO transactions (id, user_id, account_id, type, description, amount, currency, date, status)
      VALUES (@id, @userId, @accountId, @type, @description, @amount, @currency, @date, @status)
    `);
    transactions.forEach((transaction) => insertTransaction.run({ ...transaction, userId }));
  });

  seed();
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    userId: user.user_id,
    displayName: user.display_name,
    email: user.email,
    phone: user.phone,
    customerType: user.customer_type,
    isDemo: Boolean(user.is_demo),
  };
}

function listAccounts(database, userId) {
  return database.prepare(`
    SELECT id, type, name, masked_number AS maskedNumber, balance,
      available_balance AS availableBalance, currency, status
    FROM accounts WHERE user_id = ? ORDER BY rowid
  `).all(userId);
}

function listTransactions(database, userId, limit = 50) {
  return database.prepare(`
    SELECT id, account_id AS accountId, type, description, amount, currency, date, status
    FROM transactions WHERE user_id = ? ORDER BY date DESC, rowid DESC LIMIT ?
  `).all(userId, limit);
}

function listCards(database, userId) {
  return database.prepare(`
    SELECT id, card_type AS cardType, label, last_four AS lastFour,
      status, created_at AS createdAt
    FROM cards WHERE user_id = ? ORDER BY created_at DESC
  `).all(userId);
}

function listLoanApplications(database, userId) {
  return database.prepare(`
    SELECT id, product_id AS productId, status, created_at AS createdAt
    FROM loan_applications WHERE user_id = ? ORDER BY created_at DESC
  `).all(userId);
}

module.exports = { initializeDatabase, listAccounts, listCards, listLoanApplications, listTransactions, readFixture, toPublicUser };