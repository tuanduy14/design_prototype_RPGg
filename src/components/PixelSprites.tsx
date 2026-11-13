import React from 'react';
import { MonsterArchetype } from '../data/gameData';

interface HeroSpriteProps {
  pose?: 'idle' | 'train_down' | 'train_up' | 'attack' | 'hurt';
  armorPrimary?: string;
  armorAccent?: string;
  weaponBlade?: string;
  weaponHilt?: string;
  hasWeapon?: boolean;
  size?: number;
}

export const HeroSprite: React.FC<HeroSpriteProps> = ({
  pose = 'idle',
  armorPrimary = '#3b82f6',
  armorAccent = '#1d4ed8',
  weaponBlade = '#cbd5e1',
  weaponHilt = '#b45309',
  hasWeapon = true,
  size = 96,
}) => {
  const isTrainDown = pose === 'train_down';
  const isTrainUp = pose === 'train_up';
  const isAttack = pose === 'attack';
  const isHurt = pose === 'hurt';

  const bodyOffsetY = isTrainDown ? 2 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      shapeRendering="crispEdges"
      className="select-none overflow-visible"
      aria-label="Hiệp sĩ"
    >
      {/* Ground Shadow */}
      <rect x="4" y="18" width="12" height="2" fill="rgba(0,0,0,0.45)" />

      {/* Hurt flash tint overlay */}
      <g style={isHurt ? { filter: 'brightness(2) saturate(0.2)' } : undefined}>
        {/* Legs & Boots */}
        <rect x="6" y={15} width="3" height="3" fill="#334155" />
        <rect x="11" y={15} width="3" height="3" fill="#334155" />
        <rect x="5" y={17} width="4" height="2" fill="#451a03" />
        <rect x="11" y={17} width="4" height="2" fill="#451a03" />

        {/* Torso / Armor */}
        <rect x="5" y={9 + bodyOffsetY} width="10" height="6" fill={armorPrimary} />
        <rect x="6" y={10 + bodyOffsetY} width="8" height="4" fill={armorAccent} />
        {/* Belt */}
        <rect x="5" y={14 + bodyOffsetY} width="10" height="1" fill="#78350f" />
        <rect x="9" y={14 + bodyOffsetY} width="2" height="1" fill="#facc15" />

        {/* Head & Helmet */}
        <rect x="6" y={3 + bodyOffsetY} width="8" height="6" fill="#fde68a" />
        {/* Hair / Helmet top */}
        <rect x="5" y={2 + bodyOffsetY} width="10" height="2" fill={armorPrimary} />
        <rect x="7" y={1 + bodyOffsetY} width="6" height="1" fill="#ef4444" />
        {/* Headband */}
        <rect x="6" y={4 + bodyOffsetY} width="8" height="1" fill="#ef4444" />
        {/* Eyes */}
        <rect x="7" y={6 + bodyOffsetY} width="1" height="2" fill="#0f172a" />
        <rect x="12" y={6 + bodyOffsetY} width="1" height="2" fill="#0f172a" />
        {/* Cheeks */}
        <rect x="6" y={7 + bodyOffsetY} width="1" height="1" fill="#fca5a5" />
        <rect x="13" y={7 + bodyOffsetY} width="1" height="1" fill="#fca5a5" />

        {/* Arms + Barbell for Training Poses */}
        {(isTrainDown || isTrainUp) ? (
          <>
            {/* Arms holding barbell */}
            <rect x="3" y={isTrainUp ? 6 : 9} width="2" height="3" fill="#fde68a" />
            <rect x="15" y={isTrainUp ? 6 : 9} width="2" height="3" fill="#fde68a" />
            {/* Barbell */}
            <rect x="1" y={isTrainUp ? 5 : 8} width="18" height="1" fill="#94a3b8" />
            <rect x="1" y={isTrainUp ? 3 : 6} width="2" height="5" fill="#475569" />
            <rect x="17" y={isTrainUp ? 3 : 6} width="2" height="5" fill="#475569" />
            <rect x="0" y={isTrainUp ? 4 : 7} width="1" height="3" fill="#eab308" />
            <rect x="19" y={isTrainUp ? 4 : 7} width="1" height="3" fill="#eab308" />
          </>
        ) : (
          <>
            {/* Left Arm / Shield */}
            <rect x="3" y={10 + bodyOffsetY} width="2" height="4" fill={armorPrimary} />
            <rect x="2" y={11 + bodyOffsetY} width="2" height="4" fill="#64748b" />
            <rect x="2" y={12 + bodyOffsetY} width="2" height="2" fill={armorAccent} />

            {/* Right Arm & Weapon */}
            <rect x="15" y={isAttack ? 8 : 10 + bodyOffsetY} width="2" height="3" fill="#fde68a" />
            {hasWeapon && (
              <g transform={isAttack ? 'translate(0, -4)' : ''}>
                <rect x="16" y="8" width="2" height="3" fill={weaponHilt} />
                <rect x="15" y="7" width="4" height="1" fill={weaponHilt} />
                <rect x="16" y="1" width="2" height="6" fill={weaponBlade} />
                <rect x="17" y="2" width="1" height="5" fill="#ffffff" opacity="0.45" />
              </g>
            )}
          </>
        )}
      </g>
    </svg>
  );
};

