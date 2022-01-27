import { ChooserData } from '../../types/types.js';
import { MODULE_NAME } from '../../data/constants.js';
import { activateChooser } from '../../util/miscellaneous.js';
import BaseActorController from '../abstract/BaseActorController.js';

//#region types
export interface ManeuverInfo {
  tooltip: string;
  page: string;
  key: string;
  name: string;
  callback?: string;
}

export default abstract class BaseManeuverChooser extends BaseActorController {
  abstract maneuversInfo: ManeuverInfo[];

  constructor(appName: string, token: Token, options: Partial<Application.Options>) {
    super(appName, token, {
      title: `Maneuver Chooser - ${token.name}`,
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
      ...options,
    });
  }
  getData(): ChooserData<['Maneuver', 'Description']> {
    const maneuversDescriptions = this.maneuversInfo.map((maneuver) => ({
      Maneuver: maneuver.name,
      Description: maneuver.tooltip,
    }));
    return { items: maneuversDescriptions, headers: ['Maneuver', 'Description'], id: 'manuever_choice' };
  }
  activateListeners(html: JQuery): void {
    activateChooser(html, 'manuever_choice', (index) => {
      const maneuver = this.maneuversInfo[index];
      this.token.setManeuver(maneuver.key);
      ChatMessage.create({
        content: `${this.token.name} uses the "${maneuver.name}" maneuver [PDF:${maneuver.page}]`,
      });
      this.closeForEveryone();
      if (maneuver.callback) {
        this.actorHandler.actions[maneuver.callback]();
      }
    });
  }
}
