import { MeleeAttack, RangedAttack } from './types';
import { getFullName } from './util/miscellaneous';

export function getAttacks(actor: Actor): { melee: MeleeAttack[]; ranged: RangedAttack[] } {
  const melee = Object.values(actor.data.data.melee);
  const ranged = Object.values(actor.data.data.ranged);
  return { melee, ranged };
}

export function getParries(actor: Actor): Record<string, number> {
  const parries: Record<string, number> = {};
  for (const attack of Object.values(actor.data.data.melee)) {
    const parry: number = parseInt(attack.parry);
    if (parry) parries[getFullName(attack)] = parry;
  }
  return parries;
}

export function getBlocks(actor: Actor): Record<string, number> {
  const blocks: Record<string, number> = {};
  for (const attack of Object.values(actor.data.data.melee)) {
    const block: number = parseInt(attack.block);
    if (block) blocks[getFullName(attack)] = block;
  }
  return blocks;
}

export function getDodge(actor: Actor): number {
  return actor.data.data.currentdodge;
}
