import { registerSettings } from './settings.js';
import { registerHelpers } from './handlebars.js';
import { MODULE_NAME } from '../constants.js';
import ManeuverChooser from '../../applications/maneuverChooser.js';
import { ensureDefined, highestPriorityUsers } from '../miscellaneous.js';
import AttackChooser from '../../applications/attackChooser.js';
import { registerFunctions } from './socketkib.js';

export function registerHooks(): void {
  Hooks.once('socketlib.ready', registerFunctions);

  // Initialize module
  Hooks.once('init', async () => {
    console.log('gurps-easy-combat | Initializing gurps-easy-combat');

    // Register custom module settings
    registerSettings();

    // register Handlebars helpers
    registerHelpers();
  });

  Hooks.on('updateCombat', async (combat: Combat) => {
    if (!combat.started) return;
    const actor = combat.combatant.actor;
    ensureDefined(actor, 'current combatant has no actor');
    ensureDefined(game.user, 'game not initialized');
    await ManeuverChooser.closeAll();
    await AttackChooser.closeAll();
    if (highestPriorityUsers(actor).includes(game.user) && game.settings.get(MODULE_NAME, 'maneuver-chooser-on-turn')) {
      new ManeuverChooser(actor).render(true);
    }
  });
}
