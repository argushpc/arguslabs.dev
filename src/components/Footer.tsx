import { Github, Mail } from "lucide-react";
import { CONTACT_EMAIL, GITHUB_URL } from "../lib/links";
import { Wordmark } from "./Wordmark";

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/40 py-14">
      <div className="container-px mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <Wordmark size="lg" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-500">
              Adaptive RDMA Guard &amp; Utilization Sentinel. Built for HPC
              clusters that can&apos;t afford a silent fabric.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg border border-ink-700/70 bg-ink-850/60 px-3 text-sm text-zinc-300 transition-colors hover:border-argus-500/50 hover:text-zinc-100"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-700/70 bg-ink-850/60 text-zinc-300 transition-colors hover:border-argus-500/50 hover:text-zinc-100"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-ink-700/40 pt-6 text-[11.5px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ARGUS · Active development.</span>
          <span className="font-mono">
            kernels 5.4+ · CAP_BPF · seccomp · privilege-dropping
          </span>
        </div>
      </div>
    </footer>
  );
}
