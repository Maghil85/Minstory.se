import { useState } from "react";
import { SecondaryNav } from "../components";
import { sendSupportMessage } from "../services/orderService";
import { colors, spacing, fonts } from "../styles/theme";

const SUBJECTS = [
  "Min bok genererades inte",
  "Fråga om betalning / Swish",
  "Jag vill ändra något i min bok",
  "Tekniskt problem",
  "Fråga om handgjord bok",
  "Annat",
];

function InfoCard({ icon, title, text }) {
  return (
    <div style={{
      display: "flex", gap: spacing.lg, alignItems: "flex-start",
      padding: `${spacing.xl} ${spacing["2xl"]}`,
      background: "#fff",
      borderRadius: 14,
      border: `1.5px solid ${colors.border || "#e2e8f0"}`,
    }}>
      <span style={{ fontSize: 32, lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ fontWeight: fonts.weight.bold, fontSize: fonts.size.md, color: colors.dark || "#1a202c", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: fonts.size.sm, color: colors.textLight || "#666", lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await sendSupportMessage({
        orderId:     null,
        senderType:  "customer",
        senderName:  form.name.trim() || "Ej angivet",
        senderEmail: form.email.trim() || null,
        subject:     form.subject,
        text:        `[${form.subject}]\n\n${form.message.trim()}`,
      });
      setSent(true);
    } catch (err) {
      if (err?.code?.includes("firebase") || err?.message?.includes("Firebase")) {
        setError("Firebase är inte konfigurerat ännu — meddelandet kunde inte skickas. Kontakta oss via e-post.");
      } else {
        setError("Något gick fel. Försök igen eller kontakta oss direkt.");
      }
    } finally {
      setSending(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1.5px solid ${colors.border || "#e2e8f0"}`,
    fontSize: fonts.size.md,
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
    color: colors.text || "#222",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: fonts.size.sm,
    fontWeight: fonts.weight.semibold || 600,
    color: colors.text || "#333",
    marginBottom: spacing.sm,
  };

  return (
    <div>
      <SecondaryNav />
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #FFF3D6 0%, #FFFBF2 60%, #FFF8E8 100%)",
        borderBottom: "2px solid #F3E2B8",
        padding: `${spacing["2xl"]} ${spacing.lg}`,
        textAlign: "center",
        color: "#1F2937",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 30, marginBottom: spacing.md }}>💬</div>
          <h1 style={{
            fontSize: fonts.size["3xl"],
            fontWeight: fonts.weight.extrabold,
            margin: `0 0 ${spacing.md}`,
            fontFamily: "Georgia, serif",
            lineHeight: 1.2,
            color: colors.dark || "#1a202c",
          }}>
            Kontakta oss
          </h1>
          <p style={{
            fontSize: fonts.size.md,
            color: "#6B7280",
            lineHeight: 1.6,
            margin: 0,
          }}>
            Har du frågor om din bok, betalning eller något annat? Vi svarar så snart vi kan.
          </p>
        </div>
      </section>

      {/* ── Innehåll ─────────────────────────────────────────────── */}
      <section style={{ background: colors.light || "#FFFBF2", padding: `${spacing["5xl"]} ${spacing.lg}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: spacing["4xl"], alignItems: "start" }}>

          {/* Vänster: info */}
          <div>
            <h2 style={{
              fontSize: fonts.size["2xl"],
              fontWeight: fonts.weight.extrabold,
              color: colors.dark || "#1a202c",
              margin: `0 0 ${spacing.xl}`,
              fontFamily: "Georgia, serif",
            }}>
              Hur kan vi hjälpa dig?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: spacing.md }}>
              <InfoCard icon="📚" title="Problem med din bok?" text="Berätta vad som gick fel — vi hjälper dig att lösa det eller skapar om boken utan extra kostnad." />
              <InfoCard icon="💳" title="Fråga om betalning?" text="Har din Swish-betalning inte registrerats? Skriv till oss med belopp och tidpunkt." />
              <InfoCard icon="✍️" title="Handgjord bok?" text="Vill du ändra något i din order eller har frågor om leveranstid? Vi svarar inom 24 timmar." />
              <InfoCard icon="⏱️" title="Svarstid" text="Vi svarar normalt inom 1–4 timmar under kontorstid (mån–fre 09–17)." />
            </div>
          </div>

          {/* Höger: formulär */}
          <div style={{
            background: "#fff",
            borderRadius: 20,
            padding: `${spacing["4xl"]} ${spacing["3xl"]}`,
            boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: `${spacing["3xl"]} 0` }}>
                <div style={{ fontSize: 64, marginBottom: spacing.xl }}>✅</div>
                <h3 style={{
                  fontSize: fonts.size["2xl"],
                  fontWeight: fonts.weight.extrabold,
                  color: colors.dark || "#1a202c",
                  margin: `0 0 ${spacing.md}`,
                  fontFamily: "Georgia, serif",
                }}>
                  Meddelandet skickat!
                </h3>
                <p style={{ fontSize: fonts.size.md, color: colors.textLight || "#555", lineHeight: 1.7, margin: `0 0 ${spacing["2xl"]}` }}>
                  Tack för att du hörde av dig. Vi svarar dig på <strong>{form.email || "din e-post"}</strong> så snart vi kan.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" }); }}
                  style={{
                    padding: `${spacing.md} ${spacing["3xl"]}`,
                    borderRadius: 10,
                    border: "none",
                    background: colors.primary || "#F59E0B",
                    color: "#fff",
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.bold,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Skicka nytt meddelande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: fonts.size.xl || "20px",
                  fontWeight: fonts.weight.extrabold,
                  color: colors.dark || "#1a202c",
                  margin: `0 0 ${spacing["2xl"]}`,
                  fontFamily: "Georgia, serif",
                }}>
                  Skriv till oss
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.lg, marginBottom: spacing.lg }}>
                  <div>
                    <label style={labelStyle}>Ditt namn</label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Förnamn Efternamn"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>E-post *</label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="din@epost.se"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: spacing.lg }}>
                  <label style={labelStyle}>Ämne</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: spacing.xl }}>
                  <label style={labelStyle}>Meddelande *</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Beskriv ditt ärende så detaljerat som möjligt..."
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  />
                </div>

                {error && (
                  <div style={{
                    background: "#fff5f5",
                    border: "1px solid #fed7d7",
                    borderRadius: 8,
                    padding: "10px 14px",
                    marginBottom: spacing.lg,
                    color: "#c53030",
                    fontSize: fonts.size.sm,
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || !form.message.trim()}
                  onMouseEnter={(e) => { if (!sending) e.currentTarget.style.background = colors.primaryDark || "#D97706"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = colors.primary || "#F59E0B"; }}
                  style={{
                    width: "100%",
                    padding: `${spacing.lg} 0`,
                    borderRadius: 12,
                    border: "none",
                    background: (sending || !form.message.trim()) ? "#ccc" : (colors.primary || "#F59E0B"),
                    color: "#fff",
                    fontSize: fonts.size.lg || "18px",
                    fontWeight: fonts.weight.extrabold,
                    cursor: (sending || !form.message.trim()) ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    transition: "background 0.2s",
                  }}
                >
                  {sending ? "Skickar…" : "📨 Skicka meddelande"}
                </button>

                <p style={{ textAlign: "center", fontSize: fonts.size.xs, color: "#aaa", margin: `${spacing.md} 0 0` }}>
                  Vi svarar på din e-postadress inom 1–4 timmar (mån–fre)
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
