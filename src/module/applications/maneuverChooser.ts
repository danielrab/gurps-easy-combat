import { MODULE_NAME } from '../util/constants.js';
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

function getManeuversData(): Record<string, Maneuver> {
  const gurpsManeuvers: Record<string, GurpsManeuver> = Maneuvers.getAllData();
  return Object.fromEntries(
    Object.entries(maneuversInfo).map(([key, maneuverInfo]: [string, ManeuverInfo]) => {
      const maneuver = gurpsManeuvers[key];
      const maneuverData: Maneuver = {
        ...maneuverInfo,
        name: game.i18n.localize(maneuver.label),
        canAttack: key.includes('attack'),
      };
      return [key, maneuverData];
    }),
  );
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
  getData(): { maneuvers: Record<string, Maneuver>; actor: Actor } {
    return { maneuvers: getManeuversData(), actor: this.actor };
  }
  activateListeners(html: JQuery): void {
    super.activateListeners(html);
    html.find('.manuever_choice').on('click', (event) => {
      const element = $(event.currentTarget);
      const maneuverName = element.attr('value');
      if (!maneuverName) {
        ui.notifications?.error('no value on clicked element');
        return;
      }
      const maneuver = getManeuversData()[maneuverName];
      this.actor.replaceManeuver(maneuverName);
      ChatMessage.create({
        content: `${this.actor.name} uses the "${element.attr('name')}" maneuver [PDF:${element.attr('page')}]`,
      });
      this.closeForEveryone();
      maneuver.callback?.(this.actor);
    });
  }
}
