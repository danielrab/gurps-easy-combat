import { ChooserData } from '../../types.js';
import { MODULE_NAME } from '../../util/constants.js';
import { activateChooser } from '../../util/miscellaneous.js';
import BaseActorController from '../abstract/BaseActorController.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Maneuvers from '/systems/gurps/module/actor/maneuver.js';

//#region types
export interface ManeuverInfo {
  tooltip: string;
  page: string;
  callback?: (token: Token) => void;
}
interface Maneuver extends ManeuverInfo {
  name: string;
  canAttack: boolean;
  key: string;
}
interface GurpsManeuver {
  changes: {
    key: string;
    mode: number;
    priority: number;
    value: string;
  }[];
  flags: {
    gurps: {
      alt: null;
      defense: 'any' | 'none' | 'dodge-block';
      fullturn: boolean;
      icon: string;
      move: 'step' | 'half' | 'full';
      name: string;
    };
  };
  icon: string;
  id: 'maneuver';
  label: string;
}
//#endregion

export default abstract class BaseManeuverChooser extends BaseActorController {
  abstract maneuversInfo: Record<string, ManeuverInfo>;

  constructor(appName: string, token: Token, options: Partial<Application.Options>) {
    super(appName, token, {
      title: `Maneuver Chooser - ${token.name}`,
      template: `modules/${MODULE_NAME}/templates/maneuverChooser.hbs`,
      ...options,
    });
  }
  getData(): ChooserData<['Maneuver', 'Description']> {
    const maneuversDescriptions = this.getManeuversData().map((maneuver) => ({
      Maneuver: maneuver.name,
      Description: maneuver.tooltip,
    }));
    return { items: maneuversDescriptions, headers: ['Maneuver', 'Description'], id: 'manuever_choice' };
  }
  activateListeners(html: JQuery): void {
    activateChooser(html, 'manuever_choice', (index) => {
      const maneuver = this.getManeuversData()[index];
      this.token.setManeuver(maneuver.key);
      ChatMessage.create({
        content: `${this.token.name} uses the "${maneuver.name}" maneuver [PDF:${maneuver.page}]`,
      });
      this.closeForEveryone();
      maneuver.callback?.(this.token);
    });
  }

  getManeuversData(): Maneuver[] {
    const gurpsManeuvers: Record<string, GurpsManeuver> = Maneuvers.getAllData();
    return Object.entries(this.maneuversInfo).map(([key, maneuverInfo]: [string, ManeuverInfo]) => {
      return {
        ...maneuverInfo,
        name: game.i18n.localize(gurpsManeuvers[key].label),
        canAttack: key.includes('attack'),
        key,
      };
    });
  }
}
