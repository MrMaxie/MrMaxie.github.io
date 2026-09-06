import { Access, createProject } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './real-time-3d-geospatial-platform.md';

export default createProject({
  name: 'Real-Time 3D Geospatial Platform',
  summary: 'A real-time 3D mapping platform for exploring spatial data and collaborating directly on the map.',
  color: '#558467',
  icon: 'lucide:map-pinned',
  access: Access.Proprietary,
  tags: [Tags.TypeScript, Tags.Rust, Tags.CSharp],
  description,
});
