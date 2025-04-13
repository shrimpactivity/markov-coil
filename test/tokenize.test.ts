import { tokenize } from "../src/tokenize";

describe("tokenize", () => {
  it("works with simple text", () => {
    expect(tokenize("the quick fox")).toEqual(["the", "quick", "fox"]);
  });

  it("works with extra whitespace in text", () => {
    expect(tokenize("the    quick   fox      ")).toEqual(["the", "quick", "fox"]);
  });
});
