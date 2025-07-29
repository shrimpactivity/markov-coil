import { sample } from "./util/random";

/** 
 * Implementation:
 * depth 0 = 'no chain', every context spits out random word from corpus
 * depth 1 = single link, provides one token to follow last token of context
 * depth n = n links, provides one token to follow last n tokens of context
 * 
 * markov = new Markov(corpus, depth)
 * next = markov.nextFor(tokens, optionalDepth)
 * nextSeries = markov.nextSeriesFor(tokens, length) 
 * 
 * Chain:
 *  {
 *  index1: [index2, weight]
 *  index1-index2: [index3, weight]
 *  index1-index2-index3: [index4, weight]
 *  }
 * Vocab:
 *  index -> token: [token1, token2, token3]
 *  token -> index: { token1: [ index, weight ] }
 * 
 * 
 * 
 */


interface MarkovVocab {
  tokens: string[];
  tokenIndexesAndWeights: Map<string, number[]>;
}

// Map indexed state key (eg. "0-1-2") to next token index and weight (eg. 3 => 1)
type MarkovChain = Map<string, Map<number, number>>;

export default class MarkovCoil {
  depth: number;
  vocab: MarkovVocab = {
    tokens: [],
    tokenIndexesAndWeights: new Map<string, number[]>(),
  };
  chain: MarkovChain = new Map<string, Map<number, number>>();

  /**
   * Create new text suggestion Markovinator from seed text.
   * @param {string[]} corpus List of string tokens to generate chain with.
   * @param {number} depth Options for text suggestion.
   * @param options.includeSpecialChars Excludes non-alphanumeric characters not typical in English text.
   */
  constructor(corpus: string[], depth=3) {
    this.depth = depth
    this.generate(corpus);
  }

  getTokenIndex(token: string) {
    const indexAndWeight = this.vocab.tokenIndexesAndWeights.get(token)
    if (indexAndWeight) {
      return indexAndWeight[0]
    }
    return undefined
  }

  getTokenWeight(token: string) {
    const indexAndWeight = this.vocab.tokenIndexesAndWeights.get(token)
    if (indexAndWeight) {
      return indexAndWeight[1]
    }
    return 0
  }

  addTokenToVocab(token: string) {
    const index = this.getTokenIndex(token);
    const newIndexAndWeight = [index!, this.getTokenWeight(token) + 1]
    if (index === undefined) {
      this.vocab.tokens.push(token);
      newIndexAndWeight[0] = this.vocab.tokens.length - 1
    }
    this.vocab.tokenIndexesAndWeights.set(token, newIndexAndWeight);
  }

  getStateKey(tokens: string[]) {
    if (!tokens.length) return "";
    return tokens
      .map((token) => this.getTokenIndex(token))
      .join("-");
  }

  incrementWeightFor(stateKey: string, tokenIndex: number) {
    const indexAndWeight = this.chain.get(stateKey);
    if (!indexAndWeight) return;

    const currentWeight = indexAndWeight.get(tokenIndex) || 0
    indexAndWeight.set(tokenIndex, currentWeight + 1)
  }

  addToChain(state: string[]) {
    if (state.length === 1) {
      return
    }

    const prevState = state.slice(0, state.length - 1);
    const stateKey = this.getStateKey(prevState)
    const next = state[state.length - 1];
    const nextIndex = this.getTokenIndex(next)!;

    if (!(this.chain.has(stateKey))) {
      this.chain.set(stateKey, new Map<number, number>([[nextIndex, 0]]));
    }

    this.incrementWeightFor(stateKey, nextIndex)
    this.addToChain(prevState);
  }

  generate(tokens: string[]) {
    tokens.forEach(token => {
      this.addTokenToVocab(token);
    })

    for (let i = 0; i < tokens.length; i += 1) {
      const state = tokens.slice(i, i + this.depth + 1);
      this.addToChain(state)
    }
  }

  nextFor(context: string|string[], weighted: boolean = true) {
    if (context.length === 0) {
      return sample(this.vocab.tokens);
    }
  }

  nextSeriesFor(context: string|string[]) {

  }
}
