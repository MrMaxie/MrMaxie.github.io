import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './transparent-hiring-platform.md';

export default createProject({
  name: 'Transparent Hiring Platform',
  summary: 'A recruitment platform built around reliable professional data and a process visible to every participant.',
  color: '#06D6A0',
  icon: 'tabler:briefcase-2',
  access: Access.Proprietary,
  tags: [Tags.TypeScript],
  description,
});
