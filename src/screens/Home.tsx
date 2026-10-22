import { useEffect, useState } from "react";
import { NX, fmt, signalQuality } from "../lib/brand";
import { useNexus } from "../state/AppState";
import { GlassCard, NeonButton, Skeleton, StatCard } from "../components/ui";
import { Icon } from "../components/Icons";
import { SignalGauge, Sparkline } from "../components/charts";

export function Home({
  goBoost,
  goSpeed,
  goGaming,
  goMonitor,
}: {
  goBoost: () => void;
  goSpeed: () => void;
  goGaming: () => void;
  goMonitor: () => void;
}) {
  const { sim } = useNexus();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 950);
    return () => window.clearTimeout(t);
  }, []);

  const n = sim.net;
  const q = signalQuality(n.dbm);

  if (loading) {
    return (
      <div className="px-4 pt-3 pb-28 space-y-3">
        <Skeleton className="h-64" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-[74px]" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
        <Skeleton className="h-28" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-3 pb-28 space-y-3.5">
      {/* ------------------------------ HERO ------------------------------ */}
      <GlassCard className="relative overflow-hidden px-4 pt-4 pb-5 anim-fade-up">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(70% 60% at 50% 20%, ${q.color}14, transparent 70%)`,
          }}
        />
        <div className="relative flex flex-col items-center">
          <div
            className="anim-pop flex items-center gap-1.5 px-3 py-1 rounded-full font-display text-[10px] font-bold tracking-[0.24em]"
            style={{
              color: NX.cyan,
              background: `${NX.cyan}14`,
              boxShadow: `0 0 16px ${NX.cyan}55, inset 0 0 10px ${NX.cyan}22`,
              border: `1px solid ${NX.cyan}55`,
            }}
          >
            <Icon name="wifi" size={12} />
            {n.netType} â€¢ {n.band}
          </div>

          <div className="mt-3">
            <SignalGauge dbm={n.dbm} size={216} sub={`PING ${Math.round(n.ping)} ms`} />
          </div>

          <div className="mt-2 flex items-center gap-2 text-[11.5px] font-semibold text-[var(--ink-dim)]">
            <Icon name="antenna" size={13} className="opacity-70" />
            {n.carrier}
            <span className="w-1 h-1 rounded-full bg-current opacity-40" />
            <span style={{ color: q.color }}>{n.ip}</span>
          </div>
        </div>
      </GlassCard>

      {/* ------------------------------ STATS GRID ------------------------------ */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon="download" label="DOWNLOAD" value={fmt(n.down)} unit="Mbps" color={NX.cyan} delay={40} sub="real-time throughput" />
        <StatCard icon="upload" label="UPLOAD" value={fmt(n.up)} unit="Mbps" color={NX.purple} delay={90} sub="uplink capacity" />
        <StatCard icon="ping" label="PING" value={String(Math.round(n.ping))} unit="ms" color={NX.green} delay={140} sub={`jitter ${fmt(n.jitter)} ms`} />
        <StatCard icon="bars" label="SIGNAL" value={String(Math.round(n.dbm))} unit="dBm" color={q.color} delay={190} sub={q.label.toLowerCase()} />
        <StatCard icon="globe" label="IP ADDRESS" value={n.ip} color={NX.white} delay={240} sub="IPv4 â€¢ edge-routed" />
        <StatCard icon="antenna" label="BAND" value={n.band} color={NX.orange} delay={290} sub={`${n.netType} tower â€¢ sector 7`} />
      </div>

      {/* ------------------------------ QUICK ACTIONS ------------------------------ */}
      <div className="grid grid-cols-2 gap-3 anim-fade-up" style={{ animationDelay: "180ms" }}>
        <NeonButton icon="bolt" from={NX.purple} to={NX.cyan} onClick={goBoost}>
          BOOST SIGNAL
        </NeonButton>
        <NeonButton icon="rocket" from={NX.green} to={NX.cyan} dark onClick={goSpeed}>
          SPEED TEST
        </NeonButton>
        <NeonButton icon="wrench" from={NX.red} to={NX.purple} onClick={goBoost}>
          FIX CONNECTION
        </NeonButton>
        <NeonButton icon="gamepad" from={NX.orange} to={NX.red} onClick={goGaming}>
          GAMING MODE
        </NeonButton>
      </div>

      {/* ------------------------------ MINI LIVE GRAPH ------------------------------ */}
      <GlassCard className="p-3.5 anim-fade-up" onClick={goMonitor}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="anim-blink w-1.5 h-1.5 rounded-full" style={{ background: NX.green, boxShadow: `0 0 8px ${NX.green}` }} />
            <span className="font-display text-[9.5px] font-bold tracking-[0.22em] text-[var(--ink-dim)]">
              LIVE SIGNAL â€” LAST 30s
            </span>
          </div>
          <span
            className="flex items-center gap-1 font-display text-[8.5px] font-bold tracking-[0.16em]"
            style={{ color: NX.cyan }}
          >
            OPEN MONITOR <Icon name="chevron" size={10} strokeWidth={2.6} />
          </span>
        </div>
        <Sparkline data={sim.miniHist} min={-120} max={-50} color={NX.cyan} height={72} grid />
        <div className="flex justify-between text-[9px] font-semibold text-[var(--ink-faint)] mt-1 px-0.5">
          <span>-30s</span>
          <span className="text-[var(--ink-dim)]">
            now Â· <span style={{ color: q.color }}>{Math.round(n.dbm)} dBm</span>
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
