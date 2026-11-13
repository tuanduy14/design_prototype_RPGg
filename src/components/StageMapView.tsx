import React, { useEffect, useRef } from 'react';
import { CAMPAIGN_STAGES, StageDefinition, TOTAL_STAGES } from '../data/gameData';
import { MonsterSprite, PixelIcon } from './PixelSprites';

interface StageMapViewProps {
  maxUnlockedStage: number;
  clearedStages: number[];
  selectedStage: number;
  onSelectStage: (stage: number) => void;
  onStartBattle: (stage: number) => void;
}

// 10 stages spaced generously across a tall 180x580 pixel-grid map (bottom Stage 1 -> top Stage 10)
const STAGE_COORDS: Record<number, { x: number; y: number }> = {
  1: { x: 126, y: 534 },
  2: { x: 65, y: 482 },
  3: { x: 42, y: 428 },
  4: { x: 112, y: 374 },
  5: { x: 122, y: 306 },
  6: { x: 54, y: 252 },
  7: { x: 46, y: 198 },
  8: { x: 124, y: 146 },
  9: { x: 102, y: 94 },
  10: { x: 84, y: 44 },
};

// Build stepped pixel-art road segments connecting Stage 1 -> Stage 10
function buildPixelRoadSegments(): { x: number; y: number; w: number; h: number }[] {
  const segs: { x: number; y: number; w: number; h: number }[] = [];
  const w = 14;
  const half = w / 2;

  // Entry path at bottom below Stage 1
  segs.push({ x: 126 - half, y: 534, w, h: 46 });

  for (let i = 1; i < TOTAL_STAGES; i++) {
    const a = STAGE_COORDS[i];
    const b = STAGE_COORDS[i + 1];
    const midY = Math.round((a.y + b.y) / 2);

    // Vertical from a.y up to midY
    segs.push({
      x: a.x - half,
      y: Math.min(a.y, midY) - half,
      w,
      h: Math.abs(a.y - midY) + w,
    });
    // Horizontal from a.x to b.x at midY
    segs.push({
      x: Math.min(a.x, b.x) - half,
      y: midY - half,
      w: Math.abs(b.x - a.x) + w,
      h: w,
    });
    // Vertical from midY up to b.y
    segs.push({
      x: b.x - half,
      y: Math.min(midY, b.y) - half,
      w,
      h: Math.abs(midY - b.y) + w,
    });
  }
  return segs;
}

const ROAD_SEGMENTS = buildPixelRoadSegments();

const PIXEL_TREES = [
  { x: 14, y: 518 },
  { x: 26, y: 492 },
  { x: 148, y: 464 },
  { x: 158, y: 432 },
  { x: 12, y: 382 },
  { x: 152, y: 368 },
  { x: 16, y: 296 },
  { x: 156, y: 274 },
  { x: 148, y: 210 },
  { x: 14, y: 150 },
];

