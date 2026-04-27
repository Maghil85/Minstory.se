import { useState, useRef, useEffect } from "react";
import { colors, spacing, fonts } from "../styles/theme";

const bookFormats = [
  { value: "classic",   label: "📖 Klassisk bok (stående)" },
  { value: "landscape", label: "🎬 Liggande bok (cinematisk)" },
  { value: "digital",   label: "✨ Animerad bok (digital)" },
  { value: "comic",     label: "💥 Comic / Seriebok" },
];

const formatSizes = {
  classic: {
    icon: "📖",
    title: "Klassisk bok (stående)",
    standard: ["20 × 25 cm"],
    alternatives: ["21 × 29,7 cm (A4)", "18 × 24 cm (lite mer boklik)"],
    tip: "20 × 25 cm — perfekt barnboksformat",
  },
  landscape: {
    icon: "🎬",
    title: "Liggande bok (cinematisk)",
    standard: ["25 × 20 cm"],
    alternatives: ["29,7 × 21 cm (A4 liggande)", "30 × 20 cm (premium)"],
    tip: "25 × 20 cm — bra balans och snyggt",
  },
  digital: {
    icon: "✨",
    title: "Animerad bok (digital)",
    standard: ["9:16 — 1080 × 1920 px (mobil)"],
    alternatives: ["16:9 — 1920 × 1080 px (tablet / dator)"],
    tip: "Börja med 9:16 (mobil-anpassat)",
  },
  comic: {
    icon: "💥",
    title: "Comic / Seriebok",
    standard: ["17 × 26 cm (klassisk comic)"],
    alternatives: ["18 × 27 cm", "21 × 29,7 cm (A4)"],
    tip: "17 × 26 cm — riktig comic-känsla",
  },
};

const bookStyles = [
  { value: "barnbok",    label: "🧒 Barnbok" },
  { value: "deckare",   label: "🔍 Deckare / Thriller" },
  { value: "aventyr",   label: "⚔️ Äventyr" },
  { value: "romantik",  label: "💕 Romantik" },
  { value: "saga",      label: "🧚 Saga / Fantasy" },
  { value: "komedi",    label: "😄 Komedi" },
  { value: "biografisk",label: "📜 Biografisk / Livsberättelse" },
  { value: "scifi",     label: "🚀 Science Fiction" },
  { value: "skrack",    label: "👻 Skräck / Mystik" },
  { value: "__custom__", label: "✏️ Välj själv / Eget önskemål" },
];

