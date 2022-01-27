import Dodge from './actions/Dodge';

export default class ActorHandler {
  actor: Actor;
  actions: Record<string, () => void>;

  constructor(actor: Actor) {
    this.actor = actor;
    this.actions = {
      endTurn: () => {
        game.combat?.nextTurn();
      },
    };
  }

  get dodge(): Dodge {
    return new Dodge(this.actor);
  }
}
