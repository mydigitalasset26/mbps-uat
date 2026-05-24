'use client';

import { useState } from 'react';

const FEATURES = [
  {
    label: '6 CDN providers',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M4 12h16M4 17h16M8 4v16M16 4v16"
      />
    ),
  },
  {
    label: 'No login required',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M12 3.5l7 3v5.2c0 4.1-2.8 7.9-7 8.8-4.2-.9-7-4.7-7-8.8V6.5l7-3Z"
      />
    ),
  },
  {
    label: 'ISP detection',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 10.5a12 12 0 0 1 17 0M6.8 13.8a7.4 7.4 0 0 1 10.4 0M10.1 17.1a2.7 2.7 0 0 1 3.8 0M12 20h.01"
      />
    ),
  },
];

export default function ComingSoonBanner() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      setEmailError(true);
      window.setTimeout(() => setEmailError(false), 1500);
      return;
    }

    setSubmitted(true);
  };

  return (
    <section
      data-build="tailwind-postcss"
      className="relative flex min-h-[calc(100vh-2px)] w-full flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#050606] px-6 py-20 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-10 lg:px-16 lg:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_94%_10%,rgba(38,88,167,0.12),transparent_19rem)]" />

      <div className="relative">
        <div className="inline-flex h-[54px] items-center gap-3 rounded-full border border-blue-500/40 bg-blue-500/[0.03] px-[18px] text-blue-400 shadow-[0_0_0_1px_rgba(59,130,246,0.04)]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10">
            <span className="h-3 w-3 rounded-full bg-blue-500/60" />
          </span>
          <span className="text-[24px] font-medium uppercase leading-none tracking-[0.08em]">
            Coming Soon
          </span>
        </div>
      </div>

      <div className="relative mt-auto border-t border-white/[0.07] pt-11">
        <div className="flex flex-col gap-9">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-5">
            {FEATURES.map((feature) => (
              <div key={feature.label} className="flex items-center gap-4 text-neutral-700">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.6}
                >
                  {feature.icon}
                </svg>
                <span className="text-[24px] leading-none tracking-normal">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          <div>
            {!submitted ? (
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleNotify();
                  }}
                  placeholder="your@email.com"
                  aria-label="Email address for launch notification"
                  className={`h-[72px] w-full min-w-0 rounded-[14px] border bg-white/[0.04] px-6 text-[24px] font-medium text-white outline-none transition-colors placeholder:text-neutral-300 sm:w-[380px] ${
                    emailError
                      ? 'border-red-500/70'
                      : 'border-white/[0.11] focus:border-blue-500/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleNotify}
                  className="h-[64px] rounded-[14px] bg-blue-500 px-10 text-[24px] font-medium text-white transition-colors hover:bg-blue-400 active:bg-blue-600 sm:h-[64px] sm:self-center"
                >
                  Notify me
                </button>
              </div>
            ) : (
              <div className="rounded-[14px] border border-green-500/20 bg-green-500/10 px-6 py-5 text-[22px] font-medium text-green-300">
                You're on the list.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
