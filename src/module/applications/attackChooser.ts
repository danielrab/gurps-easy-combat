import { getMeleeModifiers, getRangedModifiers, makeAttackInner } from '../attackWorkflow.js';
import { TEMPLATES_FOLDER } from '../util/constants.js';
import { getAttacks } from '../dataExtractor.js';
import { ChooserData, MeleeAttack, RangedAttack } from '../types.js';
import BaseActorController from './abstract/BaseActorController.js';
import { activateChooser, ensureDefined, getManeuver, getTargets } from '../util/miscellaneous.js';

interface AttackData {
  isMoving: boolean;
}

export default class AttackChooser extends BaseActorController {
  data: AttackData;
  attacks: {
    melee: MeleeAttack[];
    ranged: RangedAttack[];
  };

  static modifiersGetters = {
    melee: getMeleeModifiers,
    ranged: getRangedModifiers,
  };

  constructor(actor: Actor, data: AttackData) {
    super('AttackChooser', actor, {
      title: `Attack Chooser - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/attackChooser.hbs`,
    });
    this.data = data;
    this.attacks = getAttacks(this.actor);
  }
  getData(): {
    melee: ChooserData<['weapon', 'mode', 'level', 'damage', 'reach']>;
    ranged: ChooserData<['weapon', 'mode', 'level', 'damage', 'range', 'accuracy', 'bulk']>;
    data: AttackData;
  } {
    const { melee, ranged } = getAttacks(this.actor);
    const meleeData = melee.map(({ name, mode, level, damage, reach }) => ({
      weapon: name,
      mode,
      level,
      damage,
      reach,
    }));
    const rangedData = ranged.map(({ name, mode, level, damage, range, acc, bulk }) => ({
      weapon: name,
      mode,
      level,
      damage,
      range,
      accuracy: acc,
      bulk,
    }));
    return {
      melee: {
        items: meleeData,
        headers: ['weapon', 'mode', 'level', 'damage', 'reach'],
        id: 'melee_attacks',
      },
      ranged: {
        items: rangedData,
        headers: ['weapon', 'mode', 'level', 'damage', 'range', 'accuracy', 'bulk'],
        id: 'ranged_attacks',
      },
      data: this.data,
    };
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
    activateChooser(html, 'melee_attacks', (index) => this.makeAttack('melee', index));
    activateChooser(html, 'ranged_attacks', (index) => this.makeAttack('ranged', index));
    html.on('click', '#is_moving', (event) => {
      this.data.isMoving = event.target.checked;
    });
  }

  makeAttack(mode: 'ranged' | 'melee', index: number): void {
    ensureDefined(game.user, 'game not initialized');
    if (!this.checkTargets(game.user)) return;
    const attack = getAttacks(this.actor)[mode][index];
    const modifiers = AttackChooser.modifiersGetters[mode](attack as RangedAttack & MeleeAttack, {
      maneuver: getManeuver(this.actor),
      isMoving: this.data.isMoving,
    });
    makeAttackInner(this.actor, getTargets(game.user)[0], attack, mode, modifiers);
  }

  checkTargets(user: User): boolean {
    if (user.targets.size === 0) {
      ui.notifications?.warn('you must select a target');
      return false;
    }
    if (user.targets.size > 1) {
      ui.notifications?.warn('you must select only one target');
      return false;
    }
    return true;
  }
}
