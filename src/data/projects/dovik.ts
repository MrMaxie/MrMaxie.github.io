import logo from '../../assets/projects/dovik-logo.png';
import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './dovik.md';

export default createProject({
  name: 'Dovik',
  summary: 'A local development-process supervisor with a shared daemon, command-line tools, and a terminal interface.',
  color: '#ff6b3d',
  tags: [Tags.Go, Tags.DevOps],
  access: Access.Private,
  logo,
  description,
});
