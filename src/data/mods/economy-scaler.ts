import logo from '../../assets/mods/economy-scaler.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './economy-scaler.md';

export default createMod({
  name: 'Economy Scaler',
  game: GameId.Terraria,
  summary: "Adjusts enemy money drops and shop prices to reshape Terraria's economy.",
  tags: [Tags.CSharp, Tags.Gamedev],
  version: '1.1.0',
  logo,
  links: [{ label: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3393716685' }],
  description,
});
