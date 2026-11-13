import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { CombatTab } from './components/CombatTab';
import { ShopTab } from './components/ShopTab';
import { StageMapView } from './components/StageMapView';
import { TitleScreen } from './components/TitleScreen';
import { TopHud } from './components/TopHud';
import { TrainingTab } from './components/TrainingTab';
import {
  ARMORS,
  ArmorItem,
  BASE_HERO_HP,
  ConsumableItem,
  getExpToNext,
  getLevelMultiplier,
  getMonsterForStage,
  TOTAL_STAGES,
  WEAPONS,
  WeaponItem,
} from './data/gameData';
import { sound } from './utils/sound';

type GameScreenState = 'TITLE_MENU' | 'PLAYING';
type CombatSubView = 'map' | 'battle';

export default function App() {
  const [gameState, setGameState] = useState<GameScreenState>('TITLE_MENU');
  const [activeTab, setActiveTab] = useState<ActiveTab>('training');
  const [combatSubView, setCombatSubView] = useState<CombatSubView>('map');
  const [muted, setMuted] = useState(false);

  // Player stats & progression
  const [gold, setGold] = useState(30);
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [totalTrainingClicks, setTotalTrainingClicks] = useState(0);
  const [levelUpBanner, setLevelUpBanner] = useState<number | null>(null);

  // Equipment & inventory
  const [ownedWeapons, setOwnedWeapons] = useState<string[]>(['fist']);
  const [equippedWeaponId, setEquippedWeaponId] = useState<string>('fist');
  const [ownedArmors, setOwnedArmors] = useState<string[]>(['cloth']);
  const [equippedArmorId, setEquippedArmorId] = useState<string>('cloth');
  const [potions, setPotions] = useState<Record<string, number>>({
    potion_small: 1,
    potion_large: 0,
  });

  const equippedWeapon = useMemo(
    () => WEAPONS.find((w) => w.id === equippedWeaponId) || WEAPONS[0],
    [equippedWeaponId]
  );

  const equippedArmor = useMemo(
    () => ARMORS.find((a) => a.id === equippedArmorId) || ARMORS[0],
    [equippedArmorId]
  );

  const heroMaxHp = BASE_HERO_HP + equippedArmor.maxHpBonus;
  const [heroHp, setHeroHp] = useState(heroMaxHp);

  // 10-stage campaign & active battle state
  const [maxUnlockedStage, setMaxUnlockedStage] = useState(1);
  const [clearedStages, setClearedStages] = useState<number[]>([]);
  const [selectedStage, setSelectedStage] = useState(1);
  const [activeStage, setActiveStage] = useState(1);
  const currentMonster = useMemo(() => getMonsterForStage(activeStage), [activeStage]);
  const [monsterHp, setMonsterHp] = useState(currentMonster.maxHp);
  const [combatBusy, setCombatBusy] = useState(false);

  const heroHpRef = useRef(heroHp);
  heroHpRef.current = heroHp;

  const monsterHpRef = useRef(monsterHp);
  monsterHpRef.current = monsterHp;

  const levelBannerTimerRef = useRef<number | null>(null);

  const expToNext = getExpToNext(level);
  const levelMultiplier = getLevelMultiplier(level);
  const nextLevelMultiplier = getLevelMultiplier(level + 1);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      sound.muted = next;
      return next;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleMute]);

  useEffect(() => {
    return () => {
      if (levelBannerTimerRef.current) {
        window.clearTimeout(levelBannerTimerRef.current);
      }
    };
  }, []);

  const grantExp = useCallback(
    (amount: number) => {
      let currentLevel = level;
      let currentExp = exp + amount;
      let leveledUp = false;

      while (currentExp >= getExpToNext(currentLevel)) {
        currentExp -= getExpToNext(currentLevel);
        currentLevel += 1;
        leveledUp = true;
      }

      setLevel(currentLevel);
      setExp(currentExp);

      if (leveledUp) {
        sound.playLevelUp();
        heroHpRef.current = heroMaxHp;
        setHeroHp(heroMaxHp);
        setLevelUpBanner(currentLevel);
        if (levelBannerTimerRef.current) {
          window.clearTimeout(levelBannerTimerRef.current);
        }
        levelBannerTimerRef.current = window.setTimeout(() => {
          setLevelUpBanner(null);
        }, 1800);
      }
    },
    [exp, heroMaxHp, level]
  );

  const handleTrainClick = useCallback(() => {
    sound.playTrainClick();
    setTotalTrainingClicks((c) => c + 1);
    grantExp(1);
  }, [grantExp]);

  const handleDamageMonster = useCallback((damage: number) => {
    const next = Math.max(0, monsterHpRef.current - damage);
    monsterHpRef.current = next;
    setMonsterHp(next);
    return next;
  }, []);

  const handleDamageHero = useCallback((damage: number) => {
    const next = Math.max(0, heroHpRef.current - damage);
    heroHpRef.current = next;
    setHeroHp(next);
    return next;
  }, []);

  const handleUsePotion = useCallback(
    (item: ConsumableItem) => {
      const count = potions[item.id] || 0;
      if (count <= 0 || heroHpRef.current >= heroMaxHp) {
        return false;
      }
      setPotions((prev) => ({
        ...prev,
        [item.id]: Math.max(0, (prev[item.id] || 0) - 1),
      }));
      const healed = Math.min(heroMaxHp, heroHpRef.current + item.healAmount);
      heroHpRef.current = healed;
      setHeroHp(healed);
      return true;
    },
    [heroMaxHp, potions]
  );

  const handleStartBattle = useCallback(
    (stageNum: number) => {
      const stageDef = getMonsterForStage(stageNum);
      sound.playTabSwitch();
      setSelectedStage(stageNum);
      setActiveStage(stageNum);
      monsterHpRef.current = stageDef.maxHp;
      setMonsterHp(stageDef.maxHp);
      if (heroHpRef.current <= 0) {
        heroHpRef.current = heroMaxHp;
        setHeroHp(heroMaxHp);
      }
      setCombatSubView('battle');
    },
    [heroMaxHp]
  );

  const handleVictoryCleared = useCallback(
    (stageCleared: number) => {
      const stageDef = getMonsterForStage(stageCleared);
      setGold((g) => g + stageDef.goldReward);
      grantExp(stageDef.expReward);
      setClearedStages((prev) => (prev.includes(stageCleared) ? prev : [...prev, stageCleared]));
      setMaxUnlockedStage((prev) => Math.min(TOTAL_STAGES, Math.max(prev, stageCleared + 1)));
    },
    [grantExp]
  );

  const handleNextStage = useCallback(() => {
    const nextStage = Math.min(TOTAL_STAGES, activeStage + 1);
    const nextDef = getMonsterForStage(nextStage);
    setSelectedStage(nextStage);
    setActiveStage(nextStage);
    monsterHpRef.current = nextDef.maxHp;
    setMonsterHp(nextDef.maxHp);
  }, [activeStage]);

  const handleRestartAfterDefeat = useCallback(() => {
    heroHpRef.current = heroMaxHp;
    setHeroHp(heroMaxHp);
    monsterHpRef.current = currentMonster.maxHp;
    setMonsterHp(currentMonster.maxHp);
  }, [currentMonster.maxHp, heroMaxHp]);

  const handleBuyOrEquipWeapon = useCallback(
    (weapon: WeaponItem) => {
      if (ownedWeapons.includes(weapon.id)) {
        sound.playBuyEquip();
        setEquippedWeaponId(weapon.id);
        return;
      }
      if (gold < weapon.price) return;
      sound.playBuyEquip();
      setGold((g) => g - weapon.price);
      setOwnedWeapons((prev) => [...prev, weapon.id]);
      setEquippedWeaponId(weapon.id);
    },
    [gold, ownedWeapons]
  );

  const handleBuyOrEquipArmor = useCallback(
    (armor: ArmorItem) => {
      const oldBonus = equippedArmor.maxHpBonus;
      const diff = armor.maxHpBonus - oldBonus;

      if (ownedArmors.includes(armor.id)) {
        sound.playBuyEquip();
        setEquippedArmorId(armor.id);
        setHeroHp((hp) =>
          Math.max(1, Math.min(BASE_HERO_HP + armor.maxHpBonus, hp + Math.max(0, diff)))
        );
        return;
      }
      if (gold < armor.price) return;
      sound.playBuyEquip();
      setGold((g) => g - armor.price);
      setOwnedArmors((prev) => [...prev, armor.id]);
      setEquippedArmorId(armor.id);
      setHeroHp((hp) =>
        Math.max(1, Math.min(BASE_HERO_HP + armor.maxHpBonus, hp + Math.max(0, diff)))
      );
    },
    [equippedArmor.maxHpBonus, gold, ownedArmors]
  );

  const handleBuyConsumable = useCallback(
    (item: ConsumableItem) => {
      if (gold < item.price) return;
      sound.playBuyEquip();
      setGold((g) => g - item.price);
      setPotions((prev) => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1,
      }));
    },
    [gold]
  );

  const handleSelectTab = useCallback(
    (tab: ActiveTab) => {
      if (combatBusy || tab === activeTab) return;
      sound.playTabSwitch();
      setActiveTab(tab);
      if (tab === 'combat' && heroHpRef.current <= 0) {
        heroHpRef.current = heroMaxHp;
        setHeroHp(heroMaxHp);
      }
    },
    [activeTab, combatBusy, heroMaxHp]
  );

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-[#090c14] p-2 sm:p-4">
      {/* 9:16 Portrait Mobile Device Frame */}
      <div
        className="relative flex flex-col overflow-hidden border-[5px] border-[#262f48] bg-[#141824] shadow-[0_0_0_3px_#05070c,0_20px_56px_rgba(0,0,0,0.8)]"
        style={{
          width: 'min(94vw, calc(92dvh * 9 / 16), 410px)',
          height: 'min(92dvh, calc(94vw * 16 / 9), 729px)',
        }}
      >
        {gameState === 'TITLE_MENU' ? (
          <TitleScreen
            onStart={() => {
              sound.playTabSwitch();
              setGameState('PLAYING');
            }}
          />
        ) : (
          <>
            {/* Fixed Top HUD */}
            <TopHud
              gold={gold}
              level={level}
              exp={exp}
              expToNext={expToNext}
              levelMultiplier={levelMultiplier}
              hp={heroHp}
              maxHp={heroMaxHp}
              muted={muted}
              onToggleMute={toggleMute}
            />

            {/* Active Tab Viewport */}
            <section className="min-h-0 flex-1 overflow-hidden">
              {activeTab === 'training' && (
                <TrainingTab
                  level={level}
                  exp={exp}
                  expToNext={expToNext}
                  levelMultiplier={levelMultiplier}
                  nextLevelMultiplier={nextLevelMultiplier}
                  equippedWeapon={equippedWeapon}
                  equippedArmor={equippedArmor}
                  totalTrainingClicks={totalTrainingClicks}
                  levelUpBanner={levelUpBanner}
                  onTrainClick={handleTrainClick}
                />
              )}

              {activeTab === 'combat' && combatSubView === 'map' && (
                <StageMapView
                  maxUnlockedStage={maxUnlockedStage}
                  clearedStages={clearedStages}
                  selectedStage={selectedStage}
                  onSelectStage={(s) => {
                    sound.playTabSwitch();
                    setSelectedStage(s);
                  }}
                  onStartBattle={handleStartBattle}
                />
              )}

              {activeTab === 'combat' && combatSubView === 'battle' && (
                <CombatTab
                  stageDef={currentMonster}
                  monsterHp={monsterHp}
                  heroHp={heroHp}
                  heroMaxHp={heroMaxHp}
                  equippedWeapon={equippedWeapon}
                  equippedArmor={equippedArmor}
                  levelMultiplier={levelMultiplier}
                  potions={potions}
                  onDamageMonster={handleDamageMonster}
                  onDamageHero={handleDamageHero}
                  onUsePotion={handleUsePotion}
                  onVictoryCleared={handleVictoryCleared}
                  onNextStage={handleNextStage}
                  onRestartAfterDefeat={handleRestartAfterDefeat}
                  onBackToMap={() => {
                    sound.playTabSwitch();
                    setCombatSubView('map');
                  }}
                  onGoToShop={() => handleSelectTab('shop')}
                  onBusyChange={setCombatBusy}
                />
              )}

              {activeTab === 'shop' && (
                <ShopTab
                  gold={gold}
                  ownedWeapons={ownedWeapons}
                  equippedWeaponId={equippedWeaponId}
                  ownedArmors={ownedArmors}
                  equippedArmorId={equippedArmorId}
                  potions={potions}
                  onBuyOrEquipWeapon={handleBuyOrEquipWeapon}
                  onBuyOrEquipArmor={handleBuyOrEquipArmor}
                  onBuyConsumable={handleBuyConsumable}
                />
              )}
            </section>

            {/* Fixed Bottom Navigation */}
            <BottomNav
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              locked={combatBusy}
            />
          </>
        )}
      </div>
    </main>
  );
}
