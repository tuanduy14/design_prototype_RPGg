import React, { useState } from 'react';
import {
  ARMORS,
  ArmorItem,
  CONSUMABLES,
  ConsumableItem,
  WEAPONS,
  WeaponItem,
} from '../data/gameData';
import { PixelIcon } from './PixelSprites';

type ShopCategory = 'weapons' | 'armors' | 'consumables';

interface ShopTabProps {
  gold: number;
  ownedWeapons: string[];
  equippedWeaponId: string;
  ownedArmors: string[];
  equippedArmorId: string;
  potions: Record<string, number>;
  onBuyOrEquipWeapon: (weapon: WeaponItem) => void;
  onBuyOrEquipArmor: (armor: ArmorItem) => void;
  onBuyConsumable: (item: ConsumableItem) => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({
  gold,
  ownedWeapons,
  equippedWeaponId,
  ownedArmors,
  equippedArmorId,
  potions,
  onBuyOrEquipWeapon,
  onBuyOrEquipArmor,
  onBuyConsumable,
}) => {
  const [category, setCategory] = useState<ShopCategory>('weapons');

  return (
    <div className="flex h-full flex-col bg-[#161b29] p-3">
      {/* Category Sub-Tabs */}
      <div className="grid shrink-0 grid-cols-3 gap-1.5 bg-[#0e121c] p-1 border-2 border-[#090c14]">
        <button
          type="button"
          onClick={() => setCategory('weapons')}
          className={`whitespace-nowrap px-2 py-2 font-pixel text-xs font-bold transition-colors ${
            category === 'weapons'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-300 hover:bg-[#1e2538]'
          }`}
        >
          Vũ khí
        </button>
        <button
          type="button"
          onClick={() => setCategory('armors')}
          className={`whitespace-nowrap px-2 py-2 font-pixel text-xs font-bold transition-colors ${
            category === 'armors'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-300 hover:bg-[#1e2538]'
          }`}
        >
          Giáp
        </button>
        <button
          type="button"
          onClick={() => setCategory('consumables')}
          className={`whitespace-nowrap px-2 py-2 font-pixel text-xs font-bold transition-colors ${
            category === 'consumables'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-300 hover:bg-[#1e2538]'
          }`}
        >
          Vật phẩm
        </button>
      </div>

      {/* Item List */}
      <div className="pixel-scroll mt-2.5 flex-1 space-y-2.5 overflow-y-auto pr-0.5">
        {category === 'weapons' &&
          WEAPONS.map((weapon) => {
            const isOwned = ownedWeapons.includes(weapon.id);
            const isEquipped = equippedWeaponId === weapon.id;
            const canAfford = gold >= weapon.price;

            return (
              <div
                key={weapon.id}
                className="pixel-panel flex items-center justify-between gap-2.5 p-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#090c14] bg-[#101420]">
                    <PixelIcon type="sword" size={24} color={weapon.bladeColor} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-pixel text-sm font-bold text-slate-100">
                      {weapon.name}
                    </div>
                    <div className="text-xs font-bold text-amber-300 tabular-nums">
                      +{weapon.damage} Sát thương/click
                    </div>
                    <div className="truncate text-[11px] text-slate-400">
                      {weapon.description}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isEquipped || (!isOwned && !canAfford)}
                  onClick={() => onBuyOrEquipWeapon(weapon)}
                  className={`pixel-btn shrink-0 px-3 py-2 font-pixel text-xs font-bold whitespace-nowrap ${
                    isEquipped
                      ? 'bg-emerald-700 text-emerald-100'
                      : isOwned
                      ? 'bg-sky-500 text-slate-950'
                      : canAfford
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {isEquipped
                    ? 'Đang dùng'
                    : isOwned
                    ? 'Trang bị'
                    : `${weapon.price} Vàng`}
                </button>
              </div>
            );
          })}

        {category === 'armors' &&
          ARMORS.map((armor) => {
            const isOwned = ownedArmors.includes(armor.id);
            const isEquipped = equippedArmorId === armor.id;
            const canAfford = gold >= armor.price;

            return (
              <div
                key={armor.id}
                className="pixel-panel flex items-center justify-between gap-2.5 p-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#090c14] bg-[#101420]">
                    <PixelIcon type="shield" size={24} color={armor.primaryColor} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-pixel text-sm font-bold text-slate-100">
                      {armor.name}
                    </div>
                    <div className="text-xs font-bold text-rose-300 tabular-nums">
                      +{armor.maxHpBonus} HP tối đa
                    </div>
                    <div className="truncate text-[11px] text-slate-400">
                      {armor.description}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isEquipped || (!isOwned && !canAfford)}
                  onClick={() => onBuyOrEquipArmor(armor)}
                  className={`pixel-btn shrink-0 px-3 py-2 font-pixel text-xs font-bold whitespace-nowrap ${
                    isEquipped
                      ? 'bg-emerald-700 text-emerald-100'
                      : isOwned
                      ? 'bg-sky-500 text-slate-950'
                      : canAfford
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {isEquipped
                    ? 'Đang dùng'
                    : isOwned
                    ? 'Trang bị'
                    : `${armor.price} Vàng`}
                </button>
              </div>
            );
          })}

        {category === 'consumables' &&
          CONSUMABLES.map((item) => {
            const ownedCount = potions[item.id] || 0;
            const canAfford = gold >= item.price;

            return (
              <div
                key={item.id}
                className="pixel-panel flex items-center justify-between gap-2.5 p-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#090c14] bg-[#101420]">
                    <PixelIcon type="potion" size={24} color={item.color} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-pixel text-sm font-bold text-slate-100">
                        {item.name}
                      </span>
                      <span className="font-pixel text-xs font-bold text-emerald-300 tabular-nums">
                        ({ownedCount})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-emerald-300 tabular-nums">
                      Hồi +{item.healAmount} HP khi đấu
                    </div>
                    <div className="truncate text-[11px] text-slate-400">
                      {item.description}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!canAfford}
                  onClick={() => onBuyConsumable(item)}
                  className={`pixel-btn shrink-0 px-3 py-2 font-pixel text-xs font-bold whitespace-nowrap ${
                    canAfford
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  Mua {item.price}G
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};
