import { Link } from "react-router-dom";
import { colors, spacing, fonts } from "../styles/theme";

export function BestsellersSection() {
  const templates = [
    {
      id: 1,
      title: "Sara",
      description: "Ett magiskt skridskoäventyr",
      image: "https://images.unsplash.com/photo-1516557070061-c3d1653fa646?w=600&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Leo",
      description: "Ett äventyr i djungeln",
      image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=600&fit=crop",
    },
    {
      id: 3,
      title: "Anna & Erik",
      description: "Ett äventyr i djungeln",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Anna & Erik",
      description: "Kärlekshistoria",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop",
    },
  ];

  return (
    <section
      style={{
        background: colors.white,
        marginTop: spacing["2xl"],
        padding: `${spacing["3xl"]} ${spacing.lg} ${spacing.lg}`,
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacing.lg,
          }}
        >
          <div style={{ maxWidth: 760 }}>
            <p
              style={{
                margin: 0,
                fontSize: "34px",
                fontWeight: fonts.weight.bold,
                color: colors.text,
                letterSpacing: "0px",
                lineHeight: 1.08,
              }}
            >
              Våra böcker
            </p>
            <h2
              style={{
                margin: `${spacing.sm} 0 0`,
                fontSize: "20px",
                fontWeight: fonts.weight.normal,
                color: colors.textLight,
                letterSpacing: "0px",
                lineHeight: 1.3,
              }}
            >
              Se hur vi förvandlar riktiga bilder till personliga böcker
            </h2>
          </div>
          <Link
            to="/exempel"
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: "8px",
              border: "none",
              background: "#F59E0B",
              color: colors.white,
              cursor: "pointer",
              fontWeight: fonts.weight.bold,
              fontSize: fonts.size.sm,
              transition: "all 0.3s ease",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: spacing.xs,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#D97706";
              e.currentTarget.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F59E0B";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            Se alla →
          </Link>
        </div>

        {/* Template Cards */}
        <div
          style={{
            background: colors.white,
            borderRadius: "20px",
            border: `1px solid ${colors.border}`,
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
            padding: spacing.lg,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: spacing.sm,
              alignItems: "stretch",
            }}
          >
            {templates.map((template) => (
              <div
                key={template.id}
                style={{
                  position: "relative",
                  background: colors.white,
                  borderRadius: "14px",
                  border: `1px solid ${colors.gray}`,
                  padding: spacing.xs,
                }}
              >
                <div style={{ height: "140px", borderRadius: "10px", overflow: "hidden" }}>
                  <img
                    src={template.image}
                    alt={template.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ paddingTop: spacing.sm, textAlign: "center" }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: fonts.size.lg,
                      fontWeight: fonts.weight.bold,
                      color: colors.text,
                    }}
                  >
                    {template.title}
                  </h3>

                  <p
                    style={{
                      margin: `${spacing.xs} 0 0`,
                      fontSize: fonts.size.sm,
                      color: colors.textLight,
                    }}
                  >
                    Foto till Bokillustration
                  </p>

                  <p
                    style={{
                      margin: `${spacing.sm} 0 ${spacing.md}`,
                      fontSize: fonts.size.sm,
                      color: colors.textLight,
                      minHeight: "34px",
                    }}
                  >
                    {template.description}
                  </p>

                  <Link
                    to="/skapa"
                    style={{
                      display: "block",
                      width: "100%",
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: "8px",
                      border: "none",
                      background: "#F59E0B",
                      color: colors.white,
                      cursor: "pointer",
                      fontWeight: fonts.weight.bold,
                      fontSize: fonts.size.md,
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#D97706";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#F59E0B";
                    }}
                  >
                    Se exempel
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
