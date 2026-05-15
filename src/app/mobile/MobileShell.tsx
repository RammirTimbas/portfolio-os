export default function MobileShell() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-black">
      <div className="relative h-[780px] w-[360px] overflow-hidden rounded-[3rem] border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
        <div className="absolute left-1/2 top-3 h-6 w-32 -translate-x-1/2 rounded-full bg-black" />

        <div className="flex h-full items-center justify-center">
          <h1 className="text-3xl font-bold">Mobile OS</h1>
        </div>
      </div>
    </main>
  );
}