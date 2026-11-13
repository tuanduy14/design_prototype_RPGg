import React, { useEffect } from 'react';
import { HeroSprite, MonsterSprite } from './PixelSprites';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStart]);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-[#101524] p-5 text-[#f4f1ea]">
      {/* Pixel Art Sky & Castle Backdrop */}
      <svg
        viewBox="0 0 180 320"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
        aria-hidden="true"
      >
        {/* Sky gradient bands */}
        <rect width="180" height="80" fill="#0d1326" />
        <rect y="80" width="180" height="70" fill="#16203a" />
        <rect y="150" width="180" height="60" fill="#1e2b4d" />
        {/* Pixel Moon */}
        <rect x="132" y="26" width="22" height="22" fill="#fef08a" />
        <rect x="136" y="30" width="5" height="5" fill="#fde047" />
        <rect x="144" y="38" width="4" height="4" fill="#fde047" />
        {/* Pixel Stars */}
        <rect x="22" y="28" width="2" height="2" fill="#e2e8f0" />
        <rect x="54" y="42" width="2" height="2" fill="#93c5fd" />
        <rect x="92" y="20" width="2" height="2" fill="#fde047" />
        <rect x="74" y="64" width="2" height="2" fill="#e2e8f0" />
        <rect x="112" y="54" width="2" height="2" fill="#e2e8f0" />
        <rect x="36" y="96" width="2" height="2" fill="#93c5fd" />
        {/* Distant Castle Silhouette */}
        <rect x="14" y="165" width="28" height="55" fill="#0f172a" />
        <rect x="12" y="158" width="8" height="8" fill="#0f172a" />
        <rect x="24" y="158" width="8" height="8" fill="#0f172a" />
        <rect x="36" y="158" width="8" height="8" fill="#0f172a" />
        <rect x="136" y="172" width="32" height="48" fill="#0f172a" />
        <rect x="146" y="156" width="12" height="18" fill="#0f172a" />
        <rect x="150" y="162" width="4" height="6" fill="#f59e0b" />
        {/* Ground */}
        <rect y="218" width="180" height="12" fill="#15803d" />
        <rect y="230" width="180" height="90" fill="#1c1917" />
        <rect y="232" width="180" height="4" fill="#292524" />
      </svg>

      {/* Top Title Lockup (over calm night sky negative space) */}
      <div className="relative z-10 mt-6 flex flex-col items-center text-center">
        <svg
          viewBox="0 0 260 64"
          className="w-full max-w-[260px] drop-shadow-[0_4px_0_#07090f]"
          aria-label="PIXEL KNIGHT"
        >
          <rect x="6" y="6" width="248" height="52" fill="#141b2d" stroke="#facc15" strokeWidth="4" />
          <rect x="12" y="12" width="236" height="40" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.65" />
          <text
            x="130"
            y="41"
            textAnchor="middle"
            fill="#facc15"
            fontFamily="Pixelify Sans, monospace"
            fontWeight="700"
            fontSize="28"
            letterSpacing="2"
          >
            PIXEL KNIGHT
          </text>
        </svg>
        <p className="mt-3 font-pixel text-sm tracking-wide text-amber-200/90">
          Tập Luyện · Đấu Quái · Nâng Cấp
        </p>
      </div>

      {/* Center Live Pixel Diorama */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <div className="flex items-end justify-center gap-7">
          <div className="animate-idle-bob">
            <HeroSprite
              pose="attack"
              armorPrimary="#3b82f6"
              armorAccent="#1d4ed8"
              weaponBlade="#e2e8f0"
              weaponHilt="#eab308"
              size={88}
            />
          </div>
          <span className="mb-8 font-pixel text-xl font-bold text-rose-400">VS</span>
          <div className="animate-idle-bob" style={{ animationDelay: '0.35s' }}>
            <MonsterSprite archetype="slime" size={84} />
          </div>
        </div>
      </div>

      {/* Bottom Start CTA & Control Hint */}
      <div className="relative z-10 mb-3 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="pixel-btn w-full bg-amber-500 px-6 py-3.5 font-pixel text-xl font-bold tracking-wider text-slate-950"
        >
          BẮT ĐẦU CHƠI
        </button>
        <p className="text-center text-xs text-slate-300/85">
          Click / Chạm để thao tác · Enter để bắt đầu
        </p>
      </div>
    </div>
  );
};
