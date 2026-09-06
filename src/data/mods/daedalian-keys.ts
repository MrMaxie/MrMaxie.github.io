import screenshot1 from '../../assets/mods/daedalian-keys/01.jpg';
import screenshot2 from '../../assets/mods/daedalian-keys/02.jpg';
import logo from '../../assets/mods/daedalian-keys.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './daedalian-keys.md';

export default createMod({
  name: 'Daedalian Key Assist',
  game: GameId.HogwartsLegacy,
  summary:
    'Guides you to the nearest remaining Daedalian Key, shows its location in quest details, and automatically completes cabinet minigames after you start them',
  version: '1.0.0',
  tags: [Tags.Cpp, Tags.Gamedev],
  logo,
  screenshots: [
    { image: screenshot1, alt: 'A tracked Daedalian Key cabinet marked in the Hogwarts HUD and minimap.' },
    { image: screenshot2, alt: 'A Daedalian Key lined up with its cabinet while the quest remains tracked.' },
  ],
  links: [{ label: 'CurseForge', href: 'https://www.curseforge.com/hogwarts-legacy/mods/daedalian-key-assist' }],
  description,
});
