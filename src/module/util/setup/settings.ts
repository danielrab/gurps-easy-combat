import { MODULE_NAME } from '../../data/constants.js';
import { readData } from '../miscellaneous.js';

export async function registerSettings(): Promise<void> {
  game.settings.register(MODULE_NAME, 'maneuver-chooser-on-turn', {
    scope: 'world',
    type: Boolean,
    default: true,
    name: 'Open Maneuver Chooser when a new turn in combat is started',
    hint: 'the Chooser will only be opened for players that own the token',
    config: true,
  });
  game.settings.register(MODULE_NAME, 'maneuvers-data', {
    scope: 'world',
    type: Array,
    default: await readData('maneuvers.json'),
    name: 'Maneuvers',
    hint: 'configure maneuvers',
    config: true,
  });
}
