const http = require("http");

const { buildApp } = require("./app");
const { connectDb } = require("./config/db");
const { env } = require("./config/env");
const { attachSockets } = require("./sockets");
const { verifyMailer } = require("./lib/mailer");

async function main() {
  await connectDb(env.MONGODB_URI);

  
  await verifyMailer();

  const app = buildApp();
  const server = http.createServer(app);
  attachSockets(server);

  server.listen(env.PORT, () => {
    const addr = server.address();
    const port = typeof addr === "object" && addr ? addr.port : env.PORT;
    console.log(`🚀  API listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
