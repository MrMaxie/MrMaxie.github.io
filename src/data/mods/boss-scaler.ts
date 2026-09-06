import logo from '../../assets/mods/boss-scaler.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './boss-scaler.md';

export default createMod({
  name: 'Boss Scaler',
  game: GameId.Terraria,
  summary: 'Scales boss health, damage, and related minions to tune the difficulty of fights.',
  tags: [Tags.CSharp, Tags.Gamedev],
  version: '1.0.0',
  logo,
  links: [{ label: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3393301771' }],
  description,
});
