import { cn } from "@/lib/utils";

export function SectionCard({
  title,
  eyebrow,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] backdrop-blur", className)}>
      {eyebrow ? <p className="font-display text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
