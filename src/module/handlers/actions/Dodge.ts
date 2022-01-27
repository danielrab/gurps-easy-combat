import { GurpsRoll } from '../../types/types';
import AbstractAction from './AbstractAction';

export default class Dodge extends AbstractAction<{ level: number }> {
  constructor(actor: Actor) {
    super(actor, { level: actor.getCurrentDodge() });
  }

  async do(): Promise<GurpsRoll> {
    await GURPS.performAction(
      {
        orig: 'Dodge',
        path: 'currentdodge',
        type: 'attribute',
      },
      this.actor,
    );
    return GURPS.lastTargetedRoll;
  }
}
