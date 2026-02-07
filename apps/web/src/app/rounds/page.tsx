'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const DEMO_ROUNDS = [
  { id: '1', course: 'Club Campestre', date: 'Today', status: 'IN_PROGRESS', bets: ['Nassau $10', 'Skins $5'], thru: 14, toPar: -2 },
  { id: '2', course: 'Valle Alto Golf Club', date: 'Feb 3', status: 'COMPLETED', bets: ['Nassau $10'], toPar: +1, result: '+$25' },
  { id: '3', course: 'Las Misiones CC', date: 'Jan 28', status: 'COMPLETED', bets: ['Skins $5'], toPar: -1, result: '-$15' },
  { id: '4', course: 'El Bosque CC', date: 'Jan 20', status: 'COMPLETED', bets: ['Match Play $20'], toPar: +3, result: '-$20' },
  { id: '5', course: 'Club Campestre', date: 'Jan 15', status: 'COMPLETED', bets: ['Nassau $10', 'Skins $5'], toPar: 0, result: '+$35' },
];

export default function RoundsPage() {
  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <Header title="My Rounds" />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {DEMO_ROUNDS.map(round => (
          <Link key={round.id} href={`/rounds/${round.id}/${round.status === 'IN_PROGRESS' ? 'scorecard' : 'results'}`}>
            <Card className="hover:border-dark-600 transition-all mb-3">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-dark-100">{round.course}</h3>
                    <p className="text-xs text-dark-500 mt-0.5">{round.date}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={round.status === 'IN_PROGRESS' ? 'default' : 'secondary'}>
                        {round.status === 'IN_PROGRESS' ? `Thru ${round.thru}` : 'Completed'}
                      </Badge>
                      {round.bets.map(bet => (
                        <span key={bet} className="text-xs text-dark-500">{bet}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    {round.result && (
                      <span className={`text-lg font-mono font-bold ${
                        round.result.startsWith('+') ? 'text-golf-400' : 'text-red-400'
                      }`}>
                        {round.result}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </main>

      <BottomNav />
    </div>
  );
}
