import React, { useState, useRef } from 'react';
import { ArmorItem, WeaponItem } from '../data/gameData';
import { HeroSprite } from './PixelSprites';

interface FloatingPopup {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface TrainingTabProps {
  level: number;
  exp: number;
  expToNext: number;
  levelMultiplier: number;
  nextLevelMultiplier: number;
  equippedWeapon: WeaponItem;
  equippedArmor: ArmorItem;
  totalTrainingClicks: number;
  levelUpBanner: number | null;
  onTrainClick: () => void;
}

export const TrainingTab: React.FC<TrainingTabProps> = ({
  level,
  exp,
  expToNext,
  levelMultiplier,
  nextLevelMultiplier,
  equippedWeapon,
  equippedArmor,
  totalTrainingClicks,
  levelUpBanner,
  onTrainClick,
}) => {
  const [liftUp, setLiftUp] = useState(false);
  const [popups, setPopups] = useState<FloatingPopup[]>([]);
  const nextId = useRef(1);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleTrain = (clientX?: number, clientY?: number) => {
    setLiftUp((prev) => !prev);
    onTrainClick();

    let x = 50;
    let y = 42;
    if (clientX !== undefined && clientY !== undefined && stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      x = Math.max(18, Math.min(82, ((clientX - rect.left) / rect.width) * 100));
      y = Math.max(15, Math.min(72, ((clientY - rect.top) / rect.height) * 100));
    }

    const id = nextId.current++;
    setPopups((prev) => [...prev.slice(-8), { id, x, y, text: '+1 EXP' }]);
    window.setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 680);
  };

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#191f30] p-3">
      {/* Pixel Dojo Background */}
      <svg
        viewBox="0 0 180 240"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {/* Wall */}
        <rect width="180" height="160" fill="#21283d" />
        <rect y="14" width="180" height="4" fill="#171d2e" />
        {/* Dojo Banner */}
        <rect x="74" y="18" width="32" height="48" fill="#7f1d1d" />
        <rect x="76" y="20" width="28" height="44" fill="#991b1b" />
        <rect x="82" y="28" width="16" height="2" fill="#fde047" />
        <rect x="89" y="26" width="2" height="24" fill="#fde047" />
        <rect x="84" y="38" width="12" height="2" fill="#fde047" />
        {/* Wooden Pillars */}
        <rect x="10" y="0" width="10" height="160" fill="#451a03" />
        <rect x="160" y="0" width="10" height="160" fill="#451a03" />
        <rect x="12" y="0" width="2" height="160" fill="#78350f" />
        <rect x="162" y="0" width="2" height="160" fill="#78350f" />
        {/* Lanterns */}
        <rect x="36" y="18" width="8" height="12" fill="#f59e0b" />
        <rect x="38" y="20" width="4" height="8" fill="#fef08a" />
        <rect x="136" y="18" width="8" height="12" fill="#f59e0b" />
        <rect x="138" y="20" width="4" height="8" fill="#fef08a" />
        {/* Wooden Tatami Floor */}
        <rect y="160" width="180" height="80" fill="#573b26" />
        <rect y="160" width="180" height="4" fill="#7c5335" />
        <rect y="182" width="180" height="2" fill="#422a19" />
        <rect y="206" width="180" height="2" fill="#422a19" />
      </svg>

      {/* Top Dojo Info Strip */}
      <div className="pixel-panel relative z-10 flex items-center justify-between px-3 py-2">
        <div>
          <div className="font-pixel text-xs font-bold text-amber-300">
            VÕ ĐƯỜNG TẬP LUYỆN
          </div>
          <div className="mt-0.5 text-[11px] text-slate-300 tabular-nums">
            Hệ số đánh quái: <span className="font-bold text-sky-300">x{levelMultiplier.toFixed(1)}</span>
            <span className="mx-1.5 text-slate-500">→</span>
            Cấp {level + 1}: <span className="font-bold text-emerald-300">x{nextLevelMultiplier.toFixed(1)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Số lần tập</div>
          <div className="font-pixel text-sm font-bold text-slate-100 tabular-nums">
            {totalTrainingClicks}
          </div>
        </div>
      </div>

      {/* Interactive Character Stage */}
      <div
        ref={stageRef}
        onClick={(e) => handleTrain(e.clientX, e.clientY)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTrain();
          }
        }}
        aria-label="Chạm vào nhân vật để tập luyện"
        className="relative z-10 my-auto flex min-h-0 flex-1 cursor-pointer flex-col items-center justify-center focus:outline-none"
      >
        {/* LEVEL UP! Floating Notification */}
        {levelUpBanner !== null && (
          <div
            key={levelUpBanner}
            className="animate-level-up pointer-events-none absolute top-4 z-30 border-[3px] border-[#090c14] bg-amber-400 px-4 py-1.5 shadow-[0_4px_0_#090c14]"
          >
            <div className="text-center font-pixel text-lg font-bold tracking-wider text-slate-950">
              LEVEL UP! LV.{levelUpBanner}
            </div>
            <div className="text-center font-body text-[11px] font-bold text-slate-900">
              Sát thương tăng lên x{levelMultiplier.toFixed(1)}!
            </div>
          </div>
        )}

        {/* Hero Training Sprite */}
        <div
          className={`transition-transform duration-75 ${
            liftUp ? '-translate-y-1.5 scale-105' : 'translate-y-1 scale-100'
          }`}
        >
          <HeroSprite
            pose={liftUp ? 'train_up' : 'train_down'}
            armorPrimary={equippedArmor.primaryColor}
            armorAccent={equippedArmor.accentColor}
            weaponBlade={equippedWeapon.bladeColor}
            weaponHilt={equippedWeapon.hiltColor}
            size={124}
          />
        </div>

        <p className="mt-3 bg-[#0f1422]/80 px-2.5 py-1 font-pixel text-xs text-amber-200 tabular-nums border border-slate-700/80">
          Còn {expToNext - exp} EXP để lên Cấp {level + 1}
        </p>

        {/* Floating +1 EXP Popups */}
        {popups.map((popup) => (
          <span
            key={popup.id}
            style={{ left: `${popup.x}%`, top: `${popup.y}%` }}
            className="animate-float-up pointer-events-none absolute z-20 font-pixel text-base font-bold text-sky-300 drop-shadow-[0_2px_0_#090c14]"
          >
            {popup.text}
          </span>
        ))}
      </div>

      {/* Primary Big Training Button */}
      <div className="relative z-10 pt-1">
        <button
          type="button"
          onClick={(e) => handleTrain(e.clientX, e.clientY)}
          className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-500 px-4 py-4 font-pixel text-lg font-bold tracking-wide text-slate-950"
        >
          <span>TẬP LUYỆN</span>
          <span className="bg-slate-950/20 px-2 py-0.5 text-sm">+1 EXP</span>
        </button>
      </div>
    </div>
  );
};
