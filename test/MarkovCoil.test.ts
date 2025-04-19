import MarkovCoil from "../src/MarkovCoil";

describe("Markov Coil", () => {
  describe("tokenize", () => {
    const mc = new MarkovCoil("");

    it("works with simple text", () => {
      expect(mc.tokenize("the quick fox")).toEqual(["the", "quick", "fox"]);
    });

    it("works with extra whitespace in text", () => {
      expect(mc.tokenize("the    quick   fox      ")).toEqual([
        "the",
        "quick",
        "fox",
      ]);
    });

    it("works with capitalized variations", () => {
      expect(mc.tokenize("tHe Quick FoX")).toEqual(["the", "quick", "fox"]);
    });
  });

  describe("token vocabulary", () => {
    it("generates correctly", () => {
      const mc = new MarkovCoil("The quick brown fox and the quick Brown Dog");
      const { tokenToId, idToToken } = mc.vocab;
      expect(idToToken).toEqual(['the', 'quick', 'brown', 'fox', 'and', 'dog'])
      expect(tokenToId.size).toBe(6);
      expect(tokenToId.get("the")).toBe(0);
      expect(tokenToId.get("and")).toBe(4);
    });
  });

  describe("text suggestion", () => {
    const mc = new MarkovCoil("The quick brown fox and the quick Brown Dog");

    it("generates correct suggestions with depth=1", () => {
      expect(mc.nextFor("the")).toBe("quick");
      expect(mc.nextFor(["the", "dog", "and"])).toBe("the");
    });

    it("generates correct suggestion for depth=2", () => {
      expect(mc.nextFor("the quick")).toBe("brown");
      expect(mc.nextFor(["quick", "and"])).toBe("the");
      expect(mc.nextFor(["the"])).toBe("")
    })
  })
});
