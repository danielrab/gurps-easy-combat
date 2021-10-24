import { makeAttack } from '../attackWorkflow.js';
import { TEMPLATES_FOLDER } from '../setup/constants.js';
import { getAttacks } from '../dataExtractor.js';
import { MeleeAttack, RangedAttack } from '../types.js';
import BaseActorController from './abstract/BaseActorController.js';

function ensureTargets(targets: UserTargets) {
  if (targets.size === 0) {
    ui.notifications?.warn('you must select a target');
    return false;
  }
  if (targets.size > 1) {
    ui.notifications?.warn('you must select only one target');
    return false;
  }
  return true;
}

export class AttackChooser extends BaseActorController {
  constructor(actor: Actor) {
    super(actor, {
      title: 'Attack Chooser',
      template: `${TEMPLATES_FOLDER}/attackChooser.hbs`,
      width: 600,
    });
  }
  getData(): { melee: MeleeAttack[]; ranged: RangedAttack[] } {
    const { melee, ranged } = getAttacks(this.actor);
    return { melee, ranged };
  }
  activateListeners(html: JQuery): void {
    const applicationBox = html[0].getBoundingClientRect();
    html.find('.easy-combat-tooltiptext').each((_, e) => {
      const tooltipBox = e.getBoundingClientRect();
      // check if the tooltip clips the bottom of the dialog and move it up if needed
      if (tooltipBox.bottom > applicationBox.bottom) {
        $(e).css({ top: applicationBox.bottom - tooltipBox.bottom }); // the resulting number is negarive, moving the tooltip up
      }
    });
    html.find('.attack').on('click', async (event) => {
      if (!game.user) return;
      const targets = game.user.targets;
      const mode = event.target.classList.contains('melee') ? 'melee' : 'ranged';
      if (!ensureTargets(targets)) return;
      const indexString = $(event.target).attr('index');
      if (!indexString) {
        ui.notifications?.error("can't find index attribute of clicked element");
        return;
      }
      const attack = getAttacks(this.actor)[mode][parseInt(indexString)];
      makeAttack(this.actor, targets.values().next().value, attack, []);
    });
  }
}
