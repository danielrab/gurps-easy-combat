import { MODULE_NAME } from '../setup/constants.js';
import BaseActorController from './abstract/BaseActorController.js';
import { AttackChooser } from './attackChooser.js';

type Maneuver = {
  name: string;
  tooltip: string;
  page: string;
  canAttack: boolean;
};

const maneuvers: Record<string, Maneuver> = {
  do_nothing: {
    name: 'Do Nothing',
    tooltip: 'Take no action but recover from stun',
    page: 'B:364',
    canAttack: false,
  },
  move: {
    name: 'Move',
    tooltip: 'Do nothing but move',
    page: 'B:364',
    canAttack: false,
  },
  change_posture: {
    name: 'Change Posture',
    tooltip: `Stand up, sit down, etc.`,
    page: 'B:364',
    canAttack: false,
  },
  aim: {
    name: 'Aim',
    tooltip: 'Aim a ranged weapon to get its Accuracy bonus',
    page: 'B:364',
    canAttack: false,
  },
  evaluate: {
    name: 'Evaluate',
    tooltip: 'Study a foe prior to a melee attack',
    page: 'B:364',
    canAttack: false,
  },
  attack: {
    name: 'Attack',
    tooltip: 'unarmed or with a weapon',
    page: 'B:365',
    canAttack: true,
  },
  move_and_attack: {
    name: 'Move and Attack',
    tooltip: 'Move and attack at a penalty',
    page: 'B:365',
    canAttack: true,
  },
  feint: {
    name: 'Feint',
    tooltip: 'Fake a melee attack',
    page: 'B:365',
    canAttack: false,
  },
  allout_attack: {
    name: 'All-out Attack',
    tooltip: 'Attack at a bonus or multiple times',
    page: 'B:365',
    canAttack: true,
  },
  allout_defense: {
    name: 'All-out Defense',
    tooltip: 'Increased or double defense',
    page: 'B:366',
    canAttack: false,
  },
  ready: {
    name: 'Ready',
    tooltip: 'Prepare a weapon or other item',
    page: 'B:366',
    canAttack: false,
  },
  concentrate: {
    name: 'Concentrate',
    tooltip: 'Focus on a mental task',
    page: 'B:366',
    canAttack: false,
  },
  wait: {
    name: 'Wait',
    tooltip: 'Hold yourself in readiness to act',
    page: 'B:366',
    canAttack: false,
  },
};

export class ManeuverChooser extends BaseActorController {
  static instance: ManeuverChooser;

  constructor(actor: Actor) {
    super(actor, {
      title: 'Maneuvers Chooser',
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
      width: 600,
      resizable: true,
    });
  }
  getData(): { maneuvers: Record<string, Maneuver>; actor: Actor } {
    return { maneuvers, actor: this.actor };
  }
  activateListeners(html: JQuery): void {
    html.find('.manuever_choice').on('click', (event) => {
      const element = $(event.currentTarget);
      const maneuverName = element.attr('value');
      if (!maneuverName) {
        ui.notifications?.error('no value on clicked element');
        return;
      }
      const maneuver = maneuvers[maneuverName];
      this.actor.replaceManeuver(maneuverName);
      ChatMessage.create({
        content: `${this.actor.name} uses the "${element.attr('name')}" maneuver [PDF:${element.attr('page')}]`,
      });
      this.close();
      EasyCombat.socket.executeForEveryone('closeManueverChooser', this.actor.id);
      if (maneuver.canAttack) {
        new EasyCombat.AttackChooser(this.actor).render(true);
      }
    });
  }
  static async closeIfActor(actorId: string | null): Promise<void> {
    console.log(actorId);
    if (this.instance.actor.id === actorId) {
      this.instance.close();
    }
  }
  static async show(actor: Actor): Promise<ManeuverChooser> {
    if (!this.instance) {
      this.instance = new this(actor);
    }
    this.instance.actor = actor;
    this.instance.render(true);
    return this.instance;
  }
}
