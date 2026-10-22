import { useState } from "react";
import {
  ANDROID_PERMISSIONS,
  APP,
  FLUTTER_DEPS,
  NX,
  haptic,
} from "../lib/brand";
import { Icon } from "./Icons";
import { LogoMark } from "./Chrome";

const TABS = ["OVERVIEW", "PUBSPEC", "MANIFEST", "BRAND"] as const;
type Tab = (typeof TABS)[number];

const SWATCHES: Array<[string, string, string]> = [
  ["Background", "nxBackground", NX.bg],
  ["Ping Cyan", "nexusCyan", NX.cyan],
  ["Pro Purple", "nexusPurple", NX.purple],
  ["Boost Green", "nexusGreen", NX.green],
  ["Alert Red", "nexusRed", NX.red],
  ["Elite White", "nexusWhite", NX.white],
  ["Card Navy", "nexusCard", NX.card],
];

export function SpecPanel() {
  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [copied, setCopied] = useState("");

  const copy = (hex: string) => {
    haptic(8);
    try {
      navigator.clipboard?.writeText(hex);
    } catch { /* ignore */ }
    setCopied(hex);
    window.setTimeout(() => setCopied(""), 1400);
  };

  return (
    <aside className="w-full lg:w-[400px] shrink-0">
      <div className="glass rounded-2xl overflow-hidden" style={{ background: "rgba(10,14,39,0.6)" }}>
        {/* panel header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(120deg, ${NX.purple}30, transparent 55%, ${NX.cyan}22)`,
            borderBottom: `1px solid ${NX.cyan}33`,
          }}
        >
          <div>
            <p className="font-display font-black text-[13px] tracking-[0.22em] text-[#E8F4FF]">
              FLUTTER BUILD SPEC
            </p>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-[#E8F4FF]/50 mt-0.5">
              ANDROID â€¢ {APP.pkg}
            </p>
          </div>
          <span
            className="font-display text-[8px] font-bold tracking-[0.2em] px-2.5 py-1.5 rounded-md anim-blink"
            style={{ color: NX.green, background: `${NX.green}14`, border: `1px solid ${NX.green}55`, textShadow: `0 0 8px ${NX.green}` }}
          >
            BUILD STABLE
          </span>
        </div>

        {/* tabs */}
        <div className="flex px-3 pt-3 gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => { haptic(8); setTab(t); }}
              className="press flex-1 py-2 rounded-lg font-display text-[8.5px] font-bold tracking-[0.18em] transition-all duration-200"
              style={{
                color: tab === t ? NX.cyan : "rgba(232,244,255,0.45)",
                background: tab === t ? `${NX.cyan}14` : "transparent",
                boxShadow: tab === t ? `0 0 12px ${NX.cyan}33, inset 0 0 0 1px ${NX.cyan}44` : "inset 0 0 0 1px rgba(232,244,255,0.08)",
                textShadow: tab === t ? `0 0 8px ${NX.cyan}` : "none",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-5 min-h-[430px]">
          {/* ------------------------------ OVERVIEW ------------------------------ */}
          {tab === "OVERVIEW" && (
            <div className="space-y-4 anim-fade-up">
              <div className="flex items-center gap-4">
                <div className="anim-float"><LogoMark size={58} /></div>
                <div>
                  <p className="font-display font-extrabold text-[15px] tracking-wide" style={{ color: NX.cyan, textShadow: `0 0 10px ${NX.cyan}99` }}>
                    {APP.storeTitle}
                  </p>
                  <p className="text-[11.5px] font-semibold text-[#E8F4FF]/60 mt-0.5">{APP.shortDesc}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} style={{ color: NX.yellow, filter: `drop-shadow(0 0 3px ${NX.yellow})` }}>
                        <Icon name="star" size={11} strokeWidth={2.6} />
                      </span>
                    ))}
                    <span className="text-[10px] font-bold text-[#E8F4FF]/50 ml-1">4.9 â€¢ 1M+ installs</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  ["PACKAGE", APP.pkg],
                  ["VERSION", `v${APP.version} â€¢ stable`],
                  ["CATEGORY", APP.category],
                  ["FONTS", "Orbitron + Rajdhani"],
                  ["STATE", "Provider (ChangeNotifier)"],
                  ["MIN SDK", "Android 8.0 (API 26)"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg px-3 py-2.5" style={{ background: "rgba(232,244,255,0.04)", border: "1px solid rgba(232,244,255,0.08)" }}>
                    <p className="font-display text-[7.5px] font-bold tracking-[0.2em] text-[#E8F4FF]/40">{k}</p>
                    <p className="text-[11px] font-bold text-[#E8F4FF]/90 mt-0.5 break-all">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-display text-[8px] font-bold tracking-[0.22em] text-[#E8F4FF]/40 mb-2">PLAY STORE KEYWORDS</p>
                <div className="flex flex-wrap gap-1.5">
                  {APP.keywords.map((k) => (
                    <span key={k} className="px-2 py-1 rounded-md text-[9.5px] font-bold" style={{ color: NX.cyan, background: `${NX.cyan}10`, border: `1px solid ${NX.cyan}30` }}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-3.5" style={{ background: `linear-gradient(120deg, ${NX.purple}22, ${NX.cyan}18)`, border: `1px solid ${NX.cyan}33` }}>
                <p className="font-display text-[9px] font-bold tracking-[0.2em] mb-1" style={{ color: NX.green }}>FOREGROUND SERVICE</p>
                <p className="text-[11px] font-semibold text-[#E8F4FF]/75 leading-snug">
                  Persistent notification: â€œNEXUS PING PRO is protecting your connectionâ€ + boot receiver auto-start.
                </p>
              </div>
            </div>
          )}

          {/* ------------------------------ PUBSPEC ------------------------------ */}
          {tab === "PUBSPEC" && (
            <div className="anim-fade-up">
              <pre className="text-[10.5px] leading-relaxed font-semibold text-[#E8F4FF]/85 mb-3">
{`name: nexus_ping_pro
description: ${APP.shortDesc}
publish_to: 'none'
version: ${APP.version}+1`}
              </pre>
              <p className="font-display text-[8px] font-bold tracking-[0.22em] text-[#E8F4FF]/40 mb-2">
                DEPENDENCIES â€” {FLUTTER_DEPS.length} PACKAGES
              </p>
              <div className="grid grid-cols-1 gap-1 max-h-[330px] overflow-y-auto nx-scroll pr-1">
                {FLUTTER_DEPS.map(([name, ver], i) => (
                  <div
                    key={name}
                    className="flex items-center justify-between px-3 py-1.5 rounded-lg anim-fade-up"
                    style={{
                      background: i % 2 ? "rgba(232,244,255,0.03)" : "transparent",
                      animationDelay: `${i * 25}ms`,
                    }}
                  >
                    <span className="text-[11px] font-bold" style={{ color: NX.cyan }}>{name}</span>
                    <span className="text-[10px] font-semibold text-[#E8F4FF]/45">{ver}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------ MANIFEST ------------------------------ */}
          {tab === "MANIFEST" && (
            <div className="anim-fade-up">
              <p className="font-display text-[8px] font-bold tracking-[0.22em] text-[#E8F4FF]/40 mb-3">
                AndroidManifest.xml â€” {ANDROID_PERMISSIONS.length} PERMISSIONS
              </p>
              <div className="space-y-1.5 max-h-[360px] overflow-y-auto nx-scroll pr-1">
                {ANDROID_PERMISSIONS.map((p, i) => (
                  <div
                    key={p}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg anim-fade-up"
                    style={{ background: "rgba(232,244,255,0.035)", animationDelay: `${i * 30}ms` }}
                  >
                    <span style={{ color: NX.green }}>
                      <Icon name="shield" size={13} />
                    </span>
                    <code className="text-[10px] font-bold text-[#E8F4FF]/80">
                      android.permission.{p}
                    </code>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl p-3.5" style={{ background: `${NX.purple}14`, border: `1px solid ${NX.purple}44` }}>
                <p className="text-[11px] font-semibold text-[#E8F4FF]/75 leading-snug">
                  TelephonyManager + ConnectivityManager drive real signal monitoring; WorkManager schedules keep-alive; boot receiver re-arms on restart.
                </p>
              </div>
            </div>
          )}

          {/* ------------------------------ BRAND ------------------------------ */}
          {tab === "BRAND" && (
            <div className="anim-fade-up space-y-4">
              <div>
                <p className="font-display text-[8px] font-bold tracking-[0.22em] text-[#E8F4FF]/40 mb-2">
                  CORE GRADIENTS
                </p>
                <div className="space-y-2">
                  {[
                    ["Primary", `linear-gradient(120deg, ${NX.purple}, ${NX.cyan})`],
                    ["Card", `linear-gradient(160deg, ${NX.bg}, ${NX.card})`],
                    ["Boost Button", `linear-gradient(120deg, ${NX.green}, ${NX.cyan})`],
                  ].map(([label, g]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-16 h-8 rounded-lg shrink-0" style={{ background: g, boxShadow: "0 4px 14px rgba(0,0,0,.4)" }} />
                      <div>
                        <p className="text-[11px] font-bold text-[#E8F4FF]/85">{label}</p>
                        <p className="text-[9px] font-semibold text-[#E8F4FF]/40">{label === "Card" ? "#0A0E27 â†’ #1A1F45" : label === "Primary" ? "#7B2FFF â†’ #00D4FF" : "#00FF88 â†’ #00D4FF"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-display text-[8px] font-bold tracking-[0.22em] text-[#E8F4FF]/40 mb-2">
                  PALETTE â€” TAP TO COPY HEX
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {SWATCHES.map(([label, dart, hex]) => (
                    <button
                      key={dart}
                      onClick={() => copy(hex)}
                      className="press flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left"
                      style={{ background: "rgba(232,244,255,0.04)", border: "1px solid rgba(232,244,255,0.09)" }}
                    >
                      <span className="w-7 h-7 rounded-md shrink-0" style={{ background: hex, boxShadow: `0 0 10px ${hex}66`, border: "1px solid rgba(255,255,255,.15)" }} />
                      <span className="min-w-0">
                        <span className="block text-[10px] font-bold text-[#E8F4FF]/85 truncate">{label}</span>
                        <span className="block text-[9px] font-semibold" style={{ color: copied === hex ? NX.green : "rgba(232,244,255,0.4)" }}>
                          {copied === hex ? "COPIED!" : hex}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-3.5" style={{ background: `${NX.cyan}0e`, border: `1px solid ${NX.cyan}33` }}>
                <p className="font-display text-[10px] font-black tracking-[0.18em]" style={{ color: NX.cyan, textShadow: `0 0 10px ${NX.cyan}` }}>
                  ORBITRON â€” DISPLAY
                </p>
                <p className="text-[13px] font-bold text-[#E8F4FF]/80 mt-1" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                  Rajdhani â€” body copy, optimized for dense telemetry readouts.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
