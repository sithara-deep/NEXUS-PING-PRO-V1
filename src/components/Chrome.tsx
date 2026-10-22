import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { NX, clockTime, haptic, signalQuality } from "../lib/brand";
import { Icon } from "./Icons";
import { useNexus } from "../state/AppState";

/* ------------------------------ LogoMark ------------------------------ */

export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="nxlogo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={NX.purple} />
          <stop offset="100%" stopColor={NX.cyan} />
        </linearGradient>
      </defs>
      <path
        d="M24 2.5 42 13v22L24 45.5 6 35V13L24 2.5Z"
        stroke="url(#nxlogo)"
        strokeWidth="2.6"
        style={{ filter: `drop-shadow(0 0 6px ${NX.cyan})` }}
      />
      <path
        d="M15 32V16l18 16V16"
        stroke="url(#nxlogo)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="21" stroke={NX.cyan} strokeOpacity="0.25" strokeDasharray="2 6" />
    </svg>
  );
}

/* ------------------------------ StatusBar ------------------------------ */

export function StatusBar() {
  const { sim } = useNexus();
  const [now, setNow] = useState(clockTime());
  useEffect(() => {
    const iv = window.setInterval(() => setNow(clockTime()), 10_000);
    return () => window.clearInterval(iv);
  }, []);
  const q = signalQuality(sim.net.dbm);
  const bars = sim.net.dbm >= -70 ? 4 : sim.net.dbm >= -85 ? 3 : sim.net.dbm >= -100 ? 2 : 1;

  return (
    <div className="flex items-center justify-between px-6 pt-2.5 pb-1 text-[11px] font-semibold tracking-wide text-[var(--ink)]">
      <span className="font-display text-[10.5px]">{now}</span>
      <div className="flex items-center gap-1.5">
        <span className="font-display text-[8px] tracking-widest" style={{ color: q.color }}>
          {sim.net.netType}
        </span>
        <span className="flex items-end gap-[2px]">
          {[1, 2, 3, 4].map((b) => (
            <span
              key={b}
              className="w-[3px] rounded-sm"
              style={{
                height: 3 + b * 2.4,
                background: b <= bars ? q.color : "rgba(127,140,180,.35)",
                boxShadow: b <= bars ? `0 0 5px ${q.color}` : "none",
              }}
            />
          ))}
        </span>
        <Icon name="wifi" size={12} className="opacity-80" />
        <span className="flex items-center gap-0.5">
          <span className="text-[9px] opacity-70">87</span>
          <span className="relative w-[19px] h-[9.5px] rounded-[3px] border border-[var(--ink-dim)]">
            <span
              className="absolute inset-[1.5px] right-[4px] rounded-[1.5px]"
              style={{ background: NX.green, boxShadow: `0 0 5px ${NX.green}` }}
            />
            <span className="absolute -right-[3px] top-[2.5px] w-[2px] h-[4px] rounded-r bg-[var(--ink-dim)]" />
          </span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ AppBar ------------------------------ */

export function NexusAppBar({ onBell }: { onBell: () => void }) {
  const { sim, pushNoti } = useNexus();
  const unread = sim.notis.filter((n) => !n.read).length;

  return (
    <div className="relative z-20">
      <div className="flex items-center justify-between px-4 pt-1.5 pb-2.5">
        <div className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <div className="leading-none">
            <span
              className="font-display font-extrabold text-[14.5px] tracking-[0.12em]"
              style={{ color: NX.cyan, textShadow: `0 0 9px ${NX.cyan}cc, 0 0 26px ${NX.cyan}66` }}
            >
              NEXUS <span className="text-[var(--ink)]">PING</span>{" "}
              <span style={{ color: NX.purple, textShadow: `0 0 9px ${NX.purple}cc` }}>PRO</span>
            </span>
            <div className="text-[8.5px] tracking-[0.34em] text-[var(--ink-dim)] font-semibold mt-1">
              PING LESS Â· PLAY MORE
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              haptic(8);
              pushNoti({
                icon: "crown",
                title: "NEXUS ELITE unlocked",
                body: "Priority edge nodes + zero-ad boost engine active.",
              });
            }}
            className="press grid place-items-center w-8.5 h-8.5 rounded-xl glass"
            style={{ color: NX.yellow }}
            aria-label="Premium"
          >
            <Icon name="crown" size={16} />
          </button>
          <button
            onClick={() => {
              haptic(8);
              onBell();
            }}
            className="press relative grid place-items-center w-8.5 h-8.5 rounded-xl glass"
            style={{ color: "var(--ink)" }}
            aria-label="Notifications"
          >
            <Icon name="bell" size={16} />
            {unread > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-4 h-4 px-0.5 grid place-items-center rounded-full text-[8.5px] font-bold text-[#071022]"
                style={{ background: NX.red, boxShadow: `0 0 10px ${NX.red}` }}
              >
                {unread}
              </span>
            )}
          </button>
        </div>
      </div>
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${NX.purple}, ${NX.cyan}, transparent)`,
          boxShadow: `0 0 12px ${NX.cyan}88`,
        }}
      />
    </div>
  );
}

/* ------------------------------ BottomNav ------------------------------ */

export const TABS = [
  { id: "home", icon: "home", label: "HOME" },
  { id: "boost", icon: "bolt", label: "BOOST" },
  { id: "speed", icon: "rocket", label: "SPEED" },
  { id: "gaming", icon: "gamepad", label: "GAMING" },
  { id: "settings", icon: "gear", label: "SETTINGS" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function BottomNav({
  active,
  onNav,
}: {
  active: TabId;
  onNav: (t: TabId) => void;
}) {
  return (
    <div className="absolute bottom-0 inset-x-0 z-30">
      <div
        className="glass-deep mx-2 mb-2 rounded-2xl px-1.5 py-1.5 flex items-center justify-between"
        style={{ background: "color-mix(in srgb, #0A0E27 88%, transparent)" }}
      >
        {TABS.map((t) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                haptic(10);
                onNav(t.id);
              }}
              className="press relative flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl"
              aria-label={t.label}
            >
              <span
                className={cn(
                  "absolute top-0 h-[3px] w-7 rounded-full transition-all duration-300",
                  on ? "opacity-100" : "opacity-0"
                )}
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 0 10px var(--accent), 0 0 20px var(--accent)",
                }}
              />
              <span
                className="transition-all duration-300"
                style={{
                  color: on ? "var(--accent)" : "var(--ink-dim)",
                  filter: on ? "drop-shadow(0 0 7px var(--accent))" : "none",
                  transform: on ? "scale(1.18) translateY(-1px)" : "scale(1)",
                }}
              >
                <Icon name={t.icon} size={19} strokeWidth={on ? 2.1 : 1.7} />
              </span>
              <span
                className="font-display text-[7px] font-bold tracking-[0.18em] transition-colors duration-300"
                style={{ color: on ? "var(--accent)" : "var(--ink-faint)" }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ NotificationDrawer ------------------------------ */

const KIND_COLOR: Record<string, string> = {
  shield: NX.green,
  check: NX.green,
  bars: NX.yellow,
  close: NX.red,
  download: NX.orange,
  crown: NX.yellow,
};

export function NotificationDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { sim, markNotisRead, clearNotis } = useNexus();

  useEffect(() => {
    if (open && sim.notis.some((n) => !n.read)) {
      const t = window.setTimeout(markNotisRead, 900);
      return () => window.clearTimeout(t);
    }
  }, [open, sim.notis, markNotisRead]);

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" onClick={onClose} />
      <div
        className={cn(
          "absolute inset-x-2 top-10 bottom-16 rounded-2xl glass-deep flex flex-col overflow-hidden transition-transform duration-300",
          open ? "translate-y-0" : "-translate-y-6"
        )}
        style={{ background: "color-mix(in srgb, #0A0E27 92%, transparent)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
          <span className="font-display text-[11px] font-bold tracking-[0.24em]" style={{ color: NX.cyan }}>
            NEXUS ALERTS
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={clearNotis}
              className="press text-[10px] font-bold tracking-wider text-[var(--ink-dim)] px-2 py-1 rounded-md border border-white/10"
            >
              CLEAR
            </button>
            <button onClick={onClose} className="press text-[var(--ink)]" aria-label="Close">
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto nx-scroll p-2.5 space-y-2">
          {sim.notis.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <span style={{ color: NX.cyan }} className="anim-float">
                <Icon name="bell" size={38} strokeWidth={1.3} />
              </span>
              <p className="font-display text-[10px] tracking-[0.2em] text-[var(--ink-dim)]">
                ALL CLEAR â€” NO ALERTS
              </p>
              <p className="text-[11px] text-[var(--ink-faint)] max-w-[200px]">
                NEXUS will notify you about weak signal, drops and speed issues.
              </p>
            </div>
          )}
          {sim.notis.map((n) => (
            <div key={n.id} className="glass rounded-xl p-3 flex gap-3 anim-fade-up">
              <span
                className="grid place-items-center w-9 h-9 rounded-lg shrink-0"
                style={{
                  background: `${KIND_COLOR[n.icon] ?? NX.cyan}1a`,
                  color: KIND_COLOR[n.icon] ?? NX.cyan,
                  boxShadow: `0 0 12px ${KIND_COLOR[n.icon] ?? NX.cyan}33`,
                }}
              >
                <Icon name={n.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-bold text-[var(--ink)] truncate">{n.title}</span>
                  <span className="text-[9px] text-[var(--ink-faint)] shrink-0 font-semibold">{n.time}</span>
                </div>
                <p className="text-[11px] text-[var(--ink-dim)] leading-snug mt-0.5">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Toast ------------------------------ */

export function Toast({ msg, show }: { msg: string; show: boolean }) {
  if (!show) return null;
  return (
    <div className="absolute top-12 inset-x-4 z-50 flex justify-center pointer-events-none">
      <div
        className="anim-toast glass-deep rounded-xl px-4 py-2.5 text-[11.5px] font-semibold text-[var(--ink)] max-w-full"
        style={{
          background: "color-mix(in srgb, #0A0E27 90%, transparent)",
          boxShadow: `0 0 18px ${NX.cyan}44, 0 8px 24px rgba(0,0,0,.5)`,
          border: `1px solid ${NX.cyan}44`,
        }}
      >
        {msg}
      </div>
    </div>
  );
}
