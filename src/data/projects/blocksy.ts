import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './blocksy.md';

export default createProject({
  name: 'Blocksy',
  license: 'Apache-2.0',
  summary:
    'An experimental grid puzzle game built in PHP, where rotating parts of each level changes the route to the exit.',
  color: '#79c9ff',
  access: Access.Private,
  tags: [Tags.PHP, Tags.Gamedev],
  description,
});
