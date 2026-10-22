import { useState } from "react";
import { ACCENTS, APP, NX, haptic } from "../lib/brand";
import { useNexus } from "../state/AppState";
import { Chip, GlassCard, NeonToggle, SectionTitle, SettingRow } from "../components/ui";
import { Icon } from "../components/Icons";
import { LogoMark } from "../components/Chrome";

const DNS_OPTIONS: Array<{ id: "auto" | "google" | "cloudflare" | "opendns" | "custom"; label: string; sub: string }> = [
  { id: "auto", label: "Auto", sub: "ISP Default" },
  { id: "google", label: "Google DNS", sub: "8.8.8.8" },
  { id: "cloudflare", label: "Cloudflare", sub: "1.1.1.1" },
  { id: "opendns", label: "OpenDNS", sub: "208.67.222.222" },
  { id: "custom", label: "Custom DNS", sub: "enter your own" },
];

const LANGS = ["English", "à¤¹à¤¿à¤¨à¥à¤¦à¥€", "EspaÃ±ol", "Bahasa", "PortuguÃªs"];

export function Settings() {
  const { sim, patchSettings } = useNexus();
  const s = sim.settings;
  const [stars, setStars] = useState(0);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  };

  const shareApp = async () => {
    haptic();
    const text = `âš¡ NEXUS PING PRO â€” Boost Signal. Kill Lag. Ping Less.\nGet it: play.google.com/store/apps/details?id=${APP.pkg}`;
    try {
      await navigator.share({ title: APP.name, text });
    } catch {
      try {
        await navigator.clipboard.writeText(text);
      } catch { /* ignore */ }
      notify("Invite link copied to clipboard");
    }
  };

  return (
    <div className="px-4 pt-1 pb-28 relative">
      {/* header card */}
      <GlassCard className="p-4 flex items-center gap-3.5 anim-fade-up mt-1">
        <div className="anim-float">
          <LogoMark size={46} />
        </div>
        <div className="flex-1">
          <p className="font-display font-extrabold text-[14px] tracking-[0.1em]" style={{ color: NX.cyan, textShadow: `0 0 10px ${NX.cyan}99` }}>
            NEXUS SETTINGS
          </p>
          <p className="text-[10px] font-semibold text-[var(--ink-dim)] tracking-wide mt-0.5">
            {APP.tagline}
          </p>
        </div>
        <span
          className="font-display text-[8px] font-bold tracking-[0.18em] px-2 py-1 rounded-md"
          style={{ color: NX.green, background: `${NX.green}12`, border: `1px solid ${NX.green}44` }}
        >
          v{APP.version}
        </span>
      </GlassCard>

      {/* ------------------------------ GENERAL ------------------------------ */}
      <SectionTitle icon="gear">GENERAL</SectionTitle>
      <GlassCard className="divide-y divide-white/6">
        <SettingRow icon="bolt" title="Auto-boost on app start" sub="Run NEXUS protocol at launch" color={NX.cyan}
          right={<NeonToggle on={s.autoBoost} onChange={(v) => patchSettings({ autoBoost: v })} />} />
        <SettingRow icon="rocket" title="Start on device boot" sub="Boot receiver arms the service" color={NX.purple}
          right={<NeonToggle on={s.bootStart} onChange={(v) => patchSettings({ bootStart: v })} color={NX.purple} />} />
        <SettingRow icon="ping" title="Haptic feedback" sub="Vibrate on every press" color={NX.green}
          right={<NeonToggle on={s.hapticsOn} onChange={(v) => patchSettings({ hapticsOn: v })} color={NX.green} />} />
      </GlassCard>

      {/* ------------------------------ NETWORK ------------------------------ */}
      <SectionTitle icon="antenna">NETWORK</SectionTitle>
      <GlassCard className="p-3.5 space-y-3">
        <div>
          <p className="text-[11px] font-bold text-[var(--ink-dim)] mb-2 tracking-wide">Preferred network type</p>
          <div className="flex gap-2">
            {(["Auto", "4G Only", "5G Only"] as const).map((o) => (
              <Chip key={o} active={s.preferredNet === o} onClick={() => patchSettings({ preferredNet: o })}>
                {o}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold text-[var(--ink-dim)] mb-2 tracking-wide">Keep-alive interval</p>
          <div className="flex gap-2">
            {(["30s", "1m", "2m", "5m"] as const).map((o) => (
              <Chip key={o} active={s.keepAliveInterval === o} onClick={() => patchSettings({ keepAliveInterval: o })}>
                {o}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-white/6">
          <div>
            <p className="text-[12.5px] font-semibold text-[var(--ink)]">Auto-reconnect</p>
            <p className="text-[10px] text-[var(--ink-dim)]">Re-register instantly on drops</p>
          </div>
          <NeonToggle on={s.monitor.autoReconnect} onChange={(v) => patchSettings({ monitor: { ...s.monitor, autoReconnect: v } })} color={NX.green} />
        </div>
      </GlassCard>

      {/* ------------------------------ DNS ------------------------------ */}
      <SectionTitle icon="globe">DNS SETTINGS</SectionTitle>
      <GlassCard className="divide-y divide-white/6">
        {DNS_OPTIONS.map((o) => (
          <div key={o.id} className="flex items-center gap-3 px-3.5 py-2.5 press cursor-pointer" onClick={() => patchSettings({ dns: o.id })}>
            <span
              className="grid place-items-center w-4.5 h-4.5 rounded-full border-2 shrink-0 transition-all duration-200"
              style={{
                borderColor: s.dns === o.id ? NX.cyan : "rgba(127,140,180,.4)",
                boxShadow: s.dns === o.id ? `0 0 10px ${NX.cyan}88` : "none",
              }}
            >
              {s.dns === o.id && (
                <span className="w-2 h-2 rounded-full anim-pop" style={{ background: NX.cyan, boxShadow: `0 0 6px ${NX.cyan}` }} />
              )}
            </span>
            <div className="flex-1">
              <p className="text-[12.5px] font-semibold text-[var(--ink)]">{o.label}</p>
              <p className="text-[10px] text-[var(--ink-dim)] font-medium">{o.sub}</p>
            </div>
            {s.dns === o.id && (
              <span className="font-display text-[7.5px] font-bold tracking-widest" style={{ color: NX.green }}>ACTIVE</span>
            )}
          </div>
        ))}
        {s.dns === "custom" && (
          <div className="px-3.5 py-3 anim-fade-up">
            <input
              value={s.customDns}
              onChange={(e) => patchSettings({ customDns: e.target.value })}
              placeholder="e.g. 9.9.9.9"
              className="w-full rounded-lg px-3 py-2.5 text-[13px] font-semibold bg-black/25 border outline-none transition-all"
              style={{
                borderColor: `${NX.cyan}55`,
                color: "var(--ink)",
                boxShadow: `inset 0 0 12px ${NX.cyan}11`,
              }}
            />
          </div>
        )}
      </GlassCard>

      {/* ------------------------------ NOTIFICATIONS ------------------------------ */}
      <SectionTitle icon="bell">NOTIFICATIONS</SectionTitle>
      <GlassCard className="divide-y divide-white/6">
        <SettingRow icon="bars" title="Weak signal alert" sub="Notify below -90 dBm" color={NX.yellow}
          right={<NeonToggle on={s.weakAlert} onChange={(v) => patchSettings({ weakAlert: v })} color={NX.yellow} />} />
        <SettingRow icon="close" title="Connection dropped alert" sub="Rich alert with reconnect action" color={NX.red}
          right={<NeonToggle on={s.dropAlert} onChange={(v) => patchSettings({ dropAlert: v })} color={NX.red} />} />
        <SettingRow icon="download" title="Speed drop alert" sub="Throughput below threshold" color={NX.orange}
          right={<NeonToggle on={s.speedAlert} onChange={(v) => patchSettings({ speedAlert: v })} color={NX.orange} />} />
        <SettingRow icon="info" title="Daily network report" sub="09:00 summary notification" color={NX.cyan}
          right={<NeonToggle on={s.dailyReport} onChange={(v) => patchSettings({ dailyReport: v })} />} />
      </GlassCard>

      {/* ------------------------------ APPEARANCE ------------------------------ */}
      <SectionTitle icon="palette">APPEARANCE</SectionTitle>
      <GlassCard className="p-3.5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span style={{ color: NX.purple }}><Icon name={s.theme === "dark" ? "moon" : "sun"} size={16} /></span>
            <span className="text-[12.5px] font-semibold text-[var(--ink)]">Theme</span>
          </div>
          <div className="flex rounded-lg border border-white/10 overflow-hidden">
            {(["dark", "light"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { haptic(8); patchSettings({ theme: t }); }}
                className="press px-3.5 py-1.5 font-display text-[9px] font-bold tracking-[0.16em] uppercase transition-all duration-200"
                style={{
                  background: s.theme === t ? `${NX.cyan}22` : "transparent",
                  color: s.theme === t ? NX.cyan : "var(--ink-dim)",
                  textShadow: s.theme === t ? `0 0 8px ${NX.cyan}` : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span style={{ color: NX.cyan }}><Icon name="palette" size={16} /></span>
            <span className="text-[12.5px] font-semibold text-[var(--ink)]">Accent color</span>
          </div>
          <div className="flex gap-2.5">
            {(Object.keys(ACCENTS) as Array<keyof typeof ACCENTS>).map((a) => (
              <button
                key={a}
                aria-label={a}
                onClick={() => { haptic(8); patchSettings({ accent: a as "cyan" | "purple" | "green" }); }}
                className="press w-6.5 h-6.5 rounded-full transition-transform duration-200"
                style={{
                  background: ACCENTS[a],
                  boxShadow: s.accent === a ? `0 0 14px ${ACCENTS[a]}, 0 0 0 3px color-mix(in srgb, ${ACCENTS[a]} 30%, transparent)` : `0 0 6px ${ACCENTS[a]}66`,
                  transform: s.accent === a ? "scale(1.12)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span style={{ color: NX.green }}><Icon name="language" size={16} /></span>
            <span className="text-[12.5px] font-semibold text-[var(--ink)]">Language</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {LANGS.map((l) => (
              <Chip key={l} active={s.language === l} onClick={() => patchSettings({ language: l })} color={NX.green}>
                {l}
              </Chip>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* ------------------------------ ABOUT ------------------------------ */}
      <SectionTitle icon="info">ABOUT</SectionTitle>
      <GlassCard className="divide-y divide-white/6">
        <SettingRow icon="crown" title={`NEXUS PING PRO v${APP.version}`} sub={APP.tagline} color={NX.yellow}
          right={<span className="font-display text-[7.5px] font-bold tracking-widest px-2 py-1 rounded" style={{ color: NX.green, background: `${NX.green}14` }}>STABLE</span>} />
        <SettingRow icon="star" title="Rate NEXUS PING PRO" sub="Loving the boost? Tell the Play Store" color={NX.yellow}
          right={
            <span className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  aria-label={`${i} star`}
                  onClick={() => {
                    haptic(10);
                    setStars(i);
                    if (i === 5) notify("Thanks for the 5 stars â€” you are NEXUS elite!");
                    else notify(`Rated ${i}/5 â€” we will keep improving!`);
                  }}
                  className="press"
                  style={{
                    color: i <= stars ? NX.yellow : "rgba(127,140,180,.4)",
                    filter: i <= stars ? `drop-shadow(0 0 5px ${NX.yellow})` : "none",
                  }}
                >
                  <Icon name="star" size={15} strokeWidth={i <= stars ? 2.4 : 1.6} />
                </button>
              ))}
            </span>
          } />
        <SettingRow icon="share" title="Share app" sub="Send NEXUS to your squad" color={NX.cyan} onClick={shareApp}
          right={<Icon name="chevron" size={14} className="text-[var(--ink-faint)]" />} />
        <SettingRow icon="shield" title="Privacy Policy" sub="Your data never leaves the device" color={NX.green}
          onClick={() => notify("Privacy policy â€” play.google.com/store/apps/details?id=" + APP.pkg)}
          right={<Icon name="chevron" size={14} className="text-[var(--ink-faint)]" />} />
        <SettingRow icon="send" title="Contact Support" sub="support@nexuspingpro.app" color={NX.purple}
          onClick={() => notify("Support ticket opened â€” we reply within 24h")}
          right={<Icon name="chevron" size={14} className="text-[var(--ink-faint)]" />} />
      </GlassCard>

      <p className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[var(--ink-dim)] mt-5">
        Made with
        <span className="anim-blink inline-flex" style={{ color: NX.red }}>
          <Icon name="heart" size={13} strokeWidth={2.4} />
        </span>
        by NEXUS Team
      </p>

      {toast && (
        <div className="absolute top-2 inset-x-4 z-50 flex justify-center pointer-events-none">
          <div className="anim-toast glass-deep rounded-xl px-4 py-2 text-[11px] font-semibold text-center" style={{ borderColor: `${NX.cyan}55` }}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
