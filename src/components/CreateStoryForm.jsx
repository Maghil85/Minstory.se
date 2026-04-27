import { useState } from "react";
import { colors, spacing, fonts } from "../styles/theme";
import { BookFormatSelector } from "./BookFormatSelector";
import { BookPreview } from "./BookPreview";
import { generateBookWithAI } from "../services/bookGenerator";
import { saveHandgjordOrder, saveAiOrder } from "../services/orderService";
import { SupportWidget } from "./SupportWidget";
import { SwishPayment } from "./SwishPayment";
import { SaveAccountModal } from "./SaveAccountModal";

const fieldStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "10px",
  border: `1.5px solid ${colors.border}`,
  background: colors.white,
  color: colors.text,
  fontSize: fonts.size.md,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

const labelStyle = {
  display: "block",
  fontWeight: fonts.weight.semibold,
  fontSize: fonts.size.sm,
  color: colors.text,
  marginBottom: spacing.sm,
};

const PACKAGES = {
  ai: [
    { count: 15, price: "69 kr",       stars: "⭐",     label: "Standard" },
    { count: 20, price: "109 kr",      stars: "⭐⭐",   label: "Populär",  popular: true },
    { count: 24, price: "149 kr",      stars: "⭐⭐⭐", label: "Premium" },
  ],
  handgjord: [
    { count: 15, price: "349 kr",      stars: "⭐",     label: "Standard" },
    { count: 20, price: "499 kr",      stars: "⭐⭐",   label: "Populär",  popular: true },
    { count: 24, price: "599 kr",      stars: "⭐⭐⭐", label: "Premium" },
  ],
};

