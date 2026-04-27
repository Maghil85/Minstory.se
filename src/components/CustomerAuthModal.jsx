import { useState } from "react";
import { signIn, createAccountAndLinkBook, resetPassword } from "../services/authService";
import { colors, fonts, spacing } from "../styles/theme";

/**
 * CustomerAuthModal — Logga in / Registrera dig
 * Props:
 *   initialTab    — "login" | "register"
 *   onClose       — () => void
 *   onSuccess     — (user) => void
 */
export function CustomerAuthModal({ initialTab = "login", onClose, onSuccess }) {
  const [tab, setTab]           = useState(initialTab);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [resetSent, setResetSent] = useState(false);
  const [showReset, setShowReset] = useState(false);

  function switchTab(t) {
    setTab(t);
    setError(null);
    setPassword("");
    setConfirm("");
    setShowReset(false);
    setResetSent(false);
  }

  function friendlyError(code) {
    switch (code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":  return "Fel e-post eller lösenord.";
      case "auth/email-already-in-use": return "Den e-postadressen är redan registrerad.";
      case "auth/invalid-email":        return "Ogiltig e-postadress.";
      case "auth/weak-password":        return "Lösenordet måste vara minst 6 tecken.";
      case "auth/too-many-requests":    return "För många försök. Försök igen om en stund.";
      case "auth/configuration-not-found": return "Firebase är inte konfigurerat ännu (VITE_FIREBASE_* saknas i .env).";
      default: return "Något gick fel. Försök igen.";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (tab === "register") {
      if (password.length < 6) { setError("Lösenordet måste vara minst 6 tecken."); return; }
      if (password !== confirm) { setError("Lösenorden matchar inte."); return; }
    }

    setLoading(true);
    try {
      let user;
      if (tab === "login") {
        user = await signIn(email, password);
      } else {
        const result = await createAccountAndLinkBook(email, password, name, null);
        user = { uid: result.uid, displayName: name, email };
      }
      onSuccess?.(user);
      onClose?.();
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  const primary = colors.primary || "#6B46C1";

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.50)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1200, padding: "0 16px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div style={{
        background: "#fff", borderRadius: 20,
        width: "min(420px,100%)",
        boxShadow: "0 12px 48px rgba(0,0,0,0.22)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${primary}, #553c9a)`,
          padding: "24px 28px 0",
          color: "#fff",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 32, marginBottom: 4 }}>✨</div>
              <h2 style={{ margin: 0, fontSize: 20, fontFamily: "Georgia, serif" }}>MinStory</h2>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>✕</button>
          </div>

          {/* Flikar */}
          <div style={{ display: "flex" }}>
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => switchTab(t)} style={{
                flex: 1, padding: "10px 0", border: "none", cursor: "pointer",
                background: "none", color: tab === t ? "#fff" : "rgba(255,255,255,0.55)",
                fontWeight: tab === t ? 700 : 500, fontSize: 14, fontFamily: "inherit",
                borderBottom: tab === t ? "2px solid #fff" : "2px solid transparent",
                transition: "all 0.15s",
              }}>
                {t === "login" ? "Logga in" : "Skapa konto"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {/* Återställ lösenord */}
          {showReset ? (
            <form onSubmit={handleReset}>
              <p style={{ fontSize: 14, color: "#555", margin: "0 0 16px" }}>
                Ange din e-post så skickar vi en länk för att återställa lösenordet.
              </p>
              {resetSent ? (
                <div style={{ background: "#f0fff4", border: "1px solid #9ae6b4", borderRadius: 8, padding: "12px 14px", color: "#276749", fontSize: 14 }}>
                  ✅ Länk skickad! Kontrollera din e-post.
                </div>
              ) : (
                <>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="din@epost.se"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box", marginBottom: 12 }}
                  />
                  {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: "0 0 10px" }}>{error}</p>}
                  <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, background: primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    {loading ? "Skickar…" : "Skicka återställningslänk"}
                  </button>
                </>
              )}
              <button type="button" onClick={() => { setShowReset(false); setResetSent(false); setError(null); }} style={{ width: "100%", marginTop: 10, padding: 10, background: "none", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, color: "#718096", cursor: "pointer" }}>
                ← Tillbaka
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              {tab === "register" && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Ditt namn</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Förnamn Efternamn"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
                  />
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>E-post</label>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="din@epost.se"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: tab === "register" ? 14 : 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Lösenord</label>
                <input
                  type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={tab === "register" ? "Minst 6 tecken" : "••••••••"}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>

              {tab === "register" && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 5 }}>Bekräfta lösenord</label>
                  <input
                    type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Upprepa lösenordet"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 8, fontSize: 14, boxSizing: "border-box", border: `1.5px solid ${confirm && confirm !== password ? "#e53e3e" : "#ddd"}` }}
                  />
                  {confirm && confirm !== password && <p style={{ color: "#e53e3e", fontSize: 12, margin: "4px 0 0" }}>Lösenorden matchar inte</p>}
                </div>
              )}

              {tab === "login" && (
                <div style={{ textAlign: "right", marginBottom: 14 }}>
                  <button type="button" onClick={() => setShowReset(true)} style={{ background: "none", border: "none", color: primary, fontSize: 13, cursor: "pointer", textDecoration: "underline", padding: 0 }}>
                    Glömt lösenordet?
                  </button>
                </div>
              )}

              {error && (
                <div style={{ background: "#fff5f5", border: "1px solid #fed7d7", borderRadius: 8, padding: "10px 14px", marginBottom: 14, color: "#c53030", fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: "100%", padding: 13,
                background: loading ? "#ccc" : `linear-gradient(135deg, ${primary}, #553c9a)`,
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginBottom: 10,
              }}>
                {loading
                  ? (tab === "login" ? "Loggar in…" : "Skapar konto…")
                  : (tab === "login" ? "Logga in" : "Skapa konto")}
              </button>

              <p style={{ textAlign: "center", fontSize: 13, color: "#888", margin: 0 }}>
                {tab === "login" ? "Inget konto? " : "Har du redan konto? "}
                <button type="button" onClick={() => switchTab(tab === "login" ? "register" : "login")}
                  style={{ background: "none", border: "none", color: primary, fontSize: 13, cursor: "pointer", fontWeight: 600, padding: 0, textDecoration: "underline" }}>
                  {tab === "login" ? "Skapa konto" : "Logga in"}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
