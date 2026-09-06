import screenshot3 from '../../assets/mods/imelda-flight-challenges/01.jpg';
import screenshot2 from '../../assets/mods/imelda-flight-challenges/02.jpg';
import screenshot1 from '../../assets/mods/imelda-flight-challenges/03.jpg';
import logo from '../../assets/mods/imelda-flight-challenges.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './imelda-flight-challenges.md';

export default createMod({
  name: 'Easier Imelda Flight Challenges',
  game: GameId.HogwartsLegacy,
  summary:
    "Makes Imelda's broom trials faster and more forgiving with increased speed, sharper steering, continuous boost, larger rings, and easier boost bubbles.",
  version: '1.0.0',
  tags: [Tags.Cpp, Tags.Gamedev],
  logo,
  screenshots: [
    { image: screenshot1, alt: 'A side-by-side comparison of the original and enlarged broom trial rings.' },
    { image: screenshot2, alt: 'The rider approaching an enlarged ring during the Coastal Broom Trial.' },
    { image: screenshot3, alt: 'A coastal broom trial with the next enlarged ring visible ahead of the rider.' },
  ],
  links: [
    { label: 'CurseForge', href: 'https://www.curseforge.com/hogwarts-legacy/mods/easier-imelda-flight-challenges' },
  ],
  description,
});
