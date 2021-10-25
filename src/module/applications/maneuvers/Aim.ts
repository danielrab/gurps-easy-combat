import { TEMPLATES_FOLDER } from '../../setup/constants';
import BaseActorController from '../abstract/BaseActorController';

export default class Aim extends BaseActorController {
  constructor(actor: Actor, options: Partial<Application.Options>) {
    super('Aim', actor, {
      title: `Aim - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/Aim.hbs`,
      width: 600,
      ...options,
    });
  }
}
