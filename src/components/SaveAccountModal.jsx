import { useState } from "react";
import { createAccountAndLinkBook } from "../services/authService";
import { colors, fonts, spacing } from "../styles/theme";

/**
 * SaveAccountModal — visas efter bokgenerering.
 * Props:
 *   prefillEmail  — e-post från formuläret
 *   prefillName   — personens namn
 *   orderId       — Firestore-id att koppla till kontot
 *   onSaved       — () => void, kallas när konto skapats
 *   onDismiss     — () => void, kallas om användaren stänger
 */
export function SaveAccountModal({ prefillEmail = "", prefillName = "", orderId, onSaved, onDismiss }) {
  const [email, setEmail]       = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [done, setDone]         = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Lösenordet måste vara minst 6 tecken.");
      return;
    }
    if (password !== confirm) {
      setError("Lösenorden matchar inte.");
      return;
    }

    setLoading(true);
    try {
      await createAccountAndLinkBook(email, password, prefillName, orderId);
      setDone(true);
      onSaved?.();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Den e-postadressen är redan registrerad. Logga in istället.");
      } else if (err.code === "auth/invalid-email") {
        setError("Ogiltig e-postadress.");
      } else if (err.code === "auth/configuration-not-found" || err.code?.includes("firebase")) {
        setError("Firebase är inte konfigurerat ännu. Fyll i VITE_FIREBASE_*-variablerna i .env.");
      } else {
        setError(err.message || "Något gick fel. Försök igen.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1100, padding: "0 16px",
    }}
      onClick={(e) => e.target === e.currentTarget && onDismiss?.()}
    >
      <div style={{
        background: "#fff", borderRadius: 20,
        width: "min(440px, 100%)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}>
        {/* Grön topp-banner */}
        <div style={{
          background: "linear-gradient(135deg, #2f855a, #276749)",
          padding: "24px 28px 20px",
          color: "#fff",
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontFamily: "Georgia, serif" }}>
            Din bok är klar!
          </h2>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
            Spara ditt konto för att komma åt boken när som helst.
          </p>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {done ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h3 style={{ margin: "0 0 8px", color: colors.dark || "#1a202c" }}>Konto skapat!</h3>
              <p style={{ color: "#555", fontSize: 14, margin: "0 0 20px" }}>
                Din bok är sparad och kopplad till ditt konto.
              </p>
              <button onClick={onDismiss} style={{
                padding: "12px 28px", background: colors.primary || "#6B46C1",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>
                Fortsätt
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>
                  Välj lösenord
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minst 6 tecken"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box",
                  }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>
                  Bekräfta lösenord
                </label>
                <input
                  type="password"
                  required
                  placeholder="Upprepa lösenordet"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: `1.5px solid ${confirm && confirm !== password ? "#e53e3e" : "#ddd"}`,
                    fontSize: 14, boxSizing: "border-box",
                  }}
                />
                {confirm && confirm !== password && (
                  <p style={{ color: "#e53e3e", fontSize: 12, margin: "4px 0 0" }}>Lösenorden matchar inte</p>
                )}
              </div>

              {error && (
                <div style={{
                  background: "#fff5f5", border: "1px solid #fed7d7",
                  borderRadius: 8, padding: "10px 14px", marginBottom: 14,
                  color: "#c53030", fontSize: 13,
                }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "13px",
                background: loading ? "#ccc" : "linear-gradient(135deg, #2f855a, #276749)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                marginBottom: 10,
              }}>
                {loading ? "Skapar konto…" : "✅ Skapa konto och spara bok"}
              </button>

              <button type="button" onClick={onDismiss} style={{
                width: "100%", padding: "11px",
                background: "none", border: "1.5px solid #e2e8f0",
                borderRadius: 10, fontSize: 14, color: "#718096",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                Nej tack, fortsätt utan konto
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
