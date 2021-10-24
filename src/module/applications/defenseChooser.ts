import { TEMPLATES_FOLDER } from '../setup/constants';
import { getBlocks, getDodge, getParries } from '../dataExtractor';
import BaseActorController from './abstract/BaseActorController';

export class DefenceChooser extends BaseActorController {
  constructor(actor: Actor) {
    super(actor, {
      title: 'Defense Chooser',
      template: `${TEMPLATES_FOLDER}/defenseChooser.hbs`,
      width: 600,
    });
  }
  getData(): { dodge: number; parry: Record<string, number>; block: Record<string, number> } {
    return { dodge: getDodge(this.actor), parry: getParries(this.actor), block: getBlocks(this.actor) };
  }
}
