import { SecondaryNav, ImageCarousel, BestsellersSection, HeroSection } from "../components";
import { CreateStoryForm } from "../components/CreateStoryForm";
import { colors } from "../styles/theme";

export function Home() {
  return (
    <>
      <main style={{ background: colors.white }}>
        <SecondaryNav />
        <ImageCarousel />
        <CreateStoryForm />
        <BestsellersSection />
        <HeroSection scrollToId={() => {}} />
      </main>
    </>
  );
}
