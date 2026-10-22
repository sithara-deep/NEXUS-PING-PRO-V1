import { useEffect, useRef, useState } from "react";
import { NX, signalQuality } from "../lib/brand";
import { useNexus } from "../state/AppState";
import { GlassCard, NeonButton, ScreenHeader } from "../components/ui";
import { Icon } from "../components/Icons";
import { Confetti, Radar } from "../components/charts";
import { cn } from "../utils/cn";

const STEPS = [
  "Scanning network towersâ€¦",
  "Analyzing signal strengthâ€¦",
  "Clearing network cacheâ€¦",
  "Refreshing DNS settingsâ€¦",
  "Optimizing connectionâ€¦",
  "Stabilizing signalâ€¦",
  "Applying NEXUS protocolâ€¦",
  "Boost complete!",
];

type Phase = "idle" | "running" | "done";

export function Boost({ autoRun }: { autoRun: number }) {
  const { sim, applyBoost } = useNexus();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [before, setBefore] = useState(-88);
  const [after, setAfter] = useState(-58);
  const [pct, setPct] = useState(0);
  const iv = useRef<number | null>(null);

  const start = () => {
    setBefore(sim.net.dbm);
    setProgress(0);
    setPhase("running");
  };

  /* quick actions from Home auto-start the engine */
  useEffect(() => {
    if (autoRun > 0) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  useEffect(() => {
    if (phase !== "running") return;
    iv.current = window.setInterval(() => {
      setProgress((p) => {
        const np = p + 0.75 + Math.random() * 0.65;
        if (np >= 100) {
          if (iv.current) window.clearInterval(iv.current);
          const res = applyBoost(before);
          setAfter(res.afterDbm);
          setPct(res.pct);
          window.setTimeout(() => setPhase("done"), 420);
          return 100;
        }
        return np;
      });
    }, 52);
    return () => {
      if (iv.current) window.clearInterval(iv.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const stepIdx = Math.min(7, Math.floor(progress / 12.5));
  const qb = signalQuality(before);
  const qa = signalQuality(after);

  return (
    <div className="px-4 pt-1 pb-28 relative">
      <ScreenHeader title="NEXUS BOOST ENGINE" sub="signal optimization core" color={NX.cyan} />

      {/* ------------------------------ IDLE ------------------------------ */}
      {phase === "idle" && (
        <div className="space-y-4">
          <div className="flex justify-center anim-fade-up">
            <Radar size={216} />
          </div>
          <p className="text-center text-[12px] text-[var(--ink-dim)] font-medium leading-relaxed px-4 anim-fade-up" style={{ animationDelay: "120ms" }}>
            The boost engine re-registers your radio, flushes DNS, kills
            network-hogging background processes and locks the fastest tower.
          </p>
          <div className="flex flex-wrap justify-center gap-1.5 anim-fade-up" style={{ animationDelay: "200ms" }}>
            {["AIRPLANE CYCLE", "DNS FLUSH", "APN REFRESH", "RE-REGISTER", "PROC KILL"].map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded-md font-display text-[7.5px] font-bold tracking-[0.14em] text-[var(--ink-dim)] border border-white/10 bg-white/4"
              >
                {t}
              </span>
            ))}
          </div>
          <NeonButton icon="bolt" from={NX.green} to={NX.cyan} dark className="w-full py-3.5" onClick={start}>
            START NEXUS BOOST
          </NeonButton>
          <GlassCard className="p-3 flex items-center gap-3">
            <span style={{ color: NX.cyan }}>
              <Icon name="shield" size={18} />
            </span>
            <p className="text-[11px] text-[var(--ink-dim)] font-medium leading-snug">
              {sim.boostCount === 0
                ? "No boosts yet this session. Current signal is unoptimized."
                : `${sim.boostCount} boost${sim.boostCount > 1 ? "s" : ""} applied this session â€” engine warm.`}
            </p>
          </GlassCard>
        </div>
      )}

      {/* ------------------------------ RUNNING ------------------------------ */}
      {phase === "running" && (
        <div className="space-y-4">
          <div className="relative flex justify-center anim-pop">
            <Radar size={196} />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center bg-[#0A0E27]/70 rounded-full w-[104px] h-[104px] grid place-items-center backdrop-blur-sm">
                <span
                  className="font-display font-black text-[26px]"
                  style={{ color: NX.cyan, textShadow: `0 0 16px ${NX.cyan}` }}
                >
                  {Math.floor(progress)}%
                </span>
              </div>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden mx-2">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${NX.purple}, ${NX.cyan})`,
                boxShadow: `0 0 12px ${NX.cyan}`,
                transition: "width .12s linear",
              }}
            />
          </div>

          <GlassCard className="p-3.5 space-y-2.5">
            {STEPS.map((s, i) => {
              const done = i < stepIdx || progress >= 100;
              const active = i === stepIdx && progress < 100;
              return (
                <div key={s} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "grid place-items-center w-5.5 h-5.5 rounded-full shrink-0 transition-all duration-300",
                      done && "anim-pop"
                    )}
                    style={{
                      background: done ? `${NX.green}22` : active ? `${NX.cyan}1c` : "rgba(127,140,180,.1)",
                      color: done ? NX.green : active ? NX.cyan : "var(--ink-faint)",
                      boxShadow: done ? `0 0 10px ${NX.green}66` : active ? `0 0 10px ${NX.cyan}66` : "none",
                    }}
                  >
                    {done ? (
                      <Icon name="check" size={11} strokeWidth={3} />
                    ) : active ? (
                      <span
                        className="w-3 h-3 rounded-full border-[2px] border-t-transparent"
                        style={{ borderColor: NX.cyan, borderTopColor: "transparent", animation: "nx-sweep .7s linear infinite" }}
                      />
                    ) : (
                      <span className="w-1.5 h-1.5 rotate-45 bg-current opacity-60" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[12px] font-semibold tracking-wide transition-colors duration-300",
                      done ? "text-[var(--ink-dim)]" : active ? "text-[var(--ink)]" : "text-[var(--ink-faint)]"
                    )}
                    style={active ? { textShadow: `0 0 10px ${NX.cyan}88` } : undefined}
                  >
                    <span className="font-display text-[9px] mr-1.5 opacity-60">âœ¦</span>
                    {s}
                  </span>
                </div>
              );
            })}
          </GlassCard>
        </div>
      )}

      {/* ------------------------------ DONE ------------------------------ */}
      {phase === "done" && (
        <div className="relative space-y-4">
          <Confetti run />
          <div className="text-center pt-2 anim-pop">
            <div className="inline-flex items-center gap-2">
              <span className="font-display font-black text-[22px] tracking-[0.1em] glow-green" style={{ color: NX.green }}>
                SIGNAL OPTIMIZED
              </span>
              <span
                className="grid place-items-center w-7 h-7 rounded-full anim-pop"
                style={{ background: `${NX.green}22`, color: NX.green, boxShadow: `0 0 16px ${NX.green}88`, animationDelay: "300ms" }}
              >
                <Icon name="check" size={15} strokeWidth={3} />
              </span>
            </div>
            <p className="text-[12px] text-[var(--ink-dim)] font-semibold mt-2 tracking-wide">
              NEXUS PING PRO made it better!
            </p>
          </div>

          <GlassCard className="p-4 anim-fade-up" style={{ animationDelay: "150ms" }}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="text-center">
                <p className="font-display text-[8px] tracking-[0.24em] text-[var(--ink-faint)] mb-1.5">BEFORE</p>
                <p className="font-display font-bold text-[22px]" style={{ color: qb.color, textShadow: `0 0 12px ${qb.color}77` }}>
                  {Math.round(before)}
                </p>
                <p className="text-[9px] font-bold tracking-wider" style={{ color: qb.color }}>{qb.label}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${((before + 120) / 70) * 100}%`, background: qb.color }} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span
                  className="grid place-items-center w-9 h-9 rounded-full"
                  style={{ background: `${NX.cyan}18`, color: NX.cyan, boxShadow: `0 0 16px ${NX.cyan}66` }}
                >
                  <Icon name="chevron" size={17} strokeWidth={2.6} />
                </span>
                <span className="font-display text-[10px] font-black" style={{ color: NX.green, textShadow: `0 0 10px ${NX.green}` }}>
                  +{pct}%
                </span>
              </div>
              <div className="text-center">
                <p className="font-display text-[8px] tracking-[0.24em] text-[var(--ink-faint)] mb-1.5">AFTER</p>
                <p className="font-display font-bold text-[22px]" style={{ color: qa.color, textShadow: `0 0 12px ${qa.color}77` }}>
                  {Math.round(after)}
                </p>
                <p className="text-[9px] font-bold tracking-wider" style={{ color: qa.color }}>{qa.label}</p>
                <div className="mt-2 h-1.5 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${((after + 120) / 70) * 100}%`, background: `linear-gradient(90deg, ${NX.purple}, ${NX.green})`, boxShadow: `0 0 8px ${NX.green}` }}
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] text-[var(--ink-faint)] font-semibold tracking-[0.18em] mt-3">
              dBm SIGNAL STRENGTH
            </p>
          </GlassCard>

          <GlassCard className="p-3 flex items-center gap-3 anim-fade-up">
            <span style={{ color: NX.green }}>
              <Icon name="check" size={18} />
            </span>
            <p className="text-[11px] text-[var(--ink-dim)] font-medium leading-snug">
              Airplane-mode cycled Â· DNS cache flushed Â· fresh network registration Â· APN refreshed Â· 4 background hogs terminated
            </p>
          </GlassCard>

          <div className="grid grid-cols-2 gap-3">
            <NeonButton icon="bolt" from={NX.green} to={NX.cyan} dark onClick={start}>
              BOOST AGAIN
            </NeonButton>
            <button
              onClick={() => setPhase("idle")}
              className="press rounded-xl border border-white/12 font-display text-[11px] font-bold tracking-[0.16em] text-[var(--ink-dim)]"
            >
              IDLE MODE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

