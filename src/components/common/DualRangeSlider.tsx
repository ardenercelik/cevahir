import React from 'react';
import { cn } from '@/lib/utils';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step: number;
  valueMin: number;
  valueMax: number;
  onChange: (newMin: number, newMax: number) => void;
  className?: string;
}

export function DualRangeSlider({
  min,
  max,
  step,
  valueMin,
  valueMax,
  onChange,
  className,
}: DualRangeSliderProps) {
  const safeMin = Math.max(min, Math.min(valueMin, valueMax));
  const safeMax = Math.min(max, Math.max(valueMax, valueMin));

  const range = max - min || 1;
  const leftPercent = Math.max(0, Math.min(100, ((safeMin - min) / range) * 100));
  const rightPercent = Math.max(0, Math.min(100, 100 - ((safeMax - min) / range) * 100));

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = Math.min(Number(e.target.value), safeMax);
    onChange(nextMin, safeMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = Math.max(Number(e.target.value), safeMin);
    onChange(safeMin, nextMax);
  };

  return (
    <div className={cn('relative w-full h-6 flex items-center select-none', className)}>
      {/* Background Track */}
      <div className="relative w-full h-2 bg-surface-container rounded-full">
        {/* Active Range Fill */}
        <div
          className="absolute h-full bg-primary-container rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
          }}
        />
      </div>

      {/* Min Thumb Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeMin}
        onChange={handleMinChange}
        aria-label="Minimum değer"
        className="dual-range-input absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none z-20"
      />

      {/* Max Thumb Input */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeMax}
        onChange={handleMaxChange}
        aria-label="Maksimum değer"
        className="dual-range-input absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none z-30"
      />
    </div>
  );
}
