require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const { createApp } = require("./app");
const { initializeDatabase } = require("./db");

const dataDirectory = path.join(__dirname, "data");
fs.mkdirSync(dataDirectory, { recursive: true });

const database = new Database(path.join(dataDirectory, "bank-of-kubera.sqlite"));
initializeDatabase(database);
const { app, sessionStore } = createApp({ database });

const host = process.env.HOST || "127.0.0.1";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const server = app.listen(port, host, () => {
  sessionStore.clearExpired();
    console.log(`Bank of Kubera server running at http://${host}:${port}`);
});

const shutdown = () => {
  server.close(() => {
    database.close();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);