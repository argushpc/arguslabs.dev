import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Mail } from "lucide-react";
import { smoothScrollHandler } from "../lib/anchor";
import { cn } from "../lib/cn";
import { CONTACT_EMAIL, GITHUB_URL } from "../lib/links";
import { Wordmark } from "./Wordmark";

const NAV_LINKS = [
  { href: "#problem", label: "Problem" },
  { href: "#features", label: "Features" },
  { href: "#architecture", label: "Architecture" },
  { href: "#install", label: "Install" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="container-px mx-auto flex h-16 max-w-6xl items-center justify-between">
        <a
          href="#top"
          onClick={smoothScrollHandler("top")}
          aria-label="ARGUS home"
          className="focus-ring rounded"
        >
          <Wordmark size="md" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={smoothScrollHandler(link.href.slice(1))}
              className="focus-ring rounded-sm text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/guides/lima"
            className="focus-ring rounded-sm text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            Lima Guide
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="focus-ring hidden h-9 items-center gap-2 rounded-lg border border-ink-700/70 bg-ink-850/60 px-3 text-sm text-zinc-300 transition-colors hover:border-argus-500/50 hover:text-zinc-100 sm:inline-flex"
          >
            <Mail className="h-3.5 w-3.5" />
            Contact
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg bg-argus-500 px-3 text-sm font-medium text-white transition-colors hover:bg-argus-400"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
