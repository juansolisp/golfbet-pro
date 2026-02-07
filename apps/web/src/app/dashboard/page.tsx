'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-dark-50">Good Morning!</h2>
          <p className="text-dark-400 mt-1">Ready for a round?</p>
        </div>

        {/* Quick Action */}
        <Link href="/rounds/new">
          <Card className="bg-gradient-to-r from-golf-900 to-golf-800 border-golf-700 hover:border-golf-600 transition-all cursor-pointer">
            <CardContent className="flex items-center justify-between py-5">
              <div>
                <h3 className="text-lg font-semibold text-dark-50">New Round</h3>
                <p className="text-golf-300 text-sm">Set up bets and start playing</p>
              </div>
              <div className="w-12 h-12 bg-golf-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Balance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold font-mono text-golf-400">+$45.00</p>
                <p className="text-dark-500 text-sm mt-1">Net winnings this month</p>
              </div>
              <div className="text-right space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dark-400">Won</span>
                  <span className="text-sm font-mono text-golf-400">$125.00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-dark-400">Lost</span>
                  <span className="text-sm font-mono text-red-400">$80.00</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Rounds */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark-100">Active Rounds</h3>
            <Link href="/rounds" className="text-sm text-golf-400">View All</Link>
          </div>
          
          <Card className="mb-3">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-dark-50">Club Campestre</h4>
                  <p className="text-sm text-dark-400 mt-0.5">Nassau $10 + Skins $5</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>In Progress</Badge>
                    <span className="text-xs text-dark-500">Thru 12</span>
                  </div>
                </div>
                <Link href="/rounds/demo/scorecard">
                  <Button size="sm" variant="secondary">Continue</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Empty state */}
          <div className="text-center py-8 text-dark-500">
            <p className="text-sm">No other active rounds</p>
          </div>
        </div>

        {/* Recent Results */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark-100">Recent Results</h3>
          </div>
          
          <div className="space-y-3">
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-dark-100 text-sm">Valle Alto Golf Club</h4>
                    <p className="text-xs text-dark-500 mt-0.5">Feb 3, 2026 - Nassau</p>
                  </div>
                  <span className="text-lg font-mono font-bold text-golf-400">+$25</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-dark-100 text-sm">Las Misiones CC</h4>
                    <p className="text-xs text-dark-500 mt-0.5">Jan 28, 2026 - Skins</p>
                  </div>
                  <span className="text-lg font-mono font-bold text-red-400">-$15</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Pending Settlements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-dark-100">Pending Payments</h3>
          </div>
          <Card className="border-gold-500/30">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center">
                    <span className="text-gold-400 text-sm font-bold">JR</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-100">Juan owes you</p>
                    <p className="text-xs text-dark-500">From Feb 3 round</p>
                  </div>
                </div>
                <span className="text-base font-mono font-bold text-gold-400">$15.00</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
