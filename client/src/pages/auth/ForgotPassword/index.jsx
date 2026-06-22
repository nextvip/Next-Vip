import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout, { AuthError, AuthSuccess } from "../../../components/auth/AuthLayout";
import AuthPageHeader from "../../../components/auth/AuthPageHeader";
import AuthSubmitButton from "../../../components/auth/AuthSubmitButton";
import {
  authInputClassName,
  authLabelClassName,
  authMutedLinkClassName,
} from "../../../components/auth/authStyles";
import { forgotPassword } from "../../../services/authServices";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await forgotPassword({ email });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
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
        icon={KeyRound}
        title="Forgot password?"
        description="Enter your email and we'll send you a link to reset your password."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthError message={error} />
        <AuthSuccess message={success} />

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

        <AuthSubmitButton loading={loading}>Send reset link</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
