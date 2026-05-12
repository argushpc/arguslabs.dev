import {
  Cpu,
  Network,
  Gauge,
  Workflow,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

const FEATURES = [
  {
    icon: Cpu,
    title: "Kernel probes via eBPF",
    body: "kprobes and tracepoints for slab allocation latency, IRQ affinity skew, NAPI saturation, and CQ completion jitter. Counted per-CPU in-kernel. No ring buffer.",
    chips: [
      "kmem_cache_alloc",
      "irq_handler_entry",
      "napi_poll",
      "CQ submit/poll",
    ],
  },
  {
    icon: Network,
    title: "InfiniBand HW counters",
    body: "Reads sysfs counters for symbol errors, link-downed events, port receive errors, transmit discards, remote physical errors, and Soft-RoCE retries.",
    chips: ["mlx5", "rxe", "sysfs deltas", "throughput"],
  },
  {
    icon: Gauge,
    title: "Eleven detection rules",
    body: "IRQ skew, RDMA spikes, link degradation, slab-pressure correlation, rising error trend, latency-drift z-score, throughput drop, NAPI saturation, CQ jitter, congestion spread, PCIe bottleneck. Some rules are reactive (error counters); others are predictive (drift z-scores). Each carries a confidence weight.",
    chips: ["EWMA", "peak-hold", "z-score"],
  },
  {
    icon: Workflow,
    title: "Hardened state machine",
    body: "Three states (Healthy, Degraded, Critical) with asymmetric thresholds for escalation vs. recovery. Dwell timers require signals to hold before a transition fires, so transient noise doesn't cause flapping.",
    chips: ["hysteresis", "dwell timers", "smoothing"],
  },
  {
    icon: ShieldCheck,
    title: "Scheduler integration",
    body: "A reconciliation loop keeps ARGUS state and scheduler state in sync. Drains unhealthy nodes, resumes recovered ones. Operator holds let you pin a node as drained independently of ARGUS.",
    chips: ["SLURM", "K8s · WIP", "operator holds"],
  },
  {
    icon: TerminalSquare,
    title: "Drop-in observability",
    body: "A Prometheus /metrics endpoint, three pre-built Grafana dashboards (Fleet · Node · Link), and a TUI you can attach to any running agent without interrupting it. Plain HTTP for trusted networks; TLS + bearer auth out of the box.",
    chips: ["Prometheus", "Grafana", "TUI"],
  },
];

const COUNTERS = [
  "symbol_errors",
  "link_downed",
  "port_rcv_errors",
  "port_xmit_discards",
  "local_link_integrity_errors",
  "excessive_buffer_overrun_errors",
  "remote_physical_errors",
  "rxe_duplicate_request",
  "rxe_out_of_sequence",
  "rxe_retry_exceeded",
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative border-b border-ink-600/40 py-20 sm:py-28"
    >
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Capabilities"
          title="What does ARGUS do?"
          subtitle="Reads kernel signals via eBPF and InfiniBand counters via sysfs. Runs eleven detection rules with confidence weighting. Drives a three-state machine that drains and resumes nodes through your scheduler. Under 1% CPU at the default 3-second window."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-12 panel overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-ink-700/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="eyebrow">Hardware counters</div>
              <div className="mt-1 text-sm font-semibold text-zinc-100">
                Read once per window. Deltas feed the detection rules.
              </div>
            </div>
            <div className="font-mono text-[11px] text-zinc-500">
              /sys/class/infiniband/*/ports/*/counters
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 p-5">
            {COUNTERS.map((c) => (
              <code
                key={c}
                className="rounded-md border border-ink-600/60 bg-ink-900/80 px-2 py-1 font-mono text-[11px] text-zinc-300"
              >
                {c}
              </code>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  chips,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  chips: string[];
}) {
  return (
    <div className="panel panel-hover group relative overflow-hidden p-5">
      <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-argus-500/30 bg-argus-500/10 text-argus-400 transition-colors group-hover:border-argus-500/50">
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-base font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{body}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-md border border-ink-600/60 bg-ink-900/60 px-2 py-0.5 font-mono text-[10.5px] text-zinc-400"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="display-tight mt-4 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-[42px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-[17px] leading-[1.65] text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
