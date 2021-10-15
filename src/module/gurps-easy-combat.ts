// Import TypeScript modules
import * as dataExtractor from './dataExtractor.js';
import { openManeuverChooser } from './maneuverChooser.js';
import { AttackChooser } from './attackChooser.js';
import { registerHooks } from './hooks.js';

const globals = {
  dataExtractor,
  openManeuverChooser,
  AttackChooser,
};

declare global {
  const EasyCombat: typeof globals & { socket: any };
  const socketlib: any;
  interface Window {
    EasyCombat: typeof globals;
  }
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }
}

window.EasyCombat = globals;

registerHooks();
