import { DATA_FOLDER } from '../data/constants';
import { Attack, RangedAttack } from '../types/types';

export async function smartRace<S extends T, T>(
  promises: Promise<T>[],
  options: { default?: S; allowRejects?: boolean; filter: (value: T) => value is S },
): Promise<S> {
  if (promises.length === 0) {
    if (options.default !== undefined) {
      return options.default;
    }
    throw new Error('the list of promises is empty and no default is provided');
  }
  let resolvedOrRejected = 0;
  const resultPromise = new Promise<T>((resolve, reject) => {
    for (const promise of promises) {
      promise
        .then((result) => {
          resolvedOrRejected += 1;
          if (!options.filter || options.filter(result)) resolve(result);
          if (resolvedOrRejected >= promises.length) {
            if (options.default !== undefined) resolve(options.default);
            reject(new Error('no promise resolved with acceptable values'));
          }
        })
        .catch((reason) => {
          resolvedOrRejected += 1;
          if (!options.allowRejects) reject(reason);
          if (resolvedOrRejected >= promises.length) {
            if (options.default !== undefined) resolve(options.default);
            reject(new Error('no promise resolved with acceptable values'));
          }
        });
    }
  });
  const result = await resultPromise;
  if (options.filter(result)) {
    return result;
  }
  throw new Error('result not passing filter');
}

export function isDefined<T>(value: T | undefined): value is T {
  if (value === undefined) return false;
  return true;
}

function getPriority(user: User, actor: Actor): number {
  let priority = 0;
  if (user.character === actor) priority += 100;
  if (actor.testUserPermission(user, 'OWNER')) priority += 10;
  if (user.isGM) priority -= 1;
  if (!user.active) priority -= 1000;
  return priority;
}

export function ensureDefined<T>(value: T | undefined | null, message: string): asserts value is T {
  if (value === undefined || value === null) {
    ui.notifications?.error(message);
    throw new Error(message);
  }
}

export function highestPriorityUsers(actor: Actor): User[] {
  ensureDefined(game.users, 'game not initialized');
  const priorities = new Map(game.users.map((user) => [user, getPriority(user, actor)]));
  const maxPriority = Math.max(...priorities.values());
  return game.users.filter((user) => priorities.get(user) === maxPriority);
}

export function getTargets(user: User): Token[] {
  return [...user.targets.values()];
}

export function setTargets(user: User, targets: Token[]): void {
  user.updateTokenTargets(targets.map((t) => t.id));
}

export function activateChooser(html: JQuery, id: string, callback: (index: number) => void): void {
  html.on('click', `#${id} tr.clickable`, (event) => {
    const element = $(event.currentTarget);
    const indexString = element.attr('index');
    if (!indexString) {
      ui.notifications?.error('no index on clicked element');
      throw new Error('no index on clicked element');
    }
    callback(parseInt(indexString));
  });
}

export function getFullName(attack: Attack): string {
  const modeSuffix = attack.mode !== '' ? ` (${attack.mode})` : '';
  return `${attack.name}${modeSuffix}`;
}

export function getBulk(attack: RangedAttack): number {
  let bulk = parseInt(attack.bulk);
  if (isNaN(bulk) || bulk < 2) bulk = 2;
  return bulk;
}

export function getManeuver(actor: Actor): string {
  const maneuversEffects = GURPS.Maneuvers.getActiveEffectManeuvers(actor.effects);
  if (!maneuversEffects || maneuversEffects.length === 0) {
    ui.notifications?.error('no maneuver found');
    console.error(new Error('no maneuver found'));
    return 'do_nothing';
  }
  if (maneuversEffects.length > 1) {
    ui.notifications?.error('more than one maneuver found');
    console.error(new Error('more than one maneuver found'));
  }
  const maneuver = maneuversEffects[0].data.flags.gurps.name;
  return maneuver;
}

export function checkSingleTarget(user: User): boolean {
  if (user.targets.size === 0) {
    ui.notifications?.warn('you must select a target');
    return false;
  }
  if (user.targets.size > 1) {
    ui.notifications?.warn('you must select only one target');
    return false;
  }
  return true;
}

export function getToken(sceneId: string, tokenId: string): Token {
  const scene = game.scenes?.get(sceneId);
  ensureDefined(scene, `can't finds scene with id ${sceneId}`);
  const tokenDocument = scene.tokens.get(tokenId);
  ensureDefined(tokenDocument, `can't find token document with id ${tokenId} on scene with id ${sceneId}`);
  const token = tokenDocument.object as Token;
  ensureDefined(token, `token document with id ${tokenId} on scene with id ${sceneId} doesn't have object attached`);
  return token;
}

export async function readData(jsonName: string) {
  const file = await fetch(`${DATA_FOLDER}/${jsonName}`);
  const text = await file.text();
  return JSON.parse(text);
}
