import { Link } from "react-router-dom";
import { colors, fonts, spacing, radius, shadows } from "../styles/theme";

/**
 * Primär CTA-knapp (Lila/purple)
 */
export function PrimaryButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: radius.lg,
        border: "none",
        background: colors.primary,
        color: colors.white,
        cursor: "pointer",
        fontWeight: fonts.weight.bold,
        fontSize: fonts.size.lg,
        transition: "all 0.3s ease",
        boxShadow: shadows.md,
        ...style,
      }}
      onMouseEnter={(e) => {
        e.target.style.background = colors.primaryDark;
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = shadows.lg;
      }}
      onMouseLeave={(e) => {
        e.target.style.background = colors.primary;
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = shadows.md;
      }}
    >
      {children}
    </button>
  );
}

/**
 * Sekundär knapp (vit med border)
 */
export function SecondaryButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border}`,
        background: colors.white,
        cursor: "pointer",
        fontWeight: fonts.weight.bold,
        fontSize: fonts.size.lg,
        transition: "all 0.3s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = colors.primary;
        e.target.style.color = colors.primary;
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = colors.border;
        e.target.style.color = colors.text;
      }}
    >
      {children}
    </button>
  );
}

/**
 * Navigation länk
 */
export function NavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: fonts.size.md,
        color: colors.primary,
        transition: "opacity 0.3s ease",
        fontWeight: fonts.weight.medium,
      }}
      onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
      onMouseLeave={(e) => (e.target.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

/**
 * Badge/tag komponent
 */
export function Badge({ children, style = {} }) {
  return (
    <span
      style={{
        fontSize: fonts.size.sm,
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: radius.full,
        border: `1px solid ${colors.border}`,
        background: colors.light,
        display: "inline-block",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Card komponent för innehål
 */
export function Card({ title, children, style = {} }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: radius.xl,
        padding: spacing.lg,
        background: colors.white,
        boxShadow: shadows.sm,
        transition: "all 0.3s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.sm;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <p style={{ margin: 0, fontWeight: fonts.weight.extrabold, fontSize: fonts.size.lg }}>
        {title}
      </p>
      <p style={{ margin: `${spacing.md} 0 0`, opacity: 0.8, lineHeight: 1.5, fontSize: fonts.size.md }}>
        {children}
      </p>
    </div>
  );
}

/**
 * Exempel-tile för showcase
 */
export function ExampleTile({ title, subtitle, text }) {
  return (
    <div
      style={{
        border: `1px solid ${colors.border}`,
        borderRadius: radius.xl,
        padding: spacing.lg,
        background: colors.white,
        boxShadow: shadows.sm,
        transition: "all 0.3s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.md;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = shadows.sm;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <p style={{ margin: 0, fontWeight: fonts.weight.extrabold, fontSize: fonts.size.lg }}>
        {title}
      </p>
      <p style={{ margin: `${spacing.xs} 0 ${spacing.md}`, opacity: 0.7, fontSize: fonts.size.sm }}>
        {subtitle}
      </p>
      <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.5, fontSize: fonts.size.md }}>
        {text}
      </p>
    </div>
  );
}

/**
 * Priskort
 */
export function PriceCard({ title, price, points, primary, onClick, buttonText, isLink, linkTo }) {
  return (
    <div
      style={{
        border: primary ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
        borderRadius: radius["2xl"],
        padding: spacing.xl,
        background: colors.white,
        boxShadow: primary ? shadows.md : shadows.sm,
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = shadows.lg;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = primary ? shadows.md : shadows.sm;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <p style={{ margin: 0, fontWeight: fonts.weight.extrabold, fontSize: fonts.size.lg }}>
        {title}
      </p>
      <p style={{ margin: `${spacing.md} 0 ${spacing.lg}`, fontSize: "34px", fontWeight: fonts.weight.extrabold }}>
        {price}
      </p>
      <ul style={{ margin: 0, paddingLeft: spacing.lg, opacity: 0.85, lineHeight: 1.8, fontSize: fonts.size.md }}>
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <div style={{ marginTop: spacing.lg }}>
        {isLink && linkTo ? (
          <Link to={linkTo} style={{ textDecoration: "none", display: "block" }}>
            {primary ? (
              <PrimaryButton style={{ width: "100%" }}>
                {buttonText}
              </PrimaryButton>
            ) : (
              <SecondaryButton style={{ width: "100%" }}>
                {buttonText}
              </SecondaryButton>
            )}
          </Link>
        ) : (
          <>
            {primary ? (
              <PrimaryButton onClick={onClick} style={{ width: "100%" }}>
                {buttonText}
              </PrimaryButton>
            ) : (
              <SecondaryButton onClick={onClick} style={{ width: "100%" }}>
                {buttonText}
              </SecondaryButton>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Input för ljus bakgrund
 */
export function Input({ label, placeholder, value, onChange, type = "text", style = {} }) {
  return (
    <label style={{ display: "grid", gap: spacing.xs }}>
      <span style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.sm }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          background: colors.light,
          outline: "none",
          fontSize: fonts.size.lg,
          transition: "all 0.3s ease",
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
          e.target.style.boxShadow = `0 0 0 3px ${colors.pastelLila}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border;
          e.target.style.boxShadow = "none";
        }}
      />
    </label>
  );
}

