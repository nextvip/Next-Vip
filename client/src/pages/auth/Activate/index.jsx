import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AuthLayout, { AuthError, AuthSuccess } from "../../../components/auth/AuthLayout";
import AuthPageHeader from "../../../components/auth/AuthPageHeader";
import OtpInput from "../../../components/auth/OtpInput";
import AuthSubmitButton from "../../../components/auth/AuthSubmitButton";
import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authMutedLinkClassName,
} from "../../../components/auth/authStyles";
import { activateUser, resendVerification } from "../../../services/authServices";

export default function Activate() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email?.trim() || "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (emailFromState) {
      setEmail(emailFromState);
    }
  }, [emailFromState]);

  const hasEmail = email.trim().length > 0;
  const isFormValid = hasEmail && code.length === 6;

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await activateUser({ email: email.trim(), code });
      navigate("/login", {
        replace: true,
        state: {
          message: "Email verified successfully. Sign in to continue.",
          email: email.trim(),
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Activation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    setError("");
    setSuccess("");
    setResendLoading(true);
    try {
      const { data } = await resendVerification({ email: email.trim() });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout
      minimal
      footer={
        <Link to="/login" className={`text-sm ${authMutedLinkClassName}`}>
          ← Back to sign in
        </Link>
      }
    >
      <AuthPageHeader
        icon={Mail}
        title="Verify your email"
        description={
          hasEmail
            ? `Enter the 6-digit code we sent to ${email.trim()}`
            : "Enter the 6-digit verification code sent to your email."
        }
      />

      {location.state?.message && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm px-4 py-3 mb-5 leading-relaxed">
          {location.state.message}
        </div>
      )}

      <form onSubmit={handleActivate} className="space-y-5">
        <AuthError message={error} />
        <AuthSuccess message={success} />

        {!emailFromState && (
          <div className="space-y-2">
            <Label htmlFor="email" className={authLabelClassName}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClassName}
              placeholder="you@example.com"
              required
            />
          </div>
        )}

        <div className="space-y-3">
          <Label className={`${authLabelClassName} block text-center`}>
            Verification code
          </Label>
          <OtpInput value={code} onChange={setCode} autoFocus={Boolean(emailFromState)} />
        </div>

        {emailFromState && (
          <p className="text-xs text-center text-muted-foreground">
            Wrong email?{" "}
            <Link to="/register" className={authLinkClassName}>
              Register again
            </Link>
          </p>
        )}

        <AuthSubmitButton loading={loading} disabled={!isFormValid}>
          Verify email
        </AuthSubmitButton>

        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-violet-200 text-violet-700 hover:bg-violet-50"
          onClick={handleResend}
          disabled={resendLoading || !hasEmail}
        >
          {resendLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <ShieldCheck className="h-4 w-4 mr-2" />
          )}
          Resend code
        </Button>
      </form>
    </AuthLayout>
  );
}
