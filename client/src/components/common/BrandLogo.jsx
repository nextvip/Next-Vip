import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const LOGO_FULL = "/brand/nextvip-logo-full.png";
const LOGO_ICON = "/brand/nextvip-logo-icon.png";

export default function BrandLogo({
  className,
  size = "default",
  link = true,
  variant = "dark",
  to = "/",
  showTagline = true,
}) {
  const sizes = {
    sm: { icon: "h-7 w-7 text-xs", text: "text-lg", tagline: "hidden", image: "h-8" },
    default: { icon: "h-9 w-9 text-sm", text: "text-xl", tagline: "text-[10px]", image: "h-10" },
    lg: { icon: "h-11 w-11 text-base", text: "text-2xl", tagline: "text-xs", image: "h-12" },
  };
  const s = sizes[size] || sizes.default;
  const isLight = variant === "light";
  const useImage = variant === "image";

  const content = useImage ? (
    <img
      src={LOGO_FULL}
      alt="NextVIP"
      className={cn("w-auto object-contain rounded-lg", s.image, className)}
    />
  ) : (
    <div className={cn("flex items-center gap-2.5", className)}>
      <img
        src={LOGO_ICON}
        alt=""
        aria-hidden
        className={cn("rounded-xl object-contain shrink-0", s.icon)}
      />
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
        {showTagline && (
          <span
            className={cn(
              "font-medium mt-0.5",
              s.tagline,
              isLight ? "text-slate-400" : "text-slate-500"
            )}
          >
            Content automation SaaS
          </span>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link
        to={to}
        className="inline-flex shrink-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 transition-opacity hover:opacity-90"
        aria-label={to === "/dashboard" ? "Go to dashboard" : "Go to home"}
      >
        {content}
      </Link>
    );
  }

  return content;
}
