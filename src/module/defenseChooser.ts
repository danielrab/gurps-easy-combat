import { TEMPLATES_FOLDER } from './constants';
import { getBlocks, getDodge, getParries } from './dataExtractor';

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
  getData() {
    return { dodge: getDodge(this.actor), parry: getParries(this.actor), block: getBlocks(this.actor) };
  }
  activateListeners(html: JQuery): void {
    html.find('.attack').on('click', async (event) => {
      const targets = game.user!.targets;
      const mode = event.target.classList.contains('melee') ? 'melee' : 'ranged';
      if (!ensureTargets(targets)) return;
      const attack = getAttacks(this.actor)[mode][parseInt($(event.target).attr('index')!)];
      makeAttack(this.actor, targets.values().next().value, attack, []);
    });
  }
}
