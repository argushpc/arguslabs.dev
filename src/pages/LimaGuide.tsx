import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Copy, ChevronDown } from "lucide-react";
import { Wordmark } from "../components/Wordmark";

export default function LimaGuide() {
  return (
    <div className="min-h-screen bg-ink-950 text-zinc-100">
      <nav className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-md">
        <div className="container-px mx-auto flex h-16 max-w-4xl items-center gap-4">
          <Link
            to="/"
            className="focus-ring inline-flex items-center gap-2 rounded-md text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="h-5 w-px bg-ink-700/60" />
          <Wordmark size="md" />
        </div>
      </nav>

      <main className="container-px mx-auto max-w-4xl py-16">
        <div className="eyebrow">Guide</div>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl">
          Testing ARGUS on Lima VMs
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Set up a two-node RDMA test environment using Lima virtual machines
          with Soft-RoCE. No InfiniBand hardware or HPC cluster required.
        </p>

        <TableOfContents />

        <Section id="prerequisites" step="1" title="Prerequisites">
          <Prose>
            <p>
              You need <A href="https://lima-vm.io/">Lima</A> installed on your
              host machine. On macOS:
            </p>
          </Prose>
          <CodeBlock code={`brew install lima`} />
          <Prose>
            <p>
              You may also need{" "}
              <A href="https://github.com/lima-vm/socket_vmnet">
                socket_vmnet
              </A>{" "}
              for shared networking between VMs. Install it before creating any
              VMs:
            </p>
          </Prose>
          <CodeBlock code={`brew install socket_vmnet`} />
        </Section>

        <Section id="node-yaml" step="2" title="Create the VM template">
          <Prose>
            <p>
              Create a file called <code>node.yaml</code> with the following
              content. This defines an Ubuntu 22.04 (Jammy) ARM64 VM with RDMA
              tooling, eBPF dependencies, and shared networking pre-installed.
            </p>
          </Prose>
          <CodeBlock
            filename="node.yaml"
            code={`arch: aarch64
images:
  - location: "https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-arm64.img"

cpus: 2
memory: "2GiB"
disk: "20GiB"

ssh:
  loadDotSSHPubKeys: true

mounts:
  - location: "~"

networks:
  - lima: shared

provision:
  - mode: system
    script: |
      #!/bin/bash
      set -eux

      apt-get update
      apt-get install -y \\
        rdma-core \\
        ibverbs-utils \\
        perftest \\
        iproute2 \\
        build-essential \\
        clang \\
        llvm \\
        libbpf-dev \\
        bpftool \\
        linux-tools-common \\
        linux-tools-generic \\
        stress-ng \\
        git`}
          />
        </Section>

        <Section id="create-vms" step="3" title="Create the VMs">
          <Prose>
            <p>
              Spin up two nodes from the template. Each takes a few minutes on
              first boot while the provisioning script runs.
            </p>
          </Prose>
          <CodeBlock
            code={`for i in 01 02; do
  limactl start --name node\$i node.yaml
done`}
          />
        </Section>

        <Section
          id="kernel-modules"
          step="4"
          title="Install kernel modules for Soft-RoCE"
        >
          <Prose>
            <p>
              The <code>rdma_rxe</code> kernel module (Soft-RoCE) lives in{" "}
              <code>linux-modules-extra</code>. Install it on both nodes.
              The install command runs inside the VM so{" "}
              <code>uname -r</code> resolves to the guest kernel, not the
              host.
            </p>
          </Prose>
          <CodeBlock
            code={`for i in 01 02; do
  echo "Installing modules on node\$i..."
  limactl shell node\$i -- bash -c \\
    'sudo apt update && sudo apt install -y linux-modules-extra-$(uname -r)'
done`}
          />
        </Section>

        <Section id="load-rxe" step="5" title="Load the Soft-RoCE module">
          <CodeBlock
            code={`for i in 01 02; do
  echo "Loading RXE on node\$i..."
  limactl shell node\$i sudo modprobe rdma_rxe
done`}
          />
          <Prose>
            <p>Verify the module is loaded:</p>
          </Prose>
          <CodeBlock code={`limactl shell node01 lsmod | grep rxe`} />
        </Section>

        <Section id="create-rxe" step="6" title="Create the Soft-RoCE device">
          <Prose>
            <p>
              Bind an RXE device to the <code>lima0</code> network interface on
              each node:
            </p>
          </Prose>
          <CodeBlock
            code={`for i in 01 02; do
  echo "Creating RXE device on node\$i..."
  limactl shell node\$i sudo rdma link add rxe0 type rxe netdev lima0
done`}
          />
          <Prose>
            <p>Verify the RDMA device exists:</p>
          </Prose>
          <CodeBlock code={`limactl shell node01 rdma link`} />
        </Section>

        <Section id="verify-rdma" step="7" title="Verify RDMA connectivity">
          <Prose>
            <p>
              Grab each node's IP and run a quick ping-pong test to confirm RDMA
              works between them.
            </p>
          </Prose>
          <CodeBlock
            caption="Get node IPs"
            code={`for i in 01 02; do
  IP=$(limactl shell node\$i ip -4 -o addr show dev lima0 | awk '{print $4}' | cut -d/ -f1)
  export NODE\${i}_IP=$IP
  echo "NODE\${i}_IP=$IP"
done`}
          />
          <CodeBlock
            caption="Run the ping-pong test (two terminals)"
            code={`# Terminal 1 — server on node01
limactl shell node01 ibv_rc_pingpong -g 0

# Terminal 2 — client on node02 connecting to node01
limactl shell node02 ibv_rc_pingpong -g 0 $NODE01_IP`}
          />
        </Section>

        <Section id="generate-traffic" step="8" title="Generate RDMA traffic">
          <Prose>
            <p>
              To create a sustained stream of RDMA traffic between the two
              nodes, use <code>ib_write_bw</code> in tmux sessions. Replace the
              IPs below with the values from the previous step.
            </p>
          </Prose>
          <CodeBlock
            caption="node01 to node02"
            code={`# Server on node01
tmux new-session -d -s "bw_server" \\
  "while true; do ib_write_bw -d rxe0 -F -t 16; sleep 1; done"

# Client on node02 (replace IP with $NODE02_IP)
tmux new-session -d -s "bw_client" \\
  "while true; do ib_write_bw -d rxe0 -F -t 16 -D 7200 --run_infinitely <NODE02_IP>; sleep 1; done"`}
          />
          <CodeBlock
            caption="node02 to node01 (reverse direction)"
            code={`# Server on node02
tmux new-session -d -s "bw_server_rev" \\
  "while true; do ib_write_bw -d rxe0 -F -t 16; sleep 1; done"

# Client on node01 (replace IP with $NODE01_IP)
tmux new-session -d -s "bw_client_rev" \\
  "while true; do ib_write_bw -d rxe0 -F -t 16 -D 7200 --run_infinitely <NODE01_IP>; sleep 1; done"`}
          />
        </Section>

        <Section id="inject-faults" step="9" title="Inject faults">
          <Prose>
            <p>
              Use <code>tc netem</code> on either node to simulate network
              degradation. These are the conditions ARGUS is designed to detect.
            </p>
          </Prose>
          <CodeBlock
            caption="Packet loss"
            code={`sudo tc qdisc replace dev lima0 root netem loss 20%`}
          />
          <CodeBlock
            caption="Latency with jitter"
            code={`sudo tc qdisc replace dev lima0 root netem delay 80ms 30ms distribution normal`}
          />
          <CodeBlock
            caption="Remove all faults"
            code={`sudo tc qdisc del dev lima0 root`}
          />
        </Section>

        <Section
          id="install-argus"
          step="10"
          title="Build and run ARGUS"
        >
          <Prose>
            <p>
              SSH into one of the nodes and build ARGUS from source. You can run
              it in mock mode first to verify the build, then switch to live
              mode with eBPF.
            </p>
          </Prose>
          <CodeBlock
            caption="Install Rust and clone ARGUS"
            code={`cd /tmp
git clone https://github.com/KevinWeiss1995/ARGUS.git
cd ARGUS
sudo apt install -y cargo
RUSTUP_INIT_SKIP_PATH_CHECK=yes curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env
rustup update stable`}
          />
          <CodeBlock
            caption="Build and test in mock mode"
            code={`cargo build --release
cargo run --release -- --mode mock --profile pressure --tui`}
          />
          <CodeBlock
            caption="Build the eBPF probes (requires nightly)"
            code={`rustup install nightly
rustup component add rust-src --toolchain nightly
cargo install bpf-linker
cargo +nightly build \\
  --target=bpfel-unknown-none \\
  -Z build-std=core \\
  --manifest-path argus-ebpf/Cargo.toml`}
          />
          <CodeBlock
            caption="Run in live mode with eBPF"
            code={`sudo ./target/release/argus-agent \\
  --mode live \\
  --ebpf-path argus-ebpf/target/bpfel-unknown-none/debug/argus-ebpf \\
  --tui`}
          />
          <Prose>
            <p>
              For hash-verified eBPF loading, compute the SHA-256 first and pass
              it explicitly:
            </p>
          </Prose>
          <CodeBlock
            code={`sha256sum argus-ebpf/target/bpfel-unknown-none/debug/argus-ebpf

sudo ./target/release/argus-agent \\
  --mode live \\
  --ebpf-path argus-ebpf/target/bpfel-unknown-none/debug/argus-ebpf \\
  --ebpf-hash <sha256hex> \\
  --tui`}
          />
        </Section>

        <Section id="vm-management" step="11" title="Start and stop VMs">
          <CodeBlock
            caption="Start both"
            code={`for i in 01 02; do
  limactl start node\$i
done`}
          />
          <CodeBlock
            caption="Stop both"
            code={`for i in 01 02; do
  limactl stop node\$i
done`}
          />
        </Section>

        <Collapsible title="Optional: SLURM integration test">
          <Section
            id="slurm-install"
            title="Install and configure SLURM"
            nested
          >
            <Prose>
              <p>
                This sets up a single-node SLURM cluster on one of the Lima
                VMs so you can test ARGUS scheduler integration (drain on
                Critical, resume on recovery, operator holds).
              </p>
            </Prose>
            <CodeBlock
              caption="Install SLURM and munge"
              code={`sudo apt update
sudo apt install -y slurm-wlm slurm-client munge`}
            />
            <CodeBlock
              caption="Create required directories"
              code={`sudo mkdir -p /var/spool/slurmctld /var/spool/slurmd /var/log/slurm
sudo chown slurm:slurm /var/spool/slurmctld /var/spool/slurmd /var/log/slurm`}
            />
            <CodeBlock
              caption="Generate slurm.conf"
              code={`HOSTNAME=$(hostname -s)
sudo tee /etc/slurm/slurm.conf > /dev/null << EOF
ClusterName=argus-test
SlurmctldHost=\${HOSTNAME}
MpiDefault=none
ProctrackType=proctrack/linuxproc
ReturnToService=2
SlurmctldPidFile=/run/slurmctld.pid
SlurmdPidFile=/run/slurmd.pid
SlurmdSpoolDir=/var/spool/slurmd
StateSaveLocation=/var/spool/slurmctld
SlurmUser=slurm
TaskPlugin=task/none
SchedulerType=sched/backfill
SelectType=select/cons_tres
AccountingStorageType=accounting_storage/none
SlurmctldLogFile=/var/log/slurm/slurmctld.log
SlurmdLogFile=/var/log/slurm/slurmd.log
NodeName=\${HOSTNAME} CPUs=$(nproc) State=UNKNOWN
PartitionName=test Nodes=\${HOSTNAME} Default=YES MaxTime=INFINITE State=UP
EOF`}
            />
            <CodeBlock
              caption="Start services and bring the node online"
              code={`sudo systemctl enable --now munge
sudo systemctl enable --now slurmctld
sudo systemctl enable --now slurmd

sleep 3
sudo scontrol update NodeName=$(hostname -s) State=RESUME

# Verify — you should see the node in IDLE state
scontrol show node $(hostname -s)
sinfo`}
            />
          </Section>

          <Section
            id="slurm-argus"
            title="Enable SLURM in ARGUS"
            nested
          >
            <CodeBlock
              code={`sudo sed -i 's/^ARGUS_EXTRA_ARGS=.*/ARGUS_EXTRA_ARGS=--scheduler slurm/' /etc/argus/argusd.conf
sudo systemctl restart argusd

sleep 3
journalctl -u argusd --no-pager -n 20 | grep -i scheduler`}
            />
            <Prose>
              <p>
                Look for: <code>scheduler integration enabled backend="slurm"</code>
              </p>
            </Prose>
          </Section>

          <Section
            id="slurm-test"
            title="Test the integration"
            nested
          >
            <H4>Baseline check</H4>
            <CodeBlock
              code={`curl -s localhost:9100/health | python3 -m json.tool
curl -s localhost:9100/metrics | grep argus_scheduler
scontrol show node $(hostname -s) | grep -E 'State|Reason'`}
            />

            <H4>Inject fault (ARGUS should drain the node)</H4>
            <CodeBlock
              code={`sudo tc qdisc add dev lima0 root netem loss 5%`}
            />
            <Prose>
              <p>Wait ~20 seconds, then check:</p>
            </Prose>
            <CodeBlock
              code={`journalctl -u argusd --no-pager -n 20 | grep -E 'drain|scheduler'
scontrol show node $(hostname -s) | grep -E 'State|Reason'`}
            />
            <Prose>
              <p>
                Expected: <code>State=IDLE+DRAIN</code>,{" "}
                <code>Reason=ARGUS: health=CRITICAL</code>
              </p>
            </Prose>

            <H4>Remove fault (ARGUS should resume after cooldown)</H4>
            <CodeBlock code={`sudo tc qdisc del dev lima0 root`} />
            <Prose>
              <p>
                Wait ~90 seconds (60s cooldown + reconcile interval), then:
              </p>
            </Prose>
            <CodeBlock
              code={`journalctl -u argusd --no-pager -n 20 | grep -E 'resume|scheduler'
scontrol show node $(hostname -s) | grep -E 'State|Reason'`}
            />
            <Prose>
              <p>
                Expected: <code>State=IDLE</code>
              </p>
            </Prose>

            <H4>Operator hold detection</H4>
            <CodeBlock
              code={`sudo scontrol update NodeName=$(hostname -s) State=DRAIN Reason="maintenance window"
sleep 15
journalctl -u argusd --no-pager -n 10 | grep -i operator
curl -s localhost:9100/metrics | grep argus_scheduler_desired_state`}
            />
            <Prose>
              <p>
                Expected: <code>desired_state = 2</code> (HeldByOperator)
              </p>
            </Prose>

            <H4>Release hold via API</H4>
            <CodeBlock
              code={`curl -X POST localhost:9100/scheduler/release
sleep 15
scontrol show node $(hostname -s) | grep -E 'State|Reason'`}
            />
            <Prose>
              <p>
                Expected: <code>State=IDLE</code>
              </p>
            </Prose>

            <H4>State persistence</H4>
            <CodeBlock
              code={`cat /var/lib/argus/scheduler-state.json
sudo systemctl restart argusd
sleep 5
journalctl -u argusd --no-pager -n 10 | grep -i persisted`}
            />

            <H4>Clean up</H4>
            <CodeBlock
              code={`sudo tc qdisc del dev lima0 root 2>/dev/null
curl -X POST localhost:9100/scheduler/release 2>/dev/null
sudo scontrol update NodeName=$(hostname -s) State=IDLE
sudo sed -i 's/^ARGUS_EXTRA_ARGS=.*/ARGUS_EXTRA_ARGS=/' /etc/argus/argusd.conf
sudo systemctl restart argusd`}
            />
          </Section>
        </Collapsible>

        <div className="mt-16 rounded-xl border border-ink-600/60 bg-ink-850/60 p-6">
          <p className="text-sm leading-relaxed text-zinc-400">
            Having trouble? Open an issue on{" "}
            <A href="https://github.com/KevinWeiss1995/ARGUS/issues">
              GitHub
            </A>{" "}
            or reach out via the{" "}
            <Link to="/" className="text-argus-300 hover:text-argus-200">
              main site
            </Link>
            .
          </p>
        </div>
      </main>

      <footer className="border-t border-ink-700/40 py-8">
        <div className="container-px mx-auto max-w-4xl text-center text-[11.5px] text-zinc-600">
          &copy; {new Date().getFullYear()} ARGUS
        </div>
      </footer>
    </div>
  );
}

