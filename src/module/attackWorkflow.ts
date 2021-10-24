import { getBlocks, getDodge, getParries } from './dataExtractor';
import { GurpsRoll, MeleeAttack, Modifier, RangedAttack } from './types';
import { smartRace, isDefined } from './util';

const activeDefenceDialogs: Record<string, Dialog> = {};

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
  attackModifiers: Modifier[] = [],
  damageModifiers: Modifier[] = [],
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
    const defenceSuccess = await requestDefense(target.actor);
    if (defenceSuccess) {
      return;
    }
  }
  const damageParts = attack.damage.split(' ');
  const damage = { formula: damageParts[0], type: damageParts[1], extra: damageParts[2] };
  await rollDamage(damage, target.actor, damageModifiers);
}

async function requestDefense(target: Actor) {
  const actionId = foundry.utils.randomID();
  const users = game.users;
  if (!users) {
    ui.notifications?.error('game not initialized');
    throw new Error('game not initialized');
  }
  const result = await smartRace(
    users
      .filter((user) => target.testUserPermission(user, 'OWNER'))
      .map(async (user) => {
        if (!user.id) {
          ui.notifications?.error('user without id');
          throw new Error('user without id');
        }
        if (!target.id) {
          ui.notifications?.error('target without id');
          throw new Error('target without id');
        }
        return EasyCombat.socket.executeAsUser('useDefense', user.id, target.id, actionId);
      }),
    { allowRejects: false, default: false, filter: isDefined },
  );
  EasyCombat.socket.executeForEveryone('closeDefenceDialog', actionId);
  return result;
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

export async function useDefense(actorId: string, actionId: string): Promise<boolean | undefined> {
  if (!game.actors) {
    ui.notifications?.error('game not initialized');
    throw new Error('game not initialized');
  }
  const actor = game.actors.get(actorId, { strict: true });
  console.log(getDodge(actor));
  console.log(getParries(actor));
  console.log(getBlocks(actor));
  const promise = new Promise<boolean | undefined>((resolve, reject) => {
    const dialog = new Dialog({
      title: `did ${actor.name} defend successfully?`,
      buttons: {
        yes: {
          callback: () => {
            resolve(true);
            ChatMessage.create({ content: `${actor.name} defended successfully` });
          },
          label: 'yes',
        },
        no: {
          callback: () => {
            resolve(false);
            ChatMessage.create({ content: `${actor.name} failed to defend` });
          },
          label: 'no',
        },
      },
      close: () => {
        resolve(undefined);
      },
      content: ``,
      default: 'yes',
    });
    dialog.render(true);
    activeDefenceDialogs[actionId] = dialog;
  });
  return promise;
}

export function closeDefenceDialog(actionId: string): void {
  if (activeDefenceDialogs[actionId]) {
    activeDefenceDialogs[actionId].close();
    delete activeDefenceDialogs[actionId];
  }
}
