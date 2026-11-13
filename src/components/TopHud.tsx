import React from 'react';
import { PixelIcon } from './PixelSprites';

interface TopHudProps {
  gold: number;
  level: number;
  exp: number;
  expToNext: number;
  levelMultiplier: number;
  hp: number;
  maxHp: number;
  muted: boolean;
  onToggleMute: () => void;
}

export const TopHud: React.FC<TopHudProps> = ({
  gold,
  level,
  exp,
  expToNext,
  levelMultiplier,
  hp,
  maxHp,
  muted,
  onToggleMute,
}) => {
  const hpPct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
  const expPct = Math.max(0, Math.min(100, (exp / expToNext) * 100));

  return (
    <header className="shrink-0 border-b-[3px] border-[#090c14] bg-[#161c2c] px-3 py-2.5 shadow-[inset_0_-2px_0_#0e121e]">
      {/* Row 1: Level, Multiplier, Gold, Mute */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-base font-bold text-amber-300 tabular-nums">
            LV.{level}
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="font-body text-xs font-semibold text-sky-300 tabular-nums">
            Hệ số x{levelMultiplier.toFixed(1)}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#0f1320] px-2 py-0.5 border-2 border-[#090c14]">
            <PixelIcon type="coin" size={14} />
            <span className="font-pixel text-sm font-bold text-amber-300 tabular-nums">
              {gold}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            title={muted ? 'Bật âm thanh (M)' : 'Tắt âm thanh (M)'}
            className="pixel-btn flex h-8 w-8 items-center justify-center bg-[#252d42]"
          >
            <PixelIcon type={muted ? 'sound_off' : 'sound_on'} size={14} />
          </button>
        </div>
      </div>

      {/* Row 2: HP Bar & EXP Bar */}
      <div className="mt-2 grid grid-cols-2 gap-2.5">
        {/* HP Meter */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] leading-none">
            <span className="flex items-center gap-1 font-pixel font-bold text-rose-300">
              <PixelIcon type="heart" size={12} />
              HP
            </span>
            <span className="font-body font-bold text-slate-100 tabular-nums">
              {hp}/{maxHp}
            </span>
          </div>
          <div className="pixel-bar-track h-3 w-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-[width] duration-150"
              style={{
                width: `${hpPct}%`,
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3)',
              }}
            />
          </div>
        </div>

        {/* EXP Meter */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] leading-none">
            <span className="flex items-center gap-1 font-pixel font-bold text-sky-300">
              <PixelIcon type="exp" size={12} />
              EXP
            </span>
            <span className="font-body font-bold text-slate-100 tabular-nums">
              {exp}/{expToNext}
            </span>
          </div>
          <div className="pixel-bar-track h-3 w-full overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-[width] duration-150"
              style={{
                width: `${expPct}%`,
                boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35)',
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
