import { registerSettings } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { MODULE_NAME } from './constants.js';
import ManeuverChooser from '../applications/maneuverChooser.js';
import BaseActorController from '../applications/abstract/BaseActorController.js';
import DefenseChooser from '../applications/defenseChooser.js';
import { highestPriorityUsers } from '../util.js';
import AttackChooser from '../applications/attackChooser.js';

export const functionsToRegister = {
  attemptDefense: DefenseChooser.attemptDefense.bind(DefenseChooser),
  closeController: BaseActorController.closeById.bind(BaseActorController),
} as const;
export function registerHooks(): void {
  Hooks.once('socketlib.ready', () => {
    EasyCombat.socket = socketlib.registerModule(MODULE_NAME);
    for (const [alias, func] of Object.entries(functionsToRegister)) {
      console.log(alias, func);
      EasyCombat.socket.register(alias, func);
    }
  });

  // Initialize module
  Hooks.once('init', async () => {
    console.log('gurps-easy-combat | Initializing gurps-easy-combat');

    // Assign custom classes and constants here

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    await preloadTemplates();

    // Register custom sheets (if any)
  });

  // Setup module
  Hooks.once('setup', async () => {
    // Do anything after initialization but before
    // ready
  });

  // When ready
  Hooks.once('ready', async () => {
    // Do anything once the module is ready
  });

  Hooks.on('updateCombat', async (combat: Combat) => {
    if (!combat.started) return;
    const actor = combat.combatant.actor;
    if (!actor) {
      ui.notifications?.error('current combatant has no actor');
      return;
    }
    if (!game.user) {
      ui.notifications?.error('game not initialized');
      throw new Error('game not initialized');
    }
    await ManeuverChooser.closeAll();
    await AttackChooser.closeAll();
    if (highestPriorityUsers(actor).includes(game.user) && game.settings.get(MODULE_NAME, 'maneuver-chooser-on-turn')) {
      new ManeuverChooser(actor).render(true);
    }
  });
}
