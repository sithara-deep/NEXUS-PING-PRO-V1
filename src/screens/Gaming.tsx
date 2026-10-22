import { useState } from "react";
import { NX, clamp, haptic } from "../lib/brand";
import { useNexus, type GameToggles } from "../state/AppState";
import { GlassCard, NeonButton, NeonToggle, ScreenHeader, SettingRow } from "../components/ui";
import { Icon } from "../components/Icons";
import { Sparkline } from "../components/charts";

const GAMES = [
  { id: "pubg", name: "PUBG", icon: "helmet", color: "#F2A900" },
  { id: "ff", name: "FREE FIRE", icon: "flame", color: "#FF5722" },
  { id: "ml", name: "MOBILE LEGENDS", icon: "swords", color: "#00C6FF" },
  { id: "cod", name: "COD MOBILE", icon: "skull", color: "#9BE500" },
  { id: "gi", name: "GENSHIN", icon: "atom", color: "#00E5C8" },
] as const;

const FEATURES: Array<{ k: keyof GameToggles; icon: string; title: string; sub: string; color: string }> = [
  { k: "lowLatency", icon: "ping", title: "Low Latency Mode", sub: "Route packets via NEXUS edge lanes", color: NX.red },
  { k: "appKiller", icon: "skull", title: "Background App Killer", sub: "Terminate network-hungry apps", color: NX.orange },
  { k: "dnsOpt", icon: "globe", title: "DNS Optimizer", sub: "Auto-select fastest resolver", color: NX.cyan },
  { k: "priority", icon: "bolt", title: "Network Priority Boost", sub: "Game traffic gets QoS lane 1", color: NX.yellow },
  { k: "stabilizer", icon: "antenna", title: "Ping Stabilizer", sub: "Flatten jitter spikes in real time", color: NX.green },
  { k: "gamingDns", icon: "gamepad", title: "Gaming DNS (1.1.1.1)", sub: "Cloudflare low-latency resolver", color: NX.purple },
];

