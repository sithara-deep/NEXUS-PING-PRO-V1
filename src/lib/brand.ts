/* ------------------------------------------------------------------ */
/* NEXUS PING PRO â€” brand constants, palette & helper functions        */
/* ------------------------------------------------------------------ */

export const NX = {
  bg: "#0A0E27",
  deep: "#05070F",
  card: "#1A1F45",
  cyan: "#00D4FF",
  purple: "#7B2FFF",
  green: "#00FF88",
  red: "#FF3D71",
  orange: "#FF9F43",
  yellow: "#FFD93D",
  white: "#E8F4FF",
} as const;

export const APP = {
  name: "NEXUS PING PRO",
  pkg: "com.nexuspingpro.app",
  version: "1.0.0",
  tagline: "Ping Less. Play More.",
  shortDesc: "Boost Signal. Kill Lag. Ping Less.",
  category: "Tools",
  storeTitle: "NEXUS PING PRO - Network Optimizer",
  keywords: [
    "nexus ping pro",
    "signal booster",
    "ping reducer",
    "network optimizer",
    "lag fix",
    "gaming network booster",
  ],
} as const;

export const ACCENTS: Record<string, string> = {
  cyan: NX.cyan,
  purple: NX.purple,
  green: NX.green,
};

export interface Quality {
  label: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  color: string;
}

/** Color-coded signal quality bands (spec):
 *  Green -50..-70 Â· Yellow -70..-85 Â· Orange -85..-100 Â· Red -100..-120 */
export function signalQuality(dbm: number): Quality {
  if (dbm >= -70) return { label: "EXCELLENT", color: NX.green };
  if (dbm >= -85) return { label: "GOOD", color: NX.yellow };
  if (dbm >= -100) return { label: "FAIR", color: NX.orange };
  return { label: "POOR", color: NX.red };
}

export function networkTypeFor(dbm: number, preferred: string): string {
  if (preferred === "4G Only") return "4G";
  if (preferred === "5G Only") return "5G";
  if (dbm >= -72) return "5G";
  if (dbm >= -96) return "4G";
  if (dbm >= -108) return "3G";
  return "2G";
}

export function bandFor(netType: string, tick: number): string {
  if (netType === "5G") return "n78";
  if (netType === "4G") return ["B1", "B3", "B7", "B40"][tick % 4];
  if (netType === "3G") return "B8";
  return "B2";
}

export function gradeFor(down: number, ping: number): { g: string; color: string } {
  if (down >= 300 && ping < 25) return { g: "A+", color: NX.green };
  if (down >= 150 && ping < 40) return { g: "A", color: NX.green };
  if (down >= 80 && ping < 60) return { g: "B", color: NX.cyan };
  if (down >= 40 && ping < 90) return { g: "C", color: NX.yellow };
  if (down >= 15) return { g: "D", color: NX.orange };
  return { g: "F", color: NX.red };
}

export const SERVERS = [
  "Mumbai, IN â€” NEXUS-01",
  "Singapore, SG â€” NEXUS-04",
  "Delhi, IN â€” NEXUS-02",
  "Tokyo, JP â€” NEXUS-07",
  "Frankfurt, DE â€” NEXUS-09",
];

export const CARRIERS = ["NEXUS Mobile", "Jio 5G", "Airtel Xstream", "Vi Turbo"];

/* ------------------------------ helpers ------------------------------ */

export function fmt(n: number, d = 1): string {
  return n.toFixed(d);
}

export function fmtData(mb: number): string {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${Math.round(mb)} MB`;
}

export function pad2(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

export function fmtUptime(sec: number): string {
  return `${pad2(sec / 3600)}:${pad2((sec % 3600) / 60)}:${pad2(sec % 60)}`;
}

export function clockTime(d: Date = new Date()): string {
  return d.toLocaleTimeString([], { hour12: false });
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Haptic feedback on button presses (where supported). */
export function haptic(ms = 14): void {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* no-op */
  }
}

/* ------------------------- Flutter build spec ------------------------- */

export const FLUTTER_DEPS: Array<[string, string]> = [
  ["connectivity_plus", "^7.0.2"],
  ["network_info_plus", "^6.1.3"],
  ["permission_handler", "^12.0.1"],
  ["lottie", "^3.3.1"],
  ["fl_chart", "^1.0.0"],
  ["gauge_indicator", "^0.5.1"],
  ["flutter_svg", "^2.2.0"],
  ["google_fonts", "^6.3.0"],
  ["provider", "^6.1.5"],
  ["shared_preferences", "^2.5.3"],
  ["workmanager", "^0.6.1"],
  ["flutter_local_notifications", "^19.2.1"],
  ["glassmorphism", "^3.0.0"],
  ["animated_text_kit", "^4.2.3"],
  ["confetti", "^0.8.0"],
  ["telephony", "^0.2.0"],
  ["internet_speed_meter", "^0.0.4"],
  ["flutter_animate", "^4.5.2"],
  ["shimmer", "^3.0.0"],
];

export const ANDROID_PERMISSIONS = [
  "ACCESS_NETWORK_STATE",
  "CHANGE_NETWORK_STATE",
  "ACCESS_WIFI_STATE",
  "CHANGE_WIFI_STATE",
  "READ_PHONE_STATE",
  "FOREGROUND_SERVICE",
  "INTERNET",
  "RECEIVE_BOOT_COMPLETED",
  "POST_NOTIFICATIONS",
  "ACCESS_FINE_LOCATION",
];