interface MonsterSpriteProps {
  archetype: MonsterArchetype;
  pose?: 'idle' | 'attack' | 'hurt';
  size?: number;
}

export const MonsterSprite: React.FC<MonsterSpriteProps> = ({
  archetype,
  pose = 'idle',
  size = 104,
}) => {
  const isHurt = pose === 'hurt';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      shapeRendering="crispEdges"
      className="select-none overflow-visible"
      aria-label={archetype}
    >
      <rect x="3" y="18" width="14" height="2" fill="rgba(0,0,0,0.45)" />
      <g style={isHurt ? { filter: 'brightness(2.4) saturate(0.2)' } : undefined}>
        {archetype === 'slime' && (
          <>
            <rect x="5" y="7" width="10" height="2" fill="#22c55e" />
            <rect x="3" y="9" width="14" height="6" fill="#16a34a" />
            <rect x="2" y="13" width="16" height="5" fill="#15803d" />
            {/* Highlight */}
            <rect x="5" y="9" width="3" height="2" fill="#86efac" />
            <rect x="6" y="8" width="2" height="1" fill="#bbf7d0" />
            {/* Angry Eyes */}
            <rect x="6" y="12" width="2" height="2" fill="#052e16" />
            <rect x="12" y="12" width="2" height="2" fill="#052e16" />
            <rect x="6" y="12" width="1" height="1" fill="#ffffff" />
            <rect x="12" y="12" width="1" height="1" fill="#ffffff" />
            {/* Mouth */}
            <rect x="8" y="15" width="4" height="1" fill="#052e16" />
          </>
        )}

        {archetype === 'goblin' && (
          <>
            {/* Ears */}
            <rect x="2" y="5" width="3" height="2" fill="#65a30d" />
            <rect x="15" y="5" width="3" height="2" fill="#65a30d" />
            {/* Head */}
            <rect x="5" y="4" width="10" height="6" fill="#84cc16" />
            <rect x="6" y="6" width="2" height="2" fill="#dc2626" />
            <rect x="12" y="6" width="2" height="2" fill="#dc2626" />
            <rect x="7" y="9" width="6" height="1" fill="#fef08a" />
            {/* Body */}
            <rect x="6" y="10" width="8" height="5" fill="#78350f" />
            <rect x="5" y="11" width="2" height="4" fill="#84cc16" />
            <rect x="13" y="11" width="2" height="4" fill="#84cc16" />
            {/* Dagger */}
            <rect x="2" y="9" width="2" height="4" fill="#cbd5e1" />
            <rect x="2" y="13" width="2" height="2" fill="#451a03" />
            {/* Legs */}
            <rect x="6" y="15" width="3" height="3" fill="#4d7c0f" />
            <rect x="11" y="15" width="3" height="3" fill="#4d7c0f" />
          </>
        )}

        {archetype === 'skeleton' && (
          <>
            {/* Skull */}
            <rect x="6" y="2" width="8" height="6" fill="#f1f5f9" />
            <rect x="7" y="8" width="6" height="2" fill="#cbd5e1" />
            <rect x="7" y="4" width="2" height="2" fill="#0f172a" />
            <rect x="11" y="4" width="2" height="2" fill="#0f172a" />
            <rect x="7" y="4" width="1" height="1" fill="#ef4444" />
            <rect x="11" y="4" width="1" height="1" fill="#ef4444" />
            {/* Ribcage */}
            <rect x="9" y="10" width="2" height="5" fill="#cbd5e1" />
            <rect x="6" y="11" width="8" height="1" fill="#f1f5f9" />
            <rect x="6" y="13" width="8" height="1" fill="#f1f5f9" />
            {/* Sword */}
            <rect x="15" y="5" width="2" height="7" fill="#94a3b8" />
            <rect x="14" y="12" width="4" height="1" fill="#475569" />
            {/* Legs */}
            <rect x="7" y="15" width="2" height="3" fill="#e2e8f0" />
            <rect x="11" y="15" width="2" height="3" fill="#e2e8f0" />
          </>
        )}

        {archetype === 'orc' && (
          <>
            {/* Broad Head */}
            <rect x="5" y="2" width="10" height="7" fill="#15803d" />
            <rect x="6" y="4" width="2" height="2" fill="#facc15" />
            <rect x="12" y="4" width="2" height="2" fill="#facc15" />
            {/* Tusks */}
            <rect x="6" y="7" width="2" height="2" fill="#fefce8" />
            <rect x="12" y="7" width="2" height="2" fill="#fefce8" />
            {/* Heavy Armor Body */}
            <rect x="3" y="9" width="14" height="6" fill="#475569" />
            <rect x="5" y="10" width="10" height="4" fill="#334155" />
            {/* Mace */}
            <rect x="1" y="6" width="3" height="5" fill="#94a3b8" />
            <rect x="2" y="11" width="1" height="4" fill="#78350f" />
            {/* Boots */}
            <rect x="5" y="15" width="4" height="3" fill="#1e293b" />
            <rect x="11" y="15" width="4" height="3" fill="#1e293b" />
          </>
        )}

        {archetype === 'dragon' && (
          <>
            {/* Wings */}
            <rect x="1" y="4" width="4" height="7" fill="#991b1b" />
            <rect x="15" y="4" width="4" height="7" fill="#991b1b" />
            <rect x="2" y="3" width="2" height="2" fill="#f59e0b" />
            <rect x="16" y="3" width="2" height="2" fill="#f59e0b" />
            {/* Horns */}
            <rect x="5" y="1" width="2" height="3" fill="#fde047" />
            <rect x="13" y="1" width="2" height="3" fill="#fde047" />
            {/* Head */}
            <rect x="6" y="3" width="8" height="6" fill="#dc2626" />
            <rect x="7" y="5" width="2" height="2" fill="#fef08a" />
            <rect x="11" y="5" width="2" height="2" fill="#fef08a" />
            {/* Belly & Body */}
            <rect x="5" y="9" width="10" height="7" fill="#b91c1c" />
            <rect x="7" y="10" width="6" height="5" fill="#fbbf24" />
            {/* Claws */}
            <rect x="5" y="16" width="3" height="2" fill="#7f1d1d" />
            <rect x="12" y="16" width="3" height="2" fill="#7f1d1d" />
          </>
        )}
      </g>
    </svg>
  );
};

