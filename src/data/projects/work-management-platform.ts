import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './work-management-platform.md';

export default createProject({
  name: 'Work Management Platform',
  summary: 'A multi-tenant work management platform for projects, tasks, resources, budgets and team collaboration.',
  color: '#3874FF',
  icon: 'lucide:list-todo',
  access: Access.Proprietary,
  tags: [Tags.TypeScript, Tags.CSharp],
  description,
});
