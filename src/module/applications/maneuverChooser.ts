import { MODULE_NAME } from '../setup/constants.js';

type Maneuver = {
  name: string;
  tooltip: string;
  page: string;
};

const maneuvers: Record<string, Maneuver> = {
  do_nothing: {
    name: 'Do Nothing',
    tooltip: 'Take no action but recover from stun',
    page: 'B:364',
  },
  move: {
    name: 'Move',
    tooltip: 'Do nothing but move',
    page: 'B:364',
  },
  change_posture: {
    name: 'Change Posture',
    tooltip: `Stand up, sit down, etc.`,
    page: 'B:364',
  },
  aim: {
    name: 'Aim',
    tooltip: 'Aim a ranged weapon to get its Accuracy bonus',
    page: 'B:364',
  },
  evaluate: {
    name: 'Evaluate',
    tooltip: 'Study a foe prior to a melee attack',
    page: 'B:364',
  },
  attack: {
    name: 'Attack',
    tooltip: 'unarmed or with a weapon',
    page: 'B:365',
  },
  move_and_attack: {
    name: 'Move and Attack',
    tooltip: 'Move and attack at a penalty',
    page: 'B:365',
  },
  feint: {
    name: 'Feint',
    tooltip: 'Fake a melee attack',
    page: 'B:365',
  },
  allout_attack: {
    name: 'All-out Attack',
    tooltip: 'Attack at a bonus or multiple times',
    page: 'B:365',
  },
  allout_defense: {
    name: 'All-out Defense',
    tooltip: 'Increased or double defense',
    page: 'B:366',
  },
  ready: {
    name: 'Ready',
    tooltip: 'Prepare a weapon or other item',
    page: 'B:366',
  },
  concentrate: {
    name: 'Concentrate',
    tooltip: 'Focus on a mental task',
    page: 'B:366',
  },
  wait: {
    name: 'Wait',
    tooltip: 'Hold yourself in readiness to act',
    page: 'B:366',
  },
};

export class ManeuverChooser extends Application {
  actor: Actor;

  constructor(actor: Actor) {
    super(
      mergeObject(Application.defaultOptions, {
        id: 'gurps-easy-combat-manuevers-settings',
        title: 'Maneuvers Chooser',
        template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
        width: 600,
        resizable: true,
      }),
    );
    this.actor = actor;
  }
  getData() {
    return { maneuvers, actor: this.actor };
  }
  activateListeners(html: JQuery) {
    html.find('.manuever_choice').on('click', (event) => {
      const element = $(event.currentTarget);
      const maneuverName = element.attr('value');
      this.actor.replaceManeuver(maneuverName);
      ChatMessage.create({
        content: `${this.actor.name} uses the "${element.attr('name')}" maneuver [PDF:${element.attr('page')}]`,
      });
      this.close();
    });
  }
}
