import MarkovNode from "./MarkovNode";
//import { sample } from "./util/random";

interface MarkovVocab {
  tokens: string[];
  indexes: Map<string, number>;
}

export default class MarkovCoil {
  depth: number;
  vocab: MarkovVocab = {
    tokens: [],
    indexes: new Map<string, number>(),
  };
  root: MarkovNode = new MarkovNode();

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

  getIndex(token: string) {
    return this.vocab.indexes.get(token)
  }

  getToken(index: number) {
    return this.vocab.tokens[index];
  }

  addTokenToVocab(token: string) {
    const index = this.getIndex(token);
    if (index === undefined) {
      this.vocab.tokens.push(token);
      this.vocab.indexes.set(token, this.vocab.tokens.length - 1)
    }
  }

  addSequenceToChain(sequence: string[]) {
    let current = this.root;
    sequence.forEach(token => {
      current.weight += 1; 
      const index = this.getIndex(token)!;
      if (current.children.get(index) === undefined) {
        current.children.set(index, new MarkovNode());
      }
      current = current.children.get(index)!;
    })
    current.weight += 1;
  }

  generate(tokens: string[]) {
    tokens.forEach(token => {
      this.addTokenToVocab(token);
    })

    for (let i = 0; i < tokens.length; i += 1) {
      const sequence = tokens.slice(i, i + this.depth + 1);
      this.addSequenceToChain(sequence)
    }
  }

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

  // nextFor(context: string|string[], weighted: boolean = true) {
  //   if (context.length === 0) {
  //     return sample(this.vocab.tokens);
  //   }
  // }

  // nextSeriesFor(context: string|string[]) {

  // }
}
