import { useState } from "react";
import { Check, Copy, ExternalLink, Server, Box } from "lucide-react";
import { SectionHeader } from "./Features";
import { cn } from "../lib/cn";
import { CONTACT_EMAIL, GITHUB_URL } from "../lib/links";

const TABS = [
  { id: "quick", label: "Quick start", icon: Box, hint: "no root, no IB hardware" },
  { id: "standalone", label: "Standalone", icon: Server, hint: "ARGUS bundles Grafana + Prometheus" },
  { id: "integrate", label: "Integrate", icon: ExternalLink, hint: "your existing observability stack" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CLONE_URL = `${GITHUB_URL}.git`;

const SNIPPETS: Record<TabId, { code: string; caption: string }[]> = {
  quick: [
    {
      caption: "Try the full pipeline against synthetic events.",
      code: `git clone ${CLONE_URL}
cd ARGUS
cargo run --release -- --mode mock --profile skew --tui`,
    },
  ],
  standalone: [
    {
      caption: "Install the agent and start the bundled stack.",
      code: `git clone ${CLONE_URL}
cd ARGUS
sudo ./scripts/install.sh
sudo systemctl enable --now argusd

# Discover and start observability stack
sudo argus-discover --subnet 10.0.0.0/24 --start
# Grafana → http://<host-ip>:3000  (admin/admin)`,
    },
    {
      caption: "Verify the agent is reporting.",
      code: `argus-status --watch
curl localhost:9100/health`,
    },
  ],
  integrate: [
    {
      caption: "Install the agent on each monitored node.",
      code: `git clone ${CLONE_URL} && cd ARGUS
sudo ./scripts/install.sh
sudo systemctl enable --now argusd
curl http://localhost:9100/health`,
    },
    {
      caption: "Add ARGUS to your Prometheus scrape config.",
      code: `scrape_configs:
  - job_name: argus
    scrape_interval: 5s
    static_configs:
      - targets: ["node01:9100", "node02:9100"]`,
    },
    {
      caption: "Import the three pre-built Grafana dashboards.",
      code: `# deploy/observability/grafana/dashboards/
#   argus-fleet-overview.json
#   argus-node-detail.json
#   argus-link-drilldown.json`,
    },
  ],
};

export default function Install() {
  const [tab, setTab] = useState<TabId>("quick");

  return (
    <section
      id="install"
      className="relative border-b border-ink-600/40 py-20 sm:py-28"
    >
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Deploy"
          title="Two paths. Pick whichever matches your stack."
          subtitle="Run ARGUS standalone with the bundled Prometheus + Grafana, or scrape it from your existing observability stack. The agent is the same in both modes."
        />

        <div className="mt-12 panel overflow-hidden">
          <div className="flex flex-wrap border-b border-ink-600/60">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "focus-ring group flex flex-1 items-center gap-3 border-b-2 px-5 py-4 text-left transition-colors",
                    active
                      ? "border-argus-500 bg-ink-800/60"
                      : "border-transparent hover:bg-ink-800/30",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md border",
                      active
                        ? "border-argus-500/40 bg-argus-500/10 text-argus-400"
                        : "border-ink-600/60 bg-ink-900/60 text-zinc-400",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        active ? "text-zinc-100" : "text-zinc-300",
                      )}
                    >
                      {t.label}
                    </span>
                    <span className="block text-[11px] text-zinc-500">
                      {t.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            {SNIPPETS[tab].map((s, i) => (
              <CodeBlock key={i} caption={s.caption} code={s.code} />
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <Card
            title="Scheduler integration"
            body="Drains unhealthy nodes from SLURM (Kubernetes is on the roadmap). A reconciliation loop converges ARGUS's desired state with the scheduler's observed state. Operator holds prevent ARGUS from resuming externally-drained nodes."
          >
            <CodeBlock
              compact
              code={`argus-scheduler validate
sudo argus-scheduler enable slurm
argus-scheduler status

# Operator holds
argus-scheduler hold
argus-scheduler release`}
            />
          </Card>

          <Card
            title="HTTP endpoints"
            body="Plain HTTP on a trusted network, or TLS + bearer auth out of the box. Three telemetry endpoints (scrape, liveness, full status) plus two scheduler-control endpoints for operator holds."
          >
            <div className="space-y-2 font-mono text-[11.5px]">
              <Endpoint path="/metrics" desc="Prometheus text format · scrape target" />
              <Endpoint path="/health" desc="JSON · liveness probes, SLURM health checks" />
              <Endpoint path="/status" desc="JSON · full metrics + alerts (TUI attach)" />
              <Endpoint path="/scheduler/hold" desc="JSON · set operator hold" />
              <Endpoint path="/scheduler/release" desc="JSON · release hold" />
            </div>
          </Card>
        </div>

        <div className="mt-12 panel relative overflow-hidden p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="text-center sm:text-left">
              <div className="eyebrow">Active development</div>
              <h3 className="mt-2 text-2xl font-bold text-zinc-100">
                ARGUS is early. We&apos;d like your help.
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-[1.65] text-zinc-400 sm:mx-0">
                Areas where contributions would land hardest: additional eBPF
                probes (scheduler latency, page faults, cgroup pressure),
                smarter detection (ML anomaly, signal correlation), packaging
                (RPM/DEB, container images), and real-world IB failure-pattern
                characterization. If any of that is your wheelhouse, get in
                touch.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg bg-argus-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-argus-400"
              >
                Contact
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex h-11 items-center gap-2 rounded-lg border border-ink-700/70 bg-ink-850/60 px-5 text-sm font-medium text-zinc-200 transition-colors hover:border-argus-500/50"
              >
                Open issue
              </a>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-argus-400/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel min-w-0 overflow-hidden p-5">
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Endpoint({ path, desc }: { path: string; desc: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-md border border-ink-600/60 bg-ink-900/60 px-3 py-2">
      <code className="shrink-0 text-argus-300">{path}</code>
      <span className="min-w-0 flex-1 truncate text-[11px] text-zinc-500">
        {desc}
      </span>
    </div>
  );
}

function CodeBlock({
  code,
  caption,
  compact,
}: {
  code: string;
  caption?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div>
      {caption && !compact && (
        <div className="mb-2 text-[12px] text-zinc-400">{caption}</div>
      )}
      <div className="group relative overflow-hidden rounded-lg border border-ink-600/60 bg-ink-900/80">
        <button
          onClick={onCopy}
          className="focus-ring absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-md border border-ink-600/60 bg-ink-800/80 px-2 text-[10.5px] text-zinc-400 opacity-0 transition-all hover:text-zinc-100 focus-visible:opacity-100 group-hover:opacity-100"
          aria-label="Copy"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-argus-400" />
              copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              copy
            </>
          )}
        </button>
        <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-relaxed text-zinc-200">
          <code>{shadeShell(code)}</code>
        </pre>
      </div>
    </div>
  );
}

function shadeShell(code: string): React.ReactNode[] {
  const lines = code.split("\n");
  return lines.map((line, i) => {
    const isLast = i === lines.length - 1;
    const newline = isLast ? "" : "\n";
    const trimmed = line.trimStart();

    if (trimmed.startsWith("#")) {
      return (
        <span key={i} className="text-zinc-500">
          {line}
          {newline}
        </span>
      );
    }

    if (line.startsWith("$ ")) {
      return (
        <span key={i}>
          <span className="text-zinc-500">$ </span>
          {shadeCommand(line.slice(2))}
          {newline}
        </span>
      );
    }

    return (
      <span key={i}>
        {shadeCommand(line)}
        {newline}
      </span>
    );
  });
}

function shadeCommand(text: string): React.ReactNode[] {
  return text.split(/(\s+)/).map((tok, i) => {
    if (/^--?[a-zA-Z]/.test(tok)) {
      return (
        <span key={i} className="text-argus-300">
          {tok}
        </span>
      );
    }
    return <span key={i}>{tok}</span>;
  });
}
