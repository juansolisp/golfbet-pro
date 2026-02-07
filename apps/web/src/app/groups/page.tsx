'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function GroupsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <Header title="My Groups" />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Action buttons */}
        <div className="flex gap-3">
          <Button onClick={() => setShowCreate(!showCreate)} className="flex-1">
            Create Group
          </Button>
          <Button variant="secondary" onClick={() => setShowJoin(!showJoin)} className="flex-1">
            Join Group
          </Button>
        </div>

        {/* Create Group Form */}
        {showCreate && (
          <Card className="animate-slide-down">
            <CardContent className="py-4 space-y-3">
              <Input placeholder="Group Name" />
              <Input placeholder="Description (optional)" />
              <Button className="w-full" size="sm">Create</Button>
            </CardContent>
          </Card>
        )}

        {/* Join Group Form */}
        {showJoin && (
          <Card className="animate-slide-down">
            <CardContent className="py-4 space-y-3">
              <Input placeholder="Enter Invite Code" maxLength={8} className="text-center tracking-widest font-mono text-lg uppercase" />
              <Button className="w-full" size="sm">Join</Button>
            </CardContent>
          </Card>
        )}

        {/* Groups List */}
        <div className="space-y-3">
          <Card className="hover:border-dark-600 transition-colors">
            <Link href="/groups/demo">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-golf-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    W
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-50">Weekend Warriors</h3>
                    <p className="text-sm text-dark-400">4 members - 12 rounds played</p>
                  </div>
                  <div className="flex -space-x-2">
                    <Avatar className="w-7 h-7 border-2 border-dark-900">
                      <AvatarFallback className="text-[10px]">JR</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-7 h-7 border-2 border-dark-900">
                      <AvatarFallback className="text-[10px]">MG</AvatarFallback>
                    </Avatar>
                    <Avatar className="w-7 h-7 border-2 border-dark-900">
                      <AvatarFallback className="text-[10px]">+2</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:border-dark-600 transition-colors">
            <Link href="/groups/demo2">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-50">Club Campestre</h3>
                    <p className="text-sm text-dark-400">8 members - 24 rounds played</p>
                  </div>
                  <Badge variant="gold">Pro</Badge>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
