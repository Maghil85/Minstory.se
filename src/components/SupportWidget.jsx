import { useState, useEffect, useRef } from "react";
import { sendSupportMessage, subscribeSupport } from "../services/orderService";
import { colors } from "../styles/theme";

/**
 * SupportWidget — flytande support-knapp för kunden.
 * Props:
 *   orderId     — valfritt, kopplar chatten till en beställning
 *   customerName — kundens namn (förfylls)
 */
export function SupportWidget({ orderId = null, customerName = "" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState(customerName);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const unsub = subscribeSupport((all) => {
      const mine = all.filter((m) => m.orderId === orderId);
      setMessages(mine);
    }, orderId);
    return () => unsub();
  }, [open, orderId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    await sendSupportMessage({
      orderId,
      senderType: "customer",
      senderName: name || "Kund",
      text: text.trim(),
    });
    setText("");
    setSending(false);
  }

  const unread = messages.filter((m) => m.senderType === "admin" && !m.read).length;

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 900 }}>
      {/* Chatt-fönster */}
      {open && (
        <div style={{
          position: "absolute", bottom: 70, right: 0,
          width: "min(360px, 94vw)", background: "#fff",
          borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            background: colors.primary || "#6B46C1", color: "#fff",
            padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>💬 Support</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Vi svarar så snart vi kan</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
          </div>

          {/* Namn-fält (om inte satt) */}
          {!customerName && (
            <div style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
              <input
                placeholder="Ditt namn (valfritt)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          )}

          {/* Meddelanden */}
          <div style={{ flex: 1, minHeight: 200, maxHeight: 320, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "#ccc", fontSize: 13, marginTop: 40 }}>
                Skriv ditt meddelande så svarar vi!
              </div>
            )}
            {messages.map((m) => {
              const isAdmin = m.senderType === "admin";
              return (
                <div key={m.id} style={{ alignSelf: isAdmin ? "flex-start" : "flex-end", maxWidth: "85%" }}>
                  <div style={{
                    background: isAdmin ? "#f0f0f0" : (colors.primary || "#6B46C1"),
                    color: isAdmin ? "#222" : "#fff",
                    borderRadius: isAdmin ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
                    padding: "9px 13px", fontSize: 13, lineHeight: 1.5,
                  }}>
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ borderTop: "1px solid #eee", padding: "10px 12px", display: "flex", gap: 8 }}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Skriv ett meddelande..."
              disabled={sending}
              style={{ flex: 1, padding: "9px 12px", borderRadius: 20, border: "1.5px solid #ddd", fontSize: 13, outline: "none" }}
            />
            <button type="submit" disabled={!text.trim() || sending} style={{
              background: colors.primary || "#6B46C1", color: "#fff",
              border: "none", borderRadius: 20, padding: "9px 16px",
              fontSize: 13, cursor: "pointer", opacity: (!text.trim() || sending) ? 0.4 : 1,
            }}>→</button>
          </form>
        </div>
      )}

      {/* Knapp */}
      <button onClick={() => setOpen((o) => !o)} style={{
        width: 56, height: 56, borderRadius: "50%",
        background: colors.primary || "#6B46C1", color: "#fff",
        border: "none", fontSize: 24, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        {open ? "✕" : "💬"}
        {!open && unread > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4, background: "#e53e3e",
            color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 5px", fontWeight: 800,
          }}>{unread}</span>
        )}
      </button>
    </div>
  );
}
