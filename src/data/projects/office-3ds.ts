import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './office-3ds.md';

export default createProject({
  name: 'office-3ds',
  summary:
    'An office dashboard for Nintendo 3DS, with a native interface and customizable appearance, content and API integration.',
  color: '#79c9ff',
  tags: [Tags.Cpp, Tags.Lua],
  license: 'Apache-2.0',
  links: [{ label: 'Repository', href: 'https://github.com/MrMaxie/office-3ds', kind: LinkKind.Source }],
  description,
});
