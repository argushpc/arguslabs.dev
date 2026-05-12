import { ArrowRight, Github } from "lucide-react";
import { smoothScrollHandler } from "../lib/anchor";
import { GITHUB_URL } from "../lib/links";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden border-b border-ink-700/40"
    >
      <AmbientBackdrop />

      <div className="container-px relative mx-auto max-w-6xl pb-24 pt-12 sm:pt-20 lg:pb-32 lg:pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-argus-500/30 bg-argus-500/[0.06] px-3 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-glow rounded-full bg-argus-400 opacity-80" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-argus-400" />
            </span>
            <span className="eyebrow !tracking-[0.18em] text-argus-300">
              Adaptive RDMA Guard &amp; Utilization Sentinel
            </span>
          </div>

          <h1 className="display-tight mt-8 text-5xl font-extrabold text-zinc-50 sm:text-6xl lg:text-[80px]">
            ARGUS catches fabric
            <br />
            degradation{" "}
            <span className="text-gradient-argus">before jobs notice.</span>
          </h1>

          <p className="lede mt-8 max-w-2xl">
            ARGUS is a node-local agent that reads{" "}
            <span className="text-zinc-100">eBPF kernel signals</span> and{" "}
            <span className="text-zinc-100">InfiniBand hardware counters</span>,
            then decides whether a node is healthy, degraded, or critical.
            When confidence is high enough for long enough, it drains the node
            from your scheduler and resumes it on recovery.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#install"
              onClick={smoothScrollHandler("install")}
              className="focus-ring group inline-flex h-12 items-center gap-2 rounded-lg bg-argus-500 px-6 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(45,91,255,0.5),0_8px_32px_-4px_rgba(45,91,255,0.6)] transition-all hover:bg-argus-400 hover:shadow-[0_0_0_1px_rgba(45,91,255,0.7),0_12px_44px_-4px_rgba(45,91,255,0.7)]"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-lg border border-ink-700/70 bg-ink-850/60 px-5 text-sm font-medium text-zinc-200 backdrop-blur transition-colors hover:border-argus-500/50 hover:bg-ink-800/80"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-[1.05fr_1fr]">
          <CommandCard />
          <StatusCard />
        </div>

        <FactStrip />
      </div>
    </section>
  );
}

const BARS: Array<{
  top: string;
  w: number;
  h: number;
  c: string;
  dur: number;
  dly: number;
  dir: "rtl" | "ltr";
}> = [
  { top: "4%", w: 220, h: 3, c: "rgba(45,91,255,0.50)", dur: 46, dly: -8, dir: "rtl" },
  { top: "11%", w: 320, h: 2, c: "rgba(255,79,181,0.32)", dur: 62, dly: -22, dir: "ltr" },
  { top: "17%", w: 140, h: 6, c: "rgba(255,122,48,0.34)", dur: 38, dly: -15, dir: "rtl" },
  { top: "24%", w: 240, h: 3, c: "rgba(45,91,255,0.36)", dur: 52, dly: -30, dir: "ltr" },
  { top: "32%", w: 280, h: 2, c: "rgba(124,77,255,0.30)", dur: 48, dly: -5, dir: "rtl" },
  { top: "40%", w: 200, h: 5, c: "rgba(255,79,181,0.26)", dur: 56, dly: -18, dir: "ltr" },
  { top: "49%", w: 180, h: 7, c: "rgba(45,91,255,0.40)", dur: 42, dly: -12, dir: "rtl" },
  { top: "57%", w: 300, h: 2, c: "rgba(255,122,48,0.24)", dur: 50, dly: -25, dir: "ltr" },
  { top: "65%", w: 220, h: 4, c: "rgba(45,91,255,0.28)", dur: 44, dly: -7, dir: "rtl" },
  { top: "73%", w: 240, h: 2, c: "rgba(124,77,255,0.22)", dur: 58, dly: -32, dir: "ltr" },
  { top: "82%", w: 180, h: 4, c: "rgba(45,91,255,0.30)", dur: 40, dly: -10, dir: "rtl" },
  { top: "90%", w: 260, h: 2, c: "rgba(255,79,181,0.20)", dur: 54, dly: -28, dir: "ltr" },
];

function AmbientBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(45,91,255,0.08), transparent 70%)",
        }}
      />
      {BARS.map((b, i) => (
        <ScrollBar key={i} {...b} />
      ))}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(6,8,20,0.85) 55%, #060814 100%)",
        }}
      />
    </>
  );
}

function ScrollBar({
  top,
  w,
  h,
  c,
  dur,
  dly,
  dir,
}: {
  top: string;
  w: number;
  h: number;
  c: string;
  dur: number;
  dly: number;
  dir: "rtl" | "ltr";
}) {
  return (
    <div
      className="pointer-events-none absolute left-0"
      style={{
        top,
        width: `${w}px`,
        height: `${h}px`,
        backgroundColor: c,
        animation: `scroll-${dir} ${dur}s linear infinite`,
        animationDelay: `${dly}s`,
        willChange: "transform",
      }}
    />
  );
}

