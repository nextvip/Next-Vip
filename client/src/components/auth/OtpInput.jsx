import { useRef, useEffect } from "react";

const BOX_CLASS =
  "h-12 w-11 sm:w-12 rounded-xl border border-violet-100 bg-violet-50/70 text-center text-lg font-semibold text-slate-800 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/25";

export default function OtpInput({ value, onChange, autoFocus = false }) {
  const inputsRef = useRef([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const updateValue = (index, char) => {
    const next = value.split("");
    next[index] = char;
    onChange(next.join("").replace(/\s/g, "").slice(0, 6));
  };

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    updateValue(index, char);
    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        updateValue(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        updateValue(index - 1, "");
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit.trim()}
          aria-label={`Digit ${index + 1}`}
          className={BOX_CLASS}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
