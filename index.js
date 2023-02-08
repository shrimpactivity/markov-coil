const randomChoice = require('./util/randomChoice');

/**
 * A class for providing suggestions based on a sequence of seed values.
 */
class SuggestionMachine {
  /**
   * Create a suggestion machine.
   * @param {*[]} items An array of primitive values.
   */
  constructor(sequence) {
    this.values = sequence;
    this.weakAdjacencies = this.#generateWeakAdjacencies(sequence);
  }

  /**
   * Returns an occurrence map of value: indexes for the given list of values.
   * @param {*[]} values An array of primitive values.
   * @returns {Object}
   */
  #generateWeakAdjacencies(values) {
    const result = {};
    for (let i = 0; i < values.length - 1; i += 1) {
      const value = values[i];
      if (!result[value]) result[value] = [];
      result[value].push(i + 1);
    }
    return result;
  }

  /**
   * Returns the indexes of values weakly adjacent to the given value.
   * @param {*} value
   * @returns {number[]}
   */
  #getWeaklyAdjacentIndexes(value) {
    const adjacents = this.weakAdjacencies[value];
    if (!adjacents) {
      return [];
    }
    return adjacents;
  }

  /**
   * Returns the strongly adjacent indexes of any search index that has the provided value.
   * @param {*} value The value to search for.
   * @param {number[]} indexesToSearch The indexes to search.
   * @return {number[]} The adjacent indexes.
   */
  #getStronglyAdjacentIndexes(value, indexesToSearch) {
    const result = [];
    for (let index of indexesToSearch) {
      if (this.values[index] === value && index < this.values.length - 1) {
        result.push(index + 1);
      }
    }
    return result;
  }

  #getUniqueValues() {
    const uniques = Object.keys(this.weakAdjacencies);
    if (this.values.length > 0) {
      uniques.push(this.values[this.values.length - 1]);
    }
    return uniques;
  }

  /**
   * Returns an array of possible suggestions for the specified predecessors.
   * @param {*[]} predecessors A sequence of values, must be same type as seed values.
   * @param {boolean} [allowDuplicates=false] If true, duplicates of the same suggestion will appear in the result.
   * @returns {*[]} An array of suggested values.
   */
  getAllSuggestionsFor(predecessors, allowDuplicates = false) {
    let candidateIndexes = [];

    for (let predecessor of predecessors) {
      candidateIndexes = this.#getStronglyAdjacentIndexes(
        predecessor,
        candidateIndexes
      );
      if (candidateIndexes.length === 0) {
        candidateIndexes = this.#getWeaklyAdjacentIndexes(predecessor);
      }
    }

    const candidateValues = candidateIndexes.map((i) => this.values[i]);
    if (!allowDuplicates) {
      const uniqueValues = new Set(candidateValues);
      return [...uniqueValues];
    }

    return candidateValues;
  }

  /**
   * Returns a random value from the seed values, or null if the seed values are empty.
   * @param {boolean} [weighted=false] If true, the choice of suggestion will be weighted by its frequency in the provided values.
   * @returns {*} A random value.
   */
  randomSuggestion(weighted = false) {
    if (this.values.length === 0) {
      return null;
    }

    if (weighted) {
      return randomChoice(this.values);
    }

    const uniqueValues = this.#getUniqueValues();
    return randomChoice(uniqueValues);
  }

  /**
   * Returns a suggestion for the specified predecessors, or null if no seed values were provided.
   * @param {*[]} predecessors A sequence of values, must be same type as seed values.
   * @param {boolean} [weighted=false] If true, the choice of suggestion will be weighted by frequency.
   * @returns {*} The suggested value.
   */
  suggestFor(predecessors, weighted = false) {
    const possibleSuggestions = this.getAllSuggestionsFor(
      predecessors,
      weighted
    );
    if (possibleSuggestions.length === 0) {
      return this.randomSuggestion(weighted);
    }
    return randomChoice(possibleSuggestions);
  }

  /**
   * Suggests a sequence of new values for the given predecessors.
   * @param {*[]} predecessors A sequence of values, must be same type as seed values.
   * @param {number} length The length of the returned sequence.
   * @param {number} [depth=3] The number of predecessors to consider for each new suggestion in the sequence.
   * @param {boolean} [weighted=false] If true, the choice of suggestion will be weighted by frequency.
   * @returns {*[]} The suggested sequence.
   */
  suggestSequenceFor(predecessors, length, depth = 3, weighted = false) {
    const result = [];
    for (let i = 0; i < length; i += 1) {
      let predecessorsToConsider =
        depth > 0 ? predecessors.concat(result).slice(-1 * depth) : [];
      result.push(this.suggestFor(predecessorsToConsider, weighted));
    }
    return result;
  }

  /**
   * Serializes this into a JSON string.
   * @returns {string}
   */
  toJSONString() {
    return JSON.stringify(this.values);
  }

  /**
   * Returns a new SuggestionMachine from the given JSON string.
   * @param {string} JSONString A string created with toJSONString()
   * @returns {SuggestionMachine}
   */
  static parseJSON(JSONString) {
    const values = JSON.parse(JSONString);
    return new SuggestionMachine(values);
  }
}

module.exports = SuggestionMachine;
