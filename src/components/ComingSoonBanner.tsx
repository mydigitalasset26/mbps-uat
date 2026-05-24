'use client';

import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CdnBar {
  id: string;
  label: string;
  heightPct: number;
  isOutlier: boolean;
}

type ChecklistStatus = 'done' | 'in-progress' | 'pending';

interface ChecklistItem {
  label: string;
  status: ChecklistStatus;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BUILD_PROGRESS = 72; // Update this as you build

const CDN_BARS: CdnBar[] = [
  { id: 'cf',     label: 'CF',    heightPct: 88, isOutlier: false },
  { id: 'bunny',  label: 'Bunny', heightPct: 91, isOutlier: false },
  { id: 'fastly', label: 'Fastly',heightPct: 12, isOutlier: true  },
  { id: 'aws',    label: 'AWS',   heightPct: 85, isOutlier: false },
  { id: 'azure',  label: 'Azure', heightPct: 78, isOutlier: false },
  { id: 'gcp',    label: 'GCP',   heightPct: 83, isOutlier: false },
];

const CHECKLIST: ChecklistItem[] = [
  { label: 'CDN engine',        status: 'done'       },
  { label: 'ISP lookup',        status: 'done'       },
  { label: 'Variance detection',status: 'done'       },
  { label: 'UI polish',         status: 'in-progress'},
  { label: 'Deploy',            status: 'pending'    },
];

const MEDIAN_SPEED = 143; // Mbps — update to reflect real test results

// ─── Sub-components ───────────────────────────────────────────────────────────

function PulseDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-40" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
    </span>
  );
}

function ChecklistBadge({ status }: { status: ChecklistStatus }) {
  if (status === 'done') {
    return (
      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-green-500/15">
        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
        </svg>
      </span>
    );
  }
  if (status === 'in-progress') {
    return (
      <span className="flex items-center justify-center w-4 h-4">
        <svg
          className="w-3.5 h-3.5 text-blue-400 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center w-4 h-4">
      <svg className="w-3 h-3 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
      </svg>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComingSoonBanner() {
  const [email, setEmail]           = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [barsVisible, setBarsVisible] = useState(false);
  const [gaugeValue, setGaugeValue]   = useState(0);
  const [activeBars, setActiveBars]   = useState<Set<string>>(new Set());
  const gaugeRef = useRef<NodeJS.Timeout | null>(null);

  // Animate bars sequentially, then count up the gauge
  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setBarsVisible(true);

      CDN_BARS.forEach((bar, i) => {
        setTimeout(() => {
          setActiveBars(prev => new Set([...prev, bar.id]));

          if (i === CDN_BARS.length - 1) {
            // All bars done — start gauge count-up
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
        }, i * 260 + 400);
      });
    }, 300);

    return () => {
      clearTimeout(enterTimer);
      if (gaugeRef.current) clearInterval(gaugeRef.current);
    };
  }, []);

  const handleNotify = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setEmailError(true);
      setTimeout(() => setEmailError(false), 1500);
      return;
    }
    // TODO: wire up to your mailing list / API route
    console.log('Notify signup:', email);
    setSubmitted(true);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-8 md:p-10">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/5 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-blue-500/[0.03] blur-2xl" />

      <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-10">

        {/* ── Left column ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* "Coming soon" pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] border border-blue-500/20 px-3.5 py-1.5 mb-6">
            <PulseDot />
            <span className="text-[11px] font-semibold tracking-widest text-blue-400 uppercase">
              Coming Soon
            </span>
          </div>

          {/* Headline */}
          <div className="mb-2">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-white">
              <span className="text-white">mbps</span>
              <span className="text-blue-500">.pro</span>
              <span className="ml-3 text-lg text-neutral-500 font-normal">
                is almost here
              </span>
            </h1>
          </div>

          <p className="text-sm text-neutral-500 leading-relaxed max-w-sm mb-6">
            Real-world internet speed test across 6 CDN providers.
            Detect ISP throttling and peering issues — not just a number, but an explanation.
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-neutral-600">Build progress</span>
              <span className="text-xs font-medium text-blue-400">{BUILD_PROGRESS}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 relative overflow-hidden transition-all duration-1000 ease-out"
                style={{ width: `${BUILD_PROGRESS}%` }}
              >
                {/* shimmer */}
                <span className="absolute inset-0 -translate-x-full animate-[shimmer_2s_ease-in-out_infinite_1.2s] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-wrap gap-2">
            {CHECKLIST.map(item => (
              <div
                key={item.label}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border text-xs
                  ${item.status === 'done'
                    ? 'bg-white/[0.03] border-white/[0.06] text-neutral-500'
                    : item.status === 'in-progress'
                    ? 'bg-blue-500/[0.07] border-blue-500/20 text-blue-400'
                    : 'bg-transparent border-white/[0.04] text-neutral-700'
                  }`}
              >
                <ChecklistBadge status={item.status} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ───────────────────────────────────────── */}
        <div className="flex flex-col gap-3 w-full lg:w-52 xl:w-60 shrink-0">

          {/* Speed gauge preview */}
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
            <p className="text-[10px] uppercase tracking-widest text-neutral-700 mb-2">
              Speed preview
            </p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-3xl font-semibold text-white tabular-nums leading-none">
                {gaugeValue > 0 ? gaugeValue : '--'}
              </span>
              <span className="text-xs text-neutral-600">Mbps</span>
            </div>

            {/* CDN mini bars */}
            <div className="flex items-end gap-1 h-7">
              {CDN_BARS.map(bar => (
                <div key={bar.id} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full bg-white/[0.05] rounded-sm overflow-hidden h-7 flex items-end">
                    <div
                      className={`w-full rounded-sm transition-all duration-700 ease-out ${
                        bar.isOutlier ? 'bg-red-500/70' : 'bg-blue-600'
                      }`}
                      style={{
                        height: activeBars.has(bar.id) ? `${bar.heightPct}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {CDN_BARS.map(bar => (
                <span
                  key={bar.id}
                  className={`text-[9px] ${bar.isOutlier ? 'text-red-500' : 'text-neutral-700'}`}
                >
                  {bar.label}
                </span>
              ))}
            </div>
          </div>

          {/* Variance alert */}
          <div className="rounded-xl bg-blue-500/[0.05] border border-blue-500/[0.15] p-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-500/10">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-400 leading-tight">Variance detected</p>
                <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                  Fastly is 11× slower — ISP peering issue
                </p>
              </div>
            </div>
          </div>

          {/* ISP card */}
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05]">
                <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-neutral-700 font-medium">Your ISP</p>
                <p className="text-[11px] text-neutral-600">Detecting... AS24560</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer row ───────────────────────────────────────────── */}
      <div className="relative mt-7 pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Feature pills */}
        <div className="flex flex-wrap items-center gap-4">
          {[
            { icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0', label: '6 CDN providers' },
            { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'No login required' },
            { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', label: 'ISP detection' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
              </svg>
              <span className="text-xs text-neutral-600">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Email signup */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          {!submitted ? (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNotify()}
                placeholder="your@email.com"
                aria-label="Email address for launch notification"
                className={`h-9 w-44 rounded-lg bg-white/[0.04] border px-3 text-sm text-white placeholder-neutral-700 outline-none transition-colors
                  focus:border-blue-500/50 focus:bg-white/[0.06]
                  ${emailError ? 'border-red-500/60' : 'border-white/[0.08]'}`}
              />
              <button
                onClick={handleNotify}
                className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-sm font-medium text-white whitespace-nowrap"
              >
                Notify me
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-green-400 animate-[fadeUp_0.3s_ease_both]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              You're on the list — we'll email you at launch.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
