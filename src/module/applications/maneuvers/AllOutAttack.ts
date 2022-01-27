import { MODULE_NAME } from '../../data/constants.js';
import BaseManeuverChooser from '../abstract/BaseManeuverChooser.js';
import AttackChooser from '../attackChooser.js';
import Feint from './Feint.js';

//#region types
interface ManeuverInfo {
  tooltip: string;
  page: string;
  callback?: (token: Token) => void;
}

export default class ManeuverChooser extends BaseManeuverChooser {
  maneuversInfo: Record<string, ManeuverInfo>;

  constructor(token: Token) {
    super('AllOutAttack', token, {
      title: `All Out Attack - ${token.name}`,
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
    });
    this.maneuversInfo = {
      aoa_double: {
        tooltip: 'Attack twice with a melee weapon',
        page: 'B:365',
        callback: async (token: Token) => {
          await AttackChooser.request(token, { meleeOnly: true });
          await AttackChooser.request(token, { meleeOnly: true });
        },
      },
      aoa_determined: {
        tooltip: 'Attack with a bonus to hit (+4 for melee, +1 for ranged)',
        page: 'B:365',
        callback: (token: Token) => new AttackChooser(token).render(true),
      },
      aoa_strong: {
        tooltip: 'Attack with +2 to damge using a melee weapon',
        page: 'B:365',
        callback: (token: Token) => new AttackChooser(token, { meleeOnly: true }).render(true),
      },
      aoa_feint: {
        tooltip: 'Make a feint then make an attack with a melee weapon',
        page: 'B:365',
        callback: async (token: Token) => {
          await Feint.request(token);
          await AttackChooser.request(token, { meleeOnly: true });
          token.document.unsetFlag(MODULE_NAME, 'lastFeint');
        },
      },
      aoa_suppress: {
        tooltip: 'Spray an area with automatic weapon (RoF 5+)',
        page: 'B:365',
        callback: (token: Token) => new AttackChooser(token, { rangedOnly: true }).render(true),
      },
    };
  }
}
