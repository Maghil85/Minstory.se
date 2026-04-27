import { useState } from "react";
import { SecondaryNav } from "../components";
import { CreateStoryForm } from "../components/CreateStoryForm";
import { colors, fonts, spacing } from "../styles/theme";

const COMING_SOON = true; // Sätt till false för att aktivera igen

export function CreateStoryPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleNotify(e) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch(`${import.meta.env.VITE_API_URL || ""}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (_) { /* ignorera nätverksfel — visa ändå bekräftelse */ }
    setSubmitted(true);
    setLoading(false);
  }

  if (!COMING_SOON) {
    return (
      <main>
        <SecondaryNav />
        <CreateStoryForm />
      </main>
    );
  }

  return (
    <main>
      <SecondaryNav />
      <section style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 16px",
      }}>
        <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>

          <div style={{ fontSize: 72, marginBottom: 24, filter: "drop-shadow(0 4px 24px rgba(245,158,11,0.4))" }}>✨</div>

          <h1 style={{
            color: "#fff",
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: 900,
            fontFamily: "Georgia, serif",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}>
            Öppnar snart
          </h1>

          <p style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 17,
            lineHeight: 1.7,
            margin: "0 auto 40px",
            maxWidth: 400,
          }}>
            Vi håller på att finslipa upplevelsen. Skriv upp dig så meddelar vi dig direkt när vi öppnar!
          </p>

          {submitted ? (
            <div style={{
              background: "rgba(0,168,112,0.15)",
              border: "1px solid rgba(0,168,112,0.4)",
              borderRadius: 16,
              padding: "24px 28px",
              color: "#fff",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Tack! Vi hör av oss.</p>
              <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>{email}</p>
            </div>
          ) : (
            <form onSubmit={handleNotify} style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                required
                placeholder="din@epost.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: "1 1 220px",
                  padding: "14px 18px",
                  borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button type="submit" disabled={loading} style={{
                flex: "0 0 auto",
                padding: "14px 28px",
                borderRadius: 12,
                border: "none",
                background: loading ? "#888" : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              }}>
                {loading ? "Skickar…" : "Meddela mig"}
              </button>
            </form>
          )}

          <p style={{ marginTop: 40, color: "rgba(255,255,255,0.30)", fontSize: 13 }}>
            Har du frågor?{" "}
            <a href="mailto:kontakt@minstory.se" style={{ color: colors.primary, textDecoration: "none" }}>
              kontakt@minstory.se
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
