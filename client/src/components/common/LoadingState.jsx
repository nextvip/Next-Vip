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
        "flex items-center justify-center text-center",
        compact ? "py-10" : "py-16",
        className
      )}
    >
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
