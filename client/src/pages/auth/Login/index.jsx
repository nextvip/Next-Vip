import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogIn } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout, { AuthError, AuthSuccess } from "../../../components/auth/AuthLayout";
import AuthPageHeader from "../../../components/auth/AuthPageHeader";
import AuthSubmitButton from "../../../components/auth/AuthSubmitButton";
import PasswordInput from "../../../components/auth/PasswordInput";
import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
  authMutedLinkClassName,
} from "../../../components/auth/authStyles";
import { loginUser } from "../../../services/authServices";
import { setUser } from "../../../store/auth/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";
  const flashMessage = location.state?.message;

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await loginUser({ email, password });
      dispatch(
        setUser({
          user: data.user,
          token: data.accessToken,
          tokenExpire: null,
        })
      );
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      minimal
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={authLinkClassName}>
            Sign up
          </Link>
        </>
      }
    >
      <AuthPageHeader
        icon={LogIn}
        title="Welcome back"
        description="Sign in to your account to continue publishing and automating."
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthSuccess message={flashMessage} />
        <AuthError message={error} />

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

        <div className="space-y-2">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end pt-1">
            <Link to="/forgot-password" className={`text-sm ${authMutedLinkClassName}`}>
              Forgot Password?
            </Link>
          </div>
        </div>

        <AuthSubmitButton loading={loading}>Log in</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
