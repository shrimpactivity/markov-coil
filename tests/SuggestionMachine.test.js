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
    expect(s.occurrences).toStrictEqual({'daisy': [0]});
  });

  test("correctly from two tokens", () => {
    const s = new SuggestionMachine([true, false]);
    expect(s.values).toStrictEqual([true, false]);
    expect(s.occurrences).toStrictEqual({true: [0], false: [1]});
  });

  test("correctly from longer sequence", () => {
    const tokens = [0, 1, 2, 1, 0, 2];
    const s = new SuggestionMachine(tokens);
    expect(s.values).toStrictEqual([0, 1, 2, 1, 0, 2]);
    expect(s.occurrences).toStrictEqual({0: [0, 4], 1: [1, 3], 2: [2, 5]});
  });

  test("correctly from sequence of same tokens", () => {
    const tokens = 'a a a a a a'.split(' ');
    const s = new SuggestionMachine(tokens);
    expect(s.values).toStrictEqual('a a a a a a'.split(' '));
    expect(s.occurrences).toStrictEqual({"a": [0, 1, 2, 3, 4, 5]});
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
    const suggestion = s.suggestFor([0, 1, 2]);
    expect(suggestion).toEqual("1");
  });

  test("correctly for more complex machine", () => {
    const tokens =
      "this is an example of some more complex tokens and some more things to consider".split(
        " "
      );
    const s = new SuggestionMachine(tokens);
    expect(s.suggestFor("this is an".split(" "))).toBe("example");
    expect(s.suggestFor(["more"])).toMatch(/complex|things/);
    expect(s.suggestFor("some more".split(" "))).toMatch(
      /complex|things/
    );
    expect(s.suggestFor(["this"])).toBe("is");
  });
});

describe("Suggestion tree serializes", () => {
  test("to a string correctly", () => {
    const s = new SuggestionMachine([1, 2, 3]);
    const stringified = st.toJSONString();
    expect(stringified).toBe('["1","2","3"]');
  });
   

  test("to a string and then back to a tree correctly", () => {
    const st = new SuggestionTree([1, 2, 3]);
    const stringified = st.toJSONString();
    const stcopy = SuggestionTree.parseJSON(stringified);
    expect(stcopy.data).toStrictEqual({
      1: {
        2: {
          3: {},
        },
      },
      2: {
        3: {},
      },
      3: {},
    });
  });
});
