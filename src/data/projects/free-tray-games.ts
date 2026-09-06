import logo from '../../assets/projects/free-tray-games-logo.svg';
import { createProject, LinkKind } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './free-tray-games.md';

export default createProject({
  name: 'FreeTrayGames',
  version: '1.0.1',
  license: 'Apache-2.0',
  summary:
    'A Windows tray app that tracks free games on Steam, Epic Games Store, and GOG and notifies you about new offers.',
  color: '#e8bd35',
  tags: [Tags.Rust],
  links: [{ label: 'Source code', href: 'https://github.com/MrMaxie/free-tray-games', kind: LinkKind.Source }],
  logo,
  logoTone: 'light',
  description,
});
