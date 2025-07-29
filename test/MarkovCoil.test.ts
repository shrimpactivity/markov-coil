import MarkovCoil from "../src/MarkovCoil";
import { tokenize } from "../src/tokenize";

describe("Markov Coil", () => {
  describe("token vocabulary", () => {
    test("generates indexes correctly", () => {
      const markov = new MarkovCoil(tokenize("The quick brown fox and the quick Brown Dog"));
      const { tokenIndexesAndWeights, tokens } = markov.vocab;
      expect(tokenIndexesAndWeights.size).toBe(6);
      expect(tokenIndexesAndWeights.get("the")![0]).toBe(0);
      expect(tokenIndexesAndWeights.get("and")![0]).toBe(4);
      expect(tokens).toEqual(["the", "quick", "brown", "fox", "and", "dog"])
    });

    test("generates weights correctly", () => {
      const markov = new MarkovCoil(tokenize("The quick brown fox and the quick Brown Dog"));
      const { tokenIndexesAndWeights, tokens } = markov.vocab;
      expect(tokenIndexesAndWeights.get("the")![1]).toBe(2);
      expect(tokenIndexesAndWeights.get("and")![1]).toBe(1);
      expect(tokens).toEqual(["the", "quick", "brown", "fox", "and", "dog"])
    })
  });

  /**
   * Depth 0, the key is the word and the value is the weight
   * Depth 1, "the" => ("quick" => 1)
   *
   */

  describe("markov chain", () => {
    test("generates correctly for maxDepth of 0", () => {
      const markov = new MarkovCoil(tokenize("the the the dog"), 0);
      expect(markov.chain.size).toBe(0);
    })

    test("generates correctly for depth=1", () => {
      const markov = new MarkovCoil("the the dog the".split(" "), 1);
      expect(markov.chain.size).toBe(2)
    });

    it("generates correctly for depth=2", () => {});
  });

  describe("text suggestion", () => {
    const mc = new MarkovCoil(tokenize("The quick brown fox and the quick Brown Dog"));

    it("generates correct suggestions with depth=1", () => {
      expect(mc.nextFor(["the"])).toBe("quick");
      expect(mc.nextFor(["the", "dog", "and"])).toBe("the");
    });

    it("generates correct suggestion for depth=2", () => {
      expect(mc.nextFor(["the quick"])).toBe("brown");
      expect(mc.nextFor(["quick", "and"])).toBe("the");
      expect(mc.nextFor(["the"])).toBe("");
    });
  });
});
