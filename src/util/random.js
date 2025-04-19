/** Returns a random item from the given non-empty list. */
const sample = (list) => {
  return list[Math.floor(Math.random() * list.length)];
}

module.exports = randomChoice;