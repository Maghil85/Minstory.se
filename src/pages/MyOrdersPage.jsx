import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribeAuthState, signOut } from "../services/authService";
import { subscribeCustomerOrders } from "../services/orderService";
import { downloadBookAsPdf } from "../utils/pdfExport";
import { colors, fonts, spacing } from "../styles/theme";

const STATUS_LABEL = {
  pending:    { text: "Väntar",      bg: "#FFF7ED", color: "#C05621" },
  paid:       { text: "Betald",      bg: "#F0FFF4", color: "#276749" },
  processing: { text: "Skapas",      bg: "#EBF8FF", color: "#2B6CB0" },
  completed:  { text: "Klar",        bg: "#F0FFF4", color: "#22543D" },
  cancelled:  { text: "Avbruten",    bg: "#FFF5F5", color: "#C53030" },
};

const TYPE_LABEL = {
  ai:        "AI-bok",
  handgjord: "Handgjord bok",
};

function StatusBadge({ status }) {
  const { text, bg, color } = STATUS_LABEL[status] || { text: status, bg: "#F7FAFC", color: "#718096" };
  return (
    <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: bg, color, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
}

function OrderCard({ order }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const primary = colors.primary || "#F59E0B";

  async function handleDownloadPdf() {
    setDownloadingPdf(true);
    try {
      await downloadBookAsPdf({
        title:      order.bookTitle || order.storyIdea || "bok",
        format:     order.bookFormat || "classic",
        coverImage: order.coverImage || null,
        pages:      (order.bookPages || []).map((p) => ({
          pageNumber: p.pageNumber,
          text:       p.text || "",
          imageUrl:   p.imageUrl || null,
        })),
      });
    } finally {
      setDownloadingPdf(false);
    }
  }

  const canDownloadPdf = order.type === "ai" && (order.bookPages?.length > 0);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      border: "1px solid #EDF2F7",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      overflow: "hidden",
      marginBottom: 16,
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: "1px solid #F7FAFC",
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>{order.type === "ai" ? "🤖" : "✍️"}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1A202C" }}>
              {order.bookTitle || order.storyIdea || "Din bok"}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
              {TYPE_LABEL[order.type] || order.type} · {formatDate(order.createdAt)}
            </div>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Details */}
      <div style={{ padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: "10px 32px" }}>
        {order.personName && (
          <div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Huvudperson</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 2 }}>{order.personName}</div>
          </div>
        )}
        {order.pageCount && (
          <div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sidor</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 2 }}>{order.pageCount}</div>
          </div>
        )}
        {order.price > 0 && (
          <div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pris</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 2 }}>{order.price} kr</div>
          </div>
        )}
        {order.bookFormat && (
          <div>
            <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Format</div>
            <div style={{ fontSize: 14, color: "#333", marginTop: 2, textTransform: "capitalize" }}>{order.bookFormat}</div>
          </div>
        )}
      </div>

      {/* AI book pages preview + PDF download */}
      {order.type === "ai" && (order.coverImage || canDownloadPdf) && (
        <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {order.coverImage && (
            <img
              src={order.coverImage}
              alt="Omslag"
              style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #eee", flexShrink: 0 }}
            />
          )}
          <div style={{ flex: 1, fontSize: 13, color: "#666" }}>
            Din bok har {order.bookPages?.length || 0} sidor.
          </div>
          {canDownloadPdf && (
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              style={{
                padding: "8px 16px", borderRadius: 10,
                border: "none",
                background: downloadingPdf ? "#E2E8F0" : `linear-gradient(135deg, ${primary}, #D97706)`,
                color: downloadingPdf ? "#999" : "#fff",
                fontSize: 13, fontWeight: 700, cursor: downloadingPdf ? "not-allowed" : "pointer",
                fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0,
              }}
            >
              {downloadingPdf ? "Genererar PDF…" : "⬇ Ladda ner PDF"}
            </button>
          )}
        </div>
      )}

      {/* Status message */}
      {order.status === "pending" && (
        <div style={{ margin: "0 20px 16px", padding: "10px 14px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FCD34D", fontSize: 13, color: "#92400E" }}>
          📨 Din beställning är mottagen. Vi hör av oss inom 1–2 arbetsdagar.
        </div>
      )}
      {order.status === "processing" && (
        <div style={{ margin: "0 20px 16px", padding: "10px 14px", background: "#EBF8FF", borderRadius: 10, border: "1px solid #BEE3F8", fontSize: 13, color: "#2C5282" }}>
          ✏️ Din bok skapas just nu. Vi meddelar när den är klar!
        </div>
      )}
    </div>
  );
}

export function MyOrdersPage() {
  const [user, setUser]     = useState(undefined); // undefined = loading
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const primary  = colors.primary || "#F59E0B";

  // Auth state
  useEffect(() => {
    const unsub = subscribeAuthState((u) => setUser(u));
    return () => unsub();
  }, []);

  // Redirect to home if not logged in (after auth loaded)
  useEffect(() => {
    if (user === null) navigate("/", { replace: true });
  }, [user, navigate]);

  // Load orders
  useEffect(() => {
    if (!user?.email) return;
    setOrdersLoading(true);
    const unsub = subscribeCustomerOrders(user.email, (data) => {
      setOrders(data);
      setOrdersLoading(false);
    });
    return () => unsub();
  }, [user?.email]);

  async function handleSignOut() {
    try { await signOut(); } catch { /* ignore */ }
    navigate("/");
  }

  // Still loading auth
  if (user === undefined) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#999" }}>
        Laddar…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: `48px ${spacing.lg || "24px"}` }}>

      {/* Rubrik */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontFamily: "Georgia, serif", color: "#1A202C" }}>
              Mina beställningar
            </h1>
            <p style={{ margin: "6px 0 0", fontSize: 14, color: "#718096" }}>
              {user.displayName ? `Hej ${user.displayName}!` : user.email}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              padding: "8px 16px", borderRadius: 10,
              border: "1.5px solid #E2E8F0", background: "#fff",
              fontSize: 13, color: "#718096", cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Logga ut
          </button>
        </div>
      </div>

      {/* Orders */}
      {ordersLoading ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "#999", fontSize: 15 }}>
          Hämtar dina beställningar…
        </div>
      ) : orders.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "56px 24px",
          background: "#FFFBF0", borderRadius: 20,
          border: "1.5px dashed #FCD34D",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "#1A202C" }}>Inga beställningar ännu</h2>
          <p style={{ margin: "0 0 24px", color: "#718096", fontSize: 14 }}>
            Beställningar kopplade till <strong>{user.email}</strong> visas här.
          </p>
          <a
            href="/skapa"
            style={{
              display: "inline-block", padding: "12px 28px",
              background: primary, color: "#fff",
              borderRadius: 12, textDecoration: "none",
              fontWeight: 700, fontSize: 14,
            }}
          >
            Skapa din första bok →
          </a>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>
            {orders.length} beställning{orders.length !== 1 ? "ar" : ""}
          </div>
          {orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </div>
      )}

      {/* Help link */}
      {orders.length > 0 && (
        <div style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "#999" }}>
          Frågor om en beställning?{" "}
          <a href="/kontakt" style={{ color: primary, textDecoration: "none", fontWeight: 600 }}>Kontakta oss</a>
        </div>
      )}
    </div>
  );
}
