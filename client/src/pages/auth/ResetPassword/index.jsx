import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout, { AuthError, Button } from "../../../components/auth/AuthLayout";
import AuthSubmitButton from "../../../components/auth/AuthSubmitButton";
import { resetPassword } from "../../../services/authServices";
import { setUser } from "../../../store/auth/authSlice";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await resetPassword(token, { newPassword, confirmPassword });
      dispatch(
        setUser({
          user: data.user,
          token: data.accessToken,
          tokenExpire: null,
        })
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      description="Choose a strong password for your account"
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error} />
        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <AuthSubmitButton loading={loading}>Update password</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
