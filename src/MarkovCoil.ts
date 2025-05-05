import { sample } from "./util/random";

/**
 * NOTES:
 * Since you're encoding a chain of depth 0 1 ... n all at once,
 * it makes more sense to include lesser chain depths as subsets of the deepest one,
 * rather than creating a new branch for each chain?
 * 
 * the quick brown fox
 * 
 * the-quick -> brown: 1
 * quick-brown -> fox: 1
 * the -> quick: 1
 * quick -> brown: 1
 * brown -> fox: 1 
 * "" -> the: 1, quick: 1, brown: 1, fox: 1
 * 
 * vs. 
 * 
 * the -> 1
 *     -> quick -> 1
 *              -> brown -> 1
 *                       -> fox -> 1
 * 
 *              -> 
 * 
 */

interface MarkovOptions {
  depth?: number;
  includeSpecialChars?: boolean;
}

interface MarkovVocab {
  tokens: string[];
  tokenIndex: Map<string, number>;
}

// Map indexed state key (eg. "0-1-2") to next token index and weight (eg. 3 => 1)
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
   * @param {string[]} corpus List of string tokens to generate chain with.
   * @param {MarkovCoilOptions=} options Options for text suggestion.
   * @param options.includeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor(corpus: string[], options?: MarkovOptions) {
    this.options = { ...defaultOptions, ...options };
    this.generate(corpus);
  }

  addTokenToVocab(token: string) {
    const id = this.vocab.tokenIndex.get(token);
    if (id === undefined) {
      this.vocab.tokens.push(token);
      this.vocab.tokenIndex.set(token, this.vocab.tokens.length - 1);
    }
  }

  getStateKey(tokens: string[]) {
    if (!tokens.length) return "";
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

  generate(tokens: string[]) {
    tokens.forEach(token => {
      this.addTokenToVocab(token);
    })

    for (let i = 0; i < tokens.length; i += 1) {
      const state = tokens.slice(i, i + this.options.depth);
      const nextToken = tokens[i + this.options.depth];
      this.addToChain(state, nextToken)
    }
  }

  nextFor(context: string[], weighted: boolean = true) {
    if (context.length === 0) {
      return sample(this.vocab.tokens);
    }
  }
}
