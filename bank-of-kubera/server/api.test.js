const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const path = require("node:path");
const Database = require("better-sqlite3");
const request = require("supertest");
const { createApp } = require("./app");
const { initializeDatabase } = require("./db");
const { verifyPaymentSignature } = require("./razorpay");

function createTestClient({ razorpayGateway } = {}) {
  const database = new Database(":memory:");
  initializeDatabase(database);
  const { app } = createApp({
    database,
    publicRoot: path.resolve(__dirname, ".."),
    sessionSecret: "test-session-secret",
    razorpayGateway,
  });
  return { database, client: request.agent(app) };
}

test("private demo data requires a server-side session", async (context) => {
  const { database, client } = createTestClient();
  context.after(() => database.close());

  await client.get("/data/demo-accounts.json").expect(401);
  const signIn = await client
    .post("/api/auth/login")
    .send({ identifier: "demo-user", password: "KuberaDemo123" })
    .expect(200);

  assert.equal(signIn.body.user.isDemo, true);
  const accounts = await client.get("/api/accounts").expect(200);
  assert.equal(accounts.body.accounts.length, 3);
  const demoCards = await client.get("/api/cards").expect(200);
  assert.equal(demoCards.body.length, 3);
  await client.get("/data/demo-accounts.json").expect(200);
  const provider = await client.get("/api/bank-connections").expect(200);
  assert.equal(provider.body.providerId, "onemoney");
  assert.equal(provider.body.country, "IN");
  assert.equal(provider.body.available, false);
  await client
    .post("/api/bank-connections/link")
    .expect(503)
    .expect(({ body }) => assert.equal(body.code, "BANK_PROVIDER_NOT_CONFIGURED"));
  await client
    .post("/api/payments/orders")
    .send({ billerId: "biller-001" })
    .expect(503)
    .expect(({ body }) => assert.equal(body.code, "RAZORPAY_TEST_KEYS_REQUIRED"));
  await client.post("/api/auth/logout").expect(204);
  await client.get("/api/accounts").expect(401);
});

test("registration creates empty demo accounts and a persistent contact message", async (context) => {
  const { database, client } = createTestClient();
  context.after(() => database.close());

  await client
    .post("/api/auth/register")
    .send({
      name: "Sample Customer",
      email: "sample@example.test",
      phone: "+1 555 0100",
      password: "a-long-demo-password",
    })
    .expect(201);

  const accounts = await client.get("/api/accounts").expect(200);
  assert.equal(accounts.body.accounts.length, 2);
  assert.equal(accounts.body.accounts[0].balance, 0);
  assert.deepEqual((await client.get("/api/billers").expect(200)).body.billers, []);
  assert.deepEqual((await client.get("/api/cards").expect(200)).body, []);

  for (const dataset of [
    "demo-billers.json",
    "demo-cards.json",
    "demo-investments.json",
    "demo-loans.json",
    "demo-login-activity.json",
    "demo-notifications.json",
    "demo-transactions.json",
  ]) {
    const response = await client.get(`/data/${dataset}`).expect(200);
    assert.deepEqual(response.body, [], `${dataset} should be empty for a new profile`);
  }

  const products = await client.get("/api/loan-products").expect(200);
  assert.equal(products.body.products.length, 3);
  const card = await client
    .post("/api/cards")
    .send({ cardType: "Debit", label: "Everyday card", lastFour: "4821" })
    .expect(201);
  assert.equal(card.body.card.lastFour, "4821");
  assert.equal(card.body.card.status, "Reference only");
  const savedCards = await client.get("/api/cards").expect(200);
  assert.equal(savedCards.body.length, 1);
  assert.equal(Object.hasOwn(savedCards.body[0], "cardNumber"), false);

  await client
    .post("/api/cards")
    .send({ cardType: "Debit", label: "Unsafe card", lastFour: "1234567890123456" })
    .expect(400);

  const requestInfo = await client
    .post("/api/loan-applications")
    .send({ productId: "personal" })
    .expect(201);
  assert.equal(requestInfo.body.application.status, "Information requested");
  assert.match(requestInfo.body.message, /not a credit application or approval/);
  const applications = await client.get("/api/loan-applications").expect(200);
  assert.equal(applications.body.applications.length, 1);
  await client.post("/api/loan-applications").send({ productId: "unknown" }).expect(400);

  await client
    .post("/api/contact")
    .send({
      name: "Sample Customer",
      email: "sample@example.test",
      subject: "Demo support",
      message: "Please confirm this local demo message was stored.",
    })
    .expect(201);

  const storedMessages = database.prepare("SELECT COUNT(*) AS count FROM contacts").get();
  assert.equal(storedMessages.count, 1);

  await client.post("/api/auth/logout").expect(204);
  const signIn = await client
    .post("/api/auth/login")
    .send({ identifier: "sample@example.test", password: "a-long-demo-password" })
    .expect(200);
  assert.equal(signIn.body.user.email, "sample@example.test");
  assert.equal(signIn.body.user.isDemo, false);
});

test("Razorpay checkout uses the stored bill amount and verifies captured payments server-side", async (context) => {
  const secret = "test-razorpay-secret";
  let orderInput;
  const gateway = {
    getConfig: () => ({ available: true, mode: "test", keyId: "rzp_test_example", message: "test" }),
    createOrder: async (order) => {
      orderInput = order;
      return { id: "order_test_001", amount: order.amount, currency: order.currency };
    },
    verifyPaymentSignature: (orderId, paymentId, signature) => verifyPaymentSignature(orderId, paymentId, signature, secret),
    fetchPayment: async (paymentId) => ({
      id: paymentId,
      order_id: "order_test_001",
      amount: 320000,
      currency: "INR",
      status: "captured",
    }),
  };
  const { database, client } = createTestClient({ razorpayGateway: gateway });
  context.after(() => database.close());

  await client.post("/api/auth/login").send({ identifier: "demo-user", password: "KuberaDemo123" }).expect(200);
  const checkoutConfig = await client.get("/api/payments/config").expect(200);
  assert.equal(checkoutConfig.body.keyId, "rzp_test_example");

  const order = await client
    .post("/api/payments/orders")
    .send({ billerId: "biller-001", amount: 1 })
    .expect(201);
  assert.equal(orderInput.amount, 320000);
  assert.equal(order.body.order.amount, 320000);
  assert.equal(order.body.order.mode, "test");

  const paymentId = "pay_test_001";
  const signature = crypto.createHmac("sha256", secret).update(`order_test_001|${paymentId}`).digest("hex");
  await client
    .post("/api/payments/verify")
    .send({ razorpay_order_id: "order_test_001", razorpay_payment_id: paymentId, razorpay_signature: "0".repeat(64) })
    .expect(400);

  const verified = await client
    .post("/api/payments/verify")
    .send({ razorpay_order_id: "order_test_001", razorpay_payment_id: paymentId, razorpay_signature: signature })
    .expect(200);
  assert.equal(verified.body.status, "captured");
  assert.match(verified.body.message, /biller itself has not been paid/);
  const storedOrder = database.prepare("SELECT status, amount_paise FROM payment_orders WHERE provider_order_id = ?").get("order_test_001");
  assert.deepEqual(storedOrder, { status: "captured", amount_paise: 320000 });
});