function CommandCard() {
  return (
    <div className="relative min-w-0">
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-70"
        style={{
          background:
            "linear-gradient(135deg, rgba(45,91,255,0.55), rgba(255,79,181,0.3) 55%, transparent 100%)",
        }}
      />
      <div className="relative overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-950/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-zinc-500">
              ~ &nbsp; argus
            </span>
          </div>
          <span className="font-mono text-[10.5px] text-zinc-600">
            mock · profile=skew
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-relaxed">
          <span className="text-zinc-500">$ </span>
          <span className="text-zinc-100">cargo run --release -- </span>
          <span className="text-argus-300">--mode mock --profile skew --tui</span>
          <br />
          <br />
          <span className="text-zinc-500">→ argus · </span>
          <span className="text-argus-300">live</span>
          <span className="text-zinc-500"> · win=3.0s · cpu&lt;1%</span>
          <br />
          <span className="text-zinc-500">→ probes attached: </span>
          <span className="text-zinc-200">kmem · irq · napi · cq</span>
          <span className="text-zinc-500"> (mlx5)</span>
          <br />
          <span className="text-zinc-500">→ ib counters: </span>
          <span className="text-zinc-200">port=1 · symbol_errors=0</span>
          <br />
          <span className="text-zinc-500">→ state: </span>
          <span className="text-meadow-400 font-semibold">HEALTHY</span>
          <span className="text-zinc-500"> · conf=0.98 · dwell=14m</span>
          <br />
          <br />
          <span className="text-zinc-500"># injecting profile: irq_affinity_skew</span>
          <br />
          <span className="text-zinc-500">→ alert: </span>
          <span className="text-energy-500 font-semibold">irq_affinity_skew</span>
          <span className="text-zinc-500"> · cpu7=72% · conf=0.84</span>
          <br />
          <span className="text-zinc-500">→ state: </span>
          <span className="text-energy-500 font-semibold">DEGRADED</span>
          <span className="text-zinc-500"> · conf=0.84</span>
          <br />
          <span className="text-zinc-500">→ alert: </span>
          <span className="text-crimson-400 font-semibold">napi_saturation</span>
          <span className="text-zinc-500"> · correlated · conf=0.91</span>
          <br />
          <span className="text-zinc-500">→ state: </span>
          <span className="text-crimson-400 font-semibold">CRITICAL</span>
          <span className="text-zinc-500"> · scheduler: drain issued</span>
          <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 animate-blink bg-argus-400" />
        </pre>
      </div>
    </div>
  );
}

function StatusCard() {
  return (
    <div className="relative h-full min-w-0">
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-60"
        style={{
          background:
            "linear-gradient(225deg, rgba(255,122,48,0.4), rgba(255,79,181,0.25) 50%, transparent 100%)",
        }}
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-850/70 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-ink-700/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="eyebrow !text-zinc-500">node-04 · /status</span>
          </div>
          <span className="font-mono text-[10.5px] text-zinc-600">
            updated 1.2s ago
          </span>
        </div>

        <div className="flex-1 px-5 py-5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="eyebrow !text-zinc-500">state</div>
              <div className="mt-1 font-mono text-2xl font-extrabold tracking-tight text-energy-500">
                DEGRADED
              </div>
            </div>
            <div className="text-right">
              <div className="eyebrow !text-zinc-500">conf</div>
              <div className="mt-1 font-mono text-2xl font-extrabold text-zinc-100">
                0.84
              </div>
            </div>
          </div>

          <SignalTrace />

          <div className="mt-5 space-y-2 font-mono text-[11.5px]">
            <AlertRow
              tone="amber"
              rule="rdma_latency_spike"
              detail="cq_p99=12.4k ns · 5.8× baseline"
            />
            <AlertRow
              tone="amber"
              rule="ib_link_degradation"
              detail="symbol_errors Δ=147 / 30s"
            />
            <AlertRow
              tone="blue"
              rule="latency_drift"
              detail="z=3.1 · 60s window"
            />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-ink-700/60 pt-4 font-mono text-[11px]">
            <span className="text-zinc-500">scheduler · slurm</span>
            <span className="text-argus-300">armed · drain on Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalTrace() {
  return (
    <div className="mt-4 h-16 overflow-hidden rounded-lg border border-ink-600/60 bg-ink-950/60">
      <svg viewBox="0 0 400 64" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trace-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffb020" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffb020" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[16, 32, 48].map((y) => (
          <line
            key={y}
            x1="0"
            x2="400"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}
        <path
          d="M0,42 L40,40 L80,41 L120,38 L160,36 L200,30 L240,24 L280,18 L320,12 L360,8 L400,6 L400,64 L0,64 Z"
          fill="url(#trace-fill)"
        />
        <path
          d="M0,42 L40,40 L80,41 L120,38 L160,36 L200,30 L240,24 L280,18 L320,12 L360,8 L400,6"
          fill="none"
          stroke="#ffb020"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="400" cy="6" r="3" fill="#ffb020">
          <animate
            attributeName="r"
            values="3;5;3"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

function AlertRow({
  tone,
  rule,
  detail,
}: {
  tone: "amber" | "blue" | "red";
  rule: string;
  detail: string;
}) {
  const dot = {
    amber: "bg-signal-amber",
    blue: "bg-signal-blue",
    red: "bg-signal-red",
  }[tone];
  const text = {
    amber: "text-signal-amber",
    blue: "text-signal-blue",
    red: "text-signal-red",
  }[tone];
  return (
    <div className="flex items-center gap-3">
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
      <span className={`font-semibold ${text}`}>{rule}</span>
      <span className="truncate text-zinc-500">{detail}</span>
    </div>
  );
}

function FactStrip() {
  const facts = [
    { v: "<1%", l: "CPU at 3s window" },
    { v: "11", l: "detection rules" },
    { v: "5.4+", l: "kernel · CAP_BPF" },
    { v: "3", l: "Grafana dashboards" },
  ];
  return (
    <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-ink-700/60 pt-8 sm:mt-20 sm:grid-cols-4">
      {facts.map((f) => (
        <div key={f.l}>
          <div className="font-mono text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
            {f.v}
          </div>
          <div className="mt-1.5 text-sm text-zinc-500">{f.l}</div>
        </div>
      ))}
    </div>
  );
}
