import { SecondaryNav } from "../components";
import { colors, spacing, fonts } from "../styles/theme";

export function StoryTypesPage() {
  const storyTypes = [
    {
      icon: "✨",
      title: "Barnsaga",
      text: "En magisk saga där barnet blir hjälten",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&h=500&fit=crop",
    },
    {
      icon: "💕",
      title: "Kärlekshistoria",
      text: "En romantisk berättelse om er relation",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&h=500&fit=crop",
    },
    {
      icon: "🗺️",
      title: "Äventyr",
      text: "Spännande historier där du blir huvudpersonen",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=500&fit=crop",
    },
    {
      icon: "🐉",
      title: "Fantasy",
      text: "Magiska världar med drakar, hjältar och äventyr",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=500&fit=crop",
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Familjeberättelse",
      text: "Skapa en bok om familjens minnen",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop",
    },
    {
      icon: "🦸",
      title: "Superhjälte-serie",
      text: "Du eller ditt barn blir en superhjälte i en serie",
      image: "https://images.unsplash.com/photo-1531256379411-3f2f67a5e819?w=800&h=500&fit=crop",
    },
    {
      icon: "😂",
      title: "Humorberättelse",
      text: "En rolig berättelse fylld med skratt och personliga skämt",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=500&fit=crop",
    },
    {
      icon: "🏆",
      title: "Inspirationshistoria",
      text: "En motiverande berättelse om mod, mål och drömmar",
      image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=500&fit=crop",
    },
  ];

  const formats = [
    {
      icon: "📚",
      title: "Personlig bok",
      text: "En illustrerad bok där riktiga personer blir huvudpersoner",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop",
    },
    {
      icon: "💥",
      title: "Seriebok",
      text: "Din historia berättad som en spännande serie",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=500&fit=crop",
    },
    {
      icon: "🎬",
      title: "Mini-film",
      text: "Din berättelse kan också bli en kort magisk video",
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=500&fit=crop",
    },
    {
      icon: "💻",
      title: "Digital bok",
      text: "Läs boken direkt online",
      image: "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=800&h=500&fit=crop",
    },
    {
      icon: "📦",
      title: "Tryckt bok",
      text: "Få boken hemskickad",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=500&fit=crop",
    },
    {
      icon: "🎧",
      title: "Ljudbok",
      text: "Lyssna på berättelsen som en personlig ljudupplevelse",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=500&fit=crop",
    },
    {
      icon: "🎁",
      title: "Presentutgåva",
      text: "En färdig gåvoversion perfekt för födelsedag eller högtid",
      image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=500&fit=crop",
    },
    {
      icon: "🖼️",
      title: "Fotobok",
      text: "Kombinera dina bilder med en personlig berättelse i bokformat",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=500&fit=crop",
    },
  ];

  const steps = [
    { icon: "📸", text: "Ladda upp ett foto" },
    { icon: "🧩", text: "Välj berättelse eller format" },
    { icon: "✨", text: "Vi skapar din bok eller film" },
    { icon: "📬", text: "Få den digitalt eller tryckt hem" },
    { icon: "📝", text: "Godkänn utkastet innan leverans" },
    { icon: "🔁", text: "Be om justeringar om du vill" },
    { icon: "🎨", text: "Vi finjusterar stil och illustrationer" },
    { icon: "✅", text: "Färdig version levereras till dig" },
  ];

  return (
    <main style={{ background: colors.white }}>
      <SecondaryNav />

      {/* Sektion 1 */}
      <section
        style={{
          background: `linear-gradient(135deg, ${colors.pastelLila} 0%, ${colors.pastelBlue} 100%)`,
          padding: `${spacing["3xl"]} ${spacing.lg}`,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: fonts.size["4xl"],
              margin: 0,
              color: colors.text,
              fontWeight: fonts.weight.extrabold,
              textAlign: "center",
            }}
          >
            Vilken berättelse vill du skapa?
          </h1>
          <p
            style={{
              margin: `${spacing.md} auto 0`,
              maxWidth: 760,
              fontSize: fonts.size.lg,
              color: colors.textLight,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            MinStory är inte bara för barn. Skapa personliga berättelser för familj, vänner, partner eller dig själv.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: spacing.md,
              marginTop: spacing["3xl"],
            }}
          >
            {storyTypes.map((item) => (
              <div
                key={item.title}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  padding: spacing.md,
                  background: colors.white,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: spacing.sm,
                  }}
                />
                <p style={{ margin: 0, fontWeight: fonts.weight.extrabold, fontSize: fonts.size.md, color: colors.text }}>
                  {item.icon} {item.title}
                </p>
                <p
                  style={{
                    margin: `${spacing.sm} 0 0`,
                    opacity: 0.8,
                    lineHeight: 1.5,
                    fontSize: fonts.size.sm,
                    color: colors.textLight,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sektion 2 */}
      <section style={{ padding: `${spacing["5xl"]} ${spacing.lg}`, background: colors.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: fonts.size["4xl"],
              margin: 0,
              color: colors.text,
              fontWeight: fonts.weight.extrabold,
              textAlign: "center",
            }}
          >
            Hur vill du skapa din berättelse?
          </h2>
          <p
            style={{
              margin: `${spacing.md} auto 0`,
              maxWidth: 760,
              fontSize: fonts.size.lg,
              color: colors.textLight,
              lineHeight: 1.6,
              textAlign: "center",
            }}
          >
            MinStory erbjuder flera format så du kan välja det sätt som passar dig bäst.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: spacing.md,
              marginTop: spacing["3xl"],
            }}
          >
            {formats.map((item) => (
              <div
                key={item.title}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  padding: spacing.md,
                  background: colors.white,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "110px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: spacing.sm,
                  }}
                />
                <p style={{ margin: 0, fontWeight: fonts.weight.extrabold, fontSize: fonts.size.md, color: colors.text }}>
                  {item.icon} {item.title}
                </p>
                <p
                  style={{
                    margin: `${spacing.sm} 0 0`,
                    opacity: 0.8,
                    lineHeight: 1.5,
                    fontSize: fonts.size.sm,
                    color: colors.textLight,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sektion 3 */}
      <section style={{ padding: `0 ${spacing.lg} ${spacing["5xl"]}`, background: colors.white }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: fonts.size["4xl"],
              margin: 0,
              color: colors.text,
              fontWeight: fonts.weight.extrabold,
              textAlign: "center",
            }}
          >
            Så fungerar MinStory
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: spacing.md,
              marginTop: spacing["3xl"],
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.text}
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: "12px",
                  padding: spacing.md,
                  background: colors.white,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <p style={{ margin: 0, fontSize: "24px", lineHeight: 1 }}>{step.icon}</p>
                <p
                  style={{
                    margin: `${spacing.xs} 0 0`,
                    fontWeight: fonts.weight.extrabold,
                    fontSize: fonts.size.md,
                    color: colors.text,
                  }}
                >
                  Steg {index + 1}
                </p>
                <p
                  style={{
                    margin: `${spacing.sm} 0 0`,
                    opacity: 0.8,
                    lineHeight: 1.5,
                    fontSize: fonts.size.sm,
                    color: colors.textLight,
                  }}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
