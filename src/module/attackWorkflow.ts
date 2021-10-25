import DefenseChooser from './applications/defenseChooser';
import { GurpsRoll, MeleeAttack, Modifier, RangedAttack } from './types';

async function rollAttack(actor: Actor, name: string, mode: string, type: 'melee' | 'ranged'): Promise<GurpsRoll> {
  const modeSuffix = mode !== '' ? ` (${mode})` : '';
  await GURPS.performAction(
    {
      isMelee: type === 'melee',
      isRanged: type === 'ranged',
      name: `${name}${modeSuffix}`,
      type: 'attack',
    },
    actor,
  );
  return GURPS.lastTargetedRoll;
}

export async function makeAttack(
  attacker: Actor,
  target: Token,
  attack: MeleeAttack | RangedAttack,
  attackModifiers: Modifier[],
  damageModifiers: Modifier[],
  defenseModifiers: Modifier[],
): Promise<void> {
  if (!target.actor) {
    ui.notifications?.error('target actor is null');
    return;
  }
  for (const modifier of attackModifiers) {
    GURPS.ModifierBucket.addModifier(modifier.mod, modifier.desc);
  }
  const type = 'reach' in attack ? 'melee' : 'ranged';
  const roll = await rollAttack(attacker, attack.name, attack.mode, type);
  if (roll.failure) return;
  if (!roll.isCritSuccess) {
    const defenceSuccess = await DefenseChooser.requestDefense(target.actor, defenseModifiers);
    if (defenceSuccess) {
      return;
    }
  }
  const damageParts = attack.damage.split(' ');
  const damage = { formula: damageParts[0], type: damageParts[1], extra: damageParts[2] };
  await rollDamage(damage, target.actor, damageModifiers);
}

async function rollDamage(
  damage: { formula: string; type: string; extra: string },
  target: Actor,
  modifiers: Modifier[] = [],
) {
  for (const modifier of modifiers) {
    GURPS.ModifierBucket.addModifier(modifier.mod, modifier.desc);
  }
  await GURPS.performAction({
    type: 'damage',
    formula: damage.formula,
    damagetype: damage.type,
    extdamagetype: damage.extra,
  });
}
