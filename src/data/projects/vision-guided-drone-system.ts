import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './vision-guided-drone-system.md';

export default createProject({
  name: 'Vision-Guided Drone System',
  summary: 'Real-time guidance and landing simulation for a drone using vision-based target recognition.',
  color: '#65DCD5',
  icon: 'tabler:drone',
  access: Access.Proprietary,
  tags: [Tags.Cpp, Tags.EmbeddedC, Tags.Python],
  description,
});