function Dropdown({ label, placeholder, options, value, onChange, customText, onCustomText }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isCustom = value === "__custom__";

  // Stäng vid klick utanför
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} style={{ flex: 1 }}>
      <label style={{
        display: "block",
        fontWeight: fonts.weight.semibold,
        fontSize: fonts.size.sm,
        color: colors.text,
        marginBottom: spacing.sm,
      }}>
        {label} <span style={{ color: colors.primary }}>*</span>
      </label>

      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderRadius: open ? "12px 12px 0 0" : "12px",
          border: `1.5px solid ${value ? colors.primary : colors.border}`,
          background: colors.white,
          cursor: "pointer",
          userSelect: "none",
          fontSize: fonts.size.sm,
          color: selected ? colors.text : colors.textLight,
          fontWeight: selected ? fonts.weight.semibold : fonts.weight.normal,
          transition: "border-color 0.15s ease",
          boxSizing: "border-box",
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{
          fontSize: "11px",
          color: colors.textLighter,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          marginLeft: spacing.sm,
        }}>▼</span>
      </div>

      {/* Dropdown-lista */}
      {open && (
        <div style={{
          border: `1.5px solid ${colors.primary}`,
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          background: colors.white,
          boxShadow: "0 8px 24px rgba(245,158,11,0.12)",
          overflow: "hidden",
          zIndex: 100,
          position: "relative",
        }}>
          {options.map((opt, i) => {
            const active = value === opt.value;
            const isCustomOpt = opt.value === "__custom__";
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); if (!isCustomOpt) setOpen(false); }}
                style={{
                  padding: "11px 16px",
                  cursor: "pointer",
                  fontSize: fonts.size.sm,
                  fontWeight: active ? fonts.weight.semibold : fonts.weight.normal,
                  color: isCustomOpt ? colors.primary : active ? colors.primaryDark : colors.text,
                  background: active ? "rgba(245,158,11,0.10)" : "transparent",
                  borderLeft: active ? `3px solid ${colors.primary}` : "3px solid transparent",
                  borderTop: i > 0 ? `1px solid ${colors.border}` : "none",
                  transition: "background 0.12s ease",
                  fontStyle: isCustomOpt ? "italic" : "normal",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = colors.lightGray;
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Eget textfält när __custom__ är valt */}
      {isCustom && (
        <input
          autoFocus
          type="text"
          value={customText || ""}
          onChange={(e) => onCustomText && onCustomText(e.target.value)}
          placeholder="Beskriv din typ av bok..."
          style={{
            width: "100%",
            marginTop: spacing.sm,
            padding: "10px 14px",
            borderRadius: "10px",
            border: `1.5px solid ${colors.primary}`,
            background: "rgba(245,158,11,0.05)",
            color: colors.text,
            fontSize: fonts.size.sm,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      )}
    </div>
  );
}

export function BookFormatSelector({ selectedFormat, selectedStyle, onFormatChange, onStyleChange, customStyle, onCustomStyle }) {
  const sizeInfo = selectedFormat ? formatSizes[selectedFormat] : null;

  return (
    <div style={{ display: "flex", gap: spacing.xl }}>

      {/* Vänster: Format + storleksinfo */}
      <div style={{ flex: 1 }}>
        <Dropdown
          label="Format"
          placeholder="Välj format..."
          options={bookFormats}
          value={selectedFormat}
          onChange={onFormatChange}
        />

        {/* Storleksinformation */}
        {sizeInfo && (
          <div style={{
            marginTop: spacing.sm,
            borderRadius: "12px",
            border: `1.5px solid ${colors.border}`,
            background: "rgba(245,158,11,0.04)",
            padding: `${spacing.lg} ${spacing["2xl"]}`,
            fontSize: fonts.size.sm,
            lineHeight: 1.7,
          }}>
            {/* Standard */}
            <div style={{ marginBottom: spacing.sm }}>
              <span style={{ fontWeight: fonts.weight.semibold, color: colors.text }}>Standard: </span>
              {sizeInfo.standard.map((s, i) => (
                <span key={i} style={{
                  display: "inline-block",
                  background: colors.primary,
                  color: colors.white,
                  borderRadius: "999px",
                  padding: "2px 10px",
                  fontSize: fonts.size.xs,
                  fontWeight: fonts.weight.semibold,
                  marginLeft: "6px",
                }}>{s}</span>
              ))}
            </div>

            {/* Alternativ */}
            <div style={{ marginBottom: spacing.sm, color: colors.textLight }}>
              <span style={{ fontWeight: fonts.weight.semibold, color: colors.text }}>Alternativ: </span>
              {sizeInfo.alternatives.join("  ·  ")}
            </div>

            {/* Rekommendation */}
            <div style={{
              marginTop: spacing.sm,
              paddingTop: spacing.sm,
              borderTop: `1px solid ${colors.border}`,
              color: colors.primaryDark,
              fontWeight: fonts.weight.semibold,
            }}>
              💡 {sizeInfo.tip}
            </div>
          </div>
        )}
      </div>

      {/* Höger: Typ av bok */}
      <div style={{ flex: 1 }}>
        <Dropdown
          label="Typ av bok"
          placeholder="Välj boktyp..."
          options={bookStyles}
          value={selectedStyle}
          onChange={onStyleChange}
          customText={customStyle}
          onCustomText={onCustomStyle}
        />
      </div>

    </div>
  );
}