export function Gaming() {
  const { sim, setGameToggle, setGaming } = useNexus();
  const [selected, setSelected] = useState<string>("pubg");
  const [toast, setToast] = useState("");

  const g = sim.settings.gaming;
  const enabled = Object.values(g).filter(Boolean).length;
  const antiLag = clamp(46 + enabled * 7 + (sim.gamingActive ? 9 : 0), 0, 99);
  const avgAfter = sim.pingHist.slice(-12).reduce((a, b) => a + b, 0) / 12;
  const pingColor = avgAfter < 40 ? NX.green : avgAfter < 80 ? NX.yellow : NX.red;

  const pick = (id: string, name: string) => {
    haptic();
    setSelected(id);
    setToast(`Optimizing route for ${name}â€¦`);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="px-4 pt-1 pb-28 relative">
      <ScreenHeader title="NEXUS GAMING ENGINE" sub="kill lag Â· lock frames" color={NX.red} />

      {/* status banner */}
      {sim.gamingActive ? (
        <div
          className="relative overflow-hidden rounded-xl mb-3.5 anim-pop"
          style={{
            background: `linear-gradient(90deg, ${NX.red}2e, ${NX.orange}24, ${NX.red}2e)`,
            border: `1px solid ${NX.red}66`,
            boxShadow: `0 0 22px ${NX.red}55, inset 0 0 18px ${NX.red}22`,
          }}
        >
          <div className="marquee-track py-2">
            {[0, 1].map((k) => (
              <span key={k} className="flex items-center shrink-0">
                {Array.from({ length: 3 }, (_, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 font-display text-[10px] font-black tracking-[0.3em] glow-red" style={{ color: NX.red }}>
                    <Icon name="gamepad" size={12} /> NEXUS GAMING ACTIVE
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-xl px-3.5 py-2.5 mb-3.5 flex items-center gap-2.5 anim-fade-up">
          <span style={{ color: NX.orange }}>
            <Icon name="gamepad" size={16} />
          </span>
          <p className="text-[10.5px] font-semibold text-[var(--ink-dim)]">
            Engine standby â€” engage before you queue up
          </p>
        </div>
      )}

      {/* game tiles */}
      <div className="grid grid-cols-5 gap-2 anim-fade-up" style={{ animationDelay: "60ms" }}>
        {GAMES.map((gm) => {
          const on = selected === gm.id;
          return (
            <button
              key={gm.id}
              onClick={() => pick(gm.id, gm.name)}
              className="press flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all duration-300"
              style={{
                background: on ? `color-mix(in srgb, ${gm.color} 16%, transparent)` : "color-mix(in srgb, var(--card) 55%, transparent)",
                border: `1px solid ${on ? gm.color : "color-mix(in srgb, var(--ink) 10%, transparent)"}`,
                boxShadow: on ? `0 0 16px ${gm.color}55` : "none",
              }}
            >
              <span
                className="grid place-items-center w-9 h-9 rounded-lg"
                style={{
                  background: `color-mix(in srgb, ${gm.color} 18%, transparent)`,
                  color: gm.color,
                  filter: on ? `drop-shadow(0 0 6px ${gm.color})` : "none",
                }}
              >
                <Icon name={gm.icon} size={19} />
              </span>
              <span className="font-display text-[6px] font-bold tracking-wider text-center leading-tight" style={{ color: on ? gm.color : "var(--ink-dim)" }}>
                {gm.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* master switch */}
      <div className="mt-3.5 anim-fade-up" style={{ animationDelay: "120ms" }}>
        {sim.gamingActive ? (
          <NeonButton icon="close" from={NX.red} to={NX.orange} className="w-full py-3.5" onClick={() => setGaming(false)}>
            DEACTIVATE GAMING MODE
          </NeonButton>
        ) : (
          <NeonButton icon="gamepad" from={NX.orange} to={NX.red} className="w-full py-3.5" onClick={() => setGaming(true)}>
            ACTIVATE GAMING MODE
          </NeonButton>
        )}
      </div>

      {/* live ping + anti-lag */}
      <div className="grid grid-cols-[1fr_auto] gap-3 mt-3.5 items-stretch">
        <GlassCard className="p-3.5 anim-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between">
            <span className="font-display text-[8.5px] font-bold tracking-[0.2em] text-[var(--ink-dim)]">
              LIVE PING {sim.gamingActive ? "â€¢ GAMING" : ""}
            </span>
            <span className="font-display font-black text-[22px]" style={{ color: pingColor, textShadow: `0 0 14px ${pingColor}88` }}>
              {Math.round(avgAfter)}<span className="text-[10px]"> ms</span>
            </span>
          </div>
          <div className="mt-1">
            <Sparkline data={sim.pingHist.slice(-30)} min={0} max={140} color={NX.orange} height={54} grid />
          </div>
          {sim.gamingActive && (
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-white/6">
              <span className="text-[9px] font-bold text-[var(--ink-faint)]">
                BEFORE <span style={{ color: NX.red }}>{Math.round(sim.gamingBefore)} ms</span>
              </span>
              <span className="text-[9px] font-bold text-[var(--ink-faint)]">
                NOW <span style={{ color: NX.green }}>{Math.round(avgAfter)} ms</span>
              </span>
              <span className="font-display text-[9px] font-black" style={{ color: NX.green, textShadow: `0 0 8px ${NX.green}` }}>
                -{Math.max(0, Math.round(((sim.gamingBefore - avgAfter) / Math.max(1, sim.gamingBefore)) * 100))}%
              </span>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-3 flex flex-col items-center justify-center anim-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="relative w-[76px] h-[76px]">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(232,244,255,.08)" strokeWidth="7" />
              <circle
                cx="40"
                cy="40"
                r="33"
                fill="none"
                stroke={NX.red}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${(antiLag / 100) * 207.3} 207.3`}
                style={{ filter: `drop-shadow(0 0 5px ${NX.red})`, transition: "stroke-dasharray .8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display font-black text-[19px]" style={{ color: NX.orange, textShadow: `0 0 12px ${NX.red}` }}>
                {antiLag}
              </span>
            </div>
          </div>
          <p className="font-display text-[7px] font-bold tracking-[0.22em] text-[var(--ink-dim)] mt-1.5 text-center">
            ANTI-LAG
            <br />
            SCORE /100
          </p>
        </GlassCard>
      </div>

      {/* feature toggles */}
      <GlassCard className="mt-3.5 divide-y divide-white/6 anim-fade-up" style={{ animationDelay: "240ms" }}>
        {FEATURES.map((f) => (
          <SettingRow
            key={f.k}
            icon={f.icon}
            title={f.title}
            sub={f.sub}
            color={f.color}
            right={<NeonToggle on={g[f.k]} onChange={(v) => setGameToggle(f.k, v)} color={f.color} />}
          />
        ))}
      </GlassCard>

      {/* compatible games */}
      <GlassCard className="mt-3.5 p-3.5 anim-fade-up" style={{ animationDelay: "280ms" }}>
        <span className="font-display text-[8.5px] font-bold tracking-[0.22em] text-[var(--ink-dim)]">
          COMPATIBLE GAMES
        </span>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {[...GAMES.map((x) => x.name), "FORTNITE", "CALL OF DUTY WARZONE", "ARENA BREAKOUT", "BRAWL STARS", "CLASH ROYALE"].map((t, i) => (
            <span
              key={t}
              className="px-2 py-1 rounded-md font-display text-[7px] font-bold tracking-[0.12em]"
              style={{
                color: GAMES[i % GAMES.length].color,
                background: `color-mix(in srgb, ${GAMES[i % GAMES.length].color} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${GAMES[i % GAMES.length].color} 30%, transparent)`,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </GlassCard>

      {toast && (
        <div className="absolute top-2 inset-x-4 z-50 flex justify-center pointer-events-none">
          <div className="anim-toast glass-deep rounded-xl px-4 py-2 text-[11px] font-semibold" style={{ borderColor: `${NX.orange}55` }}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
