# Markov Coil
Markov Chain implementation in TypeScript, optimized for large bodies of text.

## Installation

```bash
npm install markov-coil
```

## Usage

TODO: update readme

```javascript
import SuggestionMachine from 'suggestion-machine';

// Start with an array to serve as the seed values. 
// In the below example we split a string into an array of words. 
const tokens = 'the greatest example text ever written by the greatest person.'.split(' ');

// Create a new tree
const machine = new SuggestionMachine(tokens);

// Returns either 'example' or 'person', randomly
machine.suggestFor(['the', 'greatest']);

// Returns ['example', 'person']
machine.getAllSuggestionsFor(['the', 'greatest']);

// Returns ['ever', 'written', 'by', 'the']
machine.suggestSequenceFor(['example', 'text'], 4);

// Returns 'written'
machine.suggestFor(['ever']);

// Serialize as JSON string
const stringified = machine.toJSONString();

// De-serialize
const deStringified = SuggestionMachine.parseJSON(stringified);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)