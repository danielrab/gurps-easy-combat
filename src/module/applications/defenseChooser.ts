import { TEMPLATES_FOLDER } from '../setup/constants';
import { getBlocks, getDodge, getParries } from '../dataExtractor';

export class DefenceChooser extends Application {
  actor: Actor;

  constructor(actor: Actor) {
    super(
      mergeObject(Application.defaultOptions, {
        id: 'defense-chooser',
        title: 'Defense Chooser',
        template: `${TEMPLATES_FOLDER}/defenseChooser.hbs`,
        width: 600,
        resizable: true,
      }),
    );
    this.actor = actor;
  }
  getData(): { dodge: number; parry: Record<string, number>; block: Record<string, number> } {
    return { dodge: getDodge(this.actor), parry: getParries(this.actor), block: getBlocks(this.actor) };
  }
}
