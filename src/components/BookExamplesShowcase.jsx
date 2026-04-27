import { Link } from "react-router-dom";
import { useState } from "react";
import { colors, spacing, fonts } from "../styles/theme";

export function BookExamplesShowcase() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);

  const bookExamples = [
    {
      id: 1,
      title: "Saras Isäventyr",
      category: "Barnsaga",
      coverImage: "https://images.unsplash.com/photo-1483794344563-d27a8d18014e?w=600&h=800&fit=crop",
      description: "En magisk saga där Sara åker skridskor och upptäcker en hemlig värld under isen.",
      chapters: [
        {
          number: 1,
          title: "Den Frusna Sjön",
          character: "SARA",
          content: `Vintermorgnarna i Älvdalen var alltid fyllda med magi, men denna dag var något alldeles särskilt. Sara stod vid sjökanten med sina nya skridskor i handen, blicken fäst på den tjocka isen som glittrade i solljuset.\n\n"Tror du på ödet?" frågade hennes lillasyster Emma.\n\n"Jag tror att man ska ha skorna på sig," svarade Sara utan att titta upp från ryggsäcken. "Svara på frågan först."\n\n"Jag tror faktiskt inte det, tack."\n\nSara satte sig på bänken. Det fanns något mystiskt med sjön idag. Ett ljud som hon inte kunde placera – som musik långt bortifrån, eller kanske röster under isen.\n\n"Det här är en seriös fråga, Sara," sa Emma.\n\n"En seriös fråga klockan halv åtta på en lördagsmorgon är inte en seriös fråga, Emma."`
        },
        {
          number: 2,
          title: "Under Isen",
          character: "SARA",
          content: `Första steget på isen var alltid det mest spännande. Den tjocka, vita ytan knarrade svagt under hennes vikt, men höll. Sara åkte ut mot mitten av sjön där isen var som mest blank.\n\nDär stannde hon upp och såg ner. Genom den kristallklara isen kunde hon se något – en skugga, kanske en fisk, eller något större. Något som rörde sig.\n\n"Emma! Kom hit!" ropade hon.\n\nMen Emma hade redan åkt iväg mot stranden igen. Sara var ensam ute på isen nu, och skuggan under henne blev större och större.\n\nPlötsligt sprack isen.\n\nNej, inte sprack – den öppnade sig. Som en dörr. Och därinne fanns inte vatten, utan en trappa av is som ledde ner i mörkret.`
        },
        {
          number: 3,
          title: "Ispalatset",
          character: "SARA",
          content: `Sara visste att hon borde vända om. Gå tillbaka till stranden, hitta Emma, berätta för någon vuxen. Men nyfikenheten var starkare.\n\nHon klev ner på första steget. Isen under hennes fötter var stadig, nästan varm. Ljuset från öppningen ovanför försvann för varje steg hon tog, men det gjorde inget – väggarna runt henne började lysa med sitt eget blå sken.\n\nNär trappan slutligen tog slut befann hon sig i ett enormt rum. Väggar av is, tak av is, golv av is. Men det var inte kallt. Och mitt i rummet stod någon.\n\n"Välkommen, Sara," sa gestalten. "Vi har väntat på dig."`
        }
      ],
    },
    {
      id: 2,
      title: "Leos Djungel",
      category: "Äventyr",
      coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&h=800&fit=crop",
      description: "Leo och hans djurvänner letar efter en förlorad skatt djupt i regnskogen.",
      chapters: [
        {
          number: 1,
          title: "Djungelns Gåta",
          character: "LEO",
          content: `Morgondimman låg tät över regnskogen när Leo vaknade. Han kunde höra aporna skrika någonstans i träden och papegojorna som svarade tillbaka. Detta var hans hem, men idag skulle bli annorlunda.\n\n"Leo! Kom hit!" ropade hans vän, kameleonten Kiko, från grenen ovanför.\n\nLeo klättrade upp snabbt. Kiko pekade med sin långa tunga mot något i fjärran – en bit guld som glittrade i morgonsolen.\n\n"Skatten," viskade Leo. "Den existerar faktiskt."`
        }
      ],
    },
    {
      id: 3,
      title: "Vår Kärlek",
      category: "Romantik",
      coverImage: "https://images.unsplash.com/photo-1522673607211-8741f6cce4d6?w=600&h=800&fit=crop",
      description: "Anna och Eriks gemensamma resa genom livets alla äventyr.",
      chapters: [
        {
          number: 1,
          title: "Första Mötet",
          character: "ANNA",
          content: `Det var en regnig tisdagskväll när våra liv plötsligt vävdes samman. Jag stod under ett träd vid bussens hållplats och försökte hålla mig torr, men regnet var obarmhärtigt.\n\n"Vill du dela paraply?" frågade en röst.\n\nJag vände mig om och såg honom för första gången. Erik. Med sina blöta glasögon och ett leende som fick regnet att kännas mindre viktigt.\n\n"Ja, tack," sa jag. Och så började allt.`
        }
      ],
    },
    {
      id: 4,
      title: "Mormors Minnen",
      category: "Livsberättelse",
      coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=800&fit=crop",
      description: "80 år av minnen, kärlek och livserfarenheter samlade i en vacker bok.",
      chapters: [
        {
          number: 1,
          title: "Barndomen i Dalarna",
          character: "ANNA-LISA",
          content: `År 1943 föddes jag i en liten stuga utanför Mora. Kriget rasade långt borta, men i vår lilla dal var livet relativt orört. Min första minne är lukten av nybakat bröd och min mors mjuka händer.\n\nVi var fattiga, men vi var rika på kärlek. Far arbetade i skogen och mor tog hand om oss fem barn. Varje kväll samlades vi runt spisen och lyssnade på fars berättelser.\n\nDet var en enklare tid, men också en svårare tid. Vi visste hur man uppskattade det lilla.`
        }
      ],
    },
    {
      id: 5,
      title: "Familjen Andersson",
      category: "Familjebok",
      coverImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=800&fit=crop",
      description: "Vår familjs historia från generation till generation.",
      chapters: [
        {
          number: 1,
          title: "Rötterna",
          character: "PER ANDERSSON",
          content: `Vår släkt kan spåras tillbaka till 1700-talet i Småland. Den första Andersson var en smed vid namn Anders Persson, som fick sitt efternamn efter sin far. Detta var innan släktnamnreformen, när man bytte efternamn varje generation.\n\nAnders hade tre söner: Per, Johan och Erik. Alla tre blev bönder, och det var Per som startade vår gren av familjen. Han gifte sig med Kerstin från grannbyn, och tillsammans fick de sju barn.\n\nLivet var hårt men ärligt. De arbetade jorden från gryning till skymning.`
        }
      ],
    },
    {
      id: 6,
      title: "Jämins Rymdresa",
      category: "Science Fiction",
      coverImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&h=800&fit=crop",
      description: "Ett spännande äventyr bland stjärnorna där Jämin räddar galaxen.",
      chapters: [
        {
          number: 1,
          title: "Uppdraget",
          character: "JÄMIN",
          content: `"Tror du på ödet?" frågade kommendanten.\n\n"Jag tror att vi har viktigare saker att diskutera," svarade Jämin utan att lyfta blicken från navigeringsdisplayen.\n\nRymdskeppet vibrerade när vi närmade oss galaxens mitt. Sensorer visade anomalier överallt – energifält vi aldrig sett förut, planeter som inte borde existera.\n\n"Detta är ett allvarligt uppdrag, Jämin," sa kommendanten.\n\n"Ett allvarligt uppdrag klockan tre på natten är inte ett allvarligt uppdrag, kommendanten."\n\nHon log inte. Hon visste vad som väntade oss därnere.`
        }
      ],
    },
  ];

  function openBook(book) {
    setSelectedBook(book);
    setCurrentPreviewPage(0);
  }

  function closeModal() {
    setSelectedBook(null);
    setCurrentPreviewPage(0);
  }

  function goToNextPage() {
    if (!selectedBook) return;
    const totalPages = 1 + selectedBook.chapters.length;
    setCurrentPreviewPage((prev) => (prev + 1) % totalPages);
  }

  function goToPrevPage() {
    if (!selectedBook) return;
    const totalPages = 1 + selectedBook.chapters.length;
    setCurrentPreviewPage((prev) => (prev - 1 + totalPages) % totalPages);
  }

  const featuredBooks = bookExamples.slice(0, 4);
  const activeFeaturedBook = featuredBooks[activeExampleIndex] ?? bookExamples[0];
  const usedPhotos = featuredBooks.map((book) => book.coverImage);
  const storyDetails = [
    { label: "Titel", value: activeFeaturedBook.title },
    { label: "Ålder", value: "3–8 år" },
    { label: "Tema", value: activeFeaturedBook.category },
    { label: "Ämne", value: activeFeaturedBook.chapters[0]?.title ?? "Personlig berättelse" },
    { label: "Stil", value: "Illustrerad sagostil" },
    { label: "Typsnitt", value: "Mjuk Sand" },
    { label: "Antal tecken", value: String(featuredBooks.length) },
  ];

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #FFF8E8 0%, #FFFFFF 40%)",
        padding: `${spacing["2xl"]} ${spacing.lg} ${spacing["3xl"]}`,
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            background: "#FFF3D6",
            borderRadius: "16px",
            padding: spacing.sm,
            marginBottom: spacing.lg,
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.07)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: spacing.lg,
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                background: "#FFE4A0",
                borderRadius: "14px",
                padding: spacing.sm,
              }}
            >
              <h3
                style={{
                  margin: `0 0 ${spacing.sm}`,
                  fontSize: fonts.size.md,
                  color: colors.text,
                }}
              >
                Använda foton
              </h3>
              <div style={{ borderTop: "1px dashed rgba(0,0,0,0.15)", marginBottom: spacing.sm }} />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: spacing.sm,
                }}
              >
                {usedPhotos.map((photo, index) => (
                  <button
                    key={`photo-${index}`}
                    onClick={() => setActiveExampleIndex(index)}
                    style={{
                      border: index === activeExampleIndex ? `3px solid ${colors.primary}` : "2px solid rgba(0,0,0,0.15)",
                      borderRadius: "12px",
                      padding: 0,
                      overflow: "hidden",
                      cursor: "pointer",
                      aspectRatio: "1 / 1",
                      background: colors.white,
                    }}
                    aria-label={`Välj foto ${index + 1}`}
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: spacing.sm,
                  color: colors.primary,
                  fontSize: "34px",
                  lineHeight: 1,
                }}
              >
                ↪
              </div>
            </div>

            <div
              style={{
                minWidth: "220px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "min(200px, 100%)",
                  borderRadius: "10px",
                  padding: "4px",
                  background: "#FFFBF2",
                  boxShadow: "0 6px 14px rgba(0, 0, 0, 0.10)",
                }}
              >
                <img
                  src={activeFeaturedBook.coverImage}
                  alt={`${activeFeaturedBook.title} omslag`}
                  style={{
                    width: "100%",
                    height: "240px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.sm,
              }}
            >
              <div
                style={{
                  background: "#FFE4A0",
                  borderRadius: "14px",
                  padding: spacing.sm,
                }}
              >
                <h3
                  style={{
                    margin: `0 0 ${spacing.xs}`,
                    fontSize: fonts.size.sm,
                    fontWeight: fonts.weight.bold,
                    color: colors.text,
                    letterSpacing: "0.2px",
                  }}
                >
                  Berättelseval
                </h3>
                <div style={{ borderTop: "1px dashed rgba(0,0,0,0.15)", marginBottom: spacing.sm }} />

                <div style={{ display: "grid", gap: "7px" }}>
                  {storyDetails.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "88px 1fr",
                        gap: spacing.xs,
                        alignItems: "start",
                      }}
                    >
                      <span
                        style={{
                          fontSize: fonts.size.xs,
                          fontWeight: fonts.weight.semibold,
                          color: colors.textLight,
                          textTransform: "uppercase",
                          letterSpacing: "0.35px",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: fonts.size.sm,
                          lineHeight: 1.35,
                          color: colors.text,
                          fontWeight: item.label === "Titel" ? fonts.weight.semibold : fonts.weight.normal,
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => openBook(activeFeaturedBook)}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  background: "#FFE4A0",
                  padding: `${spacing.xs} ${spacing.md}`,
                  textAlign: "left",
                  color: colors.primaryDark,
                  fontWeight: fonts.weight.bold,
                  fontSize: fonts.size.sm,
                  cursor: "pointer",
                }}
              >
                Visa exemplet
              </button>

              <Link
                to="/skapa"
                style={{
                  borderRadius: "10px",
                  background: "#FFE4A0",
                  padding: `${spacing.xs} ${spacing.md}`,
                  color: colors.primaryDark,
                  fontWeight: fonts.weight.bold,
                  fontSize: fonts.size.sm,
                  textDecoration: "none",
                  display: "block",
                }}
              >
                Skapa en egen bok
              </Link>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: spacing.lg,
            padding: spacing.md,
          }}
        >
          {bookExamples.map((book) => (
            <div
              key={book.id}
              onClick={() => openBook(book)}
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #FEFEFE 100%)",
                borderRadius: "16px",
                border: "1px solid rgba(0,0,0,0.06)",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(245, 158, 11, 0.08)";
                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)";
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
              }}
            >
              {/* Book Cover Image */}
              <div
                style={{
                  height: "220px",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #F5F5F5 0%, #E8E8E8 100%)",
                  position: "relative",
                }}
              >
                {/* Subtle overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <img
                  src={book.coverImage}
                  alt={book.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>

              {/* Book Info */}
              <div style={{ padding: spacing.sm }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: `4px ${spacing.xs}`,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(252, 211, 77, 0.15) 100%)",
                    fontSize: fonts.size.xs,
                    fontWeight: fonts.weight.bold,
                    color: colors.primary,
                    marginBottom: spacing.xs,
                    letterSpacing: "0.5px",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    boxShadow: "0 2px 4px rgba(245, 158, 11, 0.1)",
                  }}
                >
                  {book.category}
                </span>
                <h3
                  style={{
                    margin: `${spacing.xs} 0`,
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.bold,
                    color: colors.text,
                    lineHeight: 1.2,
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: fonts.size.xs,
                    color: colors.textLight,
                    lineHeight: 1.4,
                  }}
                >
                  {book.description}
                </p>
              </div>
              
              {/* Subtle bottom accent */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, transparent 0%, ${colors.primary} 50%, transparent 100%)`,
                  opacity: 0.2,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedBook ? (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: spacing.lg,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(1400px, 95%)",
              maxHeight: "95vh",
              background: colors.white,
              borderRadius: "8px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header: Book title centered */}
            <div
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                borderBottom: `1px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: fonts.size.xl,
                  fontWeight: fonts.weight.normal,
                  color: colors.text,
                  textAlign: "center",
                }}
              >
                {selectedBook.title}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  position: "absolute",
                  right: spacing.lg,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "28px",
                  color: colors.textLight,
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* Book content */}
            <div
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "60px 1fr 60px",
                alignItems: "center",
                gap: spacing.md,
                padding: spacing.lg,
                overflow: "auto",
              }}
            >
              <button
                onClick={goToPrevPage}
                aria-label="Föregående sida"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: `1px solid ${colors.border}`,
                  background: colors.white,
                  cursor: "pointer",
                  color: colors.text,
                  fontSize: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                ‹
              </button>

              <div
                key={`${selectedBook.id}-${currentPreviewPage}`}
                style={{
                  animation: "bookPageShift 350ms ease",
                }}
              >
                {(() => {
                  const isCover = currentPreviewPage === 0;

                  if (isCover) {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "600px",
                        }}
                      >
                        <div
                          style={{
                            width: "400px",
                            height: "600px",
                            borderRadius: "4px",
                            overflow: "hidden",
                            background: colors.white,
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <img
                            src={selectedBook.coverImage}
                            alt={`${selectedBook.title} omslag`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </div>
                    );
                  }

                  const chapter = selectedBook.chapters[currentPreviewPage - 1];
                  if (!chapter) return null;

                  return (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "2px",
                        minHeight: "600px",
                        background: "#ddd",
                      }}
                    >
                      {/* Left page - Chapter title */}
                      <div
                        style={{
                          background: "#FFFFFF",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: `${spacing["2xl"]} ${spacing.xl}`,
                          boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: fonts.size.sm,
                            fontWeight: fonts.weight.semibold,
                            color: colors.textLight,
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            marginBottom: spacing.md,
                          }}
                        >
                          KAPITEL {chapter.number}
                        </p>
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            marginBottom: spacing.lg,
                            opacity: 0.7,
                          }}
                        >
                          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="40" stroke={colors.primary} strokeWidth="2" />
                            <path d="M35 50 L65 50 M50 35 L50 65" stroke={colors.primary} strokeWidth="2" />
                          </svg>
                        </div>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: fonts.size["3xl"],
                            fontWeight: fonts.weight.bold,
                            color: colors.text,
                            textAlign: "center",
                            letterSpacing: "1px",
                          }}
                        >
                          {chapter.character}
                        </h2>
                      </div>

                      {/* Right page - Chapter content */}
                      <div
                        style={{
                          background: "#FFFFFF",
                          padding: `${spacing["2xl"]} ${spacing.xl}`,
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <h3
                          style={{
                            margin: `0 0 ${spacing.lg}`,
                            fontSize: fonts.size.xl,
                            fontWeight: fonts.weight.semibold,
                            color: colors.text,
                            textAlign: "left",
                          }}
                        >
                          {chapter.title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: fonts.size.md,
                            lineHeight: 1.8,
                            color: colors.text,
                            fontFamily: "Georgia, serif",
                            textAlign: "justify",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {chapter.content}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <button
                onClick={goToNextPage}
                aria-label="Nästa sida"
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  border: `1px solid ${colors.border}`,
                  background: colors.white,
                  cursor: "pointer",
                  color: colors.text,
                  fontSize: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                ›
              </button>
            </div>

            {/* Footer: Page number */}
            <div
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                borderTop: `1px solid ${colors.border}`,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: colors.textLight,
                  fontSize: fonts.size.sm,
                }}
              >
                {currentPreviewPage === 0
                  ? "Omslag"
                  : `Sida ${currentPreviewPage} av ${selectedBook.chapters.length} (KAPITEL ${selectedBook.chapters[currentPreviewPage - 1].number}: ${selectedBook.chapters[currentPreviewPage - 1].character})`}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @keyframes bookPageShift {
          from {
            opacity: 0.6;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
