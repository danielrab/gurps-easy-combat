import { TEMPLATES_FOLDER } from '../../util/constants';
import BaseActorController from '../abstract/BaseActorController';

export default class AllOutAttack extends BaseActorController {
  constructor(actor: Actor, options: Partial<Application.Options>) {
    super('AllOutAttack', actor, {
      title: `All Out Attack - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/AllOutAttack.hbs`,
      width: 600,
      ...options,
    });
  }
}
