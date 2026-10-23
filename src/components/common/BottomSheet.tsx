import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md bg-[#16161A] border-t border-white/[0.09] rounded-t-[32px] p-6 pb-9 shadow-[0_-8px_32px_rgba(0,0,0,0.85)] max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-250"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 shrink-0" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5 shrink-0">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-[#F2F2F0] tracking-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#8A8A93] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8A8A93] hover:text-[#F2F2F0] hover:bg-white/[0.06] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto no-scrollbar flex-1 -mr-1 pr-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
