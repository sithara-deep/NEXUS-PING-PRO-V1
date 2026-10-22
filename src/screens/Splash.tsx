import { useEffect } from "react";
import { APP, NX } from "../lib/brand";
import { Starfield } from "../components/charts";
import { LogoMark } from "../components/Chrome";

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3000);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `radial-gradient(90% 55% at 50% 0%, ${NX.purple}55 0%, transparent 60%),
          radial-gradient(80% 45% at 50% 105%, ${NX.cyan}3d 0%, transparent 60%),
          linear-gradient(160deg, #160A38 0%, ${NX.bg} 48%, #03182B 100%)`,
      }}
    >
      <Starfield count={80} />

      {/* ping pulse waves */}
      <div className="relative grid place-items-center">
        {[0, 0.55, 1.1].map((d) => (
          <span
            key={d}
            className="pulse-ring absolute rounded-full"
            style={{
              width: 190,
              height: 190,
              border: `1.5px solid ${NX.cyan}`,
              animationDelay: `${d}s`,
              boxShadow: `0 0 22px ${NX.cyan}55, inset 0 0 22px ${NX.cyan}22`,
            }}
          />
        ))}
        <div className="anim-float">
          <LogoMark size={96} />
        </div>
      </div>

      <h1
        className="anim-fade-up mt-8 font-display font-black text-[27px] tracking-[0.14em] text-center leading-tight"
        style={{
          color: NX.cyan,
          textShadow: `0 0 12px ${NX.cyan}cc, 0 0 42px ${NX.cyan}77, 0 0 90px ${NX.purple}66`,
          animationDelay: "250ms",
        }}
      >
        NEXUS PING PRO
      </h1>

      <p
        className="anim-fade-up mt-3 font-display text-[10.5px] tracking-[0.5em] text-[var(--ink)]"
        style={{ animationDelay: "900ms", opacity: 0.9 }}
      >
        {APP.tagline.toUpperCase()}
      </p>

      <div className="absolute bottom-16 inset-x-12">
        <div className="h-1 rounded-full overflow-hidden bg-white/8">
          <div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${NX.purple}, ${NX.cyan}, ${NX.green})`,
              boxShadow: `0 0 14px ${NX.cyan}`,
              animation: "nx-bar 2.55s cubic-bezier(.3,.6,.4,1) forwards",
            }}
          />
        </div>
        <p className="anim-blink text-center mt-3 font-display text-[8.5px] tracking-[0.4em] text-[var(--ink-dim)]">
          INITIALIZING NEXUS ENGINE
        </p>
      </div>

      <p className="absolute bottom-6 font-semibold text-[9.5px] tracking-[0.2em] text-[var(--ink-faint)]">
        v{APP.version} â€¢ {APP.pkg}
      </p>
    </div>
  );
}