const TOC_ITEMS = [
  { id: "prerequisites", label: "Prerequisites" },
  { id: "node-yaml", label: "VM template" },
  { id: "create-vms", label: "Create VMs" },
  { id: "kernel-modules", label: "Kernel modules" },
  { id: "load-rxe", label: "Load Soft-RoCE" },
  { id: "create-rxe", label: "Create RXE device" },
  { id: "verify-rdma", label: "Verify RDMA" },
  { id: "generate-traffic", label: "Generate traffic" },
  { id: "inject-faults", label: "Inject faults" },
  { id: "install-argus", label: "Build and run ARGUS" },
  { id: "vm-management", label: "Start/stop VMs" },
];

function TableOfContents() {
  return (
    <nav className="mt-10 rounded-xl border border-ink-600/60 bg-ink-850/60 p-5">
      <div className="eyebrow mb-3">On this page</div>
      <ol className="columns-2 gap-x-8 space-y-1.5 text-sm">
        {TOC_ITEMS.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <span className="mr-2 font-mono text-xs text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Section({
  id,
  step,
  title,
  nested,
  children,
}: {
  id?: string;
  step?: string;
  title: string;
  nested?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={nested ? "mt-10" : "mt-16 scroll-mt-24 border-t border-ink-700/40 pt-12"}
    >
      <div className="flex items-baseline gap-3">
        {step && (
          <span className="font-mono text-sm font-semibold text-argus-400">
            {step}.
          </span>
        )}
        <h2
          className={`font-bold tracking-tight text-zinc-50 ${
            nested ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {title}
        </h2>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );
}

function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-16 scroll-mt-24 border-t border-ink-700/40 pt-12">
      <button
        onClick={() => setOpen(!open)}
        className="focus-ring group flex w-full items-center justify-between rounded-lg text-left"
      >
        <h2 className="text-2xl font-bold tracking-tight text-zinc-50 sm:text-3xl">
          {title}
        </h2>
        <ChevronDown
          className={`h-6 w-6 text-zinc-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[15px] leading-[1.7] text-zinc-400 [&_code]:rounded [&_code]:border [&_code]:border-ink-600/60 [&_code]:bg-ink-900/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-zinc-300">
      {children}
    </div>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-6 text-sm font-semibold text-zinc-200">{children}</h4>
  );
}

function A({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-argus-300 transition-colors hover:text-argus-200"
    >
      {children}
    </a>
  );
}

function CodeBlock({
  code,
  caption,
  filename,
}: {
  code: string;
  caption?: string;
  filename?: string;
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
      {(caption || filename) && (
        <div className="mb-2 flex items-center gap-2">
          {filename && (
            <span className="rounded border border-ink-600/60 bg-ink-900/80 px-2 py-0.5 font-mono text-[11px] text-argus-300">
              {filename}
            </span>
          )}
          {caption && (
            <span className="text-[12px] text-zinc-500">{caption}</span>
          )}
        </div>
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
        <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-relaxed text-zinc-200">
          <code>{highlightShell(code)}</code>
        </pre>
      </div>
    </div>
  );
}

function highlightShell(code: string): React.ReactNode[] {
  return code.split("\n").map((line, i, arr) => {
    const isLast = i === arr.length - 1;
    const nl = isLast ? "" : "\n";
    const trimmed = line.trimStart();

    if (trimmed.startsWith("#")) {
      return (
        <span key={i} className="text-zinc-500">
          {line}
          {nl}
        </span>
      );
    }

    const tokens = line.split(/(\s+)/).map((tok, j) => {
      if (/^--?[a-zA-Z]/.test(tok)) {
        return (
          <span key={j} className="text-argus-300">
            {tok}
          </span>
        );
      }
      return <span key={j}>{tok}</span>;
    });

    return (
      <span key={i}>
        {tokens}
        {nl}
      </span>
    );
  });
}
