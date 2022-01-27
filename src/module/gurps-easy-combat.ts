// Import TypeScript modules
import * as dataExtractor from './dataExtractor.js';
import ManeuverChooser from './applications/maneuverChooser.js';
import AttackChooser from './applications/attackChooser.js';
import { registerHooks } from './util/setup/hooks.js';
import DefenceChooser from './applications/defenseChooser.js';
import { SockerLibSocket } from './util/setup/socketkib.js';

const globals = {
  dataExtractor,
  ManeuverChooser,
  AttackChooser,
  DefenceChooser,
};

declare global {
  const EasyCombat: typeof globals & { socket: SockerLibSocket };
  interface Window {
    EasyCombat: typeof globals;
  }
  interface LenientGlobalVariableTypes {
    game: Game;
  }
}

window.EasyCombat = globals;

registerHooks();
