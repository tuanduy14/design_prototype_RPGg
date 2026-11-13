import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArmorItem,
  ConsumableItem,
  CONSUMABLES,
  StageDefinition,
  TOTAL_STAGES,
  TURN_RUSH_DURATION_MS,
  WeaponItem,
} from '../data/gameData';
import { sound } from '../utils/sound';
import { HeroSprite, MonsterSprite, PixelIcon } from './PixelSprites';

export type TurnPhase = 'READY' | 'RUSH' | 'PLAYER_STRIKE' | 'ENEMY_TURN' | 'VICTORY' | 'GAME_OVER';

interface CombatPopup {
  id: number;
  target: 'monster' | 'hero';
  text: string;
  colorClass: string;
}

interface CombatTabProps {
  stageDef: StageDefinition;
  monsterHp: number;
  heroHp: number;
  heroMaxHp: number;
  equippedWeapon: WeaponItem;
  equippedArmor: ArmorItem;
  levelMultiplier: number;
  potions: Record<string, number>;
  onDamageMonster: (damage: number) => number;
  onDamageHero: (damage: number) => number;
  onUsePotion: (item: ConsumableItem) => boolean;
  onVictoryCleared: (stageCleared: number) => void;
  onNextStage: () => void;
  onRestartAfterDefeat: () => void;
  onBackToMap: () => void;
  onGoToShop: () => void;
  onBusyChange: (busy: boolean) => void;
}

