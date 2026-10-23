import React, { useState } from 'react';

export type TabKey = 'today' | 'calendar' | 'insights' | 'profile';

interface TabBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  // Track which tab was just clicked to trigger the animation exclusively on tap
  const [animatingTab, setAnimatingTab] = useState<TabKey | null>(null);

  const handleTabClick = (tabKey: TabKey) => {
    onTabChange(tabKey);
    setAnimatingTab(tabKey);
    // Clear animation state after it finishes so it can be re-triggered on next click
    setTimeout(() => {
      setAnimatingTab(null);
    }, 700);
  };

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none pb-safe"
    >
      <div className="w-full max-w-md px-4 pb-4 pointer-events-auto">
        <div className="bg-[#131316]/95 backdrop-blur-md border border-white/[0.08] rounded-3xl p-1.5 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          {/* TAB 1: TODAY (Clock with rotating hands on click) */}
          <button
            onClick={() => handleTabClick('today')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === 'today' ? 'text-[#7FE3C0]' : 'text-[#5A5A63] hover:text-[#8A8A93]'
            }`}
          >
            {activeTab === 'today' && (
              <span className="absolute inset-0 bg-[#7FE3C0]/10 rounded-2xl border border-[#7FE3C0]/20 -z-0" />
            )}
            <div className="relative z-10 w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Clock face */}
                <circle cx="12" cy="12" r="10" />
                {/* Rotating hands group */}
                <g
                  className={
                    animatingTab === 'today'
                      ? 'animate-clock-spin'
                      : ''
                  }
                  style={{ transformOrigin: '12px 12px' }}
                >
                  {/* Hour hand */}
                  <polyline points="12 6 12 12" />
                  {/* Minute hand */}
                  <polyline points="12 12 16 14" />
                  <circle cx="12" cy="12" r="1.2" fill="currentColor" />
                </g>
              </svg>
            </div>
            <span className="relative z-10 text-[10px] font-medium tracking-wide mt-1">
              Today
            </span>
          </button>

          {/* TAB 2: CALENDAR (Page Flip Animation on click) */}
          <button
            onClick={() => handleTabClick('calendar')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === 'calendar' ? 'text-[#7FE3C0]' : 'text-[#5A5A63] hover:text-[#8A8A93]'
            }`}
          >
            {activeTab === 'calendar' && (
              <span className="absolute inset-0 bg-[#7FE3C0]/10 rounded-2xl border border-[#7FE3C0]/20 -z-0" />
            )}
            <div className="relative z-10 w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={animatingTab === 'calendar' ? 'animate-calendar-flip' : ''}
              >
                {/* Outer frame */}
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                {/* Binder rings */}
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                {/* Divider */}
                <line x1="3" y1="10" x2="21" y2="10" />
                {/* Calendar grid dots */}
                <circle cx="8" cy="14" r="1" fill="currentColor" />
                <circle cx="12" cy="14" r="1" fill="currentColor" />
                <circle cx="16" cy="14" r="1" fill="currentColor" />
                <circle cx="8" cy="18" r="1" fill="currentColor" />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </div>
            <span className="relative z-10 text-[10px] font-medium tracking-wide mt-1">
              Calendar
            </span>
          </button>

          {/* TAB 3: INSIGHTS (Bars wave up and down on click) */}
          <button
            onClick={() => handleTabClick('insights')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === 'insights' ? 'text-[#7FE3C0]' : 'text-[#5A5A63] hover:text-[#8A8A93]'
            }`}
          >
            {activeTab === 'insights' && (
              <span className="absolute inset-0 bg-[#7FE3C0]/10 rounded-2xl border border-[#7FE3C0]/20 -z-0" />
            )}
            <div className="relative z-10 w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Left Bar */}
                <line
                  x1="6"
                  y1="20"
                  x2="6"
                  y2="14"
                  className={animatingTab === 'insights' ? 'animate-bar-left' : ''}
                  style={{ transformOrigin: '6px 20px' }}
                />
                {/* Center Bar */}
                <line
                  x1="12"
                  y1="20"
                  x2="12"
                  y2="4"
                  className={animatingTab === 'insights' ? 'animate-bar-center' : ''}
                  style={{ transformOrigin: '12px 20px' }}
                />
                {/* Right Bar */}
                <line
                  x1="18"
                  y1="20"
                  x2="18"
                  y2="10"
                  className={animatingTab === 'insights' ? 'animate-bar-right' : ''}
                  style={{ transformOrigin: '18px 20px' }}
                />
              </svg>
            </div>
            <span className="relative z-10 text-[10px] font-medium tracking-wide mt-1">
              Insights
            </span>
          </button>

          {/* TAB 4: PROFILE (Person pops up with tick popping up on click) */}
          <button
            onClick={() => handleTabClick('profile')}
            className={`relative flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              activeTab === 'profile' ? 'text-[#7FE3C0]' : 'text-[#5A5A63] hover:text-[#8A8A93]'
            }`}
          >
            {activeTab === 'profile' && (
              <span className="absolute inset-0 bg-[#7FE3C0]/10 rounded-2xl border border-[#7FE3C0]/20 -z-0" />
            )}
            <div className="relative z-10 w-5 h-5 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* User body silhouette (Pops up) */}
                <g
                  className={animatingTab === 'profile' ? 'animate-user-pop' : ''}
                  style={{ transformOrigin: '9px 12px' }}
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </g>
                {/* Checkmark tick (Pops & bounces) */}
                <polyline
                  points="16 11 18 13 22 9"
                  className={animatingTab === 'profile' ? 'animate-tick-pop' : ''}
                  style={{ transformOrigin: '19px 11px' }}
                />
              </svg>
            </div>
            <span className="relative z-10 text-[10px] font-medium tracking-wide mt-1">
              Profile
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
