'use client';

import { useEffect, useRef, useState } from 'react';

type ChecklistStatus = 'done' | 'in-progress' | 'pending';

const BUILD_PROGRESS = 72;
const MEDIAN_SPEED = 143;

const CDN_BARS = [
  { id: 'cf', label: 'CF', heightPct: 88, isOutlier: false },
  { id: 'bunny', label: 'Bunny', heightPct: 91, isOutlier: false },
  { id: 'fastly', label: 'Fastly', heightPct: 12, isOutlier: true },
  { id: 'aws', label: 'AWS', heightPct: 85, isOutlier: false },
  { id: 'azure', label: 'Azure', heightPct: 78, isOutlier: false },
  { id: 'gcp', label: 'GCP', heightPct: 83, isOutlier: false },
];

const CHECKLIST: Array<{ label: string; status: ChecklistStatus }> = [
  { label: 'CDN engine', status: 'done' },
  { label: 'ISP lookup', status: 'done' },
  { label: 'Variance detection', status: 'done' },
  { label: 'UI polish', status: 'in-progress' },
  { label: 'Deploy', status: 'pending' },
];

const FOOTER_FEATURES = [
  {
    label: '6 CDN providers',
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  },
  {
    label: 'No login required',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    label: 'ISP detection',
    icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064',
  },
];

function PulseDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-40" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500" />
    </span>
  );
}

function ChecklistBadge({ status }: { status: ChecklistStatus }) {
  if (status === 'done') {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15">
        <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
        </svg>
      </span>
    );
  }

  if (status === 'in-progress') {
    return (
      <span className="flex h-5 w-5 items-center justify-center">
        <svg className="h-4 w-4 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </span>
    );
  }

  return (
    <span className="flex h-5 w-5 items-center justify-center">
      <svg className="h-3.5 w-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
      </svg>
    </span>
  );
}

export default function ComingSoonBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [gaugeValue, setGaugeValue] = useState(0);
  const [activeBars, setActiveBars] = useState<Set<string>>(new Set());
  const gaugeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const enterTimer = window.setTimeout(() => {
      CDN_BARS.forEach((bar, index) => {
        window.setTimeout(() => {
          setActiveBars((previous) => new Set(Array.from(previous).concat(bar.id)));

          if (index === CDN_BARS.length - 1) {
            let current = 0;
            const step = Math.ceil(MEDIAN_SPEED / 30);
            gaugeRef.current = setInterval(() => {
              current = Math.min(current + step, MEDIAN_SPEED);
              setGaugeValue(current);
              if (current >= MEDIAN_SPEED && gaugeRef.current) {
                clearInterval(gaugeRef.current);
              }
            }, 40);
          }
        }, index * 260 + 400);
      });
    }, 300);

    return () => {
      window.clearTimeout(enterTimer);
      if (gaugeRef.current) clearInterval(gaugeRef.current);
    };
  }, []);

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
      data-build="larger-banner-content"
      className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-10 shadow-[0_24px_100px_rgba(0,0,0,0.28)] md:p-14"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-blue-500/[0.03] blur-2xl" />

      <div className="relative flex flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="min-w-0 flex-1">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-500/20 bg-white/[0.04] px-4 py-2">
            <PulseDot />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">Coming Soon</span>
          </div>

          <h1 className="mb-3 text-4xl font-semibold leading-tight text-white md:text-5xl">
            <span>mbps</span>
            <span className="text-blue-500">.pro</span>
            <span className="ml-4 text-2xl font-normal text-neutral-500">is almost here</span>
          </h1>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-neutral-500">
            Real-world internet speed test across 6 CDN providers. Detect ISP throttling and peering issues, not just a number, but an explanation.
          </p>

          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-neutral-600">Build progress</span>
              <span className="text-sm font-medium text-blue-400">{BUILD_PROGRESS}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="relative h-full overflow-hidden rounded-full bg-blue-500 transition-all duration-1000 ease-out"
                style={{ width: `${BUILD_PROGRESS}%` }}
              >
                <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {CHECKLIST.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                  item.status === 'done'
                    ? 'border-white/[0.06] bg-white/[0.03] text-neutral-500'
                    : item.status === 'in-progress'
                      ? 'border-blue-500/20 bg-blue-500/[0.07] text-blue-400'
                      : 'border-white/[0.04] bg-transparent text-neutral-700'
                }`}
              >
                <ChecklistBadge status={item.status} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
            <p className="mb-3 text-[11px] uppercase tracking-widest text-neutral-700">Speed preview</p>
            <div className="mb-5 flex items-baseline gap-1.5">
              <span className="text-4xl font-semibold leading-none text-white tabular-nums">
                {gaugeValue > 0 ? gaugeValue : '--'}
              </span>
              <span className="text-sm text-neutral-600">Mbps</span>
            </div>

            <div className="flex h-10 items-end gap-1.5">
              {CDN_BARS.map((bar) => (
                <div key={bar.id} className="flex flex-1 flex-col items-center gap-0.5">
                  <div className="flex h-10 w-full items-end overflow-hidden rounded-sm bg-white/[0.05]">
                    <div
                      className={`w-full rounded-sm transition-all duration-700 ease-out ${bar.isOutlier ? 'bg-red-500/70' : 'bg-blue-600'}`}
                      style={{ height: activeBars.has(bar.id) ? `${bar.heightPct}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between">
              {CDN_BARS.map((bar) => (
                <span key={bar.id} className={`text-[10px] ${bar.isOutlier ? 'text-red-500' : 'text-neutral-700'}`}>
                  {bar.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/[0.15] bg-blue-500/[0.05] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium leading-tight text-blue-400">Variance detected</p>
                <p className="mt-1 text-xs leading-snug text-neutral-600">Fastly is 11x slower, ISP peering issue</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/[0.05]">
                <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-700">Your ISP</p>
                <p className="text-xs text-neutral-600">Detecting... AS24560</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-10 flex flex-col items-start justify-between gap-5 border-t border-white/[0.05] pt-7 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-6">
          {FOOTER_FEATURES.map((feature) => (
            <div key={feature.label} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
              </svg>
              <span className="text-sm text-neutral-600">{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="shrink-0">
          {!submitted ? (
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleNotify();
                }}
                placeholder="your@email.com"
                aria-label="Email address for launch notification"
                className={`h-12 w-60 rounded-lg border bg-white/[0.04] px-4 text-base text-white outline-none transition-colors placeholder:text-neutral-700 focus:border-blue-500/50 focus:bg-white/[0.06] ${
                  emailError ? 'border-red-500/60' : 'border-white/[0.08]'
                }`}
              />
              <button
                type="button"
                onClick={handleNotify}
                className="h-12 whitespace-nowrap rounded-lg bg-blue-600 px-6 text-base font-medium text-white transition-all hover:bg-blue-500 active:scale-95"
              >
                Notify me
              </button>
            </div>
          ) : (
            <div className="animate-fade-up text-base text-green-400">You're on the list. We'll email you at launch.</div>
          )}
        </div>
      </div>
    </section>
  );
}
