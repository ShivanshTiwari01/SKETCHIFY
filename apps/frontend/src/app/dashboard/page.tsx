'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createRoom, getRoomBySlug } from '@/lib/api';
import { isAuthenticated, removeToken } from '@/lib/auth';

interface Room {
  id: string;
  slug: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState('');
  const [joinSlug, setJoinSlug] = useState('');
  const [createError, setCreateError] = useState('');
  const [joinError, setJoinError] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/signin');
    }
    const stored = localStorage.getItem('rooms');
    if (stored) {
      try {
        setRooms(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [router]);

  const saveRooms = useCallback((updated: Room[]) => {
    setRooms(updated);
    localStorage.setItem('rooms', JSON.stringify(updated));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setCreateError('');
    setCreating(true);
    try {
      const data = await createRoom(roomName.trim());
      const newRoom: Room = { id: data.roomId, slug: roomName.trim() };
      saveRooms([newRoom, ...rooms]);
      setRoomName('');
      router.push(`/canvas/${data.roomId}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to create room';
      setCreateError(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinSlug.trim()) return;
    setJoinError('');
    setJoining(true);
    try {
      const data = await getRoomBySlug(joinSlug.trim());
      const room: Room = {
        id: data.data?.id,
        slug: data.data?.slug || joinSlug.trim(),
      };
      const exists = rooms.find((r) => r.id === room.id);
      if (!exists) saveRooms([room, ...rooms]);
      router.push(`/canvas/${room.id}`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Room not found';
      setJoinError(msg);
    } finally {
      setJoining(false);
    }
  };

  const handleSignOut = () => {
    removeToken();
    router.replace('/signin');
  };

  return (
    <div className='min-h-screen bg-[#0d0d0d] text-white'>
      {/* Navbar */}
      <nav className='flex items-center justify-between px-6 py-4 border-b border-[#2e2e2e]'>
        <Link href='/' className='flex items-center gap-2'>
          <svg width='26' height='26' viewBox='0 0 28 28' fill='none'>
            <rect width='28' height='28' rx='6' fill='#6c63ff' />
            <path
              d='M6 22 L12 8 L18 16 L22 12'
              stroke='white'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              fill='none'
            />
          </svg>
          <span className='font-bold text-lg tracking-tight'>Sketchify</span>
        </Link>
        <button
          onClick={handleSignOut}
          className='text-sm text-[#888] hover:text-white transition-colors'
        >
          Sign out
        </button>
      </nav>

      <div className='max-w-4xl mx-auto px-6 py-10'>
        <h1 className='text-2xl font-bold mb-8'>Your Boards</h1>

        {/* Actions row */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10'>
          {/* Create room */}
          <div className='bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-6'>
            <h2 className='font-semibold text-white mb-1'>
              Create a new board
            </h2>
            <p className='text-xs text-[#666] mb-4'>
              Start a fresh collaborative canvas
            </p>
            {createError && (
              <p className='text-red-400 text-xs mb-3'>{createError}</p>
            )}
            <form onSubmit={handleCreate} className='flex gap-2'>
              <input
                type='text'
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder='Board name…'
                maxLength={50}
                className='flex-1 bg-[#242424] border border-[#2e2e2e] focus:border-[#6c63ff] outline-none text-white placeholder-[#555] px-3 py-2 rounded-lg text-sm transition-colors'
              />
              <button
                type='submit'
                disabled={creating}
                className='bg-[#6c63ff] hover:bg-[#5b53e0] disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors'
              >
                {creating ? '…' : 'Create'}
              </button>
            </form>
          </div>

          {/* Join room */}
          <div className='bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-6'>
            <h2 className='font-semibold text-white mb-1'>Join a board</h2>
            <p className='text-xs text-[#666] mb-4'>
              Enter a board slug to collaborate
            </p>
            {joinError && (
              <p className='text-red-400 text-xs mb-3'>{joinError}</p>
            )}
            <form onSubmit={handleJoin} className='flex gap-2'>
              <input
                type='text'
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                placeholder='Board slug…'
                className='flex-1 bg-[#242424] border border-[#2e2e2e] focus:border-[#6c63ff] outline-none text-white placeholder-[#555] px-3 py-2 rounded-lg text-sm transition-colors'
              />
              <button
                type='submit'
                disabled={joining}
                className='bg-[#242424] border border-[#2e2e2e] hover:border-[#444] disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors'
              >
                {joining ? '…' : 'Join'}
              </button>
            </form>
          </div>
        </div>

        {/* Recent boards */}
        {rooms.length > 0 && (
          <div>
            <h2 className='text-sm font-semibold text-[#888] uppercase tracking-wider mb-4'>
              Recent boards
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
              {rooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/canvas/${room.id}`}
                  className='group bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#6c63ff]/50 rounded-xl p-5 transition-colors'
                >
                  <div className='w-10 h-10 bg-[#6c63ff]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#6c63ff]/20 transition-colors'>
                    <svg width='18' height='18' viewBox='0 0 28 28' fill='none'>
                      <path
                        d='M6 22 L12 8 L18 16 L22 12'
                        stroke='#6c63ff'
                        strokeWidth='2.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        fill='none'
                      />
                    </svg>
                  </div>
                  <p className='font-medium text-white text-sm truncate'>
                    {room.slug}
                  </p>
                  <p className='text-xs text-[#555] mt-1'>
                    ID: {room.id.slice(0, 8)}…
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {rooms.length === 0 && (
          <div className='text-center py-16 text-[#444]'>
            <svg
              className='mx-auto mb-4 opacity-30'
              width='48'
              height='48'
              viewBox='0 0 28 28'
              fill='none'
            >
              <rect
                x='4'
                y='4'
                width='20'
                height='20'
                rx='3'
                stroke='currentColor'
                strokeWidth='1.5'
                fill='none'
              />
              <path
                d='M9 19 L12 11 L16 16 L19 13'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                fill='none'
              />
            </svg>
            <p className='text-sm'>No boards yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
