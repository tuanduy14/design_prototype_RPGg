export interface WeaponItem {
  id: string;
  name: string;
  damage: number;
  price: number;
  description: string;
  bladeColor: string;
  hiltColor: string;
}

export interface ArmorItem {
  id: string;
  name: string;
  maxHpBonus: number;
  price: number;
  description: string;
  primaryColor: string;
  accentColor: string;
}

export interface ConsumableItem {
  id: string;
  name: string;
  healAmount: number;
  price: number;
  description: string;
  color: string;
}

export type MonsterArchetype = 'slime' | 'goblin' | 'skeleton' | 'orc' | 'dragon';

export interface StageDefinition {
  stage: number;
  isBoss: boolean;
  archetype: MonsterArchetype;
  name: string;
  maxHp: number;
  atk: number;
  goldReward: number;
  expReward: number;
  tagline: string;
}

export const WEAPONS: WeaponItem[] = [
  {
    id: 'fist',
    name: 'Găng Vải Tập Sự',
    damage: 1,
    price: 0,
    description: 'Vũ khí khởi đầu cho tân binh.',
    bladeColor: '#d9b99b',
    hiltColor: '#8d6e63',
  },
  {
    id: 'dagger',
    name: 'Dao Găm Thép',
    damage: 5,
    price: 30,
    description: 'Nhanh nhẹn, sát thương mỗi click +5.',
    bladeColor: '#cbd5e1',
    hiltColor: '#b45309',
  },
  {
    id: 'sword',
    name: 'Kiếm Sắt Kỵ Sĩ',
    damage: 10,
    price: 90,
    description: 'Cân bằng hoàn hảo, mỗi click 10 DMG.',
    bladeColor: '#e2e8f0',
    hiltColor: '#eab308',
  },
  {
    id: 'axe',
    name: 'Rìu Chiến Lửa',
    damage: 20,
    price: 220,
    description: 'Uy lực phá giáp, mỗi click 20 DMG.',
    bladeColor: '#fb923c',
    hiltColor: '#7c2d12',
  },
  {
    id: 'holy_blade',
    name: 'Thánh Kiếm Ánh Sáng',
    damage: 38,
    price: 500,
    description: 'Thần binh tối thượng, mỗi click 38 DMG.',
    bladeColor: '#38bdf8',
    hiltColor: '#facc15',
  },
];

export const ARMORS: ArmorItem[] = [
  {
    id: 'cloth',
    name: 'Áo Tập Võ',
    maxHpBonus: 0,
    price: 0,
    description: 'Trang phục cơ bản, nhẹ và thoáng.',
    primaryColor: '#3b82f6',
    accentColor: '#1d4ed8',
  },
  {
    id: 'leather',
    name: 'Giáp Da Săn Quái',
    maxHpBonus: 40,
    price: 45,
    description: 'Tăng +40 HP tối đa cho hiệp sĩ.',
    primaryColor: '#a16207',
    accentColor: '#713f12',
  },
  {
    id: 'iron',
    name: 'Giáp Sắt Hoàng Gia',
    maxHpBonus: 100,
    price: 130,
    description: 'Tăng +100 HP tối đa, phòng ngự vững chắc.',
    primaryColor: '#94a3b8',
    accentColor: '#475569',
  },
  {
    id: 'knight',
    name: 'Giáp Vàng Thánh Điện',
    maxHpBonus: 200,
    price: 300,
    description: 'Tăng +200 HP tối đa, khí chất bất khuất.',
    primaryColor: '#eab308',
    accentColor: '#a16207',
  },
  {
    id: 'dragon',
    name: 'Giáp Vảy Rồng Đỏ',
    maxHpBonus: 360,
    price: 620,
    description: 'Tăng +360 HP tối đa, rèn từ vảy rồng.',
    primaryColor: '#dc2626',
    accentColor: '#7f1d1d',
  },
];

