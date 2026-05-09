import { SectionHeader } from "./Features";

const PIPELINE = [
  {
    step: "01",
    title: "In-kernel counters",
    body: "kprobes and tracepoints attach to slab, IRQ, NAPI, and CQ submit/poll paths. Per-CPU BPF maps increment at nanosecond scale. No ring buffers, no syscall storms.",
  },
  {
    step: "02",
    title: "Window aggregation",
    body: "Userspace reads BPF maps and IB sysfs counters once per window (default 3 seconds). The aggregator computes deltas, distributions, and percentiles.",
  },
  {
    step: "03",
    title: "Capability-driven detection",
    body: "Eleven rules evaluate signals with EWMA smoothing and peak-hold. The engine adapts at runtime to available probes (drivers, kernel version, hardware features) and only runs rules whose inputs exist.",
  },
  {
    step: "04",
    title: "State machine and actions",
    body: "Asymmetric hysteresis and dwell timers gate transitions between Healthy, Degraded, and Critical. Scheduler integration drains and resumes nodes on transitions. Optional webhooks fire alongside when configured.",
  },
];

const STATES = [
  {
    name: "Healthy",
    color: "meadow",
    body: "All signals within baseline. The node accepts work.",
  },
  {
    name: "Degraded",
    color: "energy",
    body: "Confidence-weighted signals exceed soft thresholds. Drains only on operator opt-in (drain_on_degraded=true).",
  },
  {
    name: "Critical",
    color: "crimson",
    body: "Hard thresholds breached or critical signal cluster. Scheduler drain on transition.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="architecture"
      className="relative border-b border-ink-600/40 py-20 sm:py-28"
    >
      <div className="container-px mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Architecture"
          title="Kernel signals in. Healthy, Degraded, or Critical out."
          subtitle="Four stages: probe, aggregate, detect, act. Each stage is hardened against the failure modes of the layer below it."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <div className="space-y-3">
            {PIPELINE.map((step, i) => (
              <PipelineStep key={step.step} {...step} last={i === PIPELINE.length - 1} />
            ))}
          </div>

          <ArchitectureDiagram />
        </div>

        <div className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="eyebrow">State machine</div>
              <h3 className="mt-2 text-2xl font-bold text-zinc-100">
                Hardened against flapping by construction.
              </h3>
            </div>
            <div className="hidden font-mono text-[11px] text-zinc-500 sm:block">
              asymmetric hysteresis · EWMA + peak-hold · dwell timers
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {STATES.map((s) => (
              <StateCard key={s.name} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PipelineStep({
  step,
  title,
  body,
  last,
}: {
  step: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-4 rounded-xl border border-ink-600/60 bg-ink-800/40 p-5">
      <div className="relative">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-argus-500/30 bg-argus-500/10 font-mono text-xs font-semibold text-argus-300">
          {step}
        </div>
        {!last && (
          <div className="absolute left-1/2 top-9 h-[calc(100%-1rem)] w-px -translate-x-1/2 bg-gradient-to-b from-argus-500/40 to-transparent" />
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-zinc-100">{title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{body}</p>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="panel relative overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          data flow
        </div>
        <div className="font-mono text-[11px] text-zinc-500">
          CPU &lt; 1% · 3s window
        </div>
      </div>

      <div className="space-y-3 font-mono text-[11px] leading-relaxed">
        <DiagramBlock
          label="Linux kernel"
          tone="zinc"
          rows={[
            ["kmem probes", "irq probes", "napi probes"],
            ["SLAB_STATS", "IRQ_COUNTS", "NAPI_STATS"],
          ]}
          rowLabels={["counter++", "PerCpuMap"]}
        />

        <Connector label="read maps · once per window" />

        <div className="grid grid-cols-2 gap-3">
          <DiagramBox title="BPF Map Reader" subtitle="eBPF source" />
          <DiagramBox title="HW Counter Reader" subtitle="sysfs source" />
        </div>

        <Connector />

        <DiagramBox
          title="Aggregator"
          subtitle="per-window: IRQ dist · slab · RDMA · NAPI · IB deltas"
          full
        />

        <Connector />

        <DiagramBox
          title="Detection Engine"
          subtitle="11 rules · EWMA + peak-hold · state machine · scheduler"
          highlight
          full
        />

        <Connector />

        <div className="grid grid-cols-2 gap-3">
          <DiagramBox title="TUI" subtitle="argus-tui --attach" />
          <DiagramBox title="Prometheus" subtitle="/metrics · /health" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-argus-400/40 to-transparent" />
    </div>
  );
}

function DiagramBlock({
  label,
  rows,
  rowLabels,
}: {
  label: string;
  tone: "zinc" | "argus";
  rows: string[][];
  rowLabels: string[];
}) {
  return (
    <div className="rounded-lg border border-ink-600/60 bg-ink-900/60 p-3">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      {rows.map((row, i) => (
        <div key={i}>
          <div className="grid grid-cols-3 gap-2">
            {row.map((cell) => (
              <div
                key={cell}
                className="rounded border border-ink-600/60 bg-ink-800/80 px-2 py-1.5 text-center text-zinc-300"
              >
                {cell}
              </div>
            ))}
          </div>
          {i < rows.length - 1 && (
            <div className="my-1.5 text-center text-[10px] text-zinc-600">
              ↓ {rowLabels[i]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function DiagramBox({
  title,
  subtitle,
  highlight,
  full,
}: {
  title: string;
  subtitle: string;
  highlight?: boolean;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2.5 ${
        highlight
          ? "border-argus-500/40 bg-argus-500/5"
          : "border-ink-600/60 bg-ink-900/60"
      } ${full ? "text-center" : ""}`}
    >
      <div
        className={`text-[12px] font-semibold ${
          highlight ? "text-argus-300" : "text-zinc-200"
        }`}
      >
        {title}
      </div>
      <div className="text-[10.5px] text-zinc-500">{subtitle}</div>
    </div>
  );
}

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-600/80 to-transparent" />
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-zinc-600">
          {label}
        </span>
      )}
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-600/80 to-transparent" />
    </div>
  );
}

function StateCard({
  name,
  color,
  body,
}: {
  name: string;
  color: string;
  body: string;
}) {
  const styles =
    color === "meadow"
      ? {
          ring: "border-meadow-400/40 bg-meadow-400/[0.06]",
          dot: "bg-meadow-400",
          label: "text-meadow-300",
        }
      : color === "energy"
        ? {
            ring: "border-energy-500/40 bg-energy-500/[0.06]",
            dot: "bg-energy-500",
            label: "text-energy-400",
          }
        : {
            ring: "border-crimson-500/40 bg-crimson-500/[0.06]",
            dot: "bg-crimson-500",
            label: "text-crimson-400",
          };

  return (
    <div className={`relative rounded-xl border p-5 ${styles.ring}`}>
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-pulse-glow rounded-full opacity-75 ${styles.dot}`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${styles.dot}`}
          />
        </span>
        <span
          className={`font-mono text-xs font-semibold uppercase tracking-wider ${styles.label}`}
        >
          {name}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}
