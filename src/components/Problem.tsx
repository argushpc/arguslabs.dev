export default function Problem() {
  return (
    <section
      id="problem"
      className="relative isolate overflow-hidden border-b border-ink-700/40 py-24 sm:py-32 lg:py-40"
    >
      <div className="container-px relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl">
          <div className="eyebrow">The problem</div>
          <h2 className="display-tight mt-5 text-4xl font-extrabold text-zinc-50 sm:text-5xl lg:text-6xl">
            Most monitors catch link-down.
            <br />
            <span className="text-gradient-warm">
              The slow failures are harder.
            </span>
          </h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <article className="space-y-6 text-[17px] leading-[1.75] text-zinc-400">
            <p>
              A cable comes unplugged. Every fabric monitor sees it. SNMP traps
              fire. Your scheduler drops the node. That part is solved.
            </p>
            <p>
              The harder problem is gradual degradation. Symbol errors climb
              from zero to fifty per second. CQ completion latency drifts
              from{" "}
              <span className="font-mono text-meadow-400">2µs</span> to{" "}
              <span className="font-mono text-energy-500">12µs</span>. NAPI
              saturates on a NIC stuck behind a noisy neighbor. The link is{" "}
              <em className="not-italic text-zinc-200">up</em>. Your dashboard
              stays green. And a 64-node training run crawls because the
              slowest collective dominates. You find out when someone files
              a ticket two days later.
            </p>
            <p>
              ARGUS watches for exactly this kind of drift. Eleven detection rules,
              each with a confidence weight, feed a state machine with
              dwell timers so isolated noise doesn&apos;t trigger action.
              When correlated signals hold long enough, the node gets
              drained. When they clear, it gets resumed.
            </p>
          </article>

          <ComparisonChart />
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-ink-700/60 bg-ink-700/60 sm:mt-20 sm:grid-cols-3">
          <Pillar
            tone="argus"
            heading="Predictive"
            body="Rules like latency_drift (z-score) and rising_error_trend fire while signals are still trending, before a hard threshold is breached."
          />
          <Pillar
            tone="energy"
            heading="Multi-signal"
            body="Any single counter can be noisy. Eleven rules with confidence weighting and EWMA + peak-hold smoothing reduce the problem. The dwell timer ensures transient spikes don't cause action."
          />
          <Pillar
            tone="pop"
            heading="Closed loop"
            body="On Critical, ARGUS runs scontrol drain. On recovery, scontrol resume. Operator holds let you pin a node as drained so ARGUS won't resume it."
          />
        </div>
      </div>
    </section>
  );
}

function Pillar({
  tone,
  heading,
  body,
}: {
  tone: "argus" | "energy" | "pop";
  heading: string;
  body: string;
}) {
  const accent = {
    argus: "text-argus-300",
    energy: "text-energy-500",
    pop: "text-pop-500",
  }[tone];
  const dotBg = {
    argus: "bg-argus-400",
    energy: "bg-energy-500",
    pop: "bg-pop-500",
  }[tone];
  return (
    <div className="bg-ink-950/80 p-8 sm:p-10">
      <div className="flex items-center gap-2.5">
        <span className={`h-2 w-2 rounded-full ${dotBg}`} />
        <span className={`eyebrow !text-[10.5px] ${accent}`}>{heading}</span>
      </div>
      <p className="mt-4 text-[15px] leading-[1.65] text-zinc-300">{body}</p>
    </div>
  );
}

function ComparisonChart() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-50"
        style={{
          background:
            "linear-gradient(135deg, rgba(91,181,123,0.45), rgba(255,122,48,0.35) 50%, rgba(255,46,91,0.4) 100%)",
        }}
      />
      <div className="relative overflow-hidden rounded-2xl border border-ink-600/70 bg-ink-950/80 p-6 backdrop-blur-md sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow !text-zinc-500">cq_completion_p99</div>
            <div className="mt-1 font-mono text-[13px] text-zinc-400">
              60 minute window · ns
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10.5px]">
            <Legend color="bg-zinc-600" label="baseline" />
            <Legend color="bg-energy-500" label="signal" />
          </div>
        </div>

        <div className="mt-5 h-[260px] w-full">
          <svg
            viewBox="0 0 600 260"
            className="h-full w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cmp-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff7a30" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff7a30" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="cmp-state" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#5bb57b" />
                <stop offset="55%" stopColor="#5bb57b" />
                <stop offset="58%" stopColor="#ff7a30" />
                <stop offset="80%" stopColor="#ff7a30" />
                <stop offset="83%" stopColor="#ff2e5b" />
                <stop offset="100%" stopColor="#ff2e5b" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                x2="600"
                y1={40 + i * 45}
                y2={40 + i * 45}
                stroke="rgba(255,255,255,0.05)"
              />
            ))}

            <line
              x1="0"
              x2="600"
              y1="80"
              y2="80"
              stroke="rgba(255,46,91,0.5)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text
              x="595"
              y="74"
              textAnchor="end"
              className="font-mono text-[9px] fill-crimson-500"
            >
              hard threshold
            </text>

            <line
              x1="0"
              x2="600"
              y1="125"
              y2="125"
              stroke="rgba(91,181,123,0.4)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <text
              x="595"
              y="119"
              textAnchor="end"
              className="font-mono text-[9px] fill-meadow-400"
            >
              baseline 2µs
            </text>

            <path
              d="M0,128 L60,127 L120,126 L180,124 L240,121 L300,116 L360,108 L420,96 L480,76 L540,58 L600,48 L600,260 L0,260 Z"
              fill="url(#cmp-fill)"
            />
            <path
              d="M0,128 L60,127 L120,126 L180,124 L240,121 L300,116 L360,108 L420,96 L480,76 L540,58 L600,48"
              fill="none"
              stroke="#ff7a30"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <line
              x1="350"
              x2="350"
              y1="20"
              y2="240"
              stroke="rgba(45,91,255,0.55)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1="490"
              x2="490"
              y1="20"
              y2="240"
              stroke="rgba(255,46,91,0.55)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />

            <circle cx="350" cy="111" r="4.5" fill="#2d5bff" />
            <circle cx="490" cy="74" r="4.5" fill="#ff2e5b" />

            <rect
              x="0"
              y="248"
              width="600"
              height="6"
              fill="url(#cmp-state)"
              rx="2"
            />
          </svg>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-3 text-[11.5px]">
          <Annotation
            tone="argus"
            label="ARGUS detects"
            time="t-9min"
            detail="latency_drift z-score · pre-threshold"
          />
          <Annotation
            tone="crimson"
            label="hard threshold"
            time="t-0"
            detail="rdma_latency_spike · 5× baseline · workload affected"
          />
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-zinc-500">
      <span className={`h-1.5 w-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

function Annotation({
  tone,
  label,
  time,
  detail,
}: {
  tone: "argus" | "crimson";
  label: string;
  time: string;
  detail: string;
}) {
  const colors =
    tone === "argus"
      ? "border-argus-500/35 bg-argus-500/[0.06]"
      : "border-crimson-500/35 bg-crimson-500/[0.05]";
  const accent = tone === "argus" ? "text-argus-300" : "text-crimson-400";
  return (
    <div className={`rounded-lg border px-3 py-2 ${colors}`}>
      <div className="flex items-center justify-between">
        <span className={`font-mono font-semibold ${accent}`}>{label}</span>
        <span className="font-mono text-[10px] text-zinc-500">{time}</span>
      </div>
      <div className="mt-0.5 truncate font-mono text-[10.5px] text-zinc-500">
        {detail}
      </div>
    </div>
  );
}
