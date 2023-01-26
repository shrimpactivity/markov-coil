/**
 * A class for providing suggestions based on a sequence of seed values.
 */
class SuggestionMachine {
  /**
   * Create a suggestion machine.
   * @param {*[]} seedValues An array of primitive values.
   */
  constructor(seedValues) {
    this.values = seedValues ? seedValues : [];
    this.occurrences = this.#generateOccurrences(seedValues);
  }

  /**
   * Returns an occurrence map of value: indexes for the given list of values.
   * @param {*[]} values An array of primitive values.
   * @returns {Object}
   */
  #generateOccurrences(values) {
    const result = {};
    if (!values) return result;
    for (let i = 0; i < values.length; i += 1) {
      const value = values[i];
      if (!result[value]) result[value] = [];
      result[value].push(i);
    }
    return result;
  }

  /**
   * Returns all indexes where value occurs.
   * @param {*} value
   * @returns {number[]}
   */
  #getIndexes(value) {
    const indexes = this.occurrences[value];
    return indexes ? indexes : [];
  }

  /**
   * Returns the indexes of all values that are successors of the given value.
   * @param {*} value
   * @returns {number[]}
   */
  #getWeakAdjacentIndexes(value) {
    return this.#getIndexes(value)
      .map((i) => i + 1)
      .filter((i) => i < this.values.length);
  }

  /**
   * Returns the indexes of any seed values that immediately succeed a search index with the given value.
   * @param {number[]} indexesToSearch The indexes to search.
   * @param {*} value The value to search for.
   * @return {number[]} The indexes that contain the value.
   */
  #findStrongAdjacentIndexes(indexesToSearch, value) {
    const result = [];
    for (let index of indexesToSearch) {
      if (value === this.values[index] && index < this.values.length - 1) {
        result.push(index + 1);
      }
    }
    return result;
  }

  /**
   * Returns a new array with duplicate items removed.
   * @param {*[]} items
   * @return {number[]}
   */
  #removeDuplicates(items) {
    return items.filter((index, arrIndex) => items.indexOf(index) === arrIndex);
  }

  /**
   * Returns a random value from the seed values, or null if none were provided.
   * @param {boolean} [weighted=false] If true, values that appear more frequently are more likely to be returned.
   * @returns {*}
   */
  randomSuggestion(weighted = false) {
    if (this.values.length === 0) {
      return null;
    }
    if (weighted) {
      return this.values[Math.floor(Math.random() * this.values.length)];
    }
    const uniqueValues = this.#removeDuplicates(this.values);
    return uniqueValues[Math.floor(Math.random() * uniqueValues.length)];
  }

  /**
   * Returns an array of possible suggestions for the specified predecessors.
   * @param {*[]} predecessors A sequence of values, must be same type as seed values.
   * @param {boolean} [allowDuplicateSuggestions=false] If true, duplicates of the same suggestion will appear in the result based on how many times they occur.
   * @returns {*[]} An array of suggested values.
   */
  getAllSuggestionsFor(predecessors, allowDuplicateSuggestions = false) {
    let candidateIndexes = [];

    for (let predecessor of predecessors) {
      candidateIndexes = this.#findStrongAdjacentIndexes(
        candidateIndexes,
        predecessor
      );
      if (candidateIndexes.length === 0) {
        candidateIndexes = this.#getWeakAdjacentIndexes(predecessor);
      }
    }

    if (!allowDuplicateSuggestions) {
      return this.#removeDuplicates(candidateIndexes).map(
        (i) => this.values[i]
      );
    }
    return candidateIndexes.map((i) => this.values[i]);
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
    return possibleSuggestions[
      Math.floor(Math.random() * possibleSuggestions.length)
    ];
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
      let predecessorsToConsider = depth > 0
        ? predecessors.concat(result).slice(-1 * depth)
        : [];
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
