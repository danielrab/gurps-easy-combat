// Import TypeScript modules
import { registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';
import * as dataExtractor from './dataExtractor.js';
declare global {
  interface Window {
    dataExtractor: typeof dataExtractor;
  }
}
window.dataExtractor = dataExtractor;

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
