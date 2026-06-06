import { useEffect, useRef } from "react";

export function RadarChartCanvas({ values, max = 10 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const labels = Object.keys(values || {});
      if (labels.length < 3) return;

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.35;

      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      for (let ring = 1; ring <= 4; ring++) {
        const rr = (r * ring) / 4;
        ctx.beginPath();
        for (let i = 0; i < labels.length; i++) {
          const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
          const x = cx + Math.cos(a) * rr;
          const y = cy + Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.beginPath();
      labels.forEach((label, i) => {
        const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const v = Math.max(0, Math.min(max, Number(values[label] || 0)));
        const rr = (v / max) * r;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = "rgba(124,58,237,0.18)";
      ctx.strokeStyle = "rgba(124,58,237,0.75)";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(226,232,240,0.9)";
      ctx.font = "12px system-ui, Segoe UI, Roboto, sans-serif";
      labels.forEach((label, i) => {
        const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
        const x = cx + Math.cos(a) * (r + 16);
        const y = cy + Math.sin(a) * (r + 16);
        ctx.fillText(label, x - 12, y);
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    return () => ro.disconnect();
  }, [values, max]);

  return <canvas ref={ref} className="h-64 w-full" />;
}

