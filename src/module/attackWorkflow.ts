import DefenseChooser from './applications/defenseChooser';
import { Attack, GurpsRoll, MeleeAttack, Modifier, RangedAttack } from './types';
import { applyModifiers } from './util/actions';
import { MODULE_NAME } from './util/constants';
import { ensureDefined, getBulk, getFullName, getManeuver, getTargets, setTargets } from './util/miscellaneous';

export async function rollAttack(actor: Actor, attack: Attack, type: 'melee' | 'ranged'): Promise<GurpsRoll> {
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
  Hooks.once('renderChatMessage', () => {
    ensureDefined(game.user, 'game not initialized');
    setTargets(game.user, oldTargets);
  });
  return GURPS.performAction({
    type: 'damage',
    formula: damage.formula,
    damagetype: damage.type,
    extdamagetype: damage.extra,
  });
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
    const defenceSuccess = await DefenseChooser.requestDefense(target, modifiers.defense);
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
  token: Token,
  target: Token,
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
  ensureDefined(token.actor, 'token without actor');
  switch (getManeuver(token.actor)) {
    case 'move_and_attack':
      modifiers.attack.push({ mod: -4, desc: 'Move and Attack *Max:9' });
      break;
    case 'aoa_determined':
      modifiers.attack.push({ mod: 4, desc: 'determined' });
      break;
    case 'aoa_strong':
      modifiers.damage.push({ mod: 2, desc: 'strong' });
  }
  const lastFeint = <{ successMargin: number; targetId: string; round: number } | undefined>(
    token.document.getFlag(MODULE_NAME, 'lastFeint')
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
  token: Token,
  target: Token,
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
  ensureDefined(token.actor, 'token without actor');
  switch (getManeuver(token.actor)) {
    case 'move_and_attack':
      modifiers.attack.push({ mod: getBulk(attack), desc: 'Move and Attack *Max:9' });
      break;
    case 'aoa_determined':
      modifiers.attack.push({ mod: 1, desc: 'determined' });
      break;
  }
  return modifiers;
}
