import { useState } from "react";
import { BookPage } from "./BookPage";
import { colors, spacing, fonts } from "../styles/theme";
import { downloadBookAsPdf } from "../utils/pdfExport";

const FORMAT_LABELS = {
  classic:   "📖 Klassisk bok",
  landscape: "🎬 Liggande bok",
  digital:   "✨ Digital bok",
  comic:     "💥 Seriebok",
};

// (PDF-export hanteras av src/utils/pdfExport.js)

export function BookPreview({ book, onReset, isPreview = false, totalPageCount, price, onGenerateFull, onSaveAccount, accountSaved }) {
  const [currentPage, setCurrentPage] = useState(0); // 0 = omslag
  const [animDir, setAnimDir] = useState(null); // "left" | "right" | null
  const [hoveredSide, setHoveredSide] = useState(null); // "left" | "right" | null
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [printOption, setPrintOption] = useState(null); // null | "soft" | "hard"
  const [orderingPrint, setOrderingPrint] = useState(false);
  const [printOrdered, setPrintOrdered] = useState(false);

  const printPrices = { soft: 199, hard: 299 };
  const printExtra  = printOption ? printPrices[printOption] : 0;
  const totalPrice  = (price || 0) + printExtra;

  async function handlePrintOrder() {
    if (!printOption) return;
    setOrderingPrint(true);
    try {
      const res = await fetch("/api/order-print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: { title: book.title, format: book.format, pages: book.pages.length },
          printOption,
          totalPrice,
        }),
      });
      if (res.ok) setPrintOrdered(true);
      else alert("Något gick fel. Försök igen.");
    } catch {
      alert("Kunde inte nå servern. Försök igen.");
    } finally {
      setOrderingPrint(false);
    }
  }

  async function handleDownloadPdf() {
    setDownloadingPdf(true);
    try {
      await downloadBookAsPdf(book);
    } catch (err) {
      console.error("PDF-fel:", err);
      alert("Kunde inte generera PDF. Försök igen.");
    } finally {
      setDownloadingPdf(false);
    }
  }

  if (!book) return null;

  const totalPages   = book.pages.length;
  const isLandscape  = book.format === "landscape";
  const isDigital    = book.format === "digital";
  const isSpread     = book.format === "classic" || book.format === "comic";
  const coverRatio   = isLandscape ? "16/9" : isDigital ? "9/16" : "3/4";
  const maxWidth     = isLandscape ? 700 : isDigital ? 340 : 420;

  // Vy-index: 0 = omslag, 1..N = innehåll (uppslag eller enkelsida), N+1 = bakpärm
  const spreadCount  = isSpread ? Math.ceil(totalPages / 2) : totalPages;
  const maxView      = spreadCount + 1;
  const isCoverView  = currentPage === 0;
  const isBackView   = currentPage === maxView;

  // Uppslags-sidor (classic/comic): view 1 → pages[0]+[1], view 2 → pages[2]+[3], ...
  const spreadLeftIdx = isSpread && !isCoverView && !isBackView ? (currentPage - 1) * 2 : -1;
  const spreadLeft    = spreadLeftIdx >= 0 ? (book.pages[spreadLeftIdx]  || null) : null;
  const spreadRight   = spreadLeftIdx >= 0 ? (book.pages[spreadLeftIdx + 1] || null) : null;

  // Enkelsida (landscape/digital)
  const singlePage = !isSpread && !isCoverView && !isBackView ? book.pages[currentPage - 1] || null : null;

  function goTo(n) {
    const clamped = Math.max(0, Math.min(maxView, n));
    if (clamped === currentPage) return;
    const dir = n > currentPage ? "right" : "left";
    setAnimDir(dir);
    setTimeout(() => {
      setCurrentPage(clamped);
      setAnimDir(null);
    }, 160);
  }

  return (
    <section
      id="bok-preview"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        padding: `${spacing["5xl"]} ${spacing.lg}`,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: spacing["4xl"] }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: spacing.sm,
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.30)",
            borderRadius: "999px",
            padding: `${spacing.sm} ${spacing["2xl"]}`,
            marginBottom: spacing.xl,
          }}>
            <span style={{ fontSize: "13px", color: "#FCD34D", fontWeight: fonts.weight.semibold }}>
              {isPreview ? "👁 Förhandsgranskning av din bok" : "✨ Din bok är genererad!"}
            </span>
          </div>
          <h2 style={{
            fontSize: fonts.size["4xl"],
            fontWeight: fonts.weight.extrabold,
            color: "#fff",
            margin: "0 0 10px",
          }}>
            {book.title}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: fonts.size.sm, margin: 0 }}>
            {FORMAT_LABELS[book.format] || "Bok"} · {isPreview ? `${totalPages} av ${totalPageCount} sidor (förhandsgranskning)` : `${totalPages} sidor`}
          </p>
        </div>

        {/* ── Boksida / Omslag ────────────────────────────────────── */}
        <div style={{
          maxWidth: isSpread && !isCoverView && !isBackView ? maxWidth * 2 + 16 : maxWidth,
          margin: "0 auto",
          transition: "max-width 0.3s ease",
        }}>
          <div style={{
            opacity: animDir ? 0 : 1,
            transform: animDir === "right" ? "translateX(-14px) scale(0.985)" : animDir === "left" ? "translateX(14px) scale(0.985)" : "none",
            transition: "opacity 0.16s ease, transform 0.16s ease",
          }}>
          {isCoverView ? (
            /* Omslag — klick = gå till första uppslag */
            <div
              onClick={() => goTo(1)}
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.65)",
                aspectRatio: coverRatio,
                position: "relative",
                background: "#111",
                cursor: "pointer",
              }}>
              {/* Omslagsbild — full-bleed */}
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt="Omslag"
                  style={{
                    position: "absolute", top: 0, left: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  background: `linear-gradient(160deg, ${colors.primary}, ${colors.primaryDark})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "80px",
                }}>📖</div>
              )}

              {/* Mörk gradient nerifrån — 55% av höjden */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "55%",
                background: "linear-gradient(transparent, rgba(0,0,0,0.80) 55%, rgba(0,0,0,0.96))",
              }} />

              {/* Titel och dekor längst ner */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: isLandscape ? spacing["2xl"] : spacing["3xl"],
                zIndex: 1,
                textAlign: "center",
              }}>
                <h3 style={{
                  fontSize: isLandscape ? fonts.size["2xl"] : fonts.size["3xl"],
                  fontWeight: fonts.weight.extrabold,
                  margin: `0 0 ${spacing.xs || "6px"}`,
                  color: "#fff",
                  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                  textShadow: "0 2px 16px rgba(0,0,0,0.7)",
                  lineHeight: 1.2,
                }}>
                  {book.title}
                </h3>
                <div style={{
                  width: 36, height: 2,
                  background: colors.primary,
                  borderRadius: 1,
                  margin: `${spacing.sm} auto`,
                }} />
                <p style={{
                  color: "rgba(255,255,255,0.65)",
                  fontSize: fonts.size.xs || "11px",
                  margin: 0,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}>
                  {FORMAT_LABELS[book.format]} · {totalPages} sidor
                </p>
              </div>
            </div>

          ) : isBackView ? (
            /* Bakpärm — klick = gå till föregående */
            <div
              onClick={() => goTo(currentPage - 1)}
              style={{
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.65)",
                aspectRatio: coverRatio,
                position: "relative",
                background: "#111",
                cursor: "pointer",
              }}>
              {/* Bakgrundsbild — samma bild som omslaget, lågmäld */}
              {book.coverImage && (
                <img src={book.coverImage} alt="" style={{
                  position: "absolute", top: 0, left: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover", opacity: 0.18,
                  filter: "saturate(0.6)",
                }} />
              )}

              {/* Gradient: mörkt top + mörkt bottom — ljust i mitten för texten */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.20) 35%, rgba(0,0,0,0.20) 65%, rgba(0,0,0,0.85) 100%)",
              }} />

              {/* Tunn guld-accent-linje längst upp — speglar framsidans accent */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
              }} />

              {/* Centrerat innehåll */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                textAlign: "center",
                padding: isLandscape ? spacing["2xl"] : "48px",
                boxSizing: "border-box",
              }}>
                <div style={{ maxWidth: 340, width: "100%" }}>
                  {book.backCoverText ? (
                    <p style={{
                      color: "rgba(255,255,255,0.90)",
                      fontSize: isLandscape ? "13px" : "15px",
                      lineHeight: 1.78,
                      fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                      fontStyle: "italic",
                      margin: "0 0 28px",
                      textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                    }}>
                      "{book.backCoverText}"
                    </p>
                  ) : null}

                  {/* Guld-linje — speglar framsidans divider */}
                  <div style={{
                    width: 36, height: 2,
                    background: colors.primary,
                    borderRadius: 1,
                    margin: "0 auto 20px",
                  }} />

                  {/* MinStory — samma typografi som framsidans undertitel */}
                  <p style={{
                    color: "#fff",
                    fontWeight: fonts.weight.extrabold,
                    fontSize: 17,
                    margin: "0 0 5px",
                    fontFamily: "'Playfair Display', Georgia, serif",
                    letterSpacing: "0.03em",
                  }}>MinStory</p>
                  <p style={{
                    color: "rgba(255,255,255,0.50)",
                    fontSize: fonts.size.xs || "11px",
                    margin: "0 0 14px",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}>Din personliga bilderbok</p>
                  <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 11, margin: 0 }}>www.minstory.se</p>
                </div>
              </div>

              {/* Tunn guld-accent-linje längst ner — speglar framsidans accent */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
              }} />
            </div>

          ) : isSpread ? (
            /* Uppslag — öppen bok med sidkrökning och skugga */
            <div style={{
              display: "flex",
              gap: 0,
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.75), 0 12px 28px rgba(0,0,0,0.45), 0 3px 8px rgba(0,0,0,0.25)",
            }}>
              {/* Vänster sida — klick → föregående */}
              <div
                style={{ flex: 1, minWidth: 0, position: "relative", cursor: currentPage > 0 ? "pointer" : "default" }}
                onClick={() => currentPage > 0 && goTo(currentPage - 1)}
                onMouseEnter={() => currentPage > 0 && setHoveredSide("left")}
                onMouseLeave={() => setHoveredSide(null)}
              >
                {spreadLeft ? (
                  <BookPage page={spreadLeft} format={book.format} spread />
                ) : (
                  <div style={{ aspectRatio: "3/4", background: book.format === "comic" ? "#FFFDE8" : "#FEFCF8" }} />
                )}
                {/* Sidkrökning mot ryggen */}
                <div style={{
                  position: "absolute", top: 0, right: 0, bottom: 0, width: "18%",
                  background: "linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)",
                  pointerEvents: "none",
                }} />
                {/* Hover-pil vänster */}
                {hoveredSide === "left" && currentPage > 0 && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, bottom: 0, width: "40%",
                    display: "flex", alignItems: "center", justifyContent: "flex-start",
                    paddingLeft: 14, pointerEvents: "none",
                    background: "linear-gradient(to right, rgba(0,0,0,0.12), transparent)",
                    transition: "opacity 0.15s",
                  }}>
                    <span style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", lineHeight: 1, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>‹</span>
                  </div>
                )}
              </div>

              {/* Bokrygg */}
              <div style={{
                width: 20, flexShrink: 0,
                background: book.format === "comic"
                  ? "linear-gradient(90deg, #2a1a00 0%, #5a3d10 18%, #9a7a42 38%, #c8a870 50%, #9a7a42 62%, #5a3d10 82%, #2a1a00 100%)"
                  : "linear-gradient(90deg, #3d2b10 0%, #7a5a30 18%, #c8a870 38%, #ede0c0 50%, #c8a870 62%, #7a5a30 82%, #3d2b10 100%)",
                boxShadow: "0 0 16px 6px rgba(0,0,0,0.55)",
              }} />

              {/* Höger sida — klick → nästa */}
              <div
                style={{ flex: 1, minWidth: 0, position: "relative", cursor: currentPage < maxView ? "pointer" : "default" }}
                onClick={() => currentPage < maxView && goTo(currentPage + 1)}
                onMouseEnter={() => currentPage < maxView && setHoveredSide("right")}
                onMouseLeave={() => setHoveredSide(null)}
              >
                {spreadRight ? (
                  <BookPage page={spreadRight} format={book.format} spread />
                ) : (
                  <div style={{ aspectRatio: "3/4", background: book.format === "comic" ? "#FFFDE8" : "#FEFCF8" }} />
                )}
                {/* Sidkrökning mot ryggen */}
                <div style={{
                  position: "absolute", top: 0, left: 0, bottom: 0, width: "18%",
                  background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 50%, transparent 100%)",
                  pointerEvents: "none",
                }} />
                {/* Hover-pil höger */}
                {hoveredSide === "right" && currentPage < maxView && (
                  <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0, width: "40%",
                    display: "flex", alignItems: "center", justifyContent: "flex-end",
                    paddingRight: 14, pointerEvents: "none",
                    background: "linear-gradient(to left, rgba(0,0,0,0.12), transparent)",
                  }}>
                    <span style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", lineHeight: 1, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>›</span>
                  </div>
                )}
              </div>
            </div>

          ) : (
            /* Enkelsida (landscape / digital) — klick vänster/höger */
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onMouseLeave={() => setHoveredSide(null)}
            >
              <BookPage page={singlePage} format={book.format} />
              {/* Vänster klick-zon */}
              <div
                style={{
                  position: "absolute", top: 0, left: 0, bottom: 0, width: "45%",
                  cursor: currentPage > 0 ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: 12,
                  background: hoveredSide === "left" ? "linear-gradient(to right, rgba(0,0,0,0.10), transparent)" : "transparent",
                  transition: "background 0.15s",
                }}
                onClick={() => currentPage > 0 && goTo(currentPage - 1)}
                onMouseEnter={() => currentPage > 0 && setHoveredSide("left")}
              >
                {hoveredSide === "left" && currentPage > 0 && (
                  <span style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>‹</span>
                )}
              </div>
              {/* Höger klick-zon */}
              <div
                style={{
                  position: "absolute", top: 0, right: 0, bottom: 0, width: "45%",
                  cursor: currentPage < maxView ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12,
                  background: hoveredSide === "right" ? "linear-gradient(to left, rgba(0,0,0,0.10), transparent)" : "transparent",
                  transition: "background 0.15s",
                }}
                onClick={() => currentPage < maxView && goTo(currentPage + 1)}
                onMouseEnter={() => currentPage < maxView && setHoveredSide("right")}
              >
                {hoveredSide === "right" && currentPage < maxView && (
                  <span style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>›</span>
                )}
              </div>
            </div>
          )}
          </div>
        </div>

        {/* ── Navigation ──────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: spacing.xl,
          marginTop: spacing["3xl"],
        }}>
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 0}
            style={{
              padding: `${spacing.sm} ${spacing["2xl"]}`,
              borderRadius: "999px",
              border: "1.5px solid rgba(255,255,255,0.15)",
              background: currentPage === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.12)",
              color: currentPage === 0 ? "rgba(255,255,255,0.25)" : "#fff",
              cursor: currentPage === 0 ? "not-allowed" : "pointer",
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.semibold,
              fontFamily: "inherit",
              transition: "background 0.15s ease",
            }}
          >
            ← Föregående
          </button>

          <span style={{ fontSize: fonts.size.sm, color: "rgba(255,255,255,0.55)", minWidth: "90px", textAlign: "center" }}>
            {isCoverView ? "Omslag" : isBackView ? "Bakpärm" : isSpread
              ? `Sidor ${(currentPage - 1) * 2 + 1}–${Math.min((currentPage - 1) * 2 + 2, totalPages)}`
              : `${currentPage} / ${totalPages}`}
          </span>

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === maxView}
            style={{
              padding: `${spacing.sm} ${spacing["2xl"]}`,
              borderRadius: "999px",
              border: "none",
              background: currentPage === maxView
                ? "rgba(255,255,255,0.05)"
                : `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
              color: currentPage === maxView ? "rgba(255,255,255,0.25)" : "#fff",
              cursor: currentPage === maxView ? "not-allowed" : "pointer",
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.semibold,
              fontFamily: "inherit",
              boxShadow: currentPage !== maxView ? "0 3px 14px rgba(245,158,11,0.35)" : "none",
              transition: "all 0.15s ease",
            }}
          >
            Nästa →
          </button>
        </div>

        {/* ── Siddots ─────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "5px",
          marginTop: spacing.xl,
          flexWrap: "wrap",
        }}>
          {[...Array(maxView + 1)].map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === currentPage ? "22px" : "8px",
                height: "8px",
                borderRadius: "999px",
                border: "none",
                background: i === currentPage
                  ? colors.primary
                  : "rgba(255,255,255,0.20)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* ── Knappar ─────────────────────────────────────────────── */}
        <div style={{
          display: "flex",
          gap: spacing.lg,
          justifyContent: "center",
          marginTop: spacing["4xl"],
          flexWrap: "wrap",
        }}>
          <button
            onClick={onReset}
            style={{
              padding: `${spacing.lg} ${spacing["3xl"]}`,
              borderRadius: "14px",
              border: "1.5px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.08)",
              color: "#fff",
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.semibold,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s ease",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.14)"; }}
            onMouseOut={(e)  => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
          >
            ← Skapa ny bok
          </button>

          {!isPreview && (
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              style={{
                padding: `${spacing.lg} ${spacing["3xl"]}`,
                borderRadius: "14px",
                border: "none",
                background: downloadingPdf ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #2b6cb0, #2c5282)",
                color: downloadingPdf ? "rgba(255,255,255,0.4)" : "#fff",
                fontSize: fonts.size.md,
                fontWeight: fonts.weight.bold,
                cursor: downloadingPdf ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                boxShadow: downloadingPdf ? "none" : "0 4px 20px rgba(43,108,176,0.40)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseOver={(e) => { if (!downloadingPdf) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(43,108,176,0.50)"; }}}
              onMouseOut={(e)  => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = downloadingPdf ? "none" : "0 4px 20px rgba(43,108,176,0.40)"; }}
            >
              {downloadingPdf ? "⏳ Genererar PDF..." : "⬇️ Ladda ner PDF"}
            </button>
          )}

          {/* Print-knapp tas bort här — hanteras i print-addon-sektionen nedan */}

          {/* Spara konto-knapp */}
          {!isPreview && onSaveAccount && (
            <button
              onClick={onSaveAccount}
              style={{
                padding: `${spacing.lg} ${spacing["3xl"]}`,
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(135deg, #2f855a, #276749)",
                color: "#fff",
                fontSize: fonts.size.md,
                fontWeight: fonts.weight.bold,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(47,133,90,0.40)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(47,133,90,0.50)"; }}
              onMouseOut={(e)  => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(47,133,90,0.40)"; }}
            >
              💾 Skapa konto för att spara din bok
            </button>
          )}
          {!isPreview && accountSaved && (
            <span style={{
              padding: `${spacing.lg} ${spacing["2xl"]}`,
              borderRadius: "14px",
              background: "rgba(47,133,90,0.18)",
              color: "#9ae6b4",
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.semibold,
            }}>
              ✅ Bok sparad på ditt konto
            </span>
          )}
        </div>

        {/* ── Tryckt bok — tillval ──────────────────────────────── */}
        {!isPreview && (
          <div style={{
            marginTop: spacing["5xl"],
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid rgba(255,255,255,0.10)",
            borderRadius: "20px",
            padding: `${spacing["4xl"]} ${spacing["3xl"]}`,
          }}>
            <div style={{ textAlign: "center", marginBottom: spacing["3xl"] }}>
              <div style={{ fontSize: "36px", marginBottom: spacing.md }}>📦</div>
              <h3 style={{
                fontSize: fonts.size["2xl"],
                fontWeight: fonts.weight.extrabold,
                color: "#fff",
                margin: `0 0 ${spacing.sm}`,
              }}>
                Få din bok som tryckt bok
              </h3>
              <p style={{
                color: "rgba(255,255,255,0.60)",
                fontSize: fonts.size.md,
                margin: 0,
                maxWidth: 460,
                marginInline: "auto",
                lineHeight: 1.6,
              }}>
                Vill du få din bok som en riktig bok? Välj mellan mjuk eller hård pärm och få den levererad hem.
              </p>
            </div>

            {/* ── Alternativkort ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: spacing.xl,
              maxWidth: 560,
              margin: `0 auto ${spacing["3xl"]}`,
            }}>
              {[
                { key: "soft", label: "Mjuk pärm", price: 199, popular: true,  icon: "📗", desc: "Smidig och lätt, perfekt för barn" },
                { key: "hard", label: "Hård pärm", price: 299, popular: false, icon: "📘", desc: "Hållbar och lyxig, för att bevara minnet" },
              ].map(({ key, label, price: p, popular, icon, desc }) => {
                const selected = printOption === key;
                return (
                  <button
                    key={key}
                    onClick={() => setPrintOption(selected ? null : key)}
                    style={{
                      position: "relative",
                      padding: `${spacing["2xl"]} ${spacing.xl}`,
                      borderRadius: "16px",
                      border: selected
                        ? "2.5px solid #F59E0B"
                        : "1.5px solid rgba(255,255,255,0.14)",
                      background: selected
                        ? "rgba(245,158,11,0.14)"
                        : "rgba(255,255,255,0.05)",
                      color: "#fff",
                      cursor: "pointer",
                      textAlign: "center",
                      fontFamily: "inherit",
                      transition: "all 0.18s ease",
                      boxShadow: selected ? "0 0 0 4px rgba(245,158,11,0.15)" : "none",
                    }}
                  >
                    {popular && (
                      <div style={{
                        position: "absolute",
                        top: "-12px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#F59E0B",
                        color: "#000",
                        fontSize: "11px",
                        fontWeight: fonts.weight.bold,
                        padding: "3px 12px",
                        borderRadius: "999px",
                        whiteSpace: "nowrap",
                      }}>
                        ⭐ Mest populär
                      </div>
                    )}
                    <div style={{ fontSize: "32px", marginBottom: spacing.sm }}>{icon}</div>
                    <div style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.bold, marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: fonts.size.sm, color: "rgba(255,255,255,0.55)", marginBottom: spacing.md, lineHeight: 1.4 }}>
                      {desc}
                    </div>
                    <div style={{
                      fontSize: fonts.size.lg,
                      fontWeight: fonts.weight.extrabold,
                      color: selected ? "#FCD34D" : "#fff",
                    }}>
                      +{p} kr
                    </div>
                    {selected && (
                      <div style={{ marginTop: spacing.sm, fontSize: "18px" }}>✅</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Totalpris ── */}
            {price > 0 && (
              <div style={{
                textAlign: "center",
                marginBottom: spacing["2xl"],
                padding: `${spacing.lg} ${spacing["2xl"]}`,
                background: "rgba(245,158,11,0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(245,158,11,0.18)",
                maxWidth: 320,
                margin: `0 auto ${spacing["2xl"]}`,
              }}>
                <div style={{ fontSize: fonts.size.sm, color: "rgba(255,255,255,0.50)", marginBottom: "4px" }}>
                  {printOption ? `Digital bok ${price} kr + tryck ${printExtra} kr` : `Digital bok`}
                </div>
                <div style={{ fontSize: fonts.size["2xl"], fontWeight: fonts.weight.extrabold, color: "#FCD34D" }}>
                  {printOption ? `Totalt: ${totalPrice} kr` : `${price} kr`}
                </div>
              </div>
            )}

            {/* ── Beställ-knapp ── */}
            {printOrdered ? (
              /* ── Bekräftelsevy ── */
              <div style={{
                background: "rgba(47,133,90,0.10)",
                border: "1.5px solid rgba(47,133,90,0.35)",
                borderRadius: "18px",
                padding: `${spacing["3xl"]} ${spacing["2xl"]}`,
                textAlign: "center",
                maxWidth: 480,
                margin: "0 auto",
              }}>
                <div style={{ fontSize: "48px", marginBottom: spacing.lg }}>🎉</div>
                <h4 style={{
                  fontSize: fonts.size["xl"],
                  fontWeight: fonts.weight.extrabold,
                  color: "#9ae6b4",
                  margin: `0 0 ${spacing.sm}`,
                }}>
                  Din beställning är mottagen!
                </h4>
                <p style={{
                  color: "rgba(255,255,255,0.50)",
                  fontSize: fonts.size.sm,
                  margin: `0 0 ${spacing["2xl"]}`,
                }}>
                  Vi kontaktar dig inom kort för att bekräfta och skicka din bok.
                </p>

                {/* Sammanfattning */}
                <div style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  textAlign: "left",
                }}>
                  {[
                    { label: "📖 Bok",         value: book.title },
                    { label: "📦 Trycktyp",    value: printOption === "soft" ? "Mjuk pärm" : "Hård pärm" },
                    { label: "💰 Totalpris",   value: `${totalPrice} kr` },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: `${spacing.md} ${spacing.xl}`,
                        borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                      }}
                    >
                      <span style={{ fontSize: fonts.size.sm, color: "rgba(255,255,255,0.50)" }}>{label}</span>
                      <span style={{
                        fontSize: fonts.size.sm,
                        fontWeight: fonts.weight.semibold,
                        color: label.startsWith("💰") ? "#FCD34D" : "#fff",
                      }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={handlePrintOrder}
                  disabled={!printOption || orderingPrint}
                  style={{
                    padding: `${spacing.lg} ${spacing["4xl"]}`,
                    borderRadius: "14px",
                    border: "none",
                    background: printOption && !orderingPrint
                      ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
                      : "rgba(255,255,255,0.08)",
                    color: printOption && !orderingPrint ? "#fff" : "rgba(255,255,255,0.30)",
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.bold,
                    cursor: printOption && !orderingPrint ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    boxShadow: printOption && !orderingPrint ? "0 4px 20px rgba(245,158,11,0.40)" : "none",
                    transition: "all 0.18s ease",
                  }}
                  onMouseOver={(e) => { if (printOption && !orderingPrint) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,158,11,0.50)"; }}}
                  onMouseOut={(e)  => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = printOption && !orderingPrint ? "0 4px 20px rgba(245,158,11,0.40)" : "none"; }}
                >
                  {orderingPrint ? "⏳ Skickar beställning..." : "📦 Beställ tryckt bok"}
                </button>

                {/* Villkor */}
                <div style={{
                  marginTop: spacing.xl,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  alignItems: "center",
                }}>
                  {[
                    "📋 Boken trycks först efter att du godkänt innehållet",
                    "🔒 Tryckta böcker kan inte returneras eftersom de är personliga",
                    "🚚 Leveranstid: 3–7 arbetsdagar",
                  ].map((t) => (
                    <span key={t} style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.38)",
                      lineHeight: 1.5,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
