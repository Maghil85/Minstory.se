import { useState, useEffect } from "react";
import { colors, spacing, fonts } from "../styles/theme";

export function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Exempel bilder och videor - kan enkelt bytas ut
  const slides = [
    {
      id: 1,
      type: "video",
      video: "/bilder och video/2.mp4",
      title: "Här börjar ditt äventyr",
      subtitle: "Din bild. Din magi. Din berättelse.",
    },
    {
      id: 2,
      type: "video",
      video: "/bilder och video/2a.mp4",
      title: "Skapa Din Egen Historia",
      subtitle: "Låt dina närstående bli huvudpersonen",
    },
    {
      id: 3,
      type: "video",
      video: "/bilder och video/3.mp4",
      title: "MinStory – där din historia blir en bok",
      subtitle: "Min story - barn, kärlekshistorier, familjeminnen, äventyr, personliga berättelser",
    },
    {
      id: 4,
      type: "video",
      video: "/bilder och video/4.mp4",
      title: "Din historia som seriebok",
      subtitle: "Din egen historia som seriebok",
    },
    {
      id: 5,
      type: "video",
      video: "/bilder och video/5.mp4",
      title: "Skapa på ditt sätt",
      subtitle: "Personlig bok med din egen stil",
    },
    {
      id: 6,
      type: "image",
      image: "/bilder och video/6.png",
      title: "Livsberättelser",
      subtitle: "Dokumentera minnen och upplevelser",
    },
    {
      id: 7,
      type: "video",
      video: "/bilder och video/7c.mp4",
      title: "Från bild till ett äventyr",
      subtitle: "Se hur din foto blir en magisk berättelse",
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Byt slide var 5:e sekund

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    // Starta auto-play igen efter 10 sekunder
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: colors.white,
      }}
    >
      {/* Slides Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "25%", // 4:1 aspect ratio - lägre banner
          backgroundColor: colors.neutral100,
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              pointerEvents: currentSlide === index ? "auto" : "none",
            }}
          >
            {slide.type === "video" ? (
              <video
                src={slide.video}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: slide.id === 5 ? "center 25%" : slide.id === 7 ? "center 35%" : "center",
                  display: "block",
                }}
                autoPlay
                muted
                loop
              />
            ) : (
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            )}

            {/* Gradient overlay */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.1))",
              }}
            />

            {/* Text Content */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: spacing["2xl"],
                color: colors.white,
                animation: currentSlide === index ? "slideInUp 0.8s ease-out" : "none",
              }}
            >
              <h2
                style={{
                  fontSize: fonts.size["3xl"],
                  fontWeight: fonts.weight.bold,
                  marginBottom: spacing.md,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                {slide.title}
              </h2>
              <p
                style={{
                  fontSize: fonts.size.lg,
                  color: colors.white,
                  opacity: 0.95,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons - Vänster */}
      <button
        onClick={prevSlide}
        style={{
          position: "absolute",
          left: spacing.lg,
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          color: colors.primary,
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
          e.currentTarget.style.color = colors.white;
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.transform = "translateY(-50%)";
        }}
        aria-label="Föregående bild"
      >
        ❮
      </button>

      {/* Navigation Buttons - Höger */}
      <button
        onClick={nextSlide}
        style={{
          position: "absolute",
          right: spacing.lg,
          top: "50%",
          transform: "translateY(-50%)",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          color: colors.primary,
          fontSize: "24px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = colors.primary;
          e.currentTarget.style.color = colors.white;
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
          e.currentTarget.style.color = colors.primary;
          e.currentTarget.style.transform = "translateY(-50%)";
        }}
        aria-label="Nästa bild"
      >
        ❯
      </button>

      {/* Navigation Dots */}
      <div
        style={{
          position: "absolute",
          bottom: spacing.lg,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: spacing.md,
          zIndex: 10,
        }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            style={{
              width: currentSlide === index ? "32px" : "10px",
              height: "10px",
              borderRadius: "5px",
              border: "none",
              backgroundColor:
                currentSlide === index
                  ? colors.primary
                  : "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary;
            }}
            onMouseOut={(e) => {
              if (currentSlide !== index) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)";
              }
            }}
            aria-label={`Gå till bild ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div
        style={{
          position: "absolute",
          top: spacing.lg,
          right: spacing.lg,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: colors.white,
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: "20px",
          fontSize: fonts.size.sm,
          fontWeight: fonts.weight.semibold,
          zIndex: 10,
        }}
      >
        {currentSlide + 1} / {slides.length}
      </div>
    </section>
  );
}
