
interface MarkovCoilOptions {
  depth?: number;
  excludeSpecialChars?: boolean;
}

class MarkovCoil {
  /**
   * Create new text suggestion Markovinator from seed text.
   * @param {string} corpus The text seed.
   * @param options Options for text suggestion.
   * @param {number} depth The chain depth. Default is three.
   * @param options.excludeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor (corpus: string, options?: MarkovCoilOptions) {
    /*
    - Tokenize text
    - Add tokens to dictionary, and then to chain
    */
  }

  suggest(context: string[], weighted: boolean = true) {

  }
}