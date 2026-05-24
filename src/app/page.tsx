import ComingSoonBanner from '@/Components/ComingSoonBanner';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050606] px-6 py-10 lg:px-10">
      <div className="w-full max-w-6xl">
        <ComingSoonBanner />
      </div>
    </main>
  );
}
