import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Install from "./components/Install";
import Footer from "./components/Footer";

export default function App() {
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
