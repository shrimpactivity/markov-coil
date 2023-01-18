/**
 * A class for providing suggestions based on a sequence of seed values. 
 */
class SuggestionMachine {
  /**
   * Create a suggestion machine.
   * @param {*[]} seed An array of primitive values. 
   */
  constructor(seed) {
    this.values = seed ? seed : []; 
    this.occurrences = this.#generateOccurrences(seed);
  }
  
  /**
   * Returns an occurrence map of value: indexes for the given list of values.
   * @param {*[]} values An array of primitive values.  
   * @returns {Object}
   */
  #generateOccurrences(values) {
    const result = {};
    if (!values) return result;
    for (let i = 0; i < this.values.length - 1; i += 1) {
      const value = this.values[i];
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
    return this.#getIndexes(value).map(i => i + 1).filter(i => i < this.values.length);
  }

  /**
   * Returns a random value from the seed values. 
   * @param {boolean} [weighted=false] If true, values that appear more frequently are more likely to be returned.   
   * @returns {*}
   */
  randomSuggestion(weighted=false) {
    if (weighted) {
      return this.values[Math.floor(Math.random() * this.values.length)];
    }
    const values = Object.keys(this.occurrences);
    return values[Math.floor(Math.random() * values.length)];
  }

  /**
   * Returns an array of possible suggestions for the specified predecessors. 
   * @param {*[]} predecessors A sequence of values, must be same type as seed values. 
   * @param {boolean} [allowDuplicateSuggestions=false] If true, duplicates of the same suggestion will appear in the result based on how many times they occur. 
   * @returns {*[]} An array of suggested values.
   */
  getAllSuggestionsFor(predecessors, allowDuplicateSuggestions=false) {
    let candidateIndexes = [];
    for (let predecessor of predecessors) {
      if (candidateIndexes.length === 0) {
        candidateIndexes = this.#getWeakAdjacentIndexes(predecessor);
      }
      else {
        const newCandidateIndexes = [];
        for (let index of candidateIndexes) {
          if (predecessor === this.values[index] && index < this.values.length - 1) {
            newCandidateIndexes.push(index + 1);
          } 
        }
        candidateIndexes = newCandidateIndexes;
      }
    }

    const candidates = candidateIndexes.map(i => this.values[i]);
    if (allowDuplicateSuggestions) {
      return candidates;
    }
    return candidates.filter((candidate, arrIndex) => candidates.indexOf(candidate) === arrIndex);
  }

  /**
   * Returns a suggestion for the specified predecessors. 
   * @param {*[]} predecessors A sequence of values, must be same type as seed values. 
   * @param {boolean} [weighted=false] If true, the choice of suggestion will be weighted by frequency. 
   * @returns {*} The suggested value.
   */
  suggestFor(predecessors, weighted=false) {
    const candidates = this.getAllSuggestionsFor(predecessors, weighted);
    if (candidates.length === 0) {
      return this.randomSuggestion(weighted);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
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
