import { GurpsRoll } from '../../types/types';

export default abstract class AbstractAction<T> {
  actor: Actor;
  data: T;

  constructor(actor: Actor, data: T) {
    this.actor = actor;
    this.data = data;
  }

  abstract _do(): Promise<boolean>;
  async do<T extends boolean>({ detailed }: { detailed?: T } = {}): Promise<T extends true ? GurpsRoll : boolean> {
    const success = await this._do();
    if (detailed === true) {
      return GURPS.lastTargetedRoll;
    }
    return success;
  }
}
