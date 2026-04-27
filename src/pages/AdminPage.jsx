import { useState, useEffect, useRef } from "react";
import {
  subscribeOrders,
  updateOrderStatus,
  subscribeSupport,
  sendSupportMessage,
  markMessagesRead,
} from "../services/orderService";
import { colors } from "../styles/theme";
import { downloadBookAsPdf } from "../utils/pdfExport";

// ── Lösenordsskydd (enkelt, klientbaserat) ────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "minstory-admin-2026";

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#f4f6fa",
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff", borderRadius: 16, padding: "40px 48px",
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)", minWidth: 320, textAlign: "center",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <h2 style={{ margin: "0 0 8px", color: colors.dark, fontFamily: "Georgia, serif" }}>Admin</h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Minstory.se — Bokarent Sverige AB</p>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          placeholder="Lösenord"
          autoFocus
          style={{
            width: "100%", padding: "12px 14px", borderRadius: 8,
            border: error ? "2px solid #e53e3e" : "1.5px solid #ddd",
            fontSize: 15, boxSizing: "border-box", marginBottom: 8,
          }}
        />
        {error && <p style={{ color: "#e53e3e", fontSize: 13, margin: "0 0 8px" }}>Fel lösenord</p>}
        <button type="submit" style={{
          width: "100%", padding: "12px", background: colors.primary || "#6B46C1",
          color: "#fff", border: "none", borderRadius: 8, fontSize: 15,
          fontWeight: 700, cursor: "pointer", marginTop: 8,
        }}>
          Logga in
        </button>
      </form>
    </div>
  );
}

