import { colors, fonts } from "../styles/theme";

/**
 * BookPage – renderar en enskild boksida som en riktig boksida.
 * Layout anpassas fullt efter valt bokformat:
 *  classic   → stående (3:4), bild övre 60%, text nedre med serif-typografi
 *  landscape → liggande (16:9), bild vänster 55%, textpanel höger
 *  digital   → mobilratio (9:16), full-bleed bild, text i frostad bar
 *  comic     → stående (3:4), panelruta med tjock kant, caption-box för text
 */
export function BookPage({ page, format = "classic", spread = false }) {
  const imgSrc = page.imageUrl || null;

  // ── CLASSIC ────────────────────────────────────────────────────────────────
  if (format === "classic") {
    return (
      <div style={{
        background: "#FEFCF8",
        borderRadius: spread ? 0 : 16,
        overflow: "hidden",
        boxShadow: spread ? "none" : "0 8px 32px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.08)",
        aspectRatio: "3/4",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
        border: "1px solid #E8DCC8",
      }}>
        {/* Bild — 60% */}
        <div style={{ flex: "0 0 60%", position: "relative", overflow: "hidden" }}>
          {imgSrc ? (
            <img src={imgSrc} alt={`Sida ${page.pageNumber}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #FFF3D6, #FFEED4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
            }}>🖼️</div>
          )}
        </div>

        {/* Dekorativ divider */}
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #D4B896, transparent)" }} />

        {/* Text — 40% */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "16px 22px 12px",
          background: "#FEFCF8",
        }}>
          <p style={{
            margin: 0, fontSize: "13.5px", lineHeight: 1.75,
            color: "#2D2016", fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            textAlign: "left", letterSpacing: "0.01em",
          }}>
            {page.text}
          </p>
          <div style={{
            marginTop: "auto", paddingTop: 8,
            display: "flex", justifyContent: "flex-end",
          }}>
            <span style={{ fontSize: 10, color: "#B89B72", fontStyle: "italic" }}>
              — {page.pageNumber} —
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── LANDSCAPE ──────────────────────────────────────────────────────────────
  if (format === "landscape") {
    return (
      <div style={{
        background: "#FEFCF8",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        aspectRatio: "16/9",
        display: "flex",
        flexDirection: "row",
        fontFamily: "Georgia, 'Times New Roman', serif",
        border: "1px solid #E8DCC8",
      }}>
        {/* Bild — 55% */}
        <div style={{ flex: "0 0 55%", position: "relative", overflow: "hidden" }}>
          {imgSrc ? (
            <img src={imgSrc} alt={`Sida ${page.pageNumber}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #FFF3D6, #FFEED4)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
            }}>🖼️</div>
          )}
        </div>

        {/* Vertikal avgränsare */}
        <div style={{ width: 1, background: "linear-gradient(180deg, transparent, #D4B896, transparent)", flexShrink: 0 }} />

        {/* Text — 45% */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "28px 30px",
          background: "#FEFCF8",
        }}>
          {/* Dekorativt element */}
          <div style={{ width: 32, height: 2, background: "#D4B896", borderRadius: 1, marginBottom: 16 }} />
          <p style={{
            margin: 0, fontSize: "14px", lineHeight: 1.8,
            color: "#2D2016", fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            letterSpacing: "0.01em",
          }}>
            {page.text}
          </p>
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <span style={{ fontSize: 11, color: "#B89B72", fontStyle: "italic" }}>
              Sida {page.pageNumber}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── DIGITAL ────────────────────────────────────────────────────────────────
  if (format === "digital") {
    return (
      <div style={{
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 12px 48px rgba(0,0,0,0.28)",
        aspectRatio: "9/16",
        display: "flex",
        flexDirection: "column",
        background: "#111",
        border: "1px solid #333",
        position: "relative",
      }}>
        {/* Bild — 65% */}
        <div style={{ flex: "0 0 65%", position: "relative", overflow: "hidden" }}>
          {imgSrc ? (
            <img src={imgSrc} alt={`Sida ${page.pageNumber}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
            }}>🖼️</div>
          )}
          {/* Gradient fade into text area */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: "linear-gradient(transparent, #0F0F0F)",
          }} />
        </div>

        {/* Text — 35% */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "14px 20px 16px",
          background: "#0F0F0F",
        }}>
          {/* Sidnummer-chip */}
          <div style={{ marginBottom: 10 }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#F59E0B",
              letterSpacing: "1.5px", textTransform: "uppercase",
            }}>Sida {page.pageNumber}</span>
          </div>
          <p style={{
            margin: 0, fontSize: "13px", lineHeight: 1.7,
            color: "#F0E8D8",
            fontFamily: "'Nunito', 'Helvetica Neue', sans-serif",
          }}>
            {page.text}
          </p>
        </div>
      </div>
    );
  }

  // ── COMIC ──────────────────────────────────────────────────────────────────
  // Halftone-punkt-overlay för autentisk serietidningskänsla
  const halftoneStyle = {
    backgroundImage: "radial-gradient(circle, rgba(17,17,17,0.13) 1px, transparent 1px)",
    backgroundSize: "6px 6px",
    position: "absolute", inset: 0,
    pointerEvents: "none",
  };

  // Layout varierar per sida: 0 = 2-panel grid, 1 = helbild+caption, 2 = caption+helbild
  const comicVariant = ((page.pageNumber || 1) - 1) % 3;

  return (
    <div style={{
      background: "#FFFDE8",
      borderRadius: spread ? 0 : 8,
      overflow: "hidden",
      boxShadow: spread ? "none" : "4px 6px 0 #111, 0 2px 8px rgba(0,0,0,0.2)",
      aspectRatio: "3/4",
      display: "flex",
      flexDirection: "column",
      border: "3px solid #111",
      fontFamily: "Bangers, 'Comic Sans MS', 'Chalkboard SE', cursive",
    }}>

      {/* ── Header-strip: sidnummer + förlagsnamn ── */}
      <div style={{
        background: "#111", color: "#FFE44D",
        fontSize: 10, fontWeight: 900, letterSpacing: 2,
        padding: "3px 10px", textTransform: "uppercase",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexShrink: 0,
      }}>
        <span style={{ color: "rgba(255,228,77,0.55)", fontSize: 9, letterSpacing: 1 }}>MinStory</span>
        <span>#{page.pageNumber}</span>
      </div>

      {/* ── Panel-rutnät — variant växlar per sida ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {comicVariant === 0 && (
          /* Variant 0: 2-panel (60/40) uppe + caption nere */
          <>
            <div style={{ flex: "0 0 56%", display: "flex", borderBottom: "3px solid #111" }}>
              <div style={{ flex: "0 0 60%", position: "relative", overflow: "hidden", borderRight: "3px solid #111" }}>
                {imgSrc ? (
                  <img src={imgSrc} alt={`Sida ${page.pageNumber}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#FFF3D6,#FFD88A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>🖼️</div>
                )}
                <div style={halftoneStyle} />
                <span style={{ position: "absolute", top: 5, right: 7, fontSize: 16, lineHeight: 1, filter: "drop-shadow(1px 1px 0 #111)" }}>💥</span>
              </div>
              <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#F5EFC4" }}>
                {imgSrc ? (
                  <img src={imgSrc} alt=""
                    style={{ position: "absolute", width: "200%", height: "180%", objectFit: "cover", top: "-20%", right: "-50%", filter: "contrast(1.1) saturate(1.15)" }} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,#FFE88A,#FFE88A 3px,#FFFDE8 3px,#FFFDE8 10px)" }} />
                )}
                <div style={halftoneStyle} />
              </div>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", display: "flex", alignItems: "center", background: "#FFFDE8", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 22, width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "7px solid #E8D84C", transform: "translateY(-100%)" }} />
              <div style={{ background: "#E8D84C", border: "2px solid #111", borderRadius: 5, padding: "7px 10px", width: "100%", boxSizing: "border-box" }}>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.5, color: "#1A1200", fontWeight: 600, fontFamily: "Bangers, 'Comic Sans MS', 'Chalkboard SE', cursive", letterSpacing: "0.02em" }}>{page.text}</p>
              </div>
            </div>
          </>
        )}

        {comicVariant === 1 && (
          /* Variant 1: helbild uppe (68%) + caption nere */
          <>
            <div style={{ flex: "0 0 68%", position: "relative", overflow: "hidden", borderBottom: "3px solid #111" }}>
              {imgSrc ? (
                <img src={imgSrc} alt={`Sida ${page.pageNumber}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#FFF3D6,#FFD88A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🖼️</div>
              )}
              <div style={halftoneStyle} />
              <span style={{ position: "absolute", top: 8, left: 10, fontSize: 20, lineHeight: 1, filter: "drop-shadow(1px 1px 0 #111)" }}>⭐</span>
              <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 16, lineHeight: 1, filter: "drop-shadow(1px 1px 0 #111)" }}>💥</span>
            </div>
            <div style={{ flex: 1, padding: "10px 12px", display: "flex", alignItems: "center", background: "#FFFDE8" }}>
              <div style={{ background: "#E8D84C", border: "2px solid #111", borderRadius: 5, padding: "7px 10px", width: "100%", boxSizing: "border-box" }}>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.5, color: "#1A1200", fontWeight: 600, fontFamily: "Bangers, 'Comic Sans MS', 'Chalkboard SE', cursive", letterSpacing: "0.02em" }}>{page.text}</p>
              </div>
            </div>
          </>
        )}

        {comicVariant === 2 && (
          /* Variant 2: caption uppe + helbild nere (72%) */
          <>
            <div style={{ flex: "0 0 26%", padding: "10px 12px", display: "flex", alignItems: "center", background: "#FFFDE8", borderBottom: "3px solid #111", position: "relative" }}>
              <div style={{ background: "#E8D84C", border: "2px solid #111", borderRadius: 5, padding: "7px 10px", width: "100%", boxSizing: "border-box", position: "relative" }}>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: 1.5, color: "#1A1200", fontWeight: 600, fontFamily: "Bangers, 'Comic Sans MS', 'Chalkboard SE', cursive", letterSpacing: "0.02em" }}>{page.text}</p>
                {/* Pratbubbla-pil nedåt */}
                <div style={{ position: "absolute", bottom: -8, left: 22, width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "7px solid #E8D84C" }} />
              </div>
            </div>
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              {imgSrc ? (
                <img src={imgSrc} alt={`Sida ${page.pageNumber}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom", display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#FFF3D6,#FFD88A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🖼️</div>
              )}
              <div style={halftoneStyle} />
              <span style={{ position: "absolute", bottom: 8, right: 10, fontSize: 16, lineHeight: 1, filter: "drop-shadow(1px 1px 0 #111)" }}>💥</span>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
