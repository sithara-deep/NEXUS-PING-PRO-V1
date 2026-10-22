import { useEffect, useId, useRef } from "react";
import { NX, clamp, signalQuality } from "../lib/brand";

/* ------------------------------ geometry ------------------------------ */

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const s = polar(cx, cy, r, a0);
  const e = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/* ------------------------------ Sparkline ------------------------------ */

export function Sparkline({
  data,
  min,
  max,
  color = NX.cyan,
  height = 64,
  fill = true,
  grid = false,
  glow = true,
}: {
  data: number[];
  min: number;
  max: number;
  color?: string;
  height?: number;
  fill?: boolean;
  grid?: boolean;
  glow?: boolean;
}) {
  const raw = useId();
  const gid = raw.replace(/[^a-zA-Z0-9]/g, "");
  const W = 300;
  const H = 100;
  const pts = data.length
    ? data.map((v, i) => {
        const x = (i / Math.max(1, data.length - 1)) * W;
        const y = H - ((clamp(v, min, max) - min) / (max - min)) * (H - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
    : [];
  const line = pts.join(" ");
  const last = pts.length ? pts[pts.length - 1].split(",") : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ width: "100%", height }}
    >
      <defs>
        <linearGradient id={`f${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.42" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {grid &&
        [25, 50, 75].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2={W}
            y2={y}
            stroke={color}
            strokeOpacity="0.12"
            strokeDasharray="3 5"
            strokeWidth="1"
          />
        ))}
      {fill && pts.length > 1 && (
        <polygon
          points={`0,${H} ${line} ${W},${H}`}
          fill={`url(#f${gid})`}
        />
      )}
      {pts.length > 1 && (
        <polyline
          points={line}
          fill="none"
          stroke={color}
          strokeWidth="2.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={glow ? { filter: `drop-shadow(0 0 5px ${color})` } : undefined}
        />
      )}
      {last && (
        <circle
          cx={last[0]}
          cy={last[1]}
          r="3.4"
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      )}
    </svg>
  );
}

/* ------------------------------ HistoryChart ------------------------------ */

