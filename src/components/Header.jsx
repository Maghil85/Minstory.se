import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { colors, spacing, fonts } from "../styles/theme";
import { subscribeAuthState, signOut } from "../services/authService";
import { CustomerAuthModal } from "./CustomerAuthModal";

export function Header() {
  const [user, setUser]         = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [showAuth, setShowAuth]   = useState(false);
  const [authTab, setAuthTab]     = useState("login");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const unsub = subscribeAuthState((u) => { setUser(u); setAuthReady(true); });
      return () => unsub();
    } catch {
      setAuthReady(true);
    }
  }, []);

  function openLogin()    { setAuthTab("login");    setShowAuth(true); }
  function openRegister() { setAuthTab("register"); setShowAuth(true); }

  async function handleSignOut() {
    setDropdownOpen(false);
    try { await signOut(); } catch { /* ignore */ }
  }

  return (
    <>
      <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: colors.white,
        borderBottom: `1px solid ${colors.border}`,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: `${spacing.md} ${spacing.lg}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: spacing.lg,
          flexWrap: "wrap",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.xs,
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span style={{ fontSize: "28px" }}>✨</span>
          <span 
            style={{ 
              fontSize: fonts.size["2xl"],
              fontWeight: fonts.weight.extrabold,
              color: "#D97706",
              letterSpacing: "-0.5px",
              display: "block",
            }}
          >
            MinStory
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: spacing.sm, alignItems: "center", flexWrap: "wrap" }}>
          <PrimaryNavButton to="/skapa">Skapa bok</PrimaryNavButton>

          {authReady && (
            user ? (
              /* ── Inloggad: avatar + dropdown ── */
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 14px", borderRadius: 24,
                    border: `1.5px solid ${colors.border || "#e2e8f0"}`,
                    background: "#fff", cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  <span style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: colors.primary || "#6B46C1",
                    color: "#fff", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0,
                  }}>
                    {(user.displayName || user.email || "?")[0].toUpperCase()}
                  </span>
                  <span style={{ fontSize: 13, color: "#444", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.displayName || user.email}
                  </span>
                  <span style={{ fontSize: 10, color: "#999" }}>▼</span>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#fff", borderRadius: 12, minWidth: 180,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
                    border: "1px solid #eee", overflow: "hidden", zIndex: 300,
                  }}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{user.displayName || "Mitt konto"}</div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{user.email}</div>
                    </div>
                    <Link to="/mina-sidor" onClick={() => setDropdownOpen(false)} style={{
                      display: "block", padding: "12px 16px",
                      fontSize: 14, color: "#333", textDecoration: "none",
                      fontFamily: "inherit",
                    }}>
                      📦 Mina beställningar
                    </Link>
                    <button onClick={handleSignOut} style={{
                      width: "100%", padding: "12px 16px", textAlign: "left",
                      background: "none", border: "none", fontSize: 14,
                      color: "#e53e3e", cursor: "pointer", fontFamily: "inherit",
                      borderTop: "1px solid #f0f0f0",
                    }}>
                      Logga ut
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* ── Ej inloggad: Logga in + Registrera ── */
              <button
                  onClick={openLogin}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#D97706"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#F59E0B"; e.currentTarget.style.transform = "translateY(0)"; }}
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: "12px",
                    border: "none",
                    background: "#F59E0B",
                    color: "#fff",
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.bold,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                  }}>
                  Logga in
                </button>
            )
          )}
        </nav>
      </div>
    </header>

    {showAuth && (
      <CustomerAuthModal
        initialTab={authTab}
        onClose={() => setShowAuth(false)}
        onSuccess={(u) => { setUser(u); setShowAuth(false); }}
      />
    )}
    </>
  );
}

function PrimaryNavButton({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        padding: `${spacing.md} ${spacing.lg}`,
        borderRadius: "12px",
        border: "none",
        background: "#F59E0B",
        color: colors.white,
        cursor: "pointer",
        fontWeight: fonts.weight.bold,
        fontSize: fonts.size.md,
        transition: "all 0.3s ease",
        textDecoration: "none",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = "#D97706";
        e.target.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "#F59E0B";
        e.target.style.transform = "translateY(0)";
      }}
    >
      {children}
    </Link>
  );
}
