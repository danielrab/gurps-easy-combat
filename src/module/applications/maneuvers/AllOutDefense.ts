import { TEMPLATES_FOLDER } from '../../data/constants';
import BaseActorController from '../abstract/BaseActorController';

export default class AllOutDefense extends BaseActorController {
  constructor(token: Token) {
    super('AllOutDefense', token, {
      title: `All Out Defense - ${token.name}`,
      template: `${TEMPLATES_FOLDER}/allOutDefense.hbs`,
    });
  }
}
