'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <Header title="Profile" />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 mb-3">
            <AvatarFallback className="text-2xl">JD</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-dark-50">Juan Dominguez</h2>
          <p className="text-dark-400 text-sm">juan@example.com</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="gold">Pro</Badge>
            <Badge>HCP 15.4</Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-bold font-mono text-dark-50">42</p>
              <p className="text-xs text-dark-500 mt-1">Rounds</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-bold font-mono text-golf-400">+$245</p>
              <p className="text-xs text-dark-500 mt-1">Net Balance</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-bold font-mono text-dark-50">82.3</p>
              <p className="text-xs text-dark-500 mt-1">Avg Score</p>
            </CardContent>
          </Card>
        </div>

        {/* Scoring Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scoring Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Eagles', count: 2, color: 'bg-gold-500' },
              { label: 'Birdies', count: 48, color: 'bg-golf-500' },
              { label: 'Pars', count: 312, color: 'bg-dark-500' },
              { label: 'Bogeys', count: 246, color: 'bg-dark-600' },
              { label: 'Double+', count: 148, color: 'bg-red-600' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <span className="text-sm text-dark-300 flex-1">{stat.label}</span>
                <span className="text-sm font-mono text-dark-100">{stat.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Betting Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Betting Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dark-400">Bets Won</span>
              <span className="font-mono text-golf-400">68</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Bets Lost</span>
              <span className="font-mono text-red-400">52</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Win Rate</span>
              <span className="font-mono text-dark-100">56.7%</span>
            </div>
            <div className="flex justify-between border-t border-dark-700 pt-3">
              <span className="text-dark-400">Best Session</span>
              <span className="font-mono text-golf-400">+$85</span>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardContent className="py-2">
            <button className="flex items-center justify-between w-full py-3">
              <span className="text-dark-100">Edit Profile</span>
              <svg className="w-5 h-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="border-t border-dark-800" />
            <button className="flex items-center justify-between w-full py-3">
              <span className="text-dark-100">Notification Settings</span>
              <svg className="w-5 h-5 text-dark-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="border-t border-dark-800" />
            <button className="flex items-center justify-between w-full py-3">
              <span className="text-dark-100">Subscription</span>
              <Badge variant="gold">Pro</Badge>
            </button>
            <div className="border-t border-dark-800" />
            <button className="flex items-center justify-between w-full py-3">
              <span className="text-red-400">Sign Out</span>
            </button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
