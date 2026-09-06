import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './factory-control-platform.md';

export default createProject({
  name: 'Factory Control Platform',
  summary: 'A factory operations dashboard for real-time scanning, event monitoring and machine management.',
  color: '#2A835F',
  icon: 'lucide:robot-arm',
  access: Access.Proprietary,
  tags: [Tags.TypeScript, Tags.Cpp, Tags.CSharp],
  description,
});
