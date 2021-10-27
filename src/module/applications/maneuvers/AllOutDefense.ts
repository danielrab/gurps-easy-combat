import { TEMPLATES_FOLDER } from '../../util/constants';
import BaseActorController from '../abstract/BaseActorController';

export default class AllOutDefense extends BaseActorController {
  constructor(actor: Actor, options: Partial<Application.Options>) {
    super('AllOutDefense', actor, {
      title: `All Out Defense - ${actor.name}`,
      template: `${TEMPLATES_FOLDER}/AllOutDefense.hbs`,
      width: 600,
      ...options,
    });
  }
}
