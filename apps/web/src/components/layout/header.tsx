'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({ title, showBack, backHref, rightAction, className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-40 bg-dark-950/95 backdrop-blur-xl border-b border-dark-800 safe-top', className)}>
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="w-10">
          {showBack && (
            <Link href={backHref || '/dashboard'} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl hover:bg-dark-800 transition-colors">
              <svg className="w-6 h-6 text-dark-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          )}
        </div>
        
        {title ? (
          <h1 className="text-lg font-semibold text-dark-50">{title}</h1>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">&#9971;</span>
            <span className="text-lg font-bold text-dark-50">GolfBet <span className="text-golf-400">Pro</span></span>
          </Link>
        )}
        
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  );
}
