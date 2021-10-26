import { TEMPLATES_FOLDER } from '../setup/constants';
import { getBlocks, getDodge, getParries } from '../dataExtractor';
import BaseActorController from './abstract/BaseActorController';
import { highestPriorityUsers, isDefined, smartRace } from '../util';
import { Modifier } from '../types';

interface DefenseData {
  resolve(value: boolean | PromiseLike<boolean>): void;
  reject(reason: string): void;
  modifiers: Modifier[];
}

export default class DefenseChooser extends BaseActorController {
  data: DefenseData;

  constructor(actor: Actor, data: DefenseData, options?: Partial<Application.Options>) {
    super('DefenseChooser', actor, {
      title: `Defense Chooser - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/defenseChooser.hbs`,
      width: 600,
      ...options,
    });
    this.data = data;
  }
  getData(): { dodge: number; parry: Record<string, number>; block: Record<string, number> } {
    return { dodge: getDodge(this.actor), parry: getParries(this.actor), block: getBlocks(this.actor) };
  }
  async close(): Promise<void> {
    await super.close();
    this.data.reject('closed');
  }
  activateListeners(html: JQuery): void {
    html.on('click', '#dodge', () => {
      const result = GURPS.performAction(
        {
          orig: 'Dodge',
          path: 'currentdodge',
          type: 'attribute',
        },
        this.actor,
      );
      this.data.resolve(result);
      this.close();
    });
    html.on('click', '.parryRow', (event) => {
      const weapon = $(event.currentTarget).attr('weapon');
      if (!weapon) {
        ui.notifications?.error('no weapon attribute on clicked element');
        return;
      }
      const result = GURPS.performAction(
        {
          isMelee: true,
          name: weapon,
          type: 'weapon-parry',
        },
        this.actor,
      );
      this.data.resolve(result);
      this.close();
    });
    html.on('click', '.blockRow', (event) => {
      const weapon = $(event.currentTarget).attr('weapon');
      if (!weapon) {
        ui.notifications?.error('no weapon attribute on clicked element');
        return;
      }
      const result = GURPS.performAction(
        {
          isMelee: true,
          name: weapon,
          type: 'weapon-block',
        },
        this.actor,
      );
      this.data.resolve(result);
      this.close();
    });
  }
  static async attemptDefense(actorId: string, modifiers: Modifier[]): Promise<boolean> {
    const actor = game.actors?.get(actorId);
    if (!actor) {
      throw new Error(`can't find actor with id ${actorId}`);
    }
    const promise = new Promise<boolean>((resolve, reject) => {
      const instance = new this(actor, { resolve, reject, modifiers });
      instance.render(true);
    });
    console.log(promise);
    return promise;
  }
  static async requestDefense(actor: Actor, modifiers: Modifier[]): Promise<boolean> {
    const users = highestPriorityUsers(actor);
    const result = await smartRace(
      users
        .filter((user) => actor.testUserPermission(user, 'OWNER'))
        .map(async (user) => {
          if (!user.id) {
            ui.notifications?.error('user without id');
            throw new Error('user without id');
          }
          if (!actor.id) {
            ui.notifications?.error('target without id');
            throw new Error('target without id');
          }
          return EasyCombat.socket.executeAsUser('attemptDefense', user.id, actor.id, modifiers);
        }),
      { allowRejects: false, default: false, filter: isDefined },
    );
    return result;
  }
}
