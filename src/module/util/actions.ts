import { MeleeAttack, Modifier } from '../types/types';
import { getFullName } from './miscellaneous';

export function applyModifiers(modifiers: Modifier[]): void {
  for (const modifier of modifiers) {
    GURPS.ModifierBucket.addModifier(modifier.mod, modifier.desc);
  }
}

export async function rollMeleeAttack(attack: MeleeAttack, actor: Actor) {
  await GURPS.performAction(
    {
      isMelee: true,
      name: getFullName(attack),
      type: 'attack',
    },
    actor,
  );
  return GURPS.lastTargetedRoll;
}

export async function rollRangedAttack(attack: MeleeAttack, actor: Actor) {
  await GURPS.performAction(
    {
      isRanged: true,
      name: getFullName(attack),
      type: 'attack',
    },
    actor,
  );
  return GURPS.lastTargetedRoll;
}
