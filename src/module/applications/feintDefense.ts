import { rollAttack } from '../attackWorkflow';
import { getAttacks } from '../dataExtractor';
import { ChooserData, GurpsRoll, PromiseFunctions } from '../types';
import { TEMPLATES_FOLDER } from '../util/constants';
import {
  activateChooser,
  ensureDefined,
  checkSingleTarget,
  highestPriorityUsers,
  smartRace,
  isDefined,
  getToken,
} from '../util/miscellaneous';
import BaseActorController from './abstract/BaseActorController';

export default class FeintDefense extends BaseActorController {
  resolve: (value: GurpsRoll | PromiseLike<GurpsRoll>) => void;
  reject: (reason: string) => void;

  constructor(token: Token, { resolve, reject }: PromiseFunctions<GurpsRoll>) {
    super('FeintDefense', token, {
      title: `Feint Defense - ${token.name}`,
      template: `${TEMPLATES_FOLDER}/feint.hbs`,
    });
    this.resolve = resolve;
    this.reject = reject;
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

  async close(): Promise<void> {
    await super.close();
    this.reject('closed');
  }

  activateListeners(html: JQuery): void {
    activateChooser(html, 'melee_attacks', async (index) => {
      ensureDefined(game.user, 'game not initialized');
      if (!checkSingleTarget(game.user)) return;
      const attack = getAttacks(this.actor).melee[index];
      const attackResult = rollAttack(this.actor, attack, 'melee');
      this.resolve(attackResult);
      this.closeForEveryone();
    });
  }

  static async attemptDefense(sceneId: string, tokenId: string): Promise<GurpsRoll> {
    const token = getToken(sceneId, tokenId);
    const promise = new Promise<GurpsRoll>((resolve, reject) => {
      const instance = new FeintDefense(token, { resolve, reject });
      instance.render(true);
    });
    return promise;
  }

  static async requestDefense(token: Token): Promise<GurpsRoll> {
    const actor = token.actor;
    ensureDefined(actor, 'token has no actor');
    const users = highestPriorityUsers(actor);
    const result = await smartRace(
      users.map(async (user) => {
        ensureDefined(user.id, 'user without id');
        ensureDefined(token.id, 'token without id');
        ensureDefined(token.scene.id, 'scene without id');
        return EasyCombat.socket.executeAsUser('attemptFeintDefense', user.id, token.scene.id, token.id);
      }),
      { allowRejects: false, filter: isDefined },
    );
    return result;
  }
}
