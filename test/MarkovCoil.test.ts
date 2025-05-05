import MarkovCoil from "../src/MarkovCoil";
import { tokenize } from "../src/tokenize";

describe("Markov Coil", () => {
  describe("token vocabulary", () => {
    it("generates correctly", () => {
      const mc = new MarkovCoil(tokenize("The quick brown fox and the quick Brown Dog"));
      const { tokenIndex, tokens } = mc.vocab;
      expect(tokenIndex.size).toBe(6);
      expect(tokenIndex.get("the")).toBe(0);
      expect(tokenIndex.get("and")).toBe(4);
    });
  });

  /**
   * Depth 0, the key is the word and the value is the weight
   * Depth 1, "the" => ("quick" => 1)
   *
   */

  describe("markov chain", () => {
    it("generates correctly for depth=0", () => {
      const mc = new MarkovCoil(tokenize("the the the dog"), {depth: 0});
      const expectedChain = new Map([
        ["", new Map([
          [0, 2],
          [0, 1]
        ])],
      ])
    })

    it.only("generates correctly for depth=1", () => {
      const mc = new MarkovCoil("the the the dog".split(" "), { depth: 1 });
      const expectedChain = new Map([
        ["0", new Map([[0, 2]])],
        ["0", new Map([[1, 1]])],
        ["", new Map([
          [0, 2],
          [0, 1]
        ])]
      ]);
      expect(mc.chain).toEqual(expectedChain);
    });

    // it("generates correctly for depth=1", () => {
    //   const mc = new MarkovCoil("the quick fox and the dog".split(" "), { depth: 1 });
    //   const expectedChain = new Map([
    //     ["0", new Map([["1", 1], ["4", 1]])],
    //     ["1", new Map([["2", 1]])],
    //     ["2", new Map([["3", 1]])],
    //     ["3", new Map([["0", 1]])],
    //   ]);
    //   expect(mc.chain).toEqual(expectedChain)
    // })

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
