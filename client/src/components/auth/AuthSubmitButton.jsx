import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "../common/LoadingState";
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
      {loading ? (
        <ButtonLoading />
      ) : (
        <>
          {children}
          {showArrow && <ArrowRight className="h-4 w-4" aria-hidden />}
        </>
      )}
    </Button>
  );
}
