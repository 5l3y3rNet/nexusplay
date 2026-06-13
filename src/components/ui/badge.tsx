import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "green" | "yellow" | "red" | "blue" | "purple" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-mono tracking-wide",
      variant === "default" && "bg-zinc-800 text-zinc-300 border border-zinc-700",
      variant === "green" && "bg-emerald-950 text-emerald-400 border border-emerald-900",
      variant === "yellow" && "bg-yellow-950 text-yellow-400 border border-yellow-900",
      variant === "red" && "bg-red-950 text-red-400 border border-red-900",
      variant === "blue" && "bg-blue-950 text-blue-400 border border-blue-900",
      variant === "purple" && "bg-purple-950 text-purple-400 border border-purple-900",
      variant === "outline" && "bg-transparent text-zinc-400 border border-zinc-700",
      className
    )}>
      {children}
    </span>
  );
}