export function HistoryChart({
  down,
  up,
}: {
  down: number[];
  up: number[];
}) {
  const raw = useId();
  const gid = raw.replace(/[^a-zA-Z0-9]/g, "");
  const W = 300;
  const H = 110;
  const max = Math.max(50, ...down, ...up) * 1.15;
  const map = (arr: number[]) =>
    arr
      .map((v, i) => {
        const x = 8 + (i / Math.max(1, arr.length - 1)) * (W - 16);
        const y = H - 16 - (v / max) * (H - 30);
        return [x, y] as const;
      });
  const dPts = map(down);
  const uPts = map(up);
  const toLine = (p: ReadonlyArray<readonly [number, number]>) =>
    p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }}>
      <defs>
        <linearGradient id={`hd${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={NX.cyan} stopOpacity="0.3" />
          <stop offset="100%" stopColor={NX.cyan} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1="8"
          x2={W - 8}
          y1={H - 16 - f * (H - 30)}
          y2={H - 16 - f * (H - 30)}
          stroke={NX.cyan}
          strokeOpacity="0.1"
          strokeDasharray="3 5"
        />
      ))}
      {dPts.length > 1 && (
        <>
          <polygon
            points={`8,${H - 16} ${toLine(dPts)} ${W - 8},${H - 16}`}
            fill={`url(#hd${gid})`}
          />
          <polyline
            points={toLine(dPts)}
            fill="none"
            stroke={NX.cyan}
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${NX.cyan})` }}
          />
          <polyline
            points={toLine(uPts)}
            fill="none"
            stroke={NX.purple}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="1 0"
            style={{ filter: `drop-shadow(0 0 4px ${NX.purple})` }}
          />
        </>
      )}
      {dPts.map(([x, y], i) => (
        <circle key={`d${i}`} cx={x} cy={y} r="2.6" fill={NX.cyan} />
      ))}
      {uPts.map(([x, y], i) => (
        <circle key={`u${i}`} cx={x} cy={y} r="2.6" fill={NX.purple} />
      ))}
      {dPts.map(([x], i) => (
        <text
          key={`t${i}`}
          x={x}
          y={H - 3}
          textAnchor="middle"
          fontSize="8"
          fill={NX.white}
          fillOpacity="0.45"
          fontFamily="Orbitron, sans-serif"
        >
          T{i + 1}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------ SignalGauge ------------------------------ */

export function SignalGauge({
  dbm,
  size = 212,
  sub,
}: {
  dbm: number;
  size?: number;
  sub?: string;
}) {
  const q = signalQuality(dbm);
  const frac = clamp((dbm + 120) / 70, 0.02, 1); // -120..-50 â†’ 0..1
  const A0 = -135;
  const A1 = 135;
  const r = 86;
  const c = 100;
  const ticks = Array.from({ length: 28 }, (_, i) => -135 + (i * 270) / 27);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* pulsing rings */}
      {[0, 0.7, 1.4].map((d) => (
        <span
          key={d}
          className="pulse-ring absolute inset-3 rounded-full pointer-events-none"
          style={{
            border: `1.5px solid ${NX.cyan}`,
            animationDelay: `${d}s`,
            boxShadow: `0 0 18px ${NX.cyan}55`,
          }}
        />
      ))}
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <linearGradient id="nxg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={q.color} />
            <stop offset="100%" stopColor={NX.cyan} />
          </linearGradient>
        </defs>
        {/* track */}
        <path
          d={arcPath(c, c, r, A0, A1)}
          fill="none"
          stroke="rgba(232,244,255,0.09)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* value arc */}
        <path
          d={arcPath(c, c, r, A0, A0 + frac * (A1 - A0))}
          fill="none"
          stroke="url(#nxg)"
          strokeWidth="10"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 7px ${q.color})`,
            transition: "all .8s cubic-bezier(.22,1,.36,1)",
          }}
        />
        {/* ticks */}
        {ticks.map((a, i) => {
          const on = i / 27 <= frac;
          const p1 = polar(c, c, r - 15, a);
          const p2 = polar(c, c, r - (i % 3 === 0 ? 22 : 19), a);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={on ? q.color : "rgba(232,244,255,0.14)"}
              strokeWidth={i % 3 === 0 ? 2 : 1.1}
              strokeLinecap="round"
              style={on ? { filter: `drop-shadow(0 0 3px ${q.color})` } : undefined}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-black text-[42px] leading-none text-[var(--ink)]"
          style={{ textShadow: `0 0 22px ${q.color}aa` }}
        >
          {Math.round(dbm)}
        </span>
        <span className="font-display text-[11px] tracking-[0.3em] text-[var(--ink-dim)] mt-0.5">
          dBm
        </span>
        <span
          className="mt-2 px-2.5 py-0.5 rounded-md font-display text-[9.5px] font-bold tracking-[0.2em]"
          style={{
            color: q.color,
            background: `color-mix(in srgb, ${q.color} 14%, transparent)`,
            boxShadow: `0 0 12px ${q.color}55, inset 0 0 8px ${q.color}22`,
          }}
        >
          {q.label}
        </span>
        {sub && (
          <span className="text-[10px] text-[var(--ink-dim)] font-semibold mt-1 tracking-wide">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Speedometer ------------------------------ */

export function Speedometer({
  value,
  phase,
  size = 250,
}: {
  value: number;
  phase: "idle" | "ping" | "down" | "up" | "done";
  size?: number;
}) {
  const max = 1000;
  const frac = clamp(Math.pow(clamp(value, 0, max) / max, 0.45), 0, 1);
  const A0 = -120;
  const A1 = 120;
  const c = 110;
  const r = 92;
  const trail =
    phase === "up" ? NX.purple : phase === "done" ? NX.green : NX.cyan;
  const labels = [0, 100, 200, 300, 500, 750, 1000];

  return (
    <div className="relative" style={{ width: size, height: size * 0.86 }}>
      <svg viewBox="0 0 220 190" width="100%" height="100%">
        <defs>
          <linearGradient id="nxsp" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={NX.cyan} />
            <stop offset="100%" stopColor={trail} />
          </linearGradient>
        </defs>
        <path
          d={arcPath(c, c, r, A0, A1)}
          fill="none"
          stroke="rgba(232,244,255,0.08)"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {frac > 0.005 && (
          <path
            d={arcPath(c, c, r, A0, A0 + frac * (A1 - A0))}
            fill="none"
            stroke="url(#nxsp)"
            strokeWidth="13"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${trail})` }}
          />
        )}
        {/* ticks + labels */}
        {labels.map((v) => {
          const f = Math.pow(v / max, 0.45);
          const a = A0 + f * (A1 - A0);
          const p1 = polar(c, c, r - 14, a);
          const p2 = polar(c, c, r - 22, a);
          const pt = polar(c, c, r - 34, a);
          const on = f <= frac;
          return (
            <g key={v}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={on ? trail : "rgba(232,244,255,0.2)"}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text
                x={pt.x}
                y={pt.y + 3}
                textAnchor="middle"
                fontSize="8.5"
                fontFamily="Orbitron, sans-serif"
                fill={on ? trail : "rgba(232,244,255,0.35)"}
              >
                {v}
              </text>
            </g>
          );
        })}
        {/* needle */}
        <g
          style={{
            transform: `rotate(${A0 + frac * (A1 - A0)}deg)`,
            transformOrigin: "110px 110px",
            transition: "transform .18s ease-out",
          }}
        >
          <line
            x1={c}
            y1={c}
            x2={c}
            y2={c - r + 26}
            stroke={trail}
            strokeWidth="2.6"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${trail})` }}
          />
        </g>
        <circle cx={c} cy={c} r="7" fill="#0A0E27" stroke={trail} strokeWidth="2" />
        <circle cx={c} cy={c} r="2.6" fill={trail} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span
          className="font-display font-black text-[34px] leading-none"
          style={{ color: trail, textShadow: `0 0 20px ${trail}aa` }}
        >
          {value < 10 ? value.toFixed(1) : Math.round(value)}
        </span>
        <span className="font-display text-[10px] tracking-[0.32em] text-[var(--ink-dim)] mt-1">
          {phase === "ping" ? "PING TEST" : phase === "down" ? "DOWNLOAD Mbps" : phase === "up" ? "UPLOAD Mbps" : "Mbps"}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ Radar ------------------------------ */

export function Radar({ size = 220, active = true }: { size?: number; active?: boolean }) {
  const blips = [
    { x: 30, y: 26, d: 0 },
    { x: 68, y: 40, d: 0.6 },
    { x: 46, y: 70, d: 1.1 },
    { x: 22, y: 58, d: 1.7 },
    { x: 74, y: 68, d: 0.3 },
  ];
  return (
    <div
      className="relative rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle, rgba(0,212,255,0.08) 0%, rgba(10,14,39,0.9) 70%)",
        boxShadow: `0 0 34px ${NX.cyan}33, inset 0 0 40px rgba(0,212,255,0.08)`,
        border: `1px solid ${NX.cyan}44`,
      }}
    >
      {[0.28, 0.52, 0.76].map((f) => (
        <span
          key={f}
          className="absolute rounded-full"
          style={{
            inset: `${(1 - f) * 50}%`,
            border: `1px solid ${NX.cyan}38`,
          }}
        />
      ))}
      <span className="absolute left-1/2 top-0 bottom-0 w-px" style={{ background: `${NX.cyan}2a` }} />
      <span className="absolute top-1/2 left-0 right-0 h-px" style={{ background: `${NX.cyan}2a` }} />
      {active && <span className="radar-sweep absolute inset-0 rounded-full" />}
      {blips.map((b, i) => (
        <span
          key={i}
          className="anim-blink absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            background: i % 2 ? NX.green : NX.cyan,
            boxShadow: `0 0 8px ${i % 2 ? NX.green : NX.cyan}`,
            animationDelay: `${b.d}s`,
          }}
        />
      ))}
      <span
        className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -ml-1.5 -mt-1.5 rounded-full"
        style={{ background: NX.cyan, boxShadow: `0 0 14px ${NX.cyan}` }}
      />
    </div>
  );
}

/* ------------------------------ Confetti ------------------------------ */

export function Confetti({ run }: { run: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!run) return;
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const parent = cv.parentElement!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = parent.clientWidth * dpr;
    cv.height = parent.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = parent.clientWidth;
    const H = parent.clientHeight;
    const colors = [NX.cyan, NX.purple, NX.green, NX.white, NX.yellow];
    const parts = Array.from({ length: 130 }, () => ({
      x: W / 2 + (Math.random() - 0.5) * 60,
      y: H * 0.3,
      vx: (Math.random() - 0.5) * 9,
      vy: -Math.random() * 9 - 3,
      s: Math.random() * 6 + 3,
      c: colors[Math.floor(Math.random() * colors.length)],
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      o: 1,
    }));
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const elapsed = (t - start) / 1000;
      for (const p of parts) {
        p.vy += 0.22;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        p.o = Math.max(0, 1 - Math.max(0, elapsed - 1.6) / 1.2);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.globalAlpha = p.o;
        ctx.fillStyle = p.c;
        ctx.shadowColor = p.c;
        ctx.shadowBlur = 8;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      if (elapsed < 3) raf = requestAnimationFrame(loop);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

/* ------------------------------ Starfield ------------------------------ */

export function Starfield({ count = 70 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const parent = cv.parentElement!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      cv.width = parent.clientWidth * dpr;
      cv.height = parent.clientHeight * dpr;
    };
    resize();
    const stars = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 1.7 + 0.4,
      v: Math.random() * 0.0006 + 0.0002,
      tw: Math.random() * Math.PI * 2,
      c: Math.random() > 0.75 ? NX.purple : NX.cyan,
    }));
    let raf = 0;
    const loop = (t: number) => {
      const W = parent.clientWidth;
      const H = parent.clientHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const st of stars) {
        st.y -= st.v * 16;
        if (st.y < -0.02) {
          st.y = 1.02;
          st.x = Math.random();
        }
        const a = 0.35 + 0.55 * Math.abs(Math.sin(t / 900 + st.tw));
        ctx.globalAlpha = a;
        ctx.fillStyle = st.c;
        ctx.shadowColor = st.c;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(st.x * W, st.y * H, st.s, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

