import { ChooserData } from '../types.js';
import { MODULE_NAME } from '../util/constants.js';
import { activateChooser } from '../util/miscellaneous.js';
import BaseActorController from './abstract/BaseActorController.js';
import AttackChooser from './attackChooser.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Maneuvers from '/systems/gurps/module/actor/maneuver.js';

//#region types
interface ManeuverInfo {
  tooltip: string;
  page: string;
  callback?: (actor: Actor) => void;
}
interface Maneuver extends ManeuverInfo {
  name: string;
  canAttack: boolean;
  key: string;
}
interface GurpsManeuver {
  changes: {
    key: string;
    mode: number;
    priority: number;
    value: string;
  }[];
  flags: {
    gurps: {
      alt: null;
      defense: 'any' | 'none' | 'dodge-block';
      fullturn: boolean;
      icon: string;
      move: 'step' | 'half' | 'full';
      name: string;
    };
  };
  icon: string;
  id: 'maneuver';
  label: string;
}
//#endregion

const maneuversInfo: Record<string, ManeuverInfo> = {
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
    callback: (actor: Actor) => new AttackChooser(actor, { isMoving: false }).render(true),
  },
  move_and_attack: {
    tooltip: 'Move and attack at a penalty',
    page: 'B:365',
    callback: (actor: Actor) => new AttackChooser(actor, { isMoving: true }).render(true),
  },
  feint: {
    tooltip: 'Fake a melee attack',
    page: 'B:365',
  },
  allout_attack: {
    tooltip: 'Attack at a bonus or multiple times',
    page: 'B:365',
  },
  allout_defense: {
    tooltip: 'Increased or double defense',
    page: 'B:366',
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

function getManeuversData(): Maneuver[] {
  const gurpsManeuvers: Record<string, GurpsManeuver> = Maneuvers.getAllData();
  return Object.entries(maneuversInfo).map(([key, maneuverInfo]: [string, ManeuverInfo]) => {
    return {
      ...maneuverInfo,
      name: game.i18n.localize(gurpsManeuvers[key].label),
      canAttack: key.includes('attack'),
      key,
    };
  });
}

export default class ManeuverChooser extends BaseActorController {
  static instance: ManeuverChooser;

  constructor(actor: Actor) {
    super('ManeuverChooser', actor, {
      title: `Maneuver Chooser - ${actor.name}`,
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
    });
    ManeuverChooser.instance = this;
  }
  getData(): ChooserData<['Maneuver', 'Description']> {
    const maneuversDescriptions = getManeuversData().map((maneuver) => ({
      Maneuver: maneuver.name,
      Description: maneuver.tooltip,
    }));
    return { items: maneuversDescriptions, headers: ['Maneuver', 'Description'], id: 'manuever_choice' };
  }
  activateListeners(html: JQuery): void {
    activateChooser(html, 'manuever_choice', (index) => {
      const maneuver = getManeuversData()[index];
      this.actor.replaceManeuver(maneuver.key);
      ChatMessage.create({
        content: `${this.actor.name} uses the "${maneuver.name}" maneuver [PDF:${maneuver.page}]`,
      });
      this.closeForEveryone();
      maneuver.callback?.(this.actor);
    });
  }
}
