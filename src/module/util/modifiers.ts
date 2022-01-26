import { MeleeAttack, Modifier, RangedAttack } from '../types/types';
import { MODULE_NAME } from '../data/constants';
import { ensureDefined, getBulk, getManeuver } from './miscellaneous';

type attackType = {
  melee: MeleeAttack;
  ranged: RangedAttack;
};
type modifierType = 'attack' | 'damage' | 'defense';

type unresolvedModifier<T extends ValueOf<attackType>> =
  | Modifier
  | ((data: { attack: T; attacker: Token; target: Token }) => Modifier);

const maneuverAttackModifiers: {
  [T in keyof attackType]: Record<string, { [U in modifierType]?: unresolvedModifier<attackType[T]>[] }>;
} = {
  melee: {
    move_and_attack: {
      attack: [{ mod: -4, desc: 'Move and Attack *Max:9' }],
    },
    aoa_determined: {
      attack: [{ mod: 4, desc: 'determined' }],
    },
    aoa_strong: {
      damage: [{ mod: 2, desc: 'strong' }],
    },
  },
  ranged: {
    move_and_attack: {
      attack: [({ attack }) => ({ mod: -getBulk(attack), desc: 'Move and Attack' })],
    },
    aoa_determined: {
      attack: [{ mod: 1, desc: 'determined' }],
    },
  },
};

type AttackModifiers = Record<modifierType, Modifier[]>;
type unresolvedAttackModifiers<T extends ValueOf<attackType>> = Record<modifierType, unresolvedModifier<T>[]>;

function mergeModifiers(mods1: AttackModifiers, mods2: Partial<AttackModifiers>): AttackModifiers {
  return {
    attack: mods1.attack.concat(...(mods2.attack ?? [])),
    defense: mods1.defense.concat(...(mods2.defense ?? [])),
    damage: mods1.damage.concat(...(mods2.damage ?? [])),
  };
}

function resolveModifiers<T extends ValueOf<attackType>>(
  data: { attack: T; attacker: Token; target: Token },
  modifiers: unresolvedModifier<T>[],
): Modifier[] {
  return modifiers.map((m) => (m instanceof Function ? m(data) : m));
}

function resolveAttackModifiers<T extends ValueOf<attackType>>(
  data: { attack: T; attacker: Token; target: Token },
  modifiers: Partial<unresolvedAttackModifiers<T>>,
): Partial<AttackModifiers> {
  return Object.fromEntries(
    Object.entries(modifiers).map(([key, modifiers]) => [key, resolveModifiers(data, modifiers)]),
  );
}

export function getMeleeModifiers(attack: MeleeAttack, attacker: Token, target: Token): AttackModifiers {
  let modifiers = {
    attack: <Modifier[]>[],
    defense: <Modifier[]>[],
    damage: <Modifier[]>[],
  };
  ensureDefined(attacker.actor, 'token without actor');
  const rawModifiers = maneuverAttackModifiers.melee[getManeuver(attacker.actor)];
  if (rawModifiers) {
    modifiers = mergeModifiers(modifiers, resolveAttackModifiers({ attack, attacker, target }, rawModifiers));
  }
  const lastFeint = <{ successMargin: number; targetId: string; round: number } | undefined>(
    attacker.document.getFlag(MODULE_NAME, 'lastFeint')
  );
  if (
    lastFeint &&
    lastFeint.targetId === target.id &&
    lastFeint.round - (game.combat?.round ?? 0) <= 1 &&
    lastFeint.successMargin > 0
  ) {
    modifiers.defense.push({ mod: -lastFeint.successMargin, desc: 'feint' });
  }
  return modifiers;
}

export function getRangedModifiers(
  attack: RangedAttack,
  attacker: Token,
  target: Token,
): {
  attack: Modifier[];
  defense: Modifier[];
  damage: Modifier[];
} {
  let modifiers = {
    attack: <Modifier[]>[],
    defense: <Modifier[]>[],
    damage: <Modifier[]>[],
  };
  ensureDefined(attacker.actor, 'token without actor');
  const rawModifiers = maneuverAttackModifiers.ranged[getManeuver(attacker.actor)];
  if (rawModifiers) {
    modifiers = mergeModifiers(modifiers, resolveAttackModifiers({ attack, attacker, target }, rawModifiers));
  }
  return modifiers;
}
