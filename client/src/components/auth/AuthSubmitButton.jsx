import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authSubmitClassName } from "./authStyles";

export default function AuthSubmitButton({
  loading,
  children,
  showArrow = true,
  className,
  disabled,
  ...props
}) {
  return (
    <Button
      type="submit"
      className={className ?? authSubmitClassName}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
      {!loading && showArrow && <ArrowRight className="h-4 w-4" aria-hidden />}
    </Button>
  );
}
