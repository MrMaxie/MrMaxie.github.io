import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './event-operations-platform.md';

export default createProject({
  name: 'Event Operations Platform',
  summary:
    'An event platform for exhibitor registration, complex orders, ticketing, user communication and administration.',
  color: '#D90000',
  icon: 'tabler:ticket',
  access: Access.Proprietary,
  tags: [Tags.TypeScript],
  description,
});
