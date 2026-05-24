import ComingSoonBanner from '@/components/ComingSoonBanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl">
        <ComingSoonBanner />
      </div>
    </main>
  );
}
