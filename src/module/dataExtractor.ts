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

export function getParries(actor: Actor): Record<string, number> {
  const parries: Record<string, number> = {};
  for (const attack of Object.values(actor.data.data.melee)) {
    const parry: number = parseInt(attack.parry);
    if (parry) parries[attack.name] = parry;
  }
  return parries;
}

export function getBlocks(actor: Actor): Record<string, number> {
  const blocks: Record<string, number> = {};
  for (const attack of Object.values(actor.data.data.melee)) {
    const block: number = parseInt(attack.parry);
    if (block) blocks[attack.name] = block; // Math.max takes care of multiple attacks per weapon.
  }
  return blocks;
}
