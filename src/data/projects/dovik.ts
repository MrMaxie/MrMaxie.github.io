import logo from '../../assets/projects/dovik-logo.png';
import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './dovik.md';

export default createProject({
  name: 'Dovik',
  version: '1.1.0',
  license: 'Apache-2.0',
  summary: 'A local process supervisor with one daemon shared by its command-line tools, terminal interface, and MCP.',
  color: '#ff6b3d',
  tags: [Tags.Go, Tags.DevOps],
  links: [
    { label: 'Docs', href: 'https://maxie.dev/dovik/', kind: LinkKind.Website },
    { label: 'npm', href: 'https://www.npmjs.com/package/dovik', kind: LinkKind.Npm },
    { label: 'Source code', href: 'https://github.com/MrMaxie/dovik', kind: LinkKind.Source },
  ],
  logo,
  description,
});
