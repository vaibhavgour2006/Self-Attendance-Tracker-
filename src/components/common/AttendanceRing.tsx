import React, { useEffect, useState, useRef } from 'react';

interface AttendanceRingProps {
  percentage: number;
  attended: number;
  eligibleTotal: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  target?: number;
}

export const AttendanceRing: React.FC<AttendanceRingProps> = ({
  percentage,
  attended,
  eligibleTotal,
  label = 'Semester attendance',
  size = 190,
  strokeWidth = 9,
  target = 75,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  // Animated progress state: starts at 0 and animates to safePercentage
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [displayNumber, setDisplayNumber] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset to 0 initially for the gradual filling animation
    setAnimatedProgress(0);
    setDisplayNumber(0);

    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth filling animation

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progressRatio, 3);
      const currentVal = easeProgress * safePercentage;

      setAnimatedProgress(currentVal);
      setDisplayNumber(Math.round(currentVal * 10) / 10);

      if (progressRatio < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedProgress(safePercentage);
        setDisplayNumber(safePercentage);
      }
    };

    // Slight delay so the initial frame mounts at 0
    const timeout = setTimeout(() => {
      animRef.current = requestAnimationFrame(animate);
    }, 60);

    return () => {
      clearTimeout(timeout);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [safePercentage]);

  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;
  const isAboveTarget = safePercentage >= target;

  const handleRetrigger = () => {
    setAnimatedProgress(0);
    setDisplayNumber(0);
    const startTime = performance.now();
    const duration = 900;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progressRatio, 3);
      const currentVal = easeProgress * safePercentage;
      setAnimatedProgress(currentVal);
      setDisplayNumber(Math.round(currentVal * 10) / 10);
      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div
      onClick={handleRetrigger}
      title="Tap to replay attendance animation"
      className="flex flex-col items-center justify-center select-none py-2 cursor-pointer group"
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg]"
        >
          {/* Subtle track background */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Accent progress arc that fills gradually from 0 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isAboveTarget ? '#7FE3C0' : '#E5A962'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke 300ms ease',
            }}
          />
        </svg>

        {/* Center Percentage with smooth count-up */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-display text-[58px] leading-none tracking-tight text-[#F2F2F0] tabular-nums">
            {displayNumber}%
          </span>
          <span className="text-[12px] uppercase tracking-widest text-[#8A8A93] font-medium mt-1">
            {label}
          </span>
        </div>
      </div>

      {/* Restrained Caption */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-[#8A8A93] group-hover:text-[#F2F2F0] transition-colors">
        <span className="font-semibold text-[#F2F2F0]">{attended}</span>
        <span>attended of</span>
        <span className="font-semibold text-[#F2F2F0]">{eligibleTotal}</span>
        <span>scheduled classes</span>
      </div>
    </div>
  );
};
