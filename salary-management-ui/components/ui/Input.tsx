import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-medium text-[var(--foreground)]">{label}</span>
      <input
        className={cn(
          "rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 outline-none transition placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[color:rgba(15,118,110,0.15)]",
          error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[color:rgba(185,28,28,0.12)]",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-[var(--danger)]">{error}</span> : null}
    </label>
  );
}
