const crypto = require("node:crypto");
const Razorpay = require("razorpay");

function verifyPaymentSignature(orderId, paymentId, signature, secret) {
  if (![orderId, paymentId, signature, secret].every((value) => typeof value === "string" && value.length > 0)) {
    return false;
  }
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest();
  const received = Buffer.from(signature, "hex");
  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}

function createRazorpayGateway({ keyId = process.env.RAZORPAY_KEY_ID || "", keySecret = process.env.RAZORPAY_KEY_SECRET || "", mode = process.env.RAZORPAY_MODE || "test" } = {}) {
  const isTestKey = keyId.startsWith("rzp_test_");
  const configured = mode === "test" && isTestKey && keySecret.length > 0;
  const client = configured ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : null;

  return {
    getConfig() {
      return {
        available: configured,
        mode: "test",
        keyId: configured ? keyId : null,
        message: configured
          ? "Razorpay test checkout is ready. Payments are simulated and do not move real money."
          : "Razorpay test keys are not configured. Live payments are disabled until biller settlement is integrated.",
      };
    },
    verifyPaymentSignature(orderId, paymentId, signature) {
      return configured && verifyPaymentSignature(orderId, paymentId, signature, keySecret);
    },
    async createOrder(order) {
      if (!configured) throw new Error("Razorpay test checkout is not configured.");
      return client.orders.create(order);
    },
    async fetchPayment(paymentId) {
      if (!configured) throw new Error("Razorpay test checkout is not configured.");
      return client.payments.fetch(paymentId);
    },
  };
}

module.exports = { createRazorpayGateway, verifyPaymentSignature };