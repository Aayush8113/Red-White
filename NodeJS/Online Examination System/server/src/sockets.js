const { Server } = require("socket.io");

const { env } = require("./config/env");
const { verifyAccessToken } = require("./lib/jwt");
const { ExamAttempt } = require("./models/ExamAttempt");

function attachSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_ORIGIN, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("missing_token"));
      const payload = verifyAccessToken(token);
      socket.data.user = { id: payload.sub, role: payload.role };
      return next();
    } catch (_e) {
      return next(new Error("invalid_token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("timer:join", async ({ attemptId }) => {
      if (!attemptId) return;
      const attempt = await ExamAttempt.findById(attemptId).lean();
      if (!attempt) return;
      if (String(attempt.student) !== String(socket.data.user.id)) return;

      socket.join(String(attemptId));
      const msLeft = Math.max(0, new Date(attempt.endsAt).getTime() - Date.now());
      socket.emit("timer:tick", { attemptId, msLeft, serverNow: Date.now() });
    });

    socket.on("disconnect", () => {});
  });

  // authoritative ticks (room-scoped) once per second
  setInterval(async () => {
    const now = Date.now();
    const active = await ExamAttempt.find({ status: "in_progress", endsAt: { $gt: new Date() } })
      .select({ endsAt: 1 })
      .lean();

    for (const a of active) {
      const msLeft = Math.max(0, new Date(a.endsAt).getTime() - now);
      io.to(String(a._id)).emit("timer:tick", { attemptId: String(a._id), msLeft, serverNow: now });
    }
  }, 1000);
}

module.exports = { attachSockets };

