import { ApiStatus } from "@/components/ApiStatus";
import { Basket } from "@/components/Basket";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Acme Widget Co
          </h1>
          <p className="text-zinc-500">Basket proof of concept</p>
        </div>
        <ApiStatus />
      </header>
      <Basket />
    </main>
  );
}
