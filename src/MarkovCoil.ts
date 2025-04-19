
interface MarkovOptions {
  depth?: number;
  includeSpecialChars?: boolean;
}

interface MarkovVocab {
  idToToken: string[];
  tokenToId: Map<string, number>;
}

const defaultOptions: Required<MarkovOptions> = {
  depth: 3,
  includeSpecialChars: false,
}

export default class MarkovCoil {
  private options: Required<MarkovOptions>;
  vocab: MarkovVocab = {
    idToToken: [],
    tokenToId: new Map<string, number>(),
  };
  chain = new Map<string, number>();
  

  /**
   * Create new text suggestion Markovinator from seed text.
   * @param {string} corpus The text seed.
   * @param {MarkovCoilOptions=} options Options for text suggestion.
   * @param options.includeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor (corpus: string, options?: MarkovOptions) {
    this.options = { ...defaultOptions, ...options }
    this.generate(corpus);
  }

  tokenize(text: string) {
    const trimmed = text.replace(/\s+/g, ' ').trim().toLowerCase();
    return trimmed.split(' ');
  }

  addTokenToVocab(token: string) {
    const id = this.vocab.tokenToId.get(token);
    if (id === undefined) {
      this.vocab.idToToken.push(token);
      this.vocab.tokenToId.set(token, this.vocab.idToToken.length - 1);
    }
  }

  generate(corpus: string) {
    const tokens = this.tokenize(corpus)
    tokens.forEach((token, index) => {
      this.addTokenToVocab(token)
      const context = tokens.slice(index - this.options.depth + 1, index);
    })
  }

  nextFor(context: string|string[], weighted: boolean = true) {
    if (typeof context === "string") {
      context = this.tokenize(context);
    }
  }

  
}