export const CONSUMABLES: ConsumableItem[] = [
  {
    id: 'potion_small',
    name: 'Bình Máu Nhỏ',
    healAmount: 50,
    price: 20,
    description: 'Hồi ngay 50 HP khi đang chiến đấu.',
    color: '#ef4444',
  },
  {
    id: 'potion_large',
    name: 'Bình Máu Đại',
    healAmount: 140,
    price: 50,
    description: 'Hồi ngay 140 HP khi đang chiến đấu.',
    color: '#f43f5e',
  },
];

export const TOTAL_STAGES = 10;

export const CAMPAIGN_STAGES: StageDefinition[] = [
  {
    stage: 1,
    isBoss: false,
    archetype: 'slime',
    name: 'Slime Xanh Nhớt',
    maxHp: 40,
    atk: 7,
    goldReward: 25,
    expReward: 8,
    tagline: 'Quái tập sự ở bìa rừng',
  },
  {
    stage: 2,
    isBoss: false,
    archetype: 'slime',
    name: 'Slime Gai Rừng',
    maxHp: 75,
    atk: 10,
    goldReward: 36,
    expReward: 12,
    tagline: 'Slime đột biến hung hãn hơn',
  },
  {
    stage: 3,
    isBoss: false,
    archetype: 'goblin',
    name: 'Yêu Tinh Goblin',
    maxHp: 120,
    atk: 14,
    goldReward: 50,
    expReward: 16,
    tagline: 'Kẻ cướp ranh mãnh cầm dao găm',
  },
  {
    stage: 4,
    isBoss: false,
    archetype: 'goblin',
    name: 'Goblin Đạo Tặc',
    maxHp: 175,
    atk: 19,
    goldReward: 70,
    expReward: 22,
    tagline: 'Tên trinh sát canh cổng doanh trại',
  },
  {
    stage: 5,
    isBoss: true,
    archetype: 'orc',
    name: 'Thủ Lĩnh Orc Đỏ',
    maxHp: 300,
    atk: 26,
    goldReward: 145,
    expReward: 48,
    tagline: 'BOSS VÁN 5 · Bạo chúa rừng sâu',
  },
  {
    stage: 6,
    isBoss: false,
    archetype: 'skeleton',
    name: 'Bộ Xương Kiếm Sĩ',
    maxHp: 360,
    atk: 31,
    goldReward: 115,
    expReward: 38,
    tagline: 'Chiến binh cổ đại trong hầm mộ',
  },
  {
    stage: 7,
    isBoss: false,
    archetype: 'skeleton',
    name: 'Kỵ Sĩ Xương Đen',
    maxHp: 460,
    atk: 37,
    goldReward: 150,
    expReward: 50,
    tagline: 'Hộ vệ bất tử với thanh kiếm nguyền',
  },
  {
    stage: 8,
    isBoss: false,
    archetype: 'orc',
    name: 'Orc Thiết Giáp',
    maxHp: 600,
    atk: 45,
    goldReward: 195,
    expReward: 65,
    tagline: 'Cận vệ tinh nhuệ của Ma Vương',
  },
  {
    stage: 9,
    isBoss: false,
    archetype: 'skeleton',
    name: 'Tử Thần Hầm Ngục',
    maxHp: 780,
    atk: 54,
    goldReward: 250,
    expReward: 82,
    tagline: 'Cửa ngõ cuối trước hang Rồng',
  },
  {
    stage: 10,
    isBoss: true,
    archetype: 'dragon',
    name: 'Rồng Lửa Cổ Đại',
    maxHp: 1150,
    atk: 68,
    goldReward: 500,
    expReward: 160,
    tagline: 'BOSS CUỐI VÁN 10 · Chúa tể dung nham',
  },
];

export const BASE_HERO_HP = 100;
export const TURN_RUSH_DURATION_MS = 3000;

export function getExpToNext(level: number): number {
  return Math.floor(10 * Math.pow(1.35, level - 1));
}

export function getLevelMultiplier(level: number): number {
  return Number((1 + (level - 1) * 0.1).toFixed(1));
}

export function getMonsterForStage(stage: number): StageDefinition {
  const clamped = Math.max(1, Math.min(TOTAL_STAGES, stage));
  return CAMPAIGN_STAGES[clamped - 1];
}
