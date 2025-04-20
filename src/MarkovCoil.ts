import { sample } from "./util/random";

interface MarkovOptions {
  depth?: number;
  includeSpecialChars?: boolean;
}

interface MarkovVocab {
  tokens: string[];
  tokenIndex: Map<string, number>;
}

type MarkovChain = Map<string, Map<number, number>>;

const defaultOptions: Required<MarkovOptions> = {
  depth: 3,
  includeSpecialChars: false,
};

export default class MarkovCoil {
  options: Required<MarkovOptions>;
  vocab: MarkovVocab = {
    tokens: [],
    tokenIndex: new Map<string, number>(),
  };
  chain: MarkovChain = new Map<string, Map<number, number>>();

  /**
   * Create new text suggestion Markovinator from seed text.
   * @param {string|string[]} corpus Accepts either a string (which will use default tokenizer with options), or a custom token list.
   * @param {MarkovCoilOptions=} options Options for text suggestion.
   * @param options.includeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor(corpus: string | string[], options?: MarkovOptions) {
    this.options = { ...defaultOptions, ...options };
    this.generate(corpus);
  }

  tokenize(text: string) {
    const trimmed = text.replace(/\s+/g, " ").trim().toLowerCase();
    return trimmed.split(" ");
  }

  addTokenToVocab(token: string) {
    const id = this.vocab.tokenIndex.get(token);
    if (id === undefined) {
      this.vocab.tokens.push(token);
      this.vocab.tokenIndex.set(token, this.vocab.tokens.length - 1);
    }
  }

  getStateKey(tokens: string[]) {
    return tokens
      .map((token) => this.vocab.tokenIndex.get(token))
      .join("-");
  }

  addToChain(state: string[], nextToken: string) {
    if (!state || nextToken === undefined) return;
    for (let i = 0; i < state.length; i += 1) {
      const stateKey = this.getStateKey(state.slice(0, i));

      if (!this.chain.has(stateKey)) {
        this.chain.set(stateKey, new Map<number, number>());
      }

      const nextTokenIndex = this.vocab.tokenIndex.get(nextToken)!;
      const nextMap = this.chain.get(stateKey)!;
      const nextWeight = nextMap.get(nextTokenIndex);
      nextMap.set(nextTokenIndex, (nextWeight || 0) + 1)
    }
  }

  generate(corpus: string | string[]) {
    let tokens: string[];
    if (typeof corpus === "string") {
      tokens = this.tokenize(corpus);
    } else {
      tokens = corpus;
    }

    tokens.forEach(token => {
      this.addTokenToVocab(token);
    })

    for (let i = 0; i < tokens.length; i += 1) {
      const state = tokens.slice(i, i + this.options.depth);
      const nextToken = tokens[i + this.options.depth];
      this.addToChain(state, nextToken)
    }
  }

  nextFor(context: string | string[], weighted: boolean = true) {
    if (typeof context === "string") {
      context = this.tokenize(context);
    }
    if (context.length === 0) {
      return sample(this.vocab.tokens);
    }
  }
}
