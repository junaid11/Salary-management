export default function Loading() {
  return (
    <div className="grid gap-6">
      <div className="h-28 animate-pulse rounded-[2rem] bg-white/60" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[2rem] bg-white/60" />
        <div className="h-80 animate-pulse rounded-[2rem] bg-white/60" />
      </div>
    </div>
  );
}
