import { MODULE_NAME } from '../data/constants.js';
import BaseManeuverChooser, { ManeuverInfo } from './abstract/BaseManeuverChooser.js';
import AttackChooser from './attackChooser.js';
import AllOutAttack from './maneuvers/AllOutAttack.js';
import AllOutDefense from './maneuvers/AllOutDefense.js';
import Feint from './maneuvers/Feint.js';

export default class ManeuverChooser extends BaseManeuverChooser {
  maneuversInfo: ManeuverInfo[];

  constructor(token: Token) {
    super('ManeuverChooser', token, {
      title: `Maneuver Chooser - ${token.name}`,
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
    });
    this.maneuversInfo = game.settings.get('gurps-easy-combat', 'maneuvers-data') as ManeuverInfo[];
  }
}
