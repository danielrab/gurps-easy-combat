import { getMeleeModifiers, getRangedModifiers, makeAttackInner } from '../attackWorkflow.js';
import { TEMPLATES_FOLDER } from '../util/constants.js';
import { getAttacks } from '../dataExtractor.js';
import { ChooserData, MeleeAttack, PromiseFunctions, RangedAttack } from '../types.js';
import BaseActorController from './abstract/BaseActorController.js';
import { activateChooser, checkSingleTarget, ensureDefined, getTargets } from '../util/miscellaneous.js';

interface AttackData {
  meleeOnly?: boolean;
  rangedOnly?: boolean;
  keepOpen?: boolean;
}

export default class AttackChooser extends BaseActorController {
  static modifiersGetters = {
    melee: getMeleeModifiers,
    ranged: getRangedModifiers,
  };

  data: AttackData;
  attacks: {
    melee: MeleeAttack[];
    ranged: RangedAttack[];
  };
  promiseFuncs: PromiseFunctions<void> | undefined;

  constructor(token: Token, data: AttackData = {}, promiseFuncs?: PromiseFunctions<void>) {
    super('AttackChooser', token, {
      title: `Attack Chooser - ${token.name}`,
      template: `${TEMPLATES_FOLDER}/attackChooser.hbs`,
    });
    this.data = data;
    this.attacks = getAttacks(this.actor);
    this.promiseFuncs = promiseFuncs;
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
    activateChooser(html, 'melee_attacks', (index) => this.makeAttack('melee', index));
    activateChooser(html, 'ranged_attacks', (index) => this.makeAttack('ranged', index));
    html.on('change', '#keepOpen', (event) => {
      this.data.keepOpen = $(event.currentTarget).is(':checked');
    });
  }

  async makeAttack(mode: 'ranged' | 'melee', index: number): Promise<void> {
    ensureDefined(game.user, 'game not initialized');
    if (!checkSingleTarget(game.user)) return;
    const target = getTargets(game.user)[0];
    ensureDefined(target.actor, 'target has no actor');
    const attack = getAttacks(this.actor)[mode][index];
    const modifiers = AttackChooser.modifiersGetters[mode](attack as RangedAttack & MeleeAttack, this.token, target);
    if (!this.data.keepOpen) {
      this.close();
    }
    await makeAttackInner(this.actor, target, attack, mode, modifiers);
    if (this.promiseFuncs) {
      this.promiseFuncs.resolve();
    }
  }

  static request(token: Token, data?: AttackData): Promise<void> {
    const promise = new Promise<void>((resolve, reject) => {
      new AttackChooser(token, data, { resolve, reject }).render(true);
    });
    return promise;
  }
}
