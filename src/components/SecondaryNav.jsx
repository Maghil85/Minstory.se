import { Link, useLocation } from "react-router-dom";
import { colors, spacing, fonts } from "../styles/theme";

export function SecondaryNav() {
  const location = useLocation();

  const navItems = [
    { label: "Hem", path: "/" },
    { label: "Våra böcker", path: "/exempel" },
    { label: "Pris", path: "/pris" },
    { label: "Om oss", path: "/om-oss" },
    { label: "Kontakt", path: "/kontakt" },
  ];

  return (
    <nav
      style={{
        backgroundColor: "#F59E0B",
        padding: `${spacing.xs} 0`,
        borderBottom: "2px solid rgba(217, 119, 6, 0.55)",
        boxShadow: "0 6px 18px rgba(245, 158, 11, 0.2)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: `0 ${spacing.lg}`,
          display: "flex",
          gap: spacing.md,
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: colors.white,
                textDecoration: "none",
                fontSize: fonts.size.sm,
                fontWeight: fonts.weight.semibold,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: "4px",
                transition: "all 0.3s ease",
                backgroundColor: isActive ? "rgba(255, 255, 255, 0.24)" : "transparent",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.18)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
