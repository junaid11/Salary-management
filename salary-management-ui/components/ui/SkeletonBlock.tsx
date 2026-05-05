import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[2rem] bg-white/65", className)} />;
}
