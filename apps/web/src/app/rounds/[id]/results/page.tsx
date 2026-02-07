'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-dark-950 pb-8">
      <Header title="Round Results" showBack backHref="/dashboard" />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Celebration Header */}
        <div className="text-center">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold text-dark-50">Round Complete!</h2>
          <p className="text-dark-400 mt-1">Club Campestre - Feb 5, 2026</p>
        </div>

        {/* Final Standings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Final Standings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { pos: 1, name: 'Juan D.', initials: 'JD', gross: 78, net: 65, toPar: -3 },
              { pos: 2, name: 'Miguel G.', initials: 'MG', gross: 80, net: 67, toPar: -1 },
              { pos: 3, name: 'Carlos R.', initials: 'CR', gross: 82, net: 72, toPar: 0 },
              { pos: 4, name: 'Roberto L.', initials: 'RL', gross: 88, net: 75, toPar: +3 },
            ].map(player => (
              <div key={player.name} className="flex items-center gap-3">
                <span className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                  player.pos === 1 ? 'bg-gold-500 text-dark-950' : 'bg-dark-700 text-dark-300'
                )}>
                  {player.pos}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{player.initials}</AvatarFallback>
                </Avatar>
                <span className="flex-1 font-medium text-dark-100">{player.name}</span>
                <div className="text-right">
                  <span className="font-mono text-dark-100">{player.gross}</span>
                  <span className="text-dark-500 text-sm ml-1">({player.net} net)</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bet Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nassau Results ($10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-1 border-b border-dark-800">
              <span className="text-dark-400">Front 9</span>
              <div>
                <span className="text-dark-100 font-medium">Juan D.</span>
                <span className="text-golf-400 font-mono ml-2">+$10</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-dark-800">
              <span className="text-dark-400">Back 9</span>
              <div>
                <span className="text-dark-100 font-medium">Miguel G.</span>
                <span className="text-golf-400 font-mono ml-2">+$10</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-dark-400">Overall</span>
              <div>
                <span className="text-dark-100 font-medium">Juan D.</span>
                <span className="text-golf-400 font-mono ml-2">+$10</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skins Results ($5)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { hole: 3, winner: 'Juan D.', value: 5 },
              { hole: 8, winner: 'Carlos R.', value: 15 },
              { hole: 11, winner: 'Juan D.', value: 5 },
              { hole: 15, winner: 'Miguel G.', value: 10 },
              { hole: 18, winner: 'Juan D.', value: 10 },
            ].map(skin => (
              <div key={skin.hole} className="flex justify-between items-center py-1">
                <span className="text-dark-400">Hole {skin.hole}</span>
                <div>
                  <span className="text-dark-100">{skin.winner}</span>
                  <span className="text-golf-400 font-mono ml-2">${skin.value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Net Winnings Summary */}
        <Card className="border-golf-600/30 bg-golf-950/20">
          <CardHeader>
            <CardTitle className="text-base">Your Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-dark-400">Nassau Winnings</span>
                <span className="font-mono text-golf-400">+$20.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Skins Winnings</span>
                <span className="font-mono text-golf-400">+$20.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Nassau Losses</span>
                <span className="font-mono text-red-400">-$10.00</span>
              </div>
              <div className="border-t border-dark-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-dark-100 font-semibold">Net Total</span>
                  <span className="text-2xl font-bold font-mono text-golf-400">+$30.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settlements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settlements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8"><AvatarFallback className="text-xs">RL</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm text-dark-100">Roberto → Juan</p>
                  <p className="text-xs text-dark-500">Pending</p>
                </div>
              </div>
              <span className="font-mono text-gold-400 font-bold">$25.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8"><AvatarFallback className="text-xs">CR</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm text-dark-100">Carlos → Miguel</p>
                  <p className="text-xs text-dark-500">Pending</p>
                </div>
              </div>
              <span className="font-mono text-gold-400 font-bold">$15.00</span>
            </div>

            <Button variant="gold" className="w-full mt-2">
              Confirm Payments
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link href="/dashboard" className="flex-1">
            <Button variant="secondary" className="w-full">Back to Home</Button>
          </Link>
          <Button variant="outline" className="flex-1">Share Results</Button>
        </div>
      </main>
    </div>
  );
}
