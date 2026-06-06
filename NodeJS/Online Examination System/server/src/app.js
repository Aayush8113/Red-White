const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const { authRouter } = require("./routes/auth");
const { questionsRouter } = require("./routes/questions");
const { examsRouter } = require("./routes/exams");
const { usersRouter } = require("./routes/users");
const { errorHandler } = require("./middleware/errorHandler");

function buildApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowed = env.CLIENT_ORIGIN.split(",");
        if (!origin || allowed.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/questions", questionsRouter);
  app.use("/api/exams", examsRouter);
  app.use("/api/users", usersRouter);

  app.use(errorHandler);

  return app;
}

module.exports = { buildApp };

