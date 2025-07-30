import { tokenize } from "./utils/tokenize";

describe("tokenize", () => {
  it("works with simple text", () => {
    expect(tokenize("the quick fox")).toEqual(["the", "quick", "fox"]);
  });

  it("works with extra whitespace in text", () => {
    expect(tokenize("the    quick   fox      ")).toEqual([
      "the",
      "quick",
      "fox",
    ]);
  });

  it("works with capitalized variations", () => {
    expect(tokenize("tHe Quick FoX")).toEqual(["the", "quick", "fox"]);
  });
});
