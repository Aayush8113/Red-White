import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export function useServerTimer({ attemptId, token } = {}) {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
  const [msLeft, setMsLeft] = useState(null);

  const socket = useMemo(() => {
    if (!socketUrl || !token) return null;
    return io(socketUrl, {
      transports: ["websocket"],
      auth: { token },
    });
  }, [socketUrl, token]);

  useEffect(() => {
    if (!socket || !attemptId) return undefined;

    const onTick = (payload) => {
      if (!payload || String(payload.attemptId) !== String(attemptId)) return;
      setMsLeft(Number(payload.msLeft));
    };

    socket.on("timer:tick", onTick);
    socket.emit("timer:join", { attemptId });

    return () => {
      socket.off("timer:tick", onTick);
      socket.disconnect();
    };
  }, [socket, attemptId]);

  return { msLeft };
}

