**I built** Dovik to make <mark>local development processes</mark> manageable as a group. When several projects each have their own terminal sessions, it becomes difficult to tell which process belongs to which project, whether it is still running and where its output went. Dovik keeps a project registry and brings process control and observation into one local tool for developers and coding agents.

## One process owner

The daemon owns the registry and process lifecycle. A command-line client and an interactive terminal interface work against <mark>one source of state</mark>.

- Request **start, stop and restart** operations through a versioned local protocol.
- Read **status and logs** for the same managed processes.
- Keep <u>process ownership</u> in the daemon instead of individual clients.

## Go implementation

I implemented the system in <mark>Go</mark>, including the daemon protocol, command-line commands and terminal interface. Output collection is bounded, giving users access to process logs without letting a continuously running development service grow an unlimited output buffer.

## Agents and project identity

The same control plane is available through <mark>MCP</mark>, allowing coding agents to inspect and operate registered processes without creating a separate process model. Dovik also supports project identity personas that keep Git authors and GitHub accounts aligned for each repository.

## How I built it

I wrote <mark>integration tests</mark> for persistence, lifecycle operations, logs and client communication. I also built the public documentation and release packaging for Windows, Linux and macOS. Human interaction, command-line automation and agent integrations all use the same control path.
