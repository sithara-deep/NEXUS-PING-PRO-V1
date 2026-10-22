import type { CSSProperties, ReactNode } from "react";
import { cn } from "../utils/cn";
import { haptic } from "../lib/brand";
import { Icon } from "./Icons";

/* ------------------------------ GlassCard ------------------------------ */

export function GlassCard({
  children,
  className,
  glow,
  onClick,
  style,
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  onClick?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "glass rounded-2xl",
        onClick && "press cursor-pointer",
        className
      )}
      style={glow ? { ...style, boxShadow: glow } : style}
    >
      {children}
    </div>
  );
}

/* ------------------------------ StatCard ------------------------------ */

export function StatCard({
  icon,
  label,
  value,
  unit,
  color,
  sub,
  delay = 0,
}: {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  color: string;
  sub?: string;
  delay?: number;
}) {
  return (
    <GlassCard
      className="p-3 anim-fade-up"
      glow={`0 0 0 1px ${color}22, 0 0 18px ${color}1f`}
    >
      <div className="anim-fade-up" style={{ animationDelay: `${delay}ms` }}>
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className="grid place-items-center w-6 h-6 rounded-md"
            style={{ background: `${color}1c`, color }}
          >
            <Icon name={icon} size={13} />
          </span>
          <span className="text-[9px] font-display tracking-[0.14em] text-[var(--ink-dim)]">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span
            className="font-display font-bold text-lg leading-none"
            style={{ color, textShadow: `0 0 14px ${color}66` }}
          >
            {value}
          </span>
          {unit && (
            <span className="text-[10px] font-semibold text-[var(--ink-dim)]">
              {unit}
            </span>
          )}
        </div>
        {sub && (
          <div className="text-[9.5px] text-[var(--ink-faint)] mt-1 font-medium tracking-wide">
            {sub}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

/* ------------------------------ NeonButton ------------------------------ */

export function NeonButton({
  children,
  icon,
  from,
  to,
  onClick,
  className,
  textClass,
  dark,
}: {
  children: ReactNode;
  icon?: string;
  from: string;
  to: string;
  onClick?: () => void;
  className?: string;
  textClass?: string;
  dark?: boolean;
}) {
  return (
    <button
      onClick={() => {
        haptic();
        onClick?.();
      }}
      className={cn(
        "press relative overflow-hidden rounded-xl px-4 py-3 flex items-center justify-center gap-2 select-none",
        className
      )}
      style={{
        background: `linear-gradient(120deg, ${from}, ${to})`,
        boxShadow: `0 4px 22px ${from}55, 0 0 34px ${to}33, inset 0 1px 0 rgba(255,255,255,.35)`,
      }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.55) 48%, transparent 62%)",
        }}
      />
      {icon && <Icon name={icon} size={17} strokeWidth={2.1} className={dark ? "text-[#071022]" : "text-white"} />}
      <span
        className={cn(
          "font-display font-bold text-[11px] tracking-[0.16em]",
          dark ? "text-[#071022]" : "text-white",
          textClass
        )}
        style={{ textShadow: dark ? "none" : "0 1px 8px rgba(0,0,0,.45)" }}
      >
        {children}
      </span>
    </button>
  );
}

/* ------------------------------ NeonToggle ------------------------------ */

export function NeonToggle({
  on,
  onChange,
  color = "var(--accent)",
  disabled,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <button
      aria-pressed={on}
      disabled={disabled}
      onClick={() => {
        haptic(8);
        onChange(!on);
      }}
      className={cn(
        "press relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0",
        disabled && "opacity-40"
      )}
      style={{
        background: on
          ? `linear-gradient(90deg, ${color}, ${color}bb)`
          : "rgba(127,140,180,.25)",
        boxShadow: on ? `0 0 14px ${color}88, inset 0 0 6px ${color}55` : "inset 0 1px 3px rgba(0,0,0,.4)",
      }}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-[#E8F4FF] transition-all duration-300"
        style={{
          left: on ? "calc(100% - 22px)" : "2px",
          boxShadow: on ? `0 0 10px ${color}` : "0 1px 3px rgba(0,0,0,.5)",
        }}
      />
    </button>
  );
}

/* ------------------------------ SettingRow ------------------------------ */

export function SettingRow({
  icon,
  title,
  sub,
  right,
  onClick,
  color = "var(--accent)",
}: {
  icon: string;
  title: string;
  sub?: string;
  right?: ReactNode;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3.5 py-3",
        onClick && "press cursor-pointer"
      )}
    >
      <span
        className="grid place-items-center w-8 h-8 rounded-lg shrink-0"
        style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
      >
        <Icon name={icon} size={15} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold leading-tight text-[var(--ink)]">
          {title}
        </div>
        {sub && (
          <div className="text-[10.5px] text-[var(--ink-dim)] leading-tight mt-0.5">
            {sub}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

/* ------------------------------ SectionTitle ------------------------------ */

export function SectionTitle({
  icon,
  children,
  color = "var(--accent)",
}: {
  icon: string;
  children: ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-2 px-1">
      <span style={{ color }}>
        <Icon name={icon} size={14} strokeWidth={2.2} />
      </span>
      <span
        className="font-display text-[10px] font-bold tracking-[0.28em]"
        style={{ color, textShadow: `0 0 12px ${color}88` }}
      >
        {children}
      </span>
      <span
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(90deg, ${color}66, transparent)`,
        }}
      />
    </div>
  );
}

/* ------------------------------ Chip ------------------------------ */

export function Chip({
  children,
  active,
  onClick,
  color = "var(--accent)",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={() => {
        haptic(8);
        onClick?.();
      }}
      className="press px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide border transition-all duration-200"
      style={{
        borderColor: active ? color : "color-mix(in srgb, var(--ink) 14%, transparent)",
        background: active ? `color-mix(in srgb, ${color} 18%, transparent)` : "transparent",
        color: active ? color : "var(--ink-dim)",
        boxShadow: active ? `0 0 12px ${color}55` : "none",
      }}
    >
      {children}
    </button>
  );
}

/* ------------------------------ NeonSlider ------------------------------ */

export function NeonSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(Number(e.target.value))}
      className="nx-range"
    />
  );
}

/* ------------------------------ ScreenHeader ------------------------------ */

export function ScreenHeader({
  title,
  sub,
  color = "var(--accent)",
}: {
  title: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="text-center pt-2 pb-3 anim-fade-up">
      <h1
        className="font-display font-extrabold text-[19px] tracking-[0.14em]"
        style={{ color, textShadow: `0 0 10px ${color}aa, 0 0 30px ${color}55` }}
      >
        {title}
      </h1>
      {sub && (
        <p className="text-[11px] text-[var(--ink-dim)] font-medium tracking-[0.22em] mt-1 uppercase">
          {sub}
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Skeleton ------------------------------ */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-xl", className)} />;
}
