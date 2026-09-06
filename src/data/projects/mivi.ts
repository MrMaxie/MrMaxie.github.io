import logo from '../../assets/projects/mivi-logo.png';
import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './mivi.md';

export default createProject({
  name: 'Mivi',
  summary:
    'A self-hosted photo and video library in development, with a shared foundation for web and Android clients.',
  color: '#e9596f',
  tags: [Tags.TypeScript],
  access: Access.Private,
  logo,
  description,
});