export type PixelIconType =
  | 'coin'
  | 'heart'
  | 'exp'
  | 'sword'
  | 'shield'
  | 'potion'
  | 'dumbbell'
  | 'swords'
  | 'shop'
  | 'sound_on'
  | 'sound_off'
  | 'crown'
  | 'lock'
  | 'check'
  | 'map';

export const PixelIcon: React.FC<{
  type: PixelIconType;
  size?: number;
  color?: string;
}> = ({ type, size = 18, color }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      className="shrink-0"
      aria-hidden="true"
    >
      {type === 'coin' && (
        <>
          <rect x="3" y="1" width="6" height="10" fill="#eab308" />
          <rect x="1" y="3" width="10" height="6" fill="#eab308" />
          <rect x="2" y="2" width="8" height="8" fill="#facc15" />
          <rect x="5" y="3" width="2" height="6" fill="#ca8a04" />
          <rect x="3" y="3" width="2" height="2" fill="#fef08a" />
        </>
      )}
      {type === 'heart' && (
        <>
          <rect x="2" y="2" width="3" height="3" fill="#ef4444" />
          <rect x="7" y="2" width="3" height="3" fill="#ef4444" />
          <rect x="1" y="3" width="10" height="4" fill="#ef4444" />
          <rect x="2" y="7" width="8" height="2" fill="#dc2626" />
          <rect x="4" y="9" width="4" height="2" fill="#dc2626" />
          <rect x="5" y="11" width="2" height="1" fill="#dc2626" />
          <rect x="2" y="3" width="2" height="1" fill="#fca5a5" />
        </>
      )}
      {type === 'exp' && (
        <>
          <rect x="5" y="1" width="2" height="10" fill="#38bdf8" />
          <rect x="1" y="5" width="10" height="2" fill="#38bdf8" />
          <rect x="3" y="3" width="6" height="6" fill="#0ea5e9" />
          <rect x="5" y="4" width="2" height="4" fill="#e0f2fe" />
        </>
      )}
      {type === 'sword' && (
        <>
          <rect x="8" y="1" width="3" height="3" fill={color || '#e2e8f0'} />
          <rect x="6" y="3" width="3" height="3" fill={color || '#cbd5e1'} />
          <rect x="4" y="5" width="3" height="3" fill={color || '#cbd5e1'} />
          <rect x="2" y="6" width="4" height="2" fill="#eab308" />
          <rect x="1" y="9" width="2" height="2" fill="#78350f" />
          <rect x="3" y="8" width="2" height="2" fill="#a16207" />
        </>
      )}
      {type === 'shield' && (
        <>
          <rect x="2" y="1" width="8" height="6" fill={color || '#94a3b8'} />
          <rect x="3" y="7" width="6" height="2" fill={color || '#64748b'} />
          <rect x="5" y="9" width="2" height="2" fill={color || '#475569'} />
          <rect x="4" y="3" width="4" height="3" fill="#e2e8f0" />
        </>
      )}
      {type === 'potion' && (
        <>
          <rect x="4" y="1" width="4" height="2" fill="#d97706" />
          <rect x="5" y="3" width="2" height="2" fill="#bae6fd" />
          <rect x="2" y="5" width="8" height="5" fill="#bae6fd" />
          <rect x="3" y="6" width="6" height="4" fill={color || '#ef4444'} />
          <rect x="3" y="10" width="6" height="1" fill="#991b1b" />
          <rect x="4" y="6" width="1" height="2" fill="#fecaca" />
        </>
      )}
      {type === 'dumbbell' && (
        <>
          <rect x="1" y="3" width="2" height="6" fill="#94a3b8" />
          <rect x="9" y="3" width="2" height="6" fill="#94a3b8" />
          <rect x="3" y="5" width="6" height="2" fill="#e2e8f0" />
          <rect x="0" y="4" width="1" height="4" fill="#facc15" />
          <rect x="11" y="4" width="1" height="4" fill="#facc15" />
        </>
      )}
      {type === 'swords' && (
        <>
          <rect x="1" y="1" width="2" height="2" fill="#e2e8f0" />
          <rect x="3" y="3" width="2" height="2" fill="#e2e8f0" />
          <rect x="5" y="5" width="2" height="2" fill="#cbd5e1" />
          <rect x="9" y="1" width="2" height="2" fill="#e2e8f0" />
          <rect x="7" y="3" width="2" height="2" fill="#e2e8f0" />
          <rect x="3" y="7" width="2" height="2" fill="#eab308" />
          <rect x="7" y="7" width="2" height="2" fill="#eab308" />
          <rect x="1" y="9" width="2" height="2" fill="#78350f" />
          <rect x="9" y="9" width="2" height="2" fill="#78350f" />
        </>
      )}
      {type === 'shop' && (
        <>
          <rect x="1" y="2" width="10" height="3" fill="#ef4444" />
          <rect x="3" y="2" width="2" height="3" fill="#fef2f2" />
          <rect x="7" y="2" width="2" height="3" fill="#fef2f2" />
          <rect x="2" y="5" width="8" height="6" fill="#d97706" />
          <rect x="4" y="7" width="4" height="4" fill="#451a03" />
        </>
      )}
      {type === 'sound_on' && (
        <>
          <rect x="2" y="4" width="2" height="4" fill="#e2e8f0" />
          <rect x="4" y="2" width="2" height="8" fill="#e2e8f0" />
          <rect x="8" y="4" width="1" height="4" fill="#38bdf8" />
          <rect x="10" y="2" width="1" height="8" fill="#38bdf8" />
        </>
      )}
      {type === 'sound_off' && (
        <>
          <rect x="2" y="4" width="2" height="4" fill="#64748b" />
          <rect x="4" y="2" width="2" height="8" fill="#64748b" />
          <rect x="8" y="4" width="1" height="1" fill="#ef4444" />
          <rect x="10" y="4" width="1" height="1" fill="#ef4444" />
          <rect x="9" y="5" width="1" height="2" fill="#ef4444" />
          <rect x="8" y="7" width="1" height="1" fill="#ef4444" />
          <rect x="10" y="7" width="1" height="1" fill="#ef4444" />
        </>
      )}
      {type === 'crown' && (
        <>
          <rect x="1" y="3" width="2" height="6" fill="#facc15" />
          <rect x="5" y="2" width="2" height="7" fill="#facc15" />
          <rect x="9" y="3" width="2" height="6" fill="#facc15" />
          <rect x="3" y="5" width="2" height="4" fill="#eab308" />
          <rect x="7" y="5" width="2" height="4" fill="#eab308" />
          <rect x="1" y="9" width="10" height="2" fill="#ca8a04" />
          <rect x="5" y="6" width="2" height="2" fill="#ef4444" />
        </>
      )}
      {type === 'lock' && (
        <>
          <rect x="4" y="2" width="4" height="1" fill="#94a3b8" />
          <rect x="3" y="3" width="1" height="2" fill="#94a3b8" />
          <rect x="8" y="3" width="1" height="2" fill="#94a3b8" />
          <rect x="2" y="5" width="8" height="6" fill="#64748b" />
          <rect x="5" y="7" width="2" height="2" fill="#0f172a" />
        </>
      )}
      {type === 'check' && (
        <>
          <rect x="9" y="2" width="2" height="2" fill="#4ade80" />
          <rect x="7" y="4" width="2" height="2" fill="#4ade80" />
          <rect x="5" y="6" width="2" height="2" fill="#4ade80" />
          <rect x="3" y="8" width="2" height="2" fill="#4ade80" />
          <rect x="1" y="6" width="2" height="2" fill="#4ade80" />
        </>
      )}
      {type === 'map' && (
        <>
          <rect x="1" y="2" width="3" height="8" fill="#fde68a" />
          <rect x="4" y="3" width="4" height="8" fill="#fcd34d" />
          <rect x="8" y="2" width="3" height="8" fill="#fde68a" />
          <rect x="2" y="4" width="2" height="2" fill="#ef4444" />
          <rect x="5" y="6" width="2" height="2" fill="#3b82f6" />
          <rect x="8" y="4" width="2" height="2" fill="#16a34a" />
        </>
      )}
    </svg>
  );
};
