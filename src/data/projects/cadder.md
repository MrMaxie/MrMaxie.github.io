**I built** Cadder for a problem that appears when several local web projects each try to own the same HTTP and HTTPS ports. Each project can have a perfectly valid Caddy configuration on its own, yet running them together creates conflicts. Cadder coordinates those configurations through <mark>one shared Caddy process</mark> so projects can keep their usual startup workflow and stable local HTTPS addresses.

## One shared runtime

The runtime has distinct responsibilities, connected through a <mark>per-user daemon</mark>.

- **Command-line wrapper:** register the current project's configuration, keep it active while the wrapper runs and remove it on exit.
- **Daemon:** own registrations, combine adapted configurations and manage the real Caddy runtime.
- **Shared ownership:** keep project registration lifecycle and proxy ownership <u>in one place</u>.

## Terminal controls

The <mark>terminal interface</mark> makes that shared state visible. It shows active entrypoints and domains, logs and diagnostics, and provides controls for inspecting or changing runtime state. It reads from the same daemon as the command-line workflow, so the interface does not maintain a competing view of which projects are running.

## Rust implementation

I implemented the architecture in <mark>Rust</mark>, including local communication, configuration composition, runtime ownership and the terminal experience. A particularly important boundary is distinguishing the wrapper from the real Caddy executable: Cadder needs to resolve the actual proxy safely and avoid calling itself recursively. Log storage is bounded so a long-running development environment does not accumulate output indefinitely.

## How I built it

I built the <mark>packaging workflows</mark>, wrote the documentation and validated the application end to end. Cadder is intended to fit into existing repositories with small setup changes, while making a shared local proxy understandable enough to diagnose when a project configuration or domain is not behaving as expected.
