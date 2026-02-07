'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Step = 1 | 2 | 3;

export default function NewRoundPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [roundType, setRoundType] = useState<'EIGHTEEN_HOLES' | 'NINE_HOLES'>('EIGHTEEN_HOLES');
  const [selectedBets, setSelectedBets] = useState<string[]>([]);
  const [nassauAmount, setNassauAmount] = useState('10');
  const [skinsAmount, setSkinsAmount] = useState('5');

  const betTypes = [
    { id: 'NASSAU', name: 'Nassau', desc: 'Front 9, Back 9, Total', popular: true },
    { id: 'SKINS', name: 'Skins', desc: 'Win the hole, win the skin', popular: true },
    { id: 'MATCH_PLAY', name: 'Match Play', desc: 'Head-to-head hole by hole', popular: false },
  ];

  const toggleBet = (id: string) => {
    setSelectedBets(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Header title="New Round" showBack backHref="/dashboard" />

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                s === step ? 'bg-golf-600 text-white' :
                s < step ? 'bg-golf-600/20 text-golf-400' :
                'bg-dark-800 text-dark-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${s < step ? 'bg-golf-600' : 'bg-dark-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Course & Players */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-dark-50 mb-1">Select Course</h2>
              <p className="text-dark-400 text-sm">Choose where you are playing</p>
            </div>

            <Input placeholder="Search courses..." className="bg-dark-900" />

            <div className="space-y-2">
              {['Club Campestre', 'Valle Alto Golf Club', 'Las Misiones CC', 'El Bosque CC'].map(course => (
                <Card
                  key={course}
                  className={`cursor-pointer transition-all ${selectedCourse === course ? 'border-golf-500 bg-golf-950' : 'hover:border-dark-600'}`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-dark-100">{course}</h4>
                        <p className="text-xs text-dark-500">Par 72 - Slope 128</p>
                      </div>
                      {selectedCourse === course && (
                        <div className="w-6 h-6 bg-golf-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Round Type */}
            <div>
              <h3 className="text-sm font-medium text-dark-300 mb-2">Round Type</h3>
              <div className="flex gap-3">
                <Button
                  variant={roundType === 'EIGHTEEN_HOLES' ? 'default' : 'secondary'}
                  onClick={() => setRoundType('EIGHTEEN_HOLES')}
                  className="flex-1"
                  size="sm"
                >
                  18 Holes
                </Button>
                <Button
                  variant={roundType === 'NINE_HOLES' ? 'default' : 'secondary'}
                  onClick={() => setRoundType('NINE_HOLES')}
                  className="flex-1"
                  size="sm"
                >
                  9 Holes
                </Button>
              </div>
            </div>

            <Button onClick={() => setStep(2)} className="w-full" disabled={!selectedCourse}>
              Next: Select Bets
            </Button>
          </div>
        )}

        {/* Step 2: Bet Configuration */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-dark-50 mb-1">Choose Bets</h2>
              <p className="text-dark-400 text-sm">Select one or more betting modes</p>
            </div>

            <div className="space-y-3">
              {betTypes.map(bet => (
                <Card
                  key={bet.id}
                  className={`cursor-pointer transition-all ${selectedBets.includes(bet.id) ? 'border-golf-500 bg-golf-950' : 'hover:border-dark-600'}`}
                  onClick={() => toggleBet(bet.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-dark-50">{bet.name}</h4>
                          {bet.popular && <Badge variant="gold">Popular</Badge>}
                        </div>
                        <p className="text-sm text-dark-400 mt-0.5">{bet.desc}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedBets.includes(bet.id) ? 'bg-golf-600 border-golf-600' : 'border-dark-600'
                      }`}>
                        {selectedBets.includes(bet.id) && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Amount Config */}
            {selectedBets.includes('NASSAU') && (
              <Card className="animate-slide-down">
                <CardHeader>
                  <CardTitle className="text-base">Nassau Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-dark-400">$</span>
                    <Input
                      type="number"
                      value={nassauAmount}
                      onChange={(e) => setNassauAmount(e.target.value)}
                      className="text-center font-mono text-lg"
                      min="1"
                    />
                    <span className="text-dark-400 text-sm">per bet</span>
                  </div>
                  <p className="text-xs text-dark-500 mt-2">Front 9 + Back 9 + Total = ${parseInt(nassauAmount || '0') * 3} max exposure</p>
                </CardContent>
              </Card>
            )}

            {selectedBets.includes('SKINS') && (
              <Card className="animate-slide-down">
                <CardHeader>
                  <CardTitle className="text-base">Skins Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <span className="text-dark-400">$</span>
                    <Input
                      type="number"
                      value={skinsAmount}
                      onChange={(e) => setSkinsAmount(e.target.value)}
                      className="text-center font-mono text-lg"
                      min="1"
                    />
                    <span className="text-dark-400 text-sm">per skin</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1" disabled={selectedBets.length === 0}>
                Next: Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Start */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-dark-50 mb-1">Review Round</h2>
              <p className="text-dark-400 text-sm">Confirm and start playing</p>
            </div>

            <Card>
              <CardContent className="py-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-dark-400">Course</span>
                  <span className="text-dark-100 font-medium">{selectedCourse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-400">Type</span>
                  <span className="text-dark-100">{roundType === 'EIGHTEEN_HOLES' ? '18 Holes' : '9 Holes'}</span>
                </div>
                <div className="border-t border-dark-700 pt-3">
                  <span className="text-dark-400 text-sm">Bets</span>
                  <div className="mt-2 space-y-2">
                    {selectedBets.map(bet => (
                      <div key={bet} className="flex justify-between items-center">
                        <Badge>{bet}</Badge>
                        <span className="font-mono text-dark-100">
                          ${bet === 'NASSAU' ? nassauAmount : bet === 'SKINS' ? skinsAmount : '10'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button onClick={() => router.push('/rounds/demo/scorecard')} className="flex-1">
                Start Round
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
