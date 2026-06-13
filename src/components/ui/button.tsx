import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" && "bg-white text-zinc-950 hover:bg-zinc-100 focus:ring-zinc-500",
        variant === "secondary" && "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 focus:ring-zinc-600",
        variant === "ghost" && "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 focus:ring-zinc-700",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500",
        variant === "outline" && "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-500 hover:text-white focus:ring-zinc-600",
        size === "sm" && "text-xs px-3 py-1.5 gap-1.5",
        size === "md" && "text-sm px-4 py-2 gap-2",
        size === "lg" && "text-sm px-6 py-3 gap-2",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