// ── Status-badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  pending:     { bg: "#FFF3E0", text: "#E65100" },
  paid:        { bg: "#E8F5E9", text: "#2E7D32" },
  processing:  { bg: "#E3F2FD", text: "#1565C0" },
  completed:   { bg: "#E8F5E9", text: "#1B5E20" },
  cancelled:   { bg: "#FFEBEE", text: "#B71C1C" },
};
const STATUS_LABELS = {
  pending:    "Inväntar betalning",
  paid:       "Betald",
  processing: "Pågår",
  completed:  "Klar",
  cancelled:  "Avbruten",
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: "#eee", text: "#555" };
  return (
    <span style={{
      background: c.bg, color: c.text, borderRadius: 20, padding: "3px 12px",
      fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ── Formatera datum ───────────────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" });
}

// ── Support-chatt för ett ärende ──────────────────────────────────────────────
function SupportChat({ orderId, customerEmail, customerName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeSupport((msgs) => {
      const filtered = msgs.filter((m) => m.orderId === orderId || (!m.orderId && orderId === null));
      setMessages(filtered);
      // Markera kundmeddelanden som lästa
      const unread = filtered.filter((m) => m.senderType === "customer" && !m.read).map((m) => m.id);
      if (unread.length) markMessagesRead(unread).catch(() => {});
    }, orderId);
    return () => unsub();
  }, [orderId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await sendSupportMessage({ orderId, senderType: "admin", text: text.trim(), senderName: "Admin" });
    setText("");
    setSending(false);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "min(560px,95vw)",
        maxHeight: "80vh", display: "flex", flexDirection: "column",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #eee",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <strong style={{ fontSize: 15 }}>Support — {customerName || "Kund"}</strong>
            <div style={{ fontSize: 12, color: "#888" }}>{customerEmail}</div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999",
          }}>✕</button>
        </div>

        {/* Meddelanden */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <p style={{ color: "#bbb", textAlign: "center", fontSize: 14, marginTop: 40 }}>Inga meddelanden ännu</p>
          )}
          {messages.map((m) => {
            const isAdmin = m.senderType === "admin";
            return (
              <div key={m.id} style={{
                alignSelf: isAdmin ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}>
                <div style={{
                  background: isAdmin ? (colors.primary || "#6B46C1") : "#f0f0f0",
                  color: isAdmin ? "#fff" : "#222",
                  borderRadius: isAdmin ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 3, textAlign: isAdmin ? "right" : "left" }}>
                  {isAdmin ? "Admin" : (m.senderName || "Kund")} · {formatDate(m.createdAt)}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{
          borderTop: "1px solid #eee", padding: "12px 16px",
          display: "flex", gap: 8,
        }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Skriv svar till kunden..."
            disabled={sending}
            style={{
              flex: 1, padding: "10px 14px", borderRadius: 24,
              border: "1.5px solid #ddd", fontSize: 14, outline: "none",
            }}
          />
          <button type="submit" disabled={sending || !text.trim()} style={{
            background: colors.primary || "#6B46C1", color: "#fff",
            border: "none", borderRadius: 24, padding: "10px 20px",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            opacity: (!text.trim() || sending) ? 0.5 : 1,
          }}>
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Order-detalj modal ────────────────────────────────────────────────────────
function OrderModal({ order, onClose, onStatusChange, onOpenChat }) {
  const [status, setStatus] = useState(order.status);
  const [showBook, setShowBook] = useState(false);
  const [dlPdf, setDlPdf] = useState(false);

  async function handleStatus(s) {
    setStatus(s);
    await updateOrderStatus(order.id, s);
    onStatusChange(order.id, s);
  }

  const statuses = ["pending", "paid", "processing", "completed", "cancelled"];
  const hasBook = order.type === "ai" && order.bookPages && order.bookPages.length > 0;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: 16, width: "min(640px,95vw)",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)", padding: "28px 32px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{order.personName || "—"}</h2>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{order.email}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999" }}>✕</button>
        </div>

        {/* Info-grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 20 }}>
          {[
            ["Typ", order.type === "handgjord" ? "✍️ Handgjord" : "🤖 AI"],
            ["Status", <StatusBadge key="s" status={status} />],
            ["Sidor", order.pageCount],
            ["Format", order.bookFormat || "—"],
            ["Stil", order.bookStyle || "—"],
            ["Ålder", order.personAge || "—"],
            ["Relation", order.relation || "—"],
            ["Boktitel", order.bookTitle || "—"],
            ["Datum", formatDate(order.createdAt)],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
              <div style={{ fontSize: 14, color: "#222", marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>

        {order.description && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Beskrivning</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 4, lineHeight: 1.5 }}>{order.description}</div>
          </div>
        )}
        {order.storyIdea && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Bokidé</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 4, lineHeight: 1.5 }}>{order.storyIdea}</div>
          </div>
        )}

        {/* Ändra status */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#999", fontWeight: 700, marginBottom: 8 }}>ÄNDRA STATUS</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {statuses.map((s) => (
              <button key={s} onClick={() => handleStatus(s)} style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                border: "2px solid " + (status === s ? (STATUS_COLORS[s]?.text || "#555") : "#ddd"),
                background: status === s ? (STATUS_COLORS[s]?.bg || "#eee") : "#fff",
                color: status === s ? (STATUS_COLORS[s]?.text || "#555") : "#888",
                cursor: "pointer",
              }}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bokinnehåll (AI-böcker) ── */}
        {hasBook && (
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowBook((v) => !v)}
              style={{
                width: "100%", textAlign: "left", padding: "12px 16px",
                background: "#f9f7ff", border: "1.5px solid #e0d7ff",
                borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                fontSize: 14, fontWeight: 700, color: "#6B46C1",
              }}
            >
              <span>📖 Visa boken ({order.bookPages.length} sidor)</span>
              {hasBook && (
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setDlPdf(true);
                    await downloadBookAsPdf({
                      title: order.bookTitle || `${order.personName}s bok`,
                      format: order.bookFormat || "classic",
                      coverImage: order.coverImage || null,
                      pages: order.bookPages || [],
                    }).catch(console.error);
                    setDlPdf(false);
                  }}
                  disabled={dlPdf}
                  style={{
                    padding: "4px 12px", background: dlPdf ? "#e5e7eb" : "#F59E0B",
                    border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700,
                    color: dlPdf ? "#999" : "#fff", cursor: dlPdf ? "default" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {dlPdf ? "⏳ Genererar..." : "⬇️ PDF"}
                </button>
              )}
              <span style={{ fontSize: 18, color: "#bbb" }}>{showBook ? "▲" : "▼"}</span>
            </button>

            {showBook && (
              <div style={{
                border: "1.5px solid #e0d7ff", borderTop: "none",
                borderRadius: "0 0 10px 10px", maxHeight: 400,
                overflowY: "auto", background: "#fafafa",
              }}>
                {order.coverImage && (
                  <div style={{ textAlign: "center", padding: "12px 16px 0" }}>
                    <img src={order.coverImage} alt="Omslag" style={{ maxWidth: "100%", maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
                  </div>
                )}
                {order.bookPages.map((page) => (
                  <div key={page.pageNumber} style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #eee",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>
                      Sida {page.pageNumber}
                    </div>
                    {page.imageUrl && (
                      <img src={page.imageUrl} alt={`Sida ${page.pageNumber}`} style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6, marginBottom: 6 }} />
                    )}
                    <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>{page.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Knappar */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onOpenChat(order)} style={{
            flex: 1, padding: "12px", background: "#f0f0f0", border: "none",
            borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#333",
          }}>
            💬 Öppna support-chatt
          </button>
          <a href={`mailto:${order.email}?subject=Din bok — ${order.personName}`} style={{
            flex: 1, padding: "12px", background: colors.primary || "#6B46C1",
            color: "#fff", border: "none", borderRadius: 8, fontSize: 14,
            fontWeight: 700, cursor: "pointer", textDecoration: "none",
            textAlign: "center", lineHeight: "1",
          }}>
            ✉️ Skicka e-post
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Huvud-admin-sida ──────────────────────────────────────────────────────────
function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [allSupport, setAllSupport] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatOrder, setChatOrder] = useState(null);
  const [tab, setTab] = useState("orders"); // "orders" | "support"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const unsub1 = subscribeOrders(setOrders);
    const unsub2 = subscribeSupport(setAllSupport);
    return () => { unsub1(); unsub2(); };
  }, []);

  function handleStatusChange(id, status) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  }

  // Olästa kundmeddelanden
  const unreadCount = allSupport.filter((m) => m.senderType === "customer" && !m.read).length;

  // Filtrera beställningar
  const filtered = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (filterType !== "all" && o.type !== filterType) return false;
    const s = searchTerm.toLowerCase();
    if (!s) return true;
    return (
      o.personName?.toLowerCase().includes(s) ||
      o.email?.toLowerCase().includes(s) ||
      o.bookTitle?.toLowerCase().includes(s)
    );
  });

  // Gruppera support-trådar per orderId
  const supportThreads = Object.values(
    allSupport.reduce((acc, m) => {
      const key = m.orderId || "__general__";
      if (!acc[key]) acc[key] = { orderId: m.orderId, messages: [] };
      acc[key].messages.push(m);
      return acc;
    }, {})
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fa", fontFamily: "system-ui, sans-serif" }}>
      {/* Top-bar */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56, position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: colors.dark }}>📚 Minstory Admin</span>
          <div style={{ display: "flex", gap: 4 }}>
            {["orders", "support"].map((t) => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700,
                border: "none", cursor: "pointer",
                background: tab === t ? (colors.primary || "#6B46C1") : "transparent",
                color: tab === t ? "#fff" : "#666",
                position: "relative",
              }}>
                {t === "orders" ? `Beställningar (${orders.length})` : "Support"}
                {t === "support" && unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: 2, right: 4,
                    background: "#e53e3e", color: "#fff", borderRadius: 10,
                    fontSize: 10, padding: "1px 5px", fontWeight: 800,
                  }}>{unreadCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => { sessionStorage.removeItem("admin_auth"); window.location.reload(); }}
          style={{ background: "none", border: "1.5px solid #ddd", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: "#666" }}>
          Logga ut
        </button>
      </div>

      <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {/* ── BESTÄLLNINGAR-TAB ── */}
        {tab === "orders" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Totalt", value: orders.length, icon: "📦" },
                { label: "Betalda", value: orders.filter((o) => o.status === "paid" || o.status === "completed").length, icon: "✅" },
                { label: "Inväntar", value: orders.filter((o) => o.status === "pending").length, icon: "⏳" },
                { label: "AI-böcker", value: orders.filter((o) => o.type === "ai").length, icon: "🤖" },
                { label: "Handgjorda", value: orders.filter((o) => o.type === "handgjord").length, icon: "✍️" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "#fff", borderRadius: 12, padding: "16px 20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)", textAlign: "center",
                }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: colors.dark }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Filter-rad */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input
                placeholder="🔍 Sök namn, e-post, titel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1, minWidth: 200, padding: "9px 14px", borderRadius: 8,
                  border: "1.5px solid #ddd", fontSize: 14,
                }}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, background: "#fff" }}>
                <option value="all">Alla statusar</option>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, background: "#fff" }}>
                <option value="all">Alla typer</option>
                <option value="ai">AI</option>
                <option value="handgjord">Handgjord</option>
              </select>
            </div>

            {/* Tabell */}
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: "#bbb", fontSize: 15 }}>Inga beställningar hittades</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f0f0f0", background: "#fafafa" }}>
                      {["Datum", "Namn", "E-post", "Bok / Ämne", "Pris", "Typ", "Sidor", "Status", ""].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => {
                      const threads = allSupport.filter((m) => m.orderId === order.id);
                      const hasUnread = threads.some((m) => m.senderType === "customer" && !m.read);
                      return (
                        <tr key={order.id} style={{
                          borderBottom: "1px solid #f4f4f4",
                          cursor: "pointer", transition: "background 0.15s",
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9fc"}
                          onMouseLeave={(e) => e.currentTarget.style.background = ""}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#888", whiteSpace: "nowrap" }}>{formatDate(order.createdAt)}</td>
                          <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#222" }}>
                            {order.personName || "—"}
                            {hasUnread && <span style={{ marginLeft: 6, background: "#e53e3e", color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px" }}>Nytt</span>}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{order.email || "—"}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#333", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={order.bookTitle || order.storyIdea || ""}>{(order.bookTitle || order.storyIdea || "—").slice(0, 30)}{(order.bookTitle || order.storyIdea || "").length > 30 ? "…" : ""}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#1a202c", whiteSpace: "nowrap" }}>{order.price ? `${order.price} kr` : "—"}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13 }}>{order.type === "handgjord" ? "✍️ Handgjord" : "🤖 AI"}</td>
                          <td style={{ padding: "14px 16px", fontSize: 13, color: "#555" }}>{order.pageCount}</td>
                          <td style={{ padding: "14px 16px" }}><StatusBadge status={order.status} /></td>
                          <td style={{ padding: "14px 16px" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setChatOrder(order); }}
                              style={{
                                background: "none", border: "1.5px solid #ddd", borderRadius: 8,
                                padding: "5px 12px", fontSize: 12, cursor: "pointer", color: "#555",
                              }}
                            >
                              💬
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── SUPPORT-TAB ── */}
        {tab === "support" && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: colors.dark }}>Support-trådar</h3>
            {supportThreads.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#bbb", fontSize: 15 }}>Inga support-meddelanden ännu</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {supportThreads.map((t) => {
                  const relatedOrder = orders.find((o) => o.id === t.orderId);
                  const lastMsg = t.messages[t.messages.length - 1];
                  const unread = t.messages.filter((m) => m.senderType === "customer" && !m.read).length;
                  // Kontaktformulär-ärenden saknar orderId — visa avsändarinfo från meddelandet
                  const firstCustomerMsg = t.messages.find((m) => m.senderType === "customer");
                  const displayName  = relatedOrder?.personName || firstCustomerMsg?.senderName || "Okänd";
                  const displayEmail = relatedOrder?.email      || firstCustomerMsg?.senderEmail || "";
                  const subject      = firstCustomerMsg?.subject || null;
                  return (
                    <div key={t.orderId || "__general__"} style={{
                      background: "#fff", borderRadius: 12, padding: "16px 20px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.07)", cursor: "pointer",
                      border: unread ? "2px solid #e53e3e" : "2px solid transparent",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                      onClick={() => setChatOrder(relatedOrder || { id: t.orderId, email: displayEmail, personName: displayName })}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#222" }}>
                          {displayName}
                          {unread > 0 && <span style={{ marginLeft: 8, background: "#e53e3e", color: "#fff", borderRadius: 10, fontSize: 11, padding: "2px 7px" }}>{unread} nytt</span>}
                        </div>
                        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{displayEmail}</div>
                        {subject && <div style={{ fontSize: 12, color: "#6B46C1", marginTop: 2, fontWeight: 600 }}>📌 {subject}</div>}
                        <div style={{ fontSize: 13, color: "#555", marginTop: 4, maxWidth: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {lastMsg?.text}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#bbb", marginLeft: 16, whiteSpace: "nowrap" }}>
                        {formatDate(lastMsg?.createdAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modaler */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          onOpenChat={(o) => { setSelectedOrder(null); setChatOrder(o); }}
        />
      )}
      {chatOrder && (
        <SupportChat
          orderId={chatOrder.id}
          customerEmail={chatOrder.email}
          customerName={chatOrder.personName}
          onClose={() => setChatOrder(null)}
        />
      )}
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function AdminPage() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("admin_auth"));
  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
