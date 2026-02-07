'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Demo data for a sample 18-hole course
const DEMO_HOLES = Array.from({ length: 18 }, (_, i) => ({
  number: i + 1,
  par: [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4][i],
  yards: [380, 165, 520, 410, 390, 175, 425, 545, 405, 395, 155, 510, 400, 385, 180, 430, 530, 415][i],
  handicapIndex: [7, 15, 1, 9, 5, 17, 3, 11, 13, 8, 16, 2, 10, 6, 18, 4, 12, 14][i],
}));

function getScoreColor(strokes: number | null, par: number): string {
  if (!strokes) return '';
  const diff = strokes - par;
  if (diff <= -2) return 'bg-gold-500 text-dark-950';
  if (diff === -1) return 'bg-golf-500 text-white';
  if (diff === 0) return 'bg-dark-600 text-dark-100';
  if (diff === 1) return 'bg-orange-800/60 text-orange-200';
  return 'bg-red-900/60 text-red-200';
}

function getScoreLabel(strokes: number, par: number): string {
  const diff = strokes - par;
  if (diff <= -2) return 'Eagle!';
  if (diff === -1) return 'Birdie!';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Dbl Bogey';
  return `+${diff}`;
}

export default function ScorecardPage() {
  const params = useParams();
  const [scores, setScores] = useState<Record<number, number>>({});
  const [currentHole, setCurrentHole] = useState(1);
  const [view, setView] = useState<'input' | 'card'>('input');

  const currentHoleData = DEMO_HOLES[currentHole - 1];
  const currentScore = scores[currentHole];
  const totalStrokes = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const totalPar = Object.keys(scores).reduce((sum, h) => sum + DEMO_HOLES[parseInt(h) - 1].par, 0);
  const toPar = totalStrokes - totalPar;

  const setScore = (hole: number, strokes: number) => {
    setScores(prev => ({ ...prev, [hole]: strokes }));
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Header
        title="Scorecard"
        showBack
        backHref="/dashboard"
        rightAction={
          <button
            onClick={() => setView(view === 'input' ? 'card' : 'input')}
            className="text-dark-400 hover:text-dark-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {view === 'input' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              )}
            </svg>
          </button>
        }
      />

      {/* Score Summary Bar */}
      <div className="bg-dark-900 border-b border-dark-800 px-4 py-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs text-dark-500">THRU</span>
              <p className="text-lg font-bold font-mono text-dark-100">{Object.keys(scores).length}</p>
            </div>
            <div>
              <span className="text-xs text-dark-500">TOTAL</span>
              <p className="text-lg font-bold font-mono text-dark-100">{totalStrokes || '-'}</p>
            </div>
            <div>
              <span className="text-xs text-dark-500">TO PAR</span>
              <p className={cn(
                'text-lg font-bold font-mono',
                toPar < 0 ? 'text-golf-400' : toPar > 0 ? 'text-red-400' : 'text-dark-100'
              )}>
                {totalStrokes === 0 ? 'E' : toPar <= 0 ? toPar : `+${toPar}`}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Badge>Nassau $10</Badge>
            <Badge variant="gold">Skins $5</Badge>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto">
        {view === 'input' ? (
          /* Hole-by-hole input view */
          <div className="px-4 py-6">
            {/* Hole Navigator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => setCurrentHole(Math.max(1, currentHole - 1))}
                disabled={currentHole === 1}
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-dark-400 hover:text-dark-100 disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-center">
                <p className="text-dark-500 text-xs uppercase tracking-wider">Hole</p>
                <p className="text-5xl font-bold text-dark-50 font-mono">{currentHole}</p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="text-sm text-dark-400">Par {currentHoleData.par}</span>
                  <span className="text-sm text-dark-500">{currentHoleData.yards} yds</span>
                  <span className="text-sm text-dark-600">HCP {currentHoleData.handicapIndex}</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentHole(Math.min(18, currentHole + 1))}
                disabled={currentHole === 18}
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-dark-400 hover:text-dark-100 disabled:opacity-30"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Score Input */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setScore(currentHole, Math.max(1, (currentScore || currentHoleData.par) - 1))}
                  className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center text-dark-300 hover:bg-dark-700 active:scale-95 transition-all"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M5 12h14" />
                  </svg>
                </button>

                <div className="text-center">
                  <div className={cn(
                    'w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold font-mono transition-all duration-300',
                    currentScore
                      ? getScoreColor(currentScore, currentHoleData.par)
                      : 'bg-dark-800 border-2 border-dashed border-dark-600 text-dark-500'
                  )}>
                    {currentScore || '-'}
                  </div>
                  {currentScore && (
                    <p className={cn(
                      'text-sm font-medium mt-2 animate-fade-in',
                      currentScore - currentHoleData.par < 0 ? 'text-golf-400' :
                      currentScore - currentHoleData.par === 0 ? 'text-dark-300' : 'text-red-400'
                    )}>
                      {getScoreLabel(currentScore, currentHoleData.par)}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setScore(currentHole, (currentScore || currentHoleData.par) + 1)}
                  className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center text-dark-300 hover:bg-dark-700 active:scale-95 transition-all"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>

              {/* Quick select buttons */}
              <div className="flex gap-2 mt-4">
                {Array.from({ length: 5 }, (_, i) => currentHoleData.par - 2 + i).filter(s => s >= 1).map(strokes => (
                  <button
                    key={strokes}
                    onClick={() => setScore(currentHole, strokes)}
                    className={cn(
                      'w-12 h-12 rounded-xl font-mono font-bold text-lg transition-all active:scale-90',
                      scores[currentHole] === strokes
                        ? getScoreColor(strokes, currentHoleData.par)
                        : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                    )}
                  >
                    {strokes}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Hole Button */}
            <div className="mt-8">
              {currentScore && currentHole < 18 ? (
                <Button onClick={() => setCurrentHole(currentHole + 1)} className="w-full">
                  Next Hole →
                </Button>
              ) : currentHole === 18 && currentScore ? (
                <Button onClick={() => setView('card')} variant="gold" className="w-full">
                  View Full Scorecard
                </Button>
              ) : null}
            </div>

            {/* Hole dots */}
            <div className="flex justify-center gap-1 mt-6 flex-wrap">
              {DEMO_HOLES.map(hole => (
                <button
                  key={hole.number}
                  onClick={() => setCurrentHole(hole.number)}
                  className={cn(
                    'w-7 h-7 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all',
                    hole.number === currentHole
                      ? 'bg-golf-600 text-white ring-2 ring-golf-400 ring-offset-2 ring-offset-dark-950'
                      : scores[hole.number]
                      ? getScoreColor(scores[hole.number], hole.par)
                      : 'bg-dark-800 text-dark-500'
                  )}
                >
                  {scores[hole.number] || hole.number}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Full scorecard view */
          <div className="px-2 py-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-dark-500">
                  <th className="px-1 py-2 text-left">Hole</th>
                  {DEMO_HOLES.slice(0, 9).map(h => (
                    <th key={h.number} className="px-1 py-2 text-center w-8">{h.number}</th>
                  ))}
                  <th className="px-1 py-2 text-center font-bold">OUT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-dark-400 border-b border-dark-800">
                  <td className="px-1 py-1.5">Par</td>
                  {DEMO_HOLES.slice(0, 9).map(h => (
                    <td key={h.number} className="px-1 py-1.5 text-center">{h.par}</td>
                  ))}
                  <td className="px-1 py-1.5 text-center font-bold">
                    {DEMO_HOLES.slice(0, 9).reduce((s, h) => s + h.par, 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-1 py-1.5 text-dark-100 font-medium">You</td>
                  {DEMO_HOLES.slice(0, 9).map(h => (
                    <td key={h.number} className="px-1 py-1 text-center">
                      <button
                        onClick={() => { setCurrentHole(h.number); setView('input'); }}
                        className={cn(
                          'w-7 h-7 rounded-md font-mono font-bold inline-flex items-center justify-center text-xs',
                          scores[h.number]
                            ? getScoreColor(scores[h.number], h.par)
                            : 'text-dark-600'
                        )}
                      >
                        {scores[h.number] || '-'}
                      </button>
                    </td>
                  ))}
                  <td className="px-1 py-1.5 text-center font-mono font-bold text-dark-100">
                    {DEMO_HOLES.slice(0, 9).reduce((s, h) => s + (scores[h.number] || 0), 0) || '-'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Back 9 */}
            <table className="w-full text-xs mt-4">
              <thead>
                <tr className="text-dark-500">
                  <th className="px-1 py-2 text-left">Hole</th>
                  {DEMO_HOLES.slice(9, 18).map(h => (
                    <th key={h.number} className="px-1 py-2 text-center w-8">{h.number}</th>
                  ))}
                  <th className="px-1 py-2 text-center font-bold">IN</th>
                  <th className="px-1 py-2 text-center font-bold">TOT</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-dark-400 border-b border-dark-800">
                  <td className="px-1 py-1.5">Par</td>
                  {DEMO_HOLES.slice(9, 18).map(h => (
                    <td key={h.number} className="px-1 py-1.5 text-center">{h.par}</td>
                  ))}
                  <td className="px-1 py-1.5 text-center font-bold">
                    {DEMO_HOLES.slice(9, 18).reduce((s, h) => s + h.par, 0)}
                  </td>
                  <td className="px-1 py-1.5 text-center font-bold">
                    {DEMO_HOLES.reduce((s, h) => s + h.par, 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-1 py-1.5 text-dark-100 font-medium">You</td>
                  {DEMO_HOLES.slice(9, 18).map(h => (
                    <td key={h.number} className="px-1 py-1 text-center">
                      <button
                        onClick={() => { setCurrentHole(h.number); setView('input'); }}
                        className={cn(
                          'w-7 h-7 rounded-md font-mono font-bold inline-flex items-center justify-center text-xs',
                          scores[h.number]
                            ? getScoreColor(scores[h.number], h.par)
                            : 'text-dark-600'
                        )}
                      >
                        {scores[h.number] || '-'}
                      </button>
                    </td>
                  ))}
                  <td className="px-1 py-1.5 text-center font-mono font-bold text-dark-100">
                    {DEMO_HOLES.slice(9, 18).reduce((s, h) => s + (scores[h.number] || 0), 0) || '-'}
                  </td>
                  <td className="px-1 py-1.5 text-center font-mono font-bold text-dark-50">
                    {totalStrokes || '-'}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4 flex justify-center">
              <Button onClick={() => setView('input')} variant="secondary" size="sm">
                Back to Score Input
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
