import logo from '../../assets/projects/ttyglass-logo.svg';
import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './ttyglass.md';

export default createProject({
  name: 'ttyglass',
  version: '1.1.0',
  license: 'Apache-2.0',
  summary:
    'Observe and interact with terminal sessions from a browser, command-line tools, or a coding agent without changing the target app.',
  color: '#6EADBC',
  tags: [Tags.Nim, Tags.TypeScript, Tags.DevOps],
  links: [
    { label: 'Docs', href: 'https://github.com/MrMaxie/ttyglass#readme', kind: LinkKind.Website },
    { label: 'npm', href: 'https://www.npmjs.com/package/ttyglass', kind: LinkKind.Npm },
    { label: 'Source code', href: 'https://github.com/MrMaxie/ttyglass', kind: LinkKind.Source },
  ],
  logo,
  description,
});
