import screenshot1 from '../../assets/mods/economy-scaler/01.png';
import screenshot2 from '../../assets/mods/economy-scaler/02.png';
import logo from '../../assets/mods/economy-scaler.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './economy-scaler.md';

export default createMod({
  name: 'Economy Scaler',
  game: GameId.Terraria,
  summary:
    'Adjusts Terraria enemy coin drops and shop prices, with per-enemy settings, disabled drops, and free shops.',
  tags: [Tags.CSharp, Tags.Gamedev],
  version: '1.2.1',
  logo,
  screenshots: [
    { image: screenshot1, alt: 'Economy Scaler settings for coin drops, individual enemies, and shop prices.' },
    { image: screenshot2, alt: 'An NPC shop showing a scaled item purchase price.' },
  ],
  links: [{ label: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3393716685' }],
  description,
});
