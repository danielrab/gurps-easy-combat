import { MeleeAttack, RangedAttack } from './types';

export function getAttacks(actor: Actor): { melee: MeleeAttack[]; ranged: RangedAttack[] } {
  const melee = Object.values(actor.data.data.melee);
  const ranged = Object.values(actor.data.data.ranged);
  return { melee, ranged };
}

export function getParries(actor: Actor): Record<string, number> {
  const parries: Record<string, number> = {};
  for (const attack of Object.values(actor.data.data.melee)) {
    const modeSuffix = attack.mode !== '' ? ` (${attack.mode})` : '';
    const parry: number = parseInt(attack.parry);
    if (parry) parries[`${attack.name}${modeSuffix}`] = parry;
  }
  return parries;
}

export function getBlocks(actor: Actor): Record<string, number> {
  const blocks: Record<string, number> = {};
  for (const attack of Object.values(actor.data.data.melee)) {
    const modeSuffix = attack.mode !== '' ? ` (${attack.mode})` : '';
    const block: number = parseInt(attack.block);
    if (block) blocks[`${attack.name}${modeSuffix}`] = block; // Math.max takes care of multiple attacks per weapon.
  }
  return blocks;
}

export function getDodge(actor: Actor): number {
  return actor.data.data.currentdodge;
}
