import screenshot1 from '../../assets/mods/money-is-luck/01-money-red.png';
import screenshot2 from '../../assets/mods/money-is-luck/03-money-green.png';
import screenshot3 from '../../assets/mods/money-is-luck/08-money-clip.png';
import screenshot4 from '../../assets/mods/money-is-luck/09-item-family.png';
import logo from '../../assets/mods/money-is-luck.png';
import { createMod, GameId } from '../../lib/content';
import { Tags } from '../tags';
import { Content as description } from './money-is-luck.md';

export default createMod({
  name: 'Money = Luck?',
  game: GameId.Isaac,
  summary:
    'Turns your coin balance into a seven-coin Luck cycle, with Money Clip and Rose-Tinted Glasses changing how you use it.',
  tags: [Tags.Lua, Tags.Gamedev],
  version: '1.0.0',
  logo,
  screenshots: [
    { image: screenshot1, alt: 'Isaac with red glasses while Money = Luck? gives negative Luck.' },
    { image: screenshot2, alt: 'Isaac with green glasses while Money = Luck? gives positive Luck.' },
    { image: screenshot3, alt: 'The Money Clip trinket holding a lucky coin balance.' },
    { image: screenshot4, alt: 'The Money = Luck? item, Money Clip, and Rose-Tinted Glasses together.' },
  ],
  links: [{ label: 'Steam Workshop', href: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2493745218' }],
  description,
});
