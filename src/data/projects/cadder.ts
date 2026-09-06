import logo from '../../assets/projects/cadder-logo.png';
import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './cadder.md';

export default createProject({
  name: 'Cadder',
  version: '0.8.0',
  license: 'Apache-2.0',
  summary:
    "Helps developers run several local web projects behind stable HTTPS addresses without changing each project's normal start command.",
  color: '#72c9b7',
  tags: [Tags.Rust, Tags.DevOps],
  links: [
    { label: 'Docs', href: 'https://maxie.dev/cadder/', kind: LinkKind.Website },
    { label: 'Source code', href: 'https://github.com/MrMaxie/cadder', kind: LinkKind.Source },
  ],
  logo,
  description,
});
