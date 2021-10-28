import DefenseChooser from './applications/defenseChooser';
import { Attack, GurpsRoll, MeleeAttack, Modifier, RangedAttack } from './types';
import { applyModifiers } from './util/actions';
import { ensureDefined, getBulk, getFullName, getTargets, setTargets } from './util/miscellaneous';

async function rollAttack(actor: Actor, attack: Attack, type: 'melee' | 'ranged'): Promise<GurpsRoll> {
  await GURPS.performAction(
    {
      isMelee: type === 'melee',
      isRanged: type === 'ranged',
      name: getFullName(attack),
      type: 'attack',
    },
    actor,
  );
  return GURPS.lastTargetedRoll;
}

async function rollDamage(
  damage: { formula: string; type: string; extra: string },
  target: Token,
  modifiers: Modifier[] = [],
) {
  ensureDefined(game.user, 'game not initialized');
  applyModifiers(modifiers);
  const oldTargets = getTargets(game.user);
  setTargets(game.user, [target]);
  await GURPS.performAction({
    type: 'damage',
    formula: damage.formula,
    damagetype: damage.type,
    extdamagetype: damage.extra,
  });
  setTargets(game.user, oldTargets);
}

export async function makeAttackInner(
  attacker: Actor,
  target: Token,
  attack: MeleeAttack | RangedAttack,
  type: 'melee' | 'ranged',
  modifiers: {
    attack: Modifier[];
    defense: Modifier[];
    damage: Modifier[];
  },
): Promise<void> {
  if (!target.actor) {
    ui.notifications?.error('target has no actor');
    return;
  }
  applyModifiers(modifiers.attack);
  const roll = await rollAttack(attacker, attack, type);
  if (roll.failure) return;
  if (!roll.isCritSuccess) {
    const defenceSuccess = await DefenseChooser.requestDefense(target.actor, modifiers.defense);
    if (defenceSuccess) {
      return;
    }
  }
  const damageParts = attack.damage.split(' ');
  const damage = { formula: damageParts[0], type: damageParts[1], extra: damageParts[2] };
  await rollDamage(damage, target, modifiers.damage);
}

export function getMeleeModifiers(
  attack: MeleeAttack,
  data: { maneuver: string; isMoving: boolean },
): {
  attack: Modifier[];
  defense: Modifier[];
  damage: Modifier[];
} {
  const modifiers = {
    attack: <Modifier[]>[],
    defense: <Modifier[]>[],
    damage: <Modifier[]>[],
  };
  if (data.isMoving) {
    modifiers.attack.push({ mod: -4, desc: 'Move and Attack *Max:9' });
  }
  return modifiers;
}

export function getRangedModifiers(
  attack: RangedAttack,
  data: { maneuver: string; isMoving: boolean },
): {
  attack: Modifier[];
  defense: Modifier[];
  damage: Modifier[];
} {
  const modifiers = {
    attack: <Modifier[]>[],
    defense: <Modifier[]>[],
    damage: <Modifier[]>[],
  };
  if (data.isMoving) {
    modifiers.attack.push({ mod: getBulk(attack), desc: 'Move and Attack *Max:9' });
  }
  return modifiers;
}
