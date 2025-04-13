
interface MarkovinatorOptions {
  excludeSpecialChars?: boolean;
}

class Markovinator {
  /**
   * Create new text suggestion Markovinator from seed text.
   * @param {string} seed The text seed.
   * @param options Options for text suggestion.
   * @param options.excludeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor (seed: string, options?: MarkovinatorOptions) {
    /*
    - Tokenize text
    - Add tokens to dictionary, and then to chain
    */
  }
}