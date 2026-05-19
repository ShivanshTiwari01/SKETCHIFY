'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

const Canvas = dynamic(() => import('@/components/Canvas'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center h-screen bg-[#0d0d0d] text-[#555] text-sm'>
      Loading canvas…
    </div>
  ),
});

interface CanvasPageProps {
  params: Promise<{ roomId: string }>;
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }
    setAuthed(true);
    params.then((p) => setRoomId(p.roomId));
  }, [router, params]);

  if (!authed || !roomId) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#0d0d0d] text-[#555] text-sm'>
        Loading…
      </div>
    );
  }

  return <Canvas roomId={roomId} onBack={() => router.push('/dashboard')} />;
}
