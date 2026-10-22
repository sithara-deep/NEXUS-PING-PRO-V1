import { useEffect, useRef, useState } from "react";
import { NX, SERVERS, clamp, fmt, gradeFor, haptic } from "../lib/brand";
import { useNexus } from "../state/AppState";
import { GlassCard, NeonButton, ScreenHeader } from "../components/ui";
import { Icon } from "../components/Icons";
import { HistoryChart, Speedometer } from "../components/charts";
import { cn } from "../utils/cn";

type Phase = "idle" | "ping" | "down" | "up" | "done";

interface Result {
  down: number;
  up: number;
  ping: number;
  jitter: number;
  server: string;
  grade: string;
  gradeColor: string;
}

export function SpeedTest({ autoRun }: { autoRun: number }) {
  const { sim, addSpeedResult } = useNexus();
  const [phase, setPhase] = useState<Phase>("idle");
  const [disp, setDisp] = useState(0);
  const [pings, setPings] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [toast, setToast] = useState("");
  const tgt = useRef({ down: 220, up: 78, ping: 24, jitter: 3, server: SERVERS[0] });

  const start = () => {
    const n = sim.net;
    const cap = Math.max(8, Math.pow(clamp((n.dbm + 120) / 69, 0, 1), 1.5) * 940);
    tgt.current = {
      down: clamp(cap * (0.85 + Math.random() * 0.2), 8, 980),
      up: clamp(cap * (0.3 + Math.random() * 0.12), 4, 420),
      ping: clamp(n.ping, 5, 300),
      jitter: n.jitter,
      server: SERVERS[Math.floor(Math.random() * SERVERS.length)],
    };
    setPings([]);
    setResult(null);
    setDisp(0);
    setPhase("ping");
  };

  useEffect(() => {
    if (autoRun > 0) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  /* ping phase */
  useEffect(() => {
    if (phase !== "ping") return;
    const iv = window.setInterval(() => {
      setPings((p) => {
        const np = [...p, tgt.current.ping * (0.8 + Math.random() * 0.5)];
        if (np.length >= 5) {
          window.clearInterval(iv);
          window.setTimeout(() => setPhase("down"), 350);
        }
        return np;
      });
    }, 300);
    return () => window.clearInterval(iv);
  }, [phase]);

  /* download phase */
  useEffect(() => {
    if (phase !== "down") return;
    const t0 = performance.now();
    const iv = window.setInterval(() => {
      const t = (performance.now() - t0) / 3300;
      if (t >= 1) {
        window.clearInterval(iv);
        setDisp(tgt.current.down);
        window.setTimeout(() => setPhase("up"), 300);
        return;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      setDisp(tgt.current.down * ease * (0.93 + Math.random() * 0.14));
    }, 55);
    return () => window.clearInterval(iv);
  }, [phase]);

  /* upload phase */
  useEffect(() => {
    if (phase !== "up") return;
    setDisp(0);
    const t0 = performance.now();
    const iv = window.setInterval(() => {
      const t = (performance.now() - t0) / 2900;
      if (t >= 1) {
        window.clearInterval(iv);
        setDisp(tgt.current.up);
        const g = gradeFor(tgt.current.down, tgt.current.ping);
        setResult({
          down: tgt.current.down,
          up: tgt.current.up,
          ping: tgt.current.ping,
          jitter: tgt.current.jitter,
          server: tgt.current.server,
          grade: g.g,
          gradeColor: g.color,
        });
        window.setTimeout(() => setPhase("done"), 300);
        return;
      }
      const ease = 1 - Math.pow(1 - t, 3);
      setDisp(tgt.current.up * ease * (0.93 + Math.random() * 0.14));
    }, 55);
    return () => window.clearInterval(iv);
  }, [phase]);

  /* persist finished test */
  useEffect(() => {
    if (phase === "done" && result) {
      addSpeedResult({ ...result });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const share = async () => {
    haptic();
    if (!result) return;
    const text = `âš¡ NEXUS PING PRO â€” Speed Report\nðŸ“¥ ${fmt(result.down)} Mbps down Â· ðŸ“¤ ${fmt(result.up)} Mbps up\nðŸ“ ${Math.round(result.ping)} ms ping Â· Grade ${result.grade}\nPing Less. Play More.`;
    try {
      await navigator.share({ title: "NEXUS PING PRO", text });
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setToast("Report copied â€” share it anywhere âš¡");
      } catch {
        setToast("Share unavailable on this device");
      }
      window.setTimeout(() => setToast(""), 2600);
    }
  };

  const phaseIdx = phase === "ping" ? 0 : phase === "down" ? 1 : phase === "up" ? 2 : -1;

  return (
    <div className="px-4 pt-1 pb-28 relative">
      <ScreenHeader title="NEXUS SPEED LAB" sub="precision throughput analysis" color={NX.cyan} />

      <div className="flex justify-center anim-fade-up">
        <Speedometer value={phase === "ping" ? 0 : disp} phase={phase === "idle" ? "idle" : phase} size={252} />
      </div>

      {/* phase indicator */}
      <div className="flex items-center justify-center gap-2 -mt-1 mb-3">
        {["PING", "DOWNLOAD", "UPLOAD"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "px-2.5 py-1 rounded-md font-display text-[8px] font-bold tracking-[0.2em] transition-all duration-300",
                i < phaseIdx || phase === "done" ? "opacity-60" : i === phaseIdx ? "" : "opacity-30"
              )}
              style={{
                color: i === phaseIdx ? NX.cyan : "var(--ink-dim)",
                background: i === phaseIdx ? `${NX.cyan}16` : "transparent",
                boxShadow: i === phaseIdx ? `0 0 12px ${NX.cyan}55` : "none",
              }}
            >
              {label}
            </span>
            {i < 2 && <span className="w-4 h-px bg-white/15" />}
          </div>
        ))}
      </div>

      {/* ping dots */}
      {phase === "ping" && (
        <GlassCard className="p-3.5 anim-pop">
          <div className="flex items-center justify-between">
            <span className="font-display text-[9px] font-bold tracking-[0.22em] text-[var(--ink-dim)]">
              MEASURING LATENCY
            </span>
            <span className="flex gap-1.5">
              {pings.map((p, i) => (
                <span key={i} className="anim-pop flex flex-col items-center gap-0.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: NX.green, boxShadow: `0 0 8px ${NX.green}` }}
                  />
                  <span className="text-[8px] font-bold" style={{ color: NX.green }}>
                    {Math.round(p)}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </GlassCard>
      )}

      {phase === "idle" && (
        <div className="space-y-3.5">
          <GlassCard className="p-3.5 flex items-center gap-3 anim-fade-up">
            <span style={{ color: NX.cyan }}>
              <Icon name="server" size={19} />
            </span>
            <div className="flex-1">
              <p className="text-[12px] font-bold text-[var(--ink)]">Test Server</p>
              <p className="text-[10.5px] text-[var(--ink-dim)] font-medium">Auto-selected nearest NEXUS edge node</p>
            </div>
            <span className="font-display text-[8.5px] font-bold tracking-widest px-2 py-1 rounded-md" style={{ color: NX.green, background: `${NX.green}14` }}>
              READY
            </span>
          </GlassCard>
          <NeonButton icon="play" from={NX.purple} to={NX.cyan} className="w-full py-3.5" onClick={start}>
            RUN SPEED TEST
          </NeonButton>
        </div>
      )}

      {(phase === "down" || phase === "up") && (
        <GlassCard className="p-3.5 flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full anim-blink"
            style={{ background: phase === "down" ? NX.cyan : NX.purple, boxShadow: `0 0 10px currentColor`, color: phase === "down" ? NX.cyan : NX.purple }}
          />
          <p className="text-[12px] font-semibold text-[var(--ink-dim)]">
            {phase === "down" ? "Pulling payload from edge nodeâ€¦" : "Pushing payload to edge nodeâ€¦"}
          </p>
          <span className="ml-auto font-display font-bold text-[16px]" style={{ color: phase === "down" ? NX.cyan : NX.purple, textShadow: "0 0 12px currentColor" }}>
            {fmt(disp)}
          </span>
        </GlassCard>
      )}

      {/* ------------------------------ results ------------------------------ */}
      {phase === "done" && result && (
        <div className="space-y-3.5">
          <GlassCard className="relative overflow-hidden p-4 anim-pop">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(80% 60% at 50% 0%, ${result.gradeColor}14, transparent 70%)` }}
            />
            <div className="relative flex items-center gap-4">
              <div className="flex-1 space-y-2.5">
                {[
                  { icon: "download", label: "Download", val: `${fmt(result.down)} Mbps`, c: NX.cyan },
                  { icon: "upload", label: "Upload", val: `${fmt(result.up)} Mbps`, c: NX.purple },
                  { icon: "ping", label: "Ping", val: `${Math.round(result.ping)} ms`, c: NX.green },
                  { icon: "timer", label: "Jitter", val: `${fmt(result.jitter)} ms`, c: NX.yellow },
                  { icon: "server", label: "Server", val: result.server, c: NX.white, small: true },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2.5">
                    <span style={{ color: r.c }}>
                      <Icon name={r.icon} size={14} />
                    </span>
                    <span className="text-[11px] font-semibold text-[var(--ink-dim)] w-[72px]">{r.label}</span>
                    <span
                      className={cn("font-bold", r.small ? "text-[10.5px] font-semibold" : "text-[13px] font-display")}
                      style={{ color: "var(--ink)" }}
                    >
                      {r.val}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-center shrink-0">
                <div
                  className="anim-pop grid place-items-center w-[74px] h-[74px] rounded-full font-display font-black text-[30px]"
                  style={{
                    color: result.gradeColor,
                    border: `2px solid ${result.gradeColor}`,
                    boxShadow: `0 0 22px ${result.gradeColor}66, inset 0 0 18px ${result.gradeColor}22`,
                    textShadow: `0 0 16px ${result.gradeColor}`,
                    animationDelay: "200ms",
                  }}
                >
                  {result.grade}
                </div>
                <p className="font-display text-[7.5px] tracking-[0.22em] text-[var(--ink-faint)] mt-1.5">GRADE</p>
              </div>
            </div>
            <p className="relative text-center font-display text-[7.5px] tracking-[0.3em] text-[var(--ink-faint)] mt-3">
              POWERED BY NEXUS PING PRO
            </p>
          </GlassCard>

          <GlassCard className="p-3.5 anim-fade-up">
            <div className="flex items-center justify-between mb-1">
              <span className="font-display text-[9px] font-bold tracking-[0.22em] text-[var(--ink-dim)]">
                SPEED HISTORY â€” LAST {sim.speedHistory.length} TESTS
              </span>
              <span className="flex items-center gap-2 text-[8.5px] font-bold">
                <span className="flex items-center gap-1" style={{ color: NX.cyan }}>
                  <span className="w-2 h-0.5 rounded" style={{ background: NX.cyan }} /> DOWN
                </span>
                <span className="flex items-center gap-1" style={{ color: NX.purple }}>
                  <span className="w-2 h-0.5 rounded" style={{ background: NX.purple }} /> UP
                </span>
              </span>
            </div>
            <HistoryChart
              down={sim.speedHistory.map((r) => r.down)}
              up={sim.speedHistory.map((r) => r.up)}
            />
          </GlassCard>

          <div className="grid grid-cols-2 gap-3">
            <NeonButton icon="share" from={NX.purple} to={NX.cyan} onClick={share}>
              SHARE
            </NeonButton>
            <NeonButton icon="refresh" from={NX.green} to={NX.cyan} dark onClick={start}>
              RUN AGAIN
            </NeonButton>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && (
        <div className="absolute top-2 inset-x-4 z-50 flex justify-center pointer-events-none">
          <div className="anim-toast glass-deep rounded-xl px-4 py-2 text-[11px] font-semibold" style={{ borderColor: `${NX.cyan}55` }}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
