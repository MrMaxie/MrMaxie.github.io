import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './interactive-learning-platform.md';

export default createProject({
  name: 'Interactive Learning Platform',
  summary:
    'A learning platform for interactive courses, teacher guidance, adaptable content and AI-assisted workflows.',
  color: '#118AB2',
  icon: 'tabler:backpack',
  access: Access.Proprietary,
  tags: [Tags.TypeScript],
  description,
});
