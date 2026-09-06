I created Arcantry to coordinate <mark>project knowledge</mark> and repeatable work with coding agents. A repository can contain specifications, quick task notes, release history, instructions and reusable procedures, each serving a different purpose. Arcantry gives those sources an explicit relationship while preserving their formats, ownership and audience.

## Repository discovery

The repository tooling starts with discovery. It can inspect an empty directory, an established project or a monorepo, with or without Git and configuration. When a project needs an explicit setup, <mark>TOML configuration</mark> describes its sources, adapters and responsibilities. Shared and private configurations use the same model, allowing a developer to adopt the tooling locally before introducing a shared workflow.

## Reviewable changes

I designed changes around an <mark>inspect, plan and apply</mark> sequence. Adopting a source, moving a task queue, changing an adapter or taking over part of a changelog first produces a **serializable plan**.

- **Before writing:** check the project boundary, input hashes, planned content and tool version.
- **During application:** stage and verify writes; failed transactions can roll back.
- **The engineering goal:** make structural repository changes <u>reviewable and recoverable</u>.

## Tasks and releases

The command-line tools also handle everyday project work.

- <mark>todo.txt</mark> commands list, add, complete and move tasks across selected queues.
- **Release commands** prepare versions, manifests and changelog content from accepted OpenSpec work, then check that the resulting files agree.
- Operations <u>preview their changes before writing</u>. Preparing a release remains separate from committing, tagging or publishing it.

## Agent skills

Alongside the CLI, I built a catalog of focused <mark>agent skills</mark>. Each package owns a specific procedure and can include scenarios, references and scripts.

- **Project work:** capture incoming tasks, promote work into specifications and review changes.
- **Guidance and content:** maintain agent instructions and write product content.
- **Skill quality:** capture repeated procedures, evaluate changes and review the catalog.

## Portable integrations

Portability across agent tools is part of the design. Arcantry uses the universal <mark>Agent Skills</mark> layout and canonical AGENTS.md guidance, with optional Claude compatibility that points to the same sources. Individual skills can be linked at user or repository scope. The linker checks existing destinations and avoids silently replacing ordinary directories, so installing a skill does not become an uncontrolled file-copy operation.

## How I built it

I designed the product model and built the <mark>Rust core and CLI</mark>, TypeScript tooling, schemas, skill packages and distribution workflows. I also created the documentation around adoption paths, command references and an interactive configuration map.
