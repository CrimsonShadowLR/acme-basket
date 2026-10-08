import { ApiStatus } from "@/components/ApiStatus";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Acme Widget Co</h1>
        <ApiStatus />
      </header>
      <p className="text-zinc-500">The basket goes here.</p>
    </main>
  );
}
