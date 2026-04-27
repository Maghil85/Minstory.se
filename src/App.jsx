import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { CookieBanner } from "./components/CookieBanner";
import { Home, HowItWorksPage, ExamplesPage, PricingPage, CreateStoryPage, AdminPage, MyOrdersPage, AboutPage, ContactPage, IntegritetspolicyPage, AnvandarvillkorPage, NotFoundPage } from "./pages";
import { colors } from "./styles/theme";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ margin: 0, background: colors.white, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hur-det-funkar" element={<HowItWorksPage />} />
            <Route path="/exempel" element={<ExamplesPage />} />
            <Route path="/pris" element={<PricingPage />} />
            <Route path="/skapa" element={<CreateStoryPage />} />
            <Route path="/om-oss" element={<AboutPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/integritetspolicy" element={<IntegritetspolicyPage />} />
            <Route path="/anvandarvillkor" element={<AnvandarvillkorPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/mina-sidor" element={<MyOrdersPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}
