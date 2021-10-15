import { getBlocks, getDodge, getParries } from './dataExtractor';
import { GurpsRoll, MeleeAttack, RangedAttack } from './types';

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
  attackModifiers: { vallue: number; description: string }[] = [],
  damageModifiers: { vallue: number; description: string }[] = [],
): Promise<void> {
  GURPS.SetLastActor(attacker);
  for (const modifier of attackModifiers) {
    await GURPS.executeOTF(`${modifier.vallue} ${modifier.description}`);
  }
  const type = 'reach' in attack ? 'melee' : 'ranged';
  const roll = await rollAttack(attacker, attack.name, attack.mode, type);
  if (roll.failure) return;
  if (!roll.isCritSuccess) {
    let defenceSuccess;
    try {
      defenceSuccess = await requestDefense(target.actor!);
    } catch (error) {
      defenceSuccess = false; // if all the dialogs are closed show the damage as if attack successful.
    }
    if (defenceSuccess) {
      return;
    }
  }
  await rollDamage(attack.damage, target.actor!, damageModifiers);
}

async function requestDefense(target: Actor) {
  const actionId = foundry.utils.randomID();
  const result = await Promise.any(
    game
      .users!.filter((user) => target.testUserPermission(user, 'OWNER'))
      .map((user) => EasyCombat.socket.executeAsUser('useDefense', user.id, target.id, actionId)),
  );
  EasyCombat.socket.executeForEveryone('closeDefenceDialog', actionId);
  return result;
}

async function rollDamage(damage: string, target: Actor, modifiers: { vallue: number; description: string }[] = []) {
  for (const modifier of modifiers) {
    await GURPS.executeOTF(`${modifier.vallue} ${modifier.description}`);
  }
  await GURPS.executeOTF(damage);
}

export async function useDefence(actorId: string, actionId: string): Promise<boolean> {
  const actor = game.actors!.get(actorId)!;
  console.log(getDodge(actor));
  console.log(getParries(actor));
  console.log(getBlocks(actor));
  const promise = new Promise<boolean>((resolve, reject) => {
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
        reject('closed');
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
