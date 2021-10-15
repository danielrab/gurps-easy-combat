import { registerSettings } from './settings.js';
import { preloadTemplates } from './preloadTemplates.js';
import { useDefence, closeDefenceDialog } from './attackWorkflow.js';
import { MODULE_NAME } from './constants.js';

export function registerHooks() {
  Hooks.once('socketlib.ready', () => {
    EasyCombat.socket = socketlib.registerModule(MODULE_NAME);
    EasyCombat.socket.register('useDefense', useDefence);
    EasyCombat.socket.register('closeDefenceDialog', closeDefenceDialog);
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

  // Add any additional hooks if necessary
}
