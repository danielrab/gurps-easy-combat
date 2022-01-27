import { getAttacks } from '../../dataExtractor';
import { ChooserData, PromiseFunctions } from '../../types/types';
import { rollMeleeAttack } from '../../util/actions';
import { MODULE_NAME, TEMPLATES_FOLDER } from '../../data/constants';
import { activateChooser, ensureDefined, checkSingleTarget, getTargets } from '../../util/miscellaneous';
import BaseActorController from '../abstract/BaseActorController';
import FeintDefense from '../feintDefense';

export default class Feint extends BaseActorController {
  promiseFuncs: PromiseFunctions<number> | undefined;

  constructor(token: Token, promiseFuncs?: PromiseFunctions<number>) {
    super('Feint', token, {
      title: `Feint - ${token.name}`,
      template: `${TEMPLATES_FOLDER}/feint.hbs`,
    });
    this.promiseFuncs = promiseFuncs;
  }

  getData(): ChooserData<['weapon', 'mode', 'level', 'damage', 'reach']> {
    const data = getAttacks(this.actor).melee.map(({ name, mode, level, damage, reach }) => ({
      weapon: name,
      mode,
      level,
      damage,
      reach,
    }));
    return { items: data, headers: ['weapon', 'mode', 'level', 'damage', 'reach'], id: 'melee_attacks' };
  }

  activateListeners(html: JQuery): void {
    activateChooser(html, 'melee_attacks', async (index) => {
      ensureDefined(game.user, 'game not initialized');
      if (!checkSingleTarget(game.user)) return;
      const target = getTargets(game.user)[0];
      if (!target) {
        ui.notifications?.error('target has no actor');
        return;
      }
      const attack = getAttacks(this.actor).melee[index];
      const attackResult = await rollMeleeAttack(attack, this.actor);
      if (attackResult.failure) {
        this.close();
        return;
      }
      const defenseResult = await FeintDefense.requestDefense(target);
      let successMargin = attackResult.margin - defenseResult.margin;
      if (successMargin <= 0) {
        ChatMessage.create({ content: 'the feint was unsuccessfull' });
        successMargin = 0;
      } else {
        ChatMessage.create({
          content: `the feint was successful\nopponent gets [-${successMargin} to defense from feint]`,
        });
      }
      this.token.document.setFlag(MODULE_NAME, 'lastFeint', {
        successMargin,
        targetId: target.id,
        round: game.combat?.round ?? 0,
      });
      if (this.promiseFuncs) {
        this.promiseFuncs.resolve(successMargin);
      }
      this.close();
    });
  }

  static async request(token: Token): Promise<number> {
    const promise = new Promise<number>((resolve, reject) => {
      new Feint(token, { resolve, reject }).render(true);
    });
    return promise;
  }
}