export function CreateStoryForm() {
  const [generatedBook, setGeneratedBook] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingPhase, setGeneratingPhase] = useState(null); // "full" | "order"
  const [showPayment, setShowPayment] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [creationType, setCreationType] = useState("ai"); // "ai" | "handgjord"
  const [formVisible, setFormVisible] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);   // File | null
  const [photoPreview, setPhotoPreview] = useState(null); // dataURL | null
  const [savedOrderId, setSavedOrderId] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [accountSaved, setAccountSaved] = useState(false);
  const [formData, setFormData] = useState({
    storyType: "",
    bookFormat: "",
    bookStyle: "",
    customBookStyle: "",
    pageCount: 20,
    personName: "",
    personAge: "",
    relation: "",
    description: "",
    storyIdea: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreview(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.personName || !formData.email) {
      alert("Vänligen fyll i: personens namn och e-post");
      return;
    }
    setAiError(null);

    if (creationType === "handgjord") {
      setIsGenerating(true);
      setGeneratingPhase("order");
      try {
        await saveHandgjordOrder({ ...formData, creationType });
        setOrderSubmitted(true);
      } catch (err) {
        setAiError(err.message || "Något gick fel vid beställningen. Försök igen.");
      } finally {
        setIsGenerating(false);
      }
      return;
    }

    // AI-bok: visa betalningsskärm direkt
    setShowPayment(true);
  };

  const handleGenerateFull = async () => {
    setShowPayment(false);
    setAiError(null);
    setIsGenerating(true);
    setGeneratingPhase("full");
    try {
      const book = await generateBookWithAI(formData, photoFile);
      setGeneratedBook(book);
      // Spara beställningen i Firebase
      try {
        const oid = await saveAiOrder(formData, book);
        setSavedOrderId(oid);
      } catch (_) { /* Firebase ej konfigurerad ännu */ }      // Visa "spara konto"-modal automatiskt efter kort fördröjning
      setTimeout(() => setShowSaveModal(true), 1200);    } catch (err) {
      setAiError(err.message || "Något gick fel vid generering av boken.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setGeneratedBook(null);
    setAiError(null);
    setShowPayment(false);
    setGeneratingPhase(null);
    setOrderSubmitted(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    setShowSaveModal(false);
    setAccountSaved(false);
    setSavedOrderId(null);
  };

  // Visa genererad bok
  if (generatedBook) {
    return (
      <>
        <BookPreview
          book={generatedBook}
          onReset={handleReset}
          isPreview={false}
          totalPageCount={formData.pageCount}
          price={PACKAGES[creationType].find((p) => p.count === formData.pageCount)?.price}
          onGenerateFull={handleGenerateFull}
          onSaveAccount={accountSaved ? null : () => setShowSaveModal(true)}
          accountSaved={accountSaved}
        />
        <SupportWidget orderId={savedOrderId} customerName={formData.personName} />
        {showSaveModal && (
          <SaveAccountModal
            prefillEmail={formData.email}
            prefillName={formData.personName}
            orderId={savedOrderId}
            onSaved={() => { setAccountSaved(true); setShowSaveModal(false); }}
            onDismiss={() => setShowSaveModal(false)}
          />
        )}
      </>
    );
  }

  // Swish-betalningsskärm (AI-bok)
  if (showPayment) {
    const selectedPkg = PACKAGES[creationType].find((p) => p.count === formData.pageCount);
    return (
      <SwishPayment
        price={selectedPkg?.price}
        pageCount={formData.pageCount}
        personName={formData.personName}
        onPaid={handleGenerateFull}
        onBack={() => setShowPayment(false)}
      />
    );
  }

  // Bekräftelse: handgjord beställning skickad
  if (orderSubmitted) {
    return (
      <section id="skapa" style={{ background: "linear-gradient(135deg, #FFFBF2 0%, #FFF7E6 100%)", padding: `${spacing["5xl"]} ${spacing.lg}`, minHeight: "40vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "52px", marginBottom: spacing.xl }}>🎨</div>
          <h3 style={{ fontSize: fonts.size["2xl"], fontWeight: fonts.weight.extrabold, color: colors.text, margin: `0 0 ${spacing.md}` }}>
            Tack för din beställning!
          </h3>
          <p style={{ color: colors.textLight, fontSize: fonts.size.md, lineHeight: 1.7, margin: `0 0 ${spacing["2xl"]}` }}>
            Din beställning på en <strong>personligt illustrerad bok</strong> för <strong>{formData.personName}</strong> har tagits emot.
            Vi kontaktar dig på <strong>{formData.email}</strong> inom 24 h.
          </p>
          <div style={{ background: "rgba(245,158,11,0.07)", border: `1px solid ${colors.border}`, borderRadius: "14px", padding: `${spacing.md} ${spacing["2xl"]}`, marginBottom: spacing["2xl"] }}>
            <p style={{ margin: 0, fontSize: fonts.size.sm, color: colors.textLight, lineHeight: 1.8 }}>
              📖 <strong>{formData.pageCount} sidor</strong> · Personligt illustrerad<br />
              ✉️ Bekräftelse skickas till <strong>{formData.email}</strong>
            </p>
          </div>
          <button
            onClick={handleReset}
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`, color: "#fff", border: "none", borderRadius: "12px", padding: `${spacing.md} ${spacing["3xl"]}`, fontSize: fonts.size.md, fontWeight: fonts.weight.bold, cursor: "pointer", fontFamily: "inherit" }}
          >
            Skapa en ny bok
          </button>
        </div>
      </section>
    );
  }

  // Visa laddningsskärm
  if (isGenerating) {
    const isOrder = generatingPhase === "order";
    return (
      <section id="skapa" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: `${spacing["5xl"]} ${spacing.lg}`, minHeight: "50vh", display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "56px", marginBottom: spacing.xl, animation: "float 2s ease-in-out infinite" }}>
            {isOrder ? "🎨" : "✨"}
          </div>
          <h3 style={{ fontSize: fonts.size["2xl"], color: "#fff", margin: `0 0 ${spacing.md}`, fontWeight: fonts.weight.bold }}>
            {isOrder ? "Skickar din beställning..." : generatingPhase === "full" ? "Genererar hela boken..." : "Genererar förhandsgranskning..."}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: fonts.size.sm, lineHeight: 1.7, margin: 0 }}>
            {isOrder
              ? "Sparar din beställning — bara ett ögonblick."
              : generatingPhase === "full"
              ? `AI-motorn skriver alla ${formData.pageCount} sidor — det kan ta 20–40 sekunder.`
              : "Skapar de 4 första sidorna som förhandsgranskning — bara ett ögonblick."
            }
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: spacing.sm, marginTop: spacing["3xl"] }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: colors.primary, animation: `float ${0.6 + i * 0.2}s ease-in-out infinite alternate` }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const packages = PACKAGES[creationType];
  const selectedPackage = packages.find((p) => p.count === formData.pageCount);

  return (
    <section
      id="skapa"
      style={{
        background: `linear-gradient(135deg, #FFFBF2 0%, #FFF7E6 100%)`,
        padding: `${spacing["2xl"]} ${spacing.lg}`,
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>

        {/* Rubrik + CTA-knapp */}
        <div style={{ textAlign: "center", marginBottom: formVisible ? spacing.xl : 0 }}>
          <h2 style={{ fontSize: fonts.size["3xl"], fontWeight: fonts.weight.extrabold, color: colors.text, margin: `0 0 ${spacing.sm}` }}>
            Skapa din bok
          </h2>
          <p style={{ color: colors.textLight, fontSize: fonts.size.md, margin: `0 0 ${spacing["2xl"]}` }}>
            Berätta om personen — vi skapar en unik, personlig bok.
          </p>
          {!formVisible && (
            <button
              type="button"
              onClick={() => setFormVisible(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                color: "#fff",
                border: "none",
                borderRadius: "16px",
                padding: "18px 44px",
                fontSize: fonts.size.xl,
                fontWeight: fonts.weight.extrabold,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 6px 28px rgba(245,158,11,0.35)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(245,158,11,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(245,158,11,0.35)"; }}
            >
              ✨ Skapa din bok nu
            </button>
          )}
        </div>

        {/* Formulärkort */}
        {formVisible && (
        <div style={{
          background: colors.white,
          borderRadius: "18px",
          boxShadow: "0 4px 24px rgba(245,158,11,0.09)",
          padding: `${spacing["2xl"]} ${spacing["2xl"]}`,
          border: `1px solid ${colors.border}`,
        }}>
          {/* Stäng-knapp */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: spacing.md }}>
            <button
              type="button"
              onClick={() => setFormVisible(false)}
              title="Stäng formuläret"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "none",
                border: `1.5px solid ${colors.border}`,
                borderRadius: "8px",
                padding: "5px 12px",
                fontSize: fonts.size.xs,
                color: colors.textLight,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.color = colors.primary; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.textLight; }}
            >
              ✕ Stäng
            </button>
          </div>
          <form onSubmit={handleSubmit}>

            {/* Steg 0: Hur ska boken skapas? */}
            <div style={{ marginBottom: spacing.xl, paddingBottom: spacing.xl, borderBottom: `1px solid ${colors.border}` }}>
              <label style={{ ...labelStyle, marginBottom: spacing.md }}>
                Hur ska boken skapas? <span style={{ color: colors.primary }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.md }}>
                {[
                  { value: "ai",        icon: "🤖", title: "AI-skapad",              desc: "Genereras direkt — förhandsgranskning på sekunder" },
                  { value: "handgjord", icon: "🎨", title: "Personligt illustrerad",  desc: "Skapas manuellt med unik design och detaljer" },
                ].map(({ value, icon, title, desc }) => {
                  const active = creationType === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCreationType(value)}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "14px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        border: active ? `2px solid ${colors.primary}` : `1.5px solid ${colors.border}`,
                        background: active ? "rgba(245,158,11,0.07)" : colors.white,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        fontFamily: "inherit",
                        textAlign: "left",
                        boxShadow: active ? "0 3px 12px rgba(245,158,11,0.15)" : "none",
                      }}
                    >
                      <span style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.bold, color: active ? colors.primary : colors.text }}>{title}</span>
                        <span style={{ fontSize: fonts.size.xs, color: colors.textLight, lineHeight: 1.4 }}>{desc}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              {creationType === "handgjord" && (
                <div style={{ marginTop: spacing.md, padding: `${spacing.sm} ${spacing.md}`, background: "rgba(245,158,11,0.06)", borderRadius: "10px", border: `1px solid ${colors.border}` }}>
                  <p style={{ margin: 0, fontSize: fonts.size.xs, color: colors.textLight, lineHeight: 1.6 }}>
                    ✏️ En illustratör skapar boken manuellt. Du kontaktas via e-post inom 24 h för godkännande av skiss innan tryckning.
                  </p>
                </div>
              )}

              {/* Paketval — direkt under typvalet */}
              <div style={{ marginTop: spacing.lg }}>
                <label style={{ ...labelStyle, marginBottom: spacing.md }}>
                  Välj paket <span style={{ color: colors.primary }}>*</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: spacing.md }}>
                  {packages.map(({ count, price, stars, label, popular }) => {
                    const active = formData.pageCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => handleChange({ target: { name: "pageCount", value: count } })}
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          padding: "14px 10px",
                          borderRadius: "12px",
                          border: active ? `2px solid ${colors.primary}` : `1.5px solid ${colors.border}`,
                          background: active ? "rgba(245,158,11,0.07)" : colors.white,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          fontFamily: "inherit",
                          textAlign: "center",
                          boxShadow: active ? "0 3px 12px rgba(245,158,11,0.15)" : "none",
                        }}
                      >
                        <span style={{ fontSize: "18px", lineHeight: 1 }}>{stars}</span>
                        <span style={{ fontSize: fonts.size.sm, fontWeight: fonts.weight.bold, color: active ? colors.primary : colors.text, marginTop: "2px" }}>{label}</span>
                        <span style={{ fontSize: fonts.size.xs, color: colors.textLight }}>{count} sidor</span>
                        <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.extrabold, color: active ? colors.primary : colors.text, marginTop: "3px" }}>{price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Steg 1: Bokformat & stil */}
            <div style={{ marginBottom: spacing.xl, paddingBottom: spacing.xl, borderBottom: `1px solid ${colors.border}` }}>
              <BookFormatSelector
                selectedFormat={formData.bookFormat}
                selectedStyle={formData.bookStyle}
                onFormatChange={(val) => handleChange({ target: { name: "bookFormat", value: val } })}
                onStyleChange={(val) => handleChange({ target: { name: "bookStyle", value: val } })}
                customStyle={formData.customBookStyle}
                onCustomStyle={(val) => handleChange({ target: { name: "customBookStyle", value: val } })}
              />
            </div>

            {/* Steg 2: Person */}
            <div style={{ marginBottom: spacing.xl }}>
              <label style={{ ...labelStyle, marginBottom: spacing.sm }}>
                Om personen <span style={{ color: colors.primary }}>*</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: spacing.md, marginBottom: spacing.md }}>
                <div>
                  <label style={labelStyle}>Namn</label>
                  <input name="personName" value={formData.personName} onChange={handleChange} placeholder="Ex: Sara" style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ålder (valfritt)</label>
                  <input name="personAge" value={formData.personAge} onChange={handleChange} placeholder="Ex: 7" type="number" style={fieldStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Din relation till personen</label>
                <select name="relation" value={formData.relation} onChange={handleChange} style={{ ...fieldStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B7280' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}>
                  <option value="">Välj relation</option>
                  <option value="parent">Förälder</option>
                  <option value="partner">Partner / Maka / Make</option>
                  <option value="friend">Vän</option>
                  <option value="sibling">Syskon</option>
                  <option value="grandparent">Mor- / Farförälder</option>
                  <option value="other">Annat</option>
                </select>
              </div>
            </div>

            {/* Foto (valfritt, endast AI-bok) */}
            {creationType === "ai" && (
              <div style={{ marginBottom: spacing.xl, paddingBottom: spacing.xl, borderBottom: `1px solid ${colors.border}` }}>
                <label style={{ ...labelStyle, marginBottom: spacing.sm }}>
                  📷 Ladda upp ett foto <span style={{ color: colors.textLight, fontWeight: fonts.weight.normal }}>(valfritt)</span>
                </label>
                <p style={{ margin: `0 0 ${spacing.md}`, fontSize: fonts.size.xs, color: colors.textLight, lineHeight: 1.5 }}>
                  AI-motorn analyserar fotot och skapar illustrationer som liknar personen — med Stable Diffusion img2img.
                </p>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: spacing.md,
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: photoFile ? `2px solid ${colors.primary}` : `1.5px dashed ${colors.border}`,
                    background: photoFile ? "rgba(245,158,11,0.05)" : colors.white,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Förhandsgranskning" style={{ width: 56, height: 56, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <span style={{ fontSize: "32px", flexShrink: 0 }}>🖼️</span>
                  )}
                  <span style={{ fontSize: fonts.size.sm, color: photoFile ? colors.primary : colors.textLight }}>
                    {photoFile ? photoFile.name : "Klicka för att välja bild (jpg/png/webp, max 8 MB)"}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
                </label>
                {photoFile && (
                  <button
                    type="button"
                    onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                    style={{ marginTop: spacing.sm, background: "none", border: "none", color: colors.textLight, fontSize: fonts.size.xs, cursor: "pointer", padding: 0 }}
                  >
                    ✕ Ta bort foto
                  </button>
                )}
              </div>
            )}

            {/* Steg 3: Beskrivning */}
            <div style={{ marginBottom: spacing.xl }}>
              <label style={labelStyle}>
                Beskriv personen kort <span style={{ color: colors.primary }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Intressen, karaktär, drömmar — Ex: älskar djur och drömmer om äventyr"
                style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {/* Steg 4: Bokidé */}
            <div style={{ marginBottom: spacing.xl }}>
              <label style={labelStyle}>
                Vad ska berättelsen handla om? <span style={{ color: colors.primary }}>*</span>
              </label>
              <textarea
                name="storyIdea"
                value={formData.storyIdea}
                onChange={handleChange}
                rows={2}
                placeholder="Ex: En hemlig frusen sjö, ett mysterium som måste lösas..."
                style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>

            {/* Steg 5: E-post */}
            <div style={{ marginBottom: spacing.xl, paddingBottom: spacing.xl, borderBottom: `1px solid ${colors.border}` }}>              <label style={labelStyle}>
                Din e-postadress <span style={{ color: colors.primary }}>*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="du@mail.se"
                style={fieldStyle}
              />
            </div>

            {/* Skicka-knapp */}
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: spacing.xl, display: "flex", flexDirection: "column", alignItems: "center", gap: spacing.md }}>
              <button
                type="submit"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
                  color: colors.white,
                  border: "none",
                  borderRadius: "12px",
                  padding: `${spacing.md} ${spacing["4xl"]}`,
                  fontSize: fonts.size.md,
                  fontWeight: fonts.weight.bold,
                  cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(245,158,11,0.30)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  maxWidth: "380px",
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(245,158,11,0.40)"; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 18px rgba(245,158,11,0.30)"; }}
              >
                {creationType === "handgjord" ? "🎨 Skicka beställning" : "✨ Skapa min bok nu"}
              </button>
              {aiError && (
                <p style={{ fontSize: fonts.size.sm, color: "#ef4444", margin: 0, textAlign: "center", background: "#fef2f2", padding: `${spacing.sm} ${spacing.lg}`, borderRadius: "10px", border: "1px solid #fecaca" }}>
                  ⚠️ {aiError}
                </p>
              )}
              <p style={{ fontSize: fonts.size.sm, color: colors.textLighter, margin: 0, textAlign: "center" }}>
                {creationType === "handgjord"
                  ? `Ingen betalning nu · Du kontaktas inom 24 h · ${selectedPackage?.price ?? ""}`
                  : `Betala via Swish · ${selectedPackage?.price ?? ""} · 100% nöjdhetsgaranti`
                }
              </p>
            </div>

          </form>
        </div>
        )}
      </div>
    </section>
  );
}
