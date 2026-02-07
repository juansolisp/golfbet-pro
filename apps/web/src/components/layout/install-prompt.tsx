'use client';

import React, { useState, useEffect } from 'react';
import { canInstall, promptInstall, isStandalone } from '@/lib/pwa';
import { Button } from '@/components/ui/button';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isStandalone()) return;
    
    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Show prompt after a delay (after second visit or first round)
    const visits = parseInt(localStorage.getItem('golfbet-visits') || '0');
    localStorage.setItem('golfbet-visits', String(visits + 1));

    if (visits >= 1) {
      const dismissed = localStorage.getItem('golfbet-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    const installed = await promptInstall();
    if (installed) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('golfbet-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-dark-800 border border-dark-600 rounded-2xl p-4 shadow-2xl shadow-black/40 max-w-lg mx-auto">
        {showIOSGuide ? (
          <div className="space-y-3">
            <h3 className="font-semibold text-dark-50">Install on iOS</h3>
            <ol className="text-sm text-dark-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-dark-700 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
                <span>Tap the <strong>Share</strong> button in Safari's toolbar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-dark-700 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-dark-700 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
                <span>Tap <strong>"Add"</strong> to install</span>
              </li>
            </ol>
            <Button variant="secondary" size="sm" onClick={handleDismiss} className="w-full">
              Got it
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-golf-600 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-lg">&#9971;</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-dark-50 text-sm">Install GolfBet Pro</h3>
              <p className="text-xs text-dark-400">Add to home screen for the best experience</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="ghost" onClick={handleDismiss}>Later</Button>
              <Button size="sm" onClick={handleInstall}>Install</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
