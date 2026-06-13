import { cn } from "@/lib/utils";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, leftIcon, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-zinc-300">{label}</label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-3 flex items-center text-zinc-500 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          className={cn(
            "w-full bg-zinc-900 border border-zinc-800 rounded-md text-zinc-100 placeholder-zinc-600",
            "text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600",
            "transition-colors duration-150",
            leftIcon && "pl-10",
            error && "border-red-800 focus:ring-red-800",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-zinc-300">{label}</label>}
      <select
        className={cn(
          "w-full bg-zinc-900 border border-zinc-800 rounded-md text-zinc-100",
          "text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-zinc-600 focus:border-zinc-600",
          "transition-colors duration-150",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
