import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "volt" | "solid" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.12em] rounded-[8px] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-40 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  volt: "bg-lime text-volt-ink hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_0_0_rgba(242,106,33,0.5)] hover:shadow-[0_10px_40px_-8px_rgba(242,106,33,0.55)]",
  solid: "bg-paper text-ink hover:bg-lime hover:text-volt-ink hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-line-strong text-paper hover:border-volt hover:text-volt hover:-translate-y-0.5",
  ghost: "text-paper/70 hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "text-[0.68rem] px-3.5 py-2",
  md: "text-[0.74rem] px-5 py-3",
  lg: "text-[0.8rem] px-7 py-4",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export function Button({
  variant = "volt",
  size = "md",
  className = "",
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "volt",
  size = "md",
  className = "",
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
