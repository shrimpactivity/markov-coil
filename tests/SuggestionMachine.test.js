const SuggestionMachine = require('..');

describe('Suggestion tree generates', () => {
    test('error for no tokens', () => {
        expect(() => new SuggestionMachine([])).toThrow(RangeError);
    });

    test('correct tree from single token', () => {
        const st = new SuggestionTree(['daisy']);
        expect(st.data).toStrictEqual({ daisy: {} });
    });

    test('correct tree from two tokens', () => {
        const st = new SuggestionTree([true, false]);
        expect(st.data).toStrictEqual(
            {
                true: {
                    false: {}
                },
                false: {}
            }
        );
    });

    test('correct tree from longer sequence', () => {
        const tokens = [0, 1, 2, 3, 4, 5];
        const st = new SuggestionTree(tokens);
        expect(st.data[0][1][2]).toStrictEqual({ 3: {} });
        expect(st.data[2][3]).toStrictEqual({
            4: {
                5: {}
            }
        });
        expect(st.data[5]).toStrictEqual({});
    });

    test('correct tree from sequence of same tokens', () => {
        const st = new SuggestionTree(['a', 'a', 'a', 'a', 'a']);
        expect(st.data).toStrictEqual(
            {
                a: { a: { a: { a: {} } } },
            }
        );
    });

    test('error for depth 0', () => {
        expect(() => new SuggestionTree([1, 2, 3], 0)).toThrow(RangeError);
    });

    test('correct tree with depth 1', () => {
        const st = new SuggestionTree([1, 2, 3], 1);
        expect(st.data).toStrictEqual({
            1: {},
            2: {},
            3: {}
        });
    });
});

describe('Suggestion tree suggests', () => {

    test('correctly for single token tree', () => {
        const st = new SuggestionTree([1]);
        const suggestion = st.getSuggestionFor([0, 1, 2]);
        expect(suggestion).toEqual("1");
    });

    test('correctly for more complex tree', () => {
        const tokens = 'this is an example of some more complex tokens and some more things to consider'.split(' ');
        const st = new SuggestionTree(tokens);
        expect(st.getSuggestionFor('this is an'.split(' '))).toBe('example');
        expect(st.getSuggestionFor(['more'])).toMatch(/complex|things/);
        expect(st.getSuggestionFor('some more'.split(' '))).toMatch(/complex|things/);
        expect(st.getSuggestionFor(['this'])).toBe('is');
    });
});

describe('Suggestion tree serializes', () => {

    test('to a string correctly', () => {
        const st = new SuggestionTree([1, 2, 3]);
        const stringified = st.toJSONString();
        expect(stringified).toBe(
            JSON.stringify({
                1: {
                    2: {
                        3: {}
                    }
                },
                2: {
                    3: {}
                },
                3: {}
            })
        )
    });

    test('to a string and then back to a tree correctly', () => {
        const st = new SuggestionTree([1, 2, 3]);
        const stringified = st.toJSONString();
        const stcopy = SuggestionTree.parseJSON(stringified);
        expect(stcopy.data).toStrictEqual({
            1: {
                2: {
                    3: {}
                }
            },
            2: {
                3: {}
            },
            3: {}
        });
    })
})