export const CombatTab: React.FC<CombatTabProps> = ({
  stageDef,
  monsterHp,
  heroHp,
  heroMaxHp,
  equippedWeapon,
  equippedArmor,
  levelMultiplier,
  potions,
  onDamageMonster,
  onDamageHero,
  onUsePotion,
  onVictoryCleared,
  onNextStage,
  onRestartAfterDefeat,
  onBackToMap,
  onGoToShop,
  onBusyChange,
}) => {
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('READY');
  const [clicks, setClicks] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(TURN_RUSH_DURATION_MS);
  const [monsterAnim, setMonsterAnim] = useState<'idle' | 'hurt' | 'attack'>('idle');
  const [heroAnim, setHeroAnim] = useState<'idle' | 'attack' | 'hurt'>('idle');
  const [popups, setPopups] = useState<CombatPopup[]>([]);

  const clicksRef = useRef(0);
  const popupIdRef = useRef(1);
  const timersRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  // Refs to latest props to avoid stale closures inside timers
  const latestRef = useRef({
    stageDef,
    equippedWeapon,
    levelMultiplier,
    onDamageMonster,
    onDamageHero,
    onVictoryCleared,
  });
  latestRef.current = {
    stageDef,
    equippedWeapon,
    levelMultiplier,
    onDamageMonster,
    onDamageHero,
    onVictoryCleared,
  };

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  // Reset turn phase cleanly whenever entering a new stage
  useEffect(() => {
    clearAllTimers();
    clicksRef.current = 0;
    setClicks(0);
    setTimeLeftMs(TURN_RUSH_DURATION_MS);
    setMonsterAnim('idle');
    setHeroAnim('idle');
    setTurnPhase('READY');
  }, [stageDef.stage, clearAllTimers]);

  useEffect(() => {
    const busy = turnPhase === 'RUSH' || turnPhase === 'PLAYER_STRIKE' || turnPhase === 'ENEMY_TURN';
    onBusyChange(busy);
  }, [turnPhase, onBusyChange]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      onBusyChange(false);
    };
  }, [clearAllTimers, onBusyChange]);

  const spawnPopup = useCallback((target: 'monster' | 'hero', text: string, colorClass: string) => {
    const id = popupIdRef.current++;
    setPopups((prev) => [...prev.slice(-6), { id, target, text, colorClass }]);
    const tid = window.setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 680);
    timersRef.current.push(tid);
  }, []);

  const resolvePlayerStrike = useCallback(() => {
    const {
      stageDef: curStage,
      equippedWeapon: curWeapon,
      levelMultiplier: curMult,
      onDamageMonster: dmgMonster,
      onDamageHero: dmgHero,
      onVictoryCleared: markVictory,
    } = latestRef.current;

    const totalClicks = Math.max(1, clicksRef.current);
    const totalDamage = Math.max(1, Math.round(totalClicks * curWeapon.damage * curMult));

    setTurnPhase('PLAYER_STRIKE');
    setHeroAnim('attack');
    setMonsterAnim('hurt');
    sound.playHeavyStrike();

    const remainingMonsterHp = dmgMonster(totalDamage);
    spawnPopup('monster', `-${totalDamage}`, 'text-amber-300 text-xl');

    const t1 = window.setTimeout(() => {
      setHeroAnim('idle');
      setMonsterAnim('idle');

      if (remainingMonsterHp <= 0) {
        sound.playVictory();
        markVictory(curStage.stage);
        setTurnPhase('VICTORY');
        return;
      }

      setTurnPhase('ENEMY_TURN');
      const t2 = window.setTimeout(() => {
        setMonsterAnim('attack');
        setHeroAnim('hurt');
        sound.playMonsterHit();

        const remainingHeroHp = dmgHero(curStage.atk);
        spawnPopup('hero', `-${curStage.atk}`, 'text-rose-400 text-lg');

        const t3 = window.setTimeout(() => {
          setMonsterAnim('idle');
          setHeroAnim('idle');
          if (remainingHeroHp <= 0) {
            sound.playGameOver();
            setTurnPhase('GAME_OVER');
          } else {
            clicksRef.current = 0;
            setClicks(0);
            setTimeLeftMs(TURN_RUSH_DURATION_MS);
            setTurnPhase('READY');
          }
        }, 400);
        timersRef.current.push(t3);
      }, 380);
      timersRef.current.push(t2);
    }, 480);

    timersRef.current.push(t1);
  }, [spawnPopup]);

  const startRushCountdown = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
    }
    const startTime = performance.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, TURN_RUSH_DURATION_MS - elapsed);
      setTimeLeftMs(remaining);

      if (remaining <= 0) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        resolvePlayerStrike();
      }
    }, 45);
  }, [resolvePlayerStrike]);

  const handleAttackTap = () => {
    if (turnPhase === 'READY') {
      clicksRef.current = 1;
      setClicks(1);
      setTimeLeftMs(TURN_RUSH_DURATION_MS);
      setTurnPhase('RUSH');
      sound.playTapAttack();
      spawnPopup('monster', 'HIT!', 'text-white text-xs');
      startRushCountdown();
      return;
    }

    if (turnPhase === 'RUSH') {
      clicksRef.current += 1;
      setClicks(clicksRef.current);
      sound.playTapAttack();
      setHeroAnim('attack');
      const tid = window.setTimeout(() => {
        setHeroAnim((cur) => (cur === 'attack' ? 'idle' : cur));
      }, 75);
      timersRef.current.push(tid);
    }
  };

  const handlePotionClick = (item: ConsumableItem) => {
    if (turnPhase === 'VICTORY' || turnPhase === 'GAME_OVER') return;
    const used = onUsePotion(item);
    if (used) {
      sound.playPotionHeal();
      spawnPopup('hero', `+${item.healAmount} HP`, 'text-emerald-400 text-base');
    }
  };

  const handleRetry = () => {
    clearAllTimers();
    clicksRef.current = 0;
    setClicks(0);
    setTimeLeftMs(TURN_RUSH_DURATION_MS);
    setMonsterAnim('idle');
    setHeroAnim('idle');
    setTurnPhase('READY');
    onRestartAfterDefeat();
  };

  const handleContinueNext = () => {
    clearAllTimers();
    clicksRef.current = 0;
    setClicks(0);
    setTimeLeftMs(TURN_RUSH_DURATION_MS);
    setMonsterAnim('idle');
    setHeroAnim('idle');
    setTurnPhase('READY');
    onNextStage();
  };

  const monsterHpPct = Math.max(0, Math.min(100, (monsterHp / stageDef.maxHp) * 100));
  const projectedDamage = Math.round(clicks * equippedWeapon.damage * levelMultiplier);
  const timeLeftPct = Math.max(0, Math.min(100, (timeLeftMs / TURN_RUSH_DURATION_MS) * 100));
  const totalOwnedPotions = CONSUMABLES.reduce((sum, p) => sum + (potions[p.id] || 0), 0);
  const canLeaveBattle = turnPhase === 'READY' || turnPhase === 'VICTORY' || turnPhase === 'GAME_OVER';

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#141824] p-2.5">
      {/* Dungeon Battleground Backdrop */}
      <svg
        viewBox="0 0 180 240"
        preserveAspectRatio="xMidYMid slice"
        shapeRendering="crispEdges"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <rect width="180" height="125" fill={stageDef.isBoss ? '#22131d' : '#181b2c'} />
        <rect y="20" width="180" height="2" fill="#10121e" />
        <rect y="50" width="180" height="2" fill="#10121e" />
        <rect y="80" width="180" height="2" fill="#10121e" />
        <rect x="44" y="22" width="2" height="28" fill="#10121e" />
        <rect x="128" y="22" width="2" height="28" fill="#10121e" />
        <rect x="86" y="52" width="2" height="28" fill="#10121e" />
        <rect x="20" y="34" width="4" height="14" fill="#78350f" />
        <rect x="19" y="26" width="6" height="8" fill="#f97316" />
        <rect x="21" y="28" width="2" height="4" fill="#fef08a" />
        <rect x="156" y="34" width="4" height="14" fill="#78350f" />
        <rect x="155" y="26" width="6" height="8" fill="#f97316" />
        <rect x="157" y="28" width="2" height="4" fill="#fef08a" />
        <rect y="125" width="180" height="115" fill="#23283b" />
        <rect y="125" width="180" height="4" fill="#323954" />
      </svg>

      {/* Top Monster & Stage Bar */}
      <div
        className={`relative z-10 shrink-0 border-[3px] border-[#090c14] px-2.5 py-2 ${
          stageDef.isBoss ? 'bg-[#2c1520]' : 'bg-[#1c2233]'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={!canLeaveBattle}
            onClick={onBackToMap}
            className="pixel-btn shrink-0 bg-[#28314b] px-2 py-1 font-pixel text-[11px] font-bold text-slate-100"
          >
            ← Bản đồ
          </button>

          <div className="min-w-0 flex-1 text-center">
            <div className="flex items-center justify-center gap-1">
              {stageDef.isBoss && <PixelIcon type="crown" size={12} />}
              <span
                className={`truncate font-pixel text-xs font-bold ${
                  stageDef.isBoss ? 'text-rose-300' : 'text-amber-300'
                }`}
              >
                Ván {stageDef.stage}/{TOTAL_STAGES} · {stageDef.name}
              </span>
            </div>
          </div>

          <div className="shrink-0 border border-slate-700 bg-[#0d111c] px-1.5 py-0.5 font-pixel text-[11px] font-bold text-orange-300 tabular-nums">
            ATK {stageDef.atk}
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[11px]">
          <span className="font-pixel font-bold text-slate-300">
            {stageDef.isBoss ? 'HP BOSS' : 'HP QUÁI'}
          </span>
          <span className="font-body font-bold text-rose-200 tabular-nums">
            {monsterHp} / {stageDef.maxHp}
          </span>
        </div>
        <div className="pixel-bar-track mt-1 h-3 w-full overflow-hidden">
          <div
            className="h-full bg-rose-600 transition-[width] duration-150"
            style={{
              width: `${monsterHpPct}%`,
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.25)',
            }}
          />
        </div>
      </div>

      {/* Arena Sprites Zone (min-h-0 guarantees bottom controls never clip!) */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-between py-1.5">
        {/* Clickable Monster Sprite */}
        <button
          type="button"
          onClick={handleAttackTap}
          disabled={turnPhase !== 'READY' && turnPhase !== 'RUSH'}
          aria-label={`Tấn công ${stageDef.name}`}
          className="relative flex flex-col items-center justify-center bg-transparent p-1 focus:outline-none cursor-pointer disabled:cursor-default"
        >
          <div
            className={
              monsterAnim === 'hurt'
                ? 'animate-hit-shake'
                : monsterAnim === 'attack'
                ? 'animate-lunge-down'
                : 'animate-idle-bob'
            }
          >
            <MonsterSprite
              archetype={stageDef.archetype}
              pose={monsterAnim}
              size={stageDef.isBoss ? 82 : 76}
            />
          </div>
          {popups
            .filter((p) => p.target === 'monster')
            .map((p) => (
              <span
                key={p.id}
                className={`animate-float-up pointer-events-none absolute top-1 left-1/2 z-30 font-pixel font-bold drop-shadow-[0_2px_0_#090c14] ${p.colorClass}`}
              >
                {p.text}
              </span>
            ))}
        </button>

        {/* Turn Status Banner */}
        <div className="w-full px-1 text-center">
          {turnPhase === 'READY' && (
            <div className="inline-block border-2 border-[#090c14] bg-[#1e263b] px-2.5 py-0.5 font-pixel text-[11px] font-bold text-amber-300">
              Vũ khí +{equippedWeapon.damage} × Cấp x{levelMultiplier.toFixed(1)} · Bấm Chiến đấu!
            </div>
          )}
          {turnPhase === 'RUSH' && (
            <div className="mx-auto max-w-[250px] border-2 border-[#090c14] bg-[#2a1f16] px-2.5 py-1">
              <div className="flex items-center justify-between font-pixel text-[11px] font-bold text-amber-300 tabular-nums">
                <span>CLICK: {clicks}</span>
                <span>DỰ KIẾN: {projectedDamage} DMG</span>
              </div>
              <div className="pixel-bar-track mt-1 h-2 w-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-[width] duration-75"
                  style={{ width: `${timeLeftPct}%` }}
                />
              </div>
            </div>
          )}
          {turnPhase === 'PLAYER_STRIKE' && (
            <div className="inline-block border-2 border-[#090c14] bg-amber-500 px-3 py-0.5 font-pixel text-xs font-bold text-slate-950">
              TUNG ĐÒN! ({clicks} CLICK)
            </div>
          )}
          {turnPhase === 'ENEMY_TURN' && (
            <div className="inline-block border-2 border-[#090c14] bg-rose-600 px-3 py-0.5 font-pixel text-xs font-bold text-white">
              QUÁI PHẢN CÔNG! (-{stageDef.atk} HP)
            </div>
          )}
        </div>

        {/* Hero Sprite */}
        <div className="relative flex flex-col items-center justify-center">
          <div
            className={
              heroAnim === 'attack'
                ? 'animate-lunge-up'
                : heroAnim === 'hurt'
                ? 'animate-hit-shake'
                : ''
            }
          >
            <HeroSprite
              pose={heroAnim === 'attack' ? 'attack' : heroAnim === 'hurt' ? 'hurt' : 'idle'}
              armorPrimary={equippedArmor.primaryColor}
              armorAccent={equippedArmor.accentColor}
              weaponBlade={equippedWeapon.bladeColor}
              weaponHilt={equippedWeapon.hiltColor}
              size={68}
            />
          </div>
          {popups
            .filter((p) => p.target === 'hero')
            .map((p) => (
              <span
                key={p.id}
                className={`animate-float-up pointer-events-none absolute top-0 left-1/2 z-30 font-pixel font-bold drop-shadow-[0_2px_0_#090c14] ${p.colorClass}`}
              >
                {p.text}
              </span>
            ))}
        </div>
      </div>

      {/* Bottom Combat Controls (Always Visible) */}
      <div className="relative z-10 flex shrink-0 flex-col gap-1.5">
        {/* Active Potions Quick-Use Row */}
        <div className="grid grid-cols-2 gap-2">
          {CONSUMABLES.map((item) => {
            const count = potions[item.id] || 0;
            const canUse =
              count > 0 &&
              heroHp < heroMaxHp &&
              turnPhase !== 'VICTORY' &&
              turnPhase !== 'GAME_OVER';
            return (
              <button
                key={item.id}
                type="button"
                disabled={!canUse}
                onClick={() => handlePotionClick(item)}
                className="pixel-btn flex items-center justify-between bg-[#222a3f] px-2.5 py-1.5 text-left"
              >
                <span className="flex items-center gap-1.5 min-w-0">
                  <PixelIcon type="potion" size={13} color={item.color} />
                  <span className="truncate font-pixel text-[11px] font-bold text-slate-100">
                    +{item.healAmount} HP
                  </span>
                </span>
                <span className="font-pixel text-[11px] font-bold text-emerald-300 tabular-nums">
                  x{count}
                </span>
              </button>
            );
          })}
        </div>

        {totalOwnedPotions === 0 && (
          <button
            type="button"
            onClick={onGoToShop}
            disabled={!canLeaveBattle}
            className="text-center font-body text-[11px] text-slate-400 underline decoration-slate-600 hover:text-amber-300"
          >
            Hết bình máu? Mua tại Cửa hàng
          </button>
        )}

        {/* Primary In-Match Combat Button */}
        <button
          type="button"
          onClick={handleAttackTap}
          disabled={turnPhase !== 'READY' && turnPhase !== 'RUSH'}
          className={`pixel-btn w-full px-4 py-3 font-pixel text-base font-bold tracking-wide ${
            turnPhase === 'RUSH'
              ? 'bg-rose-500 text-white'
              : 'bg-amber-500 text-slate-950'
          }`}
        >
          {turnPhase === 'READY' && 'CHIẾN ĐẤU! (CLICK LIÊN TỤC 3s)'}
          {turnPhase === 'RUSH' &&
            `CHIẾN ĐẤU! (${clicks}) · ${(timeLeftMs / 1000).toFixed(1)}s`}
          {turnPhase === 'PLAYER_STRIKE' && 'ĐANG TUNG ĐÒN...'}
          {turnPhase === 'ENEMY_TURN' && 'QUÁI ĐANG PHẢN CÔNG...'}
          {(turnPhase === 'VICTORY' || turnPhase === 'GAME_OVER') && 'TRẬN ĐẤU KẾT THÚC'}
        </button>
      </div>

      {/* Victory Overlay Modal */}
      {turnPhase === 'VICTORY' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="pixel-panel w-full max-w-[295px] p-4 text-center">
            <div className="font-pixel text-2xl font-bold text-amber-300">
              {stageDef.stage === TOTAL_STAGES ? 'PHÁ ĐẢO!' : 'CHIẾN THẮNG!'}
            </div>
            <p className="mt-1 text-xs text-slate-300">
              Đã hạ gục {stageDef.name} (Ván {stageDef.stage})
            </p>
            <div className="mt-3.5 grid grid-cols-2 gap-2 border-2 border-[#090c14] bg-[#121622] p-2.5">
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Vàng thưởng</span>
                <span className="mt-0.5 flex items-center gap-1 font-pixel text-base font-bold text-amber-300 tabular-nums">
                  <PixelIcon type="coin" size={14} />+{stageDef.goldReward}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[11px] text-slate-400">Kinh nghiệm</span>
                <span className="mt-0.5 flex items-center gap-1 font-pixel text-base font-bold text-sky-300 tabular-nums">
                  <PixelIcon type="exp" size={14} />+{stageDef.expReward}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {stageDef.stage < TOTAL_STAGES && (
                <button
                  type="button"
                  onClick={handleContinueNext}
                  className="pixel-btn w-full bg-emerald-500 px-4 py-2.5 font-pixel text-sm font-bold text-slate-950"
                >
                  VÁN TIẾP THEO (VÁN {stageDef.stage + 1})
                </button>
              )}
              <button
                type="button"
                onClick={onBackToMap}
                className="pixel-btn w-full bg-[#2a334d] px-4 py-2.5 font-pixel text-sm font-bold text-slate-100"
              >
                VỀ BẢN ĐỒ 10 VÁN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Overlay Modal */}
      {turnPhase === 'GAME_OVER' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/85 p-4">
          <div className="pixel-panel w-full max-w-[295px] p-4 text-center">
            <div className="font-pixel text-2xl font-bold text-rose-400">
              THUA CUỘC!
            </div>
            <p className="mt-1.5 text-xs text-slate-300">
              Hiệp sĩ đã gục ngã tại Ván {stageDef.stage}. Hãy hồi phục và thử lại!
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="pixel-btn w-full bg-amber-500 px-4 py-2.5 font-pixel text-sm font-bold text-slate-950"
              >
                CHƠI LẠI VÁN NÀY
              </button>
              <button
                type="button"
                onClick={onBackToMap}
                className="pixel-btn w-full bg-[#2a334d] px-4 py-2.5 font-pixel text-sm font-bold text-slate-100"
              >
                VỀ BẢN ĐỒ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
