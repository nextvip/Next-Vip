import { cn } from "@/lib/utils";

export function LoadingDots({ className, dotClassName, size = "sm" }) {
  const sizes = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
  };

  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "rounded-full bg-violet-500 animate-dot-bounce",
            sizes[size],
            dotClassName
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

export function LoadingRing({ className, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-14 w-14",
  };

  return (
    <div
      className={cn("relative", sizes[size], className)}
      role="status"
      aria-label="Loading"
    >
      <div className="absolute inset-0 rounded-full border-2 border-violet-100" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-600 border-r-violet-400 animate-loader-ring" />
    </div>
  );
}

export function LoadingLabel({ label = "Loading", className }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span>{label}</span>
      <LoadingDots />
    </span>
  );
}

export function PageLoading({
  label = "Loading",
  className,
  compact = false,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-10 gap-3" : "py-16 gap-4",
        className
      )}
    >
      <LoadingRing size={compact ? "sm" : "md"} />
      <LoadingLabel label={label} />
    </div>
  );
}

export function ButtonLoading({ label, dotClassName }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LoadingDots dotClassName={dotClassName || "bg-white"} size="sm" />
      {label && <span>{label}</span>}
    </span>
  );
}
