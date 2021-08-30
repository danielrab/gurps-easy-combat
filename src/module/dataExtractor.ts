import { MeleeAttack, NestedDict, RangedAttack } from './types';

export function getAttacks(actor: Actor): { melee: NestedDict<MeleeAttack>; ranged: NestedDict<RangedAttack> } {
  const melee = Object.values(actor.data.data.melee);
  const ranged = Object.values(actor.data.data.ranged);
  const meleeByName: NestedDict<MeleeAttack> = {};
  const rangedByName: NestedDict<RangedAttack> = {};
  for (const attack of melee) {
    if (!meleeByName[attack.name]) meleeByName[attack.name] = {};
    meleeByName[attack.name][attack.mode] = attack;
  }
  for (const attack of ranged) {
    if (!rangedByName[attack.name]) rangedByName[attack.name] = {};
    rangedByName[attack.name][attack.mode] = attack;
  }
  return { melee: meleeByName, ranged: rangedByName };
}
