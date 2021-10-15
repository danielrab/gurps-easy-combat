import { MODULE_NAME } from './constants.js';

const maneuvers: {
  name: string;
  internalName: string;
  tooltip: string;
  page: string;
}[] = [
  {
    name: 'Do Nothing',
    internalName: 'do_nothing',
    tooltip: 'Take no action but recover from stun',
    page: 'B:364',
  },
  {
    name: 'Move',
    internalName: 'move',
    tooltip: 'Do nothing but move',
    page: 'B:364',
  },
  {
    name: 'Change Posture',
    internalName: 'change_posture',
    tooltip: `Stand up, sit down, etc.`,
    page: 'B:364',
  },
  {
    name: 'Aim',
    internalName: 'aim',
    tooltip: 'Aim a ranged weapon to get its Accuracy bonus',
    page: 'B:364',
  },
  {
    name: 'Evaluate',
    internalName: 'evaluate',
    tooltip: 'Study a foe prior to a melee attack',
    page: 'B:364',
  },
  {
    name: 'Attack',
    internalName: 'attack',
    tooltip: 'unarmed or with a weapon',
    page: 'B:365',
  },
  {
    name: 'Move and Attack',
    internalName: 'move_and_attack',
    tooltip: 'Move and attack at a penalty',
    page: 'B:365',
  },
  {
    name: 'Feint',
    internalName: 'feint',
    tooltip: 'Fake a melee attack',
    page: 'B:365',
  },
  {
    name: 'All-out Attack',
    internalName: 'allout_attack',
    tooltip: 'Attack at a bonus or multiple times',
    page: 'B:365',
  },
  {
    name: 'All-out Defense',
    internalName: 'allout_defense',
    tooltip: 'Increased or double defense',
    page: 'B:366',
  },
  {
    name: 'Ready',
    internalName: 'ready',
    tooltip: 'Prepare a weapon or other item',
    page: 'B:366',
  },
  {
    name: 'Concentrate',
    internalName: 'concentrate',
    tooltip: 'Focus on a mental task',
    page: 'B:366',
  },
  {
    name: 'Wait',
    internalName: 'wait',
    tooltip: 'Hold yourself in readiness to act',
    page: 'B:366',
  },
];

class ManeuverChooser extends Application {
  constructor() {
    super(
      mergeObject(Application.defaultOptions, {
        id: 'gurps-easy-combat-manuevers-settings',
        title: 'Maneuvers Settings',
        template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
        width: 600,
        resizable: true,
      }),
    );
  }
  getData() {
    return { maneuvers, actor: this.getActor() };
  }
  activateListeners(html: JQuery) {
    html.find('.manuever_choice').on('click', (event) => {
      const element = $(event.currentTarget);
      const actor = this.getActor();
      actor.updateManeuver(element.attr('value'));
      ChatMessage.create({
        content: `${actor.name} uses the "${element.attr('name')}" maneuver [PDF:${element.attr('page')}]`,
      });
    });
  }
  getActor() {
    return GURPS.LastActor ?? (game as Game).user?.character;
  }
}

const chooser = new ManeuverChooser();

export function openManeuverChooser(): ManeuverChooser {
  chooser.render(true);
  return chooser;
}
