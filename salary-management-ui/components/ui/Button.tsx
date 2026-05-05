import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  asChild?: boolean;
  href?: string;
};

const buttonStyles = {
  primary: "bg-[var(--foreground)] text-white hover:bg-black",
  secondary: "border border-[var(--line)] bg-white/80 text-[var(--foreground)] hover:bg-white",
  danger: "bg-[var(--danger)] text-white hover:bg-red-800",
  ghost: "text-[var(--foreground)] hover:bg-white/80",
};

export function Button({
  className,
  variant = "primary",
  asChild = false,
  href,
  children,
  ...props
}: ButtonProps) {
  const sharedClassName = cn(
    "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
    buttonStyles[variant],
    className,
  );

  if (asChild && href) {
    return (
      <Link className={sharedClassName} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={sharedClassName} {...props}>
      {children}
    </button>
  );
}
