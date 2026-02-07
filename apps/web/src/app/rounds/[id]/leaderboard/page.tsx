'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DEMO_LEADERBOARD = [
  { name: 'Juan D.', initials: 'JD', thru: 14, total: 58, toPar: -2, netTotal: 55, avatar: null },
  { name: 'Miguel G.', initials: 'MG', thru: 14, total: 60, toPar: 0, netTotal: 56, avatar: null },
  { name: 'Carlos R.', initials: 'CR', thru: 13, total: 57, toPar: 1, netTotal: 57, avatar: null },
  { name: 'Roberto L.', initials: 'RL', thru: 14, total: 63, toPar: 3, netTotal: 58, avatar: null },
];

const DEMO_NASSAU_STATE = {
  frontNine: { leader: 'Juan D.', margin: 2 },
  backNine: { leader: 'Miguel G.', margin: 1 },
  overall: { leader: 'Juan D.', margin: 1 },
};

const DEMO_SKINS = [
  { hole: 3, winner: 'Juan D.', value: 5 },
  { hole: 7, winner: null, value: 10 },
  { hole: 8, winner: 'Carlos R.', value: 15 },
  { hole: 11, winner: 'Juan D.', value: 5 },
  { hole: 13, winner: null, value: 10 },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Header title="Leaderboard" showBack backHref="/dashboard" />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Live Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-golf-400 animate-pulse" />
          <span className="text-sm text-golf-400 font-medium">Live</span>
        </div>

        {/* Leaderboard */}
        <div className="space-y-2">
          {DEMO_LEADERBOARD.map((player, index) => (
            <Card key={player.name} className={cn(
              'transition-all',
              index === 0 && 'border-golf-600/50 bg-golf-950/30'
            )}>
              <CardContent className="py-3">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                    index === 0 ? 'bg-gold-500 text-dark-950' :
                    index === 1 ? 'bg-dark-400 text-dark-950' :
                    index === 2 ? 'bg-orange-700 text-dark-950' :
                    'bg-dark-700 text-dark-300'
                  )}>
                    {index + 1}
                  </span>
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="text-xs">{player.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-dark-100 text-sm">{player.name}</p>
                    <p className="text-xs text-dark-500">Thru {player.thru}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'text-lg font-bold font-mono',
                      player.toPar < 0 ? 'text-golf-400' : player.toPar > 0 ? 'text-red-400' : 'text-dark-100'
                    )}>
                      {player.toPar === 0 ? 'E' : player.toPar > 0 ? `+${player.toPar}` : player.toPar}
                    </p>
                    <p className="text-xs text-dark-500 font-mono">{player.total} ({player.netTotal} net)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nassau State */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-dark-100">Nassau $10</h3>
              <Badge>Active</Badge>
            </div>
            <div className="space-y-2">
              {Object.entries(DEMO_NASSAU_STATE).map(([key, state]) => (
                <div key={key} className="flex items-center justify-between py-1">
                  <span className="text-sm text-dark-400 capitalize">
                    {key === 'frontNine' ? 'Front 9' : key === 'backNine' ? 'Back 9' : 'Overall'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-dark-100">{state.leader}</span>
                    <Badge variant="secondary">{state.margin} UP</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skins Tracker */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-dark-100">Skins $5</h3>
              <span className="text-sm font-mono text-gold-400">Pot: $10 carry</span>
            </div>
            <div className="space-y-2">
              {DEMO_SKINS.map((skin) => (
                <div key={skin.hole} className="flex items-center justify-between py-1">
                  <span className="text-sm text-dark-400">Hole {skin.hole}</span>
                  <div className="flex items-center gap-2">
                    {skin.winner ? (
                      <>
                        <span className="text-sm text-dark-100">{skin.winner}</span>
                        <span className="text-sm font-mono text-golf-400">${skin.value}</span>
                      </>
                    ) : (
                      <Badge variant="gold">Carry ${skin.value}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
