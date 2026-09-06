import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './maxiedev-events.md';

export default createProject({
  name: '@maxiedev/events',
  version: '1.0.0',
  license: 'Apache-2.0',
  summary: 'A compact, strongly typed event emitter for TypeScript with async waiting and streaming support.',
  color: '#E69DB8',
  icon: 'lucide:split',
  tags: [Tags.TypeScript],
  links: [{ label: 'npm', href: 'https://www.npmjs.com/package/@maxiedev/events', kind: LinkKind.Website }],
  description,
});
