import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout, { AuthError } from "../../../components/auth/AuthLayout";
import AuthPageHeader from "../../../components/auth/AuthPageHeader";
import AuthSubmitButton from "../../../components/auth/AuthSubmitButton";
import PasswordInput from "../../../components/auth/PasswordInput";
import {
  authInputClassName,
  authLabelClassName,
  authLinkClassName,
} from "../../../components/auth/authStyles";
import { registerUser } from "../../../services/authServices";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await registerUser(form);
      navigate("/activate", {
        replace: true,
        state: {
          email: form.email,
          message: data.message,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      minimal
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className={authLinkClassName}>
            Sign in
          </Link>
        </>
      }
    >
      <AuthPageHeader
        icon={UserPlus}
        title="Create your account"
        description="Start automating content across TikTok, Instagram, Facebook, and YouTube."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthError message={error} />

        <div className="space-y-2">
          <Label htmlFor="name" className={authLabelClassName}>
            Full name
          </Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className={authLabelClassName}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={authInputClassName}
            placeholder="you@example.com"
            required
          />
        </div>

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
      </form>
    </AuthLayout>
  );
}
