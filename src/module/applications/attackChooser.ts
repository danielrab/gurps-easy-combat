import { makeAttack } from '../attackWorkflow.js';
import { TEMPLATES_FOLDER } from '../setup/constants.js';
import { getAttacks } from '../dataExtractor.js';
import { MeleeAttack, Modifier, RangedAttack } from '../types.js';
import BaseActorController from './abstract/BaseActorController.js';

interface AttackData {
  isMoving: boolean;
}

export default class AttackChooser extends BaseActorController {
  data: AttackData;

  constructor(actor: Actor, data: AttackData, options: Partial<Application.Options>) {
    super('AttackChooser', actor, {
      title: `Attack Chooser - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/attackChooser.hbs`,
      width: 600,
      ...options,
    });
    this.data = data;
  }
  getData(): { melee: MeleeAttack[]; ranged: RangedAttack[]; data: AttackData } {
    const { melee, ranged } = getAttacks(this.actor);
    return { melee, ranged, data: this.data };
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
    html.on('click', '.attack', async (event) => {
      if (!game.user) return;
      const targets = game.user.targets;
      const element = event.currentTarget;
      const mode = element.classList.contains('melee') ? 'melee' : 'ranged';
      if (!this.ensureTargets(targets)) return;
      const indexString = $(element).attr('index');
      if (!indexString) {
        ui.notifications?.error("can't find index attribute of clicked element");
        return;
      }
      const attack = getAttacks(this.actor)[mode][parseInt(indexString)];
      const attackModifiers: Modifier[] = [];
      const damageModifiers: Modifier[] = [];
      const defenseModifiers: Modifier[] = [];
      const isMoving = html.find('#is_moving').is(':checked');
      if (isMoving && mode === 'melee') {
        attackModifiers.push({ mod: -4, desc: 'Move and Attack *Max:9' });
      }
      if (isMoving && mode === 'ranged') {
        const bulkStr = (attack as RangedAttack).bulk;
        const bulk = bulkStr === '' ? 0 : parseInt(bulkStr);
        attackModifiers.push({ mod: Math.min(-2, bulk), desc: 'Move and Attack' });
      }
      makeAttack(this.actor, targets.values().next().value, attack, attackModifiers, damageModifiers, defenseModifiers);
    });
    html.on('click', '#is_moving', (event) => {
      this.data.isMoving = event.target.checked;
    });
  }

  ensureTargets(targets: UserTargets): boolean {
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
}
