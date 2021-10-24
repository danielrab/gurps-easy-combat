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
