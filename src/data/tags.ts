import { createTag, TagKind } from '../lib/content';

const Rust = createTag({
  name: 'Rust',
  color: '#e89a66',
  icon: 'tabler:brand-rust',
  description: 'Systems software, local tools, and search models built with Rust.',
  id: 'rust',
  kind: TagKind.Technology,
});

const TypeScript = createTag({
  name: 'TypeScript',
  color: '#4f9bd8',
  icon: 'tabler:brand-typescript',
  description: 'Typed tooling and web interfaces built around JavaScript ecosystems.',
  id: 'typescript',
  kind: TagKind.Technology,
});

const PHP = createTag({
  name: 'PHP',
  color: '#8f91d8',
  icon: 'tabler:brand-php',
  description: 'Experiments that stretch PHP beyond conventional web application work.',
  id: 'php',
  kind: TagKind.Technology,
});

const Gamedev = createTag({
  name: 'Gamedev',
  color: '#db7bc7',
  icon: 'tabler:device-gamepad-2',
  description: 'Games, mods, and tools built around game systems.',
  id: 'gamedev',
  kind: TagKind.Topic,
});

const Cpp = createTag({
  name: 'C/C++',
  color: '#69a9e8',
  icon: 'tabler:brand-cpp',
  description: 'Native code used where runtimes, rendering, or system boundaries demand it.',
  id: 'c-or-cplusplus',
  kind: TagKind.Technology,
});

const CSharp = createTag({
  name: 'C#',
  color: '#9b62b0',
  icon: 'tabler:brand-c-sharp',
  description: 'Managed game mod code built for established .NET modding ecosystems.',
  id: 'c-sharp',
  kind: TagKind.Technology,
});

const Lua = createTag({
  name: 'Lua',
  color: '#6678d1',
  icon: 'material-icon-theme:lua',
  description: 'Lightweight scripting for game mods and configurable build tools.',
  id: 'lua',
  kind: TagKind.Technology,
});

const DevOps = createTag({
  name: 'DevOps',
  color: '#72c9b7',
  icon: 'tabler:network',
  description: 'Tooling for local environments, delivery, and service operation.',
  id: 'devops',
  kind: TagKind.Topic,
});

const Go = createTag({
  name: 'Go',
  color: '#79c9ff',
  icon: 'tabler:brand-golang',
  description: 'Local services, command-line tools, and terminal interfaces written in Go.',
  id: 'go',
  kind: TagKind.Technology,
});

const EmbeddedC = createTag({
  name: 'Embedded C',
  color: '#69a9e8',
  icon: 'tabler:cpu',
  description: 'C programming for embedded systems.',
  id: 'embedded-c',
  kind: TagKind.Technology,
});

const Python = createTag({
  name: 'Python',
  color: '#e6c45d',
  icon: 'tabler:brand-python',
  description: 'Python applications, automation, and simulation tools.',
  id: 'python',
  kind: TagKind.Technology,
});

export const Tags = {
  Rust,
  TypeScript,
  PHP,
  Gamedev,
  Cpp,
  CSharp,
  Lua,
  DevOps,
  Go,
  EmbeddedC,
  Python,
} as const;
