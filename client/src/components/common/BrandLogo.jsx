import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function BrandLogo({
  className,
  size = "default",
  link = true,
  variant = "dark",
}) {
  const sizes = {
    sm: { icon: "h-7 w-7 text-xs", text: "text-lg", tagline: "hidden" },
    default: { icon: "h-9 w-9 text-sm", text: "text-xl", tagline: "text-[10px]" },
    lg: { icon: "h-11 w-11 text-base", text: "text-2xl", tagline: "text-xs" },
  };
  const s = sizes[size] || sizes.default;
  const isLight = variant === "light";

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/25",
          s.icon
        )}
      >
        N
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-bold tracking-tight",
            s.text,
            isLight ? "text-white" : "text-slate-900"
          )}
        >
          Next<span className={isLight ? "text-violet-400" : "text-violet-600"}>VIP</span>
        </span>
        <span
          className={cn(
            "font-medium mt-0.5",
            s.tagline,
            isLight ? "text-slate-400" : "text-slate-500"
          )}
        >
          Content automation SaaS
        </span>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to="/" className="inline-flex shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
