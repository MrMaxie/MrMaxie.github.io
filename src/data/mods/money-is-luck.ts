import logo from '../../assets/mods/money-is-luck.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './money-is-luck.md';

export default createMod({
  name: 'Money = Luck?',
  game: GameId.Isaac,
  summary: 'Reconstructs a coin-based luck item while its balance and runtime behavior are revalidated.',
  tags: [Tags.Lua, Tags.Gamedev],
  version: '0.1.0',
  logo,
  links: [{ label: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2493745218' }],
  description,
});
