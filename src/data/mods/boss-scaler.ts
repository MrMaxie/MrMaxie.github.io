import screenshot1 from '../../assets/mods/boss-scaler/01.png';
import screenshot2 from '../../assets/mods/boss-scaler/02.png';
import logo from '../../assets/mods/boss-scaler.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './boss-scaler.md';

export default createMod({
  name: 'Boss Scaler',
  game: GameId.Terraria,
  summary: 'Scales vanilla and modded bosses, with separate control over minions and individual enemies.',
  tags: [Tags.CSharp, Tags.Gamedev],
  version: '1.1.1',
  logo,
  screenshots: [
    { image: screenshot1, alt: 'Boss Scaler settings for boss health, damage, minions, and individual enemies.' },
    { image: screenshot2, alt: 'The Eye of Cthulhu with increased health in a Terraria fight.' },
  ],
  links: [{ label: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3393301771' }],
  description,
});
