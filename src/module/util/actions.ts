import { Modifier } from '../types';

export function applyModifiers(modifiers: Modifier[]): void {
  for (const modifier of modifiers) {
    GURPS.ModifierBucket.addModifier(modifier.mod, modifier.desc);
  }
}
