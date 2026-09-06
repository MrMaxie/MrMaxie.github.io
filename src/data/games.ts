import bindingOfIsaacImage from '~/assets/games/binding-of-isaac-rebirth.jpg';
import hogwartsLegacyImage from '~/assets/games/hogwarts-legacy.jpg';
import terrariaImage from '~/assets/games/terraria.jpg';
import { GameId } from '../lib/content';

export const gameCatalog = [
  {
    id: GameId.Terraria,
    name: 'Terraria',
    color: '#72c27f',
    monogram: 'TR',
    image: terrariaImage,
    sourceUrl: 'https://store.steampowered.com/app/105600/Terraria/',
  },
  {
    id: GameId.Isaac,
    name: 'The Binding of Isaac: Rebirth',
    color: '#c38f7f',
    monogram: 'IS',
    image: bindingOfIsaacImage,
    sourceUrl: 'https://store.steampowered.com/app/250900/The_Binding_of_Isaac_Rebirth/',
  },
  {
    id: GameId.HogwartsLegacy,
    name: 'Hogwarts Legacy',
    color: '#75b9ee',
    monogram: 'HL',
    image: hogwartsLegacyImage,
    sourceUrl: 'https://store.steampowered.com/app/990080/Hogwarts_Legacy/',
  },
] as const;
