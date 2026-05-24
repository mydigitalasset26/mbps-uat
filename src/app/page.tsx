import ComingSoonBanner from '@/Components/ComingSoonBanner';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050606] px-4 py-16">
      <div className="w-full max-w-4xl">
        <ComingSoonBanner />
      </div>
    </main>
  );
}
