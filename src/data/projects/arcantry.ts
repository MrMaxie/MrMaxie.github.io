import logo from '../../assets/projects/arcantry-mark.svg';
import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './arcantry.md';

export default createProject({
  name: 'Arcantry',
  version: '1.0.0',
  license: 'Apache-2.0',
  summary:
    'Helps developers find where project decisions, tasks, release notes, and agent guidance belong before changing the repository.',
  color: '#b39aff',
  tags: [Tags.Rust, Tags.TypeScript],
  links: [
    { label: 'Docs', href: 'https://maxie.dev/arcantry/', kind: LinkKind.Website },
    { label: 'Source code', href: 'https://github.com/MrMaxie/arcantry', kind: LinkKind.Source },
  ],
  logo,
  logoTone: 'light',
  description,
});
