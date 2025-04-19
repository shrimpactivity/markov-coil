/** Returns a random item from the given non-empty list. */
export function sample<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}