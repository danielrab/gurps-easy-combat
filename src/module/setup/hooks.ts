import { registerSettings } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { useDefense, closeDefenceDialog } from '../attackWorkflow.js';
import { MODULE_NAME } from './constants.js';
import { ManeuverChooser } from '../applications/maneuverChooser.js';

export const functionsToRegister = {
  useDefense,
  closeDefenceDialog,
  closeManueverChooser: (actorId: string | null) => ManeuverChooser.closeIfActor(actorId),
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

  Hooks.on('updateCombat', (combat: Combat) => {
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
    if (actor.testUserPermission(game.user, 'OWNER') && game.settings.get(MODULE_NAME, 'maneuver-chooser-on-turn')) {
      ManeuverChooser.show(actor);
    }
  });
}
