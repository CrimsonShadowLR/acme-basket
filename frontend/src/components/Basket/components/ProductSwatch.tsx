const swatches: Record<string, string> = {
  R01: "bg-red-500",
  G01: "bg-emerald-500",
  B01: "bg-sky-500",
};

/** A coloured square standing in for a product photo. */
export function ProductSwatch({
  code,
  size = "md",
}: {
  code: string;
  size?: "sm" | "md";
}) {
  const dimensions =
    size === "sm" ? "h-8 w-8 rounded-md" : "h-12 w-12 rounded-lg";
  return (
    <span
      className={`${dimensions} shrink-0 ${swatches[code] ?? "bg-zinc-300"} shadow-inner`}
      aria-hidden
    />
  );
}
