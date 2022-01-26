import DefenseChooser from './applications/defenseChooser';
import { Attack, GurpsRoll, MeleeAttack, Modifier, RangedAttack } from './types/types';
import { applyModifiers } from './util/actions';
import { MODULE_NAME } from './data/constants';
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

export async function rollDamage(
  damage: { formula: string; type: string; extra: string },
  target: Token,
  modifiers: Modifier[] = [],
): Promise<boolean> {
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
