import { useEffect, type ReactNode } from "react";

/**
 * Bottom sheet: slides up from the base of the device frame, dims the content
 * behind it, dismisses on backdrop tap or Escape. Rendered inside `.a-device`
 * so `position: absolute` keeps it within the frame.
 */
export function Sheet({
  onClose,
  children,
  variant = "short",
  labelledBy,
}: {
  onClose: () => void;
  children: ReactNode;
  variant?: "short" | "tall";
  labelledBy?: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="a-sheet-overlay" onClick={onClose}>
      <div
        className={`a-sheet ${variant === "short" ? "a-sheet--short" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="a-sheet-handle" />
        {children}
      </div>
    </div>
  );
}
