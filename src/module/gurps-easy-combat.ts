// Import TypeScript modules
import * as dataExtractor from './dataExtractor.js';
import { openManeuverChooser } from './applications/maneuverChooser.js';
import { AttackChooser } from './applications/attackChooser.js';
import { registerHooks } from './setup/hooks.js';
import { SockerLibSocket, SockerLib } from './types.js';

const globals = {
  dataExtractor,
  openManeuverChooser,
  AttackChooser,
};

declare global {
  const EasyCombat: typeof globals & { socket: SockerLibSocket };
  const socketlib: SockerLib;
  interface Window {
    EasyCombat: typeof globals;
  }
  interface LenientGlobalVariableTypes {
    game: Game;
  }
}

window.EasyCombat = globals;

registerHooks();
