'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { getScoreClass } from '@/lib/utils';

interface ScoreInputProps {
  par: number;
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function ScoreInput({ par, value, onChange, disabled }: ScoreInputProps) {
  const [localValue, setLocalValue] = useState(value);
  
  const handleIncrement = () => {
    const newValue = (localValue || par) + 1;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, (localValue || par) - 1);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleTap = () => {
    if (!localValue) {
      setLocalValue(par);
      onChange(par);
    }
  };

  const displayValue = localValue || value;
  const scoreClass = displayValue ? getScoreClass(displayValue, par) : '';

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleDecrement}
        disabled={disabled || !displayValue || displayValue <= 1}
        className="w-10 h-8 flex items-center justify-center text-dark-400 hover:text-dark-100 disabled:opacity-30 transition-colors"
        aria-label="Decrease score"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      
      <button
        onClick={handleTap}
        disabled={disabled}
        className={cn(
          'w-12 h-12 flex items-center justify-center text-lg font-mono font-bold rounded-xl transition-all duration-200',
          displayValue ? scoreClass : 'bg-dark-800 text-dark-500 border-2 border-dashed border-dark-600',
          'active:scale-90'
        )}
      >
        {displayValue || '-'}
      </button>
      
      <button
        onClick={handleIncrement}
        disabled={disabled}
        className="w-10 h-8 flex items-center justify-center text-dark-400 hover:text-dark-100 disabled:opacity-30 transition-colors"
        aria-label="Increase score"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
