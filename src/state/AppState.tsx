
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CARRIERS,
  SERVERS,
  bandFor,
  clamp,
  clockTime,
  networkTypeFor,
} from "../lib/brand";

/* ------------------------------ types ------------------------------ */

export interface NetState {
  dbm: number;
  ping: number;
  jitter: number;
  down: number;
  up: number;
  netType: string;
  band: string;
  carrier: string;
  ip: string;
  stability: number;
  packetLoss: number;
  uptime: number;
  dataMB: number;
  server: string;
}

export type EventKind = "connected" | "dropped" | "weak" | "optimized" | "info";

export interface LogEvent {
  id: number;
  time: string;
  msg: string;
  kind: EventKind;
}

export interface Noti {
  id: number;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface GameToggles {
  lowLatency: boolean;
  appKiller: boolean;
  dnsOpt: boolean;
  priority: boolean;
  stabilizer: boolean;
  gamingDns: boolean;
}

export interface MonitorToggles {
  autoReconnect: boolean;
  keepAlive: boolean;
  dropDetection: boolean;
}

export interface Settings {
  autoBoost: boolean;
  bootStart: boolean;
  hapticsOn: boolean;
  preferredNet: "Auto" | "4G Only" | "5G Only";
  keepAliveInterval: "30s" | "1m" | "2m" | "5m";
  dns: "auto" | "google" | "cloudflare" | "opendns" | "custom";
  customDns: string;
  weakAlert: boolean;
  dropAlert: boolean;
  speedAlert: boolean;
  dailyReport: boolean;
  theme: "dark" | "light";
  accent: "cyan" | "purple" | "green";
  language: string;
  gaming: GameToggles;
  monitor: MonitorToggles;
  sensitivity: number;
}

export interface SpeedResult {
  id: number;
  down: number;
  up: number;
  ping: number;
  jitter: number;
  server: string;
  grade: string;
  gradeColor: string;
  time: string;
}

interface Sim {
  tick: number;
  net: NetState;
  sigHist: number[]; // last 60 s
  pingHist: number[]; // last 60 s
  miniHist: number[]; // last 30 s
  events: LogEvent[];
  notis: Noti[];
  settings: Settings;
  gamingActive: boolean;
  gamingBefore: number;
  boostLift: number;
  boostCount: number;
  speedHistory: SpeedResult[];
  fixAt: number;
  weakCooldown: number;
  slowCooldown: number;
  dropCooldown: number;
}

/* ------------------------------ seed ------------------------------ */

let ID = 100;
const nid = () => ++ID;

function walkSeed(n: number, start: number, spread: number, lo: number, hi: number) {
  const out: number[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v = clamp(v + (Math.random() - 0.5) * spread, lo, hi);
    out.push(v);
  }
  return out;
}

function seedState(): Sim {
  const sigHist = walkSeed(60, -66, 5, -112, -54);
  const pingHist = sigHist.map((d) => clamp(8 + (-51 - d) * 1.05 + Math.random() * 6, 6, 260));
  const miniHist = sigHist.slice(-30);
  const dbm = sigHist[sigHist.length - 1];
  const evBase: Array<[string, EventKind]> = [
    ["BOOT_COMPLETED â†’ NEXUS service armed", "info"],
    ["Foreground service started â€” protecting your connection", "optimized"],
    [`Registered on ${CARRIERS[0]} â€¢ ${networkTypeFor(dbm, "Auto")}`, "connected"],
    ["DNS resolver set â†’ 1.1.1.1 (Cloudflare)", "info"],
    ["Keep-alive heartbeat OK â€¢ 14 ms", "optimized"],
  ];
  const now = Date.now();
  return {
    tick: 0,
    net: {
      dbm,
      ping: pingHist[pingHist.length - 1],
      jitter: 3.1,
      down: 182.4,
      up: 61.8,
      netType: networkTypeFor(dbm, "Auto"),
      band: bandFor(networkTypeFor(dbm, "Auto"), 2),
      carrier: CARRIERS[0],
      ip: "103.87.142.66",
      stability: 97.2,
      packetLoss: 0.4,
      uptime: 2 * 3600 + 14 * 60 + 9,
      dataMB: 812,
      server: SERVERS[0],
    },
    sigHist,
    pingHist,
    miniHist,
    events: evBase.map(([msg, kind], i) => ({
      id: nid(),
      time: clockTime(new Date(now - (evBase.length - i) * 47_000)),
      msg,
      kind,
    })),
    notis: [
      {
        id: nid(),
        icon: "shield",
        title: "NEXUS is protecting your connection",
        body: "Persistent monitor armed. Ping Less. Play More.",
        time: clockTime(new Date(now - 60_000)),
        read: false,
      },
    ],
    settings: {
      autoBoost: true,
      bootStart: true,
      hapticsOn: true,
      preferredNet: "Auto",
      keepAliveInterval: "1m",
      dns: "cloudflare",
      customDns: "",
      weakAlert: true,
      dropAlert: true,
      speedAlert: true,
      dailyReport: false,
      theme: "dark",
      accent: "cyan",
      language: "English",
      gaming: {
        lowLatency: true,
        appKiller: true,
        dnsOpt: true,
        priority: false,
        stabilizer: true,
        gamingDns: true,
      },
      monitor: { autoReconnect: true, keepAlive: true, dropDetection: true },
      sensitivity: 65,
    },
    gamingActive: false,
    gamingBefore: 0,
    boostLift: 0,
    boostCount: 0,
    speedHistory: [
      { id: nid(), down: 96.2, up: 41.5, ping: 38, jitter: 5.2, server: SERVERS[2], grade: "B", gradeColor: "#00D4FF", time: "09:12" },
      { id: nid(), down: 141.8, up: 52.3, ping: 31, jitter: 4.1, server: SERVERS[0], grade: "B", gradeColor: "#00D4FF", time: "11:47" },
      { id: nid(), down: 226.4, up: 84.9, ping: 22, jitter: 2.6, server: SERVERS[1], grade: "A", gradeColor: "#00FF88", time: "14:03" },
      { id: nid(), down: 188.1, up: 66.2, ping: 27, jitter: 3.4, server: SERVERS[0], grade: "A", gradeColor: "#00FF88", time: "17:36" },
    ],
    fixAt: -1,
    weakCooldown: 0,
    slowCooldown: 0,
    dropCooldown: 14,
  };
}

/* ------------------------------ tick ------------------------------ */

const AMBIENT: Array<[string, EventKind]> = [
  ["Keep-alive ping sent â†’ gateway 12 ms", "info"],
  ["DNS cache refreshed via 1.1.1.1", "optimized"],
  ["Handover complete â€¢ cell reselection OK", "connected"],
  ["TCP window auto-tuned â€¢ +11% throughput", "optimized"],
  ["Route optimized â†’ NEXUS edge node", "optimized"],
  ["Background scan: 3 towers in range", "info"],
];

function step(prev: Sim): Sim {
  const t = prev.tick + 1;
  const s = prev.settings;
  const events: LogEvent[] = [];
  const notis: Noti[] = [];

  /* --- signal random walk pulled toward boosted baseline --- */
  const boostLift = Math.max(0, prev.boostLift - 0.12);
  const baseline = -64 + boostLift;
  let dbm = prev.net.dbm + (Math.random() - 0.5) * 4.2 + (baseline - prev.net.dbm) * 0.07;
  let packetLoss = clamp(prev.net.packetLoss + (Math.random() - 0.5) * 0.5, 0, 4);

  /* --- random signal drop + auto fix --- */
  let dropCooldown = Math.max(0, prev.dropCooldown - 1);
  let fixAt = prev.fixAt;
  const dropChance = 0.01 + (100 - s.sensitivity) * 0.00025;
  if (dropCooldown === 0 && Math.random() < dropChance) {
    dbm -= 26 + Math.random() * 10;
    packetLoss += 2.5;
    dropCooldown = 26;
    events.push({ id: nid(), time: clockTime(), msg: "Connection dropped â€” signal below threshold", kind: "dropped" });
    if (s.dropAlert)
      notis.push({ id: nid(), icon: "close", title: "Connection Dropped!", body: "NEXUS is reconnectingâ€¦", time: clockTime(), read: false });
    if (s.monitor.dropDetection && s.monitor.autoReconnect) fixAt = t + 3;
  }
  if (fixAt === t) {
    fixAt = -1;
    dbm += 24;
    events.push({ id: nid(), time: clockTime(), msg: "NEXUS detected signal drop â†’ Auto-fixed!", kind: "optimized" });
  }
  dbm = clamp(dbm, -118, -51);

  const netType = networkTypeFor(dbm, s.preferredNet);
  const band = bandFor(netType, t);

  /* --- weak-signal notification (throttled) --- */
  let weakCooldown = Math.max(0, prev.weakCooldown - 1);
  if (dbm < -90 && weakCooldown === 0 && s.weakAlert) {
    weakCooldown = 30;
    events.push({ id: nid(), time: clockTime(), msg: `Weak signal ${Math.round(dbm)} dBm â€” boost recommended`, kind: "weak" });
    notis.push({ id: nid(), icon: "bars", title: "Weak Signal Detected!", body: "Tap to run NEXUS Boost", time: clockTime(), read: false });
  }

  /* --- throughput model --- */
  const capacity = Math.max(4, Math.pow(clamp((dbm + 120) / 69, 0, 1), 1.55) * 940);
  const gamingFactor = prev.gamingActive && s.gaming.lowLatency ? 0.55 : 1;
  const pingTarget = clamp((7 + (-51 - dbm) * 1.08) * gamingFactor + Math.random() * 5, 5, 320);
  const ping = prev.net.ping * 0.6 + pingTarget * 0.4;
  const jitter = s.gaming.stabilizer && prev.gamingActive
    ? clamp(ping * 0.05 + Math.random(), 0.4, 6)
    : clamp(ping * 0.14 + Math.random() * 2, 0.6, 28);
  const down = prev.net.down * 0.55 + capacity * (0.8 + Math.random() * 0.35) * 0.45;
  const up = prev.net.up * 0.55 + down * (0.32 + Math.random() * 0.18) * 0.45;

  /* --- slow-speed notification --- */
  let slowCooldown = Math.max(0, prev.slowCooldown - 1);
  if (down < 12 && slowCooldown === 0 && s.speedAlert) {
    slowCooldown = 45;
    notis.push({ id: nid(), icon: "download", title: "Slow Speed Detected!", body: "Run NEXUS Speed Fix?", time: clockTime(), read: false });
  }

  /* --- ambient log chatter --- */
  if (Math.random() < 0.09) {
    const [msg, kind] = AMBIENT[Math.floor(Math.random() * AMBIENT.length)];
    events.push({ id: nid(), time: clockTime(), msg, kind });
  }
  if (dbm < -98 && Math.random() < 0.3)
    events.push({ id: nid(), time: clockTime(), msg: `Signal weak â€¢ ${Math.round(dbm)} dBm`, kind: "weak" });

  const sigHist = [...prev.sigHist, dbm].slice(-60);
  const pingHist = [...prev.pingHist, ping].slice(-60);
  const miniHist = [...prev.miniHist, dbm].slice(-30);
  const stability = clamp(
    100 - packetLoss * 3.4 - jitter * 0.55 - (dbm < -95 ? 8 : 0),
    52,
    99.9
  );

  return {
    ...prev,
    tick: t,
    boostLift,
    dropCooldown,
    fixAt,
    weakCooldown,
    slowCooldown,
    net: {
      ...prev.net,
      dbm,
      ping,
      jitter,
      down,
      up,
      netType,
      band,
      packetLoss,
      stability,
      uptime: prev.net.uptime + 1,
      dataMB: prev.net.dataMB + down / 8,
    },
    sigHist,
    pingHist,
    miniHist,
    events: [...prev.events, ...events].slice(-42),
    notis: [...notis.reverse(), ...prev.notis].slice(0, 20),
  };
}

/* ------------------------------ context ------------------------------ */

export interface NexusCtx {
  sim: Sim;
  patchSettings: (p: Partial<Settings>) => void;
  setGameToggle: (k: keyof GameToggles, v: boolean) => void;
  setGaming: (on: boolean) => void;
  applyBoost: (beforeDbm: number) => { afterDbm: number; pct: number };
  markNotisRead: () => void;
  clearNotis: () => void;
  addSpeedResult: (r: Omit<SpeedResult, "id" | "time">) => void;
  pushNoti: (n: Omit<Noti, "id" | "time" | "read">) => void;
}

const Ctx = createContext<NexusCtx | null>(null);

export function NexusProvider({ children }: { children: ReactNode }) {
  const [sim, setSim] = useState<Sim>(seedState);

  useEffect(() => {
    const iv = window.setInterval(() => setSim((p) => step(p)), 1000);
    return () => window.clearInterval(iv);
  }, []);

  const api = useMemo<NexusCtx>(
    () => ({
      sim,
      patchSettings: (p) =>
        setSim((prev) => ({ ...prev, settings: { ...prev.settings, ...p } })),
      setGameToggle: (k, v) =>
        setSim((prev) => ({
          ...prev,
          settings: { ...prev.settings, gaming: { ...prev.settings.gaming, [k]: v } },
        })),
      setGaming: (on) =>
        setSim((prev) => {
          const events = [...prev.events];
          if (on) {
            events.push({
              id: nid(),
              time: clockTime(),
              msg: "NEXUS GAMING ENGINE engaged â€” low-latency route locked",
              kind: "optimized",
            });
          } else {
            events.push({
              id: nid(),
              time: clockTime(),
              msg: "Gaming mode disengaged â€” normal routing restored",
              kind: "info",
            });
          }
          return {
            ...prev,
            gamingActive: on,
            gamingBefore: on ? prev.net.ping : prev.gamingBefore,
            events: events.slice(-42),
          };
        }),
      applyBoost: (beforeDbm) => {
        const afterDbm = clamp(beforeDbm + 24, -118, -52);
        const rawPct = Math.round(
          ((afterDbm + 120) - (beforeDbm + 120)) / Math.abs(beforeDbm + 120 + 0.001) * 100
        );
        const out = { afterDbm, pct: Math.min(99, Math.max(8, Math.abs(rawPct))) };
        setSim((prev) => {
          return {
            ...prev,
            boostLift: 24,
            boostCount: prev.boostCount + 1,
            net: { ...prev.net, dbm: afterDbm },
            sigHist: [...prev.sigHist, afterDbm].slice(-60),
            miniHist: [...prev.miniHist, afterDbm].slice(-30),
            events: [
              ...prev.events,
              { id: nid(), time: clockTime(), msg: "NEXUS protocol applied â€” signal optimized", kind: "optimized" as EventKind },
              { id: nid(), time: clockTime(), msg: "DNS cache cleared â€¢ fresh registration requested", kind: "info" as EventKind },
            ].slice(-42),
            notis: [
              {
                id: nid(),
                icon: "check",
                title: "NEXUS Boost Complete!",
                body: `Signal improved by ${out.pct}%`,
                time: clockTime(),
                read: false,
              },
              ...prev.notis,
            ].slice(0, 20),
          };
        });
        return out;
      },
      markNotisRead: () =>
        setSim((prev) => ({
          ...prev,
          notis: prev.notis.map((n) => ({ ...n, read: true })),
        })),
      clearNotis: () => setSim((prev) => ({ ...prev, notis: [] })),
      addSpeedResult: (r) =>
        setSim((prev) => ({
          ...prev,
          speedHistory: [
            ...prev.speedHistory,
            { ...r, id: nid(), time: clockTime() },
          ].slice(-7),
        })),
      pushNoti: (n) =>
        setSim((prev) => ({
          ...prev,
          notis: [{ ...n, id: nid(), time: clockTime(), read: false }, ...prev.notis].slice(0, 20),
        })),
    }),
    [sim]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useNexus(): NexusCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNexus outside provider");
  return v;
}
