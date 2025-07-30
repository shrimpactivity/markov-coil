import MarkovCoil from "../src/MarkovCoil";
import { tokenize } from "../src/tokenize";

describe("Markov Coil", () => {
  describe("token vocabulary", () => {
    test("generates indexes correctly", () => {
      const markov = new MarkovCoil(tokenize("The quick brown fox and the quick Brown Dog"));
      const { indexes, tokens } = markov.vocab;
      expect(indexes.size).toBe(6);
      expect(indexes.get("the")).toBe(0);
      expect(indexes.get("and")).toBe(4);
      expect(tokens).toEqual(["the", "quick", "brown", "fox", "and", "dog"])
    });
  });

  describe("markov chain", () => {
    test("generates correctly", () => {
      const markov = new MarkovCoil(tokenize("the the the dog"), 0);
      expect(markov.root.children.size).toBe(2);
      expect(markov.root.children.get(0)!.children.size).toBe(0);
    })
  })

  describe("predictions", () => {
    describe("map to weights is correct", () => {
      test("for depth=0", () => {
        const markov = new MarkovCoil(tokenize("the the the dog"), 0);
        expect(markov.predictions([""])).toEqual({ "the": 0.75, "dog": 0.25 })
      })
  
      test("for depth=1", () => {
        const markov = new MarkovCoil("the dog the the the fox".split(" "), 1);
        expect(markov.predictions(["the"])).toEqual({ "the": 0.5, "dog": 0.25, "fox": 0.25 })
      });
  
      test("for depth=2", () => {
        const markov = new MarkovCoil("the dog and the dog friend".split(" "), 2);
        expect(markov.predictions(["the", "dog"])).toEqual({ "and": 0.5, "friend": 0.5 })
      });
    });

    describe("for single token", () => {
      test("are correct", () => {
        const markov = new MarkovCoil("the quick brown fox and the lazy dog".split(" "));
        expect(markov.predict(["brown"])).toEqual("fox");
        expect(markov.predict("quick brown fox and".split(" "))).toEqual("the");
      })
    })

    describe("for sequence", () => {
      test("are correct", () => {
        const markov = new MarkovCoil("the quick brown fox and the lazy dog".split(" "));
        expect(markov.predictSequence(["quick"], 1)).toEqual(["brown"]);
        expect(markov.predictSequence(["the", "quick"], 5)).toEqual("brown fox and the lazy".split(" "))
      })
    })
  });
});
