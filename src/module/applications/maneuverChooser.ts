import { MODULE_NAME } from '../util/constants.js';
import BaseManeuverChooser, { ManeuverInfo } from './abstract/BaseManeuverChooser.js';
import AttackChooser from './attackChooser.js';
import AllOutAttack from './maneuvers/AllOutAttack.js';
import AllOutDefense from './maneuvers/AllOutDefense.js';
import Feint from './maneuvers/Feint.js';

export default class ManeuverChooser extends BaseManeuverChooser {
  maneuversInfo: Record<string, ManeuverInfo>;

  constructor(token: Token) {
    super('ManeuverChooser', token, {
      title: `Maneuver Chooser - ${token.name}`,
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
    });
    this.maneuversInfo = {
      do_nothing: {
        tooltip: 'Take no action but recover from stun',
        page: 'B:364',
        callback: () => game.combat?.nextTurn(),
      },
      move: {
        tooltip: 'Do nothing but move',
        page: 'B:364',
      },
      change_posture: {
        tooltip: `Stand up, sit down, etc.`,
        page: 'B:364',
      },
      aim: {
        tooltip: 'Aim a ranged weapon to get its Accuracy bonus',
        page: 'B:364',
      },
      evaluate: {
        tooltip: 'Study a foe prior to a melee attack',
        page: 'B:364',
      },
      attack: {
        tooltip: 'unarmed or with a weapon',
        page: 'B:365',
        callback: (token: Token) => new AttackChooser(token).render(true),
      },
      move_and_attack: {
        tooltip: 'Move and attack at a penalty',
        page: 'B:365',
        callback: (token: Token) => new AttackChooser(token).render(true),
      },
      feint: {
        tooltip: 'Fake a melee attack',
        page: 'B:365',
        callback: (token: Token) => new Feint(token).render(true),
      },
      allout_attack: {
        tooltip: 'Attack at a bonus or multiple times',
        page: 'B:365',
        callback: (token: Token) => new AllOutAttack(token).render(true),
      },
      allout_defense: {
        tooltip: 'Increased or double defense',
        page: 'B:366',
        callback: (token: Token) => new AllOutDefense(token).render(true),
      },
      ready: {
        tooltip: 'Prepare a weapon or other item',
        page: 'B:366',
      },
      concentrate: {
        tooltip: 'Focus on a mental task',
        page: 'B:366',
      },
      wait: {
        tooltip: 'Hold yourself in readiness to act',
        page: 'B:366',
      },
    };
  }
}
