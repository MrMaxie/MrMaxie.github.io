import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './live-consultation-platform.md';

export default createProject({
  name: 'Live Consultation Platform',
  summary:
    'A platform for booking live consultations with specialists through integrated calendars, video calls and chat.',
  color: '#B0CDE6',
  icon: 'tabler:calendar-stats',
  access: Access.Proprietary,
  tags: [Tags.TypeScript],
  description,
});
