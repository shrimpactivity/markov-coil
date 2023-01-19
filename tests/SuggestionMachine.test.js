const SuggestionMachine = require("..");

describe("Suggestion machine generates", () => {
  test("empty for undefined values", () => {
    const s = new SuggestionMachine();
    expect(s.values).toHaveLength(0);
    expect(s.occurrences).toStrictEqual({});
  });

  test("empty for empty values", () => {
    const s = new SuggestionMachine([]);
    expect(s.values).toHaveLength(0);
    expect(s.occurrences).toStrictEqual({});
  });

  test("correctly from single value", () => {
    const s = new SuggestionMachine(["daisy"]);
    expect(s.values).toStrictEqual(["daisy"]);
    expect(s.occurrences).toStrictEqual({ daisy: [0] });
  });

  test("correctly from two tokens", () => {
    const s = new SuggestionMachine([true, false]);
    expect(s.values).toStrictEqual([true, false]);
    expect(s.occurrences).toStrictEqual({ true: [0], false: [1] });
  });

  test("correctly from longer sequence", () => {
    const tokens = [0, 1, 2, 1, 0, 2];
    const s = new SuggestionMachine(tokens);
    expect(s.values).toStrictEqual([0, 1, 2, 1, 0, 2]);
    expect(s.occurrences).toStrictEqual({ 0: [0, 4], 1: [1, 3], 2: [2, 5] });
  });

  test("correctly from sequence of same tokens", () => {
    const tokens = "a a a a a a".split(" ");
    const s = new SuggestionMachine(tokens);
    expect(s.values).toStrictEqual("a a a a a a".split(" "));
    expect(s.occurrences).toStrictEqual({ a: [0, 1, 2, 3, 4, 5] });
  });
});

describe("Suggestion machine suggests", () => {
  test("nothing for empty machine", () => {
    const s = new SuggestionMachine();
    const suggestion = s.suggestFor([0, 1, 2]);
    expect(suggestion).toBeNull();
  });

  test("correctly for single value machine", () => {
    const s = new SuggestionMachine([1]);
    expect(s.suggestFor([0, 1, 2])).toBe(1);
    expect(s.suggestFor([1])).toBe(1);
  });

  test("correctly for interrupted seed sequence", () => {
    const s = new SuggestionMachine([1, 2, 3, 4, 5]);
    const suggestion = s.suggestFor([2, 3, 4, 2]);
    expect(suggestion).toBe(3);
    const suggestion2 = s.suggestFor([2, 3, 4, 2]);
    expect(suggestion2).toBe(3);
    const suggestion3 = s.suggestFor([2, 3, 4, 2]);
    expect(suggestion3).toBe(3);
  });

  test("correctly for more complex machine", () => {
    const tokens =
      "this is an example of some more complex tokens and some more things to consider".split(
        " "
      );
    const s = new SuggestionMachine(tokens);
    expect(s.suggestFor("this is an".split(" "))).toBe("example");
    expect(s.suggestFor(["more"])).toMatch(/complex|things/);
    expect(s.suggestFor("some more".split(" "))).toMatch(/complex|things/);
    expect(s.suggestFor(["this"])).toBe("is");
  });
});

describe("Suggestion machine suggests sequence", () => {
  test("of nulls for empty machine", () => {
    const s = new SuggestionMachine();
    const suggestions = s.suggestSequenceFor([0, 1, 2], 20);
    expect(suggestions[0]).toBeNull();
    expect(suggestions).toHaveLength(20);
  });

  test("correctly for single value machine", () => {
    const s = new SuggestionMachine([1]);
    expect(s.suggestSequenceFor([0, 1, 2], 3, 1)).toStrictEqual([1, 1, 1]);
    expect(s.suggestSequenceFor([0, 1, 2], 3, 5)).toStrictEqual([1, 1, 1]);
    expect(s.suggestSequenceFor([0, 1, 2], 3, 2, true)).toStrictEqual([1, 1, 1]);
  });

  test("correctly for interrupted seed sequence", () => {
    const s = new SuggestionMachine([1, 2, 3, 4, 5]);
    const suggestions = s.suggestSequenceFor([2, 3, 4, 2], 3, 2);
    expect(suggestions).toStrictEqual([3, 4, 5]);
  });

  test("of all seed values correctly", () => {
    const s = new SuggestionMachine([1, 2, 3, 4, 5, 6, 7]);
    expect(s.suggestSequenceFor([1], 6)).toStrictEqual([2, 3, 4, 5, 6, 7]);
  })
});

describe("Suggestion tree serializes", () => {
  test("to a string correctly", () => {
    const s = new SuggestionMachine([1, 2, 3]);
    const stringified = s.toJSONString();
    expect(stringified).toBe("[1,2,3]");
  });

  test("to a string and then back to an object correctly", () => {
    const s = new SuggestionMachine([1, 2, 3]);
    const stringified = s.toJSONString();
    const copy = SuggestionMachine.parseJSON(stringified);
    expect(copy.values).toStrictEqual([1, 2, 3]);
  });
});
