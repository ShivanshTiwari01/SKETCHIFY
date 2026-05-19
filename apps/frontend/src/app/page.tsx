import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-[#0d0d0d] text-white flex flex-col'>
      {/* Navbar */}
      <nav className='flex items-center justify-between px-8 py-5 border-b border-[#2e2e2e]'>
        <div className='flex items-center gap-2'>
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
          <span className='text-xl font-bold tracking-tight'>Sketchify</span>
        </div>
        <div className='flex items-center gap-4'>
          <Link
            href='/signin'
            className='text-sm text-[#888] hover:text-white transition-colors'
          >
            Sign in
          </Link>
          <Link
            href='/signup'
            className='text-sm bg-[#6c63ff] hover:bg-[#5b53e0] text-white px-4 py-2 rounded-lg transition-colors font-medium'
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className='flex-1 flex flex-col items-center justify-center px-6 text-center py-24'>
        <div className='inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2e2e2e] rounded-full px-4 py-1.5 text-sm text-[#888] mb-8'>
          <span className='w-2 h-2 bg-[#6c63ff] rounded-full inline-block'></span>
          Real-time collaborative drawing
        </div>

        <h1 className='text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight mb-6 max-w-4xl'>
          Sketch together,
          <br />
          <span className='text-[#6c63ff]'>in real-time</span>
        </h1>

        <p className='text-lg text-[#888] max-w-xl mb-10 leading-relaxed'>
          Sketchify is a multiplayer whiteboard for teams. Draw shapes,
          collaborate live, and bring your ideas to life — no installs needed.
        </p>

        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <Link
            href='/signup'
            className='bg-[#6c63ff] hover:bg-[#5b53e0] text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors shadow-lg shadow-[#6c63ff]/20'
          >
            Start Drawing Free
          </Link>
          <Link
            href='/signin'
            className='bg-[#1a1a1a] border border-[#2e2e2e] hover:border-[#444] text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-colors'
          >
            Sign in
          </Link>
        </div>

        {/* Preview Canvas */}
        <div className='mt-20 w-full max-w-4xl bg-[#1a1a1a] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-2xl'>
          <div className='flex items-center gap-2 px-4 py-3 border-b border-[#2e2e2e]'>
            <div className='w-3 h-3 rounded-full bg-[#ff5f57]'></div>
            <div className='w-3 h-3 rounded-full bg-[#febc2e]'></div>
            <div className='w-3 h-3 rounded-full bg-[#28c840]'></div>
            <span className='text-xs text-[#555] ml-2'>
              sketchify — my-board
            </span>
          </div>
          <div className='relative h-72 flex items-center justify-center overflow-hidden'>
            {/* Fake canvas shapes */}
            <svg width='100%' height='100%' className='absolute inset-0'>
              <rect
                x='80'
                y='60'
                width='160'
                height='100'
                rx='4'
                stroke='#6c63ff'
                strokeWidth='2'
                fill='none'
                opacity='0.8'
              />
              <circle
                cx='360'
                cy='120'
                r='60'
                stroke='#ff6b6b'
                strokeWidth='2'
                fill='none'
                opacity='0.7'
              />
              <polygon
                points='550,60 620,130 550,200 480,130'
                stroke='#4ecdc4'
                strokeWidth='2'
                fill='none'
                opacity='0.7'
              />
              <line
                x1='140'
                y1='200'
                x2='300'
                y2='240'
                stroke='#ffd93d'
                strokeWidth='2'
                opacity='0.7'
              />
              <line
                x1='300'
                y1='240'
                x2='440'
                y2='210'
                stroke='#ffd93d'
                strokeWidth='2'
                opacity='0.5'
              />
              <rect
                x='660'
                y='80'
                width='100'
                height='70'
                rx='4'
                stroke='#888'
                strokeWidth='1.5'
                fill='none'
                opacity='0.4'
              />
            </svg>
            <div className='relative z-10 text-[#333] text-sm select-none'>
              Your canvas awaits
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className='px-6 pb-24 max-w-5xl mx-auto w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
          {[
            {
              icon: '⬡',
              title: 'Shapes & Lines',
              desc: 'Draw rectangles, circles, diamonds, and freeform lines with ease.',
            },
            {
              icon: '⚡',
              title: 'Real-time Sync',
              desc: 'See every stroke instantly across all connected collaborators.',
            },
            {
              icon: '🔒',
              title: 'Secure Rooms',
              desc: 'Each board is a private room — share only with who you choose.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className='bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-6'
            >
              <div className='text-2xl mb-3'>{f.icon}</div>
              <h3 className='font-semibold text-white mb-2'>{f.title}</h3>
              <p className='text-sm text-[#888] leading-relaxed'>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className='border-t border-[#2e2e2e] px-8 py-5 text-center text-xs text-[#555]'>
        © {new Date().getFullYear()} Sketchify. Built for creators.
      </footer>
    </div>
  );
}