export const StageMapView: React.FC<StageMapViewProps> = ({
  maxUnlockedStage,
  clearedStages,
  selectedStage,
  onSelectStage,
  onStartBattle,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const selectedDef: StageDefinition =
    CAMPAIGN_STAGES.find((s) => s.stage === selectedStage) || CAMPAIGN_STAGES[0];

  // Scroll smoothly to selected/current stage when opening the map
  useEffect(() => {
    const el = nodeRefs.current[selectedStage];
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }, []);

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden bg-[#141824]">
      {/* Compact Pixel Map Header */}
      <div className="relative z-20 flex shrink-0 items-center justify-between border-b-[3px] border-[#090c14] bg-[#161c2c] px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <PixelIcon type="map" size={16} />
          <span className="font-pixel text-xs font-bold text-amber-300">
            BẢN ĐỒ 10 VÁN (VUỐT LÊN XEM)
          </span>
        </div>
        <span className="border border-[#090c14] bg-[#0d111c] px-2 py-0.5 font-pixel text-xs font-bold text-emerald-300 tabular-nums">
          {clearedStages.length}/{TOTAL_STAGES}
        </span>
      </div>

      {/* Vertically Scrollable Tall Pixel World Map */}
      <div
        ref={scrollContainerRef}
        className="pixel-scroll relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#18261e]"
      >
        <div className="relative w-full" style={{ height: '1120px' }}>
          {/* Crisp 16-bit Pixel Art World Canvas */}
          <svg
            viewBox="0 0 180 580"
            preserveAspectRatio="none"
            shapeRendering="crispEdges"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Biome 1 (Bottom): Dark Moss Forest (y: 336 -> 580) */}
            <rect x="0" y="336" width="180" height="244" fill="#1b3022" />
            <rect x="12" y="360" width="44" height="32" fill="#213b29" />
            <rect x="118" y="420" width="50" height="44" fill="#213b29" />
            <rect x="20" y="490" width="68" height="40" fill="#213b29" />
            <rect x="96" y="510" width="70" height="50" fill="#16281c" />

            {/* Biome 2 (Middle): Shadow Moor & Ruin Stones (y: 132 -> 336) */}
            <rect x="0" y="132" width="180" height="204" fill="#1c2233" />
            <rect x="16" y="160" width="52" height="36" fill="#232b40" />
            <rect x="108" y="216" width="56" height="40" fill="#232b40" />
            <rect x="24" y="274" width="60" height="36" fill="#252938" />
            {/* Biome transition step pixels */}
            <rect x="0" y="332" width="180" height="6" fill="#141926" />

            {/* Biome 3 (Top): Obsidian Lava Citadel (y: 0 -> 132) */}
            <rect x="0" y="0" width="180" height="132" fill="#23141c" />
            <rect x="12" y="20" width="48" height="38" fill="#2d1924" />
            <rect x="116" y="44" width="50" height="46" fill="#2d1924" />
            {/* Glowing Pixel Lava Cracks near Boss 10 */}
            <rect x="14" y="72" width="18" height="3" fill="#dc2626" />
            <rect x="28" y="75" width="12" height="2" fill="#f97316" />
            <rect x="136" y="32" width="22" height="3" fill="#dc2626" />
            <rect x="144" y="35" width="10" height="2" fill="#facc15" />
            <rect x="18" y="26" width="14" height="3" fill="#b91c1c" />

            {/* Pixel River Crossing (y ~ 334, between Stage 4 and Stage 5) */}
            <rect x="0" y="330" width="180" height="18" fill="#102945" />
            <rect x="0" y="332" width="180" height="14" fill="#1d4f82" />
            <rect x="10" y="336" width="18" height="2" fill="#60a5fa" />
            <rect x="46" y="340" width="22" height="2" fill="#60a5fa" />
            <rect x="138" y="335" width="26" height="2" fill="#60a5fa" />

            {/* Stepped Pixel Road Border */}
            {ROAD_SEGMENTS.map((s, idx) => (
              <rect
                key={`b-${idx}`}
                x={s.x - 2}
                y={s.y - 2}
                width={s.w + 4}
                height={s.h + 4}
                fill="#0d0f17"
              />
            ))}
            {/* Stepped Pixel Road Fill */}
            {ROAD_SEGMENTS.map((s, idx) => (
              <rect
                key={`f-${idx}`}
                x={s.x}
                y={s.y}
                width={s.w}
                height={s.h}
                fill={s.y < 140 ? '#524048' : s.y < 336 ? '#49526b' : '#7a5d3b'}
              />
            ))}
            {/* Road Pixel Cobblestone Speckles */}
            {Object.values(STAGE_COORDS).map((pt, idx) => (
              <g key={`cob-${idx}`}>
                <rect x={pt.x - 3} y={pt.y + 12} width="3" height="2" fill="#2d2622" opacity="0.45" />
                <rect x={pt.x + 2} y={pt.y - 14} width="3" height="2" fill="#ffffff" opacity="0.15" />
              </g>
            ))}

            {/* Pixel Wooden Bridge over River at x=112..126, y=328..350 */}
            <rect x="109" y="328" width="24" height="22" fill="#451a03" />
            <rect x="111" y="330" width="20" height="18" fill="#92400e" />
            <rect x="111" y="334" width="20" height="1" fill="#451a03" />
            <rect x="111" y="339" width="20" height="1" fill="#451a03" />
            <rect x="111" y="344" width="20" height="1" fill="#451a03" />
            <rect x="109" y="328" width="2" height="22" fill="#d97706" />
            <rect x="131" y="328" width="2" height="22" fill="#d97706" />

            {/* Pixel Village Inn next to Stage 1 */}
            <g transform="translate(144, 514)">
              <rect x="2" y="10" width="22" height="14" fill="#d6c4a3" />
              <rect x="0" y="6" width="26" height="5" fill="#b45309" />
              <rect x="4" y="2" width="18" height="4" fill="#d97706" />
              <rect x="10" y="15" width="6" height="9" fill="#5c3a21" />
              <rect x="4" y="14" width="4" height="4" fill="#facc15" />
            </g>

            {/* Pixel Orc Warlord Outpost Banner next to Stage 5 (BOSS) */}
            <g transform="translate(148, 286)">
              <rect x="0" y="4" width="3" height="24" fill="#451a03" />
              <rect x="3" y="5" width="14" height="10" fill="#dc2626" />
              <rect x="6" y="8" width="6" height="4" fill="#fef08a" />
            </g>

            {/* Pixel Dragon Obsidian Gate at top above Stage 10 (BOSS 10) */}
            <g transform="translate(64, 4)">
              <rect x="0" y="8" width="40" height="18" fill="#1e293b" />
              <rect x="-2" y="4" width="8" height="10" fill="#334155" />
              <rect x="16" y="0" width="8" height="10" fill="#334155" />
              <rect x="34" y="4" width="8" height="10" fill="#334155" />
              <rect x="14" y="14" width="12" height="12" fill="#090c14" />
              <rect x="18" y="5" width="4" height="4" fill="#ef4444" />
            </g>

            {/* Pixel Pine Trees */}
            {PIXEL_TREES.map((t, idx) => (
              <g key={`tree-${idx}`} transform={`translate(${t.x}, ${t.y})`}>
                <rect x="5" y="14" width="4" height="5" fill="#451a03" />
                <rect x="1" y="10" width="12" height="4" fill="#14532d" />
                <rect x="2" y="6" width="10" height="4" fill="#166534" />
                <rect x="4" y="2" width="6" height="4" fill="#15803d" />
                <rect x="6" y="0" width="2" height="2" fill="#22c55e" />
              </g>
            ))}

            {/* Pixel Tombstones / Ruins in Biome 2 */}
            <g transform="translate(88, 192)">
              <rect x="0" y="2" width="10" height="12" fill="#475569" />
              <rect x="2" y="0" width="6" height="2" fill="#64748b" />
              <rect x="4" y="4" width="2" height="6" fill="#1e293b" />
              <rect x="2" y="6" width="6" height="2" fill="#1e293b" />
            </g>
            <g transform="translate(148, 166)">
              <rect x="0" y="4" width="12" height="10" fill="#334155" />
              <rect x="2" y="2" width="8" height="2" fill="#475569" />
            </g>
          </svg>

          {/* Interactive Pixel Stage Nodes */}
          {CAMPAIGN_STAGES.map((st) => {
            const coord = STAGE_COORDS[st.stage];
            const xPct = (coord.x / 180) * 100;
            const yPct = (coord.y / 580) * 100;
            const isUnlocked = st.stage <= maxUnlockedStage;
            const isCleared = clearedStages.includes(st.stage);
            const isSelected = st.stage === selectedStage;
            const isBoss = st.isBoss;

            return (
              <button
                key={st.stage}
                ref={(el) => {
                  nodeRefs.current[st.stage] = el;
                }}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectStage(st.stage)}
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                }}
                aria-label={
                  isBoss
                    ? `Ván ${st.stage} Boss: ${st.name}`
                    : `Ván ${st.stage}: ${st.name}`
                }
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none ${
                  isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                } ${isSelected ? 'z-20' : ''}`}
              >
                {/* Boss Label above Boss nodes */}
                {isBoss && (
                  <div className="pointer-events-none absolute -top-6 left-1/2 flex -translate-x-1/2 items-center gap-1 border-2 border-[#090c14] bg-rose-600 px-1.5 py-0.5 shadow-[0_2px_0_#090c14]">
                    <PixelIcon type="crown" size={11} />
                    <span className="font-pixel text-[10px] font-bold leading-none text-white">
                      BOSS
                    </span>
                  </div>
                )}

                {/* Pixel Square Node Frame */}
                <div
                  className={`relative flex items-center justify-center border-[3px] transition-transform ${
                    isBoss ? 'h-12 w-12' : 'h-11 w-11'
                  } ${
                    !isUnlocked
                      ? 'border-[#090c14] bg-[#2a3142] text-slate-400 shadow-[0_4px_0_#090c14]'
                      : isSelected
                      ? isBoss
                        ? 'scale-110 border-amber-300 bg-rose-600 text-white shadow-[0_0_0_3px_#090c14,0_5px_0_#090c14]'
                        : 'scale-110 border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_0_3px_#090c14,0_5px_0_#090c14]'
                      : isCleared
                      ? 'border-[#090c14] bg-emerald-600 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.25),0_4px_0_#090c14]'
                      : isBoss
                      ? 'border-[#090c14] bg-rose-700 text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.25),0_4px_0_#090c14]'
                      : 'border-[#090c14] bg-[#2c3859] text-amber-200 shadow-[inset_0_2px_0_rgba(255,255,255,0.2),0_4px_0_#090c14]'
                  }`}
                >
                  <span
                    className={`font-pixel font-bold tabular-nums ${
                      isBoss ? 'text-lg' : 'text-base'
                    }`}
                  >
                    {st.stage}
                  </span>

                  {/* Cleared corner badge */}
                  {isCleared && (
                    <span className="absolute -right-1.5 -bottom-1.5 flex h-4 w-4 items-center justify-center border border-[#090c14] bg-emerald-400">
                      <PixelIcon type="check" size={10} />
                    </span>
                  )}

                  {/* Lock corner badge */}
                  {!isUnlocked && (
                    <span className="absolute -right-1.5 -bottom-1.5 flex h-4 w-4 items-center justify-center border border-[#090c14] bg-slate-800">
                      <PixelIcon type="lock" size={9} />
                    </span>
                  )}
                </div>

                {/* Stage Name Plate below Node */}
                <div
                  className={`mt-1 whitespace-nowrap border border-[#090c14] px-1.5 py-0.5 text-center font-pixel text-[10px] font-bold shadow-[0_2px_0_#090c14] ${
                    isSelected
                      ? 'bg-amber-300 text-slate-950'
                      : isBoss
                      ? 'bg-[#2c1520] text-rose-200'
                      : 'bg-[#101422]/90 text-slate-200'
                  }`}
                >
                  {isBoss ? `BOSS: ${st.name}` : `Ván ${st.stage}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Footer Bar & CHIẾN ĐẤU CTA */}
      <div
        className={`relative z-20 shrink-0 border-t-[3px] border-[#090c14] px-3 py-2 ${
          selectedDef.isBoss ? 'bg-[#2c1520]' : 'bg-[#161c2c]'
        }`}
      >
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#090c14] bg-[#0d111c]">
              <MonsterSprite archetype={selectedDef.archetype} size={38} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                {selectedDef.isBoss && (
                  <span className="bg-rose-600 px-1.5 py-0.5 font-pixel text-[10px] font-bold text-white">
                    BOSS
                  </span>
                )}
                <span className="truncate font-pixel text-sm font-bold text-slate-100">
                  Ván {selectedDef.stage}: {selectedDef.name}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 tabular-nums">
                HP {selectedDef.maxHp} · ATK {selectedDef.atk} · +{selectedDef.goldReward}G · +{selectedDef.expReward} EXP
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onStartBattle(selectedDef.stage)}
            className={`pixel-btn shrink-0 px-3.5 py-2.5 font-pixel text-sm font-bold whitespace-nowrap ${
              selectedDef.isBoss
                ? 'bg-rose-500 text-white'
                : 'bg-amber-500 text-slate-950'
            }`}
          >
            CHIẾN ĐẤU
          </button>
        </div>
      </div>
    </div>
  );
};
