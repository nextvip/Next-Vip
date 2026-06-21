import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authInputClassName, authLabelClassName } from "./authStyles";

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  required = true,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={authLabelClassName}>
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`${authInputClassName} pr-12`}
          placeholder={placeholder}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
