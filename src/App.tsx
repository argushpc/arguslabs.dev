import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Install from "./components/Install";
import Footer from "./components/Footer";
import LimaGuide from "./pages/LimaGuide";

function HomePage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    if (hash !== "top") {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    }
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }, []);

  return (
    <div className="min-h-screen bg-ink-950 text-zinc-100">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Install />
      </main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guides/lima" element={<LimaGuide />} />
      </Routes>
    </>
  );
}
