import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "icon";
}) {
  const variants = {
    primary: "bg-white text-ink hover:bg-zinc-200 shadow-sm",
    ghost: "border border-white/10 bg-transparent text-parchment hover:bg-white/5 hover:border-white/20",
    danger: "bg-blood/90 text-white hover:bg-blood",
    gold: "bg-brand text-white hover:bg-brand-light font-medium",
  };
  const sizes = { sm: "px-2.5 py-1 text-sm rounded-md", md: "px-4 py-2 rounded-lg", icon: "p-2 rounded-lg" };
  return (
    <button
      className={cn(
        "font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-parchment",
        "placeholder:text-muted focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/30",
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-surface/90 shadow-card backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-parchment/80", className)} {...props} />;
}
