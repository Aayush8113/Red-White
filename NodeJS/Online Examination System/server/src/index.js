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

  const startServer = (port, retries = 10) => {
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️  Port ${port} is currently in use. Retrying in 1 second... (${retries} retries left)`);
        if (retries === 0) {
          console.error(`❌  Could not bind to port ${port}. Please manually kill the process using this port.`);
          process.exit(1);
        }
        setTimeout(() => {
          server.close();
          startServer(port, retries - 1);
        }, 1000);
      } else {
        console.error("Fatal server error:", err);
        process.exit(1);
      }
    });

    server.listen(port, () => {
      const addr = server.address();
      const actualPort = typeof addr === "object" && addr ? addr.port : port;
      console.log(`🚀  API listening on http://localhost:${actualPort}`);
    });
  };

  startServer(env.PORT);

  const gracefulShutdown = () => {
    console.log("\n🛑 Shutting down gracefully...");
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
    
    setTimeout(() => {
      console.error("Forcing shutdown...");
      process.exit(1);
    }, 3000);
  };

  process.on("SIGINT", gracefulShutdown);
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGUSR2", gracefulShutdown);
}

main().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
