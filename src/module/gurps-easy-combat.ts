// Import TypeScript modules
import * as dataExtractor from './dataExtractor.js';
import { ManeuverChooser } from './applications/maneuverChooser.js';
import { AttackChooser } from './applications/attackChooser.js';
import { registerHooks } from './setup/hooks.js';
import { SockerLibSocket, SockerLib } from './types.js';
import { DefenceChooser } from './applications/defenseChooser.js';

const globals = {
  dataExtractor,
  ManeuverChooser,
  AttackChooser,
  DefenceChooser,
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
