import { NX, fmt, fmtData, fmtUptime, signalQuality } from "../lib/brand";
import { useNexus, type EventKind } from "../state/AppState";
import { GlassCard, NeonSlider, NeonToggle, ScreenHeader, SettingRow } from "../components/ui";
import { Icon } from "../components/Icons";
import { Sparkline } from "../components/charts";

const KIND_META: Record<EventKind, { color: string; label: string }> = {
  connected: { color: NX.green, label: "CONN" },
  dropped: { color: NX.red, label: "DROP" },
  weak: { color: NX.yellow, label: "WEAK" },
  optimized: { color: NX.cyan, label: "OPT" },
  info: { color: "rgba(232,244,255,.5)", label: "INFO" },
};

export function Monitor() {
  const { sim, patchSettings } = useNexus();
  const n = sim.net;
  const q = signalQuality(n.dbm);
  const mon = sim.settings.monitor;

  return (
    <div className="px-4 pt-1 pb-28">
      <ScreenHeader title="NEXUS LIVE MONITOR" sub="real-time connection telemetry" color={NX.cyan} />

      {/* foreground service banner */}
      <div
        className="glass rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 mb-3.5 anim-fade-up"
        style={{ boxShadow: `0 0 16px ${NX.green}22` }}
      >
        <span style={{ color: NX.green }}>
          <Icon name="shield" size={16} />
        </span>
        <p className="text-[10.5px] font-semibold text-[var(--ink-dim)] flex-1">
          NEXUS PING PRO is protecting your connection
        </p>
        <span className="anim-blink w-1.5 h-1.5 rounded-full" style={{ background: NX.green, boxShadow: `0 0 8px ${NX.green}` }} />
      </div>

      {/* signal graph */}
      <GlassCard className="p-3.5 anim-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-display text-[9px] font-bold tracking-[0.22em] text-[var(--ink-dim)]">
            SIGNAL STRENGTH â€” LAST 60s
          </span>
          <span
            className="font-display text-[10px] font-black px-2 py-0.5 rounded-md"
            style={{ color: q.color, background: `${q.color}14`, textShadow: `0 0 8px ${q.color}` }}
          >
            {Math.round(n.dbm)} dBm
          </span>
        </div>
        <Sparkline data={sim.sigHist} min={-120} max={-50} color={NX.cyan} height={104} grid />
        <div className="flex justify-between text-[9px] font-semibold text-[var(--ink-faint)] mt-1 px-0.5">
          <span>-60s</span>
          <span>-30s</span>
          <span>now</span>
        </div>
      </GlassCard>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 mt-3.5">
        <GlassCard className="p-3 anim-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.16em] text-[var(--ink-dim)]">
            <Icon name="target" size={12} /> STABILITY
          </div>
          <p className="font-display font-bold text-[20px] mt-1" style={{ color: NX.green, textShadow: `0 0 12px ${NX.green}66` }}>
            {fmt(n.stability)}<span className="text-[11px]">%</span>
          </p>
          <div className="mt-1.5 h-1 rounded-full bg-white/8 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${n.stability}%`, background: NX.green, boxShadow: `0 0 6px ${NX.green}` }} />
          </div>
        </GlassCard>
        <GlassCard className="p-3 anim-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.16em] text-[var(--ink-dim)]">
            <Icon name="close" size={12} /> PACKET LOSS
          </div>
          <p className="font-display font-bold text-[20px] mt-1" style={{ color: n.packetLoss > 2 ? NX.red : NX.yellow, textShadow: "0 0 12px currentColor" }}>
            {fmt(n.packetLoss)}<span className="text-[11px]">%</span>
          </p>
          <p className="text-[9px] font-semibold text-[var(--ink-faint)] mt-1.5">
            {n.packetLoss > 2 ? "degraded â€” NEXUS compensating" : "within tolerance"}
          </p>
        </GlassCard>
        <GlassCard className="p-3 anim-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.16em] text-[var(--ink-dim)]">
            <Icon name="timer" size={12} /> UPTIME
          </div>
          <p className="font-display font-bold text-[19px] mt-1" style={{ color: NX.cyan, textShadow: `0 0 12px ${NX.cyan}66` }}>
            {fmtUptime(n.uptime)}
          </p>
          <p className="text-[9px] font-semibold text-[var(--ink-faint)] mt-1.5">continuous connection</p>
        </GlassCard>
        <GlassCard className="p-3 anim-fade-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-1.5 text-[9px] font-display tracking-[0.16em] text-[var(--ink-dim)]">
            <Icon name="database" size={12} /> DATA TODAY
          </div>
          <p className="font-display font-bold text-[19px] mt-1" style={{ color: NX.purple, textShadow: `0 0 12px ${NX.purple}88` }}>
            {fmtData(n.dataMB)}
          </p>
          <p className="text-[9px] font-semibold text-[var(--ink-faint)] mt-1.5">metered usage tracked</p>
        </GlassCard>
      </div>

      {/* toggles */}
      <GlassCard className="mt-3.5 divide-y divide-white/6 anim-fade-up" style={{ animationDelay: "280ms" }}>
        <SettingRow
          icon="refresh"
          title="Auto-Reconnect"
          sub="Instantly re-register after any drop"
          color={NX.green}
          right={<NeonToggle on={mon.autoReconnect} onChange={(v) => patchSettings({ monitor: { ...mon, autoReconnect: v } })} color={NX.green} />}
        />
        <SettingRow
          icon="heart"
          title="Keep-Alive Service"
          sub={`Heartbeat every ${sim.settings.keepAliveInterval}`}
          color={NX.cyan}
          right={<NeonToggle on={mon.keepAlive} onChange={(v) => patchSettings({ monitor: { ...mon, keepAlive: v } })} />}
        />
        <SettingRow
          icon="target"
          title="Drop Detection"
          sub="Watchdog scans for micro-drops"
          color={NX.yellow}
          right={<NeonToggle on={mon.dropDetection} onChange={(v) => patchSettings({ monitor: { ...mon, dropDetection: v } })} color={NX.yellow} />}
        />
        <div className="px-3.5 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-[var(--ink)]">Detection sensitivity</span>
            <span className="font-display text-[10px] font-bold" style={{ color: mon.dropDetection ? NX.yellow : "var(--ink-faint)" }}>
              {sim.settings.sensitivity}%
            </span>
          </div>
          <NeonSlider
            value={sim.settings.sensitivity}
            onChange={(v) => patchSettings({ sensitivity: v })}
            disabled={!mon.dropDetection}
          />
        </div>
      </GlassCard>

      {/* event log */}
      <GlassCard className="mt-3.5 p-3.5 anim-fade-up" style={{ animationDelay: "320ms" }}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-display text-[9px] font-bold tracking-[0.22em] text-[var(--ink-dim)]">
            LIVE EVENT LOG
          </span>
          <span className="flex items-center gap-1.5 font-display text-[8px] font-bold tracking-widest" style={{ color: NX.green }}>
            <span className="anim-blink w-1.5 h-1.5 rounded-full" style={{ background: NX.green, boxShadow: `0 0 6px ${NX.green}` }} />
            STREAMING
          </span>
        </div>
        <div className="space-y-1.5 max-h-[228px] overflow-y-auto nx-scroll pr-1">
          {[...sim.events].reverse().map((e) => {
            const m = KIND_META[e.kind];
            return (
              <div key={e.id} className="flex items-center gap-2 py-1 border-b border-white/4 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                <span className="text-[9px] font-bold text-[var(--ink-faint)] w-[46px] shrink-0 font-display">{e.time}</span>
                <span
                  className="font-display text-[7px] font-bold tracking-widest px-1 py-0.5 rounded shrink-0"
                  style={{ color: m.color, background: `color-mix(in srgb, ${m.color} 12%, transparent)` }}
                >
                  {m.label}
                </span>
                <span className="text-[10.5px] font-medium text-[var(--ink-dim)] leading-tight truncate">{e.msg}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
