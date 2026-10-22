import { useEffect, useState, type CSSProperties } from "react";
import { ACCENTS, APP, NX } from "./lib/brand";
import { NexusProvider, useNexus } from "./state/AppState";
import { BottomNav, LogoMark, NexusAppBar, NotificationDrawer, StatusBar, type TabId } from "./components/Chrome";
import { SpecPanel } from "./components/SpecPanel";
import { Icon } from "./components/Icons";
import { Splash } from "./screens/Splash";
import { Home } from "./screens/Home";
import { Boost } from "./screens/Boost";
import { SpeedTest } from "./screens/SpeedTest";
import { Monitor } from "./screens/Monitor";
import { Gaming } from "./screens/Gaming";
import { Settings } from "./screens/Settings";

type Screen = "splash" | "home" | "boost" | "speed" | "monitor" | "gaming" | "settings";
const TAB_IDS: TabId[] = ["home", "boost", "speed", "gaming", "settings"];

/* ------------------------------ phone internals ------------------------------ */

function PhoneApp() {
  const { sim } = useNexus();
  const [screen, setScreen] = useState<Screen>("splash");
  const [drawer, setDrawer] = useState(false);
  const [boostSeq, setBoostSeq] = useState(0);
  const [speedSeq, setSpeedSeq] = useState(0);
  const [bannerId, setBannerId] = useState(0);

  /* incoming-notification banner (rich heads-up style) */
  const latest = sim.notis[0];
  useEffect(() => {
    if (latest && !latest.read) {
      setBannerId(latest.id);
      const t = window.setTimeout(() => setBannerId(0), 4200);
      return () => window.clearTimeout(t);
    }
  }, [latest]);

  const goBoost = () => {
    setBoostSeq((x) => x + 1);
    setScreen("boost");
  };
  const goSpeed = () => {
    setSpeedSeq((x) => x + 1);
    setScreen("speed");
  };

  const themeStyle = { "--accent": ACCENTS[sim.settings.accent] } as CSSProperties;
  const activeTab = TAB_IDS.includes(screen as TabId) ? (screen as TabId) : "home";

  return (
    <div
      className="nx-root absolute inset-0 overflow-hidden screen-bg"
      data-theme={sim.settings.theme}
      style={themeStyle}
    >
      {screen === "splash" ? (
        <Splash onDone={() => setScreen("home")} />
      ) : (
        <>
          {/* app bar */}
          <div
            className="absolute inset-x-0 top-0 z-20"
            style={{
              background: "color-mix(in srgb, var(--bg) 86%, transparent)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <StatusBar />
            <NexusAppBar onBell={() => setDrawer(true)} />
          </div>

          {/* screen content */}
          <div key={screen} className="anim-screen absolute inset-0 overflow-y-auto nx-scroll pt-[88px]">
            {screen === "home" && (
              <Home goBoost={goBoost} goSpeed={goSpeed} goGaming={() => setScreen("gaming")} goMonitor={() => setScreen("monitor")} />
            )}
            {screen === "boost" && <Boost autoRun={boostSeq} />}
            {screen === "speed" && <SpeedTest autoRun={speedSeq} />}
            {screen === "monitor" && <Monitor />}
            {screen === "gaming" && <Gaming />}
            {screen === "settings" && <Settings />}
          </div>

          {/* bottom navigation */}
          <BottomNav active={screen === "monitor" ? "home" : activeTab} onNav={(t) => setScreen(t)} />

          {/* heads-up notification banner */}
          {bannerId !== 0 && latest && !drawer && (
            <button
              onClick={() => {
                setBannerId(0);
                setDrawer(true);
              }}
              className="press absolute top-[92px] inset-x-3 z-40 text-left"
            >
              <div
                className="anim-toast glass-deep rounded-xl px-3.5 py-2.5 flex items-center gap-3"
                style={{
                  background: "color-mix(in srgb, #0A0E27 92%, transparent)",
                  border: `1px solid ${NX.cyan}44`,
                  boxShadow: `0 0 22px ${NX.cyan}33, 0 10px 28px rgba(0,0,0,.55)`,
                }}
              >
                <span
                  className="grid place-items-center w-8 h-8 rounded-lg shrink-0"
                  style={{ background: `${NX.cyan}18`, color: NX.cyan, boxShadow: `0 0 10px ${NX.cyan}44` }}
                >
                  <Icon name={latest.icon} size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-bold text-[#E8F4FF] truncate">{latest.title}</span>
                  <span className="block text-[10px] font-medium text-[#E8F4FF]/55 truncate">{latest.body}</span>
                </span>
                <span className="font-display text-[7px] font-bold tracking-[0.18em] shrink-0" style={{ color: NX.cyan }}>
                  VIEW
                </span>
              </div>
            </button>
          )}

          <NotificationDrawer open={drawer} onClose={() => setDrawer(false)} />
        </>
      )}
    </div>
  );
}

/* ------------------------------ phone frame ------------------------------ */

function PhoneFrame() {
  return (
    <div className="relative shrink-0">
      {/* ambient glow behind phone */}
      <div
        className="absolute -inset-10 rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{ background: `radial-gradient(50% 50% at 30% 20%, ${NX.purple}66, transparent 70%), radial-gradient(50% 50% at 75% 85%, ${NX.cyan}55, transparent 70%)` }}
      />
      <div
        className="relative w-[378px] rounded-[50px] p-[9px]"
        style={{
          background: "linear-gradient(160deg, #232a52, #05070F 40%, #101638)",
          boxShadow: `0 0 0 1.5px #2c3564, 0 30px 80px rgba(0,0,0,.75), 0 0 70px ${NX.purple}30`,
        }}
      >
        {/* side buttons */}
        <span className="absolute -left-[2.5px] top-[130px] w-[3px] h-9 rounded-l bg-[#2c3564]" />
        <span className="absolute -left-[2.5px] top-[182px] w-[3px] h-14 rounded-l bg-[#2c3564]" />
        <span className="absolute -right-[2.5px] top-[160px] w-[3px] h-16 rounded-r bg-[#2c3564]" />

        <div className="relative rounded-[41px] overflow-hidden h-[792px]" style={{ background: NX.bg }}>
          {/* punch-hole camera */}
          <span className="absolute left-1/2 top-2 -ml-[5px] w-[10px] h-[10px] rounded-full bg-black z-[60] ring-1 ring-white/10" />
          <PhoneApp />
        </div>
      </div>
      <p className="text-center mt-4 font-display text-[8.5px] font-bold tracking-[0.34em] text-white/35">
        INTERACTIVE PROTOTYPE â€” TAP THROUGH THE APP
      </p>
    </div>
  );
}

/* ------------------------------ showcase shell ------------------------------ */

function Shell() {
  return (
    <div className="min-h-screen relative overflow-hidden tech-grid" style={{ background: "#05070F", fontFamily: "Rajdhani, sans-serif" }}>
      {/* ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(55% 40% at 18% 8%, ${NX.purple}2e, transparent 70%),
            radial-gradient(45% 35% at 85% 90%, ${NX.cyan}24, transparent 70%),
            radial-gradient(60% 50% at 55% 55%, transparent 40%, rgba(5,7,15,.9) 100%)`,
        }}
      />

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-5 border-b border-white/6">
        <div className="flex items-center gap-3">
          <LogoMark size={34} />
          <div className="leading-none">
            <p className="font-display font-black text-[15px] tracking-[0.14em]">
              <span style={{ color: NX.cyan, textShadow: `0 0 10px ${NX.cyan}aa` }}>NEXUS</span>{" "}
              <span className="text-[#E8F4FF]">PING</span>{" "}
              <span style={{ color: NX.purple, textShadow: `0 0 10px ${NX.purple}aa` }}>PRO</span>
            </p>
            <p className="text-[9px] font-bold tracking-[0.4em] text-white/40 mt-1">{APP.tagline.toUpperCase()}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2.5">
          <span
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display text-[8px] font-bold tracking-[0.2em]"
            style={{ color: NX.green, background: `${NX.green}10`, border: `1px solid ${NX.green}44` }}
          >
            <span className="anim-blink w-1.5 h-1.5 rounded-full" style={{ background: NX.green, boxShadow: `0 0 6px ${NX.green}` }} />
            LIVE TELEMETRY SIM
          </span>
          <span
            className="px-3 py-1.5 rounded-lg font-display text-[8px] font-bold tracking-[0.2em] text-white/55 border border-white/10"
          >
            {APP.pkg}
          </span>
        </div>
      </header>

      {/* main */}
      <main className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-14 px-5 py-10 lg:py-14">
        <PhoneFrame />
        <div className="hidden lg:block pt-2">
          <SpecPanel />
        </div>
      </main>

      {/* spec panel under phone on small screens */}
      <div className="relative z-10 lg:hidden px-5 pb-12 flex justify-center">
        <SpecPanel />
      </div>

      {/* footer */}
      <footer className="relative z-10 border-t border-white/6 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-[10px] font-bold tracking-[0.16em] text-white/35">
          NEXUS PING PRO v{APP.version} â€¢ {APP.storeTitle}
        </p>
        <p className="font-display text-[8px] font-bold tracking-[0.3em] text-white/25">
          BOOST SIGNAL Â· KILL LAG Â· PING LESS
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <NexusProvider>
      <Shell />
    </NexusProvider>
  );
}
