import React from 'react';
import { PixelIcon, PixelIconType } from './PixelSprites';

export type ActiveTab = 'training' | 'combat' | 'shop';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  locked?: boolean;
}

const TABS: { id: ActiveTab; label: string; icon: PixelIconType }[] = [
  { id: 'training', label: 'Tập luyện', icon: 'dumbbell' },
  { id: 'combat', label: 'Chiến đấu', icon: 'swords' },
  { id: 'shop', label: 'Cửa hàng', icon: 'shop' },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  locked = false,
}) => {
  return (
    <nav
      aria-label="Điều hướng chính"
      className="grid shrink-0 grid-cols-3 border-t-[3px] border-[#090c14] bg-[#131826]"
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={locked && !isActive}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 px-2 py-2 transition-colors ${
              isActive
                ? 'bg-[#252f4a] text-amber-300 shadow-[inset_0_3px_0_#facc15]'
                : 'bg-[#131826] text-slate-400 hover:bg-[#1c2338] hover:text-slate-200'
            } ${locked && !isActive ? 'cursor-not-allowed opacity-45' : ''}`}
          >
            <PixelIcon type={tab.icon} size={18} />
            <span className="whitespace-nowrap font-pixel text-xs font-bold tracking-wide">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
