import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, Sparkles, Navigation } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';
import { askCampusGuide, CampusGuideResponse } from '../../services/geminiMaps';

interface CampusExplorerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  userCoords?: { latitude: number; longitude: number };
}

export const CampusExplorerSheet: React.FC<CampusExplorerSheetProps> = ({
  isOpen,
  onClose,
  userCoords,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [guideData, setGuideData] = useState<CampusGuideResponse | null>(null);

  const predefinedQueries = [
    'Academic blocks and lecture halls at IET DAVV',
    'Computer Center & High Performance lab location',
    'Student canteen and food spots near Khandwa Road',
    'Central Library facilities & quiet reading zones',
  ];

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const data = await askCampusGuide(searchQuery, userCoords);
      setGuideData(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="IET DAVV Campus & Vicinity Guide"
      subtitle="Maps Grounding powered by Gemini 3.8 Flash"
    >
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search campus blocks, labs, food spots..."
            className="w-full pl-10 pr-20 py-3 rounded-2xl bg-[#131316] border border-white/[0.08] text-sm text-[#F2F2F0] placeholder-[#5A5A63] focus:outline-none focus:border-[#7FE3C0]/50"
          />
          <MapPin
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7FE3C0]"
          />
          <button
            onClick={() => handleSearch(query)}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#7FE3C0] text-[#0A0A0C] font-semibold text-xs disabled:opacity-40"
          >
            {loading ? 'Searching...' : 'Explore'}
          </button>
        </div>

        {/* Quick query chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {predefinedQueries.map((pq) => (
            <button
              key={pq}
              onClick={() => {
                setQuery(pq);
                handleSearch(pq);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#8A8A93] hover:text-[#F2F2F0] border border-white/[0.05] whitespace-nowrap transition-colors"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-8 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-[#7FE3C0] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#8A8A93]">
              Retrieving live Google Maps data for IET DAVV Indore...
            </p>
          </div>
        )}

        {/* Results */}
        {guideData && !loading && (
          <div className="space-y-3.5">
            <div className="card-inset rounded-2xl p-4 text-xs text-[#F2F2F0] leading-relaxed whitespace-pre-line border border-white/[0.06]">
              {guideData.text}
            </div>

            {/* Verified Google Maps Links (Mandatory for Maps Grounding) */}
            {guideData.mapLinks && guideData.mapLinks.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8A93] block mb-2 px-1">
                  Verified Google Maps Locations:
                </span>
                <div className="space-y-1.5">
                  {guideData.mapLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#1A1A1F] hover:bg-[#222228] border border-white/[0.06] text-xs text-[#7FE3C0] group transition-colors"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Navigation size={13} className="shrink-0" />
                        <span className="truncate">{link.title}</span>
                      </span>
                      <ExternalLink size={12} className="shrink-0 text-[#8A8A93] group-hover:text-[#7FE3C0]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </BottomSheet>
  );
};
