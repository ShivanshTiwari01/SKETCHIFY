'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signin } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signin({ email, password });
      if (data.token) {
        setToken(data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4'>
      <div className='w-full max-w-sm'>
        {/* Logo */}
        <Link href='/' className='flex items-center justify-center gap-2 mb-10'>
          <svg width='28' height='28' viewBox='0 0 28 28' fill='none'>
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
          <span className='text-xl font-bold text-white tracking-tight'>
            Sketchify
          </span>
        </Link>

        <div className='bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl p-8'>
          <h1 className='text-xl font-bold text-white mb-1'>Welcome back</h1>
          <p className='text-sm text-[#888] mb-6'>
            Sign in to your account to continue
          </p>

          {error && (
            <div className='bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm text-[#aaa] mb-1.5'>Email</label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full bg-[#242424] border border-[#2e2e2e] focus:border-[#6c63ff] outline-none text-white placeholder-[#555] px-4 py-2.5 rounded-lg text-sm transition-colors'
              />
            </div>

            <div>
              <label className='block text-sm text-[#aaa] mb-1.5'>
                Password
              </label>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className='w-full bg-[#242424] border border-[#2e2e2e] focus:border-[#6c63ff] outline-none text-white placeholder-[#555] px-4 py-2.5 rounded-lg text-sm transition-colors'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#6c63ff] hover:bg-[#5b53e0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2'
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className='text-center text-sm text-[#666] mt-5'>
          Don&apos;t have an account?{' '}
          <Link href='/signup' className='text-[#6c63ff] hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
