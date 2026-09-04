import type { CSSProperties } from "react";

/**
 * File -> data URL preview with a Remove action.
 * In production, upload to storage and hold the returned URL instead.
 */
export function PhotoField({
  label,
  value,
  onChange,
  previewStyle,
  ariaLabel,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  previewStyle: CSSProperties;
  ariaLabel: string;
}) {
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {value && (
          <div
            className="photo-preview"
            role="img"
            aria-label={ariaLabel}
            style={{ ...previewStyle, backgroundImage: `url(${value})` }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label className="upload-btn">
            Choose photo
            <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
          </label>
          {value && (
            <span className="upload-clear" role="button" tabIndex={0} onClick={() => onChange("")}
              onKeyDown={(e) => { if (e.key === "Enter") onChange(""); }}>
              Remove
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
