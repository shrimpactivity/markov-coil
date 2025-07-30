import { encode, decode } from "@msgpack/msgpack"

class MarkovNode {
  children = new Map<number, MarkovNode>();
  weight = 0;
}

interface MarkovVocab {
  tokens: string[];
  indexes: Map<string, number>;
}

export class MarkovCoil {
  depth: number;
  vocab: MarkovVocab = {
    tokens: [],
    indexes: new Map<string, number>(),
  };
  root: MarkovNode = new MarkovNode();

  /**
   * Create new markov chain for token prediction.
   * @param {string[]} tokens Tokens to generate chain with.
   * @param {number} [depth=3] Depth of the chain. A depth of n will use n tokens in its search for a prediction (n-gram).
   */
  constructor(tokens: string[], depth=3) {
    this.depth = depth
    this.createChain(tokens);
  }

  private getIndex(token: string) {
    return this.vocab.indexes.get(token)
  }

  private getToken(index: number) {
    return this.vocab.tokens[index];
  }

  private addTokenToVocab(token: string) {
    const index = this.getIndex(token);
    if (index === undefined) {
      this.vocab.tokens.push(token);
      this.vocab.indexes.set(token, this.vocab.tokens.length - 1)
    }
  }

  private addSequenceToChain(sequence: string[]) {
    let current = this.root;
    sequence.forEach(token => {
      current.weight += 1; 
      const index = this.getIndex(token)!;
      if (current.children.has(index) === false) {
        current.children.set(index, new MarkovNode());
      }
      current = current.children.get(index)!;
    })
    current.weight += 1;
  }

  private createChain(tokens: string[]) {
    tokens.forEach(token => {
      this.addTokenToVocab(token);
    })

    for (let i = 0; i < tokens.length; i += 1) {
      const sequence = tokens.slice(i, i + this.depth + 1);
      this.addSequenceToChain(sequence)
    }
  }

  /**
   * Predict next possible values for the given sequence of tokens.
   * @param {string[]} context An array of tokens.
   * @returns A mapping of possible tokens to their probability of occuring.
   */
  predictions(context: string[]): Record<string, number> {
    const indexes = context.slice(-1 * this.depth).map(token => this.getIndex(token));
    let current = this.root;

    indexes.forEach(index => {
      if (index === undefined || current.children.has(index) === false) {
        current = this.root;
        return;
      }
      current = current.children.get(index)!
    })

    const result: Record<string, number> = {};
    current.children.forEach((node, index) => {
      result[this.getToken(index)] = node.weight / current.weight;
    })
    return result;
  }


  private weightedChoice(predictions: Record<string, number>): string | null {
    const tokens = Object.keys(predictions);
    if (tokens.length === 0) return null;

    // Accumulate weights
    const weights = tokens.map(token => predictions[token]);
    for (let i = 1; i < weights.length; i += 1) {
      weights[i] += weights[i - 1];
    }

    const random = Math.random() * weights[weights.length - 1];
    // Could probably optimize this better with binary search, since weights are now ordered
    for (let i = 0; i < tokens.length; i += 1) {
      if (weights[i] > random) {
        return tokens[i];
      }
    }

    // Fallback (should not reach)
    return null;
  }
  
  /**
   * Predict the next token given a starting sequence.
   * @param {string[]} sequence The starting sequence of tokens.
   * @param {boolean} [weighted=true] If true, will use weighted random choice from all possible predictions. If false, will use random choice. 
   * @returns {string} The predicted token.
   */
  predict(sequence: string[], weighted=true): string | null {
    const predictions = this.predictions(sequence);
    const tokens = Object.keys(predictions);
    if (tokens.length === 0) return null;
    if (!weighted) return tokens[Math.floor(Math.random() * tokens.length)];
    
    return this.weightedChoice(predictions);
  }

  /**
   * Predicts a sequence of tokens that could follow the starting sequence.
   * @param {token[]} sequence The starting sequence of tokens.
   * @param {number} length The length of the predicted sequence.
   * @param {boolean} [weighted=true] If true, will use weighted random choice from all possible predictions. If false, will use random choice. 
   * @returns {string[]} A sequence of predicted tokens.
   */
  predictSequence(sequence: string[], length: number, weighted=true): string[] {
    if (length === 0) {
      return [];
    }
    const prediction = this.predict(sequence, weighted);
    if (prediction === null) {
      return this.predictSequence([], length - 1, weighted);
    }
    const nextSequence = sequence.slice(1).concat(prediction);
    return [prediction].concat(this.predictSequence(nextSequence, length - 1, weighted));
  }

  serialize() {
    return encode(this);
  }

  deserialize(encodedData: ArrayBufferLike | ArrayLike<number> | ArrayBufferView<ArrayBufferLike>): MarkovCoil {
    return decode(encodedData) as MarkovCoil;
  }


  /** Prints tabulated trie structure to console. Useful for debugging. */
  prettyPrint() {
    console.log(`Root (${this.root.weight})`);
    const prettyPrintHelper = (node: MarkovNode, spaces=2) => {
      node.children.forEach((child, index) => {
        let line = " ".repeat(spaces);
        line += this.getToken(index);
        line += ` (${child.weight})`;
        console.log(line);
        prettyPrintHelper(child, spaces + 2);
      })
    }
    prettyPrintHelper(this.root);
  }
}
