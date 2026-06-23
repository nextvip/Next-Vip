import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export default function TypewriterText({
  words,
  className,
  cursorClassName,
  typingSpeed = 85,
  deletingSpeed = 55,
  pauseMs = 2200,
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const longestWord = useMemo(
    () => words.reduce((a, b) => (a.length > b.length ? a : b), ""),
    [words]
  );

  useEffect(() => {
    const current = words[wordIndex % words.length];
    let timeout;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    } else if (isDeleting) {
      timeout = setTimeout(
        () => setText(current.slice(0, text.length - 1)),
        deletingSpeed
      );
    } else {
      timeout = setTimeout(
        () => setText(current.slice(0, text.length + 1)),
        typingSpeed
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseMs]);

  return (
    <span
      className="inline-flex items-baseline whitespace-nowrap"
      style={{ minWidth: `${longestWord.length}ch` }}
    >
      <span className={className}>{text}</span>
      <span
        className={cn(
          "ml-0.5 inline-block w-1 shrink-0 rounded-full bg-violet-500 animate-pulse align-baseline",
          cursorClassName
        )}
        style={{ height: "0.75em" }}
        aria-hidden
      />
    </span>
  );
}
