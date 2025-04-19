
interface MarkovCoilOptions {
  depth?: number;
  excludeSpecialChars?: boolean;
}

class MarkovCoil {
  idToToken: string[] = [];
  tokenToId: Map<string, number> = new Map();
  chain = {};
  options;

  /**
   * Create new text suggestion Markovinator from seed text.
   * @param {string} corpus The text seed.
   * @param {number=} depth The chain depth. Default is three.
   * @param {MarkovCoilOptions=} options Options for text suggestion.
   * @param options.excludeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor (corpus: string, options?: MarkovCoilOptions) {
    this.options = options || {};
    this.options.depth = this.options.depth || 3;
    this.generateChain(corpus);
    /*
    - Tokenize text
    - Add tokens to dictionary, and then to chain
    */
  }

  tokenize(text: string) {
    const trimmedOfWhitespace = text.replace(/\s+/g, ' ').trim();
    return trimmedOfWhitespace.split(' ');
  }

  addTokenToVocab(token: string) {
    const id = this.tokenToId.get(token);
    if (id === undefined) {
      this.idToToken.push(token);
      this.tokenToId.set(token, this.idToToken.length - 1);
    }
  }

  generateChain(corpus: string) {
    const tokens = this.tokenize(corpus)
    tokens.forEach(token => {
      this.addTokenToVocab(token)

    })
  }

  
  suggest(context: string[], weighted: boolean = true) {

  }

  
}