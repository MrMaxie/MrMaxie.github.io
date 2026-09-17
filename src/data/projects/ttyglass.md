I built **ttyglass** to make a live <mark>terminal user interface</mark> available to people and coding agents without changing the application being observed. It runs the original command in a real PTY or ConPTY session, then exposes the same terminal through a local browser, command-line tools and MCP.

## One service, many sessions

A per-user service owns independent terminal sessions and keeps them available when a browser disconnects. Several clients can inspect or control the same session, while parallel sessions remain isolated from one another.

- Start a TUI command or a generic user shell.
- Read the current screen, cursor, dimensions, status and retained ANSI output.
- Send input, resize, restart or stop a session through the browser, CLI or MCP.

## A real terminal in the browser

The browser renders the live terminal rather than a screenshot or reconstructed mock. It supports interactive input, dynamic sizing and exact terminal dimensions, making it useful for checking how a TUI behaves at different sizes and with different color palettes.

## Diagnostics beside terminal output

Applications can send <mark>structured diagnostics</mark> to the same session without mixing them into stdout or stderr. Those events appear beside the terminal and remain available to browser and headless clients, while ordinary applications can still be observed without integrating a ttyglass library.

## Cross-platform implementation

The native executable is written in **Nim**, the npm and diagnostic integrations use **TypeScript**, and the browser interface is built with Svelte. Published packages support Windows x64, Linux x64 with glibc, and macOS on x64 or arm64.

## How I built it

I implemented the PTY and ConPTY process layer, per-user IPC service, authenticated loopback browser transport, multi-session CLI and MCP interfaces, terminal screen model and diagnostic channel. I also built cross-platform release packages, public documentation and test fixtures for terminal applications written in several languages.