/**
 * Textarea för ljus bakgrund
 */
export function Textarea({ label, placeholder, value, onChange, rows = 4, style = {} }) {
  return (
    <label style={{ display: "grid", gap: spacing.xs }}>
      <span style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.sm }}>{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          padding: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          background: colors.light,
          outline: "none",
          fontSize: fonts.size.lg,
          resize: "vertical",
          transition: "all 0.3s ease",
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
          e.target.style.boxShadow = `0 0 0 3px ${colors.pastelLila}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border;
          e.target.style.boxShadow = "none";
        }}
      />
    </label>
  );
}

/**
 * Select/dropdown för ljus bakgrund
 */
export function Select({ label, value, onChange, options, style = {} }) {
  return (
    <label style={{ display: "grid", gap: spacing.xs }}>
      <span style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.sm }}>{label}</span>
      <select
        value={value}
        onChange={onChange}
        style={{
          padding: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${colors.border}`,
          background: colors.white,
          outline: "none",
          fontSize: fonts.size.lg,
          transition: "all 0.3s ease",
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.border;
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * Input för dark bakgrund
 */
export function DarkInput({ label, placeholder, value, onChange, type = "text", style = {} }) {
  return (
    <label style={{ display: "grid", gap: spacing.xs }}>
      <span style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.sm }}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${colors.darkBorder}`,
          background: colors.darkInput,
          color: colors.white,
          outline: "none",
          fontSize: fonts.size.lg,
          transition: "all 0.3s ease",
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.darkBorder;
        }}
      />
    </label>
  );
}

/**
 * Textarea för dark bakgrund
 */
export function DarkTextarea({ label, placeholder, value, onChange, rows = 4, style = {} }) {
  return (
    <label style={{ display: "grid", gap: spacing.xs }}>
      <span style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.sm }}>{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        style={{
          padding: spacing.md,
          borderRadius: radius.md,
          border: `1px solid ${colors.darkBorder}`,
          background: colors.darkInput,
          color: colors.white,
          outline: "none",
          fontSize: fonts.size.lg,
          resize: "vertical",
          transition: "all 0.3s ease",
          ...style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = colors.primary;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = colors.darkBorder;
        }}
      />
    </label>
  );
}

/**
 * StoryType selector - kort med ikon och val
 */
export function StoryTypeCard({ story, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: spacing.lg,
        borderRadius: radius.xl,
        border: isSelected ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
        background: isSelected ? colors.pastelLila : colors.white,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: isSelected ? shadows.md : shadows.sm,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = shadows.sm;
          e.currentTarget.style.transform = "translateY(0)";
        }
      }}
    >
      <div style={{ fontSize: "32px", marginBottom: spacing.md }}>{story.icon}</div>
      <p style={{ margin: 0, fontWeight: fonts.weight.bold, fontSize: fonts.size.md }}>
        {story.name}
      </p>
      <p style={{ margin: `${spacing.xs} 0 0`, fontSize: fonts.size.sm, opacity: 0.7 }}>
        {story.description}
      </p>
    </div>
  );
}
