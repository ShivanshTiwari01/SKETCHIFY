'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signup(form);
      if (data.token) {
        setToken(data.token);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Sign up failed');
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

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'johndoe',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'you@example.com',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
    },
  ] as const;

  return (
    <div className='min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4 py-10'>
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
          <h1 className='text-xl font-bold text-white mb-1'>
            Create an account
          </h1>
          <p className='text-sm text-[#888] mb-6'>
            Start sketching with your team today
          </p>

          {error && (
            <div className='bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            {fields.map((f) => (
              <div key={f.name}>
                <label className='block text-sm text-[#aaa] mb-1.5'>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  required
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className='w-full bg-[#242424] border border-[#2e2e2e] focus:border-[#6c63ff] outline-none text-white placeholder-[#555] px-4 py-2.5 rounded-lg text-sm transition-colors'
                />
              </div>
            ))}

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-[#6c63ff] hover:bg-[#5b53e0] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2'
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className='text-center text-sm text-[#666] mt-5'>
          Already have an account?{' '}
          <Link href='/signin' className='text-[#6c63ff] hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
