import { TEMPLATES_FOLDER } from '../../util/constants';
import BaseActorController from '../abstract/BaseActorController';

export default class Feint extends BaseActorController {
  constructor(actor: Actor, options: Partial<Application.Options>) {
    super('Feint', actor, {
      title: `Feint - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/Feint.hbs`,
      width: 600,
      ...options,
    });
  }
}
